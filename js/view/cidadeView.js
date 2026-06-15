function getRandomInt(min, max) {
        min = Math.ceil(min); // Arredonda para cima
        max = Math.floor(max); // Arredonda para baixo
        return Math.floor(Math.random() * (max - min + 1)) + min; // Gera o número no intervalo
    }

    let n = 0
    let y = 0
    // document.getElementById('btt').addEventListener('click', function(){
    //     x=getRandomInt(110,500)
    //     y=getRandomInt(10,360)
    //     console.log(`x ${x}   y ${y}`);
        
    //     document.getElementById('sdfv').innerHTML+=`
    //     <img src="../images/casa.png" class="sobreposta" style=" left:${y}px ; top:${x}px ;">
    //     `
    // })


/* ELEMENTOS */
const asdrfghj = document.querySelector(".cidade-btn");
const qwertyui = document.querySelector(".cidade-overlay");

let dfgh = null; 

/* MODAL */
function criarModalAcessibilidade() {
    dfgh = document.createElement("div");
    dfgh.classList.add("cidade-modal");

    dfgh.innerHTML = `
        <button class="close-modal">✖</button>

       <div class="c" id="sdfv">
        <img src="../images/fundo-cidade.png" class="fundo">
        <img src="../images/casa.png" class="sobreposta" >
        </div>
    `;

    document.body.appendChild(dfgh);

    /* ---------------- FECHAR MODAL ---------------- */
    const closeBtn = dfgh.querySelector(".close-modal");
    closeBtn.addEventListener("click", () => {
        dfgh.style.display = "none";
    });
    
}

criarModalAcessibilidade()
    /* ABRIR / FECHAR MODAL */
asdrfghj.addEventListener("click", () => {
    if (!dfgh) return;

    dfgh.style.display = dfgh.style.display === "block" ? "none" : "block";
});