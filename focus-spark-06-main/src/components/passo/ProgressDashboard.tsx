import { getAchievements } from "@/lib/achievements";

type Props = {
  todayCount: number;
  history: Record<string, number>;
  activeDays: number;
  totalCompleted: number;
};

const getLastDays = (amount: number) => {
  return Array.from({ length: amount }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (amount - 1 - index));
    return date.toISOString().slice(0, 10);
  });
};

const formatDay = (date: string) => {
  const [, month, day] = date.split("-");
  return `${day}/${month}`;
};

export const ProgressDashboard = ({ todayCount, history, activeDays, totalCompleted }: Props) => {
  const achievements = getAchievements(todayCount, activeDays, totalCompleted);
  const unlocked = achievements.filter((item) => item.unlocked).length;
  const days = getLastDays(14);

  return (
    <section className="w-full rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-soft backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">evolução</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">Seu progresso visual</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sem cobrança. Cada ponto é um recomeço.</p>
        </div>
        <div className="rounded-2xl bg-primary-soft px-4 py-3 text-center">
          <p className="text-2xl font-semibold text-foreground">{todayCount}</p>
          <p className="text-[11px] text-muted-foreground">hoje</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/70 p-3 text-center">
          <p className="text-lg font-semibold">{activeDays}</p>
          <p className="text-[11px] text-muted-foreground">dias ativos</p>
        </div>
        <div className="rounded-2xl bg-white/70 p-3 text-center">
          <p className="text-lg font-semibold">{totalCompleted}</p>
          <p className="text-[11px] text-muted-foreground">passos</p>
        </div>
        <div className="rounded-2xl bg-white/70 p-3 text-center">
          <p className="text-lg font-semibold">{unlocked}/{achievements.length}</p>
          <p className="text-[11px] text-muted-foreground">selos</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">Últimos 14 dias</p>
          <p className="text-xs text-muted-foreground">pontos maiores = mais passos</p>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const count = history[day] ?? 0;
            const size = count >= 3 ? "h-8" : count >= 1 ? "h-6" : "h-3";
            const opacity = count > 0 ? "bg-accent" : "bg-muted";

            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <div className="flex h-9 items-end">
                  <div className={`${size} w-6 rounded-full ${opacity} transition-all`} title={`${formatDay(day)} · ${count} passos`} />
                </div>
                <span className="text-[10px] text-muted-foreground">{day.slice(8)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        {achievements.map(({ id, title, description, unlocked, icon: Icon }) => (
          <div
            key={id}
            className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
              unlocked ? "border-accent/40 bg-accent-soft" : "border-border bg-white/50 opacity-60"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{unlocked ? "🏆 " : "🔒 "}{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
