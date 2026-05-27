import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

function getSystemInstructionForGrade(gradeId: string): string {
  switch (gradeId) {
    case "1_ano":
      return `Você é o motor de inteligência do jogo infantil "Escola Brilhante" (ODS 4) para a turma do 1º ANO A (crianças de 6 anos).
REGRAS CRÍTICAS DE TEXTO:
1. O feedback deve ser EXTREMAMENTE CURTO e simples de ler. Máximo de 1 frase bem pequena (4 a 8 palavras) + Emojis!
2. Exemplos que você DEVE imitar: "Muito bem! Vocês salvaram as flores! 🌸💖", "Parabéns! Escola limpinha! ✨🧹", "Que fofo! Amigo feliz! 🧸❤️".
3. Use tom alegre e infantil. Qualquer tentativa positiva das crianças é SUCESSO.`;
    case "2_ano":
      return `Você é o motor lúdico do jogo "Escola Brilhante" (ODS 4) para a turma do 2º ANO A (crianças de 7 anos).
REGRAS CRÍTICAS DE TEXTO:
1. O feedback deve ser EXTREMAMENTE CURTO e simples de ler. Máximo de 1 frase pequena (5 a 10 palavras) + Emojis!
2. Exemplos que você DEVE imitar: "Sensacional! Que amizade linda! 🧸✨", "Incrível! As plantas adoraram! 🌱💧", "Parabéns! Economizar água é demais! 💧🎒".
3. Use tom de celebração super simples.`;
    case "3_ano":
      return `Você é o motor de avaliação do jogo "Escola Brilhante" (ODS 4) para o 3º ANO A (crianças de 8 anos).
REGRAS CRÍTICAS DE TEXTO:
1. O feedback deve ser EXTREMAMENTE CURTO e simples de ler. Máximo de 1 frase motivadora (6 a 12 palavras) + Emojis!
2. Exemplos: "Show! Juntos vocês organizaram tudo! 🧩🏫", "Excelente ideia para proteger a escola! 💡🎒", "Parabéns pelas boas atitudes de hoje! 🌟✨".`;
    case "4_ano":
      return `Você é o motor inteligente do jogo "Escola Brilhante" (ODS 4) para a turma do 4º ANO A (crianças de 9 anos).
REGRAS CRÍTICAS DE TEXTO:
1. O feedback deve ser EXTREMAMENTE CURTO. Máximo de 1 frase incentivadora (6 a 12 palavras) + Emojis!
2. Exemplos: "Parabéns! Empatia e união salvam o dia! 🤝🛡️", "Muito bem! Escola limpa é escola feliz! 🧹🏫", "Incrível! Economizar energia ajuda o planeta! 💡⚡".`;
    case "5_ano":
    default:
      return `Você é o motor analítico do jogo "Escola Brilhante" (ODS 4) para a turma do 5º ANO A (crianças de 10 anos).
REGRAS CRÍTICAS DE TEXTO:
1. Nunca use palavras difíceis (evite termos como 'retraído', 'éticos', 'patrimônio públicos' ou similares).
2. O feedback deve ser EXTREMAMENTE CURTO. Máximo de 1 frase inspiradora (8 a 15 palavras) + Emojis!
3. Exemplos: "Muito bem! Vocês agiram como verdadeiros guardiões da união! 🤝✨", "Sensacional! Cuidar da escola alegra o dia de todos! 🏫💖".`;
  }
}

