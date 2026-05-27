/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { GameState, Challenge, INITIAL_CHALLENGES, CHALLENGE_PAIRS, GameStatus, CLASSROOMS, ClassroomLevel } from "./types";
import ProgressBar from "./components/ProgressBar";
import Scenario from "./components/Scenario";
import NarrativeBubble from "./components/NarrativeBubble";
import MediatorPanel from "./components/MediatorPanel";
import { Sparkles, RotateCcw } from "lucide-react";
// @ts-ignore
import escolaSuccessImg from "./assets/images/colegio_floresta_sucesso_1779732904503.png";
import GlitchScreen from "./components/GlitchScreen";
import { getLocalHeuristicResponse } from "./utils/heuristics";

const SESSION_CHALLENGE_COUNT = 6;

export default function App() {
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomLevel | null>(null);
  const [isBugged, setIsBugged] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
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

  const initGameForClassroom = (classroom: ClassroomLevel) => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setIsWaitingTransition(false);

    // Shuffle indices 0..5 randomly so sequence is varied
    const indices = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
    const isKinder = classroom.id === "1_ano" || classroom.id === "2_ano";

    const selectedChallenges = indices.map(idx => {
      const pair = CHALLENGE_PAIRS[idx];
      return pair[isKinder ? 0 : 1];
    });

    setShuffledChallenges(selectedChallenges);
    setCurrentIndex(0);
    setCompletedCount(0);
    setGameState({
      status: GameStatus.SUCESSO,
      feedback: selectedChallenges[0].description,
      nivel_ods4: 0,
      background_color: "#E0F2FE",
      elementos_ativos: selectedChallenges[0].initialIcons,
      proximo_desafio: selectedChallenges[0].description
    });
  };

  const restartGame = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setIsWaitingTransition(false);

    if (selectedClassroom) {
      initGameForClassroom(selectedClassroom);
      return;
    }

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

  const handleRollbackToMenu = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setIsWaitingTransition(false);
    setSelectedClassroom(null);
    setIsBugged(true);
  };

  const handleAction = async (input: string) => {
    if (!currentChallenge) return;
    
    setLoading(true);
    try {
      let data: GameState;

      if (isOfflineMode) {
        // Pure local evaluation - bypasses server API completely
        data = getLocalHeuristicResponse(input, currentChallenge.id, gameState.nivel_ods4, selectedClassroom?.id || "5_ano");
      } else {
        const response = await fetch("/api/game/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: input,
            currentLevel: gameState.nivel_ods4,
            challenge: currentChallenge,
            grade: selectedClassroom?.id || "5_ano",
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
        try {
          data = JSON.parse(rawText);
        } catch (parseError) {
          console.error("Failed to parse response JSON. Raw output was:", rawText);
          throw new Error("Ops! O servidor retornou um formato inesperado.");
        }
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
          }, 8000);
        }
      }
    } catch (error: any) {
      console.warn("Estouro de limite do Gemini ou instabilidade. Ativando Modo Off-line automaticamente!", error);
      setIsOfflineMode(true);
      
      // Execute the local heuristic instantly so the children never see any error screen
      const data = getLocalHeuristicResponse(input, currentChallenge.id, gameState.nivel_ods4, selectedClassroom?.id || "5_ano");
      
      // Append an indicator to feedback so the mediator knows we handled it safely
      data.feedback = data.feedback + " 🛡️ (Modo de Segurança Ativado)";

      const isSuccess = data.status === GameStatus.SUCESSO;
      const newCompletedCount = isSuccess ? completedCount + 1 : completedCount;
      const progress = Math.min(100, Math.round((newCompletedCount / SESSION_CHALLENGE_COUNT) * 100));

      setGameState({
        ...data,
        nivel_ods4: progress
      });

      if (isSuccess) {
        setCompletedCount(newCompletedCount);
        if (newCompletedCount < SESSION_CHALLENGE_COUNT) {
          setIsWaitingTransition(true);
          transitionTimerRef.current = setTimeout(() => {
            handleNextQuestion();
          }, 8000);
        }
      }
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
  }, [currentIndex, shuffledChallenges]);

  if (isBugged) {
    return <GlitchScreen onResolve={(classroom) => {
      setSelectedClassroom(classroom);
      setIsBugged(false);
      initGameForClassroom(classroom);
    }} />;
  }

  if (!currentChallenge) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-[#39FF14] font-mono text-4xl animate-pulse">CARREGANDO SISTEMA... 🦾🤖</div>;

  const isCelebration = completedCount === SESSION_CHALLENGE_COUNT;

  return (
    <div className="min-h-screen overflow-hidden font-sans select-none relative">
      <ProgressBar 
        level={gameState.nivel_ods4} 
        onClick={handleProgressClick} 
        selectedClassroom={selectedClassroom}
        onRollback={handleRollbackToMenu}
      />
      
      <Scenario 
        backgroundColor={gameState.background_color} 
        elements={gameState.elementos_ativos} 
        level={gameState.nivel_ods4}
        refreshKey={refreshKey}
      />

      {isCelebration ? (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md z-45 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.8, rotate: -3, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="bg-white border-[10px] border-yellow-300 rounded-[3.5rem] p-6 sm:p-10 text-center max-w-2xl w-full shadow-[0_45px_100px_rgba(0,0,0,0.5)] relative my-8"
          >
            {/* Animating Sparkles or Celebration Emojis */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl sm:text-7xl mb-4"
            >
              🏆✨🏰
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-2 tracking-tight drop-shadow-sm uppercase">
              Super Vitória! 🎉
            </h1>

            {/* School Success Cartoon Artwork */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="my-5 border-4 border-amber-200 rounded-[2.5rem] overflow-hidden shadow-md max-w-md mx-auto aspect-[4/3] bg-sky-100 flex items-center justify-center relative group"
            >
              <img 
                src={escolaSuccessImg} 
                alt="Colégio Floresta Limpo e Feliz" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 bg-blue-500 text-white font-black text-xs px-3 py-1.5 rounded-full animate-bounce shadow-lg">
                COLÉGIO FLORESTA! 🌟
              </div>
            </motion.div>
            
            <p className="text-lg sm:text-xl font-bold text-slate-700 leading-relaxed mb-6 px-2">
              Parabéns, Amigos do <span className="text-blue-600 font-extrabold">Colégio Floresta</span>! A nossa escola está <span className="text-emerald-500 font-extrabold">100% Brilhante</span>, limpa, organizada e cheia de flores e alegria por causa do carinho de todos vocês! Vocês são os verdadeiros guardiões do nosso lindo planeta! 🌈🌸🍃
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartGame}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 text-white font-black text-lg rounded-[2rem] shadow-[0_12px_25px_-5px_rgba(245,158,11,0.5)] border-4 border-white bouncy-btn flex items-center gap-3 cursor-pointer"
              >
                Jogar de Novo! 🔄
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRollbackToMenu}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-lg rounded-[2rem] shadow-[0_12px_25px_-5px_rgba(59,130,246,0.5)] border-4 border-white bouncy-btn flex items-center gap-3 cursor-pointer"
              >
                Próxima Sala / Novo Jogo 🎒
              </motion.button>
            </div>
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

          <MediatorPanel 
            onSend={handleAction} 
            disabled={loading} 
            isOfflineMode={isOfflineMode}
            setIsOfflineMode={setIsOfflineMode}
          />
        </>
      )}
    </div>
  );
}
