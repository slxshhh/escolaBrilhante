import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, ShieldAlert, Cpu, Lock, Activity, Users, Clock, Flame } from "lucide-react";
import { CLASSROOMS, ClassroomLevel } from "../types";

interface GlitchScreenProps {
  onResolve: (selectedClassroom: ClassroomLevel) => void;
}

export default function GlitchScreen({ onResolve }: GlitchScreenProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [typedText, setTypedText] = useState("");
  const [isReadyToUnlock, setIsReadyToUnlock] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolvingStep, setResolvingStep] = useState(0);
  
  // Default to 5o Ano (First classroom in chronology)
  const [selectedClassId, setSelectedClassId] = useState<string>("5_ano");
  const activeClassroom = CLASSROOMS.find((c) => c.id === selectedClassId) || CLASSROOMS[0];

  const rawLogs = [
    "⚡ INICIALIZANDO INTERFACE DE CONEXÃO COGNITIVA...",
    "🔑 DEPOIS DE COMENTAR O PLANO, PREPARE AS CRIANÇAS!",
    "⚠️ ALERTA: ANOMALIA DE CONVIVÊNCIA DETECTADA NO PÁTIO!",
    "🚨 ERRO CURIOSO: AS FLORES PRECISAM DE MAIS CORES E CUIDADOS!",
    "🛑 SISTEMA AGUARDANDO MANUAL: AGUARDANDO AMOR E SUSTENTABILIDADE!",
  ];

  // Dynamic speech text depending on grade target
  const getMissionText = (gradeId: string) => {
    switch (gradeId) {
      case "1_ano":
        return "✨ ALÔ ALÔ, PEQUENOS AMIGOS DO 1º ANO A! ✨ Nós somos cientistas da computação e criamos um supercomputador mágico para construir a 'Escola Mais Brilhante do Mundo'. Mas deu um BUG! O sistema travou porque as máquinas não entendem o amor de vocês. Somente os sorrisos e abraços bem apertados da turma de vocês podem salvar as florzinhas! Aceitam o convite de mágica?";
      case "2_ano":
        return "✨ OLÁ GRANDE CLÃ DO 2º ANO A! ✨ Nós somos detetives de computadores e criamos uma máquina inteligente para a 'Escola Mais Brilhante do Mundo'. Mas deu um BUG! Ela travou porque não sabe como consertar as plantinhas do jardim e fazer as pazes sozinha. Somente com a gentileza e o superpoder de vocês podemos destravar o sistema. Aceitam essa nobre missão de amor?";
      case "3_ano":
        return "💡 ATENÇÃO, QUERIDO 3º ANO A! 💡 Somos cientistas de tecnologia e criamos um supercomputador inovador para a 'Escola Mais Brilhante do Mundo'. Mas ocorreu um BUG crítico! O sistema bloqueou porque detectou pequenos egoísmos na escola e somente o trabalho colaborativo inteligente de mentes humanas reais como as de vocês podem decifrar este código da ODS 4. Aceitam a missão de resgate?";
      case "4_ano":
        return "🚨 ATENÇÃO COOPERAÇÃO DO 4º ANO A! 🚨 Somos cientistas da computação e programamos nossa IA para gerar a 'Escola Mais Brilhante do Mundo', mas ela deu um BUG de Empatia! O núcleo principal travou porque encontrou desordem e exclusão que só humanos sabem resolver com sabedoria. Precisamos do julgamento justo da turma de vocês para desativar os erros. Topam decifrar a ODS 4?";
      case "5_ano":
      default:
        return "💻 ALERTA CRÍTICO: LIDERANÇAS DO 5º ANO A! 💻 Nós somos cientistas e criamos uma superestrutura computadorizada para planejar a 'Escola Mais Brilhante do Mundo'. Mas tivemos um BUG completo! O sistema entrou em lockdown porque detectou falhas éticas e problemas de convivência que algoritmos frios não conseguem solucionar sozinhos. Precisamos da cidadania e inteligência ativa de vocês para reescrever as regras da ODS 4. Aceitam destravar o sistema?";
    }
  };

  const resolvingMessages = [
    `Instalando vacina de empatia customizada para o ${activeClassroom.name}... 💉👾`,
    `Ajustando filtros de sensibilidade cognitiva para idades aproximadas de ${activeClassroom.age}... 🧠🦄`,
    "Carregando painel de ODS 4 personalizado em tempo real... ⏳🌈",
    `Injetando energia vibrante no pátio do Colégio Floresta... ⚡🌳`,
    `Ligando motores divertidos baseados na dificuldade: *${activeClassroom.difficulty.toUpperCase()}*... ⚙️🎨`,
    "Sistema com 100% de carinho carregado! Apresentando Escola Mágica! ✨🏫✨"
  ];

  // Re-run typing effect whenever selected class changes!
  useEffect(() => {
    let index = 0;
    setTypedText("");
    setIsReadyToUnlock(false);
    const textToType = getMissionText(selectedClassId);
    
    const interval = setInterval(() => {
      index += 2; // Type 2 chars at a time for faster, smoother responsiveness
      setTypedText(textToType.slice(0, index));
      if (index >= textToType.length) {
        clearInterval(interval);
        setIsReadyToUnlock(true);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [selectedClassId]);

  // Handle active logs
  useEffect(() => {
    setLogs([...rawLogs, `💻 GRADE DETERMINADA: O COMPUTADOR RECONFIGUROU TODA A INTERFACE PARA O ${activeClassroom.name.toUpperCase()}!`]);
  }, [selectedClassId]);

  // Handle the active magical reconstruction phase
  useEffect(() => {
    if (!isResolving) return;

    const interval = setInterval(() => {
      setResolvingStep((prev) => {
        if (prev < resolvingMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onResolve(activeClassroom);
          }, 800);
          return prev;
        }
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [isResolving, selectedClassId]);

  const startRebuild = () => {
    setIsResolving(true);
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-slate-950 text-[#39FF14] font-mono flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden z-[100]">
      {/* Glitch / CRT Screen Line overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_100%)] scanlines" />

      <AnimatePresence mode="wait">
        {!isResolving ? (
          <motion.div 
            key="terminal"
            className="flex flex-col justify-between h-full w-full"
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top Warning Banner */}
            <div className="flex items-center justify-between border-b-2 border-amber-500/30 pb-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ShieldAlert className="w-8 h-8 text-amber-400 animate-pulse" />
                </motion.div>
                <div>
                  <span className="text-amber-400 font-extrabold text-sm md:text-base block tracking-wider uppercase">
                    [ !!! DESAFIO MÁGICO DETECTADO !!! ]
                  </span>
                  <span className="text-slate-400 text-xs">SUPERCOMPUTADOR BLOQUEADO</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-xs sm:text-sm">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="hidden xs:inline">Filtro Ativo: {activeClassroom.name}</span>
              </div>
            </div>

            {/* Main Terminal Zone */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto items-stretch h-[75vh] relative z-10 w-full max-w-7xl mx-auto overflow-y-auto lg:overflow-hidden pr-1">
              
              {/* Left Side: Classroom Chronology Selector & Controls */}
              <div className="lg:col-span-5 bg-slate-900/80 border-2 border-[#39FF14]/20 rounded-2xl p-4 md:p-5 flex flex-col gap-4 shadow-[0_0_30px_rgba(57,255,20,0.03)] h-full overflow-y-auto scrollbar-none">
                
                <div className="flex items-center gap-2 text-yellow-400 border-b border-[#39FF14]/10 pb-2 text-xs md:text-sm font-bold">
                  <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span>SELECIONAR SALA / HORÁRIO DA APRESENTAÇÃO</span>
                </div>

                {/* Class list interactive selectors */}
                <div className="flex flex-col gap-2">
                  {CLASSROOMS.map((classroom) => {
                    const isSelected = selectedClassId === classroom.id;
                    return (
                      <motion.button
                        key={classroom.id}
                        onClick={() => setSelectedClassId(classroom.id)}
                        whileHover={{ scale: 1.01, x: 2 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full p-3 rounded-xl border text-left cursor-pointer flex items-center justify-between transition-all duration-200
                          ${isSelected 
                            ? "bg-emerald-950/70 border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.15)] text-white" 
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-2.5 h-2.5 rounded-full animate-ping" 
                            style={{ backgroundColor: classroom.themeColor }}
                          />
                          <div>
                            <span className="font-extrabold text-sm sm:text-base block">{classroom.name}</span>
                            <span className="text-[10px] text-slate-400 font-sans block">Alvo: {classroom.age} ({classroom.time})</span>
                          </div>
                        </div>

                        <div className="text-right text-[11px] font-sans">
                          <span 
                            style={{ color: classroom.themeColor }}
                            className="font-black tracking-widest uppercase text-[10px]"
                          >
                            {classroom.difficulty}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected target metadata summary */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-1 text-[11px] sm:text-xs">
                  <span className="text-slate-500 font-bold tracking-wider">MÉTODO PEDAGÓGICO SELECIONADO:</span>
                  <p className="text-[#a7f3d0] leading-relaxed font-sans">{activeClassroom.description}</p>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono uppercase bg-slate-900/60 p-2 rounded-lg">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Julgamento: {activeClassroom.difficulty === "super_ludico" || activeClassroom.difficulty === "ludico" ? "Super Facilitado" : "Analítico"}</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-amber-400" /> ODS 4 Act</span>
                  </div>
                </div>

                {/* Mini diagnostic logs footer */}
                <div className="text-[10px] text-emerald-400/80 p-2.5 bg-slate-950/80 border border-emerald-400/10 rounded-xl flex-1 overflow-y-auto max-h-[140px] font-mono scrollbar-none">
                  {logs.map((log, i) => (
                    <div key={i} className="mb-1 leading-normal">
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Adaptive Speech Bubble Narrative (What the kids see) */}
              <div 
                className="lg:col-span-7 bg-slate-900 border-4 rounded-3xl p-5 md:p-8 flex flex-col justify-between relative shadow-[0_0_50px_rgba(57,255,20,0.06)] h-full"
                style={{ borderColor: `${activeClassroom.themeColor}50` }}
              >
                {/* Glitch Decorative Background text */}
                <div className="relative">
                  <span className="absolute -top-2 left-0 text-slate-800 text-3xl font-black opacity-30 select-none">ODS 4 PROGRAM</span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black relative tracking-wide uppercase font-sans text-shadow flex items-center gap-2" style={{ color: activeClassroom.themeColor }}>
                    ⚠️ {activeClassroom.name.toUpperCase()}: AJUDA REQUISITADA!
                  </h2>
                </div>

                {/* Speach text container */}
                <div className="my-4 flex-1 bg-slate-1000/90 border-2 rounded-2xl p-4 md:p-6 text-slate-300 relative overflow-y-auto" style={{ borderColor: `${activeClassroom.themeColor}20` }}>
                  <div className="text-sm md:text-base lg:text-lg leading-relaxed font-sans text-[#e2fbf0]">
                    {typedText}
                    <span className="inline-block w-2.5 h-4 bg-[#39FF14] ml-1 animate-blink" />
                  </div>

                  <div 
                    className="absolute -top-3.5 right-6 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 border-slate-900 transition-all"
                    style={{ backgroundColor: activeClassroom.themeColor }}
                  >
                    MISSÃO DESTINADA AO {activeClassroom.name} 🎒
                  </div>
                </div>

                {/* Big Magical trigger button */}
                <div className="flex flex-col items-center gap-2">
                  <motion.button
                    whileHover={{ scale: isReadyToUnlock ? 1.02 : 1 }}
                    whileTap={{ scale: isReadyToUnlock ? 0.98 : 1 }}
                    onClick={startRebuild}
                    className={`w-full py-4 rounded-2xl md:rounded-[2rem] border-4 cursor-pointer text-center font-black text-lg md:text-2xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300
                      ${isReadyToUnlock 
                        ? "text-slate-950 animate-bounce shadow-[0_20px_45px_rgba(16,185,129,0.25)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)]" 
                        : "bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed shadow-none"
                      }
                    `}
                    style={isReadyToUnlock ? {
                      backgroundColor: activeClassroom.themeColor,
                      borderColor: "#FFFFFF",
                      color: "#FFFFFF"
                    } : {}}
                    disabled={!isReadyToUnlock}
                  >
                    <Lock className={`w-5 h-5 md:w-6 md:h-6 ${isReadyToUnlock ? "animate-pulse" : ""}`} />
                    <span>ENTRAR NA AVENTURA DO {activeClassroom.name}! 🔐🚀</span>
                  </motion.button>
                  <span className="text-slate-500 text-[10px] sm:text-xs text-center font-sans">
                    * Universitários: Digam o roteiro e recolham o grito de guerra do {activeClassroom.name} antes de conectar!
                  </span>
                </div>

              </div>
            </div>
          </motion.div>
        ) : (
          /* Dynamic Magical Transition loader specific to that grade */
          <motion.div
            key="magical"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center max-w-4xl mx-auto h-[80vh] w-full"
          >
            {/* Pulsing customizable magical circle */}
            <div className="relative mb-8 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-8 border-dashed rounded-full opacity-60 flex items-center justify-center"
                style={{ borderColor: activeClassroom.themeColor }}
              />
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 shadow-xl flex flex-col items-center justify-center bg-slate-900"
                style={{ 
                  borderColor: activeClassroom.themeColor,
                  boxShadow: `0 0 45px ${activeClassroom.themeColor}30`
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="text-5xl sm:text-6xl"
                >
                  {activeClassroom.difficulty === "super_ludico" || activeClassroom.difficulty === "ludico" ? "🦄✨" : "🧐🧙‍♂️"}
                </motion.div>
              </motion.div>

              {/* Orbital float items */}
              <motion.div className="absolute text-3xl" animate={{ x: [-70, -80, -70], y: [-50, -40, -50] }} transition={{ repeat: Infinity, duration: 1.1 }}>🎒</motion.div>
              <motion.div className="absolute text-3xl" animate={{ x: [70, 80, 70], y: [-30, -40, -30] }} transition={{ repeat: Infinity, duration: 1.4 }}>🌱</motion.div>
              <motion.div className="absolute text-3xl" animate={{ x: [-65, -55, -65], y: [50, 40, 50] }} transition={{ repeat: Infinity, duration: 1.2 }}>🎨</motion.div>
              <motion.div className="absolute text-3xl" animate={{ x: [65, 55, 65], y: [55, 65, 55] }} transition={{ repeat: Infinity, duration: 1.6 }}>💖</motion.div>
            </div>

            {/* Title adaptations */}
            <motion.h3 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-2xl sm:text-3xl lg:text-4xl text-center font-black uppercase tracking-wide font-sans mb-5 text-shadow"
              style={{ color: activeClassroom.themeColor }}
            >
              🪄 SINTONIZANDO COM O {activeClassroom.name}...
            </motion.h3>

            {/* Active message bubble */}
            <div className="bg-slate-900 border-2 rounded-2xl p-5 text-center max-w-xl shadow-lg w-full" style={{ borderColor: activeClassroom.themeColor }}>
              <motion.div
                key={resolvingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-base sm:text-lg text-slate-100 font-sans font-extrabold leading-relaxed"
              >
                {resolvingMessages[resolvingStep]}
              </motion.div>

              {/* Customizable progress bar */}
              <div className="mt-5 w-full bg-slate-950 h-5 border rounded-full overflow-hidden p-0.5" style={{ borderColor: `${activeClassroom.themeColor}50` }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${((resolvingStep + 1) / resolvingMessages.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: activeClassroom.themeColor }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-sans font-bold">
                <span>CONEXÃO AMBIENTAL ATIVA</span>
                <span>{Math.round(((resolvingStep + 1) / resolvingMessages.length) * 100)}% DETRESO</span>
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
        .text-shadow {
          text-shadow: 0 0 12px var(--tw-shadow-color);
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
