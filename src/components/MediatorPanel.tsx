import React, { useState } from "react";
import { Send, Wifi, WifiOff } from "lucide-react";

interface MediatorPanelProps {
  onSend: (text: string) => void;
  disabled: boolean;
  isOfflineMode: boolean;
  setIsOfflineMode: (val: boolean) => void;
}

export default function MediatorPanel({ onSend, disabled, isOfflineMode, setIsOfflineMode }: MediatorPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 sm:h-20 bg-slate-950/70 backdrop-blur-3xl border-t-4 border-white/20 flex items-center px-4 sm:px-12 z-50 overflow-hidden">
      {/* Decorative inner glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
      
      <form onSubmit={handleSubmit} className="flex-1 max-w-7xl mx-auto flex gap-2 sm:gap-4 items-center relative">
        {/* Toggle Mode Button: IA Ativa vs Sem IA */}
        <button
          type="button"
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          className={`h-11 sm:h-12 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 border-2 transition-all active:scale-95 text-[10px] sm:text-xs font-black uppercase tracking-wider shrink-0 cursor-pointer
            ${isOfflineMode 
              ? "bg-amber-500/90 hover:bg-amber-400 border-amber-300 text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)] animate-pulse" 
              : "bg-emerald-600/90 hover:bg-emerald-500 border-emerald-400 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
            }`}
          title={isOfflineMode ? "Modo Off-line Ativo (Sem IA)" : "Modo IA Conectado (Gemini)"}
        >
          {isOfflineMode ? (
            <>
              <WifiOff size={16} className="text-amber-100" />
              <span className="hidden sm:inline">Sem IA (Local)</span>
            </>
          ) : (
            <>
              <Wifi size={16} className="text-emerald-100" />
              <span className="hidden sm:inline">IA Ativa</span>
            </>
          )}
        </button>

        <div className="flex-1 relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isOfflineMode ? "Responda aqui (Modo Seguro Local) ✨" : "Qual é a resposta mágica da turma? ✨"}
            disabled={disabled}
            className="w-full bg-white/95 text-slate-900 border-2 border-white/80 rounded-xl px-4 sm:px-6 py-2 h-11 sm:h-12 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-yellow-400/50 disabled:opacity-50 transition-all placeholder:text-slate-400 font-bold shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-5 sm:px-8 h-11 sm:h-12 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group shadow-[0_5px_15px_-3px_rgba(234,179,8,0.4)] border-2 border-white/80 shrink-0 cursor-pointer"
        >
          <span className="text-sm sm:text-base font-black uppercase tracking-tight">Mágica!</span>
          <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </form>
      
      {/* Hidden techy details for the mediator */}
      <div className="absolute right-4 bottom-1 text-[7px] text-white/30 font-mono hidden lg:block uppercase tracking-widest leading-none">
        {isOfflineMode ? "SISTEMA SEGURO (MODO LOCAL)" : "CONEXÃO GEMINI ATIVA"}
      </div>
    </div>
  );
}
