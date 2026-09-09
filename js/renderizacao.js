function formatarDataBR(dataIso) {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}


export function criarCartao(tarefa) {
  const li = document.createElement('li');

  const article = document.createElement('article');
  article.dataset.id = tarefa.id; // Guarda o ID da tarefa no dataset do cartão

  const h4 = document.createElement('h4');
  h4.textContent = tarefa.titulo;

  const pProjeto = document.createElement('p');
  const strongProjeto = document.createElement('strong');
  strongProjeto.textContent = 'Projeto: ';
  pProjeto.appendChild(strongProjeto);
  pProjeto.appendChild(document.createTextNode(tarefa.projeto));

  const pResp = document.createElement('p');
  const strongResp = document.createElement('strong');
  strongResp.textContent = 'Responsável: ';
  pResp.appendChild(strongResp);
  pResp.appendChild(document.createTextNode(tarefa.responsavel));

  const pPrazo = document.createElement('p');
  const strongPrazo = document.createElement('strong');
  strongPrazo.textContent = 'Prazo: ';
  const time = document.createElement('time');
  time.setAttribute('datetime', tarefa.prazo);
  time.textContent = formatarDataBR(tarefa.prazo);
  pPrazo.appendChild(strongPrazo);
  pPrazo.appendChild(time);

  const pPrioridade = document.createElement('p');
  const strongPrioridade = document.createElement('strong');
  strongPrioridade.textContent = 'Prioridade: ';
  const spanPrioridade = document.createElement('span');
  spanPrioridade.className = 'prioridade';
  spanPrioridade.textContent = tarefa.prioridade;
  pPrioridade.appendChild(strongPrioridade);
  pPrioridade.appendChild(spanPrioridade);


  const btnDetalhes = document.createElement('button');
  btnDetalhes.type = 'button';
  btnDetalhes.dataset.acao = 'ver-detalhes';
  btnDetalhes.className = 'btn-detalhes';

  const spanTextoBtn = document.createElement('span');
  spanTextoBtn.textContent = 'Ver Detalhes';
  btnDetalhes.appendChild(spanTextoBtn);


  article.appendChild(h4);
  article.appendChild(pProjeto);
  article.appendChild(pResp);
  article.appendChild(pPrazo);
  article.appendChild(pPrioridade);
  article.appendChild(btnDetalhes);

  li.appendChild(article);
  return li;
}


export function renderizarTarefas(tarefas, quadro) {
  const listas = quadro.querySelectorAll('[data-lista-status]');

  listas.forEach((listaEl) => {
    const statusColuna = listaEl.dataset.listaStatus;

  
    const tarefasFiltradas = tarefas.filter((t) => t.status === statusColuna);

    if (tarefasFiltradas.length === 0) {
    
      const liVazia = document.createElement('li');
      liVazia.className = 'item-vazio';
      const pVazio = document.createElement('p');
      pVazio.textContent = 'Nenhuma tarefa nesta coluna';
      liVazia.appendChild(pVazio);

      listaEl.replaceChildren(liVazia);
    } else {
      
      const cartoes = tarefasFiltradas.map((t) => criarCartao(t));

      listaEl.replaceChildren(...cartoes);
    }
  });
}


export function instalarEventosDoQuadro(quadro, tarefas) {
  quadro.addEventListener('click', (evento) => {
    // 1. Guarda de tipo e busca da ação pelo elemento clicado
    const botao = evento.target.closest('[data-acao="ver-detalhes"]');
    if (!botao) return;

    
    if (!quadro.contains(botao)) return;

    
    const cartao = botao.closest('article');
    if (!cartao) return;

    
    const idTarefa = cartao.dataset.id;
    if (!idTarefa) return;

    
    const tarefaEncontrada = tarefas.find(
      (t) => String(t.id) === String(idTarefa)
    );

    
    if (tarefaEncontrada) {
      console.log('Detalhes da tarefa:', tarefaEncontrada);
    }
  });
}