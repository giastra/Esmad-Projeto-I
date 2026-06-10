import { getColors, criar, apagar } from '../model/colorModel.js';
import { requireAdmin } from '../utils/helpers.js';
import { renderCores, renderErro, renderSucesso } from '../view/edicaoAdminView.js';

// Carregar cores
export const carregarCores = async () => {
  requireAdmin();

  const res = await getColors();
  if (res.success) {
    renderCores(res.data);
    bindEventos();
  } else {
    renderErro(res.message);
  }
};

// Eventos dos botões apagar
const bindEventos = () => {
  document.querySelectorAll('.btn-apagar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.closest('[data-id]').dataset.id;

      if (!confirm('Tens a certeza que queres apagar esta cor?')) return;

      const res = await apagar(id);
      if (res.success) {
        renderSucesso('Cor apagada.');
        carregarCores();
      } else {
        renderErro(res.message);
      }
    });
  });
};

// Criar cor
export const initCriarCor = () => {
  document.getElementById('form-color')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const hex = document.getElementById('hex').value;

    const res = await criar({ name, hex });

    if (res.success) {
      renderSucesso('Cor criada com sucesso.');
      e.target.reset();
      carregarCores();
    } else {
      renderErro(res.message);
    }
  });
};