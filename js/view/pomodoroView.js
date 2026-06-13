import {
  initPomodoroController,
  carregarPomodoros,
  ativarPomodoro,
  apagarPomodoro,
  criarPomodoro,
  atualizarPomodoro,
  renderSucesso,
  renderErro,
  limparMensagens,
} from '../controller/pomodoroController.js';

//ESTADO DO TIMER

const timer = {
  intervalo: null,
  segundosRestantes: 0,
  fase: 'foco',
  cicloAtual: 0,
  config: null,
  ativo: false,
};

//TIMER

const formatarTempo = (seg) => {
  const m = String(Math.floor(seg / 60)).padStart(2, '0');
  const s = String(seg % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const labelFase = {
  foco: 'Foco',
  pausaCurta: 'Pausa Curta',
  pausaLonga: 'Pausa Longa',
};

const segundosDaFase = (fase, cfg) => ({
  foco: cfg.focusTime * 60,
  pausaCurta: cfg.shortBreak * 60,
  pausaLonga: cfg.longBreak * 60,
})[fase];

const atualizarUITimer = () => {
  const timeEl = document.getElementById('pomo-time');
  const labelEl = document.getElementById('pomo-label');
  const ciclosEl = document.getElementById('pomo-ciclos');

  // Atualiza textos
  timeEl.textContent = formatarTempo(timer.segundosRestantes);
  labelEl.textContent = timer.config
    ? `${labelFase[timer.fase]} — ${timer.config.name}`
    : labelFase[timer.fase];

  if (ciclosEl && timer.config) {
    ciclosEl.textContent = `Ciclo ${timer.cicloAtual} / ${timer.config.cycles}`;
  }

  const isDark = document.body.classList.contains("dark-mode");

  [timeEl, labelEl, ciclosEl].forEach(el => {
    if (!el) return;
    if (isDark) el.classList.add("white");
    else el.classList.remove("white");
  });
};



const proximaFase = () => {
  if (timer.fase === 'foco') {
    timer.cicloAtual++;
    timer.fase = timer.cicloAtual >= timer.config.cycles ? 'pausaLonga' : 'pausaCurta';
    if (timer.fase === 'pausaLonga') timer.cicloAtual = 0;
  } else {
    timer.fase = 'foco';
  }
  timer.segundosRestantes = segundosDaFase(timer.fase, timer.config);
  atualizarUITimer();
};

const iniciarTimer = () => {
  if (!timer.config) {
    renderErro('Nenhum pomodoro carregado. Ativa um da lista primeiro.');
    return;
  }
  if (timer.ativo) {
    clearInterval(timer.intervalo);
    timer.ativo = false;
    document.getElementById('pomo-start').textContent = 'Continuar';
    return;
  }
  timer.ativo = true;
  document.getElementById('pomo-start').textContent = 'Pausar';
  timer.intervalo = setInterval(() => {
    timer.segundosRestantes--;
    atualizarUITimer();
    if (timer.segundosRestantes <= 0) {
      clearInterval(timer.intervalo);
      timer.ativo = false;
      document.getElementById('pomo-start').textContent = 'Iniciar';
      proximaFase();
    }
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timer.intervalo);
  timer.ativo = false;
  timer.fase = 'foco';
  timer.cicloAtual = 0;
  timer.segundosRestantes = timer.config ? segundosDaFase('foco', timer.config) : 0;
  document.getElementById('pomo-start').textContent = 'Iniciar';
  atualizarUITimer();
};

const carregarNoTimer = (config) => {
  timer.config = config;
  resetTimer();
};

//RENDERIZAÇÃO DA LISTA

const renderPomodoros = (meus, defaultPomodoro, activePomodoro) => {
  const lista = document.getElementById('lista-pomodoros');
  if (!lista) return;

  const todos = [defaultPomodoro, ...meus].filter(Boolean);

  if (todos.length === 0) {
    lista.innerHTML = '<p class="text-muted">Sem pomodoros criados.</p>';
    return;
  }

  lista.innerHTML = todos.map(p => {
    const eAtivo = p._id === activePomodoro;
    const eDefault = p._id === defaultPomodoro?._id;
    return `
      <div class="card mb-2" data-id="${p._id}">
        <div class="card-body">
          <div class="d-flex align-items-center gap-2 mb-1">
            <strong class="card-nome">${p.name}</strong>
            ${eAtivo ? '<span class="badge bg-danger">Ativo</span>' : ''}
            ${eDefault ? '<span class="badge bg-secondary">Padrão</span>' : ''}
          </div>
          <small class="text-muted">
            <strong data-focus>${p.focusTime}</strong>min &nbsp;
            <strong data-short>${p.shortBreak}</strong>min &nbsp;
            <strong data-long>${p.longBreak}</strong>min &nbsp;
            <strong data-cycles>${p.cycles}</strong>x
          </small>
          <div class="mt-2 d-flex gap-2 flex-wrap">
            ${!eAtivo ? `<button class="btn btn-sm btn-success btn-ativar">Ativar</button>` : ''}
            <button class="btn btn-sm btn-outline-primary btn-usar-timer">▶ Usar no Timer</button>
            ${!eDefault ? `<button class="btn btn-sm btn-outline-secondary btn-editar">Editar</button>` : ''}
            ${!eDefault ? `<button class="btn btn-sm btn-outline-danger btn-apagar">Apagar</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (!timer.config) {
    const ativoConfig = todos.find(p => p._id === activePomodoro);
    if (ativoConfig) carregarNoTimer(ativoConfig);
  }
};

//MODAL EDIÇÃO

const abrirModalEdicao = (card) => {
  document.getElementById('edit-id').value = card.dataset.id;
  document.getElementById('edit-name').value = card.querySelector('.card-nome').textContent;
  document.getElementById('edit-focusTime').value = card.querySelector('[data-focus]').textContent;
  document.getElementById('edit-shortBreak').value = card.querySelector('[data-short]').textContent;
  document.getElementById('edit-longBreak').value = card.querySelector('[data-long]').textContent;
  document.getElementById('edit-cycles').value = card.querySelector('[data-cycles]').textContent;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-edicao')).show();
};

const fecharModal = () => {
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-edicao')).hide();
};

//EVENTOS DA LISTA

document.getElementById('lista-pomodoros').addEventListener('click', async (e) => {
  const card = e.target.closest('[data-id]');
  if (!card) return;
  const id = card.dataset.id;

  if (e.target.classList.contains('btn-ativar')) {
    const res = await ativarPomodoro(id);
    if (res.success) {
      renderSucesso('Pomodoro ativado.');
      initPomodoroController(renderPomodoros);
    } else {
      renderErro(res.message);
    }
  }

  if (e.target.classList.contains('btn-usar-timer')) {
    const config = {
      _id: id,
      name: card.querySelector('.card-nome').textContent,
      focusTime: Number(card.querySelector('[data-focus]').textContent),
      shortBreak: Number(card.querySelector('[data-short]').textContent),
      longBreak: Number(card.querySelector('[data-long]').textContent),
      cycles: Number(card.querySelector('[data-cycles]').textContent),
    };
    carregarNoTimer(config);
    renderSucesso(`Timer carregado com "${config.name}".`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (e.target.classList.contains('btn-editar')) {
    abrirModalEdicao(card);
  }

  if (e.target.classList.contains('btn-apagar')) {
    if (!confirm('Tens a certeza que queres apagar este pomodoro?')) return;
    const res = await apagarPomodoro(id);
    if (res.success) {
      renderSucesso('Pomodoro apagado.');
      initPomodoroController(renderPomodoros);
    } else {
      renderErro(res.message);
    }
  }
});

// CRIAR

document.getElementById('form-pomodoro')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparMensagens();
  const res = await criarPomodoro({
    name: document.getElementById('name').value,
    focusTime: Number(document.getElementById('focusTime').value),
    shortBreak: Number(document.getElementById('shortBreak').value),
    longBreak: Number(document.getElementById('longBreak').value),
    cycles: Number(document.getElementById('cycles').value),
  });
  if (res.success) {
    renderSucesso('Pomodoro criado com sucesso.');
    e.target.reset();
    initPomodoroController(renderPomodoros);
  } else {
    renderErro(res.message);
  }
});

//EDITAR

document.getElementById('form-edicao')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparMensagens();
  const res = await atualizarPomodoro(document.getElementById('edit-id').value, {
    name: document.getElementById('edit-name').value,
    focusTime: Number(document.getElementById('edit-focusTime').value),
    shortBreak: Number(document.getElementById('edit-shortBreak').value),
    longBreak: Number(document.getElementById('edit-longBreak').value),
    cycles: Number(document.getElementById('edit-cycles').value),
  });
  if (res.success) {
    renderSucesso('Pomodoro atualizado.');
    fecharModal();
    initPomodoroController(renderPomodoros);
  } else {
    renderErro(res.message);
  }
});

document.getElementById('btn-fechar-modal')?.addEventListener('click', fecharModal);
document.getElementById('btn-cancelar-modal')?.addEventListener('click', fecharModal);

//BOTÕES TIMER

document.getElementById('pomo-start')?.addEventListener('click', iniciarTimer);
document.getElementById('pomo-reset')?.addEventListener('click', resetTimer);



initPomodoroController(renderPomodoros);