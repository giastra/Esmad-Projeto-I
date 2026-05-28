import pomodoroModel from "../model/pomodoroModel.js";

export function initPomodoroController() {

    let focusTime = pomodoroModel.focusTime * 60;
    let shortBreak = pomodoroModel.shortBreak * 60;
    let longBreak = pomodoroModel.longBreak * 60;
    let cycles = pomodoroModel.cycles;

    let currentTime = focusTime;
    let interval = null;
    let cycleCount = 0;
    let mode = "focus";

    const timeDisplay = document.getElementById("pomo-time");
    const label = document.getElementById("pomo-label");
    const startBtn = document.getElementById("pomo-start");
    const resetBtn = document.getElementById("pomo-reset");

    function updateDisplay() {
        let m = Math.floor(currentTime / 60);
        let s = currentTime % 60;
        timeDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    //INICIAR
    function startTimer() {
        if (interval) return;

        interval = setInterval(() => {
            currentTime--;
            updateDisplay();

            if (currentTime <= 0) {
                clearInterval(interval);
                interval = null;
                startBtn.textContent = "Iniciar";
                nextPhase();
            }
        }, 1000);
    }
    //PAUSA
    function pauseTimer() {
        clearInterval(interval);
        interval = null;
    }
    //RESET
    function resetTimer() {
        pauseTimer();
        mode = "focus";
        currentTime = focusTime;
        label.textContent = "Foco";
        startBtn.textContent = "Iniciar";
        updateDisplay();
    }

    function nextPhase() {
        if (mode === "focus") {
            cycleCount++;

            if (cycleCount % cycles === 0) {
                mode = "long";
                currentTime = longBreak;
                label.textContent = "Pausa Longa";
            } else {
                mode = "short";
                currentTime = shortBreak;
                label.textContent = "Pausa Curta";
            }

        } else {
            mode = "focus";
            currentTime = focusTime;
            label.textContent = "Foco";
        }

        updateDisplay();
        startTimer();
    }

    // BOTÃO INICIAR/PARAR (TOGGLE)
    startBtn.addEventListener("click", () => {
        if (!interval) {
            startTimer();
            startBtn.textContent = "Pausar";
        } else {
            pauseTimer();
            startBtn.textContent = "Iniciar";
        }
    });

    resetBtn.onclick = resetTimer;

    updateDisplay();
}
