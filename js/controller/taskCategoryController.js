import { getMinhasCategorias, criar, apagar } from '../model/taskCategoryModel.js';
import { getColors, criarCor } from '../model/colorModel.js';
import { criarCard } from "../view/categoriasView.js";
import { getMinhasTarefas } from '../model/taskModel.js';

const cores = await getColors();
if ((cores.data).length == 0) {
  const dat = { name: "CornflowerBlue", hex: "#5C95FF" };
  await criarCor(dat);
}

const resCat = await getMinhasCategorias();
const cat = resCat.data;
const resColor = await getColors();
const color = resColor.data;
const rs = await getMinhasTarefas();
const tasks = rs.data;

// Carrega todas as categorias do utilizador
export function carregarCategorias() {
  if (cat.length > 0) {
    for (const tas of cat) {
      let nconclu = 0;
      let ntotal = 0;
      for (const taf of tasks) {
        // fix: category pode ser null
        if (taf.category?.name == tas.name) {
          ntotal++;
          if (taf.status == 'concluida') nconclu++;
        }
      }
      // fix: passar o hex da cor em vez do objeto
      const hex = tas.color?.hex ?? '#cccccc';
      criarCard(tas._id, tas.name, hex, nconclu, ntotal);
    }
  } else {
    criarCard('n', 'n', 'n', 'n', 'n', 'n');
  }
}

// Carrega as cores para o select do formulário
export function carregarCores() {
  return color;
}

export function apagarCategoria(id) {
  apagar(id);
  // fix: sintaxe errada, setItem recebe 2 argumentos
  if (localStorage.getItem('categoria') == id) {
    localStorage.setItem('categoria', 'prioridade');
  }
}

// Criar categoria
export function criarCategoria(nome, cor = color[0]?._id) {
  const data = { name: nome, color: cor };
  criar(data);
  window.location.reload();
}