import {gerarTarefas,salvarTarefa,statuTarefa,CategoriaName,ApagarTarefa} from "../controller/taskController.js"

const btnAdd = document.querySelector(".btn-add");
const porFazer = document.getElementById("por-fazer");
const concluido = document.getElementById("concluido");

/* ABRIR MODAL DE CRIAÇÃ */
btnAdd.addEventListener("click", () => {
    criarModal();
});

const data = new Date()
let mes = data.getMonth()+1
const ano = data.getYear()+1900
const dia = data.getDate()
// const DataHoje = (`${ano}-${mes}-${dia}`)''
// console.log(DataHoje);


/* MODAL DE CRIAÇÃO */
function criarModal() {
    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
        <div class="modal-content">

            <h4>Adicionar Tarefa</h4>

            <label>Nome da Tarefa</label>
            <input type="text" id="tituloTarefa">

            <label>Data de inicio</label>
            <input type="date" id='startDate' value='${ano}-0${mes}-${dia}'>

            <label>Data de fim</label>
            <input type="date" id='endDate' value='${ano}-0${mes}-${dia}'>

            <label>Prioridade</label>
            <input type='button' class='prioridade' value='alta' ">
            <input type='button' class='prioridade' value='normal' ">
            <input type='button' class='prioridade' value='baixa' ">

            <label>Descrição</label>
            <textarea id="descricaoTarefa"></textarea>

            <button class="btn-modal-add" id="btnCriar">Concluir</button>
            

        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";
    
    const top =modal.querySelectorAll(".prioridade")
    for (const prio of top){
        prio.addEventListener('click',()=>{
            let evento = event.target.value;
             if ('alta' == evento){
                priority = 'alta'
            }
            else if ('normal' == evento){
                priority = 'normal'
            }
            else {
                priority='baixa'
            }
            console.log(priority);
        })
    }
    

    modal.querySelector("#btnCriar").addEventListener("click", () => {
        const titulo = modal.querySelector("#tituloTarefa").value.trim();
        const descricao = modal.querySelector("#descricaoTarefa").value.trim();
        const startDate = modal.querySelector("#startDate").value;
        console.log(startDate);
        
        const endDate = modal.querySelector("#endDate").value;
        if (startDate == null){endDate=Date.now()}
        
        if (titulo === "") return;

        // cria a tarefa 
        salvarTarefa(titulo, descricao,startDate,endDate,priority)
        modal.remove();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}

/* CRIAR TAREFA */
export function criarTarefa(id,titulo,descricao,startDate,endDate,priority,status) {
    // cor do ponto
    let pontoCor = 'green'      
    if (priority == 'alta'){
        pontoCor ='red'
    }
    else if (priority == 'normal'){
        pontoCor = 'yellow'
    }

    // dia simplificado
    startDate = startDate.split('T')[0]
    endDate = endDate.split('T')[0]

    const tarefa = document.createElement("div");
    tarefa.classList.add("tarefa");
    tarefa.dataset.inicio= startDate
    tarefa.dataset.fim=endDate
    tarefa.dataset.prioridade = priority
    tarefa.innerHTML = `
        <input type="checkbox" class="check" id='${id}'>
        <div class="texto titulo-tarefa" >${titulo}</div>
        <span class="dot ${pontoCor}"></span>
    `;

    tarefa.dataset.descricao = descricao;

    // abrir modal de detalhes ao clicar no título
    tarefa.querySelector(".titulo-tarefa").addEventListener("click", () => {
        if (!modoEliminarTarefa) abrirModalDetalhes(titulo, descricao);
    });

    // impedir que checkbox apague tarefa no modo eliminar
    tarefa.querySelector(".check").addEventListener("click", (e) => {
        if (modoEliminarTarefa) e.stopPropagation();
    });
    
    // verifica se a tarefa foi feita ou não
    if (status == 'por_fazer'){
    porFazer.appendChild(tarefa);
    document.getElementById(id).checked=false 
    }
    else if (status == 'concluida') {concluido.appendChild(tarefa)
         document.getElementById(id).checked=true     
    }
    console.log(tarefa);
    
}

/* MODAL DE DETALHES */
function abrirModalDetalhes(titulo, descricao) {
    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
        <div class="modal-content">

            <h4>${titulo}</h4>

            <h5>Descrição:</h5>
            <p>${descricao || "Sem descrição."}</p>

        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}

/* MOVER ENTRE COLUNAS */
document.addEventListener("change", (e) => {
    if (!e.target.classList.contains("check")) return;

    const tarefa = e.target.closest(".tarefa");
    let id = e.target.getAttribute('id')
    
    if (e.target.checked) {
        concluido.appendChild(tarefa);
        statuTarefa(id)

    } else {
        porFazer.appendChild(tarefa);
        statuTarefa(id)

    }
});

/* MODO ELIMINAR*/
let modoEliminarTarefa = false;

const btnDelete = document.querySelector(".btn-delete");

// Toggle do modo eliminar
btnDelete.addEventListener("click", () => {

    // Se já está ativo → desativa
    if (modoEliminarTarefa) {
        modoEliminarTarefa = false;
        btnDelete.classList.remove("ativo");
        return;
    }

    // Se não está ativo → ativa
    modoEliminarTarefa = true;
    btnDelete.classList.add("ativo");

    // Fechar qualquer modal aberta
    document.querySelectorAll(".modal").forEach(m => m.remove());
});

// Eliminar tarefa ao clicar
document.addEventListener("click", (e) => {
    if (!modoEliminarTarefa) return;

    const tarefa = e.target.closest(".tarefa");
    if (!tarefa) return;

    tarefa.remove();
    let id = tarefa.querySelector('input').getAttribute('id') 
    ApagarTarefa(id)

    // Desligar modo eliminar depois de apagar
    modoEliminarTarefa = false;
    btnDelete.classList.remove("ativo");
});



// init
document.getElementById('topo').innerHTML=`Tarefas de ${await CategoriaName()}`


let priority = 'baixa'
gerarTarefas()

// filtro
 const botoesFiltro = document.querySelectorAll(".btn-filtro");
 const tarefas = document.querySelectorAll(".tarefa");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        const filtro = botao.dataset.filter;

        tarefas.forEach(tarefa => {
            const DMYi = tarefa.dataset.inicio
            let Di = Number(DMYi.split('-')[2])
            let Mi = Number(DMYi.split('-')[1])
            let Yi = Number(DMYi.split('-')[0])
           
            const DMYf = tarefa.dataset.fim
            let Df = Number(DMYf.split('-')[2])
            let Mf = Number(DMYf.split('-')[1])
            let Yf = Number(DMYf.split('-')[0])
            
            
            const prioridade = tarefa.dataset.prioridade;
            
            // Mostrar todas
            if (filtro == "todas") {
                tarefa.style.display = "flex";
                return;
            }

            // Filtrar por prioridade
            if (filtro == 'prioridade') {
                if(prioridade == 'alta'){
                tarefa.style.display = "flex";
                return;}
            }

            // Filtrar por Hoje
            if (filtro == 'hoje') {
                if (Di <= dia && Mi <= mes && Yi <= ano && Df >= dia && Mf >= mes && Yf >= ano ){
                tarefa.style.display = "flex";
                return;}
            }

            // Filtrar pela semana 
            if (filtro == 'semana') {
                if (Di <= dia+7 && Mi <= mes && Yi <= ano && Df >= dia-7 && Mf >= mes && Yf >= ano ){
                tarefa.style.display = "flex";
                return;}
            }

            // Caso não corresponda ao filtro → esconder
            tarefa.style.display = "none";
        });
        tarefas.forEach(tarefa => {  
            const prioridade = tarefa.dataset.prioridade;
            // Filtrar por prioridade
            if (filtro == 'prioridade') {
                if(prioridade == 'normal'){
                tarefa.style.display = "flex";
                return;}
            }
            // Caso não corresponda ao filtro → esconder
            if (prioridade !='normal' && prioridade != 'alta' && filtro=='prioridade'){
            tarefa.style.display = "none";}
        });
    });
});
