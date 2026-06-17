# Extensão de Browser - Stad To Do

## 1. O que é, afinal, uma extensão de browser

Uma extensão é uma **mini aplicação web empacotada**: HTML, CSS e JS, mais um ficheiro de
configuração (`manifest.json`). Sem bundlers, sem frameworks, sem build. 

1. Em vez de `index.html`, o ponto de entrada é o `manifest.json`.
2. A UI principal é um **side panel**: um painel lateral que abre ao clicar no ícone e **fica sempre
   visível** enquanto se navega.
3. Tem acesso a APIs do browser (`chrome.*`) que uma página normal não tem: armazenamento próprio,
   alarmes, notificações, badge no ícone, etc.

---

## 2. Estrutura de ficheiros

```
extension/
├── manifest.json     ← configuração (obrigatório)
├── popup.html        ← a UI do popup
├── popup.css         ← estilos do popup
├── js/
| ├── model.js          ← MODEL: entidade Task, fetch, storage (sem DOM)
| ├── view.js           ← VIEW: DOM e registo de listeners (sem fetch)
| ├── controller.js     ← CONTROLLER: coordena Model e View (ponto de entrada do popup)
| └──  background.js     ← service worker: badge, notificações, fim do pomodoro
└── icons/
    ├── icon16.png
    ├── icon48.png
    ├── icon128.png
    └── Logo.png
```

Mínimo absoluto para funcionar: `manifest.json` + `popup.html` + um script de lógica. Note-se que o `model.js` é **partilhado** entre o popup e o `background.js`..

---

## 3. O `manifest.json` campo a campo

```json
{
  "manifest_version": 3,
  "name": "Stad To Do",
  "version": "1.0.0",
  "description": "Ve e conclui as tuas tarefas sem abrir o site.",
  "side_panel": {
    "default_path": "popup.html"
  },
  "action": {
    "default_icon": { "16": "...", "48": "...", "128": "..." }
  },
  "permissions": ["storage", "alarms", "notifications", "sidePanel"],
  "host_permissions": ["http://localhost:5000/*"],
  "background": { "service_worker": "background.js", "type": "module" }
}
```

> `"type": "module"` no `background` é o que permite ao `background.js` fazer `import`
> do `model.js`. O `popup.html` carrega o controller da mesma forma:
> `<script type="module" src="controller.js">`.

| Campo | Para que serve |
|---|---|
| `manifest_version: 3` | Diz ao browser que é MV3. Obrigatório. |
| `side_panel.default_path` | O HTML do painel lateral que abre ao clicar no ícone. |
| `action` | Ícone e título na barra; o clique passa a abrir o side panel (ver `background.js`). |
| `permissions` | APIs do browser que a extensão pode usar. |
| `host_permissions` | **Os URLs externos a que pode fazer fetch.** Resolve o CORS (ver secção 6). |
| `background.service_worker` | Script que corre em segundo plano. |

Notas sobre as permissões usadas:
- `storage` permite usar `chrome.storage.local` (o nosso "localStorage" dentro da extensão).
- `alarms` permite agendar eventos (verificar tarefas, e o fim do Pomodoro).
- `notifications` permite mostrar notificações do sistema.
- `sidePanel` permite usar o painel lateral (`chrome.sidePanel`) que mantém a UI sempre visível.

Se não quiserem notificações, removam `alarms` e `notifications`. O `background` convém manter: é onde
se ativa o "abrir o painel ao clicar no ícone".

---

## 4. O fluxo e o MVC dentro da UI

A UI (o side panel) aplica **MVC completo em três ficheiros** (`model.js`, `view.js`, `controller.js`), ligados por módulos ES (`import`/`export`). A regra que importa:

> O DOM não sabe de onde vêm os dados; os dados não sabem que existe um DOM.

**Porque três ficheiros e não tudo num só?** Porque o `background.js` (service worker, sem DOM) também precisa de fazer `fetch` à API. Se a lógica de dados vivesse misturada com o DOM, o service worker não a podia reutilizar. Ao isolar o `model.js`, **a UI e o service worker importam a mesma camada de dados** sem duplicar nada.

