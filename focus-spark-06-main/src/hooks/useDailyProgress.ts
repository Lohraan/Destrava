import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const LOCAL_KEY = "passo.progress.v3";
const today = () => new Date().toISOString().slice(0, 10);

type DayProgress = {
  count: number;
  minutes: number;
};

export type ProgressData = {
  date: string;
  count: number;
  history: Record<string, DayProgress>;
};

const emptyData = (): ProgressData => ({
  date: today(),
  count: 0,
  history: {},
});

const normalizeHistory = (raw: unknown): Record<string, DayProgress> => {
  if (!raw || typeof raw !== "object") return {};

  const result: Record<string, DayProgress> = {};

  Object.entries(raw as Record<string, any>).forEach(([date, value]) => {
    if (typeof value === "number") {
      result[date] = {
        count: value,
        minutes: 0,
      };
      return;
    }

    result[date] = {
      count: Number(value?.count ?? 0),
      minutes: Number(value?.minutes ?? 0),
    };
  });

  return result;
};

const calculateStreak = (history: Record<string, DayProgress>) => {
  let streak = 0;
  const current = new Date(today());

  while (true) {
    const key = current.toISOString().slice(0, 10);
    const day = history[key];

    if (!day || day.count <= 0) break;

    streak += 1;
    current.setDate(current.getDate() - 1);
  }

  return streak;
};

export const useDailyProgress = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ProgressData>(emptyData);
  const [loading, setLoading] = useState(true);

  const saveLocal = (next: ProgressData) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  };

  const saveRemote = async (next: ProgressData) => {
    if (!user) return;

    await supabase.from("user_progress").upsert({
      user_id: user.id,
      count: next.count,
      history: next.history,
      updated_at: new Date().toISOString(),
    });
  };

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      const currentDay = today();

      if (user) {
        const { data: remoteData, error } = await supabase
          .from("user_progress")
          .select("count, history")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && remoteData) {
          const history = normalizeHistory(remoteData.history);
          const todayData = history[currentDay] ?? { count: 0, minutes: 0 };

          const next: ProgressData = {
            date: currentDay,
            count: todayData.count,
            history,
          };

          setData(next);
          saveLocal(next);
          setLoading(false);
          return;
        }
      }

      try {
        const raw = localStorage.getItem(LOCAL_KEY);

        if (raw) {
          const parsed = JSON.parse(raw);
          const history = normalizeHistory(parsed.history);
          const todayData = history[currentDay] ?? { count: 0, minutes: 0 };

          const next: ProgressData = {
            date: currentDay,
            count: todayData.count,
            history,
          };

          setData(next);

          if (user) {
            await saveRemote(next);
          }
        }
      } catch {
        setData(emptyData());
      }

      setLoading(false);
    };

    loadProgress();
  }, [user]);

  const increment = async (completedMinutes = 0) => {
    const currentDay = today();
    const current = data.history[currentDay] ?? { count: 0, minutes: 0 };

    const nextDay: DayProgress = {
      count: current.count + 1,
      minutes: current.minutes + completedMinutes,
    };

    const next: ProgressData = {
      date: currentDay,
      count: nextDay.count,
      history: {
        ...data.history,
        [currentDay]: nextDay,
      },
    };

    setData(next);
    saveLocal(next);
    await saveRemote(next);
  };

  const resetProgress = async () => {
    const clean = emptyData();

    setData(clean);
    saveLocal(clean);

    if (user) {
      await supabase.from("user_progress").upsert({
        user_id: user.id,
        count: 0,
        history: {},
        updated_at: new Date().toISOString(),
      });
    }
  };

  const activeDays = useMemo(() => {
    return Object.values(data.history).filter((day) => day.count > 0).length;
  }, [data.history]);

  const streakDays = useMemo(() => {
    return calculateStreak(data.history);
  }, [data.history]);

  const todayMinutes = useMemo(() => {
    const current = data.history[today()];
    return current?.minutes ?? 0;
  }, [data.history]);

  const totalCompleted = useMemo(() => {
    return Object.values(data.history).reduce((sum, day) => sum + day.count, 0);
  }, [data.history]);

  const totalMinutes = useMemo(() => {
    return Object.values(data.history).reduce((sum, day) => sum + day.minutes, 0);
  }, [data.history]);

  return {
    count: data.count,
    history: data.history,
    activeDays,
    streakDays,
    todayMinutes,
    totalCompleted,
    totalMinutes,
    loading,
    increment,
    resetProgress,
  };
};