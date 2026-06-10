import {carregarCores,carregarCategorias} from "../controller/taskCategoryController.js"
/* BOTÕES E ELEMENTOS BASE */

const btnAdd = document.querySelector(".btn-add");
const middle = document.getElementById("middle");
const btnDeleteCategorias = document.querySelector(".btn-delete");

let modoEliminarCategoria = false;
carregarCategorias()

/* ABRIR MODAL DE CRIAR CATEGORIA */

btnAdd.addEventListener("click", () => {
    criarModal();
});
console.log(carregarCores());

function criarModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Criar Categoria</h2>

            <label>Título</label>
            <input type="text" id="tituloCategoria" placeholder="Nome da categoria">
            <input type='button' id="" >
            <button id="criarCategoria" class="btn-modal-add">Adicionar</button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    modal.querySelector("#criarCategoria").addEventListener("click", () => {
        const titulo = modal.querySelector("#tituloCategoria").value.trim();
        if (titulo === "") return;

        criarCard(titulo);
        modal.remove();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}


/* CRIAR CARD DE CATEGORIA */

function criarCard(titulo) {
    const card = document.createElement("div");
    card.classList.add("category-card");

    card.innerHTML = `
    <div class="card p-4 mb-3" style="width: 300px; border-radius: 12px;">
        <h5 class="card-title mb-2" style="font-size: 16px;">${titulo}</h5>

        <div class="d-flex align-items-center gap-2">
            <div class="progress flex-grow-1" style="height: 8px; border-radius: 10px;">
                <div class="progress-bar" role="progressbar" style="width: 0%; background:#7b4bff;"></div>
            </div>
            <span style="font-size: 12px; font-weight: 600;">0/10</span>
        </div>
    </div>
    `;

    middle.appendChild(card);
}


/* MODO ELIMINAR CATEGORIAS */

btnDeleteCategorias.addEventListener("click", () => {

    // Toggle
    modoEliminarCategoria = !modoEliminarCategoria;

    if (modoEliminarCategoria) {
        btnDeleteCategorias.classList.add("ativo");
    } else {
        btnDeleteCategorias.classList.remove("ativo");
    }

    document.querySelectorAll(".modal").forEach(m => m.remove());
});

middle.addEventListener("click", (e) => {
    if (!modoEliminarCategoria) return;

    const card = e.target.closest(".category-card");
    if (!card) return;

    card.remove();

    modoEliminarCategoria = false;
    btnDeleteCategorias.classList.remove("ativo");
});

