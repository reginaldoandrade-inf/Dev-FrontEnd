export async function carregarTarefas() {
  const resposta = await fetch('./dados.json');

  if (!resposta.ok) {
    throw new Error(`Erro de protocolo HTTP: ${resposta.status} ${resposta.statusText}`);
  }

  const dados = await resposta.json();

  if (!dados || !Array.isArray(dados.tarefas)) {
    throw new SyntaxError('Formato JSON inválido: propriedade "tarefas" ausente ou não é um array.');
  }

  return dados.tarefas;
}