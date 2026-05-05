import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Volume2, VolumeX } from "lucide-react";
import { Timer } from "./Timer";
import { FEEDBACK, FLOWS, type Mode } from "@/lib/flows";

interface Props {
  mode: Mode;
  onExit: () => void;
  onTaskDone: () => void;
}

type Phase = "intro" | "doing" | "done" | "break";

export const FlowRunner = ({ mode, onExit, onTaskDone }: Props) => {
  const flow = FLOWS[mode];
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [feedback, setFeedback] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const task = flow.tasks[index];
  const isLast = index === flow.tasks.length - 1;

  useEffect(() => {
    audioRef.current = new Audio("/audio/brown-noise.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (soundOn && phase === "doing") {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [soundOn, phase]);

  const handleStart = () => setPhase("doing");

  const handleExit = () => {
    setSoundOn(false);
    onExit();
  };

  const handleComplete = () => {
    setSoundOn(false);
    onTaskDone();
    setFeedback(FEEDBACK[Math.floor(Math.random() * FEEDBACK.length)]);
    setPhase("done");
  };

  const handleBreak = () => setPhase("break");

  const handleNext = () => {
    if (isLast) {
      onExit();
    } else {
      setIndex((i) => i + 1);
      setPhase("intro");
    }
  };

  const handleRepeat = () => {
    setPhase("intro");
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-[#0B1220] via-[#0F172A] to-[#111827] px-4">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between bg-[#0B1220]/80 py-4 backdrop-blur-xl">
          <button
            onClick={handleExit}
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            voltar
          </button>

          <button
            onClick={() => setSoundOn((prev) => !prev)}
            disabled={phase !== "doing"}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
              phase === "doing"
                ? "bg-white/10 text-slate-200 hover:bg-white/15"
                : "bg-white/5 text-slate-500"
            }`}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {soundOn ? "Som ligado" : "Som"}
            </span>
          </button>
        </header>

        <main className="flex flex-1 flex-col items-center px-1 pb-8 pt-6 sm:justify-center sm:pt-10">
          <p className="mb-4 text-xs uppercase tracking-widest text-slate-500">
            {flow.label} · passo {index + 1} de {flow.tasks.length}
          </p>

          {phase === "intro" && (
            <div className="w-full text-center">
              <h2 className="mx-auto mb-4 max-w-xs text-3xl leading-tight text-slate-100">
                {task.title}
              </h2>

              <p className="mb-8 text-slate-400">
                {task.minutes} {task.minutes === 1 ? "minuto" : "minutos"}
              </p>

              <button
                onClick={handleStart}
                className="rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-10 py-4 text-white shadow-lg transition hover:scale-[1.02]"
              >
                Começar
              </button>
            </div>
          )}

          {phase === "doing" && (
            <div className="flex w-full flex-col items-center">
              <Timer minutes={task.minutes} onComplete={handleComplete} />

              <button
                onClick={handleComplete}
                className="mt-6 text-sm text-slate-400 hover:text-slate-200"
              >
                já terminei
              </button>
            </div>
          )}

          {phase === "done" && (
            <div className="w-full text-center">
              <Check className="mx-auto mb-5 h-10 w-10 text-sky-300" />

              <h2 className="mx-auto mb-6 max-w-xs text-2xl leading-tight text-slate-100">
                {feedback}
              </h2>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleBreak}
                  className="w-full max-w-xs rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-8 py-3 text-white"
                >
                  Fazer pausa
                </button>

                <button
                  onClick={handleRepeat}
                  className="w-full max-w-xs rounded-full bg-white/5 px-8 py-3 text-slate-300"
                >
                  Repetir este bloco
                </button>

                {!isLast && (
                  <button
                    onClick={handleNext}
                    className="mt-2 text-slate-400 hover:text-slate-200"
                  >
                    Próximo passo
                  </button>
                )}

                <button
                  onClick={onExit}
                  className="mt-1 text-slate-500 hover:text-slate-300"
                >
                  Escolher outro modo
                </button>
              </div>
            </div>
          )}

          {phase === "break" && (
            <div className="w-full text-center">
              <h2 className="mb-3 text-2xl text-slate-100">Respira um pouco</h2>

              <p className="mx-auto mb-6 max-w-xs text-slate-400">
                Você focou. Agora só descansa um pouco.
              </p>

              <Timer minutes={5} onComplete={handleNext} />

              <button
                onClick={handleNext}
                className="mt-6 text-slate-400 hover:text-slate-200"
              >
                pular pausa
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};