"use client";

import Link from "next/link";
import { Dumbbell, Timer, TrendingUp, ChevronRight, Bell, User } from "lucide-react";
import { FitMeLogo } from "@/components/brand/FitMeLogo";

interface Props {
  userName?: string;
}

const FEATURES = [
  {
    icon: Dumbbell,
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
    title: "Rutinas personalizadas",
    description: "Adaptadas 100% según el equipamiento que tengas disponible.",
  },
  {
    icon: Timer,
    iconBg: "bg-secondary-fixed",
    iconColor: "text-secondary",
    title: "Registro en tiempo real",
    description: "Control ágil de series, repeticiones, descansos y peso exacto.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-surface-container-highest",
    iconColor: "text-primary",
    title: "Seguimiento visual de metas",
    description: "Fotos de progreso físico, curvas de peso y métricas claras.",
  },
];

export function WelcomeHero({ userName }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header con avatar */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FitMeLogo size={32} />
            <span className="text-lg font-semibold tracking-tight">FitMe</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Notificaciones"
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-on-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 pb-8">
        {/* Hero con logo grande + saludo */}
        <div className="flex flex-col items-center text-center mt-6 mb-8">
          <div className="relative mb-5">
            <div
              className="absolute w-28 h-28 rounded-full bg-primary-fixed blur-xl opacity-60 animate-pulse"
              aria-hidden
            />
            <div className="relative w-24 h-24 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center p-3">
              <FitMeLogo size={64} className="w-full h-full" />
            </div>
          </div>

          {userName && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed mb-3 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider">
                Hola, {userName}
              </span>
            </div>
          )}

          <h1 className="text-[32px] font-bold leading-10 tracking-tight text-on-surface mb-2">
            BIENVENIDO A FITME
          </h1>
          <p className="text-base leading-6 text-on-surface-variant max-w-xs mx-auto">
            Tu gimnasio, tu app. Registra tus avances, sigue tus rutinas y alcanza tus metas de fitness.
          </p>
        </div>

        {/* 3 features */}
        <div className="flex flex-col gap-3 mb-8">
          {FEATURES.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-6 h-6 ${iconColor}`} aria-hidden />
              </div>
              <div className="flex flex-col min-w-0 pt-0.5">
                <span className="text-base font-semibold text-on-surface">{title}</span>
                <span className="text-sm text-on-surface-variant mt-0.5">{description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 mt-auto">
          <Link
            href="/register"
            className="w-full min-h-[48px] bg-primary text-on-primary font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span>COMENZAR</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-on-surface-variant">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary font-medium underline hover:text-primary-container">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
