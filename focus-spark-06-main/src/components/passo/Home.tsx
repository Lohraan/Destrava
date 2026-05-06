import {
  BookOpen,
  Briefcase,
  Cloud,
  Play,
  Sparkles,
  Wind,
} from "lucide-react";
import type { Mode } from "@/lib/flows";

interface Props {
  onSelect: (mode: Mode) => void;
  todayCount: number;
  activeDays: number;
  streakDays: number;
  todayMinutes: number;
  totalCompleted: number;
  totalMinutes: number;
  userName: string | null;
  onReset: () => void;
}

export const Home = ({
  onSelect,
  todayCount,
  activeDays,
  streakDays,
  todayMinutes,
  totalCompleted,
  totalMinutes,
  userName,
  onReset,
}: Props) => {
  return (
    <div className="relative overflow-hidden pb-20 pt-12">
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-56 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-3xl text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          Modo calmo ativo
        </div>

        {userName && (
          <p className="mb-4 text-sm text-slate-400">
            Olá, <span className="text-slate-200">{userName}</span>
          </p>
        )}

        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
          Respire fundo.
          <br />
          O que vamos{" "}
          <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
            destravar
          </span>{" "}
          hoje?
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
        </p>

        <div className="mt-10 flex items-center justify-center gap-8 sm:gap-12">
          <div>
            <p className="font-mono text-2xl font-semibold text-white">
              {String(streakDays).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
              sequência
            </p>
          </div>

          <div>
            <p className="font-mono text-2xl font-semibold text-white">
              {String(todayMinutes).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
              min hoje
            </p>
          </div>

          <div>
            <p className="font-mono text-2xl font-semibold text-white">
              {String(todayCount).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
              blocos
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-600">
          {activeDays} {activeDays === 1 ? "dia ativo" : "dias ativos"} ·{" "}
          {totalCompleted} {totalCompleted === 1 ? "bloco total" : "blocos totais"} ·{" "}
          {totalMinutes} min registrados
        </p>
      </section>

      <section className="relative mx-auto mt-16 max-w-4xl rounded-[2rem] border border-cyan-300/30 bg-slate-900/60 p-6 shadow-[0_0_45px_rgba(34,211,238,0.14)] backdrop-blur-xl sm:p-10">
        <p className="mb-4 text-sm font-medium text-emerald-300">
          Sugestão imediata
        </p>

        <h2 className="text-2xl font-semibold text-white">
          Começo rápido · 2 min
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Só para dar o primeiro passo. Sem cobranças, sem cronômetro pesado —
          apenas dois minutos para sair da inércia.
        </p>

        <button
          onClick={() => onSelect("tentar")}
          className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          <Play className="h-4 w-4 fill-slate-950" />
          Começar agora
        </button>
      </section>

      <section className="relative mx-auto mt-14 max-w-4xl">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Sessões de foco
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelect("estudar")}
            className="group flex w-full items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.035] p-4 text-left transition hover:border-violet-300/40 hover:bg-white/[0.06]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] text-violet-300">
              <BookOpen className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-white">Sessão de estudo</p>
              <p className="mt-1 text-sm text-slate-400">
                25 min com pausa guiada
              </p>
            </div>

            <p className="text-sm text-slate-400">25m</p>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-slate-300 transition group-hover:border-violet-300/50 group-hover:text-white">
              <Play className="h-4 w-4 fill-current" />
            </div>
          </button>

          <button
            onClick={() => onSelect("trabalhar")}
            className="group flex w-full items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.035] p-4 text-left transition hover:border-cyan-300/40 hover:bg-white/[0.06]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] text-cyan-300">
              <Briefcase className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-white">Bloco de trabalho</p>
              <p className="mt-1 text-sm text-slate-400">
                45 min de foco profundo
              </p>
            </div>

            <p className="text-sm text-slate-400">45m</p>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-slate-300 transition group-hover:border-cyan-300/50 group-hover:text-white">
              <Play className="h-4 w-4 fill-current" />
            </div>
          </button>
        </div>
      </section>

      <section className="relative mx-auto mt-20 max-w-4xl rounded-[2rem] border border-dashed border-white/25 bg-white/[0.02] p-8 text-center">
        <Cloud className="mx-auto mb-4 h-6 w-6 text-slate-500" />

        <h2 className="text-xl font-semibold text-white">
          Hoje está sendo difícil?
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400">
          Não force produtividade quando a mente pede descanso. Algo mais gentil
          também pode ajudar.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => onSelect("dificil")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm text-slate-300 transition hover:border-violet-300/40 hover:text-white"
          >
            <Wind className="h-4 w-4" />
            Apenas respirar
          </button>

          <button
            onClick={() => onSelect("tentar")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
          >
            <Play className="h-4 w-4 fill-current" />
            Começar com 2 min
          </button>

          <button
            onClick={onReset}
            className="rounded-full border border-white/20 px-5 py-2 text-sm text-slate-500 transition hover:border-red-300/40 hover:text-red-200"
          >
            Recomeçar progresso
          </button>
        </div>
      </section>

      <footer className="mt-24 text-center text-[10px] uppercase tracking-[0.4em] text-slate-600">
        DestravaAí · feito para a calma mental
      </footer>
    </div>
  );
};