```
[ utilizador clica check ]
          │
          ▼
   VIEW (regista o listener) ──► chama o callback do...
          │
          ▼
   CONTROLLER (decide a lógica)
          │  pede ao...
          ▼
   MODEL (fetch à API: PUT /api/tasks/:id)
          │  devolve dados
          ▼
   CONTROLLER ──► pede à VIEW para atualizar a linha no DOM
```

| Camada | Ficheiro | O que tem | Regra |
|---|---|---|---|
| **MODEL** | `model.js` | entidade `Task`, `login`, `fetchTasks`, `setTaskStatus`, `getPomo`... | só dados, fetch e storage, nunca toca no DOM |
| **VIEW** | `view.js` | `renderTasks`, `renderPomo`, `showLogin`, os `bind*` | só DOM e registo de listeners, nunca faz fetch |
| **CONTROLLER** | `controller.js` | `init`, `loadTasks`, `applyFilter`, os callbacks | liga os eventos da View ao Model e decide a lógica |

Dois detalhes de arquitetura para defender:

- **Registar listeners é da View, callbacks são do Controller.** A View expõe um `bind*` por ação
  (`bindLogin`, `bindTaskToggle`...). O Controller passa a função com a lógica. Assim o Controller
  **nunca faz `addEventListener` nem toca no DOM** - só coordena.
- **Filtrar e ordenar é lógica, vive no CONTROLLER** (`applyFilter`), não na View. Mas o *como* de
  cada regra de domínio (uma tarefa "vence hoje"? "está concluída"?) vive na **entidade `Task`**
  (`isDueToday()`, `isDone`). O Controller decide *qual* regra aplicar; a `Task` sabe *como* a
  responder. A View só recebe a lista já tratada e desenha.

**A entidade `Task`.** O `model.js` define uma classe `Task` com:
- campo privado `#id` (o `_id` do servidor) exposto só por getter - não se altera de fora;
- getters de comportamento: `isDone`, `isPending`, `categoryName`, `priorityRank`;
- métodos de domínio: `isDueToday()`, `isDueThisWeek()`;
- `static fromObject(o)` que converte o JSON cru da API em instância **preservando o `_id`**.

`fetchTasks` devolve `json.data.map(Task.fromObject)`, por isso popup e service worker trabalham
sempre com instâncias - com comportamento - em vez de objetos crus.

**Reaproveitamento:** a extensão **usa a API tal como está**. Não há endpoints novos. 

---

## 5. Funcionalidades implementadas

### 5.1. Filtros (Todas, Prioridade, Hoje, Esta Semana)

Quatro filtros, todos resolvidos **no cliente** sobre a lista que já foi buscada (`allTasks`):

| Filtro | O que faz | Como |
|---|---|---|
| **Todas** | mostra tudo (default) | sem filtro |
| **Prioridade** | ordena alta > normal > baixa | `sort` com um mapa de ordem |
| **Hoje** | só tarefas com prazo hoje | compara `endDate` com a data de hoje |
| **Esta Semana** | tarefas com prazo na semana atual | calcula segunda..domingo |

Porque no cliente e não na API? A API até aceita `?status=`, `?priority=` e `?category=`, mas **não
tem filtro por data**. Como já temos as tarefas todas em memória, filtrar no `applyFilter` é simples
e instantâneo. Alternativa válida: empurrar os filtros de estado/prioridade para a API por query
string. As duas abordagens são corretas; aqui escolheu-se a mais simples.

### 5.2. Cores de prioridade

Cada tarefa tem um ponto colorido, mapeado ao campo `priority` do `TasksModel`:

- 🔴 **alta** → vermelho
- 🟡 **normal** → amarelo
- 🟢 **baixa** → verde

É só CSS (`.dot.alta`, `.dot.normal`, `.dot.baixa`). Sinal visual rápido, alinhado com o objetivo de
clareza para público com PHDA.

