/* ELEMENTOS */
const btn = document.querySelector(".acessibilidade-btn");
const overlay = document.querySelector(".tdha-rect-overlay");

let modal = null; 

/* MODAL */
function criarModalAcessibilidade() {
    modal = document.createElement("div");
    modal.classList.add("acessibilidade-modal");

modal.innerHTML = `
    <button class="close-modal">✖</button>

    <h3>Acessibilidade</h3>

    <div class="opcao">
        <label class="switch">
            <input type="checkbox" id="toggle-tdha">
            <span class="slider"></span>
        </label>
        <span class="switch-text">Modo TDAH</span>
    </div>

    <div class="opcao">
        <label class="switch">
            <input type="checkbox" id="toggle-dark">
            <span class="slider"></span>
        </label>
        <span class="switch-text">Modo Escuro</span>
    </div>

    <div class="opcao">
        <label class="switch">
            <input type="checkbox" id="toggle-font">
            <span class="slider"></span>
        </label>
        <span class="switch-text">Aumentar Letras</span>
    </div>
`;


    document.body.appendChild(modal);

    const toggle = modal.querySelector("#toggle-tdha");

    const estadoGuardado = localStorage.getItem("modoTdha");
    if (estadoGuardado === "1") {
        toggle.checked = true;
        overlay.style.display = "block";
    }

    toggle.addEventListener("change", () => {
        const ativo = toggle.checked;

        overlay.style.display = ativo ? "block" : "none";

        localStorage.setItem("modoTdha", ativo ? "1" : "0");
    });

    const closeBtn = modal.querySelector(".close-modal");
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

criarModalAcessibilidade();

/* ABRIR / FECHAR MODAL */
btn.addEventListener("click", () => {
    if (!modal) return;

    modal.style.display = modal.style.display === "block" ? "none" : "block";
});

/* MOVER O RETÂNGULO COM O RATO */
document.addEventListener("mousemove", (e) => {
    if (overlay.style.display !== "block") return;

    const yPercent = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty("--mouse-y", yPercent + "%");
});


// Toggle Dark Mode
const toggleDark = modal.querySelector("#toggle-dark");

// Aplicar estado guardado
const darkGuardado = localStorage.getItem("modoDark");
if (darkGuardado === "1") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
}

// Guardar quando muda
toggleDark.addEventListener("change", () => {
    const ativo = toggleDark.checked;

    if (ativo) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("modoDark", "1");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("modoDark", "0");
    }
});


// Toggle aumentar letras
const toggleFont = modal.querySelector("#toggle-font");

// Aplicar estado guardado
const fontGuardado = localStorage.getItem("fontLarge");
if (fontGuardado === "1") {
    document.body.classList.add("font-large");
    toggleFont.checked = true;
}

// Guardar quando muda
toggleFont.addEventListener("change", () => {
    const ativo = toggleFont.checked;

    if (ativo) {
        document.body.classList.add("font-large");
        localStorage.setItem("fontLarge", "1");
    } else {
        document.body.classList.remove("font-large");
        localStorage.setItem("fontLarge", "0");
    }
});


//NAVBAR HAMBURGUER

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
