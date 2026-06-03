import {rendTarefas,marcaConcluido,rendCategorias} from "../controller/homeController.js"

const middle = document.getElementById("");
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

export function cariarCategorias(){
    
}
rendTarefas()
