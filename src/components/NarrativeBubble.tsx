import { motion, AnimatePresence } from "motion/react";

interface NarrativeBubbleProps {
  feedback: string;
  loading: boolean;
  theme: 'white' | 'dark';
  isWaitingTransition?: boolean;
  onNext?: () => void;
}

export default function NarrativeBubble({ feedback, loading, theme, isWaitingTransition, onNext }: NarrativeBubbleProps) {
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
            className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl border-4 sm:border-8 relative pointer-events-auto
              ${theme === 'white' ? 'bg-white/90 border-white' : 'bg-slate-900/90 border-slate-700'}
            `}
          >
            <p className={`text-sm sm:text-lg md:text-2xl text-center leading-normal font-black tracking-normal
              ${theme === 'white' ? 'text-slate-800' : 'text-slate-100'}
            `}>
              {feedback}
            </p>

            {isWaitingTransition && onNext && (
              <motion.div
                className="flex justify-center mt-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 text-white font-black text-xs sm:text-base rounded-full shadow-lg border-2 sm:border-4 border-white cursor-pointer active:scale-95 hover:scale-105 transition-transform duration-100 flex items-center gap-1.5 pointer-events-auto"
                >
                  Avançar ➡️
                </button>
              </motion.div>
            )}

            {/* Playful tail */}
            <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rotate-45 border-r-[4px] border-b-[4px] sm:border-r-[8px] sm:border-b-[8px]
              ${theme === 'white' ? 'bg-white/90 border-white' : 'bg-slate-900/90 border-slate-700'}
            `} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
