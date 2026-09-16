function formatarDataBR(dataIso) {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function criarCartao(tarefa) {
  const li = document.createElement('li');

  const article = document.createElement('article');
  article.dataset.id = tarefa.id;

  // Aplica classe visual opcional com base na prioridade
  if (tarefa.prioridade) {
    const prioLower = tarefa.prioridade.toLowerCase();
    if (prioLower.includes('baixa')) article.classList.add('postit-verde');
    if (prioLower.includes('alta')) article.classList.add('postit-rosa');
  }

  const h4 = document.createElement('h4');
  h4.textContent = tarefa.titulo;

  const pProjeto = document.createElement('p');
  pProjeto.innerHTML = `<strong>Projeto:</strong> ${tarefa.projeto}`;

  const pResp = document.createElement('p');
  pResp.innerHTML = `<strong>Responsável:</strong> ${tarefa.responsavel}`;

  const pPrazo = document.createElement('p');
  pPrazo.innerHTML = `<strong>Prazo:</strong> <time datetime="${tarefa.prazo}">${formatarDataBR(tarefa.prazo)}</time>`;

  const pPrioridade = document.createElement('p');
  pPrioridade.innerHTML = `<strong>Prioridade:</strong> <span class="prioridade">${tarefa.prioridade}</span>`;

  const btnDetalhes = document.createElement('button');
  btnDetalhes.type = 'button';
  btnDetalhes.dataset.acao = 'ver-detalhes';
  btnDetalhes.className = 'btn-detalhes';
  btnDetalhes.textContent = 'Ver Detalhes';

  article.appendChild(h4);
  article.appendChild(pProjeto);
  article.appendChild(pResp);
  article.appendChild(pPrazo);
  article.appendChild(pPrioridade);
  article.appendChild(btnDetalhes);

  li.appendChild(article);
  return li;
}

export function renderizarQuadro(tarefas, quadroEl) {
  if (!quadroEl) return;
  const listas = quadroEl.querySelectorAll('[data-lista-status]');

  listas.forEach((listaEl) => {
    const statusColuna = listaEl.dataset.listaStatus;
    const tarefasColuna = tarefas.filter((t) => t.status === statusColuna);

    if (tarefasColuna.length === 0) {
      const liVazia = document.createElement('li');
      liVazia.className = 'item-vazio';
      liVazia.innerHTML = '<p>Nenhuma tarefa nesta coluna</p>';
      listaEl.replaceChildren(liVazia);
    } else {
      const cartoes = tarefasColuna.map(criarCartao);
      listaEl.replaceChildren(...cartoes);
    }
  });
}

export function atualizarStatusAcessivel(mensagem) {
  const regiao = document.getElementById('regiao-status');
  if (regiao) {
    regiao.textContent = mensagem;
  }
}