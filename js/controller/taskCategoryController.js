import { getMinhasCategorias, criar, apagar } from '../model/taskCategoryModel.js';
import { getColors } from '../model/colorModel.js';
import { requireAuth } from '../utils/helpers.js';



// Carrega todas as categorias do utilizador
const carregarCategorias = async () => {
  requireAuth();

  const res = await getMinhasCategorias();
  if (res.success) {
    renderCategorias(res.data);
    bindEventos();
  }
};

// Carrega as cores para o select do formulário
const carregarCores = async () => {
  const res = await getColors();
  if (res.success) renderOpcoesCores(res.data);
};

// Liga os eventos aos botões da lista
const bindEventos = () => {
  document.querySelectorAll('.btn-apagar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.closest('[data-id]').dataset.id;
      const confirmar = confirm('Tens a certeza que queres apagar esta categoria?');
      if (!confirmar) return;

      const res = await apagar(id);
      if (res.success) carregarCategorias();
      else renderErro(res.message);
    });
  });
};

// CRIAR CATEGORIA
document.getElementById('form-category')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparMensagens();

  const res = await criar({
    name: document.getElementById('name').value,
    color: document.getElementById('color').value
  });

  if (res.success) {
    renderSucesso('Categoria criada com sucesso.');
    e.target.reset();
    carregarCategorias();
  } else {
    renderErro(res.message);
  }
});


carregarCores();
carregarCategorias();
