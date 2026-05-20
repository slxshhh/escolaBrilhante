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

const SYSTEM_INSTRUCTION = `Você é o motor lógico do jogo "Escola Brilhante", focado na ODS 4 (Educação de Qualidade).
Sua função é processar ações de crianças (6-10 anos) e retornar o estado do jogo.

REGRAS DE LÓGICA:
1. Analise se a resposta do usuário resolve o problema de forma ética, sustentável e educativa.
2. Se positivo: Aumente nivel_ods4 e use cores vibrantes (ex: #4ADE80, #60A5FA).
3. Se negativo: Explique o erro gentilmente e mantenha a escola em tons de cinza ou cores calmas (ex: #94A3B8).
4. Feedback deve ser lúdico, curto (max 2 frases) e conter emojis.
5. Elementos ativos devem ser nomes de ícones da Lucide-React (ex: 'Smile', 'Heart', 'Recycle', 'Book', 'Trash2', 'Droplets').

Retorne SEMPRE um JSON válido.`;

app.post("/api/game/action", async (req, res) => {
  const { prompt, currentLevel, challenge } = req.body;

  try {
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
    console.error("Gemini API Final Error:", error);
    res.status(503).json({ 
      error: "A magia está muito forte agora! Tente novamente em um instante. ✨",
      details: error?.message 
    });
  }
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
