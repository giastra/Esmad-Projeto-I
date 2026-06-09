import { carregarCores, initCriarCor } from '../controller/colorController.js';
import { atualizarDefault } from "../model/pomodoroModel.js";
import { getUsers, updateUserRole } from "../model/userModel.js";



// CORES

export const renderCores = (cores) => {
  const lista = document.getElementById('colorList');
  lista.innerHTML = "";

  cores.forEach(cor => {
    const div = document.createElement('div');
    div.className = "color-item";
    div.dataset.id = cor._id;

    div.innerHTML = `
      <div class="color-box" style="background:${cor.hex}"></div>

      <div class="color-info">
        <strong>${cor.name}</strong>
        <small>${cor.hex}</small>
      </div>

      <button class="btn-apagar">Eliminar</button>
    `;

    lista.appendChild(div);
  });
};

export const renderErro = (msg) => alert(msg);
export const renderSucesso = (msg) => alert(msg);

carregarCores();
initCriarCor();



// POMODORO DEFAULT (LOCALSTORAGE)


document.querySelector(".btn-alterar").addEventListener("click", () => {
    const foco = Number(document.getElementById("foco").value);
    const pausaCurta = Number(document.getElementById("pausa-curta").value);
    const pausaLonga = Number(document.getElementById("pausa-longa").value);
    const ciclos = Number(document.getElementById("ciclos").value);

    const novoDefault = {
        focusTime: foco,
        shortBreak: pausaCurta,
        longBreak: pausaLonga,
        cycles: ciclos
    };

    localStorage.setItem("pomodoroDefault", JSON.stringify(novoDefault));

    alert("Configurações guardadas com sucesso!");
});



// LISTAR UTILIZADORES 

let utilizadoresCache = []; // guardar todos os users carregados

async function carregarUtilizadores() {
    const res = await getUsers();
    console.log("getUsers ->", res); // DEBUG

    // Se a API devolver diretamente um array:
    if (Array.isArray(res)) {
        utilizadoresCache = res;
    } 
    // Se a API devolver { success, data }
    else if (res.success && Array.isArray(res.data)) {
        utilizadoresCache = res.data;
    } else {
        alert("Erro ao carregar utilizadores");
        return;
    }

    renderLista(utilizadoresCache);
}

// Renderizar lista filtrada ou completa
function renderLista(listaUsers) {
    const lista = document.querySelector(".users-list");
    lista.innerHTML = "";

    listaUsers.forEach(user => {
        const div = document.createElement("div");
        div.className = "user-item";

        const roles = user.roles || [];
        const isAdmin = roles.includes("admin");

        div.innerHTML = `
            <div class="user-info">
                <strong>${user.name || "Sem nome"}</strong>
                <small>${user.email || ""}</small>
            </div>

            <div class="user-actions">
                <button class="btn-promover">${isAdmin ? "Remover Admin" : "Promover a Admin"}</button>
            </div>
        `;

        div.querySelector(".btn-promover").addEventListener("click", async () => {
            const novosRoles = isAdmin
                ? roles.filter(r => r !== "admin")
                : [...roles, "admin"];

            const resUpdate = await updateUserRole(user._id, novosRoles);

            if (resUpdate.success) {
                alert("Alteração feita com sucesso!");
                carregarUtilizadores();
            } else {
                alert("Erro: " + resUpdate.message);
            }
        });

        lista.appendChild(div);
    });
}

// PESQUISA EM TEMPO REAL

document.getElementById("pesquisa").addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase().trim();

    const filtrados = utilizadoresCache.filter(user => {
        const nome = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        return nome.includes(texto) || email.includes(texto);
    });

    renderLista(filtrados);
});

// Inicializar utilizadores
carregarUtilizadores();
