import {abrirModalDetalhes,criarTarefa,criarCard} from "../view/homeView.js"

const cat = [
    {
        name: 'tarefas',
        user:  {name : "giastra"},
        color: '#5C95FF'
    },
    {
        name: 'escola',
        user:  {name : "giastra"},
        color: '#FC95FF'
    }
]

const tasks = [
    {
        name : "Limpar o chão",
        description : "limpe",
        startDate : "2002-12-04",
        endDate : "2022-02-12",
        status : "por_fazer",
        priority: "normal",
        user : {name : "giastra"},
        category : {
            name : "tarefas",
            color : "#5C95FF"
        }
    },
     {
        name : "Fazer o dever de casa",
        description : "dever",
        startDate : "2022-12-04",
        endDate : "2022-02-12",
        status : "por_fazer",
        priority: "alta",
        user : {name : "giastra"},
        category : {
            name : "escola",
            color : "#FC95FF"
        }
    },
    {
        name :"Trabalhar muito",
        description : "dever",
        startDate : "2022-12-04",
        endDate : "2002-02-12",
        status : "por_fazer",
        priority: "baixa",
        user : {name : "giastra"},
        category : {
            name : "tarefas",
            color : "#5C95FF"}
    },
    {
        name :"Lavar a roupa",
        description : "Lavar",
        startDate : "2026-06-04",
        endDate : "2026-06-10",
        status : "concluida",
        priority: "baixa",
        user : {name : "giastra"},
        category : {
            name : "tarefas",
            color : "#5C95FF"}
    }
]


// renderiza as tarefas quando pedida
export function rendTarefas() {
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


// função puxa as listas de categorias e de tarefas para renderiar na home pg
export function rendCategorias() {
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