### 5.3. Fixar tarefas (pin)

O pin **vive só na extensão** (`chrome.storage.local`, chave `pinnedIds`), **não no servidor**. As
tarefas fixadas sobem ao topo em qualquer filtro.

Porquê local e não na API? Duas razões:
- O `TasksModel` do grupo **não tem campo `pinned`**, e neste exemplo não quis alterar o backend.
- O pin é uma **conveniência da extensão** (acesso rápido), não um dado de negócio. Faz sentido ser local.


### 5.4. Pomodoro (e porque obriga a usar o service worker)

O temporizador tem um problema interessante: a **UI nem sempre está aberta** (mesmo o side panel pode ser fechado, e a notificação tem de tocar com tudo fechado). Se o contador vivesse só na UI, perdia-se ao fechar. Solução:

1. O **estado** do Pomodoro vive no `chrome.storage.local` (`{ running, endsAt, remaining, duration }`).
2. Guarda-se o **instante em que termina** (`endsAt`), não os segundos a contar. O tempo restante é
   **calculado** (`endsAt - agora`), por isso é exato mesmo que o popup tenha estado fechado.
3. O `background.js` cria um **alarme** (`chrome.alarms`) para o fim. Quando dispara, mostra a
   notificação **mesmo com a UI fechada**.
4. A UI, quando aberta, só **lê e desenha** o estado, e atualiza o display de meio em meio segundo.

Este é um bom exemplo de **porque existe o service worker**: lógica que tem de sobreviver ao
fecho da UI.

A duração de foco está em `POMO_DURATION`. Por defeito o pomodoro a ser lido é o padrão, por via do via `GET /api/pomodoro`, para melhorias futuras seria moststar todas as configurações de pomodoro que o utilizador tem.

### 5.5. Sempre visível: side panel em vez de popup

O popup clássico **fecha-se assim que clicas fora**. Para a UI ficar *sempre ali* enquanto se navega,
usa-se a **Side Panel API** (`chrome.sidePanel`): um painel encostado ao lado da janela que persiste
entre páginas e não desaparece ao perder o foco.

### 5.6. Badge, notificações e atualização imediata

- **Badge:** o número de tarefas por fazer aparece sobre o ícone (`chrome.action.setBadgeText`). A cor
  de fundo é fixa (`setBadgeBackgroundColor`, azul). Texto vazio (`''`) esconde o badge.
- **Notificação "vence hoje":** o `background.js` avisa uma vez por dia se houver tarefas com prazo
  hoje (guarda `lastNotified` para não repetir). Reusa `Task.isDueToday()` - a mesma regra dos filtros.
- **Clicar na notificação** traz a janela do Chrome para a frente. Não abre o painel diretamente:
  `sidePanel.open()` só é permitido em resposta a um gesto no browser, não a partir de uma notificação
  do sistema (limitação de segurança do Chrome).
- **Atualização imediata do badge:** o badge depende de um alarme periódico (mínimo ~1 min). Para não
  esperar, ao marcar uma tarefa o popup envia `chrome.runtime.sendMessage({ type: 'TASK_UPDATED' })` e
  o `background.js` faz `refresh()` na hora. O alarme passa a ser só a rede de segurança.

---

## 6. Caveats

### 6.1. `chrome.storage.local` em vez de `localStorage`

A extensão **não tem `localStorage` partilhado com o site**. Usa-se `chrome.storage.local`, com duas
diferenças face ao `localStorage` normal:

| `localStorage` | `chrome.storage.local` |
|---|---|
| síncrono (`getItem` devolve logo) | **assíncrono** (devolve promessa, precisa de `await`) |
| partilhado por origem do site | isolado, só a extensão lê |
| guarda strings (precisa de `JSON.stringify`) | guarda objetos diretamente |

```js
// guardar
await chrome.storage.local.set({ token, user })
// ler
const { token } = await chrome.storage.local.get('token')
```

