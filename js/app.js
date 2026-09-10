import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';
import { instalarEventosDoQuadro } from './renderizacao.js';

const estado = {
  tarefas: [],
  busca: "",
  status: "todos",
  prioridade: "todas",
  ordenacao: "prazo-asc",
  carregamento: "carregando",
  erro: null,
};

// Seletor puro (Slide 14 corrigido + Ordenação Imutável)
export function selecionarTarefas(estado) {
  const termo = estado.busca.trim().toLowerCase();

  const filtradas = estado.tarefas
    .filter((t) => t.titulo.toLowerCase().includes(termo))
    .filter((t) => estado.status === "todos" || t.status === estado.status)
    .filter((t) => estado.prioridade === "todas" || t.prioridade.toLowerCase() === estado.prioridade.toLowerCase());

  // Copia o array filtrado com [...] antes de ordenar para NÃO mutar estado.tarefas
  return [...filtradas].sort((a, b) => {
    if (estado.ordenacao === "prazo-asc") {
      return new Date(a.prazo) - new Date(b.prazo);
    }
    if (estado.ordenacao === "prazo-desc") {
      return new Date(b.prazo) - new Date(a.prazo);
    }
    return 0;
  });
}

async function inicializarAplicacao() {
  const quadro = document.querySelector('section[aria-labelledby="titulo-quadro"]');

  if (!quadro) return;

  renderizarEstado('carregando', { quadro });

  try {
    estado.tarefas = await carregarTarefas();
    estado.carregamento = estado.tarefas.length === 0 ? 'vazio' : 'sucesso';
    estado.erro = null;

    if (estado.tarefas.length === 0) {
      renderizarEstado('vazio', { quadro });
    } else {
      renderizarEstado('sucesso', { tarefas: selecionarTarefas(estado), quadro });
      instalarEventosDoQuadro(quadro, estado.tarefas);
    }
  } catch (erro) {
    estado.carregamento = 'erro';
    estado.erro = erro.message;
    renderizarEstado('erro', { erro, quadro });
  } finally {
    // 1. Exposição temporária no escopo global para testes no DevTools
    window.estado = estado;
    window.selecionarTarefas = selecionarTarefas;

    console.log('Ambiente de testes pronto no DevTools.');
  }
}

document.addEventListener('DOMContentLoaded', inicializarAplicacao);