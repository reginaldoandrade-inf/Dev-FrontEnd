function formatarDataBR(dataIso) {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function criarCartao(tarefa) {
  const li = document.createElement('li');

  const article = document.createElement('article');
  article.className = 'card-pizza-item';
  article.dataset.id = tarefa.id;
  article.dataset.prioridade = tarefa.prioridade;
  article.draggable = true;

  const prioLower = (tarefa.prioridade || '').toLowerCase();
  let classePimenta = 'pimenta-baixa';
  let textoPimenta = '🍃 Suave (Baixa)';

  if (prioLower.includes('alta')) {
    classePimenta = 'pimenta-alta';
    textoPimenta = '🌶️ Vulcão (Alta)';
  } else if (prioLower.includes('méd') || prioLower.includes('med')) {
    classePimenta = 'pimenta-media';
    textoPimenta = '⚡ Moderada (Média)';
  }

  const h4 = document.createElement('h4');
  h4.textContent = tarefa.titulo;

  const pProjeto = document.createElement('p');
  pProjeto.innerHTML = `<strong>Projeto:</strong> ${tarefa.projeto}`;

  const pResp = document.createElement('p');
  pResp.innerHTML = `<strong>Responsável:</strong> ${tarefa.responsavel}`;

  const pPrazo = document.createElement('p');
  pPrazo.innerHTML = `<strong>Prazo:</strong> <time datetime="${tarefa.prazo}">${formatarDataBR(tarefa.prazo)}</time>`;

  const divHeader = document.createElement('div');
  divHeader.className = 'card-pedido-header';
  divHeader.innerHTML = `
    <span class="tag-pedido-id">PEDIDO #${tarefa.id}</span>
    <span class="pimenta-badge ${classePimenta}">${textoPimenta}</span>
  `;

  const btnDetalhes = document.createElement('button');
  btnDetalhes.type = 'button';
  btnDetalhes.dataset.acao = 'ver-detalhes';
  btnDetalhes.className = 'btn-detalhes';
  btnDetalhes.textContent = '📋 Ver Comanda';

  article.appendChild(divHeader);
  article.appendChild(h4);
  article.appendChild(pProjeto);
  article.appendChild(pResp);
  article.appendChild(pPrazo);
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

    const contadorEl = quadroEl.querySelector(`[data-contador="${statusColuna}"]`);
    if (contadorEl) {
      contadorEl.textContent = tarefasColuna.length;
    }

    if (tarefasColuna.length === 0) {
      const liVazia = document.createElement('li');
      liVazia.className = 'item-vazio';
      liVazia.innerHTML = '<p>Nenhuma pizza nesta estação</p>';
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

export function exibirModalComanda(tarefa) {
  const modal = document.getElementById('modal-detalhes');
  if (!modal) return;

  const elId = document.getElementById('modal-id-pedido');
  const elTitulo = document.getElementById('modal-titulo');
  const elProjeto = document.getElementById('modal-projeto');
  const elResp = document.getElementById('modal-responsavel');
  const elPrazo = document.getElementById('modal-prazo');
  const elStatusNome = document.getElementById('modal-status-nome');
  const btnAvancar = document.getElementById('btn-avancar-estacao');

  if (elId) elId.textContent = tarefa.id;
  if (elTitulo) elTitulo.textContent = tarefa.titulo;
  if (elProjeto) elProjeto.textContent = tarefa.projeto;
  if (elResp) elResp.textContent = tarefa.responsavel;
  if (elPrazo) elPrazo.textContent = formatarDataBR(tarefa.prazo);

  const nomesStatus = {
    'a-fazer': 'Massa & Base',
    'em-andamento': 'Recheio & Molho',
    'em-revisao': 'Forno a Lenha',
    'concluida': 'Pizza Pronta'
  };
  if (elStatusNome) elStatusNome.textContent = nomesStatus[tarefa.status] || tarefa.status;

  document.querySelectorAll('.passo-etapa').forEach((passo) => {
    if (passo.dataset.passo === tarefa.status) {
      passo.classList.add('ativo');
    } else {
      passo.classList.remove('ativo');
    }
  });

  const ordem = ['a-fazer', 'em-andamento', 'em-revisao', 'concluida'];
  const idxAtual = ordem.indexOf(tarefa.status);

  if (btnAvancar) {
    if (idxAtual < ordem.length - 1) {
      btnAvancar.style.display = 'block';
      btnAvancar.textContent = `Avançar para ${nomesStatus[ordem[idxAtual + 1]]} ➔`;
    } else {
      btnAvancar.style.display = 'none';
    }
  }

  modal.classList.remove('hidden');
}

export function fecharModalComanda() {
  const modal = document.getElementById('modal-detalhes');
  if (modal) modal.classList.add('hidden');
}