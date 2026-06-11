import {abrirModalDetalhes,criarTarefa,criarCard} from "../view/homeView.js"
import { getMinhasCategorias } from '../model/taskCategoryModel.js';
import { getMinhasTarefas } from '../model/taskModel.js';

// pega as categorias e as tarefas da API
const res = await getMinhasCategorias();
const cat = res.data
const rs = await getMinhasTarefas()
const tasks = rs.data

// renderiza as tarefas quando pedida
export function rendTarefas() {
    // verifica se existe tarefa

    
    if(tasks.length>0){
      
    // para cada tarefa por fazer ele cria um cartão 
    for (const tas of tasks) {
    if (tas.status == 'por_fazer'){
        
        let tipo = ''
        if (tas.priority == 'alta'){
            tipo = 'red'
        }
        
        else if (tas.priority == 'normal'){
            tipo = 'yellow'
        }

        
        else {
            tipo = 'green'
        }

        criarTarefa(tas.name,tas.description,tipo)
    }  
    }
    }   
    else{
        criarTarefa('n','n','n','n')
             
    }
    
}


// função puxa as listas de categorias e de tarefas para renderiar na home pg
export function rendCategorias() {
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
    criarCard('n','n','n','n','n')
}

}


// função altera diretamente na base e recebe o nome da tarefa para fazer a procura
export function marcaConcluido(nome){
    for (const tas of tasks) {
        if (tas.name == nome){
            if (tas.status=="por_fazer"){
            tas.status="concluida"
        }
            else {
                tas.status="por_fazer"
            }
            break
        }
        
    }
}

