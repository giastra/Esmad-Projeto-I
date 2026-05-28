const btnAdd = document.querySelector(".btn-add");
const porFazer = document.getElementById("por-fazer");
const concluido = document.getElementById("concluido");

/* ============================
   ABRIR MODAL DE CRIAÇÃO
============================ */
btnAdd.addEventListener("click", () => {
    criarModal();
});

/* ============================
   MODAL DE CRIAÇÃO (CSS PURO)
============================ */
function criarModal() {
    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
        <div class="modal-content">

            <h4>Adicionar Tarefa</h4>

            <label>Nome da Tarefa</label>
            <input type="text" id="tituloTarefa">

            <label>Descrição</label>
            <textarea id="descricaoTarefa"></textarea>

            <button class="btn-modal-add" id="btnCriar">Concluir</button>
            

        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    modal.querySelector("#btnCriar").addEventListener("click", () => {
        const titulo = modal.querySelector("#tituloTarefa").value.trim();
        const descricao = modal.querySelector("#descricaoTarefa").value.trim();

        if (titulo === "") return;

        criarTarefa(titulo, descricao);
        modal.remove();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}

/* ============================
   CRIAR TAREFA
============================ */
function criarTarefa(titulo, descricao) {
    const tarefa = document.createElement("div");
    tarefa.classList.add("tarefa");

    tarefa.innerHTML = `
        <input type="checkbox" class="check">
        <div class="texto titulo-tarefa">${titulo}</div>
        <span class="dot yellow"></span>
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

    porFazer.appendChild(tarefa);
}

/* ============================
   MODAL DE DETALHES
============================ */
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

/* ============================
   MOVER ENTRE COLUNAS
============================ */
document.addEventListener("change", (e) => {
    if (!e.target.classList.contains("check")) return;

    const tarefa = e.target.closest(".tarefa");

    if (e.target.checked) {
        concluido.appendChild(tarefa);
    } else {
        porFazer.appendChild(tarefa);
    }
});

/* ============================
   MODO ELIMINAR
============================ */
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

    // Desligar modo eliminar depois de apagar
    modoEliminarTarefa = false;
    btnDelete.classList.remove("ativo");
});
