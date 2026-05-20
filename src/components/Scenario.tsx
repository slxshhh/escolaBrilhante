import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";
import { useMemo } from "react";

interface ScenarioProps {
  backgroundColor: string;
  elements: string[];
  level: number;
  refreshKey?: number;
}

export default function Scenario({ backgroundColor, elements, level, refreshKey }: ScenarioProps) {
  // Determine "School Status" decorations based on ODS 4 level
  const statusDecorations = useMemo(() => {
    const decos: { icon: string; x: number; y: number; size: number; delay: number }[] = [];
    const seed = 42;
    const random = (i: number) => {
      const x = Math.sin(seed + i) * 10000;
      return x - Math.floor(x);
    };

    // Low level (0-30%): Messy
    if (level < 30) {
      const icons = ["Trash2", "Wind", "Skull", "XCircle", "Ghost"];
      for (let i = 0; i < 15; i++) {
        decos.push({
          icon: icons[Math.floor(random(i) * icons.length)],
          x: random(i + 1) * 100,
          y: random(i + 2) * 100,
          size: 40 + random(i + 3) * 60,
          delay: random(i + 4) * 5,
        });
      }
    } 
    // Mid level (30-70%): Transition
    else if (level < 70) {
      const icons = ["Sparkles", "Brush", "Droplets", "Flower", "BookOpen", "Sprout"];
      for (let i = 0; i < 20; i++) {
        decos.push({
          icon: icons[Math.floor(random(i) * icons.length)],
          x: random(i + 1) * 100,
          y: random(i + 2) * 100,
          size: 30 + random(i + 3) * 50,
          delay: random(i + 4) * 5,
        });
      }
    }
    // High level (70-100%): Brilliant
    else {
      const icons = ["Heart", "Star", "Smile", "Flower2", "Sun", "PartyPopper"];
      for (let i = 0; i < 25; i++) {
        decos.push({
          icon: icons[Math.floor(random(i) * icons.length)],
          x: random(i + 1) * 100,
          y: random(i + 2) * 100,
          size: 40 + random(i + 3) * 80,
          delay: random(i + 4) * 5,
        });
      }
    }
    return decos;
  }, [level]);

  const isLow = level < 30;
  const isHigh = level > 70;

  return (
    <div
      className="fixed inset-0 transition-colors duration-1000 ease-in-out flex items-center justify-center -z-10 overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Magic Refresh Effect Overlay */}
      <AnimatePresence>
        {refreshKey ? (
          <motion.div
            key={refreshKey}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.5, 2] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-white pointer-events-none z-50 rounded-full blur-[100px]"
          />
        ) : null}
      </AnimatePresence>

      {/* Sun/Moon based on level */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: isHigh ? 1.5 : 1,
          opacity: level > 30 ? 0.6 : 0.2
        }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className={`absolute -top-10 -right-10 w-96 h-96 rounded-full blur-[100px] transition-colors duration-500
          ${isHigh ? 'bg-orange-300' : level > 30 ? 'bg-yellow-200' : 'bg-slate-400'}
        `}
      />

      {/* Enchanted Garden Hills (Organic CSS Shapes) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Hill 1 */}
        <motion.div
          animate={{ x: isHigh ? 0 : -50 }}
          className={`absolute -bottom-32 -left-20 w-[120vw] h-[60vh] rounded-[100%] blur-[2px] transition-colors duration-1000 rotate-3
            ${isLow ? 'bg-slate-300' : isHigh ? 'bg-emerald-200' : 'bg-green-100'}
          `}
        />
        {/* Hill 2 */}
        <motion.div
          animate={{ x: isHigh ? 0 : 50 }}
          className={`absolute -bottom-48 -right-20 w-[110vw] h-[55vh] rounded-[100%] blur-[4px] transition-colors duration-1000 -rotate-2
            ${isLow ? 'bg-slate-400' : isHigh ? 'bg-emerald-300' : 'bg-green-200'}
          `}
        />
      </div>

      {/* Animated Flowers / Grass */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(isHigh ? 30 : level > 30 ? 15 : 0)].map((_, i) => (
          <motion.div
            key={`flower-${i}`}
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            className="absolute"
            style={{
              left: `${(i * 7.7) % 100}%`,
              bottom: `${10 + (Math.sin(i) * 5)}%`,
            }}
          >
            <div className="relative floating" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="w-1.5 h-12 bg-emerald-600/30 rounded-full mx-auto" />
              <div 
                className={`w-8 h-8 rounded-full -mt-6 shadow-xl border-4 border-white
                  ${i % 3 === 0 ? 'bg-pink-200' : i % 3 === 1 ? 'bg-purple-200' : 'bg-yellow-100'}
                `} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Background Status Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden text-white/20">
        <AnimatePresence mode="popLayout">
          {statusDecorations.map((deco, i) => {
            // @ts-ignore
            const Icon = Icons[deco.icon] || Icons.Sparkles;
            return (
              <motion.div
                key={`${deco.icon}-${i}-${level > 70 ? 'high' : level > 30 ? 'mid' : 'low'}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.2, scale: 1 }}
                exit={{ opacity: 0, scale: 2 }}
                transition={{ duration: 1, delay: deco.delay * 0.05 }}
                className="absolute floating-slow"
                style={{ 
                  left: `${deco.x}%`, 
                  top: `${deco.y}%`,
                  animationDelay: `${deco.delay}s`
                }}
              >
                <Icon size={deco.size} strokeWidth={1.5} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Decorative CSS Clouds */}
      <div className="absolute top-[10%] left-[5%] w-64 h-24 bg-white/40 rounded-full blur-3xl floating" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-[10%] left-[10%] w-96 h-32 bg-white/30 rounded-full blur-[60px] floating-slow" style={{ animationDelay: '0.5s' }} />

      {/* Magical Sparkles / Bubbles */}
      {[...Array(level > 70 ? 25 : 12)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white/50 rounded-full bubble-float border border-white/30 backdrop-blur-[2px]"
          style={{
            left: `${(i * 17) % 100}%`,
            width: `${5 + Math.random() * 40}px`,
            height: `${5 + Math.random() * 40}px`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${12 + Math.random() * 8}s`,
          }}
        />
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 p-8 sm:p-20 relative z-10 w-full max-w-7xl">
        <AnimatePresence mode="popLayout">
          {elements.map((iconName, index) => {
            // @ts-ignore
            const IconComponent = Icons[iconName] || Icons.Sparkles;
            return (
              <motion.div
                key={`${iconName}-${index}`}
                initial={{ scale: 0, rotate: -30, y: 150 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: -100 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className="flex items-center justify-center"
              >
                <div className="bg-white/80 backdrop-blur-2xl p-10 sm:p-14 rounded-[4.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2)] border-[12px] border-white magic-glow floating transition-colors duration-1000" style={{ animationDelay: `${index * 0.4}s` }}>
                  <IconComponent className="w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40" color={isHigh ? "#10b981" : level > 30 ? "#3b82f6" : "#64748b"} strokeWidth={3} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_4px,transparent_4px)] [background-size:120px_120px]"></div>
      </div>
    </div>
  );
}
