import { initPomodoroController } from "../controller/pomodoroController.js";

/* Função da interface do Pomodoro */
export function pomodoroView() {
    return `
        <div class="pomodoro-content">
            <div class="pomodoro-container">
                <h3 id="pomo-label">Foco</h3>
                <div id="pomo-time">00:00</div>
                <div class="pomo-buttons">
                    <button id="pomo-start">Iniciar</button>
                    <button id="pomo-reset">Reset</button>
                    <button id="customize">Personalizar</button>
                </div>
            </div>
            <button class="close-pomodoro">Fechar</button>
        </div>
    `;
}

/* Botão da navbar */
const pomodoroLink = document.getElementById("btn-pomodoro");

/* Garante que o elemento existe */
if (pomodoroLink) {
    pomodoroLink.addEventListener("click", (e) => {
        e.preventDefault();

        const modal = document.createElement("div");
        modal.className = "pomodoro-modal";

        //conteúdo da modal
        modal.innerHTML = pomodoroView();

        document.body.appendChild(modal);

        initPomodoroController();
    });
}

