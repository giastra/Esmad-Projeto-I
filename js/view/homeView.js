import {rendTarefas,marcaConcluido,rendCategorias} from "../controller/homeController.js"

const middle = document.getElementById("middle");
const porFazer = document.getElementById("por-fazer");

/* CRIAR TAREFA */
// recebe 4 proriedades (o titulo da tarefa, a dercrição da tarefa, a prioridade da tarefa ('green','yellow' ou 'red'),se existe tarefa na lista(s/n))
export function criarTarefa(id,titulo, descricao, prioridade='green',temTarefa='s') {
    if (temTarefa=='s'){
    const tarefa = document.createElement("div");
    tarefa.classList.add("tarefa");

    tarefa.innerHTML = `
        <input type="checkbox" class="check" id='${id}'>
        <div class="texto titulo-tarefa">${titulo}</div>
        <span class="dot ${prioridade}"></span>
    `;

    tarefa.dataset.descricao = descricao;

    // abrir modal de detalhes ao clicar no título
    tarefa.querySelector(".titulo-tarefa").addEventListener("click", () => {
         abrirModalDetalhes(titulo, descricao);
    });

   tarefa.querySelector(".check").addEventListener("click", () => {
         marcaConcluido(id)

    });

    porFazer.appendChild(tarefa);
}
    else{
        const tarefa = document.createElement("div");
        tarefa.classList.add("tarefa");
        tarefa.innerHTML = `
            <div class="texto titulo-tarefa">Nenhuma tarefa criada</div>
        `;
        porFazer.appendChild(tarefa);
    }
}
/* MODAL DE DETALHES */
export function abrirModalDetalhes(titulo, descricao) {
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


/* CRIAR CARD DE CATEGORIA */
// (_id,titulo, cor , qauntas tarefas completas, quantas tarefas no total,se foi encontrado tarefa (s/n))
export function criarCard(id,titulo,color,ncomp=0,ntotal=0,temCategoria='s') {
    if (temCategoria == 's'){
    let porcenta = 100
    if (ntotal != 0){
        porcenta = (ncomp*100)/ntotal
    }

    const card = document.createElement("div");
    card.classList.add("category-card");

    card.innerHTML = `
    <div class="card p-4 mb-3" id='categoria' name="${id}">
        <h5 class="card-title mb-2" style="font-size: 16px;">${titulo}</h5>

        <div class="d-flex align-items-center gap-2">
            <div class="progress flex-grow-1" style="height: 8px; border-radius: 10px;">
                <div class="progress-bar" role="progressbar" style="width: ${porcenta}%; background:${color};" id='p ${id}'></div>
            </div>
            <span style="font-size: 12px; font-weight: 600;" id="${id}">${ncomp}/${ntotal}</span>
        </div>
    </div>
    `;
    middle.appendChild(card);

    // adiciona a possibilidade de entrar nas categoria selecionada
    card.addEventListener('click',function(){
        localStorage.setItem("categoria", id)
         window.location.href = "./Tarefas.html"
    })
}

// caso não exista cards
else{
    const card = document.createElement("div");
    card.classList.add("category-card");

    card.innerHTML = `
    <div class="card p-4 mb-3" style="width: 290px; border-radius: 12px" id='categoria'>
        <h5 class="card-title mb-2" style="font-size: 16px;">Nenhuma categoria criada</h5>
    </div>
    `;

    middle.appendChild(card);
}
}


// export function atualizarCard(id,n){
//     let cad = document.getElementById(id).innerHTML
//     cad = (cad.split('/'))
//     let res = (Number(cad[0])+n);
//     let ter = (cad[1])
    
//     document.getElementById(id).innerHTML = `${res}/${ter}`
//     document.getElementById(id) 
// }

// init
rendTarefas()
rendCategorias()
