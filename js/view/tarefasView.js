import {gerarTarefas,salvarTarefa,statuTarefa,CategoriaName,ApagarTarefa} from "../controller/taskController.js"

const btnAdd = document.querySelector(".btn-add");
const porFazer = document.getElementById("por-fazer");
const concluido = document.getElementById("concluido");

/* ABRIR MODAL DE CRIAÇÃO */
btnAdd.addEventListener("click", () => {
    criarModal();
});

const data = new Date()
let mes = data.getMonth()+1
const ano = data.getYear()+1900
const dia = data.getDate()

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
            <div class="prioridade-container">
                <button class="prioridade alta">Alta</button>
                <button class="prioridade normal">Normal</button>
                <button class="prioridade baixa">Baixa</button>
            </div>

            <label>Descrição</label>
            <textarea id="descricaoTarefa"></textarea>

            <button class="btn-modal-add" id="btnCriar">Concluir</button>

        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";
    
    const top = modal.querySelectorAll(".prioridade")
    for (const prio of top){

        prio.addEventListener('click',(event)=>{
            // ✅ parte corrigida
            const texto = event.target.textContent.toLowerCase();
            if (texto === 'alta'){
                priority = 'alta';
                for (let index = 0; index < top.length; index++) {
                     if (prio == top[index]){
                        prio.classList.add('selecionada')
                        
                        for (let i = 0; i < top.length  ; i++) {
                            if ( top[i] != top[index]){
                            top[i].classList.remove('selecionada')
                            }
                        }
                        break
                    }
                    
                }
               
            }
            else if (texto === 'normal'){
                priority = 'normal';
                 for (let index = 0; index < top.length; index++) {
                     if (prio == top[index]){
                        prio.classList.add('selecionada')
                   
                        for (let i = 0; i < top.length  ; i++) {
                            if ( top[i] != top[index]){
                            top[i].classList.remove('selecionada')
                            }
                        }
                        break
                    }
                   
                    
                }
            }
            else {
                priority = 'baixa';
                 for (let index = 0; index < top.length; index++) {
                     if (prio == top[index]){
                        prio.classList.add('selecionada')
                        
                        for (let i = 0; i < top.length  ; i++) {
                            if ( top[i] != top[index]){
                            top[i].classList.remove('selecionada')
                            }
                        }
                        break
                    }
                    
                }
            }

        })
    }

    modal.querySelector("#btnCriar").addEventListener("click", () => {
        const titulo = modal.querySelector("#tituloTarefa").value.trim();
        const descricao = modal.querySelector("#descricaoTarefa").value.trim();
        const startDate = modal.querySelector("#startDate").value;
        
        const endDate = modal.querySelector("#endDate").value;
        if (startDate == null){endDate=Date.now()}
        
        if (titulo === "") return;

        salvarTarefa(titulo, descricao,startDate,endDate,priority)
        modal.remove();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}

/* CRIAR TAREFA */
export function criarTarefa(id,titulo,descricao,startDate,endDate,priority,status) {
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

    tarefa.querySelector(".titulo-tarefa").addEventListener("click", () => {
        if (!modoEliminarTarefa) abrirModalDetalhes(titulo, descricao);
    });

    tarefa.querySelector(".check").addEventListener("click", (e) => {
        if (modoEliminarTarefa) e.stopPropagation();
    });
    
    if (status == 'por_fazer'){
        porFazer.appendChild(tarefa);
        document.getElementById(id).checked=false 
    }
    else if (status == 'concluida') {
        concluido.appendChild(tarefa)
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
document.addEventListener("change", async (e) => {  
    if (!e.target.classList.contains("check")) return;

    const tarefa = e.target.closest(".tarefa");
    let id = e.target.getAttribute('id')
    
    if (e.target.checked) {
        concluido.appendChild(tarefa);
        await statuTarefa(id)  

    } else {
        porFazer.appendChild(tarefa);
        await statuTarefa(id)  
    }
});

/* MODO ELIMINAR */
let modoEliminarTarefa = false;

const btnDelete = document.querySelector(".btn-delete");

btnDelete.addEventListener("click", () => {
    if (modoEliminarTarefa) {
        modoEliminarTarefa = false;
        btnDelete.classList.remove("ativo");
        return;
    }

    modoEliminarTarefa = true;
    btnDelete.classList.add("ativo");

    document.querySelectorAll(".modal").forEach(m => m.remove());
});

document.addEventListener("click", (e) => {
    if (!modoEliminarTarefa) return;

    const tarefa = e.target.closest(".tarefa");
    if (!tarefa) return;

    tarefa.remove();
    let id = tarefa.querySelector('input').getAttribute('id') 
    ApagarTarefa(id)

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
