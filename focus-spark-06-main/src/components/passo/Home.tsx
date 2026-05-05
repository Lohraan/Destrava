import { BookOpen, Briefcase, ChevronRight } from "lucide-react";
import type { Mode } from "@/lib/flows";

interface Props {
  onSelect: (mode: Mode) => void;
  todayCount: number;
  activeDays: number;
}

export const Home = ({ onSelect, todayCount, activeDays }: Props) => {
  return (
    <div className="w-full text-left">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6]/25 to-[#8B5CF6]/25 text-slate-100 ring-1 ring-white/10">
            ✦
          </div>

          <p className="text-sm font-semibold text-slate-100">DestravaAí</p>
        </div>

        <div className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
          {todayCount} hoje
        </div>
      </div>

      <p className="mb-2 text-xs uppercase tracking-[0.28em] text-slate-500">
        FOCO DE HOJE
      </p>

      <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight text-slate-100">
        Vamos com calma hoje?
      </h1>

      <p className="mb-8 text-sm leading-6 text-slate-400">
        Sem pressão, sem culpa. Escolha um tamanho que caiba na sua energia.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 shadow-xl shadow-black/10">
          <p className="mb-2 text-xs text-slate-400">Sequência</p>
          <p className="text-xl font-semibold text-slate-100">
            {activeDays} {activeDays === 1 ? "dia" : "dias"}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 shadow-xl shadow-black/10">
          <p className="mb-2 text-xs text-slate-400">Hoje</p>
          <p className="text-xl font-semibold text-slate-100">
            {todayCount} {todayCount === 1 ? "tarefa" : "tarefas"}
          </p>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
              style={{ width: `${Math.min(todayCount * 20, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelect("tentar")}
        className="mb-4 w-full rounded-3xl bg-[#C9A36B] p-5 text-left text-[#121212] shadow-xl shadow-black/10 transition hover:brightness-105"
      >
        <p className="mb-2 text-xs uppercase tracking-wide opacity-70">
          Recomendado agora
        </p>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">Começo rápido · 2 min</p>
            <p className="mt-1 text-sm opacity-75">Só para dar o primeiro passo</p>
          </div>

          <ChevronRight className="h-5 w-5 opacity-80" />
        </div>
      </button>

      <div className="space-y-3">
        <button
          onClick={() => onSelect("estudar")}
          className="w-full rounded-3xl border border-white/10 bg-white/[0.055] p-4 text-left shadow-xl shadow-black/10 transition hover:border-blue-400/30 hover:bg-white/[0.08]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-sky-200 ring-1 ring-blue-300/15">
              <BookOpen className="h-6 w-6" strokeWidth={2.2} />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-slate-100">Sessão de estudo</p>
              <p className="mt-1 text-sm text-slate-400">25 min com pausa guiada</p>
            </div>

            <p className="text-sm text-slate-400">25 min</p>
          </div>
        </button>

        <button
          onClick={() => onSelect("trabalhar")}
          className="w-full rounded-3xl border border-white/10 bg-white/[0.055] p-4 text-left shadow-xl shadow-black/10 transition hover:border-violet-400/30 hover:bg-white/[0.08]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200 ring-1 ring-violet-300/15">
              <Briefcase className="h-6 w-6" strokeWidth={2.2} />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-slate-100">Bloco de trabalho</p>
              <p className="mt-1 text-sm text-slate-400">45 min de foco profundo</p>
            </div>

            <p className="text-sm text-slate-400">45 min</p>
          </div>
        </button>
      </div>

      <button
        onClick={() => onSelect("dificil")}
        className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-200"
      >
        Hoje está difícil
      </button>
    </div>
  );
};