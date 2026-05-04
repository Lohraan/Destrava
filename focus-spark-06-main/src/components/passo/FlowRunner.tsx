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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0B1220] via-[#0F172A] to-[#111827] flex flex-col items-center justify-center px-4">

      {/* TOPO */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <button
          onClick={handleExit}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          voltar
        </button>

        <button
          onClick={() => setSoundOn((prev) => !prev)}
          disabled={phase !== "doing"}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
            phase === "doing"
              ? "bg-white/10 text-slate-200"
              : "bg-white/5 text-slate-500"
          }`}
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>

      {/* LABEL */}
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-3 mt-16">
        {flow.label} · passo {index + 1} de {flow.tasks.length}
      </p>

      {/* INTRO */}
      {phase === "intro" && (
        <div className="text-center">
          <h2 className="text-3xl text-slate-100 mb-4">{task.title}</h2>
          <p className="text-slate-400 mb-10">
            {task.minutes} minutos
          </p>

          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white px-10 py-4 rounded-full"
          >
            Começar
          </button>
        </div>
      )}

      {/* DOING */}
      {phase === "doing" && (
        <div className="flex flex-col items-center">
          <Timer minutes={task.minutes} onComplete={handleComplete} />

          <button
            onClick={handleComplete}
            className="mt-8 text-sm text-slate-400 hover:text-slate-200"
          >
            já terminei
          </button>
        </div>
      )}

      {/* DONE */}
      {phase === "done" && (
        <div className="text-center">
          <Check className="h-10 w-10 text-sky-300 mx-auto mb-6" />

          <h2 className="text-2xl text-slate-100 mb-6">{feedback}</h2>

          <div className="flex flex-col gap-3 items-center">

            <button
              onClick={handleBreak}
              className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white px-8 py-3 rounded-full w-64"
            >
              Fazer pausa
            </button>

            <button
              onClick={handleRepeat}
              className="bg-white/5 text-slate-300 px-8 py-3 rounded-full w-64"
            >
              Repetir este bloco
            </button>

            {!isLast && (
              <button
                onClick={handleNext}
                className="text-slate-400 mt-2"
              >
                Próximo passo
              </button>
            )}

            <button
              onClick={onExit}
              className="text-slate-500 mt-2"
            >
              Escolher outro modo
            </button>
          </div>
        </div>
      )}

      {/* BREAK */}
      {phase === "break" && (
        <div className="text-center">
          <h2 className="text-2xl text-slate-100 mb-4">
            Respira um pouco
          </h2>

          <p className="text-slate-400 mb-8">
            Você focou. Agora só descansa um pouco.
          </p>

          <Timer minutes={5} onComplete={handleNext} />

          <button
            onClick={handleNext}
            className="mt-6 text-slate-400"
          >
            pular pausa
          </button>
        </div>
      )}
    </div>
  );
};