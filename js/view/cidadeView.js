import { inicializarMapa } from '../controller/gameController.js';

/* ELEMENTOS */
const asdrfghj = document.querySelector(".cidade-btn");

let dfgh = null;

/* MODAL */
function criarModalAcessibilidade() {
  dfgh = document.createElement("div");
  dfgh.classList.add("cidade-modal");

  dfgh.innerHTML = `
    <button class="close-modal">✖</button>
    <div class="c" id="sdfv">
      <img src="../images/fundo-cidade.png" class="fundo">
    </div>
  `;

  document.body.appendChild(dfgh);

  /* FECHAR MODAL */
  const closeBtn = dfgh.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => {
    dfgh.style.display = "none";
  });
}

criarModalAcessibilidade();

/* ABRIR / FECHAR MODAL */
asdrfghj.addEventListener("click", () => {
  if (!dfgh) return;

  const isVisible = dfgh.style.display === "block";

  if (!isVisible) {
    dfgh.style.display = "block";
    inicializarMapa(); 
  } else {
    dfgh.style.display = "none";
  }
});