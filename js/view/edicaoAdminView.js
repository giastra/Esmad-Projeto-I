
import { getColors, criar } from '../model/colorModel.js';

/* BOTÕES E ELEMENTOS BASE (ZONA CATEGORIAS) */
const btnAdd = document.querySelector(".btn-add");
const middle = document.getElementById("middle");
const btnDeleteCategorias = document.querySelector(".btn-delete");

let modoEliminarCategoria = false;

/* ELEMENTOS DO FORMULÁRIO DE CRIAR CORES (ZONA ADMIN) */
const formCriarCor = document.querySelector("#formCriarCor") || document.querySelector(".form-cores");
const inputNomeCor = document.querySelector("#nomeCor") || document.querySelector(".input-name-color");
const inputHexCor = document.querySelector("#hexCor") || document.querySelector(".input-hex-color");

/* 1. INICIALIZAÇÃO DA PÁGINA */
document.addEventListener("DOMContentLoaded", () => {
    carregarCoresNoMenuAdmin();
});

/* 2. SUBMETER NOVA COR PARA O BACKEND VIA MODELO/SERVIÇO (ZONA ADMIN) */
if (formCriarCor) {
    formCriarCor.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = inputNomeCor.value.trim();
        const hex = inputHexCor.value.trim();

        if (!name || !hex) {
            alert("Por favor, preenche todos os campos da nova cor.");
            return;
        }

        try {
            // Usa a função 'criar' do teu ficheiro importado
            const resultado = await criar({ name, hex });

            if (resultado.success) {
                alert("Cor adicionada com sucesso!");
                formCriarCor.reset();
                // Atualiza a lista na página imediatamente
                carregarCoresNoMenuAdmin();
            } else {
                alert("Erro ao criar cor: " + (resultado.message || "Verifica os teus dados de Admin."));
            }
        } catch (erro) {
            console.error("Erro ao guardar nova cor:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    });
}

/* FUNÇÃO PARA DESENHAR A LISTA DE CORES EXISTENTES (ZONA ADMIN) */
async function carregarCoresNoMenuAdmin() {
    const divListCores = document.querySelector(".list-colores") || document.getElementById("listColores");
    if (!divListCores) return; 

    try {
        // Usa a função 'getColors' do teu ficheiro importado
        const resultado = await getColors();
        divListCores.innerHTML = ""; 

        if (!resultado.success || !resultado.data || resultado.data.length === 0) {
            divListCores.innerHTML = "<p class='text-muted p-2'>Nenhuma cor guardada na base de dados.</p>";
            return;
        }

        resultado.data.forEach(cor => {
            const elementoCor = document.createElement("div");
            elementoCor.className = "admin-color-item d-flex align-items-center gap-2 mb-2 p-2 border rounded shadow-sm";
            elementoCor.innerHTML = `
                <div style="width: 20px; height: 20px; border-radius: 50%; background: ${cor.hex}; border: 1px solid #ccc;"></div>
                <span><strong>${cor.name}</strong> — ${cor.hex}</span>
            `;
            divListCores.appendChild(elementoCor);
        });
    } catch (erro) {
        console.error("Erro ao carregar lista de cores:", erro);
        divListCores.innerHTML = "<p class='text-danger p-2'>Erro ao ligar ao servidor.</p>";
    }
}

/* 3. ABRIR JANELA MODAL DE CRIAR CATEGORIA */
if (btnAdd) {
    btnAdd.addEventListener("click", async () => {
        try {
            // Procura as cores através do modelo antes de desenhar o modal
            const resultado = await getColors();
            const coresVindasDoBanco = resultado.success ? resultado.data : [];
            criarModal(coresVindasDoBanco);
        } catch (erro) {
            console.error("Erro ao abrir modal com cores:", erro);
            criarModal([]); // Abre vazio em caso de erro crítico no servidor
        }
    });
}

function criarModal(cores) {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Criar Categoria</h2>

            <label>Título</label>
            <input type="text" id="tituloCategoria" placeholder="Nome da categoria">

            <label>Cor</label>
            <div class="color-select-wrapper">
                <select id="color"></select>
                <div id="colorPreview" class="color-preview-box"></div>
            </div>

            <button id="criarCategoria" class="btn-modal-add">Adicionar</button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    renderOpcoesCores(cores);

    modal.querySelector("#criarCategoria").addEventListener("click", () => {
        const titulo = modal.querySelector("#tituloCategoria").value.trim();
        const select = modal.querySelector("#color");
        
        if (titulo === "") return;

        // Captura o HEX guardado no dataset da option selecionada
        const corHex = select.selectedOptions[0] ? select.selectedOptions[0].dataset.hex : "#7b4bff";

        criarCard(titulo, corHex);
        modal.remove();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}

export function renderOpcoesCores(cores) {
    const select = document.getElementById("color");
    const preview = document.getElementById("colorPreview");

    if (!select) return;
    select.innerHTML = "";

    if (!cores || cores.length === 0) {
        const option = document.createElement("option");
        option.textContent = "Nenhuma cor disponível";
        option.value = "";
        select.appendChild(option);
        return;
    }

    cores.forEach(cor => {
        const option = document.createElement("option");
        option.value = cor._id;
        option.textContent = cor.name;
        option.dataset.hex = cor.hex; 
        select.appendChild(option);
    });

    select.addEventListener("change", () => {
        const hex = select.selectedOptions[0].dataset.hex;
        if (preview && hex) preview.style.background = hex;
    });

    if (cores.length > 0 && preview) {
        preview.style.background = cores[0].hex;
    }
}

/* CRIAR CARD DE CATEGORIA */
function criarCard(titulo, corHex) {
    if (!middle) return;
    const card = document.createElement("div");
    card.classList.add("category-card");

    card.innerHTML = `
    <div class="card p-4 mb-3" style="width: 300px; border-radius: 12px; border-left: 6px solid ${corHex};">
        <h5 class="card-title mb-2" style="font-size: 16px;">${titulo}</h5>

        <div class="d-flex align-items-center gap-2">
            <div class="progress flex-grow-1" style="height: 8px; border-radius: 10px;">
                <div class="progress-bar" role="progressbar" style="width: 0%; background: ${corHex};"></div>
            </div>
            <span style="font-size: 12px; font-weight: 600;">0/10</span>
        </div>
    </div>
    `;

    middle.appendChild(card);
}

/* MODO ELIMINAR CATEGORIAS */
if (btnDeleteCategorias) {
    btnDeleteCategorias.addEventListener("click", () => {
        modoEliminarCategoria = !modoEliminarCategoria;

        if (modoEliminarCategoria) {
            btnDeleteCategorias.classList.add("ativo");
        } else {
            btnDeleteCategorias.classList.remove("ativo");
        }

        document.querySelectorAll(".modal").forEach(m => m.remove());
    });
}

if (middle) {
    middle.addEventListener("click", (e) => {
        if (!modoEliminarCategoria) return;

        const card = e.target.closest(".category-card");
        if (!card) return;

        card.remove();

        modoEliminarCategoria = false;
        btnDeleteCategorias.classList.remove("ativo");
    });
}