import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, ShieldAlert, Cpu, Lock, Activity } from "lucide-react";

interface GlitchScreenProps {
  onResolve: () => void;
}

export default function GlitchScreen({ onResolve }: GlitchScreenProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [typedText, setTypedText] = useState("");
  const [isReadyToUnlock, setIsReadyToUnlock] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolvingStep, setResolvingStep] = useState(0);

  const rawLogs = [
    "⚡ INICIALIZANDO INTERFACE DE CONEXÃO COGNITIVA...",
    "🔑 DEPOIS DE COMENTAR O PLANO, PREPARE AS CRIANÇAS!",
    "⚠️ ALERTA: ANOMALIA DE CONVIVÊNCIA DETECTADA NO PÁTIO!",
    "🚨 ERRO CURIOSO: AS FLORES PRECISAM DE MAIS CORES E CUIDADOS!",
    "🛑 SISTEMA AGUARDANDO MANUAL: AGUARDANDO AMOR E SUSTENTABILIDADE!",
    "💻 PRONTO: UNIVERSITÁRIOS, CONECTEM OS MELHORES DEFENSORES DA TERRA!",
  ];

  const missionText = "Atenção Alunos! Nós somos os cientistas da computação e criamos um supercomputador para construir a 'Escola Mais Brilhante do Mundo'. Mas deu um BUG! O sistema travou porque detectou problemas na escola que as máquinas não sabem resolver sozinhas. Somente as respostas criativas e cheias de amor de vocês podem salvar esta escola! Aceitam a Missão ODS 4?";

  const resolvingMessages = [
    "Vaporizando poeira e teias de aranha dos servidores... 🧹👾",
    "Estendendo o grande arco-íris de proteção... 🌈🛡️",
    "Abastecendo os geradores com o sorriso das crianças... 😊🔌",
    "Ligando os aspersores mágicos para regar as plantinhas... 🚿🌸",
    "Ativando o motor de Inteligência Amorosa para a ODS 4... 🤖💝",
    "A escola está se enchendo de brilho e vida... ✨🏫✨"
  ];

  // Typing effect for the mission message
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < missionText.length) {
        setTypedText((prev) => prev + (missionText[index] || ""));
        index++;
      } else {
        clearInterval(interval);
        setIsReadyToUnlock(true);
      }
    }, 20); // Fast but readable typing

    return () => clearInterval(interval);
  }, []);

  // Stagger logs loading
  useEffect(() => {
    let logIndex = 0;
    const timeout = setInterval(() => {
      if (logIndex < rawLogs.length) {
        setLogs((prev) => [...prev, rawLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(timeout);
      }
    }, 700);

    return () => clearInterval(timeout);
  }, []);

  // Handle the active magical reconstruction phase
  useEffect(() => {
    if (!isResolving) return;

    const interval = setInterval(() => {
      setResolvingStep((prev) => {
        if (prev < resolvingMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Small delay before final switch
          setTimeout(() => {
            onResolve();
          }, 600);
          return prev;
        }
      });
    }, 1000); // 1s per message so children can read and find it super amusing!

    return () => clearInterval(interval);
  }, [isResolving]);

  const startRebuild = () => {
    setIsResolving(true);
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-slate-950 text-[#39FF14] font-mono flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden z-[100]">
      {/* Glitch / CRT Screen Line overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_100%)] scanlines animate-pulse" />

      <AnimatePresence mode="wait">
        {!isResolving ? (
          <motion.div 
            key="terminal-view"
            className="flex flex-col justify-between h-full w-full"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {/* Top Warning Banner */}
            <div className="flex items-center justify-between border-b-2 border-amber-500/30 pb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-amber-400 animate-pulse" />
                </motion.div>
                <div>
                  <span className="text-amber-400 font-extrabold text-sm md:text-lg block tracking-wider uppercase">
                    [ !!! DESAFIO MÁGICO DETECTADO !!! ]
                  </span>
                  <span className="text-slate-400 text-xs md:text-sm">STATUS: SISTEMA EM ESPERA</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm">
                <Activity className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>Missão ODS 4</span>
              </div>
            </div>

            {/* Main Terminal Zone */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-stretch h-[70vh] relative z-10 w-full max-w-7xl mx-auto">
              
              {/* Left Side: Cyber Logs */}
              <div className="lg:col-span-12 xl:col-span-5 bg-slate-900/60 border-2 border-[#39FF14]/20 rounded-2xl p-4 md:p-6 overflow-hidden flex flex-col gap-3 shadow-[0_0_30px_rgba(57,255,20,0.05)]">
                <div className="flex items-center gap-2 text-slate-400 border-b border-[#39FF14]/10 pb-2 text-xs md:text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>SALA DE CONTROLE UNIVERSITÁRIA</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 text-xs md:text-sm text-emerald-400 font-mono scrollbar-none pr-1">
                  <AnimatePresence>
                    {logs.map((log, i) => {
                      const safeLog = log || "";
                      const isWarning = safeLog.includes("🚨") || safeLog.includes("⚠️") || safeLog.includes("🛑");
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={isWarning ? "text-amber-300 font-bold" : ""}
                        >
                          {safeLog}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
                
                {/* Animated CPU and core state */}
                <div className="flex items-center justify-between bg-zinc-900/80 rounded-xl p-3 border border-[#39FF14]/25 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Cpu className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>NÚCLEO DIGITAL MÁGICO</span>
                  </div>
                  <span className="text-[#39FF14] font-bold animate-pulse">PRONTO PARA CRESCER</span>
                </div>
              </div>

              {/* Right Side: The Narrative Challenge Box (The Bug Plot) */}
              <div className="lg:col-span-12 xl:col-span-7 bg-slate-900 border-4 border-[#39FF14]/30 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative shadow-[0_0_50px_rgba(57,255,20,0.1)]">
                
                {/* Glitch Aesthetic Header */}
                <div className="relative">
                  <span className="absolute top-0 left-0 text-slate-800 text-3xl font-black opacity-30 select-none">BUG DETECTADO</span>
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400 relative tracking-wide uppercase font-sans animate-flicker">
                    ⚡ AJUDA COLETIVA REQUISITADA
                  </h2>
                </div>

                {/* Scrolling Speech bubble of science group */}
                <div className="my-6 flex-1 bg-slate-950/80 border-2 border-[#39FF14]/10 rounded-2xl p-4 md:p-6 text-slate-300 relative">
                  <div className="text-sm md:text-base lg:text-lg leading-relaxed font-sans text-[#a7f3d0]">
                    {typedText}
                    <span className="inline-block w-2.5 h-4 bg-[#39FF14] ml-1 animate-blink" />
                  </div>

                  {/* Scientific/Mediator badge */}
                  <div className="absolute -top-3.5 right-6 bg-amber-500 text-slate-950 text-[10px] md:text-sm font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 border-slate-900">
                    MISSÃO OFICIAL ODS 4 🏫
                  </div>
                </div>

                {/* Action Trigger button */}
                <div className="flex flex-col items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={startRebuild}
                    className={`w-full py-4 md:py-6 rounded-2xl md:rounded-[2rem] border-4 cursor-pointer text-center font-black text-lg md:text-2xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300
                      ${isReadyToUnlock 
                        ? "bg-gradient-to-r from-emerald-400 via-emerald-300 to-[#39FF14] text-slate-950 border-[#39FF14] shadow-[0_20px_45px_rgba(16,185,129,0.35)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.5)] animate-bounce" 
                        : "bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed shadow-none"
                      }
                    `}
                    disabled={!isReadyToUnlock}
                  >
                    <Lock className={`w-5 h-5 md:w-6 md:h-6 ${isReadyToUnlock ? "animate-pulse" : ""}`} />
                    <span>ENTRAR NA AVENTURA MÁGICA! 🔑🚀</span>
                  </motion.button>
                  <span className="text-slate-500 text-[10px] md:text-xs md:-mt-1 text-center font-sans">
                    * Universitários do bem: Combinem o grito de guerra da turma antes de clicar!
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Magical Transition Loader View */
          <motion.div
            key="magical-transition"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center max-w-4xl mx-auto h-[80vh] w-full"
          >
            {/* Spinning, Pulsing Magic Circle with emojis representing growth */}
            <div className="relative mb-10 w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Outer neon spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-8 border-dashed border-[#39FF14] rounded-full opacity-60 flex items-center justify-center"
              />
              {/* Inner glowing circle */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute w-36 h-36 sm:w-44 sm:h-44 bg-emerald-500/20 rounded-full border-4 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.5)] flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl sm:text-6xl"
                >
                  🧙‍♂️✨
                </motion.div>
              </motion.div>

              {/* Orbiting particles/emojis */}
              <motion.div className="absolute text-3xl" animate={{ x: [-80, -90, -80], y: [-60, -50, -60] }} transition={{ repeat: Infinity, duration: 1.2 }}>🌸</motion.div>
              <motion.div className="absolute text-3xl" animate={{ x: [80, 90, 80], y: [-40, -50, -40] }} transition={{ repeat: Infinity, duration: 1.5 }}>🌈</motion.div>
              <motion.div className="absolute text-3xl" animate={{ x: [-75, -65, -75], y: [60, 50, 60] }} transition={{ repeat: Infinity, duration: 1.1 }}>🏫</motion.div>
              <motion.div className="absolute text-3xl" animate={{ x: [75, 65, 75], y: [65, 75, 65] }} transition={{ repeat: Infinity, duration: 1.7 }}>🎒</motion.div>
            </div>

            {/* Action Text */}
            <motion.h3 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-2xl sm:text-4xl text-center font-black uppercase text-yellow-300 tracking-wide font-sans mb-6 text-shadow"
            >
              🪄 CONVERTENDO ERROS EM APRENDIZADO...
            </motion.h3>

            {/* Active message bubble */}
            <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl p-6 text-center max-w-xl shadow-lg w-full">
              <motion.div
                key={resolvingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-base sm:text-lg text-[#a7f3d0] font-sans font-bold leading-relaxed"
              >
                {resolvingMessages[resolvingStep]}
              </motion.div>

              {/* Custom retro progress indicator */}
              <div className="mt-6 w-full bg-slate-950 h-5 border border-emerald-400/40 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${((resolvingStep + 1) / resolvingMessages.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-yellow-300 rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-sans">
                <span>RECONSTRUINDO MUNDO DIGITAL</span>
                <span>{Math.round(((resolvingStep + 1) / resolvingMessages.length) * 100)}% CONCLUÍDO</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="text-[10px] md:text-xs text-slate-600 text-center flex items-center justify-center gap-4 border-t border-[#39FF14]/10 pt-4 mt-2 relative z-10">
        <span>PROJETO ESCOLA BRILHANTE © 2026</span>
        <span>ODS 4 - UNESCO EDUCATIONAL PROGRAM</span>
        <span className="hidden sm:inline">UNIVERSIDADE MÁGICA DE APRENDIZAGEM</span>
      </div>

      <style>{`
        .scanlines {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          );
          background-size: 100% 4px;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5));
          }
          20%, 24%, 55% {
            opacity: 0.1;
            filter: none;
          }
        }
        .animate-flicker {
          animation: flicker 3s infinite;
        }
        .text-shadow {
          text-shadow: 0 0 10px rgba(253, 224, 71, 0.5);
        }
      `}</style>
    </div>
  );
}
