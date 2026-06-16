import {
  getToken, getUser, clearSession,
  login, logout,
  fetchTasks, setTaskStatus,
  getPinnedIds, savePinnedIds,
  getPomo, startPomo, pausePomo, resetPomo, pomoRemaining
} from './model.js'

import {
  showLogin, showTasks, showGreeting,
  showLoginError, showTasksError,
  renderTasks, renderPomo, setActiveFilter, markTaskDone,
  getLoginInput, clearLoginInput,
  bindLogin, bindLogout, bindFilters, bindTaskToggle, bindTaskPin, bindPomo
} from './view.js'

// estado em memoria (vive so enquanto o popup esta aberto)

let allTasks = []
let pinnedIds = []
let currentFilter = 'todas'
let currentPomo = null
let pomoTimer = null

// aplica o filtro atual sobre a cache e desenha.
// filtrar e ordenar e LOGICA, fica no controller; a API so devolve as
// tarefas em bruto. O COMO de "vence hoje" ou "esta semana" vive na
// entidade Task (isDueToday/isDueThisWeek); aqui so se decide qual usar.
function applyFilter() {
  let list = [...allTasks]

  if (currentFilter === 'hoje') {
    list = list.filter(t => t.isDueToday())
  } 
  
  else if (currentFilter === 'semana') {
    list = list.filter(t => t.isDueThisWeek())
  } 
  
  else if (currentFilter === 'prioridade') {
    list.sort((a, b) => a.priorityRank - b.priorityRank)
  }

  // fixadas sempre primeiro (sort do JS e estavel, mantem a ordem
  // anterior dentro de cada grupo)
  list.sort((a, b) => {
    const ap = pinnedIds.includes(a.id) ? 0 : 1
    const bp = pinnedIds.includes(b.id) ? 0 : 1
    return ap - bp
  })

  renderTasks(list, pinnedIds)
}

// arranque e carregamento

async function init() {
  const token = await getToken()
  if (!token) {
    showLogin()
    return
  }
  await loadTasks(token)
}

async function loadTasks(token) {
  try {
    showGreeting(await getUser())
    pinnedIds = await getPinnedIds()
    allTasks = await fetchTasks(token)
    applyFilter()
    showTasks()
    showTasksError('')

    await syncPomo()
    startPomoTick()
  } catch (err) {
    if (err.message === 'SESSION_EXPIRED') {
      await clearSession()
      showLogin()
      showLoginError('A sessao expirou. Entra de novo.')
    } else {
      showTasksError('Nao foi possivel carregar as tarefas.')
    }
  }
}

async function syncPomo() {
  currentPomo = await getPomo()
  renderPomo(currentPomo)
}

// atualiza o display de meio em meio segundo enquanto o popup esta aberto.
// o tempo e calculado a partir de endsAt, por isso nao precisa de ser exato.
function startPomoTick() {
  if (pomoTimer) clearInterval(pomoTimer)
  pomoTimer = setInterval(() => {
    if (!currentPomo) return
    renderPomo(currentPomo)
    if (currentPomo.running && pomoRemaining(currentPomo) <= 0) {
      currentPomo = { ...currentPomo, running: false, endsAt: null, remaining: 0 }
    }
  }, 500)
}

// callbacks
// a logica de cada acao vive aqui. A View liga estes callbacks aos eventos
// (ver os bind* mais abaixo); o controller nunca faz addEventListener.

async function submitLogin() {
  showLoginError('')
  try {
    const { email, password } = getLoginInput()
    await login(email, password)
    clearLoginInput()
    await init()
  } catch (err) {
    showLoginError(err.message)
  }
}

async function doLogout() {
  const token = await getToken()
  await logout(token)
  if (pomoTimer) clearInterval(pomoTimer)
  showLogin()
}

function changeFilter(filter, btn) {
  currentFilter = filter
  setActiveFilter(btn)
  applyFilter()
}

async function toggleTask(taskId, checked) {
  const status = checked ? 'concluida' : 'por_fazer'
  const token = await getToken()
  try {
    await setTaskStatus(taskId, status, token)
    // atualiza a cache local para os filtros refletirem a mudanca
    const t = allTasks.find(x => x.id === taskId)
    if (t) t.status = status
    markTaskDone(taskId, checked)
    // avisa o background para atualizar o badge imediatamente
    chrome.runtime.sendMessage({ type: 'TASK_UPDATED' }).catch(() => {})
  } catch (err) {
    markTaskDone(taskId, !checked) // reverte a checkbox
    showTasksError('Nao foi possivel atualizar a tarefa.')
  }
}

async function togglePin(id) {
  pinnedIds = pinnedIds.includes(id)
    ? pinnedIds.filter(x => x !== id)
    : [...pinnedIds, id]
  await savePinnedIds(pinnedIds)
  applyFilter()
}

async function togglePomo() {
  currentPomo = currentPomo?.running ? await pausePomo() : await startPomo()
  renderPomo(currentPomo)
}

async function doResetPomo() {
  currentPomo = await resetPomo()
  renderPomo(currentPomo)
}

// liga os callbacks aos eventos (a View e que regista os listeners)

bindLogin(submitLogin)
bindLogout(doLogout)
bindFilters(changeFilter)
bindTaskToggle(toggleTask)
bindTaskPin(togglePin)
bindPomo({ onToggle: togglePomo, onReset: doResetPomo })

// ponto de entrada
init()
