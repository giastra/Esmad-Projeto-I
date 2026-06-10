import { getMinhasCategorias, criar, apagar } from '../model/taskCategoryModel.js';
import { getColors,criarCor } from '../model/colorModel.js';
import { requireAuth } from '../utils/helpers.js';
import {criarCard} from "../view/categoriasView.js"
import { getMinhasTarefas } from '../model/taskModel.js';
import {getMe} from '../model/userModel.js'


const cores= await getColors()
if ((cores.data).length==0){
  const dat ={
    name:"CornflowerBlue",
    hex:"#5C95FF"
  }
  console.log('corCriada');
  
  criarCor(dat)
}

const resCat = await getMinhasCategorias();
const cat = resCat.data
const resColor = await getColors();
const color = resColor.data
const rs = await getMinhasTarefas()
const tasks = rs.data

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
          criarCard(tas._id,tas.name,tas.color,nconclu,ntotal)
      }
  }
  else{
      criarCard('n','n','n','n','n','n')
  }
};

// Carrega as cores para o select do formulário
export function carregarCores(){
 return color
}

export function apagarCategoria(id){
  apagar(id)
}

// Liga os eventos aos botões da lista
// const bindEventos = () => {
//   document.querySelectorAll('.btn-apagar').forEach(btn => {
//     btn.addEventListener('click', async (e) => {
//       const id = e.target.closest('[data-id]').dataset.id;
//       const confirmar = confirm('Tens a certeza que queres apagar esta categoria?');
//       if (!confirmar) return;

//       const res = await apagar(id);
//       if (res.success) carregarCategorias();
//       else renderErro(res.message);
//     });
//   });
// };

// CRIAR CATEGORIA
export function criarCategoria(nome,cor=color[0]._id){

  const data = {
    name:nome,
    color:cor
  }
  criar(data)
  window.location.reload();
}
