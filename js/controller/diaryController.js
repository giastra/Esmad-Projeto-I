import {
  getMeusDiarios,
  getDiarioById,
  criar,
  atualizar,
  apagar
} from '../model/diaryModel.js';

import { requireAuth } from '../utils/helpers.js';

// ─── MENSAGENS ────────────────────────────────────────────────

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

// ─── HELPERS ────────────────────────────────────────────────

const tratarResposta = (res, erroPadrao = 'Erro no servidor.') => {
  if (!res) return { success: false, message: erroPadrao };
  return res;
};

// ─── AÇÕES (API) ────────────────────────────────────────────────

// GET todos
export const carregarDiarios = async (onRender) => {
  requireAuth();

  try {
    const res = tratarResposta(await getMeusDiarios());

    if (res.success) {
      onRender(res.data);
    } else {
      renderErro(res.message || 'Erro ao carregar entradas.');
    }
  } catch (err) {
    renderErro('Erro de ligação ao servidor.');
  }
};

// GET por ID
export const carregarDiarioPorId = async (id) => {
  try {
    return tratarResposta(await getDiarioById(id));
  } catch (err) {
    return { success: false, message: 'Erro ao buscar entrada.' };
  }
};

// CREATE
export const criarDiario = async (dados) => {
  try {
    return tratarResposta(await criar(dados));
  } catch (err) {
    return { success: false, message: 'Erro ao criar entrada.' };
  }
};

// UPDATE
export const atualizarDiario = async (id, dados) => {
  try {
    return tratarResposta(await atualizar(id, dados));
  } catch (err) {
    return { success: false, message: 'Erro ao atualizar entrada.' };
  }
};

// DELETE
export const apagarDiario = async (id) => {
  try {
    return tratarResposta(await apagar(id));
  } catch (err) {
    return { success: false, message: 'Erro ao apagar entrada.' };
  }
};

// ─── INIT ────────────────────────────────────────────────

export const initDiarioController = (onRender) => {
  carregarDiarios(onRender);
};
