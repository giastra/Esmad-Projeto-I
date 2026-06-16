import { getToken, fetchTasks, getPomo, savePomo, POMO_DURATION } from './model.js'

// quando a extensao e instalada, criamos um alarme periodico.
// o service worker dorme e so acorda quando o alarme dispara.
chrome.runtime.onInstalled.addListener(() => {
  // clicar no icone da extensao abre o side panel em vez de um popup
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  chrome.alarms.create('check-tasks', { periodInMinutes: 1 })
  refresh()
})

// tambem corre quando o browser arranca
chrome.runtime.onStartup.addListener(refresh)

// o popup envia esta mensagem sempre que o estado de uma task muda.
// assim o badge atualiza imediatamente, sem esperar o alarme de 1 minuto.
chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === 'TASK_UPDATED') refresh()
})

// clicar numa notificacao do sistema traz o Chrome para primeiro plano.
// sidePanel.open() nao e permitido fora de um gesto direto no browser
// (limitacao de seguranca do Chrome) - o utilizador clica no icone para abrir.
chrome.notifications.onClicked.addListener(async () => {
  const win = await chrome.windows.getLastFocused()
  chrome.windows.update(win.id, { focused: true })
})

// dispara sempre que um alarme toca
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'check-tasks') refresh()
  if (alarm.name === 'pomodoro') finishPomodoro()
})

// chamado quando o tempo de foco do pomodoro termina.
// repoe o estado e notifica, mesmo que o popup esteja fechado.
async function finishPomodoro() {
  const pomo = await getPomo()
  const duration = pomo?.duration || POMO_DURATION

  await savePomo({ running: false, endsAt: null, remaining: duration, duration })

  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title: 'Pomodoro terminado',
    message: 'Boa! Faz uma pausa curta.'
  })
}

// le o token guardado pelo popup e atualiza badge + notificacoes
async function refresh() {
  const token = await getToken()

  if (!token) {
    chrome.action.setBadgeText({ text: '' })
    return
  }

  try {
    const tasks = await fetchTasks(token)
    updateBadge(tasks)
    notifyDueToday(tasks)
  } catch (err) {
    // sem rede, API em baixo, ou sessao expirada: nao ha UI a ver, nada urgente.
    // deixamos o badge como esta. Avisamos na consola para nao parecer erro esquecido.
    console.warn('[background] refresh falhou, mantendo o badge atual:', err)
  }
}

function updateBadge(tasks) {
  // tasks sao instancias de Task: reutilizamos o getter isPending da entidade
  const pending = tasks.filter(t => t.isPending).length
  chrome.action.setBadgeBackgroundColor({ color: '#3a7ca5' })
  chrome.action.setBadgeText({ text: pending ? String(pending) : '' })
}

async function notifyDueToday(tasks) {
  const today = new Date().toDateString()

  const { lastNotified } = await chrome.storage.local.get('lastNotified')
  if (lastNotified === today) return

  // mesma logica de "vence hoje" usada nos filtros do popup, agora reaproveitada
  // da entidade (Task.isDueToday) em vez de reescrita aqui
  const dueToday = tasks.filter(t => t.isPending && t.isDueToday())

  if (dueToday.length === 0) return

  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title: 'Stad to Do',
    message: `Tens ${dueToday.length} tarefa(s) para terminar hoje.`
  })

  await chrome.storage.local.set({ lastNotified: today })
}
