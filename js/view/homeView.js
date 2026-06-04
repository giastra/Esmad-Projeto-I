import {rendTarefas,marcaConcluido,rendCategorias} from "../controller/homeController.js"

const middle = document.getElementById("middle");
const porFazer = document.getElementById("por-fazer");

/* CRIAR TAREFA */
export function criarTarefa(titulo, descricao, prioridade='green') {
    const tarefa = document.createElement("div");
    tarefa.classList.add("tarefa");

    tarefa.innerHTML = `
        <input type="checkbox" class="check" id='tarefas' name="${titulo}">
        <div class="texto titulo-tarefa">${titulo}</div>
        <span class="dot ${prioridade}"></span>
    `;

    tarefa.dataset.descricao = descricao;

    // abrir modal de detalhes ao clicar no título
    tarefa.querySelector(".titulo-tarefa").addEventListener("click", () => {
         abrirModalDetalhes(titulo, descricao);
    });

   tarefa.querySelector(".check").addEventListener("click", () => {
         let ev=(event.target.getAttribute('name'));
         marcaConcluido(ev)

    });

    porFazer.appendChild(tarefa);
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
// (titulo, cor , qauntas tarefas completas, quantas tarefas no total)
export function criarCard(titulo,color,ncomp=0,ntotal=0) {
    let porcenta = 100
    if (ntotal != 0){
        porcenta = (ncomp*100)/ntotal
    }

    const card = document.createElement("div");
    card.classList.add("category-card");

    card.innerHTML = `
    <div class="card p-4 mb-3" style="width: 300px; border-radius: 12px;">
        <h5 class="card-title mb-2" style="font-size: 16px;">${titulo}</h5>

        <div class="d-flex align-items-center gap-2">
            <div class="progress flex-grow-1" style="height: 8px; border-radius: 10px;">
                <div class="progress-bar" role="progressbar" style="width: ${porcenta}%; background:${color};"></div>
            </div>
            <span style="font-size: 12px; font-weight: 600;">${ncomp}/${ntotal}</span>
        </div>
    </div>
    `;

    middle.appendChild(card);
}

rendTarefas()
rendCategorias()
