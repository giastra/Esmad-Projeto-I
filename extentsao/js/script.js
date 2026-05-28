
let pin = "img/pin.png"
let pinIN = "img/pinIN.png"

//tem que rever essa parte com a integração da api
let SImg = "img/SAmarelo.png"

let tasks = ["limpar o chão","Fazer o dever de casa","Trabalhar muito"]

function todas(){
for (let num in tasks) {
    document.getElementById("tarefas").innerHTML+=`
            <div class="tasks" name="${tasks[num]}">
            <div class='linhaTxt'>
            <input type="checkbox" >
            <p>${tasks[num]}</p>
            </div>
            <div class='pin'>
            <img src="${SImg}" width="15px" height="15px">
             <img src="${pin}" name="${tasks[num]}" width="15px" height="15px">
            </div>
            </div>`  
}
    document.getElementById("telaInicial").innerHTML=`
        <p id="tarefaAtiva">Tarefa Prioritaria</p>
        <hr>
        <div class="botoes">
            <button name="Todas" class="botao">Todas</button>
            <button name="Prioridade" class="botao">Prioridade</button>
        </div>
        <div class="botoes">
            <button name="Hoje" class="botao">Hoje</button>
            <button name="EstaSemana" class="botao">Esta Semana</button>
        </div>`
}

todas()
let statu=false
 let num =0
document.getElementById('tarefas').addEventListener('click',function(){
    let pin=(event.target.getAttribute('name'));
   
    for (let trab in tasks){    
        if (tasks[trab]==pin){
            num = trab
            console.log(trab);
        }}


        if (statu == false && pin!=null){
            document.getElementById("tarefas").innerHTML=`
            <div class="tasks" name="${tasks[num]}">
            <div class='linhaTxt'>
            <input type="checkbox" >
            <p>${tasks[num]}</p>
            </div>
            <div class='pin'>
             <img src="${SImg}" width="15px" height="15px">
             <img src="${pinIN}" name="${tasks[num]}" width="15px" height="15px">
            </div>
            </div>`   
            statu=true

            document.getElementById("telaInicial").innerHTML=``
        }

        else{
            statu=false
            document.getElementById("tarefas").innerHTML=''
            todas()
        }
    
    

})

