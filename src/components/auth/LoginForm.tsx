"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FitMeLogo } from "@/components/brand/FitMeLogo";

const QUICK_LOGIN = [
  { email: "gabriel@fitme.app", name: "Gabriel", emoji: "G" },
  { email: "vero@fitme.app", name: "Verónica", emoji: "V" },
];

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Ingresa email y contraseña");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        // Mostrar el error real de Supabase para debug
        console.error("[LoginForm] signIn error:", signInError);
        setError(`Error: ${signInError.message} (code: ${signInError.status ?? "?"})`);
        return;
      }
      if (!data.session) {
        setError("No se creó sesión. Intenta de nuevo.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("[LoginForm] exception:", err);
      setError(`Error de conexión: ${err instanceof Error ? err.message : "desconocido"}`);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickLogin(userEmail: string) {
    setEmail(userEmail);
    setPassword("");
    setError(null);
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-8">
      <header className="flex items-center gap-3 mb-12">
        <FitMeLogo size={40} />
        <span className="text-xl font-bold">FitMe</span>
      </header>

      <main className="flex-1 flex flex-col max-w-sm w-full mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Iniciar sesión</h1>
        <p className="text-base text-on-surface-variant mb-6">
          Entra con tu cuenta para registrar tus entrenamientos.
        </p>

        {/* Quick login buttons */}
        <div className="flex flex-col gap-2 mb-6">
          <p className="text-xs font-bold text-outline uppercase tracking-wider">
            Acceso rápido
          </p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LOGIN.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => handleQuickLogin(u.email)}
                className="min-h-[48px] px-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer hover:border-primary"
              >
                <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                  {u.emoji}
                </span>
                <span className="text-sm">{u.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="text-xs text-on-surface-variant uppercase">o con email</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Email</span>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" aria-hidden />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] pl-11 pr-4 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Contraseña</span>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" aria-hidden />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] pl-11 pr-12 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="min-h-[48px] bg-primary text-on-primary font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            Iniciar sesión
          </button>

          {error && (
            <p role="alert" className="text-sm text-error text-center">
              {error}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
