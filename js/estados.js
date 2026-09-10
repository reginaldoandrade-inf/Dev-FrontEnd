import { renderizarTarefas } from './renderizacao.js';

export function renderizarEstado(estado, dados = {}) {
  const regiaoStatus = document.getElementById('regiao-status');
  const quadro = dados.quadro || document.querySelector('section[aria-labelledby="titulo-quadro"]');

  if (!regiaoStatus) return;

  switch (estado) {
    case 'carregando': {
      regiaoStatus.textContent = 'Carregando tarefas do servidor...';
      if (quadro) {
        const listas = quadro.querySelectorAll('[data-lista-status]');
        listas.forEach(lista => {
          const li = document.createElement('li');
          li.className = 'item-vazio';
          const p = document.createElement('p');
          p.textContent = 'Carregando...';
          li.appendChild(p);
          lista.replaceChildren(li);
        });
      }
      break;
    }

    case 'sucesso': {
      
      const tarefas = dados.tarefas || [];
      regiaoStatus.textContent = `Tarefas carregadas com sucesso. Total: ${tarefas.length} tarefa(s).`;
      if (quadro) {
        renderizarTarefas(tarefas, quadro);
      }
      break;
    }

    case 'vazio': {
     
      regiaoStatus.textContent = 'Nenhuma tarefa encontrada no quadro.';
      if (quadro) {
        renderizarTarefas([], quadro);
      }
      break;
    }

    case 'erro': {
      
      const err = dados.erro;
      let mensagemFormatada = 'Ocorreu um erro ao carregar as tarefas.';

      if (err) {
        if (err.name === 'TypeError') {
          mensagemFormatada = 'Falha de rede: Não foi possível conectar ao servidor. Verifique a conexão.';
        } else if (err.name === 'SyntaxError') {
          mensagemFormatada = 'Erro de formato: O arquivo recebido não contém um JSON válido.';
        } else {
          mensagemFormatada = `Erro na requisição: ${err.message}`;
        }
      }

      regiaoStatus.textContent = mensagemFormatada;

      if (quadro) {
        const listas = quadro.querySelectorAll('[data-lista-status]');
        listas.forEach(lista => {
          const li = document.createElement('li');
          li.className = 'item-vazio';
          const p = document.createElement('p');
          p.textContent = 'Indisponível devido a erro.';
          li.appendChild(p);
          lista.replaceChildren(li);
        });
      }
      break;
    }

    default:
      console.warn(`Estado desconhecido: ${estado}`);
  }
}