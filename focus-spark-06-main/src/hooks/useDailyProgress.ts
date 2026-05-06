import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

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
      result[date] = { count: value, minutes: 0 };
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
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<ProgressData>(emptyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (authLoading) return;

      setLoading(true);

      if (!user) {
        setData(emptyData());
        setLoading(false);
        return;
      }

      const currentDay = today();

      const { data: remoteData, error } = await supabase
        .from("user_progress")
        .select("count, history")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && remoteData) {
        const history = normalizeHistory(remoteData.history);
        const todayData = history[currentDay] ?? { count: 0, minutes: 0 };

        setData({
          date: currentDay,
          count: todayData.count,
          history,
        });
      } else {
        setData(emptyData());
      }

      setLoading(false);
    };

    loadProgress();
  }, [user, authLoading]);

  const increment = async (completedMinutes = 0) => {
    if (!user) return;

    const currentDay = today();
    const current = data.history[currentDay] ?? { count: 0, minutes: 0 };

    const cleanMinutes = Math.max(0, Number(completedMinutes.toFixed(2)));

    const nextDay: DayProgress = {
      count: current.count + 1,
      minutes: Number((current.minutes + cleanMinutes).toFixed(2)),
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

    await supabase.from("user_progress").upsert({
      user_id: user.id,
      count: next.count,
      history: next.history,
      updated_at: new Date().toISOString(),
    });
  };

  const resetProgress = async () => {
    if (!user) {
      setData(emptyData());
      return;
    }

    const clean = emptyData();
    setData(clean);

    await supabase.from("user_progress").upsert({
      user_id: user.id,
      count: 0,
      history: {},
      updated_at: new Date().toISOString(),
    });
  };

  const activeDays = useMemo(() => {
    if (!user) return 0;
    return Object.values(data.history).filter((day) => day.count > 0).length;
  }, [data.history, user]);

  const streakDays = useMemo(() => {
    if (!user) return 0;
    return calculateStreak(data.history);
  }, [data.history, user]);

  const todayMinutes = useMemo(() => {
    if (!user) return 0;
    return data.history[today()]?.minutes ?? 0;
  }, [data.history, user]);

  const totalCompleted = useMemo(() => {
    if (!user) return 0;
    return Object.values(data.history).reduce((sum, day) => sum + day.count, 0);
  }, [data.history, user]);

  const totalMinutes = useMemo(() => {
    if (!user) return 0;
    return Object.values(data.history).reduce((sum, day) => sum + day.minutes, 0);
  }, [data.history, user]);

  return {
    count: user ? data.count : 0,
    history: user ? data.history : {},
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