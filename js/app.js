import { carregarTarefas } from './api.js';
import { renderizarQuadro, atualizarStatusAcessivel } from './renderizacao.js';

const estado = {
  tarefas: [],
  busca: '',
  status: 'todos',
  prioridade: 'todas',
  ordenacao: 'prazo-asc',
  carregamento: false,
  erro: null
};


function lerParametrosUrl() {
  const params = new URLSearchParams(window.location.search);

  if (params.has('busca')) estado.busca = params.get('busca');
  if (params.has('status')) estado.status = params.get('status');
  if (params.has('prioridade')) estado.prioridade = params.get('prioridade');
  if (params.has('ordenacao')) estado.ordenacao = params.get('ordenacao');
}


function sincronizarUrlComEstado() {
  const params = new URLSearchParams();

  if (estado.busca.trim() !== '') params.set('busca', estado.busca);
  if (estado.status !== 'todos') params.set('status', estado.status);
  if (estado.prioridade !== 'todas') params.set('prioridade', estado.prioridade);
  if (estado.ordenacao !== 'prazo-asc') params.set('ordenacao', estado.ordenacao);

  const novaQuery = params.toString();
  const novaUrl = novaQuery ? `${window.location.pathname}?${novaQuery}` : window.location.pathname;

  window.history.replaceState(null, '', novaUrl);
}

function sincronizarControlesComEstado() {
  const inputBusca = document.getElementById('buscaTarefa');
  const selectStatus = document.getElementById('status');
  const selectPrioridade = document.getElementById('prioridade');
  const selectOrdenacao = document.getElementById('ordenacao');

  if (inputBusca) inputBusca.value = estado.busca;
  if (selectStatus) selectStatus.value = estado.status;
  if (selectPrioridade) selectPrioridade.value = estado.prioridade;
  if (selectOrdenacao) selectOrdenacao.value = estado.ordenacao;
}

function normalizarTexto(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function obterTarefasFiltradas(estadoAtual) {
  let resultado = [...estadoAtual.tarefas];

  if (estadoAtual.busca.trim() !== '') {
    const termo = normalizarTexto(estadoAtual.busca);
    resultado = resultado.filter((t) => normalizarTexto(t.titulo).includes(termo));
  }

  if (estadoAtual.status !== 'todos') {
    resultado = resultado.filter((t) => t.status === estadoAtual.status);
  }

  if (estadoAtual.prioridade !== 'todas') {
    const prioFiltro = normalizarTexto(estadoAtual.prioridade);
    resultado = resultado.filter((t) => normalizarTexto(t.prioridade) === prioFiltro);
  }

  resultado.sort((a, b) => {
    const dataA = new Date(a.prazo);
    const dataB = new Date(b.prazo);
    return estadoAtual.ordenacao === 'prazo-asc' ? dataA - dataB : dataB - dataA;
  });

  return resultado;
}

function atualizarInterface() {
  const quadro = document.querySelector('section[aria-labelledby="titulo-quadro"]');

  sincronizarUrlComEstado();

  if (estado.carregamento) {
    atualizarStatusAcessivel('Carregando tarefas do servidor...');
    renderizarQuadro([], quadro);
    return;
  }

  if (estado.erro) {
    atualizarStatusAcessivel(estado.erro);
    renderizarQuadro([], quadro);
    return;
  }

  if (estado.tarefas.length === 0) {
    atualizarStatusAcessivel('Nenhuma tarefa encontrada na base de dados.');
    renderizarQuadro([], quadro);
    return;
  }

  const tarefasVisiveis = obterTarefasFiltradas(estado);
  const total = estado.tarefas.length;
  const visiveis = tarefasVisiveis.length;

  if (visiveis === 0) {
    atualizarStatusAcessivel('Nenhum resultado encontrado para os critérios selecionados.');
  } else {
    atualizarStatusAcessivel(`Exibindo ${visiveis} de ${total} tarefa(s).`);
  }

  renderizarQuadro(tarefasVisiveis, quadro);
}

function inicializarEventos() {
  const inputBusca = document.getElementById('buscaTarefa');
  const selectStatus = document.getElementById('status');
  const selectPrioridade = document.getElementById('prioridade');
  const selectOrdenacao = document.getElementById('ordenacao');
  const btnLimpar = document.getElementById('btn-limpar-filtros');
  const quadro = document.querySelector('section[aria-labelledby="titulo-quadro"]');

  inputBusca?.addEventListener('input', (e) => {
    estado.busca = e.target.value;
    atualizarInterface();
  });

  selectStatus?.addEventListener('change', (e) => {
    estado.status = e.target.value;
    atualizarInterface();
  });

  selectPrioridade?.addEventListener('change', (e) => {
    estado.prioridade = e.target.value;
    atualizarInterface();
  });

  selectOrdenacao?.addEventListener('change', (e) => {
    estado.ordenacao = e.target.value;
    atualizarInterface();
  });

  btnLimpar?.addEventListener('click', () => {
    estado.busca = '';
    estado.status = 'todos';
    estado.prioridade = 'todas';
    estado.ordenacao = 'prazo-asc';

    sincronizarControlesComEstado();
    atualizarInterface();
  });

  quadro?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-acao="ver-detalhes"]');
    if (!btn) return;

    const cartao = btn.closest('article');
    const id = cartao?.dataset.id;
    const tarefa = estado.tarefas.find((t) => String(t.id) === String(id));

    if (tarefa) {
      console.log('Detalhes da tarefa:', tarefa);
    }
  });
}

async function init() {
  lerParametrosUrl();

  sincronizarControlesComEstado();

  inicializarEventos();

  estado.carregamento = true;
  atualizarInterface();

  try {
    const dados = await carregarTarefas();
    estado.tarefas = dados;
  } catch (err) {
    if (err.name === 'TypeError') {
      estado.erro = 'Falha de rede: Não foi possível conectar ao servidor.';
    } else if (err.name === 'SyntaxError') {
      estado.erro = 'Erro de formato: O arquivo recebido não contém um JSON válido.';
    } else {
      estado.erro = `Erro na requisição: ${err.message}`;
    }
  } finally {
    estado.carregamento = false;
    atualizarInterface();
  }
}

document.addEventListener('DOMContentLoaded', init);