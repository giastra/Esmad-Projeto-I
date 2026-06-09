import { abrirModalLogin, abrirModalRegisto, fecharModais } from './userView.js';

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


// =========================
// MODAIS
// =========================

const injetarModais = () => {
  document.body.insertAdjacentHTML('beforeend', `

    <!-- MODAL LOGIN -->
    <div class="modal" id="modal-login" style="display:none;">
      <div class="modal-content">
        <button class="modal-fechar">&times;</button>
        <h2>Login</h2>
        <form id="form-login">
          <div class="mb-3">
            <label>Email</label>
            <input type="email" id="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input type="password" id="password" class="form-control" required />
          </div>
          <p id="erro-login" class="text-danger"></p>
          <button type="submit" class="btn w-100">Entrar</button>
        </form>
        <p class="mt-3 text-center">
          Não tens conta? <a href="#" id="ir-para-registo">Regista-te</a>
        </p>
      </div>
    </div>

    <!-- MODAL REGISTO -->
    <div class="modal" id="modal-registo" style="display:none;">
      <div class="modal-content">
        <button class="modal-fechar">&times;</button>
        <h2>Registo</h2>
        <form id="form-register">
          <div class="mb-3">
            <label>Nome</label>
            <input type="text" id="name" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>Email</label>
            <input type="email" id="email-register" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input type="password" id="password-register" class="form-control" required />
          </div>
          <p id="erro-register" class="text-danger"></p>
          <button type="submit" class="btn w-100">Registar</button>
        </form>
        <p class="mt-3 text-center">
          Já tens conta? <a href="#" id="ir-para-login">Faz login</a>
        </p>
      </div>
    </div>

  `);
};

injetarModais();

// Liga os botões de LOGIN e REGISTO após os modais existirem no DOM
document.querySelectorAll('.btn-login').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    fecharModais();
    abrirModalLogin();
  });
});

document.querySelectorAll('.btn-registo').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    fecharModais();
    abrirModalRegisto();
  });
});

// Fecha modal ao clicar fora
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModais();
  });
});

// Fecha modal ao clicar no X
document.querySelectorAll('.modal-fechar').forEach(btn => {
  btn.addEventListener('click', fecharModais);
});

// Troca para modal de registo
document.getElementById('ir-para-registo')?.addEventListener('click', (e) => {
  e.preventDefault();
  fecharModais();
  abrirModalRegisto();
});

// Troca para modal de login
document.getElementById('ir-para-login')?.addEventListener('click', (e) => {
  e.preventDefault();
  fecharModais();
  abrirModalLogin();
});