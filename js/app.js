import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';
import { instalarEventosDoQuadro } from './renderizacao.js';

async function inicializarAplicacao() {
  const quadro = document.querySelector('section[aria-labelledby="titulo-quadro"]');

  if (!quadro) {
    console.error('Quadro de tarefas não encontrado no DOM.');
    return;
  }

  renderizarEstado('carregando', { quadro });

  try {
    const tarefas = await carregarTarefas();

    if (tarefas.length === 0) {
      renderizarEstado('vazio', { quadro });
    } else {
      renderizarEstado('sucesso', { tarefas, quadro });
      
      instalarEventosDoQuadro(quadro, tarefas);
    }
  } catch (erro) {
    renderizarEstado('erro', { erro, quadro });
    console.error('Falha na inicialização da aplicação:', erro);
  }
}

document.addEventListener('DOMContentLoaded', inicializarAplicacao);