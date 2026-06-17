import { getMinhasTarefas } from '../model/taskModel.js';
import { requireAuth } from '../utils/helpers.js';

requireAuth();

//ESTADO
const hoje  = new Date();
let ano     = hoje.getFullYear();
let mes     = hoje.getMonth();
let tarefas = [];

//ELEMENTOS
const calMes    = document.getElementById('cal-mes');
const calAno    = document.getElementById('cal-ano');
const calGrid   = document.getElementById('cal-grid');
const loading   = document.getElementById('cal-loading');
const modalBg   = document.getElementById('modal-bg');
const modalTit  = document.getElementById('modal-titulo');
const modalLst  = document.getElementById('modal-lista');

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DOWS  = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];

//PREENCHER SELECT ANO
const preencherAnos = () => {
  for (let a = ano - 3; a <= ano + 5; a++) {
    const opt = document.createElement('option');
    opt.value = a;
    opt.textContent = a;
    if (a === ano) opt.selected = true;
    calAno.appendChild(opt);
  }
};

//TAREFAS NUM DIA
const tarefasDia = (a, m, d) => {
  const dia = new Date(a, m, d);
  dia.setHours(0, 0, 0, 0);
  return tarefas.filter(t => {
    const ini = new Date(t.startDate); ini.setHours(0, 0, 0, 0);
    const fim = t.endDate ? new Date(t.endDate) : new Date(t.startDate);
    fim.setHours(23, 59, 59, 999);
    return dia >= ini && dia <= fim;
  });
};

//RENDERIZAR GRELHA
const render = () => {
  calMes.textContent = MESES[mes].toUpperCase();
  calAno.value = ano;
  calGrid.innerHTML = '';

  // Cabeçalho
  DOWS.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    calGrid.appendChild(el);
  });

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia   = new Date(ano, mes + 1, 0).getDate();
  const ultAnterior = new Date(ano, mes, 0).getDate();

  let dow = primeiroDia.getDay();
  dow = dow === 0 ? 6 : dow - 1; // começa na segunda

  // Dias do mês anterior
  for (let i = dow - 1; i >= 0; i--) {
    calGrid.appendChild(criarCelula(ultAnterior - i, true));
  }

  // Dias do mês atual
  for (let d = 1; d <= ultimoDia; d++) {
    const isHoje = d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
    calGrid.appendChild(criarCelula(d, false, isHoje));
  }

  // Completar grelha
  const total = dow + ultimoDia;
  const resto = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= resto; d++) {
    calGrid.appendChild(criarCelula(d, true));
  }
};

//CRIAR CÉLULA
const criarCelula = (dia, outroMes, isHoje = false) => {
  const cell = document.createElement('div');
  cell.className = 'cal-cell' + (outroMes ? ' outro-mes' : '') + (isHoje ? ' hoje' : '');

  const num = document.createElement('div');
  num.className = 'cal-cell-num';
  const sp = document.createElement('span');
  sp.textContent = String(dia).padStart(2, '0');
  num.appendChild(sp);
  cell.appendChild(num);

  if (!outroMes) {
    const lista = tarefasDia(ano, mes, dia);
    const MAX = 3;

    lista.slice(0, MAX).forEach(t => {
      const tag = document.createElement('div');
      tag.className = `cal-tag ${t.priority}`;
      tag.textContent = t.name;
      cell.appendChild(tag);
    });

    if (lista.length > MAX) {
      const mais = document.createElement('div');
      mais.className = 'cal-tag mais';
      mais.textContent = `+${lista.length - MAX} mais`;
      cell.appendChild(mais);
    }

    cell.addEventListener('click', () => abrirModal(dia, lista));
  }

  return cell;
};

//MODAL
const cores    = { alta: '#FAECE7', normal: '#EEEDFE', baixa: '#E1F5EE' };
const tcores   = { alta: '#993C1D', normal: '#3C3489', baixa: '#085041' };
const fmtData  = new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' });
const fmtTitulo = new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });

const abrirModal = (dia, lista) => {
  modalTit.textContent = fmtTitulo.format(new Date(ano, mes, dia));
  modalLst.innerHTML = '';

  if (lista.length === 0) {
    modalLst.innerHTML = '<p class="modal-vazio">Sem tarefas neste dia.</p>';
  } else {
    lista.forEach(t => {
      const div = document.createElement('div');
      div.className = 'modal-tarefa';
      div.style.background = cores[t.priority] || '#f0f0f0';
      div.style.color = tcores[t.priority] || '#333';
      const ini = fmtData.format(new Date(t.startDate));
      const fim = t.endDate ? fmtData.format(new Date(t.endDate)) : ini;
      const labelStatus = { por_fazer: 'Por fazer', concluida: 'Concluída' };
      div.innerHTML = `
        <strong>${t.name}</strong>
        <span>${ini} → ${fim} &nbsp;·&nbsp; ${labelStatus[t.status] || t.status}</span>
      `;
      modalLst.appendChild(div);
    });
  }

  modalBg.classList.add('open');
};

document.getElementById('modal-close').addEventListener('click', () => modalBg.classList.remove('open'));
modalBg.addEventListener('click', e => { if (e.target === modalBg) modalBg.classList.remove('open'); });

//NAVEGAÇÃO 
document.getElementById('btn-prev').addEventListener('click', () => {
  mes--; if (mes < 0) { mes = 11; ano--; } render();
});
document.getElementById('btn-next').addEventListener('click', () => {
  mes++; if (mes > 11) { mes = 0; ano++; } render();
});
calAno.addEventListener('change', e => { ano = Number(e.target.value); render(); });

//INIT 
const init = async () => {
  preencherAnos();

  const res = await getMinhasTarefas();

  if (res.success) {
    tarefas = res.data.filter(t => t.status !== 'concluida');
  }

  loading.style.display = 'none';
  calGrid.style.display = 'grid';
  render();
}
init();