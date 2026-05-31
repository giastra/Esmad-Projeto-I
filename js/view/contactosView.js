document.querySelector(".btn-enviar").addEventListener("click", function () {

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const assunto = document.getElementById("assunto").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !assunto || !mensagem) {
        alert("Preenche todos os campos antes de enviar.");
        return;
    }

    const novaMensagem = {
        nome,
        email,
        assunto,
        mensagem,
        data: new Date().toLocaleString()
    };

    let mensagens = JSON.parse(localStorage.getItem("contactos")) || [];

    mensagens.push(novaMensagem);

    localStorage.setItem("contactos", JSON.stringify(mensagens));

    alert("Mensagem enviada com sucesso!");

    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("assunto").value = "";
    document.getElementById("mensagem").value = "";
});
