import { getMeus, criar, atualizar, apagar, ativar } from '..models/pomodoroModel.js';
import { requireAuth } from '../utils/helpers.js';


// Carrega todos os pomodoros do utilizador
const carregarPomodoros = async () => {
  requireAuth();

  const res = await getMeus();
  if (res.success) {
    renderPomodoros(res.data.meus, res.data.default, res.data.activePomodoro);
    bindEventos();
  }
};

// Liga os eventos aos botões da lista
const bindEventos = () => {
  // Ativar pomodoro
  document.querySelectorAll('.btn-ativar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.closest('[data-id]').dataset.id;
      const res = await ativar(id);
      if (res.success) {
        renderSucesso('Pomodoro ativado.');
        carregarPomodoros();
      } else {
        renderErro(res.message);
      }
    });
  });

  // Apagar pomodoro
  document.querySelectorAll('.btn-apagar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.closest('[data-id]').dataset.id;
      const res = await apagar(id);
      if (res.success) carregarPomodoros();
      else renderErro(res.message);
    });
  });
};

// CRIAR POMODORO
document.getElementById('form-pomodoro')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparMensagens();

  const res = await criar({
    name: document.getElementById('name').value,
    focusTime: Number(document.getElementById('focusTime').value),
    shortBreak: Number(document.getElementById('shortBreak').value),
    longBreak: Number(document.getElementById('longBreak').value),
    cycles: Number(document.getElementById('cycles').value)
  });

  if (res.success) {
    renderSucesso('Pomodoro criado com sucesso.');
    e.target.reset();
    carregarPomodoros();
  } else {
    renderErro(res.message);
  }
});


carregarPomodoros();
