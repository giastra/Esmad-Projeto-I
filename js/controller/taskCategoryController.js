import { getMinhasCategorias, criar, apagar } from '../model/taskCategoryModel.js';
import { getColors } from '../model/colorModel.js';
import { requireAuth } from '../utils/helpers.js';

const resCat = await getMinhasCategorias();
const cat = res.data
console.log(cat);
const resColor = await getColors();
const color = resColor.data

// Carrega todas as categorias do utilizador
export function carregarCategorias() { 
  if (cat.length>0){
      for (const tas of cat) {
             let nconclu = 0
             let ntotal = 0
          for (const taf of tasks){   
              if (taf.category.name == tas.name){
                  ntotal++
                  if (taf.status == 'concluida'){
                      nconclu ++
                  }
              }
          }
          criarCard(tas.name,tas.color,nconclu,ntotal)
      }
  }
  else{
      criarCard('n','n','n','n','n')
  }
  
};

// Carrega as cores para o select do formulário
export function carregarCores(){
 
  
}

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


// carregarCores();
// carregarCategorias();
