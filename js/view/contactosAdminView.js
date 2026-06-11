
/* Carregar lista de contactos na coluna esquerda */
function carregarContactos() {
    const lista = document.getElementById("email-list");

    const mensagens = JSON.parse(localStorage.getItem("contactos")) || [];

    lista.innerHTML = "";

    mensagens.forEach((msg, index) => {
        const div = document.createElement("div");
        div.classList.add("contacto-item");

        div.innerHTML = `
            <h4>${msg.nome}</h4>
            <p>${msg.email}</p>
            <span>Ass: ${msg.assunto}</span>
            <button class="btn-delete" data-index="${index}">
                <img src="../images/Trash.png" alt="Apagar">
            </button>
        `;

        // Clicar no item → mostrar mensagem
        div.addEventListener("click", () => {
            mostrarMensagem(index);
        });

        lista.appendChild(div);
    });

    // Ativar botões delete
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", function (event) {
            event.stopPropagation(); 

            const index = this.getAttribute("data-index");

            apagarMensagem(index);
        });
    });
}

/* Mostrar mensagem completa na coluna direita */
function mostrarMensagem(index) {
    const mensagens = JSON.parse(localStorage.getItem("contactos")) || [];
    const msg = mensagens[index];

    const content = document.getElementById("email-content");

    content.innerHTML = `
        <h2>${msg.nome}</h2>
        <p><strong>Email:</strong> ${msg.email}</p>
        <p><strong>Assunto:</strong> ${msg.assunto}</p>
        <br>
        <p>${msg.mensagem}</p>
        <br>
        <small>Enviado em: ${msg.data}</small>
    `;
}

/* Carregar automaticamente ao abrir a página */
window.onload = carregarContactos;


//Apagar mensagem
function apagarMensagem(index) {
    let mensagens = JSON.parse(localStorage.getItem("contactos")) || [];

    mensagens.splice(index, 1); // remove 1 elemento na posição index

    localStorage.setItem("contactos", JSON.stringify(mensagens));

    carregarContactos(); // atualizar lista

    document.getElementById("email-content").innerHTML = ""; // limpar painel direito
}
