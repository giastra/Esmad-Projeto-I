import { getMinhasTarefas, getTarefaById, criar, atualizar, apagar } from '../model/taskModel.js';
import { criarTarefa } from "../view/tarefasView.js"
import { getCategoriaById } from "../model/taskCategoryModel.js"
import { onTarefaConcluida } from "../controller/gameController.js";

let audio = new Audio("../images/SomTarefaCompleta.mp3");

const rs = await getMinhasTarefas()
const tasks = rs.data
console.log(tasks);
let categoria = localStorage.getItem('categoria')

export function gerarTarefas() {
    if (categoria != 'prioriade') {
        for (const t of tasks) {
            if (t.category._id == categoria) {
                criarTarefa(t._id, t.name, t.description, t.startDate, t.endDate, t.priority, t.status)
            }
        }
    } else {
        for (const t of tasks) {
            criarTarefa(t._id, t.name, t.description, t.startDate, t.endDate, t.priority, t.status)
        }
    }
}

export function salvarTarefa(titulo, descricao, startDate, endDate, priority) {
    const data = {
        name: titulo,
        description: descricao,
        startDate: startDate,
        endDate: endDate,
        priority: priority,
        category: categoria
    }
    criar(data)
    window.location.reload();
}

export async function statuTarefa(id) {
    console.log(id);

    const t = await getTarefaById(id)
    console.log(t);

    if (t.data.status == 'por_fazer') {
        t.data.status = 'concluida'
        audio.play()
        await onTarefaConcluida(id);
    } else {
        t.data.status = 'por_fazer'
    }

    atualizar(id, t.data)
}

export async function CategoriaName() {
    if (categoria == 'prioriade') {
        return 'prioritarias'
    } else {
        let top = await getCategoriaById(categoria)
        return top.data.name
    }
}

export function ApagarTarefa(id) {
    apagar(id)
}