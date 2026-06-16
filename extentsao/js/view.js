import { pomoRemaining } from './model.js'

// referencias aos elementos do DOM, resolvidas uma vez a startup.
// como este modulo e importado por controller.js (script type="module",
// que e sempre deferido), o DOM ja esta pronto quando isto executa.
export const el = {
  loginSection: document.getElementById('login-section'),
  tasksSection: document.getElementById('tasks-section'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  loginBtn: document.getElementById('login-btn'),
  loginError: document.getElementById('login-error'),
  logoutBtn: document.getElementById('logout-btn'),
  greeting: document.getElementById('greeting'),
  filters: document.getElementById('filters'),
  taskList: document.getElementById('task-list'),
  emptyState: document.getElementById('empty-state'),
  tasksError: document.getElementById('tasks-error'),
  pomoTime: document.getElementById('pomo-time'),
  pomoFill: document.getElementById('pomo-fill'),
  pomoToggle: document.getElementById('pomo-toggle'),
  pomoReset: document.getElementById('pomo-reset')
}

export function showLogin() {
  el.loginSection.hidden = false
  el.tasksSection.hidden = true
}

export function showTasks() {
  el.loginSection.hidden = true
  el.tasksSection.hidden = false
}

export function showGreeting(user) {
  el.greeting.textContent = user ? `Ola, ${user.name}` : ''
}

export function showLoginError(message) {
  el.loginError.textContent = message
  el.loginError.hidden = !message
}

export function showTasksError(message) {
  el.tasksError.textContent = message
  el.tasksError.hidden = !message
}

// desenha a lista ja filtrada/ordenada. Recebe instancias de Task e usa os
// getters da entidade (isDone, categoryName, id). Nao sabe como os dados chegaram.
export function renderTasks(tasks, pinnedIds) {
  el.taskList.innerHTML = ''
  el.emptyState.hidden = tasks.length > 0

  tasks.forEach(task => {
    const isPinned = pinnedIds.includes(task.id)

    const li = document.createElement('li')
    li.className = 'task-item'
    if (task.isDone) li.classList.add('done')
    if (isPinned) li.classList.add('pinned')

    li.innerHTML = `
      <input type="checkbox" data-id="${task.id}" ${task.isDone ? 'checked' : ''}>
      <div class="task-name">
        ${task.name}
        <div class="task-meta">${task.categoryName}</div>
      </div>
      <span class="dot ${task.priority}" title="Prioridade ${task.priority}"></span>
      <button class="pin ${isPinned ? 'pinned' : ''}" data-pin="${task.id}" title="Fixar">📌</button>
    `

    el.taskList.appendChild(li)
  })
}

// marca visualmente uma tarefa como concluida (ou nao) sem redesenhar a lista.
// usado pelo controller depois do PUT, e para REVERTER a checkbox se o PUT falhar.
export function markTaskDone(taskId, done) {
  const cb = el.taskList.querySelector(`input[data-id="${taskId}"]`)
  if (!cb) return
  cb.checked = done
  cb.closest('.task-item').classList.toggle('done', done)
}

export function renderPomo(pomo) {
  const remaining = pomoRemaining(pomo)
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')
  const text = `${mins}:${secs}`
  // so escreve se mudou: evita repaint a cada 500ms quando parado
  if (el.pomoTime.textContent !== text) el.pomoTime.textContent = text

  const pct = pomo.duration ? (1 - remaining / pomo.duration) * 100 : 0
  el.pomoFill.style.width = `${pct}%`

  const icon = (pomo.running && remaining > 0) ? '⏸' : '▶'
  if (el.pomoToggle.textContent !== icon) el.pomoToggle.textContent = icon
}



// registo de event listeners
// pela nossa arquitetura, ligar os eventos da UI e trabalho da VIEW. A View
// expoe um binder por acao; o CONTROLLER passa o callback com a logica. Assim
// o controller nunca toca no DOM nem em addEventListener: so coordena.

export function bindLogin(handler) {
  el.loginBtn.addEventListener('click', handler)
  el.email.addEventListener('keydown', e => { if (e.key === 'Enter') handler() })
  el.password.addEventListener('keydown', e => { if (e.key === 'Enter') handler() })
}

export function getLoginInput() {
  return { email: el.email.value.trim(), password: el.password.value }
}

export function clearLoginInput() {
  el.email.value = ''
  el.password.value = ''
}

export function bindLogout(handler) {
  el.logoutBtn.addEventListener('click', handler)
}

export function bindTaskToggle(handler) {
  el.taskList.addEventListener('change', e => {
    if (e.target.type !== 'checkbox') return
    handler(e.target.dataset.id, e.target.checked)
  })
}

export function bindTaskPin(handler) {
  el.taskList.addEventListener('click', e => {
    const btn = e.target.closest('[data-pin]')
    if (btn) handler(btn.dataset.pin)
  })
}

export function bindPomo({ onToggle, onReset }) {
  el.pomoToggle.addEventListener('click', onToggle)
  el.pomoReset.addEventListener('click', onReset)
}


// filtro

export function setActiveFilter(button) {
  el.filters.querySelectorAll('.filter').forEach(b => {
    b.classList.toggle('active', b === button)
  })
}

export function bindFilters(handler) {
  el.filters.addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]')
    if (btn) handler(btn.dataset.filter, btn)
  })
}

