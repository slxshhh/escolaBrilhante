/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { GameState, Challenge, INITIAL_CHALLENGES, GameStatus } from "./types";
import ProgressBar from "./components/ProgressBar";
import Scenario from "./components/Scenario";
import NarrativeBubble from "./components/NarrativeBubble";
import MediatorPanel from "./components/MediatorPanel";
import { Sparkles } from "lucide-react";

const SESSION_CHALLENGE_COUNT = 6;

export default function App() {
  const [shuffledChallenges, setShuffledChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isWaitingTransition, setIsWaitingTransition] = useState(false);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.SUCESSO,
    feedback: "Bem-vindos ao Escola Brilhante! Vamos transformar nossa escola juntos? 🤔✨",
    nivel_ods4: 0,
    background_color: "#E0F2FE", // Soft sky blue start
    elementos_ativos: [],
    proximo_desafio: "",
  });

  const handleNextQuestion = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setIsWaitingTransition(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const restartGame = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setIsWaitingTransition(false);
    const shuffled = [...INITIAL_CHALLENGES].sort(() => Math.random() - 0.5).slice(0, SESSION_CHALLENGE_COUNT);
    setShuffledChallenges(shuffled);
    setCurrentIndex(0);
    setCompletedCount(0);
    setGameState({
      status: GameStatus.SUCESSO,
      feedback: shuffled[0].description,
      nivel_ods4: 0,
      background_color: "#E0F2FE",
      elementos_ativos: shuffled[0].initialIcons,
      proximo_desafio: shuffled[0].description
    });
  };

  // Shuffle and pick session challenges on mount
  useEffect(() => {
    restartGame();
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const currentChallenge = shuffledChallenges[currentIndex];

  const handleProgressClick = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleAction = async (input: string) => {
    if (!currentChallenge) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/game/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          currentLevel: gameState.nivel_ods4,
          challenge: currentChallenge,
        }),
      });

      if (!response.ok) {
        const textErr = await response.text().catch(() => "");
        let errorMsg = "Falha na conexão";
        try {
          const errorData = JSON.parse(textErr);
          errorMsg = errorData.error || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const rawText = await response.text();
      let data: GameState;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error("Failed to parse response JSON. Raw output was:", rawText);
        throw new Error("Ops! O servidor enviou uma resposta que a nossa escola mágica não entendeu. Vamos tentar novamente? 🪄🏫");
      }
      
      const isSuccess = data.status === GameStatus.SUCESSO;
      const newCompletedCount = isSuccess ? completedCount + 1 : completedCount;
      const progress = Math.min(100, Math.round((newCompletedCount / SESSION_CHALLENGE_COUNT) * 100));

      setGameState({
        ...data,
        nivel_ods4: progress
      });

      // If success, move to next challenge after a delay
      if (isSuccess) {
        setCompletedCount(newCompletedCount);
        if (newCompletedCount < SESSION_CHALLENGE_COUNT) {
          setIsWaitingTransition(true);
          transitionTimerRef.current = setTimeout(() => {
            handleNextQuestion();
          }, 4000);
        }
      }
    } catch (error: any) {
      console.error(error);
      setGameState(prev => ({
        ...prev,
        status: GameStatus.ERRO,
        feedback: error?.message || "Ops! A magia falhou. Vamos tentar de novo? 🪄🕯️",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Sync state when challenge changes
  useEffect(() => {
    if (shuffledChallenges.length > 0 && currentChallenge && completedCount < SESSION_CHALLENGE_COUNT) {
      setGameState(prev => ({
        ...prev,
        elementos_ativos: currentChallenge.initialIcons,
        feedback: currentChallenge.description
      }));
    }
  }, [currentIndex, shuffledChallenges, completedCount]);

  if (!currentChallenge) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white font-black text-4xl animate-pulse">CARREGANDO ESCOLA... 🏫</div>;

  const isCelebration = completedCount === SESSION_CHALLENGE_COUNT;

  return (
    <div className="min-h-screen overflow-hidden font-sans select-none">
      <ProgressBar level={gameState.nivel_ods4} onClick={handleProgressClick} />
      
      <Scenario 
        backgroundColor={gameState.background_color} 
        elements={gameState.elementos_ativos} 
        level={gameState.nivel_ods4}
        refreshKey={refreshKey}
      />

      {isCelebration ? (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-white/20 backdrop-blur-md z-40">
          <motion.div
            initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="bg-white/90 border-[10px] border-yellow-300 rounded-[4rem] p-8 sm:p-12 text-center max-w-2xl shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)] magic-glow relative"
          >
            {/* Animating Sparkles or Celebration Emojis */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-7xl sm:text-8xl mb-6"
            >
              🏆✨🏰
            </motion.div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-blue-600 mb-4 tracking-tight drop-shadow-sm uppercase">
              Super Vitória! 🎉
            </h1>
            
            <p className="text-xl sm:text-2xl font-black text-slate-700 leading-relaxed mb-8">
              Parabéns, Amigos! A nossa escola está <span className="text-emerald-500">100% Brilhante</span>, limpa, organizada e muito mais alegre por causa do carinho de vocês! Vocês são os verdadeiros defensores do planeta! 🌈🌸🍃
            </p>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={restartGame}
              className="px-10 py-5 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 text-white font-black text-xl sm:text-2xl rounded-[2.5rem] shadow-[0_15px_30px_-5px_rgba(245,158,11,0.5)] border-4 border-white bouncy-btn flex items-center gap-3 mx-auto"
            >
              Jogar de Novo! 🔄
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Challenge Title Overlay */}
          <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full text-center px-4">
            <motion.div
              key={currentChallenge.id}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block"
            >
              <div className="bg-white/80 backdrop-blur-md px-12 py-4 rounded-full border-4 border-sky-200/50 shadow-2xl">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-700 flex items-center gap-4 justify-center">
                  <span className="animate-pulse">✨</span>
                  {currentChallenge.title}
                  <span className="animate-pulse">✨</span>
                </h1>
              </div>
            </motion.div>
          </div>

          <NarrativeBubble 
            feedback={gameState.feedback} 
            loading={loading}
            theme={gameState.status === GameStatus.ERRO ? 'dark' : 'white'}
            isWaitingTransition={isWaitingTransition}
            onNext={handleNextQuestion}
          />

          <MediatorPanel onSend={handleAction} disabled={loading} />
        </>
      )}
    </div>
  );
}
