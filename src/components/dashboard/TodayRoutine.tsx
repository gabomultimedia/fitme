import Link from "next/link";
import { Flame, Play, Timer, Dumbbell } from "lucide-react";

export function TodayRoutine() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-md p-5 flex flex-col gap-4">
      <div
        className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none"
        aria-hidden
      />

      <div className="flex items-center justify-between relative z-10">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant">
          <Flame className="w-3.5 h-3.5" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-wider">
            Tu Rutina de Hoy
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Listo
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-on-surface tracking-tight">
          Pecho + Tríceps
        </h2>
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" aria-hidden />6 ejercicios
          </span>
          <span aria-hidden>•</span>
          <span className="flex items-center gap-1">
            <Timer className="w-4 h-4" aria-hidden />~45 min
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-2">
        <span className="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold">
          Pectoral Mayor
        </span>
        <span className="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold">
          Tríceps
        </span>
        <span className="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold">
          Deltoides
        </span>
      </div>

      <Link
        href="/workouts/session"
        className="relative z-10 w-full min-h-[48px] rounded-xl bg-secondary-container text-on-primary font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
      >
        <Play className="w-5 h-5 fill-current" aria-hidden />
        EMPEZAR RUTINA
      </Link>
    </div>
  );
}
