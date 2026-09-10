const estado = {
  tarefas: [],          
  busca: '',            
  status: 'todos',      
  prioridade: 'todas',  
  ordenacao: 'prazo',   
  carregamento: false,  
  erro: null            
};


async function carregarTarefas() {
  estado.carregamento = true;
  estado.erro = null;
  atualizarInterface();

  try {
    const resposta = await fetch('dados.json');
    if (!resposta.ok) {
      throw new Error(`Falha na requisição: ${resposta.status}`);
    }
    const dados = await resposta.json();
    
   
    estado.tarefas = dados;
  } catch (erro) {
    estado.erro = 'Não foi possível carregar as tarefas. Tente novamente mais tarde.';
  } finally {
    estado.carregamento = false;
    atualizarInterface();
  }
}


function obterTarefasFiltradas(estadoAtual) {
  
  let resultado = [...estadoAtual.tarefas];

  
  if (estadoAtual.busca.trim() !== '') {
    const termo = estadoAtual.busca.toLowerCase();
    resultado = resultado.filter(tarefa => 
      tarefa.titulo.toLowerCase().includes(termo)
    );
  }

  
  if (estadoAtual.status !== 'todos') {
    resultado = resultado.filter(tarefa => tarefa.status === estadoAtual.status);
  }

  
  if (estadoAtual.prioridade !== 'todas') {
    resultado = resultado.filter(tarefa => tarefa.prioridade === estadoAtual.prioridade);
  }

  
  if (estadoAtual.ordenacao === 'prazo') {
    resultado.sort((a, b) => new Date(a.prazo) - new Date(b.prazo));
  } else if (estadoAtual.ordenacao === 'titulo') {
    resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  return resultado;
}


function atualizarInterface() {
  const container = document.getElementById('lista-tarefas');
  const feedback = document.getElementById('regiao-feedback');
  const contador = document.getElementById('contador-tarefas');

 
  container.innerHTML = '';

  
  if (estado.carregamento) {
    feedback.textContent = 'Carregando tarefas...';
    contador.textContent = '';
    return;
  }


  if (estado.erro) {
    feedback.textContent = estado.erro;
    contador.textContent = '';
    return;
  }


  if (estado.tarefas.length === 0) {
    feedback.textContent = 'Nenhuma tarefa encontrada na base de dados.';
    contador.textContent = '0 de 0 tarefas';
    return;
  }

  
  const tarefasVisiveis = obterTarefasFiltradas(estado);

  
  const total = estado.tarefas.length;
  const visiveis = tarefasVisiveis.length;
  contador.textContent = `Exibindo ${visiveis} de ${total} tarefas`;

  
  if (visiveis === 0) {
    feedback.textContent = 'Nenhum resultado encontrado para os critérios selecionados.';
    return;
  }

  
  feedback.textContent = '';

 
  const frag = document.createDocumentFragment();
  tarefasVisiveis.forEach(tarefa => {
    const card = document.createElement('article');
    card.className = `cartao cartao-${tarefa.prioridade}`;
    card.innerHTML = `
      <h3>${tarefa.titulo}</h3>
      <p><strong>Prazo:</strong> ${formatarData(tarefa.prazo)}</p>
      <p><strong>Status:</strong> ${tarefa.status}</p>
      <p><strong>Prioridade:</strong> ${tarefa.prioridade}</p>
      <button class="btn-excluir" data-id="${tarefa.id}">Excluir</button>
    `;
    frag.appendChild(card);
  });

  container.appendChild(frag);
}


function formatarData(dataIso) {
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}


function inicializarEventos() {
  const inputBusca = document.getElementById('input-busca');
  const selectStatus = document.getElementById('select-status');
  const selectPrioridade = document.getElementById('select-prioridade');
  const selectOrdenacao = document.getElementById('select-ordenacao');
  const btnLimpar = document.getElementById('btn-limpar-filtros');
  const containerCartoes = document.getElementById('lista-tarefas');

  inputBusca.addEventListener('input', (e) => {
    estado.busca = e.target.value;
    atualizarInterface();
  });

  selectStatus.addEventListener('change', (e) => {
    estado.status = e.target.value;
    atualizarInterface();
  });

  selectPrioridade.addEventListener('change', (e) => {
    estado.prioridade = e.target.value;
    atualizarInterface();
  });

  selectOrdenacao.addEventListener('change', (e) => {
    estado.ordenacao = e.target.value;
    atualizarInterface();
  });

  btnLimpar.addEventListener('click', () => {
    // 1. Reseta o objeto de estado
    estado.busca = '';
    estado.status = 'todos';
    estado.prioridade = 'todas';
    estado.ordenacao = 'prazo';

    inputBusca.value = '';
    selectStatus.value = 'todos';
    selectPrioridade.value = 'todas';
    selectOrdenacao.value = 'prazo';

    atualizarInterface();
  });

  containerCartoes.addEventListener('click', (e) => {
    if (e.target.matches('.btn-excluir')) {
      const id = Number(e.target.dataset.id);
      // Remove do array base no estado
      estado.tarefas = estado.tarefas.filter(t => t.id !== id);
      atualizarInterface();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarEventos();
  carregarTarefas();
});