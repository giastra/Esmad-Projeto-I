import { getColors, criar, apagar } from '../model/colorModel.js';
import { requireAdmin } from '../utils/helpers.js';



// Carrega todas as cores
const carregarCores = async () => {
  requireAdmin();

  const res = await getColors();
  if (res.success) {
    renderCores(res.data);
    bindEventos();
  }
};

// Liga os eventos aos botões da lista
const bindEventos = () => {
  document.querySelectorAll('.btn-apagar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.closest('[data-id]').dataset.id;
      const confirmar = confirm('Tens a certeza que queres apagar esta cor?');
      if (!confirmar) return;

      const res = await apagar(id);
      if (res.success) carregarCores();
      else renderErro(res.message);
    });
  });
};

// CRIAR COR
document.getElementById('form-color')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparMensagens();

  const res = await criar({
    name: document.getElementById('name').value,
    hex: document.getElementById('hex').value
  });

  if (res.success) {
    renderSucesso('Cor criada com sucesso.');
    e.target.reset();
    carregarCores();
  } else {
    renderErro(res.message);
  }
});


carregarCores();
