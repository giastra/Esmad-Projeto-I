// ELEMENTOS
const btn = document.querySelector(".acessibilidade-btn");
const overlay = document.querySelector(".tdha-rect-overlay");

let modal = null; 

// ---------------- MODAL ----------------
function criarModalAcessibilidade() {
    modal = document.createElement("div");
    modal.classList.add("acessibilidade-modal");

    modal.innerHTML = `
        <button class="close-modal">✖</button>

        <h3>Acessibilidade</h3>

        <label class="switch">
            <input type="checkbox" id="toggle-tdha">
            <span class="slider"></span>
        </label>
        <span class="switch-text">Modo TDAH</span>
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

// ---------------- ABRIR / FECHAR MODAL ----------------
btn.addEventListener("click", () => {
    if (!modal) return;

    modal.style.display = modal.style.display === "block" ? "none" : "block";
});

// ---------------- MOVER O RETÂNGULO COM O RATO ----------------
document.addEventListener("mousemove", (e) => {
    if (overlay.style.display !== "block") return;

    const yPercent = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty("--mouse-y", yPercent + "%");
});
