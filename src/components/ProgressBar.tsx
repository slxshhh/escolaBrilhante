import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { RotateCcw } from "lucide-react";

interface ProgressBarProps {
  level: number;
  onClick?: () => void;
  selectedClassroom?: { name: string; themeColor: string; difficulty: string } | null;
  onRollback?: () => void;
}

export default function ProgressBar({ level, onClick, selectedClassroom, onRollback }: ProgressBarProps) {
  const [clickParticles, setClickParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const isMessy = level < 30;
  const isRecovering = level >= 30 && level < 70;

  const handleClick = (e: React.MouseEvent) => {
    onClick?.();
    const newParticle = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    setClickParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setClickParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="fixed top-0 left-0 w-full h-20 sm:h-24 bg-white/40 backdrop-blur-xl z-50 flex items-center px-4 sm:px-8 border-b-8 border-white/50 group cursor-help transition-all hover:bg-white/60 active:scale-[0.99]"
    >
      <AnimatePresence>
        {clickParticles.map(p => (
          <motion.div
            key={p.id}
            initial={{ scale: 0.5, opacity: 1, y: 0 }}
            animate={{ scale: [1, 2, 0.5], opacity: 0, y: -150, rotate: 360 }}
            exit={{ opacity: 0 }}
            className="fixed pointer-events-none text-4xl z-[100]"
            style={{ left: p.x, top: p.y }}
          >
            {isMessy ? '🧹' : isRecovering ? '✨' : '🌈'}
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex-1 flex items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2 sm:gap-4 relative">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              rotate: isMessy ? [0, 5, -5, 0] : [0, 10, -10, 0] 
            }}
            transition={{ duration: isMessy ? 1 : 3, repeat: Infinity }}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transition-colors duration-500
              ${isMessy ? 'bg-slate-500 grayscale' : 'bg-gradient-to-br from-yellow-300 to-orange-500'}
            `}
          >
            <span className="text-3xl sm:text-4xl">
              {isMessy ? '🏚️' : isRecovering ? '🛠️' : '🏰'}
            </span>
          </motion.div>
          <div className="flex flex-col hidden xs:block">
            <span className={`font-black text-lg sm:text-2xl leading-none tracking-tight transition-colors duration-500
              ${isMessy ? 'text-slate-600' : 'text-blue-600'}
            `}>
              {isMessy ? 'ESCOLA EM' : 'ESCOLA'}
            </span>
            <span className={`font-black text-lg sm:text-2xl leading-none tracking-tight transition-colors duration-500
              ${isMessy ? 'text-slate-700' : 'text-orange-500'}
            `}>
              {isMessy ? 'REFORMA' : 'BRILHANTE'}
            </span>
          </div>
          
          {/* Interaction hint */}
          <div className="absolute -bottom-10 left-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap whitespace-nowrap shadow-xl">
             {level}% DA ESCOLA CONSERTADA! ✨
          </div>
        </div>
        
        <div className="relative flex-1 h-10 sm:h-14 bg-white/60 rounded-[2rem] overflow-hidden border-8 border-white shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ type: "spring", stiffness: 30, damping: 10 }}
            className={`h-full relative transition-colors duration-1000
              ${isMessy ? 'bg-slate-400' : isRecovering ? 'bg-gradient-to-r from-blue-400 to-emerald-400' : 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400'}
            `}
          >
            {/* Animated gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2" />
            <motion.div 
              animate={{ x: ['-200%', '300%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-20"
            />
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white font-black text-lg sm:text-2xl tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              {level}% SUCESSO!
            </span>
          </div>
        </div>

        {selectedClassroom && (
          <div 
            className="flex items-center gap-1.5 sm:gap-2 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="bg-slate-900/95 shadow-lg px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-xl border flex items-center gap-2 text-white border-slate-700 max-h-12"
              style={{ borderColor: `${selectedClassroom.themeColor}aa` }}
            >
              <div className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: selectedClassroom.themeColor }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: selectedClassroom.themeColor }}></span>
              </div>
              <div className="text-left shrink-0 max-w-[80px] sm:max-w-[120px] overflow-hidden">
                <span className="font-extrabold text-[9px] sm:text-[11px] block leading-none antialiased truncate">
                  {selectedClassroom.name} 🎒
                </span>
                <span className="text-slate-400 text-[7px] sm:text-[8px] font-mono leading-none mt-0.5 block uppercase truncate">
                  {selectedClassroom.difficulty}
                </span>
              </div>
            </div>

            {onRollback && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRollback();
                }}
                className="cursor-pointer bg-slate-950 hover:bg-[#39FF14] text-[#39FF14] hover:text-slate-950 px-2.5 py-2.5 sm:px-3 sm:py-2 rounded-xl border border-slate-800 hover:border-[#39FF14] shadow-md flex items-center gap-1 font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all h-10 shrink-0"
                title="Mudar de sala"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden md:inline">Trocar de Sala</span>
              </motion.button>
            )}
          </div>
        )}

        <div className="flex -space-x-3 hidden sm:flex">
          {['🌈', '🚀', '🎨'].map((emoji, i) => (
            <motion.div 
              key={i} 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              className="w-12 h-12 rounded-full border-4 border-white bg-white/80 flex items-center justify-center text-2xl shadow-xl z-10"
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
