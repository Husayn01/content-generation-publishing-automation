import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AILoadingProgress({ 
  messages = [
    "Analyzing request parameters...",
    "Connecting to the Fetemi Engine...",
    "Synthesizing audience hooks...",
    "Generating multi-angle drafts...",
    "Polishing final formatting...",
  ],
  intervalTime = 4000,
  theme = 'indigo'
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, intervalTime);
    return () => clearInterval(interval);
  }, [messages.length, intervalTime]);

  const themes = {
    indigo: {
      container: "bg-indigo-50 border-indigo-100",
      ring: "bg-indigo-400",
      icon: "text-indigo-600",
      text: "text-indigo-700"
    },
    emerald: {
      container: "bg-emerald-50 border-emerald-200",
      ring: "bg-emerald-400",
      icon: "text-emerald-600",
      text: "text-emerald-700"
    }
  };

  const activeTheme = themes[theme] || themes.indigo;

  return (
    <div className={`w-full flex items-center justify-center gap-3 border py-3.5 px-6 rounded-xl shadow-inner overflow-hidden ${activeTheme.container}`}>
      <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-20 animate-ping ${activeTheme.ring}`}></span>
        <Sparkles size={16} className={`animate-pulse ${activeTheme.icon}`} />
      </div>
      <div className="h-5 relative flex-1 flex items-center justify-center sm:justify-start max-w-[240px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className={`text-sm font-semibold absolute inset-0 flex items-center sm:justify-start justify-center whitespace-nowrap ${activeTheme.text}`}
          >
            {messages[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
