"use client";

import Link from "next/link";
import { Flame, Timer, Dumbbell, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";
import { TodayExercisesList } from "./TodayExercisesList";
import type { Goal, Level } from "@/lib/exercises/recommender";

interface Props {
  goal: Goal;
  level: Level;
  equipment: string[];
}

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const MUSCLE_GROUPS_BY_DAY: Record<number, { primary: string; secondary: string; emoji: string }> = {
  0: { primary: "Pecho + Tríceps", secondary: "Core", emoji: "💪" },
  1: { primary: "Espalda + Bíceps", secondary: "Antebrazos", emoji: "🔙" },
  2: { primary: "Pierna", secondary: "Pantorrillas + Core", emoji: "🦵" },
  3: { primary: "Hombros + Brazos", secondary: "Core", emoji: "🏋️" },
  4: { primary: "Tren Superior", secondary: "Core mixto", emoji: "💯" },
  5: { primary: "Pierna + Hombros", secondary: "Core", emoji: "🔥" },
  6: { primary: "Cardio + Core", secondary: "Movilidad", emoji: "🏃" },
};

export function TodayRoutine({ goal, level, equipment }: Props) {
  const [expanded, setExpanded] = useState(true);
  const today = new Date().getDay();
  const routine = MUSCLE_GROUPS_BY_DAY[today];
  const dayName = DAY_NAMES[today];

  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-md flex flex-col">
      <div
        className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none"
        aria-hidden
      />

      <button
        onClick={() => setExpanded(!expanded)}
        className="relative z-10 p-5 flex flex-col gap-3 text-left cursor-pointer w-full"
      >
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant">
            <Flame className="w-3.5 h-3.5" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-wider">
              Rutina de hoy
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {dayName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-3xl">{routine.emoji}</span>
          <div>
            <h2 className="text-2xl font-bold text-on-surface tracking-tight capitalize">
              {routine.primary}
            </h2>
            <p className="text-xs text-on-surface-variant">+ {routine.secondary}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5" /> 5 ejercicios
          </span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Timer className="w-3.5 h-3.5" />~45 min
          </span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />Personalizada
          </span>
        </div>

        <div className="flex items-center justify-center">
          <ChevronDown
            className={`w-5 h-5 text-outline transition-transform ${expanded ? "" : "-rotate-90"}`}
            aria-hidden
          />
        </div>
      </button>

      {expanded && (
        <div className="relative z-10 px-5 pb-5 flex flex-col gap-4">
          <div className="h-px bg-outline-variant" />
          <TodayExercisesList goal={goal} level={level} equipment={equipment} />
          <Link
            href="/workouts/session"
            className="w-full min-h-[48px] rounded-xl bg-secondary-container text-on-primary font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-current" aria-hidden />
            EMPEZAR RUTINA
          </Link>
        </div>
      )}
    </div>
  );
}
