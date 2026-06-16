export const API = 'http://localhost:5000/api'

// duracao do foco do pomodoro, em segundos.
// 25 min e o valor por omissao do PomodoroModel (focusTime).
export const POMO_DURATION = 25 * 60

// entidade Task
// a classe junta os DADOS de uma tarefa e o COMPORTAMENTO proprio dela
// (esta concluida? vence hoje? que peso tem a prioridade?). Assim a logica
// de dominio vive na entidade, nao espalhada por funcoes soltas no controller.

const PRIORITY_ORDER = { alta: 0, normal: 1, baixa: 2 }

export class Task {
  #id // id do servidor (Mongo _id). So leitura: nunca se altera de fora.

  constructor(name, status, priority, endDate, category) {
    this.#id = null
    this.name = name
    this.status = status
    this.priority = priority
    this.endDate = endDate
    this.category = category
  }

  get id() { return this.#id }
  get isDone() { return this.status === 'concluida' }
  get isPending() { return this.status === 'por_fazer' }
  get categoryName() { return this.category?.name || 'Sem categoria' }
  // peso para ordenar por prioridade (alta primeiro). Desconhecida vai para o fim.
  get priorityRank() { return PRIORITY_ORDER[this.priority] ?? 99 }

  // vence hoje?
  isDueToday() {
    if (!this.endDate) return false
    return new Date(this.endDate).toDateString() === new Date().toDateString()
  }

  // vence nesta semana (segunda a domingo da semana atual)?
  isDueThisWeek() {
    if (!this.endDate) return false
    const d = new Date(this.endDate)
    const now = new Date()
    const start = new Date(now)
    const weekday = (now.getDay() + 6) % 7 // 0 = segunda
    start.setDate(now.getDate() - weekday)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 7)
    return d >= start && d < end
  }

  // converte o objeto cru da API numa instancia, PRESERVANDO o _id do servidor.
  // sem isto, fixar/atualizar por id falhava (o construtor nao tem id).
  static fromObject(o) {
    const t = new Task(o.name, o.status, o.priority, o.endDate, o.category)
    t.#id = o._id
    return t
  }
}

// sessao

// chrome.storage.local substitui o localStorage dentro da extensao.
// E assincrono (devolve promessa), ao contrario do localStorage.
export async function saveSession(token, user) {
  await chrome.storage.local.set({ token, user })
}

export async function getToken() {
  const { token } = await chrome.storage.local.get('token')
  return token
}

export async function getUser() {
  const { user } = await chrome.storage.local.get('user')
  return user
}

export async function clearSession() {
  await chrome.storage.local.remove(['token', 'user'])
}

// autenticacao

// resposta esperada: { success, token, data: { _id, name, email, roles } }
export async function login(email, password) {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Falha no login')
  }

  await saveSession(json.token, json.data)
  return json.data
}

export async function logout(token) {
  try {
    await fetch(`${API}/users/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  } catch (err) {
    // falhar aqui nao importa: o logout e local. Avisamos na consola para
    // se ver que foi ignorado de PROPOSITO (nao um erro esquecido) e seguimos.
    console.warn('[logout] o servidor nao respondeu, limpando sessao local na mesma:', err)
  }
  await clearSession()
}

// tarefas

export async function fetchTasks(token) {
  const res = await fetch(`${API}/tasks`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })

  if (res.status === 401) throw new Error('SESSION_EXPIRED')

  const json = await res.json()
  // devolve INSTANCIAS de Task, nao objetos crus: quem consome ja tem o
  // comportamento (isDueToday, isDone...) sem voltar a calcular nada.
  return json.data.map(Task.fromObject)
}

// marca (ou desmarca) uma tarefa, reaproveitando o PUT /api/tasks/:id
export async function setTaskStatus(taskId, status, token) {
  const res = await fetch(`${API}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  })

  if (!res.ok) throw new Error('Falha ao atualizar tarefa')
}

// fixar tarefas (pin)
// o pin vive so na extensao (chrome.storage), nao no servidor.

export async function getPinnedIds() {
  const { pinnedIds } = await chrome.storage.local.get('pinnedIds')
  return pinnedIds || []
}

export async function savePinnedIds(ids) {
  await chrome.storage.local.set({ pinnedIds: ids })
}

// pomodoro
// o estado persiste no storage para sobreviver ao fecho do popup.
// quando esta a correr guardamos o instante em que termina (endsAt),
// assim o tempo restante e sempre calculado, nao contado a mao.

export async function getPomo() {
  const { pomo } = await chrome.storage.local.get('pomo')
  return pomo || { running: false, endsAt: null, remaining: POMO_DURATION, duration: POMO_DURATION }
}

export async function savePomo(pomo) {
  await chrome.storage.local.set({ pomo })
}

export async function startPomo() {
  const pomo = await getPomo()
  const remaining = pomo.remaining > 0 ? pomo.remaining : pomo.duration
  pomo.endsAt = Date.now() + remaining * 1000
  pomo.running = true
  await savePomo(pomo)
  // o alarme acorda o service worker para notificar quando terminar
  chrome.alarms.create('pomodoro', { when: pomo.endsAt })
  return pomo
}

export async function pausePomo() {
  const pomo = await getPomo()
  if (pomo.running && pomo.endsAt) {
    pomo.remaining = Math.max(0, Math.round((pomo.endsAt - Date.now()) / 1000))
  }
  pomo.running = false
  pomo.endsAt = null
  await savePomo(pomo)
  chrome.alarms.clear('pomodoro')
  return pomo
}

export async function resetPomo() {
  const pomo = await getPomo()
  pomo.running = false
  pomo.endsAt = null
  pomo.remaining = pomo.duration
  await savePomo(pomo)
  chrome.alarms.clear('pomodoro')
  return pomo
}

// funcao pura: calcula segundos restantes a partir do estado guardado
export function pomoRemaining(pomo) {
  if (pomo.running && pomo.endsAt) {
    return Math.max(0, Math.round((pomo.endsAt - Date.now()) / 1000))
  }
  return pomo.remaining
}
