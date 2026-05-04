import { useState } from "react";
import { Home } from "@/components/passo/Home";
import { FlowRunner } from "@/components/passo/FlowRunner";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import type { Mode } from "@/lib/flows";
import { AuthButton } from "@/components/AuthButton";

const Index = () => {
  const [mode, setMode] = useState<Mode | null>(null);
  const { count, activeDays, increment, resetProgress } = useDailyProgress();

  const handleReset = () => {
    const confirmReset = confirm("Tem certeza que deseja recomeçar seu progresso?");
    if (confirmReset) resetProgress();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B1220] via-[#0F172A] to-[#111827] px-5 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center">
        {mode === null ? (
          <>
            <div className="mb-6 flex w-full justify-end">
              <AuthButton />
            </div>

            <Home
              onSelect={setMode}
              todayCount={count}
              activeDays={activeDays}
            />

            <button
              onClick={handleReset}
              className="mt-8 text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Recomeçar progresso
            </button>
          </>
        ) : (
          <FlowRunner
            mode={mode}
            onExit={() => setMode(null)}
            onTaskDone={increment}
          />
        )}
      </div>
    </main>
  );
};

export default Index;