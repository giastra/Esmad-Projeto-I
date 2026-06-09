// Carregar default do LocalStorage ou usar valores padrão
let pomodoroDefault = JSON.parse(localStorage.getItem("pomodoroDefault")) || {
    name: "Classic Pomodoro",
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    cycles: 4
};

// Variáveis globais
let currentTime = pomodoroDefault.focusTime * 60;
let mode = "focus"; 
let cycleCount = 0;
let interval = null;
let isRunning = false;

// ELEMENTOS DO HTML
const timeDisplay = document.getElementById("pomo-time");
const label = document.getElementById("pomo-label");
const btnStart = document.getElementById("pomo-start");
const btnReset = document.getElementById("pomo-reset");

// Atualiza o display
function updateDisplay() {
    const m = Math.floor(currentTime / 60);
    const s = currentTime % 60;
    timeDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Iniciar contagem
function startTimer() {
    if (interval) return;

    interval = setInterval(() => {
        currentTime--;
        updateDisplay();

        if (currentTime <= 0) {
            clearInterval(interval);
            interval = null;
            isRunning = false;
            btnStart.textContent = "Iniciar";
            nextPhase();
        }
    }, 1000);
}

// Pausar contagem
function pauseTimer() {
    clearInterval(interval);
    interval = null;
}

// Reset
function resetTimer() {
    pauseTimer();
    mode = "focus";
    currentTime = pomodoroDefault.focusTime * 60;
    label.textContent = "Foco";
    updateDisplay();
    btnStart.textContent = "Iniciar";
    isRunning = false;
}

// Próxima fase
function nextPhase() {
    if (mode === "focus") {
        cycleCount++;

        if (cycleCount % pomodoroDefault.cycles === 0) {
            mode = "long";
            currentTime = pomodoroDefault.longBreak * 60;
            label.textContent = "Pausa Longa";
        } else {
            mode = "short";
            currentTime = pomodoroDefault.shortBreak * 60;
            label.textContent = "Pausa Curta";
        }
    } else {
        mode = "focus";
        currentTime = pomodoroDefault.focusTime * 60;
        label.textContent = "Foco";
    }

    updateDisplay();
    startTimer();
}

// BOTÃO INICIAR/PAUSAR
btnStart.addEventListener("click", () => {
    if (!isRunning) {
        startTimer();
        btnStart.textContent = "Pausar";
        isRunning = true;
    } else {
        pauseTimer();
        btnStart.textContent = "Iniciar";
        isRunning = false;
    }
});

// BOTÃO RESET
btnReset.addEventListener("click", resetTimer);

// Inicializar display
updateDisplay();
