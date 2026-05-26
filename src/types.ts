export enum GameStatus {
  SUCESSO = "sucesso",
  ERRO = "erro",
}

export interface GameState {
  status: GameStatus;
  feedback: string;
  nivel_ods4: number;
  background_color: string;
  elementos_ativos: string[];
  proximo_desafio: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  initialIcons: string[];
}

export interface ClassroomLevel {
  id: string;
  name: string;
  time: string;
  age: string;
  difficulty: "super_ludico" | "ludico" | "intermediario" | "colaborativo" | "critico";
  description: string;
  themeColor: string;
}

export const CLASSROOMS: ClassroomLevel[] = [
  {
    id: "5_ano",
    name: "5º Ano A",
    time: "08h30",
    age: "10 anos",
    difficulty: "critico",
    description: "CIDADANIA ATIVA E EMPATIA PROFUNDA. Ideal para pré-adolescentes, avaliando colaborações mais elaboradas e ações éticas.",
    themeColor: "#8B5CF6", // Purple
  },
  {
    id: "4_ano",
    name: "4º Ano A",
    time: "09h00",
    age: "9 anos",
    difficulty: "colaborativo",
    description: "UNIÃO E SUSTENTABILIDADE. Foco em soluções ecológicas, trabalho em equipe e respeito mútuo.",
    themeColor: "#3B82F6", // Blue
  },
  {
    id: "3_ano",
    name: "3º Ano A",
    time: "09h30",
    age: "8 anos",
    difficulty: "intermediario",
    description: "EQUILÍBRIO LÚDICO-PRÁTICO. Estimula bons hábitos diários misturando lógica simples com diversão.",
    themeColor: "#10B981", // Emerald
  },
  {
    id: "2_ano",
    name: "2º Ano A",
    time: "10h00",
    age: "7 anos",
    difficulty: "ludico",
    description: "MUNDO COLORIDO DO CUIDADO. Foco no embelezamento do jardim, carinho com os amigos e economia mágica de água.",
    themeColor: "#F59E0B", // Amber
  },
  {
    id: "1_ano",
    name: "1º Ano A",
    time: "10h30",
    age: "6 anos",
    difficulty: "super_ludico",
    description: "AVENTURA ENCANTADA DOS SENTIMENTOS. Superindulgente com emojis gigantes, fadas e magias de proteção escolar.",
    themeColor: "#EC4899", // Pink
  }
];

export const CHALLENGE_PAIRS: [Challenge, Challenge][] = [
  // Pair 0: Lixo / Limpeza
  [
    {
      id: "lixo-patio",
      title: "Lixo no Pátio 🍬",
      description: "O papel de bala caiu no chão do recreio. Onde nós devemos jogar esse lixo para deixar nossa escola linda?",
      initialIcons: ["Trash2", "Wind"],
    },
    {
      id: "tia-limpeza",
      title: "Tia da Limpeza ✨",
      description: "O pessoal da limpeza deixou nossa sala brilhando e cheirosa! O que nossa turma pode fazer para manter tudo limpo até o final da aula?",
      initialIcons: ["Trash2", "Smile"],
    }
  ],
  // Pair 1: Água / Energia
  [
    {
      id: "desperdicio-agua",
      title: "Torneira Aberta 💧",
      description: "Olha só! Alguém esqueceu a torneira pingando gotinhas de água. O que nós podemos fazer bem rápido?",
      initialIcons: ["Droplets", "Brush"],
    },
    {
      id: "luz-acesa",
      title: "Luz Ligada 💡",
      description: "A aula acabou e todo mundo saiu, mas as luzes e o ventilador continuavam ligados na sala vazia. O que devemos fazer para ajudar a economizar energia?",
      initialIcons: ["Lightbulb", "Zap"],
    }
  ],
  // Pair 2: Plantas / Muros
  [
    {
      id: "plantas-sede",
      title: "Flores com Sede 🌱",
      description: "O sol está muito quente e as florzinhas do jardim estão murchas e com sede. Como nós podemos ajudar elas?",
      initialIcons: ["Sprout", "Sun"],
    },
    {
      id: "riscos-muro",
      title: "Riscos na Parede 🎨",
      description: "Alguém rabiscou com caneta a parede branquinha do corredor da escola. Como podemos ajudar a cuidar do nosso espaço para a escola continuar alegre?",
      initialIcons: ["Sparkles", "Brush"],
    }
  ],
  // Pair 3: Organização / Materiais
  [
    {
      id: "sala-baguncada",
      title: "Brinquedos Espalhados 🧩",
      description: "A hora do brinquedo terminou e as pecinhas ficaram espalhadas por todo o chão da sala. O que fazemos agora?",
      initialIcons: ["Box", "Smile"],
    },
    {
      id: "livro-estragado",
      title: "Livro da Biblioteca 📚",
      description: "Você foi ler na biblioteca e achou um livro de historinhas com as páginas soltas e rasgos. Como nossa turma pode ajudar a salvar os nossos livros?",
      initialIcons: ["BookOpen", "Sparkles"],
    }
  ],
  // Pair 4: Amizade / Cooperação em Fila
  [
    {
      id: "colega-excluido",
      title: "Amigo Sozinho 🧸",
      description: "Um amiguinho novo está sentado no banco bem triste e sozinho. Qual atitude alegre nós podemos tomar?",
      initialIcons: ["Users", "Frown"],
    },
    {
      id: "fila-cantina",
      title: "Fila da Cantina 🚶",
      description: "Na hora do lanche, alguns colegas estão correndo, empurrando e passando na frente na fila da merenda. O que podemos fazer para que a fila seja organizada e justa?",
      initialIcons: ["Handshake", "Users"],
    }
  ],
  // Pair 5: Compartilhar / Anti-Bullying
  [
    {
      id: "laranja-repartida",
      title: "Dividir o Lanchinho 🍎",
      description: "Seu amiguinho esqueceu a lancheira em casa e está com fome na hora do lanche. O que você pode fazer de coração?",
      initialIcons: ["Heart", "Smile"],
    },
    {
      id: "amigo-magoado",
      title: "Apelido Chato 🙅",
      description: "Alguns colegas inventaram um apelido bobo para um amigo, e ele ficou bem triste no cantinho com a cabeça baixa. O que podemos fazer para ajudar esse amigo?",
      initialIcons: ["Heart", "Smile"],
    }
  ]
];

export const INITIAL_CHALLENGES: Challenge[] = CHALLENGE_PAIRS.flatMap(p => p);
