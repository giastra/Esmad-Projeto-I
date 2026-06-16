import { inicializarMapa } from '../controller/gameController.js';

/* ELEMENTOS */
const btnCidade = document.querySelector(".cidade-btn");

let modalCidade = null;
let mapaInicializado = false;

/* MODAL */
function criarModalCidade() {
  modalCidade = document.createElement("div");
  modalCidade.classList.add("cidade-modal");

  modalCidade.innerHTML = `
    <button class="close-modal">✖</button>
    <div class="c" id="sdfv">
      <img src="../images/fundo-cidade.png" class="fundo">
    </div>
  `;

  document.body.appendChild(modalCidade);

  const btnFechar = modalCidade.querySelector(".close-modal");
  btnFechar.addEventListener("click", () => {
    modalCidade.style.display = "none";
  });
}

criarModalCidade();

/* ABRIR / FECHAR MODAL */
btnCidade.addEventListener("click", () => {
  if (!modalCidade) return;

  const isVisible = modalCidade.style.display === "block";

  if (!isVisible) {
    modalCidade.style.display = "block";

    // espera modal estar visível para offsetWidth/Height serem correctos
    requestAnimationFrame(() => {
      if (!mapaInicializado) {
        inicializarMapa();
        mapaInicializado = true;
      }
    });
  } else {
    modalCidade.style.display = "none";
  }
});