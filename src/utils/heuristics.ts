import { GameStatus, GameState } from "../types";

export function getLocalHeuristicResponse(prompt: string, challengeId: string, currentLevel: number, gradeId: string): GameState {
  const normInput = (prompt || "").toLowerCase().trim();
  const isKinder = gradeId === "1_ano" || gradeId === "2_ano";

  // Negative words (violence, destruction, neglect) suitable for children moderation
  const negativeWords = [
    "bater", "chutar", "bato", "chuto", "empurrar", "empurro", "xingar", "xingo", 
    "gritar", "grito", "quebrar", "quebro", "sujar", "sujo", "estragar", "estrago", 
    "rasgar", "rasgo", "roubar", "roubo", "ignorar", "ignoro", "deixar", "deixo", 
    "nada", "fazer nada", "jogar no chão", "jogar no chao", "correr mais", "bato nele",
    "bater nele", "maldoso", "baba", "ruim", "empurro"
  ];

  const containsNegative = negativeWords.some(word => normInput.includes(word));
  let feedback = "";
  let status = GameStatus.SUCESSO;
  let activeElements = ["Smile", "Heart", "Sparkles"];
  let backgroundColor = "#E8F5E9"; // Clean green pastel

  const minLength = isKinder ? 2 : 5;

  if (normInput.length < minLength) {
    status = GameStatus.ERRO;
    feedback = isKinder 
      ? "Sua resposta está curtinha! Conte mais! 💬"
      : "Raciocínio muito curto! Escreva mais um pouquinho! 💡🎒";
    backgroundColor = "#F1F5F9"; 
    activeElements = ["Frown", "Sparkles"];
  } else if (containsNegative) {
    status = GameStatus.ERRO;
    feedback = isKinder
      ? "Fazer isso deixa a escola triste. Vamos tentar ajudar? 💖"
      : "Essa atitude não ajuda a nossa escola! Que tal pensar em ajudar? 🏫";
    backgroundColor = "#FEF2F2"; 
    activeElements = ["Frown", "Heart"];
  } else {
    status = GameStatus.SUCESSO;
    backgroundColor = "#E8F5E9"; 

    switch (challengeId) {
      case "lixo-patio":
      case "tia-limpeza":
        feedback = isKinder
          ? "Parabéns, a sala ficou limpinha de novo! 🧹✨"
          : "Excelente! Resíduos recolhidos deixam a escola linda! 🧹✨";
        activeElements = ["Trash2", "Recycle", "Sparkles"];
        break;
      case "colega-excluido":
        feedback = isKinder
          ? "Que lindo! Convidar o amigo deixou todos felizes! 🧸❤️"
          : "Perfeito! Fazer novos amigos alegra o nosso dia! 🧸🏫🤝";
        activeElements = ["Users", "Smile", "Heart"];
        break;
      case "desperdicio-agua":
      case "luz-acesa":
        feedback = isKinder
          ? "Muito bem! Economizar água/energia salva nossa escola! 💧🌱"
          : "Sensacional! Economizar recursos ajuda todo o planeta! 💧🌱";
        activeElements = ["Droplets", "Shield", "Sparkles"];
        break;
      case "plantas-sede":
      case "riscos-muro":
        feedback = isKinder
          ? "Viva! As florzinhas estão super felizes e regadas! 🌸🌱"
          : "Incrível! Cuidar do espaço enche a escola de vida! 🌸🌱";
        activeElements = ["Sprout", "Droplets", "Sun"];
        break;
      default:
        feedback = isKinder
          ? "Incrível! Vocês são maravilhosos! 🌟🏰✨"
          : "Fabuloso! Mandaram muito bem na resposta! 🌟🏫✨";
        activeElements = ["Smile", "Heart", "Sparkles"];
        break;
    }
  }

  return {
    status,
    feedback,
    nivel_ods4: currentLevel + (status === GameStatus.SUCESSO ? 15 : 0),
    background_color: backgroundColor,
    elementos_ativos: activeElements,
    proximo_desafio: ""
  };
}
