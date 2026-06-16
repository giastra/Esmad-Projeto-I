API REST — Documentação
 
API REST construída com **Node.js**, **Express** e **MongoDB** (Mongoose). Inclui autenticação JWT, controlo de roles, validação de dados e upload de ficheiros.
 
---
 
## Tecnologias
 
| Pacote | Versão |
|---|---|
| express | ^5.2.1 |
| mongoose | ^9.3.0 |
| jsonwebtoken | ^9.0.3 |
| bcryptjs | ^3.0.3 |
| express-validator | ^7.3.2 |
| multer | ^2.1.1 |
| cors | ^2.8.6 |
| dotenv | ^17.3.1 |
 
---
 
##  Instalação e Configuração
 
```bash
npm install
```
 
Cria um ficheiro `.env` na raiz do projeto com as seguintes variáveis:
 
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=o_teu_segredo
JWT_EXPIRES_IN=7d
PORT=5000
```
 
Para iniciar o servidor:
 
```bash
node index.js
```
 
O servidor fica disponível em `http://localhost:5000`.
 
> Os ficheiros de imagem (props) são servidos estaticamente em `/uploads/props/<filename>`.
 
---
 
## Autenticação
 
A autenticação é feita via **Bearer Token** no header `Authorization`.
 
```
Authorization: Bearer <token>
```
 
Os tokens são invalidados no logout através de uma blacklist em base de dados, com limpeza automática via TTL index do MongoDB.
 
### Middlewares
 
| Middleware | Descrição |
|---|---|
| `protect` | Verifica e valida o JWT; injeta `req.user` e `req.token` |
| `isAdmin` | Verifica se o utilizador tem a role `admin` |
 
---
## 🗄️ Modelos
 
### User
| Campo | Tipo | Notas |
|---|---|---|
| `email` | String | Único, lowercase |
| `password` | String | Hash bcrypt |
| `name` | String | — |
| `roles` | [String] | `user` \| `admin` (default: `['user']`) |
| `activePomodoro` | ObjectId → Pomodoro | Setup ativo (pode ser null) |
 
### Color
| Campo | Tipo | Notas |
|---|---|---|
| `name` | String | — |
| `hex` | String | Formato `#RRGGBB` |
 
### Diary
| Campo | Tipo | Notas |
|---|---|---|
| `title` | String | — |
| `note` | String | — |
| `eventDate` | Date | Normalizada para UTC 00:00 |
| `user` | ObjectId → User | — |
 
> Index único: `(user, eventDate)` — apenas uma entrada por dia por utilizador.
 
### Game
| Campo | Tipo | Notas |
|---|---|---|
| `x` | Number | Coordenada X |
| `y` | Number | Coordenada Y |
| `user` | ObjectId → User | — |
 
> Index único: `(user, x, y)` — posição única por utilizador.
 
### Pomodoro
| Campo | Tipo | Default | Notas |
|---|---|---|---|
| `name` | String | `Classic Pomodoro` | — |
| `focusTime` | Number | `25` | Em minutos, mín. 1 |
| `shortBreak` | Number | `5` | Em minutos, mín. 1 |
| `longBreak` | Number | `15` | Em minutos, mín. 1 |
| `cycles` | Number | `4` | Mín. 1 |
| `user` | ObjectId → User | — | — |
| `isDefault` | Boolean | `false` | Setup público global |
 
### Prop
| Campo | Tipo | Notas |
|---|---|---|
| `name` | String | — |
| `img` | String | Nome do ficheiro em `uploads/props/` |
 
### TaskCategory
| Campo | Tipo | Notas |
|---|---|---|
| `name` | String | — |
| `user` | ObjectId → User | — |
| `color` | ObjectId → Color | — |
 
### Task
| Campo | Tipo | Valores | Default |
|---|---|---|---|
| `name` | String | — | — |
| `description` | String | — | `''` |
| `startDate` | Date | — | — |
| `endDate` | Date | — | Opcional |
| `status` | String | `por_fazer` \| `concluida` | `por_fazer` |
| `priority` | String | `alta` \| `normal` \| `baixa` | `normal` |
| `user` | ObjectId → User | — | — |
| `category` | ObjectId → TaskCategory | — | — |
 
### TokenBlacklist
| Campo | Tipo | Notas |
|---|---|---|
| `token` | String | JWT inválido após logout |
| `expiresAt` | Date | TTL index — apagado automaticamente pelo MongoDB quando expira |
 
---
## Endpoints
 
### Utilizadores — `/api/users`
 
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/users/register` | ❌ | Registo de novo utilizador |
| POST | `/api/users/login` | ❌ | Login, devolve JWT |
| POST | `/api/users/logout` | ✅ | Invalida o token atual |
| GET | `/api/users/me` | ✅ | Perfil do utilizador autenticado |
| PUT | `/api/users/me` | ✅ | Atualiza dados pessoais |
| PUT | `/api/users/me/email` | ✅ | Atualiza email (requer password) |
| PUT | `/api/users/me/password` | ✅ | Altera password |
| DELETE | `/api/users/me` | ✅ | Elimina a própria conta |
| GET | `/api/users` | Admin | Lista todos os utilizadores |
| GET | `/api/users/:id` |  Admin | Detalhes de um utilizador |
| PUT | `/api/users/:id/roles` | Admin | Altera roles de um utilizador |
 
---
 
### Cores — `/api/colors`
 
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/colors` | ✅ | Lista todas as cores |
| GET | `/api/colors/:id` | ✅ | Detalhes de uma cor |
| POST | `/api/colors` | 🔒 Admin | Cria uma nova cor |
| PUT | `/api/colors/:id` | 🔒 Admin | Atualiza uma cor |
| DELETE | `/api/colors/:id` | 🔒 Admin | Elimina uma cor |
 
