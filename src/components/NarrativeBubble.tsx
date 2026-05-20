import { motion, AnimatePresence } from "motion/react";

interface NarrativeBubbleProps {
  feedback: string;
  loading: boolean;
  theme: 'white' | 'dark';
}

export default function NarrativeBubble({ feedback, loading, theme }: NarrativeBubbleProps) {
  return (
    <div className="fixed bottom-24 sm:bottom-32 left-1/2 -translate-x-1/2 w-full max-w-[95%] sm:max-w-4xl px-4 sm:px-8 pointer-events-none">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.8 }}
            className="p-8 sm:p-12 rounded-[3.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2)] backdrop-blur-2xl border-8 border-white text-center relative bg-white/90"
          >
            <p className="text-3xl sm:text-4xl md:text-5xl animate-bounce tracking-tight font-black text-blue-500">
              Carregando Magia... ✨
            </p>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rotate-45 bg-white border-r-8 border-b-8 border-white" />
          </motion.div>
        ) : feedback ? (
          <motion.div
            key="content"
            initial={{ y: 50, scale: 0.5, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className={`p-10 sm:p-14 rounded-[4rem] sm:rounded-[5rem] shadow-[0_35px_80px_-10px_rgba(0,0,0,0.25)] backdrop-blur-2xl border-[10px] relative
              ${theme === 'white' ? 'bg-white/95 border-white' : 'bg-slate-900/95 border-slate-700'}
            `}
          >
            <p className={`text-2xl sm:text-4xl md:text-5xl text-center leading-tight font-black tracking-tight
              ${theme === 'white' ? 'text-slate-800' : 'text-white'}
            `}>
              {feedback}
            </p>
            {/* Playful tail */}
            <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rotate-45 border-r-[10px] border-b-[10px]
              ${theme === 'white' ? 'bg-white/95 border-white' : 'bg-slate-900/95 border-slate-700'}
            `} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
