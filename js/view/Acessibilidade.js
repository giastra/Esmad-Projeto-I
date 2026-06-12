
//ESCONDER BOTOES DE LOGIN E REGISTO
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const isLogged = !!token;

    const isIndex =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/index");

    const btnLogin = document.querySelector(".btn-login");
    const btnRegisto = document.querySelector(".btn-registo");
    const logoLink = document.querySelector(".logo-link");
    const btnHome = document.querySelector(".btn-home");

    // INDEX → mostrar sempre login/registo e esconder botão Home
    if (isIndex) {
        if (btnLogin) btnLogin.style.display = "inline-block";
        if (btnRegisto) btnRegisto.style.display = "inline-block";
        if (btnHome) btnHome.style.display = "none";
        return;
    }

    // OUTRAS PÁGINAS → esconder login/registo e mostrar botão Home
    if (isLogged) {
        if (btnLogin) btnLogin.style.display = "none";
        if (btnRegisto) btnRegisto.style.display = "none";

        if (logoLink) {
            logoLink.removeAttribute("href");
            logoLink.style.cursor = "default";
        }

        if (btnHome) btnHome.style.display = "inline-block";
    }
});

// Botão HOME 
document.querySelector(".btn-home")?.addEventListener("click", () => {
    window.location.href = "Home.html"; // ajusta o caminho se necessário
});


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
            <span class="switch-text">Tamanho da Letra</span>

            <div class="font-size-control">
                <button id="font-minus">-</button>
                <input type="text" id="font-level" value="0" readonly>
                <button id="font-plus">+</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    /* ---------------- MODO TDAH ---------------- */
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

    /* ---------------- FECHAR MODAL ---------------- */
    const closeBtn = modal.querySelector(".close-modal");
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    /* ---------------- CONTROLO TAMANHO DA FONTE ---------------- */
    let fontLevel = parseInt(localStorage.getItem("fontLevel")) || 0;
    const maxLevel = 5;

    const fontInput = modal.querySelector("#font-level");
    const btnPlus = modal.querySelector("#font-plus");
    const btnMinus = modal.querySelector("#font-minus");

    fontInput.value = fontLevel;

    function aplicarTamanhoFonte() {
        document.body.classList.remove(
            "font-size-0", "font-size-1", "font-size-2",
            "font-size-3", "font-size-4", "font-size-5"
        );

        document.body.classList.add(`font-size-${fontLevel}`);
    }

    aplicarTamanhoFonte();

    btnPlus.addEventListener("click", () => {
        if (fontLevel < maxLevel) {
            fontLevel++;
            fontInput.value = fontLevel;
            localStorage.setItem("fontLevel", fontLevel);
            aplicarTamanhoFonte();
        }
    });

    btnMinus.addEventListener("click", () => {
        if (fontLevel > 0) {
            fontLevel--;
            fontInput.value = fontLevel;
            localStorage.setItem("fontLevel", fontLevel);
            aplicarTamanhoFonte();
        }
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

/* ---------------- MODO DARK ---------------- */
const toggleDark = modal.querySelector("#toggle-dark");

const darkGuardado = localStorage.getItem("modoDark");
if (darkGuardado === "1") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
}

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

/* ---------------- NAVBAR HAMBURGUER ---------------- */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
});


