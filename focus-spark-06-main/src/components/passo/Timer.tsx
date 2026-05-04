import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

interface Props {
  minutes: number;
  onComplete: () => void;
}

export const Timer = ({ minutes, onComplete }: Props) => {
  const total = minutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(total);
  const [running, setRunning] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    setSecondsLeft(minutes * 60);
    setRunning(true);
    completedRef.current = false;
  }, [minutes]);

  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);

          if (!completedRef.current) {
            completedRef.current = true;
            setTimeout(() => onComplete(), 0);
          }

          return 0;
        }

        return s - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [running, onComplete]);

  const progress = ((total - secondsLeft) / total) * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          <svg width="205" height="205" className="-rotate-90">
            <defs>
              <linearGradient id="timerGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            <circle
              cx="102.5"
              cy="102.5"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="8"
            />

            <circle
              cx="102.5"
              cy="102.5"
              r={radius}
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-semibold tabular-nums text-slate-100 tracking-tight">
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </span>

            <span className="mt-1 text-xs uppercase tracking-widest text-slate-500">
              foco
            </span>
          </div>
        </div>

        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-7 py-3 text-sm font-medium text-white shadow-lg transition hover:scale-[1.02]"
        >
          {running ? (
            <>
              <Pause className="h-4 w-4" />
              Pausar
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Continuar
            </>
          )}
        </button>
      </div>
    </div>
  );
};