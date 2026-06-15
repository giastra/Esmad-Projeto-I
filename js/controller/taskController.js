import { getMinhasTarefas,getTarefaById ,criar,atualizar,apagar} from '../model/taskModel.js';
import {criarTarefa} from "../view/tarefasView.js"
import { getCategoriaById} from "../model/taskCategoryModel.js"

let audio = new Audio("../images/SomTarefaCompleta.mp3");

const rs = await getMinhasTarefas()
const tasks = rs.data
console.log(tasks);
let categoria = localStorage.getItem('categoria')

// carrega todas as tarefas da categoria selecionada 
export function gerarTarefas (){
    if (categoria != 'prioriade'){
         for (const t of tasks) {
            if (t.category._id == categoria){
        criarTarefa(t._id,t.name,t.description,t.startDate,t.endDate,t.priority,t.status)
    }}
    }
    else{
    for (const t of tasks) {
        criarTarefa(t._id,t.name,t.description,t.startDate,t.endDate,t.priority,t.status)
    }}
}

// salva a tarefa na api
// recebe (o titulo da tarefa, a descrição da tarefa, a data de inicio yyyy-MM-dd, a data de fim yyyy-MM-dd, e a prioridade entre [alta,normal,baixa])
export function salvarTarefa(titulo, descricao,startDate,endDate,priority){
    const data={
        name:titulo,
        description:descricao,
        startDate:startDate,
        endDate:endDate,
        priority:priority,
        category: categoria
    }
    criar(data)
    window.location.reload();
}

// muda o statos da tarefa a partir do id dela de por_fazer para concluida e vice versa
export async function statuTarefa(id) {
    console.log(id);
    
    const t = await getTarefaById(id)
    console.log(t);
    
    if (t.data.status == 'por_fazer'){
        t.data.status = 'concluida'
        audio.play()
    }
    else {
        t.data.status = 'por_fazer'
    }
    atualizar(id,t.data)
}

// pega o nome da categoria para mostrar no topo das tarefas
export async function CategoriaName() {
    if (categoria == 'prioriade'){
        return 'prioritarias'
    }
    else {
        let top = await getCategoriaById(categoria)
        return top.data.name
    }
}

// elimina a tarefa da api
export function ApagarTarefa (id) {
    apagar(id)
}