/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GameState, Challenge, INITIAL_CHALLENGES, GameStatus } from "./types";
import ProgressBar from "./components/ProgressBar";
import Scenario from "./components/Scenario";
import NarrativeBubble from "./components/NarrativeBubble";
import MediatorPanel from "./components/MediatorPanel";
import { Sparkles } from "lucide-react";

export default function App() {
  const [shuffledChallenges, setShuffledChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.SUCESSO,
    feedback: "Bem-vindos ao Escola Brilhante! Vamos transformar nossa escola juntos? 🤔✨",
    nivel_ods4: 0,
    background_color: "#94A3B8", // Initial gray
    elementos_ativos: [],
    proximo_desafio: "",
  });

  // Shuffle challenges on mount
  useEffect(() => {
    const shuffled = [...INITIAL_CHALLENGES].sort(() => Math.random() - 0.5);
    setShuffledChallenges(shuffled);
    // Set initial state with first challenge
    setGameState(prev => ({
      ...prev,
      elementos_ativos: shuffled[0].initialIcons,
      feedback: shuffled[0].description,
      proximo_desafio: shuffled[0].description
    }));
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Falha na conexão");
      }

      const data: GameState = await response.json();
      
      // Calculate progress based on number of completed challenges
      // We use the AI's success status to decide if we increment
      const newCompletedCount = data.status === GameStatus.SUCESSO ? completedCount + 1 : completedCount;
      const progress = Math.round((newCompletedCount / INITIAL_CHALLENGES.length) * 100);

      setGameState({
        ...data,
        nivel_ods4: progress
      });

      // If success, move to next challenge after a delay
      if (data.status === GameStatus.SUCESSO) {
        setCompletedCount(newCompletedCount);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % shuffledChallenges.length);
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      setGameState(prev => ({
        ...prev,
        status: GameStatus.ERRO,
        feedback: "Ops! A magia falhou. Vamos tentar de novo? 🪄🕯️",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Sync state when challenge changes
  useEffect(() => {
    if (shuffledChallenges.length > 0 && currentChallenge) {
      setGameState(prev => ({
        ...prev,
        elementos_ativos: currentChallenge.initialIcons,
        feedback: currentChallenge.description
      }));
    }
  }, [currentIndex, shuffledChallenges]);

  if (!currentChallenge) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white font-black text-4xl animate-pulse">CARREGANDO ESCOLA... 🏫</div>;

  return (
    <div className="min-h-screen overflow-hidden font-sans select-none">
      <ProgressBar level={gameState.nivel_ods4} onClick={handleProgressClick} />
      
      <Scenario 
        backgroundColor={gameState.background_color} 
        elements={gameState.elementos_ativos} 
        level={gameState.nivel_ods4}
        refreshKey={refreshKey}
      />

      {/* Challenge Title Overlay */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full text-center px-4">
        <motion.div
          key={currentChallenge.id}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block"
        >
          <div className="bg-slate-900/40 backdrop-blur-md px-12 py-4 rounded-full border-4 border-white/30 shadow-2xl">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.15em] text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] flex items-center gap-6 justify-center">
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
      />

      <MediatorPanel onSend={handleAction} disabled={loading} />
    </div>
  );
}
