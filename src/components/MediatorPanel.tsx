import React, { useState } from "react";
import { Send } from "lucide-react";

interface MediatorPanelProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function MediatorPanel({ onSend, disabled }: MediatorPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 sm:h-20 bg-white/10 backdrop-blur-3xl border-t-4 border-white/30 flex items-center px-4 sm:px-12 z-50 overflow-hidden">
      {/* Decorative inner glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      
      <form onSubmit={handleSubmit} className="flex-1 max-w-7xl mx-auto flex gap-2 sm:gap-6 relative">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Qual é a resposta mágica da turma? ✨"
            disabled={disabled}
            className="w-full bg-white/80 text-blue-900 border-4 border-white rounded-[1.5rem] px-6 sm:px-8 py-2 sm:py-3 text-lg sm:text-xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 disabled:opacity-50 transition-all placeholder:text-blue-300 font-bold shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">
            MÁGICA
          </div>
        </div>
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-6 sm:px-10 rounded-[1.5rem] flex items-center gap-2 sm:gap-3 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group shadow-[0_10px_25px_-5px_rgba(234,179,8,0.5)] border-4 border-white bouncy-btn"
        >
          <span className="text-lg sm:text-xl font-black uppercase tracking-tight drop-shadow-md">Mágica!</span>
          <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform drop-shadow-md" />
        </button>
      </form>
      
      {/* Hidden techy details for the mediator */}
      <div className="absolute left-4 bottom-1 text-[8px] text-white/40 font-mono hidden lg:block uppercase tracking-widest">
        Quantum Engine v2.0
      </div>
    </div>
  );
}
