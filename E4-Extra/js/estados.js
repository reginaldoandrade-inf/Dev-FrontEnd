import { renderizarQuadro } from './renderizacao.js';

export function renderizarEstado(estado, dados = {}) {
  const regiaoStatus = document.getElementById('regiao-status');
  const quadro = dados.quadro || document.querySelector('section[aria-labelledby="titulo-quadro"]');

  if (!regiaoStatus) return;

  switch (estado) {
    case 'carregando': {
      regiaoStatus.textContent = 'Carregando esteira de tarefas...';
      break;
    }

    case 'sucesso': {
      const tarefas = dados.tarefas || [];
      regiaoStatus.textContent = `Tarefas carregadas com sucesso. Total: ${tarefas.length} pedido(s).`;
      if (quadro) renderizarQuadro(tarefas, quadro);
      break;
    }

    case 'vazio': {
      regiaoStatus.textContent = 'Nenhuma tarefa encontrada no quadro.';
      if (quadro) renderizarQuadro([], quadro);
      break;
    }

    case 'erro': {
      const err = dados.erro;
      let mensagemFormatada = 'Ocorreu um erro ao carregar as tarefas.';

      if (err) {
        if (err.name === 'TypeError') {
          mensagemFormatada = 'Falha de rede: Não foi possível conectar ao servidor.';
        } else if (err.name === 'SyntaxError') {
          mensagemFormatada = 'Erro de formato: O arquivo recebido não contém um JSON válido.';
        } else {
          mensagemFormatada = `Erro na requisição: ${err.message}`;
        }
      }

      regiaoStatus.textContent = mensagemFormatada;
      break;
    }

    default:
      console.warn(`Estado desconhecido: ${estado}`);
  }
}