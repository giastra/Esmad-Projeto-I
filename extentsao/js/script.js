let pin = "img/pin.png"
let pinIN = "img/pinIN.png"

//tem que rever essa parte com a integração da api
function SImg(objeto) { 
    if (objeto == "alta")
        {return "img/SVermelho.png"}
    else if (objeto == "normal")
        {return "img/SAmarelo.png"}
    else if (objeto == "baixa")
        {return "img/SVerde.png"}
    else {return ""}
}

function Rend(objeto,Tpin=pin){`
            <div class="tasks" name="${objeto.name}">
            <div class='linhaTxt'>
            <input type="checkbox" >
            <p>${objeto.name}</p>
            </div>
            <div class='pin'>
             <img src="${SImg(objeto.priority)}" width="15px" height="15px">
             <img src="${pin}" name="${objeto.name}" width="15px" height="15px">
            </div>
            </div>` }

function RendBtn(){
    `
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
    }]

function todas(){
    document.getElementById("tarefas").innerHTML=''
for (let num in tasks) {
    document.getElementById("tarefas").innerHTML+=Rend(tasks[num])
}
    document.getElementById("telaInicial").innerHTML=RendBtn
    
        // todas btn
        document.getElementById("Todas").addEventListener('click',function(){
            console.log('todas');
            todas()
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
              
        }})
}

// inicial 

let statu=false
 let num =0
document.getElementById('tarefas').addEventListener('click',function(){
    let pin=(event.target.getAttribute('name'));
   
    for (let trab in tasks){    
        if (tasks[trab].name==pin){
            num = trab
            console.log(trab);
        }}


        if (statu == false && pin!=null){
            document.getElementById("tarefas").innerHTML=Rend(lista[num],pinIN)   
            statu=true

            document.getElementById("telaInicial").innerHTML=``
        }

        else{
            statu=false
            document.getElementById("tarefas").innerHTML=''
            todas()
        }
    
    

})

