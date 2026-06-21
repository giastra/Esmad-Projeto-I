import { getMeus, criar, atualizar, apagar, ativar, getDefault, atualizarDefault } from '../model/pomodoroModel.js';
import { requireAuth, requireAdmin } from '../utils/helpers.js';

//MENSAGENS

export const renderSucesso = (msg) => {
  const el = document.getElementById('mensagem');
  if (!el) return;
  el.textContent = msg;
  el.className = 'alert alert-success';
  setTimeout(() => limparMensagens(), 3000);
};

export const renderErro = (msg) => {
  const el = document.getElementById('mensagem');
  if (!el) return;
  el.textContent = msg;
  el.className = 'alert alert-danger';
};

export const limparMensagens = () => {
  const el = document.getElementById('mensagem');
  if (!el) return;
  el.textContent = '';
  el.className = '';
};

//CARREGAR POMODOROS (utilizadores autenticados)

export const carregarPomodoros = async (onRender) => {
  requireAuth();
  const res = await getMeus();
  if (res.success) {
    onRender(res.data.meus, res.data.default, res.data.activePomodoro);
  } else {
    renderErro(res.message || 'Erro ao carregar pomodoros.');
  }
};

// CARREGAR POMODORO DEFAULT (público, sem autenticação)

export const carregarPomodoroDefault = async (onRender) => {
  const res = await getDefault();
  if (res.success) {
    onRender(res.data);
  } else {
    renderErro(res.message || 'Erro ao carregar pomodoro default.');
  }
};

// ATUALIZAR POMODORO DEFAULT (admin)

export const atualizarPomodoroDefault = async (dados) => {
  requireAdmin();
  const res = await atualizarDefault(dados);
  if (res.success) {
    renderSucesso('Pomodoro default atualizado com sucesso.');
  } else {
    renderErro(res.message || 'Erro ao atualizar pomodoro default.');
  }
  return res;
};

//AÇÕES

export const ativarPomodoro = async (id) => {
  return await ativar(id);
};

export const apagarPomodoro = async (id) => {
  return await apagar(id);
};

export const criarPomodoro = async (dados) => {
  return await criar(dados);
};

export const atualizarPomodoro = async (id, dados) => {
  return await atualizar(id, dados);
};

export const initPomodoroController = (onRender) => {
  carregarPomodoros(onRender);
};
