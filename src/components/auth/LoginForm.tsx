"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FitMeLogo } from "@/components/brand/FitMeLogo";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        setMessage({ type: "err", text: error.message });
      } else {
        setMessage({ type: "ok", text: "Revisa tu correo para el link mágico" });
      }
    } catch (err) {
      setMessage({ type: "err", text: "Error inesperado. Intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
    } catch (err) {
      setMessage({ type: "err", text: "No se pudo iniciar con Google." });
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-8">
      <header className="flex items-center gap-3 mb-12">
        <FitMeLogo size={40} />
        <span className="text-xl font-bold">FitMe</span>
      </header>

      <main className="flex-1 flex flex-col max-w-sm w-full mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Iniciar sesión</h1>
        <p className="text-base text-on-surface-variant mb-8">
          Te enviaremos un link mágico a tu correo o puedes continuar con Google.
        </p>

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 w-full">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-[48px] px-4 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="min-h-[48px] bg-primary text-on-primary font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            Enviar link mágico
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-xs text-on-surface-variant uppercase">o</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="min-h-[48px] border border-outline-variant bg-surface text-on-surface font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </button>

          {message && (
            <p
              role="status"
              className={`text-sm ${message.type === "ok" ? "text-tertiary" : "text-error"}`}
            >
              {message.text}
            </p>
          )}
        </form>

        <p className="text-sm text-center text-on-surface-variant mt-8">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-primary font-medium underline">
            Regístrate
          </Link>
        </p>
      </main>
    </div>
  );
}
