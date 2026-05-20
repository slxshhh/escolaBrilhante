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

const SYSTEM_INSTRUCTION = `Você é o motor lógico super rápido do jogo infantil "Escola Brilhante" (ODS 4) para crianças pequenas de 6 a 10 anos.

REGRAS DE JULGAMENTO ULTRA-LENIENTES (MAIS COMPREENSÃO, MAIS RAPIDEZ):
1. SEJA EXTREMAMENTE TOLERANTE E GENEROSO! Respostas curtas de uma ou duas palavras (como "jogo", "lixo", "ajudo", "desligo", "divido", "limpo", "água") ou com erros de ortografia devem ser interpretadas como SUCESSO absoluto.
2. Só retorne status "erro" se a criança escrever algo propositalmente cruel, violento ou destrutivo (como "bater", "quebrar", "desperdiçar de propósito"). Caso contrário, considere sempre SUCESSO!
3. O feedback deve ser super simples, alegre, carinhoso, muito curto (máximo de 1 a 2 sentenças bem simples de ler!) e cheio de emojis felizes (ex: "Parabéns! Você arrasou! Amamos sua ajuda! 🌟🏫").
4. Mantenha as respostas curtas para garantir que a resposta chegue quase instantaneamente.
5. Elementos ativos devem ser nomes válidos de ícones da Lucide-React (ex: 'Smile', 'Heart', 'Recycle', 'BookOpen', 'Trash2', 'Droplets', 'Sparkles', 'Sun', 'Sprout', 'Star', 'PartyPopper').`;

function getLocalHeuristicResponse(prompt: string, challengeId: string, currentLevel: number) {
  const normInput = (prompt || "").toLowerCase().trim();

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

  if (normInput.length < 3) {
    status = "erro";
    feedback = "Hum, sua resposta ficou muito curtinha! Conte para nós um pouco mais de como você pode ajudar? 💬🧸";
    backgroundColor = "#F1F5F9"; // Slate pastel
    activeElements = ["Frown", "Sparkles"];
  } else if (containsNegative) {
    status = "erro";
    feedback = "Ah, amiguinho! Fazer isso pode machucar, estragar as coisas ou deixar a escola triste. Que tal pensar em uma atitude legal e com carinho? 💖🩹";
    backgroundColor = "#FEF2F2"; // Red pastel
    activeElements = ["Frown", "Heart"];
  } else {
    status = "sucesso";
    backgroundColor = "#E8F5E9"; // Green pastel

    switch (challengeId) {
      case "lixo-patio":
        feedback = "Incrível! Jogando o lixo na lixeira você ajuda a manter nosso pátio cheiroso e limpo para brincarmos bastante! 🧹✨";
        activeElements = ["Trash2", "Recycle", "Sparkles"];
        break;
      case "colega-excluido":
        feedback = "Lindo coração! Convidar o amiguinho triste para brincar faz com que todo mundo se sinta bem-vindo na escola! 🧸❤️";
        activeElements = ["Users", "SmileIcon", "Heart"];
        break;
      case "desperdicio-agua":
        feedback = "Sensacional! Fechar a torneira economiza nosso bem maior: a água da natureza! Você agiu como um super-herói! 💧🦸";
        activeElements = ["Droplets", "Shield", "Sparkles"];
        break;
      case "plantas-sede":
        feedback = "Que carinho! Regar as plantinhas faz com que nosso jardim floresça com as cores mais bonitas de todas! 🌸💧🌱";
        activeElements = ["Sprout", "Droplets", "Sun"];
        break;
      case "sala-baguncada":
        feedback = "Que organização! Guardar as pecinhas nos lugares certos deixa nossa sala pronta para a próxima aventura divertida! 🧩📦";
        activeElements = ["Box", "Smile", "Sparkles"];
        break;
      case "luz-acesa":
        feedback = "Brilhante! Apagar as luzes quando ninguém está usando economiza energia e protege o nosso planeta! 💡🔌🔋";
        activeElements = ["Lightbulb", "ShieldCheck", "Sparkles"];
        break;
      case "livro-estragado":
        feedback = "Muito gentil! Cuidar do livrinho com carinho garante que mais crianças possam ler essas maravilhosas aventuras! 📚✨";
        activeElements = ["BookOpen", "Wrench", "Heart"];
        break;
      case "laranja-repartida":
        feedback = "Que amizade linda! Dividir o seu lanche com quem está com fome deixa o dia de vocês muito mais doce e feliz! 🍎🤝";
        activeElements = ["Heart", "Smile", "Sparkles"];
        break;
      case "fila-cantina":
        feedback = "Uau, que respeito! Esperar a sua vez na fila com calma e união mostra que você sabe conviver com muito amor! 🚶‍♂️💕";
        activeElements = ["Users", "Smile", "Handshake"];
        break;
      case "riscos-muro":
        feedback = "Maravilhoso! Cuidar das paredes e ajudar a manter a escola limpa deixa nosso espaço brilhante e novinho! 🎨🧹";
        activeElements = ["Brush", "Sparkles", "Smile"];
        break;
      case "tia-limpeza":
        feedback = "Excelente gratidão! Manter a sala cheirosa e limpinha ajuda muito a tia da limpeza, que trabalha com tanto amor! ✨🧼🧹";
        activeElements = ["Smile", "Heart", "Sparkles"];
        break;
      case "amigo-magoado":
        feedback = "Orgulhosos de você! Defender o amiguinho e dizer aos outros para respeitá-lo espalha amor e paz pela escola! 💖🌈🙅‍♀️";
        activeElements = ["Heart", "Shield", "Sparkles"];
        break;
      default:
        feedback = "Espetacular! Sua resposta ajuda muito a tornar a nossa escola um lugar mais brilhante e feliz! Mandou muito bem! 🌟🏰";
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
  const { prompt, currentLevel, challenge } = req.body;

  try {
    // If API key is completely missing, jump straight to local heuristics for speed & reliability
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not defined, using local kid heuristics parser.");
      const fallbackResult = getLocalHeuristicResponse(prompt, challenge?.id || "", Number(currentLevel) || 0);
      return res.json(fallbackResult);
    }

    // Direct local fallback if we know the quota is currently exhausted (prevents slow API rate-limit delays)
    if (isQuotaExhausted && Date.now() < quotaResetTime) {
      console.log("Desvio inteligente ativado: Gemini em pausa por excesso de cota. Retorno local instantâneo!");
      const fallbackResult = getLocalHeuristicResponse(prompt, challenge?.id || "", Number(currentLevel) || 0);
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
            systemInstruction: SYSTEM_INSTRUCTION,
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
      const fallbackResult = getLocalHeuristicResponse(prompt, challenge?.id || "", Number(currentLevel) || 0);
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
