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

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "lixo-patio",
    title: "Lixo no Pátio 🍬",
    description: "O recreio acabou e deixaram papéis de bala e copos de plástico jogados no chão. O que devemos fazer?",
    initialIcons: ["Trash2", "Wind"],
  },
  {
    id: "colega-excluido",
    title: "Amigo Sozinho 🧸",
    description: "Um amiguinho novo está sentado sozinho no banco triste enquanto todos brincam. Qual a melhor atitude?",
    initialIcons: ["Users", "Frown"],
  },
  {
    id: "desperdicio-agua",
    title: "Torneira Aberta 💧",
    description: "Alguém esqueceu a torneira do banheiro aberta e a água está correndo toda fora. Como ajudar?",
    initialIcons: ["Droplets", "Brush"],
  },
  {
    id: "plantas-sede",
    title: "Flores com Sede 🌱",
    description: "As florzinhas do jardim da escola estão caídas e com muita sede nesse dia de sol. O que você faz?",
    initialIcons: ["Sprout", "Sun"],
  },
  {
    id: "sala-baguncada",
    title: "Brinquedos Espalhados 🧩",
    description: "Depois de brincar com pecinhas e blocos, a sala ficou toda bagunçada. Como organizar?",
    initialIcons: ["Box", "Smile"],
  },
  {
    id: "luz-acesa",
    title: "Luz Ligada 💡",
    description: "A aula ja acabou e a sala está vazia, mas as lâmpadas continuam todas acesas. O que fazer?",
    initialIcons: ["Lightbulb", "Zap"],
  },
  {
    id: "livro-estragado",
    title: "Livro da Biblioteca 📚",
    description: "Você achou um livro de historinhas com as páginas descolando no meio da mesa. Como cuidar dele?",
    initialIcons: ["BookOpen", "Sparkles"],
  },
  {
    id: "laranja-repartida",
    title: "Lanche do Amigo 🍎",
    description: "Um colega esqueceu o lanchinho dele hoje e a barriga dele está roncando com fome. Como ajudar?",
    initialIcons: ["Heart", "Smile"],
  },
  {
    id: "fila-cantina",
    title: "Fila da Cantina 🚶",
    description: "Algumas crianças estão correndo e empurrando todo mundo para passar na frente na fila. Como agir?",
    initialIcons: ["Handshake", "Users"],
  },
  {
    id: "riscos-muro",
    title: "Riscos na Parede 🎨",
    description: "Alguém rabiscou a parede branquinha da nossa escola com caneta. Como podemos ajudar a cuidar da escola?",
    initialIcons: ["Sparkles", "Brush"],
  },
  {
    id: "tia-limpeza",
    title: "Tia da Limpeza ✨",
    description: "A tia da limpeza limpou toda a nossa sala e deixou ela cheirosa. Como ajudar a manter assim?",
    initialIcons: ["Trash2", "Smile"],
  },
  {
    id: "amigo-magoado",
    title: "Apelido Chato 🙅",
    description: "Estão colocando um apelido bobo em um amiguinho que deixou ele de cabeça baixa. O que você faz?",
    initialIcons: ["Heart", "Smile"],
  }
];