### 6.2. A extensão NÃO consegue ler o token do site (e porquê)

Pergunta natural: "se o utilizador já fez login no site, a extensão não pode usar esse token?"

**Não diretamente.** A extensão corre na origem `chrome-extension://<id>`, não na origem do site. O `localStorage` é isolado por origem, por isso o `localStorage` do site é invisível para a extensão.

Há duas saídas:
- **(simples, usada aqui)** a extensão faz o seu próprio login e guarda o seu próprio token. Para o
  âmbito do projeto chega e sobra.
- **(avançada)** injetar um *content script* na página do site, que **esse sim** lê o `localStorage` do site e envia o token à extensão por mensagem. Mais complexo, fica como melhoria opcional.

### 6.3. CORS - o erro que vai aparecer na consola

Quando a extensão faz `fetch` para `localhost:5000`, o browser aplica CORS. **O backend neste momento não tem CORS configurado** (não há `app.use(cors())` no `API/index.js`). Há dois
caminhos:

- **Caminho A (recomendado, sem mexer no backend):** declarar o host em `host_permissions` no
  manifest. Em MV3, os pedidos da extensão para hosts declarados **não são bloqueados por CORS**. É
  o que este exemplo faz: `"host_permissions": ["http://localhost:5000/*"]`.

- **Caminho B (mexer no backend):** instalar e ativar o `cors` no Express. Útil de qualquer forma,
  porque o **site** (a correr noutra porta) também vai precisar:

  ```bash
  npm install cors
  ```
  ```js
  // API/index.js
  const cors = require('cors')
  app.use(cors()) // ou com lista de origens permitidas
  ```

Para a extensão, o Caminho A basta. Para o site, vão precisar do Caminho B.

### 6.4. O service worker dorme

Em MV3 o `background.js` **não está sempre a correr**. Dorme e acorda por eventos (instalação,
arranque do browser, alarme). Por isso não se guarda estado em variáveis globais do service worker:
guarda-se no `chrome.storage` (foi exatamente isto que se fez com o Pomodoro). E os
alarmes têm um mínimo de cerca de 1 minuto.

### 6.5. Notificações bloqueadas pelo sistema operativo

A extensão tem permissão `notifications`, mas o sistema operativo pode suprimir tudo na mesma. Se as notificações não aparecerem (nem o Pomodoro, que não depende de API nem de dados), verificar:

- **Windows:** Definições > Sistema > Notificações → Chrome ativado e configurado como "Banner"; desativar **Focus Assist / Não Incomodar**.

Para confirmar que `chrome.notifications` funciona, abrir o inspector do service worker (`chrome://extensions` → link "service worker") e correr:
```js
chrome.notifications.create('t', { type: 'basic', iconUrl: chrome.runtime.getURL('icons/icon128.png'), title: 'teste', message: 'aparece?' })
```
Se não aparecer nada, o problema é no sistema, não no código.

---

### 6.6. URL fixo e HTTP

O exemplo tem `http://localhost:5000` escrito no código. Funciona em desenvolvimento. Em produção
seria HTTPS e um domínio real, idealmente numa constante única ou num ficheiro de configuração.

---

## 7. Instalar e testar (passo a passo)

1. Garantir que a **API está a correr** (`node index.js` na pasta `API/`, MongoDB ligado).
2. (Opcional) correr `node seed.js` para ter tarefas de teste.
3. Abrir o Chrome/Edge em `chrome://extensions/`.
4. Ativar o **"Developer mode"** (canto superior direito).
5. Clicar **"Load unpacked"** e escolher a pasta `extension/`.
6. O ícone aparece na barra. Clicar abre o **painel lateral** à direita, que fica sempre visível.
7. Entrar com um utilizador que já exista na base de dados. As tarefas aparecem.

Depois de mudar o código: voltar a `chrome://extensions/` e clicar no ícone de **recarregar** da extensão. Para ver erros: botão direito **dentro do painel** > "Inspecionar", ou o link "service worker" na página das extensões (para o `background.js`).

