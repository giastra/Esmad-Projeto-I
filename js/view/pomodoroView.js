import { initPomodoroController } from "../controller/pomodoroController.js";

/* Função da interface do Pomodoro */
export function pomodoroView() {
    return `
        <style>
            .pomodoro-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.55);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
            }

            .pomodoro-content {
                background: #ffffff;
                padding: 30px;
                border-radius: 15px;
                width: 500px;
                text-align: center;
                box-shadow: 0 0 20px rgba(0,0,0,0.2);
                animation: fadeIn 0.25s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
                
            /* Botão de fechar o modal */
            .close-pomodoro {
                margin-top: 20px;
                padding: 10px 20px;
                background: #ff4d4d;
                border: none;
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                transition: 0.2s;
            }

            .close-pomodoro:hover {
                background: #e63939;
            }

            .pomodoro-container {
                margin-top: 10px;
            }

            #pomo-label {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 15px;
            }

            #pomo-time {
                font-size: 75px;
                font-weight: bold;
                margin: 20px 0;
                color: #333;
            }

            .pomo-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
            }

            #pomo-start {
                padding: 10px 18px;
                background: #ff7b00;
                border: none;
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                transition: 0.2s;
            }
            #pomo-start:hover {
                background: #feaa2c;
                color: #ffffff;
            }
            #pomo-reset {
                padding: 10px 18px;
                background: #ff7b00;
                border: none;
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                transition: 0.2s;
            }

            #pomo-reset:hover {
                background: #feaa2c;
                color: rgb(255, 255, 255);
            }


            #customize{
                padding: 10px 18px;
                background: #0077ff;
                border: none;
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                transition: 0.2s;
            }

            #customize:hover {
                background: #005fcc;
            }
        </style>

        <div class="pomodoro-container">
            <h2 id="pomo-label">Foco</h2>

            <div id="pomo-time">00:00</div>

            <div class="pomo-buttons">
                <button id="pomo-start">Iniciar</button>
                <button id="pomo-reset">Reset</button>
                <button id="customize">Personalizar</button>
            </div>
        </div>
    `;
}


/* Obtém o botão que abre o Pomodoro */
const pomodoroLink = document.getElementById("btn-pomodoro");

/* Função Abrir Modal */
pomodoroLink.addEventListener("click", (e) => {
    e.preventDefault();

    const modal = document.createElement("div");
    modal.className = "pomodoro-modal";

    modal.innerHTML = `
        <div class="pomodoro-content">
            <h2>POMODORO</h2>
            ${pomodoroView()} 
            <button id="close-pomodoro" class="close-pomodoro">Terminar</button>
        </div>
    `;

    document.body.appendChild(modal);

    /* Botão para fechar o modal */
    document.getElementById("close-pomodoro").onclick = () => modal.remove();

    initPomodoroController();
});

