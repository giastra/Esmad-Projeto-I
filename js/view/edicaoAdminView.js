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





// POMODORO DEFAULT

import { carregarPomodoroDefault, atualizarPomodoroDefault } from '../controller/pomodoroController.js';

carregarPomodoroDefault((data) => {
  document.getElementById("pomo-name").value = data.name || "Classic Pomodoro";
  document.getElementById("foco").value = data.focusTime;
  document.getElementById("pausa-curta").value = data.shortBreak;
  document.getElementById("pausa-longa").value = data.longBreak;
  document.getElementById("ciclos").value = data.cycles;
});

document.querySelector(".btn-alterar").addEventListener("click", async () => {
  const dados = {
    name: document.getElementById("pomo-name").value,
    focusTime: Number(document.getElementById("foco").value),
    shortBreak: Number(document.getElementById("pausa-curta").value),
    longBreak: Number(document.getElementById("pausa-longa").value),
    cycles: Number(document.getElementById("ciclos").value)
  };

  await atualizarPomodoroDefault(dados);
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

// PROPS (Gamificação)

import { getProps, criarProp, atualizarProp, apagarProp } from '../controller/propController.js';

let propsCache = [];

async function carregarProps() {
  const res = await getProps();

  if (Array.isArray(res)) {
    propsCache = res;
  } else if (res.success && Array.isArray(res.data)) {
    propsCache = res.data;
  } else {
    alert("Erro ao carregar props");
    return;
  }

  renderProps(propsCache);
}

function renderProps(lista) {
  const container = document.getElementById('props-list');
  container.innerHTML = "";

  lista.forEach(prop => {
    const div = document.createElement('div');
    div.className = 'prop-item';
    div.dataset.id = prop._id;

    div.innerHTML = `
      <img src="${prop.img}" alt="${prop.name}" class="prop-img" />

      <div class="prop-info">
        <strong>${prop.name}</strong>
      </div>

      <div class="prop-actions">
        <button class="btn-editar-prop">Editar</button>
        <button class="btn-apagar-prop">Eliminar</button>
      </div>
    `;

    // Eliminar
    div.querySelector('.btn-apagar-prop').addEventListener('click', async () => {
      if (!confirm(`Eliminar "${prop.name}"?`)) return;
      const res = await apagarProp(prop._id);
      if (res.message) {
        carregarProps();
      } else {
        alert("Erro ao eliminar prop");
      }
    });

    // Editar — preenche o formulário com os dados atuais
    div.querySelector('.btn-editar-prop').addEventListener('click', () => {
      document.getElementById('prop-edit-id').value = prop._id;
      document.getElementById('prop-edit-name').value = prop.name;
      document.getElementById('prop-edit-preview').src = prop.img;
      document.getElementById('prop-edit-preview').style.display = 'block';
      document.getElementById('prop-edit-form').style.display = 'flex';
    });

    container.appendChild(div);
  });
}

// Criar novo prop
document.getElementById('prop-criar-form').addEventListener('submit', async (e) => {
  

  const name = document.getElementById('prop-name').value.trim();
  const imgFile = document.getElementById('prop-img').files[0];

  if (!name || !imgFile) return alert("Nome e imagem são obrigatórios");

  const res = await criarProp(name, imgFile);

  if (res._id) {
    document.getElementById('prop-criar-form').reset();
    carregarProps();
  } else {
    alert("Erro ao criar prop");
  }
});

// Preview da imagem ao criar
document.getElementById('prop-img').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById('prop-criar-preview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

// Atualizar prop existente
document.getElementById('prop-edit-guardar').addEventListener('click', async (e) => {
  

  const id = document.getElementById('prop-edit-id').value;
  const name = document.getElementById('prop-edit-name').value.trim();
  const imgFile = document.getElementById('prop-edit-img').files[0] || null;

  const res = await atualizarProp(id, name, imgFile);

  if (res._id) {
    document.getElementById('prop-edit-form').style.display = 'none';
    carregarProps();
  } else {
    alert("Erro ao atualizar prop");
  }
});

// Cancelar edição
document.getElementById('prop-edit-cancelar').addEventListener('click', () => {
  document.getElementById('prop-edit-form').style.display = 'none';
});

// Preview da imagem ao editar
document.getElementById('prop-edit-img').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById('prop-edit-preview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

carregarProps();