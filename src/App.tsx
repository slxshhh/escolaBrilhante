/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { GameState, Challenge, INITIAL_CHALLENGES, GameStatus, CLASSROOMS, ClassroomLevel } from "./types";
import ProgressBar from "./components/ProgressBar";
import Scenario from "./components/Scenario";
import NarrativeBubble from "./components/NarrativeBubble";
import MediatorPanel from "./components/MediatorPanel";
import { Sparkles, RotateCcw } from "lucide-react";
// @ts-ignore
import escolaSuccessImg from "./assets/images/colegio_floresta_sucesso_1779732904503.png";
import GlitchScreen from "./components/GlitchScreen";

const SESSION_CHALLENGE_COUNT = 6;

export default function App() {
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomLevel | null>(null);
  const [isBugged, setIsBugged] = useState(true);
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

  if (isBugged) {
    return <GlitchScreen onResolve={(classroom) => {
      setSelectedClassroom(classroom);
      setIsBugged(false);
    }} />;
  }

  if (!currentChallenge) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-[#39FF14] font-mono text-4xl animate-pulse">CARREGANDO SISTEMA... 🦾🤖</div>;

  const isCelebration = completedCount === SESSION_CHALLENGE_COUNT;

  return (
    <div className="min-h-screen overflow-hidden font-sans select-none relative">
      <ProgressBar level={gameState.nivel_ods4} onClick={handleProgressClick} />
      
      {/* Dynamic Classroom Badge Overlay with Rollback Action */}
      {selectedClassroom && (
        <div className="fixed top-24 left-4 z-40 flex flex-row items-center gap-2 select-none">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/95 backdrop-blur-md shadow-2xl px-5 py-2.5 rounded-2xl border flex items-center gap-3 transition-colors"
            style={{ borderColor: `${selectedClassroom.themeColor}dd` }}
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: selectedClassroom.themeColor }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: selectedClassroom.themeColor }}></span>
            </div>
            <div>
              <span className="text-white font-extrabold text-xs block leading-none antialiased">
                TURMA: {selectedClassroom.name} 🎒
              </span>
              <span className="text-slate-400 text-[10px] font-mono leading-none mt-1 block uppercase">
                Foco: {selectedClassroom.difficulty}
              </span>
            </div>
          </motion.div>

          {/* Rollback to main classroom triage menu */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRollbackToMenu}
            className="cursor-pointer bg-slate-950/90 hover:bg-[#39FF14] text-[#39FF14] hover:text-slate-950 px-4 py-3 rounded-2xl border border-slate-800 hover:border-[#39FF14] shadow-2xl flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-wider transition-all"
            title="Mudar de sala"
          >
            <RotateCcw className="w-3.5 h-3.5 animate-spin-reverse" />
            <span className="hidden sm:inline">Trocar de Sala</span>
          </motion.button>
        </div>
      )}
      
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

          <MediatorPanel onSend={handleAction} disabled={loading} />
        </>
      )}
    </div>
  );
}
