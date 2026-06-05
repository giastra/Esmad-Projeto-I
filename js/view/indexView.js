// =========================
// TABS 
// =========================
 
const tabs = document.querySelectorAll(".tab");
const conteudo = document.getElementById("conteudo");
const titulo = document.getElementById("conteudoTitulo");
 
const dados = {
    proposito: {
        titulo: "Propósito",
        texto: "O Stad To Do reúne ferramentas essenciais para uma organização simples e equilibrada: um gestor de tarefas intuitivo, um calendário claro, um diário para registar rotinas e emoções, e um temporizador Pomodoro que ajuda a manter o foco com ciclos de trabalho equilibrados."
    },
    game: {
        titulo: "Game",
        texto: "À medida que resolves tarefas, uma pequena cidade começa a crescer e a ganhar vida, revelando novos detalhes que acompanham o ritmo do teu progresso. Uma forma visual e motivadora de transformar organização em evolução."
    },
    funcionalidades: {
        titulo: "Funcionalidades",
        texto: "Divide tarefas complexas em blocos geríveis. Priorização inteligente, monitorização de progresso e criação de rotinas personalizadas — com um design funcional que elimina distrações e te mantém focado no essencial."
    }
};
 
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const d = dados[tab.dataset.tab];
        titulo.textContent = d.titulo;
        conteudo.textContent = d.texto;
    });
});
 