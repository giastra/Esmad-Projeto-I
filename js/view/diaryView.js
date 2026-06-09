import {
  initDiarioController,
  criarDiario,
  atualizarDiario,
  apagarDiario,
  renderSucesso,
  renderErro,
  limparMensagens,
} from '../controller/diaryController.js';

// ─── ESTADO ───────────────────────────────────────────────

const estado = {
  entradas: [],
  ano: new Date().getFullYear(),
  mes: new Date().getMonth(),
  diaSelecionado: new Date().getDate()
};

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

// ─── NAVEGAÇÃO ───────────────────────────────────────────────

const atualizarNavegacao = () => {
  document.getElementById('ano-atual').textContent = estado.ano;
  document.getElementById('mes-atual').textContent = MESES[estado.mes];
  renderListaMes();
};

document.getElementById('btn-ano-anterior').onclick = () => {
  estado.ano--;
  atualizarNavegacao();
};

document.getElementById('btn-ano-seguinte').onclick = () => {
  estado.ano++;
  atualizarNavegacao();
};

document.getElementById('btn-mes-anterior').onclick = () => {
  if (estado.mes === 0) {
    estado.mes = 11;
    estado.ano--;
  } else {
    estado.mes--;
  }
  atualizarNavegacao();
};

document.getElementById('btn-mes-seguinte').onclick = () => {
  if (estado.mes === 11) {
    estado.mes = 0;
    estado.ano++;
  } else {
    estado.mes++;
  }
  atualizarNavegacao();
};

// ─── RENDER ───────────────────────────────────────────────

const renderDiarios = (entradas) => {
  estado.entradas = entradas || [];
  atualizarNavegacao();
};

const renderListaMes = () => {
  const lista = document.getElementById('lista-diarios');
  if (!lista) return;

  const diasNoMes = new Date(
    estado.ano,
    estado.mes + 1,
    0
  ).getDate();

  let html = '';

  for (let dia = 1; dia <= diasNoMes; dia++) {

    const entrada = estado.entradas.find(e => {
      const data = new Date(e.eventDate);

      return (
        data.getFullYear() === estado.ano &&
        data.getMonth() === estado.mes &&
        data.getDate() === dia
      );
    });

    html += `
      <div
        class="entrada-item ${dia === estado.diaSelecionado ? 'ativo' : ''}"
        data-dia="${dia}"
        data-id="${entrada ? entrada._id : ''}"
      >
        <span class="dia-numero">${dia}</span>
        <span class="dia-titulo">
          ${entrada ? entrada.title : 'Sem entrada'}
        </span>
      </div>
    `;
  }

  lista.innerHTML = html;
};

// ─── EDITOR ───────────────────────────────────────────────

const carregarNoEditor = (entrada) => {
  document.getElementById('entrada-id').value = entrada._id;
  document.getElementById('editor-titulo').value = entrada.title || '';
  document.getElementById('editor-conteudo').innerHTML = entrada.note || '';
  document.getElementById('editor-subtitulo').style.display = 'none';
  document.getElementById('btn-apagar-entrada').style.display = 'inline-block';
};

const limparEditor = () => {
  document.getElementById('entrada-id').value = '';
  document.getElementById('editor-titulo').value = '';
  document.getElementById('editor-conteudo').innerHTML = '';
  document.getElementById('editor-subtitulo').style.display = 'block';
  document.getElementById('btn-apagar-entrada').style.display = 'none';
};

// ─── GUARDAR ───────────────────────────────────────────────

document.getElementById('btn-guardar-entrada').onclick = async () => {

  limparMensagens();

  const id = document.getElementById('entrada-id').value;

  const dados = {
    title: document.getElementById('editor-titulo').value,
    note: document.getElementById('editor-conteudo').innerHTML,
    eventDate: new Date(
      estado.ano,
      estado.mes,
      estado.diaSelecionado
    ).toISOString()
  };

  if (!dados.title.trim()) {
    renderErro('Título obrigatório.');
    return;
  }

  const res = id
    ? await atualizarDiario(id, dados)
    : await criarDiario(dados);

  if (res.success) {
    renderSucesso('Guardado.');
    initDiarioController(renderDiarios);
  } else {
    renderErro(res.message);
  }
};

// ─── APAGAR ───────────────────────────────────────────────

document.getElementById('btn-apagar-entrada').onclick = async () => {

  const id = document.getElementById('entrada-id').value;

  if (!id) return;

  if (!confirm('Apagar entrada?')) return;

  const res = await apagarDiario(id);

  if (res.success) {
    renderSucesso('Apagado.');
    limparEditor();
    initDiarioController(renderDiarios);
  } else {
    renderErro(res.message);
  }
};

// ─── CLICK LISTA ───────────────────────────────────────────────

document.getElementById('lista-diarios').onclick = (e) => {

  const item = e.target.closest('.entrada-item');
  if (!item) return;

  estado.diaSelecionado = Number(item.dataset.dia);

  document
    .querySelectorAll('.entrada-item')
    .forEach(el => el.classList.remove('ativo'));

  item.classList.add('ativo');

  const id = item.dataset.id;

  if (!id) {
    limparEditor();
    return;
  }

  const entrada = estado.entradas.find(
    e => e._id === id
  );

  if (entrada) {
    carregarNoEditor(entrada);
  }
};

// ─── TOOLBAR ───────────────────────────────────────────────

document.getElementById('editor-toolbar').onclick = (e) => {

  const btn = e.target.closest('[data-cmd]');
  if (!btn) return;

  document.execCommand(btn.dataset.cmd, false, null);
};

// ─── INIT ───────────────────────────────────────────────

initDiarioController(renderDiarios);