import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const LOCAL_KEY = "passo.progress.v2";
const today = () => new Date().toISOString().slice(0, 10);

export type ProgressData = {
  date: string;
  count: number;
  history: Record<string, number>;
};

const emptyData = (): ProgressData => ({
  date: today(),
  count: 0,
  history: {},
});

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

      // 🔥 tenta pegar do Supabase primeiro
      if (user) {
        const { data: remoteData, error } = await supabase
          .from("user_progress")
          .select("count, history")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && remoteData) {
          const next: ProgressData = {
            date: currentDay,
            count: remoteData.history?.[currentDay] ?? 0,
            history: remoteData.history ?? {},
          };

          setData(next);
          saveLocal(next);
          setLoading(false);
          return;
        }
      }

      // fallback local
      try {
        const raw = localStorage.getItem(LOCAL_KEY);

        if (raw) {
          const parsed: ProgressData = JSON.parse(raw);

          const next: ProgressData = {
            date: currentDay,
            count: parsed.history?.[currentDay] ?? parsed.count ?? 0,
            history: parsed.history ?? {},
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

  const increment = async () => {
    const currentDay = today();
    const currentDayCount = data.history[currentDay] ?? 0;
    const nextCount = currentDayCount + 1;

    const next: ProgressData = {
      date: currentDay,
      count: nextCount,
      history: {
        ...data.history,
        [currentDay]: nextCount,
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

  // 🔥 CORREÇÃO AQUI (dias únicos)
  const activeDays = useMemo(() => {
    return Object.entries(data.history).filter(
      ([_, count]) => count > 0
    ).length;
  }, [data.history]);

  const totalCompleted = useMemo(
    () => Object.values(data.history).reduce((sum, count) => sum + count, 0),
    [data.history]
  );

  return {
    count: data.count,
    history: data.history,
    activeDays,
    totalCompleted,
    loading,
    increment,
    resetProgress,
  };
};