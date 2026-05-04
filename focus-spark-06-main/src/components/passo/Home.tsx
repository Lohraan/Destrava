import { BookOpen, Briefcase } from "lucide-react";
import type { Mode } from "@/lib/flows";

interface Props {
  onSelect: (mode: Mode) => void;
  todayCount: number;
  activeDays: number;
}

export const Home = ({ onSelect, todayCount, activeDays }: Props) => {
  return (
    <div className="w-full text-left">

      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          ✨
        </div>
        <p className="text-sm font-medium text-slate-200">DestravaAí</p>
      </div>

      <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
        FOCO DE HOJE
      </p>

      <h1 className="text-3xl text-slate-100 mb-3 leading-tight">
        Vamos com calma hoje?
      </h1>

      <p className="text-slate-400 mb-6">
        Sem pressão, sem culpa. Escolha um tamanho que caiba na sua energia.
      </p>

      {/* CARDS */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs text-slate-500 mb-1">Sequência</p>
          <p className="text-xl text-slate-100">
            {activeDays} {activeDays === 1 ? "dia" : "dias"}
          </p>
        </div>

        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs text-slate-500 mb-1">Hoje</p>
          <p className="text-xl text-slate-100">
            {todayCount} {todayCount === 1 ? "tarefa" : "tarefas"}
          </p>

          <div className="mt-2 h-1 w-full rounded bg-white/10">
            <div
              className="h-1 rounded bg-indigo-400"
              style={{ width: `${Math.min(todayCount * 20, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* RECOMENDADO */}
      <button
        onClick={() => onSelect("tentar")}
        className="w-full mb-6 rounded-2xl bg-[#C9A36B] p-5 text-left text-black hover:opacity-90 transition"
      >
        <p className="text-xs opacity-70 mb-1">RECOMENDADO AGORA</p>
        <p className="text-lg font-medium">Começo rápido · 2 min</p>
        <p className="text-sm opacity-70">Só para dar o primeiro passo</p>
      </button>

      {/* AÇÕES */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onSelect("estudar")}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.06] transition"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-slate-100">Sessão de estudo</p>
              <p className="text-xs text-slate-400">25 min com pausa guiada</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">25 min</p>
        </button>

        <button
          onClick={() => onSelect("trabalhar")}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.06] transition"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2">
              <Briefcase size={18} />
            </div>
            <div>
              <p className="text-slate-100">Bloco de trabalho</p>
              <p className="text-xs text-slate-400">45 min de foco profundo</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">45 min</p>
        </button>
      </div>

      {/* EXTRA */}
      <div className="mt-6 text-center">
        <button
          onClick={() => onSelect("dificil")}
          className="text-xs text-slate-500 hover:text-slate-300 transition"
        >
          Hoje está difícil
        </button>
      </div>

    </div>
  );
};