Validações: `name` (2–50 chars), `hex` no formato `#RRGGBB`.
 
---
 
### Diário — `/api/diary`
 
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/diary` | ✅ | Lista as entradas do utilizador |
| GET | `/api/diary/:id` | ✅ | Detalhes de uma entrada |
| POST | `/api/diary` | ✅ | Cria uma nova entrada |
| PUT | `/api/diary/:id` | ✅ | Atualiza uma entrada |
| DELETE | `/api/diary/:id` | ✅ | Elimina uma entrada |
 
Campos: `title`, `note`, `eventDate`. Apenas uma entrada por data por utilizador.
 
---
 
### 🎮 Jogo — `/api/game`
 
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/game` | ✅ | Lista as posições do utilizador |
| GET | `/api/game/:id` | ✅ | Detalhes de uma posição |
| POST | `/api/game` | ✅ | Cria uma nova posição |
| PUT | `/api/game/:id` | ✅ | Atualiza uma posição |
| DELETE | `/api/game/:id` | ✅ | Elimina uma posição |
 
Campos: `x`, `y`. Posições únicas por utilizador.
 
---
 
### ⏱️ Pomodoro — `/api/pomodoro`
 
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/pomodoro/default` | ❌ | Configuração default (pública) |
| GET | `/api/pomodoro` | ✅ | Lista setups do utilizador + default + ativo |
| POST | `/api/pomodoro` | ✅ | Cria um novo setup |
| PUT | `/api/pomodoro/:id` | ✅ | Atualiza um setup próprio |
| DELETE | `/api/pomodoro/:id` | ✅ | Elimina um setup próprio |
| PUT | `/api/pomodoro/:id/ativar` | ✅ | Define o setup ativo |
| PUT | `/api/pomodoro/admin/default` | 🔒 Admin | Atualiza a configuração default |
 
Campos: `name`, `focusTime`, `shortBreak`, `longBreak`, `cycles` (todos em minutos, exceto `cycles`).
 
---
 
### Props — `/api/props`
 
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/props` | ✅ | Lista todos os objetos |
| GET | `/api/props/:id` | ✅ | Detalhes de um objeto |
| POST | `/api/props` | 🔒 Admin | Cria um objeto (com imagem) |
| PUT | `/api/props/:id` | 🔒 Admin | Atualiza um objeto |
| DELETE | `/api/props/:id` | 🔒 Admin | Elimina um objeto e a sua imagem |
 
Upload via `multipart/form-data`, campo `img`. Formatos aceites: `JPEG`, `PNG`, `WEBP`, `SVG`.
Imagens servidas em `/uploads/props/<filename>`.
 
---
 
### Categorias de Tarefas — `/api/task-categories`
 
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/task-categories` | ✅ | Lista as categorias do utilizador |
| GET | `/api/task-categories/:id` | ✅ | Detalhes de uma categoria |
| POST | `/api/task-categories` | ✅ | Cria uma nova categoria |
| PUT | `/api/task-categories/:id` | ✅ | Atualiza uma categoria |
| DELETE | `/api/task-categories/:id` | ✅ | Elimina uma categoria |
 
Campos: `name`, `color` (ID de uma cor).
 
---
 
### Tarefas — `/api/tasks`
 
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/tasks` | ✅ | Lista as tarefas do utilizador |
| GET | `/api/tasks/:id` | ✅ | Detalhes de uma tarefa |
| POST | `/api/tasks` | ✅ | Cria uma nova tarefa |
| PUT | `/api/tasks/:id` | ✅ | Atualiza uma tarefa |
| DELETE | `/api/tasks/:id` | ✅ | Elimina uma tarefa |
 
Campos: `name`, `description`, `startDate`, `endDate`, `status`, `priority`, `category`.
 
Filtros disponíveis via query string: `?category=<id>`, `?status=<valor>`, `?priority=<valor>`.
 
---
## Estrutura do Projeto
 
```
├── Controllers/
│   ├── UserController.js
│   ├── ColorController.js
│   ├── DiaryController.js
│   ├── GameController.js
│   ├── PomodoroController.js
│   ├── PropController.js
│   ├── TaskCategoryController.js
│   └── TaskController.js
├── Models/
│   ├── UserModel.js
│   ├── ColorModel.js
│   ├── DiaryModel.js
│   ├── GameModel.js
│   ├── PomodoroModel.js
│   ├── PropModel.js
│   ├── TaskCategoryModel.js
│   ├── TasksModel.js
│   └── TokenBlacklistModel.js
├── Routes/
│   ├── UserRoutes.js
│   ├── ColorRoutes.js
│   ├── DiaryRoutes.js
│   ├── GameRoutes.js
│   ├── PomodoroRoutes.js
│   ├── PropRoutes.js
│   ├── TaskCategoryRoutes.js
│   └── TaskRoutes.js
├── Middlewares/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│   ├── colorValidation.js
│   └── userValidation.js
├── utils/
│   └── dateUtils.js
├── uploads/
│   └── props/
├── index.js
├── db.js
├── package.json
└── .env
```
 
---
 
## Notas
 
- Todos os endpoints protegidos requerem o header `Authorization: Bearer <token>`.
- Os recursos pertencem sempre ao utilizador autenticado — não é possível aceder a dados de outros utilizadores.
- Os endpoints de admin requerem a role `admin` para além de autenticação.
- Os tokens inválidos (logout) são guardados na `TokenBlacklist` e eliminados automaticamente pelo TTL index do MongoDB quando expiram.
- O tratamento de erros global (incluindo erros do Multer) está centralizado no `index.js`.
 