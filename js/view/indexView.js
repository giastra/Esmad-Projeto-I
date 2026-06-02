// =========================
// ELEMENTOS
// =========================
const tabs = document.querySelectorAll(".tab");
const conteudo = document.getElementById("conteudo");
const infoBox = document.getElementById("infoBox");

// =========================
// TEXTOS DAS TABS
// =========================
const textos = {
    proposito:
        "O Stad To Do reúne ferramentas essenciais para uma organização simples e equilibrada: um gestor de tarefas intuitivo, um calendário claro, um diário para registar rotinas e emoções, e um temporizador Pomodoro que ajuda a manter o foco com ciclos de trabalho equilibrados.",

    game:
        "O site inclui uma experiência interativa onde a produtividade ganha forma. À medida que o utilizador vai resolvendo tarefas, uma pequena cidade começa a crescer e a ganhar vida, revelando novos detalhes e construções que acompanham o ritmo do seu progresso. É uma forma leve, visual e motivadora de transformar organização em evolução — um mundo que se desenvolve passo a passo, tal como o dia do utilizador.",

    funcionalidades:
        "O Stad To Do simplifica a tua rotina ao dividir tarefas complexas em blocos geríveis, combatendo a sobrecarga mental. Através da priorização inteligente, monitorização de progresso e criação de rotinas personalizadas, a plataforma ajuda-te a manter o foco no essencial. Com um design funcional que elimina distrações, transformamos os teus objetivos em conquistas reais, um passo de cada vez."
};

// =========================
// CORES DA INFOBOX
// =========================
const cores = {
    proposito: "#ff9100",
    game: "#ff9100",
    funcionalidades: "#ff9100"
};

// =========================
// DEFINIR COR INICIAL
// =========================
const tabAtiva = document.querySelector(".tab.active");
if (tabAtiva) {
    const chaveInicial = tabAtiva.dataset.tab;
    infoBox.style.background = cores[chaveInicial];
    conteudo.textContent = textos[chaveInicial];
}

// =========================
// EVENTOS DAS TABS
// =========================
tabs.forEach(tab => {
    tab.addEventListener("click", () => {


        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const chave = tab.dataset.tab;

        // atualizar texto e cor
        conteudo.textContent = textos[chave];
        infoBox.style.background = cores[chave];
    });
});