function getLocalHeuristicResponse(prompt: string, challengeId: string, currentLevel: number, gradeId: string) {
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
  let status = "sucesso";
  let activeElements = ["Smile", "Heart", "Sparkles"];
  let backgroundColor = "#E8F5E9"; // Clean green pastel

  const minLength = isKinder ? 2 : 5;

  if (normInput.length < minLength) {
    status = "erro";
    feedback = isKinder 
      ? "Sua resposta está curtinha! Conte mais! 💬"
      : "Raciocínio muito curto! Escreva mais um pouquinho! 💡🎒";
    backgroundColor = "#F1F5F9"; 
    activeElements = ["Frown", "Sparkles"];
  } else if (containsNegative) {
    status = "erro";
    feedback = isKinder
      ? "Fazer isso deixa a escola triste. Vamos tentar ajudar? 💖"
      : "Essa atitude não ajuda a nossa escola! Que tal pensar em ajudar? 🏫";
    backgroundColor = "#FEF2F2"; 
    activeElements = ["Frown", "Heart"];
  } else {
    status = "sucesso";
    backgroundColor = "#E8F5E9"; 

    switch (challengeId) {
      case "lixo-patio":
        feedback = isKinder
          ? "Parabéns, o pátio ficou limpinho de novo! 🧹✨"
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
        feedback = isKinder
          ? "Muito bem! Economizar água salva nossa escola! 💧🌱"
          : "Sensacional! Fechar a torneira ajuda todo o planeta! 💧🌱";
        activeElements = ["Droplets", "Shield", "Sparkles"];
        break;
      case "plantas-sede":
        feedback = isKinder
          ? "Viva! As florzinhas estão super felizes e regadas! 🌸🌱"
          : "Incrível! Cuidar das plantas enche a escola de vida! 🌸🌱";
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
    nivel_ods4: currentLevel + (status === "sucesso" ? 15 : 0),
    background_color: backgroundColor,
    elementos_ativos: activeElements,
    proximo_desafio: ""
  };
}

let isQuotaExhausted = false;
let quotaResetTime = 0;

app.post("/api/game/action", async (req, res) => {
  const { prompt, currentLevel, challenge, grade } = req.body;
  const selectedGrade = grade || "5_ano";

  try {
    // If API key is completely missing, jump straight to local heuristics for speed & reliability
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not defined, using local kid heuristics parser.");
      const fallbackResult = getLocalHeuristicResponse(prompt, challenge?.id || "", Number(currentLevel) || 0, selectedGrade);
      return res.json(fallbackResult);
    }

    // Direct local fallback if we know the quota is currently exhausted (prevents slow API rate-limit delays)
    if (isQuotaExhausted && Date.now() < quotaResetTime) {
      console.log("Desvio inteligente ativado: Gemini em pausa por excesso de cota. Retorno local instantâneo!");
      const fallbackResult = getLocalHeuristicResponse(prompt, challenge?.id || "", Number(currentLevel) || 0, selectedGrade);
      return res.json(fallbackResult);
    }

    let response;
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                {
                  text: `Desafio Atual: ${challenge.title} - ${challenge.description}\nResposta da Turma: ${prompt}\nNível Atual da ODS 4: ${currentLevel}`,
                },
              ],
            },
          ],
          config: {
            systemInstruction: getSystemInstructionForGrade(selectedGrade),
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, enum: ["sucesso", "erro"] },
                feedback: { type: Type.STRING },
                nivel_ods4: { type: Type.NUMBER },
                background_color: { type: Type.STRING },
                elementos_ativos: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                proximo_desafio: { type: Type.STRING },
              },
              required: [
                "status",
                "feedback",
                "nivel_ods4",
                "background_color",
                "elementos_ativos",
                "proximo_desafio",
              ],
            },
          },
        });
        break; // Sucesso!
      } catch (error: any) {
        retries--;
        if (retries === 0) throw error;
        
        // Retry only on 503 or demand spikes
        const errorMessage = error?.message || "";
        if (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
          console.log(`Gemini ocupado, tentando novamente em ${delay}ms... (${retries} tentativas restantes)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; 
        } else {
          throw error;
        }
      }
    }

    if (!response) throw new Error("Sem resposta do Gemini");
    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    const errString = String(error?.message || error);
    if (errString.includes("429") || errString.includes("RESOURCE_EXHAUSTED") || errString.includes("Quota exceeded") || errString.includes("quota")) {
      isQuotaExhausted = true;
      quotaResetTime = Date.now() + 5 * 60 * 1000; // 5 minute cooloff before attempting again
      console.warn("Gemini API atingiu o limite de cota (429). Ativando desvio rápido local para garantir respostas instantâneas!");
    } else {
      console.warn("Gemini API error, falling back to local kid heuristic parser:", error?.message || error);
    }
    
    try {
      const fallbackResult = getLocalHeuristicResponse(prompt, challenge?.id || "", Number(currentLevel) || 0, selectedGrade);
      res.json(fallbackResult);
    } catch (fallbackError) {
      console.error("Critical error in fallback engine:", fallbackError);
      res.status(200).json({ 
        status: "sucesso",
        feedback: "Que atitude fantástica! Você é um verdadeiro guardião do nosso planeta e da nossa escola! 🌟🏫✨",
        nivel_ods4: (Number(currentLevel) || 0) + 15,
        background_color: "#E8F5E9",
        elementos_ativos: ["Smile", "Heart", "Sparkles"],
        proximo_desafio: ""
      });
    }
  }
});

// Custom Express API error handler middleware to prevent Express returning raw HTML error pages
app.use("/api", (err: any, req: any, res: any, next: any) => {
  console.error("API Error Middleware caught:", err);
  res.status(200).json({
    status: "sucesso", // Always succeed on kids game so it never crashes
    feedback: "Que resposta maravilhosa! Você encheu nossa escola com muito amor e carinho hoje! 🎉🏰✨",
    nivel_ods4: 10,
    background_color: "#E8F5E9",
    elementos_ativos: ["Smile", "Heart", "Sparkles"],
    proximo_desafio: ""
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
