export type Mode = "estudar" | "trabalhar" | "tentar" | "dificil";

export interface MicroTask {
  title: string;
  minutes: number;
}

export const FLOWS: Record<Mode, { label: string; tasks: MicroTask[] }> = {
  estudar: {
    label: "Sessão de estudo",
    tasks: [
      { title: "Abrir o material", minutes: 2 },
      { title: "Entrar no conteúdo com calma", minutes: 8 },
      { title: "Continuar focado", minutes: 10 },
      { title: "Anotar 1 coisa importante", minutes: 5 },
    ],
  },

  trabalhar: {
    label: "Bloco de trabalho",
    tasks: [
      { title: "Abrir a tarefa principal", minutes: 2 },
      { title: "Entrar no fluxo de trabalho", minutes: 15 },
      { title: "Continuar focado sem trocar de tarefa", minutes: 15 },
      { title: "Fechar um pequeno resultado", minutes: 10 },
    ],
  },

  tentar: {
    label: "Começo rápido",
    tasks: [
      { title: "Só abrir e começar", minutes: 2 },
    ],
  },

  dificil: {
    label: "Hoje está difícil",
    tasks: [
      { title: "Só abrir o material", minutes: 2 },
      { title: "Ficar presente por 2 minutos", minutes: 2 },
    ],
  },
};

export const FEEDBACK = [
  "Você conseguiu começar. Isso já muda o dia.",
  "Nem sempre é fácil. Mas você apareceu.",
  "Um pouco já é melhor do que nada.",
  "Você não travou hoje. Isso conta.",
  "Não precisa ser perfeito. Só continuar.",
  "Você saiu da inércia. Isso é raro.",
  "Você fez mais do que parecia possível.",
  "Mesmo pequeno, isso já é movimento.",
  "Você deu o primeiro passo. O resto vem.",
  "Hoje você não ficou parado. Isso importa.",
];