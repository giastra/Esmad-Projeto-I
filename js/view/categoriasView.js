import {carregarCores,carregarCategorias,apagarCategoria,criarCategoria} from "../controller/taskCategoryController.js"
/* BOTÕES E ELEMENTOS BASE */

const btnAdd = document.querySelector(".btn-add");
const middle = document.getElementById("middle");
const btnDeleteCategorias = document.querySelector(".btn-delete");

let modoEliminarCategoria = false;


/* ABRIR MODAL DE CRIAR CATEGORIA */

btnAdd.addEventListener("click", () => {
    criarModal();
});

// configuração padrão de criação de card e modal
function criarModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Criar Categoria</h2>

            <label>Título</label>
            <input type="text" id="tituloCategoria" placeholder="Nome da categoria">
            <section id='cores'></section>
            <button id="criarCategoria" class="btn-modal-add">Adicionar</button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    // carrega as opções de cores 
    for (const cor of carregarCores()){ 
    document.getElementById('cores').innerHTML+=`
        <input type="button" style="background-color: ${cor.hex};" name="${cor._id}">
    `
    }
    let CorSelecionada=""
    document.getElementById('cores').addEventListener("click",function(){
        console.log(event.target.getAttribute('name'));
         CorSelecionada=event.target.getAttribute('name')
    })



    modal.querySelector("#criarCategoria").addEventListener("click", () => {
        const titulo = modal.querySelector("#tituloCategoria").value.trim();
        const cor = ''
        console.log(titulo);
        
        if (titulo === "") return;
        // criar categoria recebe (titulo da tarefa,cor)
        if (CorSelecionada != '') {criarCategoria(titulo,CorSelecionada)}
        // caso não receba cor
        else {criarCategoria(titulo)}
        modal.remove();
    });

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
    card.classList.add("category-card",id);

    card.innerHTML = `
    <div class="card p-4 mb-3" id='categoria' name="${id}">
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

    // adiciona a possibilidade de entrar nas categoria selecionada
    card.addEventListener('click',function(){
        if (modoEliminarCategoria == false){
        localStorage.setItem("categoria", id)
         window.location.href = "./Tarefas.html"
        }
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

// remove o card
middle.addEventListener("click", (e) => {
    if (!modoEliminarCategoria) return;

    const card = e.target.closest(".category-card");
    if (!card) return;

    card.remove();
    let id=card.getAttribute('class').split(' ')[1]
    apagarCategoria(id)


    modoEliminarCategoria = false;
    btnDeleteCategorias.classList.remove("ativo");
});

// init
carregarCategorias()