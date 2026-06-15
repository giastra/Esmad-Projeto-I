import { criar, getMinhasPosicoes, apagar } from '../model/gameModel.js';

// Gera coordenadas aleatórias dentro do mapa
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Renderiza todas as casas no mapa
async function renderizarCasas() {
  const container = document.getElementById('sdfv');
  if (!container) return;

  container.querySelectorAll('.sobreposta').forEach(el => el.remove());

  const res = await getMinhasPosicoes();
  const posicoes = res.data || res; 

  posicoes.forEach(pos => {
    const img = document.createElement('img');
    img.src = '../images/casa.png';
    img.classList.add('sobreposta');
    img.style.left = `${pos.y}px`;
    img.style.top = `${pos.x}px`;
    img.dataset.id = pos._id;
    container.appendChild(img);
  });
}

// Chamado quando uma tarefa é marcada como concluída
export async function onTarefaConcluida(tarefaId) {
  try {
    const x = getRandomInt(110, 500);
    const y = getRandomInt(10, 360);

    const nova = await criar({ x, y });

    if (nova._id) {
      await renderizarCasas();
    }
  } catch (err) {
    console.error('Erro ao adicionar casa:', err);
  }
}

// Chamado quando uma tarefa é eliminada ou revertida para 'por_fazer'
export async function onTarefaRemovidaOuRevertida(gameId) {
  try {
    await apagar(gameId);
    await renderizarCasas();
  } catch (err) {
    console.error('Erro ao remover casa:', err);
  }
}

// Inicializa o mapa com as casas já existentes
export async function inicializarMapa() {
  await renderizarCasas();
}