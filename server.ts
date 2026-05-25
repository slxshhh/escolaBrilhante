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
      return `Você é o motor lógico lúdico do jogo infantil "Escola Brilhante" (ODS 4) para a turma do 1º ANO A (crianças pequenas de 6 anos).
REGRAS DE JULGAMENTO ULTRA-AMIGÁVEIS E FACILITADAS:
1. SEJA TOTALMENTE INDULGENTE! Toda resposta sincera ou positiva, mesmo com erros extremos de ortografia infantil ou de uma só palavra ("lixo", "flor", "ajuda", "feliz"), é SUCESSO.
2. Escreva feedbacks extremamente mágicos e lúdicos com emojis gigantes. Mencione fantasias como aspas mágicas, fadinhas, sorrisos purpurinados e animais falantes amigos da natureza.
3. Máximo de 2 frases curtinhas e simples de ler em um projetor no fundo da sala.
4. Só dê "erro" se houver violência óbvia ou destruição proposital.`;
    case "2_ano":
      return `Você é o motor lúdico do jogo "Escola Brilhante" (ODS 4) para a turma do 2º ANO A (crianças de 7 anos).
REGRAS DE CONTROLE:
1. Altamente tolerante. Respostas resumidas de cuidado e união ("ajudo o colega triste", "limpo a mesa") devem ser SUCESSO absoluto.
2. Escreva feedbacks vibrantes, fofos e alegres usando simpáticos emojis de plantas 🌱, gotinhas 💧 e sorrisos 🧸.
3. Máximo de 2 frases simples ressaltando como a amizade infantil e pequenas boas ações modificam a escola.`;
    case "3_ano":
      return `Você é o motor de avaliação do jogo "Escola Brilhante" (ODS 4) para o 3º ANO A (crianças de 8 anos).
REGRAS PEDAGÓGICAS:
1. Nível intermediário de tolerância. Respostas estruturadas simples são perfeitas.
2. Feedback estimulante e acolhedor focado em bons hábitos diários (organização, boa convivência, economia de água).
3. Máximo de 2 frases. Use tom amistoso de companheirismo e aprendizagem inteligente.`;
    case "4_ano":
      return `Você é o motor inteligente do jogo "Escola Brilhante" (ODS 4) para a turma do 4º ANO A (crianças de 9 anos).
REGRAS:
1. Julgamento focado em cooperação de equipe, inclusão e sustentabilidade. Respostas que tragam união, diálogo e pequenas atitudes coletivas são muito elogiadas.
2. Feedback no tom de "Missão Cooperativa", parabenizando a inteligência coletiva e o respeito recíproco.
3. Máximo de 2 frases equilibradas com emojis de união e proteção (ex: 🤝, 🏫, 🛡️).`;
    case "5_ano":
    default:
      return `Você é o motor analítico e de cidadania do jogo "Escola Brilhante" (ODS 4) para a turma do 5º ANO A (pré-adolescentes de 10 anos).
REGRAS DE CRÍTICA ÉTICA:
1. Julgamento baseado em Cidadania Ativa. Para alcançar SUCESSO, a resposta da turma deve propor uma ação que demonstre responsabilidade proativa, empatia com o outro ou preservação ambiental lógica.
2. Evite infantilizar o tom ou usar termos de fadas. Trate-os como agentes transformadores do Colégio Floresta.
3. Feedbacks inteligentes, conectando a resposta diretamente ao impacto positivo na comunidade escolar. Máximo de 2 frases estruturadas.`;
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
      ? "Hum, sua resposta está curtinha demais! Conte com carinho como você e seus amigos podem ajudar? 💬🧸"
      : "Raciocínio incompleto detectado! Escreva uma solução com mais cooperação para ativarmos os geradores da ODS 4! 💡🎒";
    backgroundColor = "#F1F5F9"; 
    activeElements = ["Frown", "Sparkles"];
  } else if (containsNegative) {
    status = "erro";
    feedback = isKinder
      ? "Amiguinho, fazer isso deixa as plantinhas tristes e nosso coração dodói. Que tal pensar em amor e abraços? 💖🩹"
      : "Raciocínio incompatível com os pilares éticos da ODS 4. Proponha uma alternativa saudável, ecológica ou de diálogo! 🩹🏫";
    backgroundColor = "#FEF2F2"; 
    activeElements = ["Frown", "Heart"];
  } else {
    status = "sucesso";
    backgroundColor = "#E8F5E9"; 

    switch (challengeId) {
      case "lixo-patio":
        feedback = isKinder
          ? "Uau! O pátio do Colégio Floresta ficou cheiroso e limpinho para brincarmos de montanha-russa! Escorregadores brilhantes! 🧹✨🦖"
          : "Excelente solução sustentável! Recolher os resíduos plásticos protege a flora local e promove hábitos saudáveis de cidadania! 🧹✨";
        activeElements = ["Trash2", "Recycle", "Sparkles"];
        break;
      case "colega-excluido":
        feedback = isKinder
          ? "Lindo gesto de coração! Convidar o amiguinho para brincar encheu o quintal de luz e arco-íris! 🧸❤️🌈"
          : "Gesto exemplar de inclusão! Chamar um colega isolado fortalece o sentimento de união e elimina barreiras sociais. 🧸🏫🤝";
        activeElements = ["Users", "Smile", "Heart"];
        break;
      case "desperdicio-agua":
        feedback = isKinder
          ? "Super-herói da água! Fechar a torneira evitou o desperdício das gotinhas mágicas! Maravilhoso! 💧🦸🧚"
          : "Consciência ecológica exemplar! O controle no uso da água combate o desperdício global e preservação hídrica ativa! 💧⚡🌱";
        activeElements = ["Droplets", "Shield", "Sparkles"];
        break;
      case "plantas-sede":
        feedback = isKinder
          ? "Que amor! Regar as plantinhas do Colégio Floresta com gotinhas doces vai atrair lindas borboletas! 🌸💧🌱"
          : "Atitude proativa fantástica! Manter as flores hidratadas embeleza nosso campus e estimula a consciência ecológica! 🌸💧🌱";
        activeElements = ["Sprout", "Droplets", "Sun"];
        break;
      default:
        feedback = isKinder
          ? "Espetacular! Sua resposta encheu nosso dia com pó de pirlimpimpim e alegria! Vocês mandaram muito bem! 🦄🌸🏰"
          : "Fabuloso! Raciocínio coletivo aprovado pelas diretrizes da ODS 4. Vocês uniram raciocínio prático com empatia transformadora! 🌟🏫✨";
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
