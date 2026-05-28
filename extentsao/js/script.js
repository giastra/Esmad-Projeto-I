let pin = "img/pin.png"
let pinIN = "img/pinIN.png"

//tem que rever essa parte com a integração da api
const tasks = [
    {
        name : "Limpar o chão",
        description : "limpe",
        startDate : "2002-12-04",
        endDate : "2022-02-12",
        status : "concluida",
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
            name : "tarefas",
            color : "#5C955F"
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
            color : "#FC95FF"}
    }
]

// atribuição da bola de prioridade para cada nivel
function SImg(objeto) { 
    if (objeto == "alta")
        {return "img/SVermelho.png"}

    else if (objeto == "normal")
        {return "img/SAmarelo.png"}

    else if (objeto == "baixa")
        {return "img/SVerde.png"}

    else {return "img/LogoNeutro"}
}

function check(objeto) {
    if (objeto.status == 'concluida'){
        return  (true)
    }
}

// renderiza a caixa de tarefa a partir da lista dada e podendo estar com pin ou sem pin(objeto,pin ou pinIN)
function Rend(objeto,Tpin=pin){
    if (check(objeto)){
        return`
            <div class="tasks">
            <div class='linhaTxt'>
            <input type="checkbox" id='checkbox' value='${objeto.name}' checked  >
            <p>${objeto.name}</p>
            </div>
            <div >
             <img src="${SImg(objeto.priority)}" width="20px" height="20px">
             <img class='pin' src="${Tpin}" name="${objeto.name}" width="20px" height="20px">
            </div>
            </div>
            ` 
    }
    
    else{
    return`
            <div class="tasks">
            <div class='linhaTxt'>
            <input type="checkbox" id='checkbox' value='${objeto.name}'  >
            <p>${objeto.name}</p>
            </div>
            <div >
             <img src="${SImg(objeto.priority)}" width="20px" height="20px">
             <img class='pin' src="${Tpin}" name="${objeto.name}" width="20px" height="20px">
            </div>
            </div>
            ` }
}

// os quatro botões iniciais  
function RendBtn(){
    return`
        <p id="tarefaAtiva">Tarefa Prioritaria</p>
        <hr>
        <div class="botoes">
            <button id="Todas" class="botao">Todas</button>
            <button id="Prioridade" class="botao">Prioridade</button>
        </div>
        <div class="botoes">
            <button id="Hoje" class="botao">Hoje</button>
            <button id="EstaSemana" class="botao">Esta Semana</button>
        </div>`
}

// renderização gral das tarefas e a reatividade dos botões 
function todas(tipo=0){
    document.getElementById("tarefas").innerHTML=''
    if (tipo == 1){
        for (let num in ListUltima) {
            document.getElementById("tarefas").innerHTML+=Rend(ListUltima[num])
        }
        document.getElementById("telaInicial").innerHTML=RendBtn()
    }

    else{
        for (let num in tasks) {
            document.getElementById("tarefas").innerHTML+=Rend(tasks[num])
        }
        document.getElementById("telaInicial").innerHTML=RendBtn()
    }

        // todas btn
        document.getElementById("Todas").addEventListener('click',function(){
            console.log('todas');
            todas()
             ListUltima = tasks
        })

        // prioridade btn
        document.getElementById("Prioridade").addEventListener('click',function(){
        console.log('Prioridade');
        document.getElementById("tarefas").innerHTML=``
        const listaA=[]
        const listaN=[]
        const listaB=[]
        for (let trab in tasks){    
            if (tasks[trab].priority=='alta'){
                listaA.push(tasks[trab])
            }
            else if (tasks[trab].priority=='normal'){
                listaN.push(tasks[trab])
            }
            else if (tasks[trab].priority=='baixa'){
                listaB.push(tasks[trab])
            }}

        const lista = []
        listaA.map(n => lista.push(n))
        listaN.map(n => lista.push(n))
        listaB.map(n => lista.push(n))
        for (let num in lista){
        document.getElementById("tarefas").innerHTML+=Rend(lista[num])
        }
        ListUltima = lista
    })
}




// reatividade ao clicar em cada tarefa para ser fixada
document.getElementById('tarefas').addEventListener('click',function(){
    let ev=(event.target.getAttribute('name'));
    let va = (event.target.getAttribute('value')) 
    
    for (let trab in tasks){ 
            
        // seleção de foco
        if (tasks[trab].name==ev){
            num = trab
            console.log(trab);
        }

        if (statu == false && ev!=null){
            document.getElementById("tarefas").innerHTML=Rend(tasks[num],pinIN)   
            statu=true

            document.getElementById("telaInicial").innerHTML=``
        }

        else if (statu == true && ev!=null){
            statu=false
            document.getElementById("tarefas").innerHTML=''
            todas(1)
        }
        
        
        // seleção de checkbox
        if (tasks[trab].name==va){
            console.log(trab);
            if (tasks[trab].status=='por_fazer'){
                tasks[trab].status='concluida'
                console.log(tasks[trab].status);
                
            }
            else{tasks[trab].status='por_fazer'
                console.log(tasks[trab].status);
            }
        }
    }
}


      
         
)

// inicial 
todas()
let ListUltima = tasks
let statu=false
let num =0