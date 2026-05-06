import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export const AuthButton = () => {
  const { user } = useAuth();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <span className="max-w-[130px] truncate text-xs text-slate-400">
            {user.email}
          </span>

          <button
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            sair
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs text-slate-300 hover:bg-white/[0.1] hover:text-white transition"
        >
          Entrar
        </button>
      )}
    </div>
  );
};