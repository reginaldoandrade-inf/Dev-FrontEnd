export async function carregarTarefas() {
  try {
    const resposta = await fetch('./dados.json');

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status} ${resposta.statusText}`);
    }

    const dados = await resposta.json();

    if (!dados || !Array.isArray(dados.tarefas)) {
      throw new SyntaxError('Formato JSON inválido: propriedade "tarefas" ausente.');
    }

    return dados.tarefas;
  } catch (err) {
    console.warn('Uso local detectado sem servidor HTTP. Carregando dados base de reserva.', err);
    return [
      { id: 1, titulo: "Modelagem do Banco de Dados", projeto: "Sistema de Biblioteca", responsavel: "Ana Silva", prazo: "2026-08-20", prioridade: "Alta", status: "a-fazer" },
      { id: 2, titulo: "Revisão Bibliográfica", projeto: "Sistema de Biblioteca", responsavel: "Carlos Eduardo", prazo: "2026-08-25", prioridade: "Média", status: "a-fazer" },
      { id: 3, titulo: "Estrutura HTML da Interface", projeto: "Gerenciador de Tarefas Acadêmicas", responsavel: "Reginaldo Andrade", prazo: "2026-08-15", prioridade: "Alta", status: "em-andamento" },
      { id: 4, titulo: "Criação do Questionário", projeto: "Pesquisa de Usabilidade", responsavel: "Beatriz Lima", prazo: "2026-08-18", prioridade: "Baixa", status: "em-andamento" },
      { id: 5, titulo: "Diagrama de Casos de Uso", projeto: "Engenharia de Software", responsavel: "Lucas Souza", prazo: "2026-08-12", prioridade: "Média", status: "em-revisao" },
      { id: 6, titulo: "Relatório de Experimento Web", projeto: "Redes de Computadores", responsavel: "Mariana Costa", prazo: "2026-08-14", prioridade: "Alta", status: "em-revisao" },
      { id: 7, titulo: "Escolha do Tema do Projeto", projeto: "Gerenciador de Tarefas Acadêmicas", responsavel: "Reginaldo Andrade", prazo: "2026-08-05", prioridade: "Média", status: "concluida" },
      { id: 8, titulo: "Configuração do Repositório Git", projeto: "Gerenciador de Tarefas Acadêmicas", responsavel: "Reginaldo Andrade", prazo: "2026-08-08", prioridade: "Baixa", status: "concluida" }
    ];
  }
}