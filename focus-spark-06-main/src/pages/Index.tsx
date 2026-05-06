import { useState } from "react";
import { Home } from "@/components/passo/Home";
import { FlowRunner } from "@/components/passo/FlowRunner";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import type { Mode } from "@/lib/flows";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [mode, setMode] = useState<Mode | null>(null);
  const { user } = useAuth();

  const {
    count,
    activeDays,
    streakDays,
    todayMinutes,
    totalCompleted,
    totalMinutes,
    increment,
    resetProgress,
  } = useDailyProgress();

  const handleReset = () => {
    const confirmReset = confirm("Tem certeza que deseja recomeçar seu progresso?");
    if (confirmReset) resetProgress();
  };

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    null;

  return (
    <main className="min-h-screen bg-[#070D1A] text-slate-100">
      {mode === null ? (
        <div className="mx-auto min-h-screen w-full max-w-5xl px-5 pb-16">
          <header className="flex items-center justify-between border-b border-white/10 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5">
                <img
                  src="/logo.png"
                  alt="DestravaAí"
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="font-semibold text-slate-100">DestravaAí</span>
            </div>

            <AuthButton />
          </header>

          <Home
            onSelect={setMode}
            isLoggedIn={Boolean(user)}
            todayCount={count}
            activeDays={activeDays}
            streakDays={streakDays}
            todayMinutes={todayMinutes}
            totalCompleted={totalCompleted}
            totalMinutes={totalMinutes}
            userName={userName}
            onReset={handleReset}
          />
        </div>
      ) : (
        <FlowRunner
          mode={mode}
          onExit={() => setMode(null)}
          onTaskDone={increment}
        />
      )}
    </main>
  );
};

export default Index;