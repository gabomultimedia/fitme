"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Dumbbell } from "lucide-react";
import type { Exercise } from "@/types/exercise";
import { tExerciseName, tExerciseDescription } from "@/lib/i18n/exercise-names-es";
import { tMuscle } from "@/lib/i18n/exercise-es";
import { recommendExercises, type RecommendedExercise, type Goal, type Level } from "@/lib/exercises/recommender";
import { createClient } from "@/lib/supabase/client";
import { MUSCLE_COLORS } from "@/lib/equipment/colors";

const FEDB_IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

interface Props {
  goal: Goal;
  level: Level;
  equipment: string[];
}

export function TodayExercisesList({ goal, level, equipment }: Props) {
  const [exercises, setExercises] = useState<RecommendedExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1) Cargar historial reciente (últimos 3 días)
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Primero obtener sesiones recientes
      const { data: recentSessions } = await supabase
        .from("workout_sessions")
        .select("id, started_at")
        .eq("user_id", user.id)
        .gte("started_at", threeDaysAgo.toISOString());

      const recentSessionIds = recentSessions?.map((s) => s.id) ?? [];

      // Luego obtener sets de esas sesiones
      const { data: recentSets } = recentSessionIds.length > 0
        ? await supabase
            .from("session_sets")
            .select("exercise_id")
            .in("session_id", recentSessionIds)
        : { data: [] };

      // 2) Cargar ejercicios estáticos
      const res = await fetch("/exercises.json");
      const allExercises: Exercise[] = await res.json();

      // 3) Mapear músculos trabajados
      const recentMuscles: string[] = [];
      if (recentSets) {
        for (const s of recentSets) {
          const ex = allExercises.find((e) => e.id === s.exercise_id);
          if (ex) recentMuscles.push(...ex.primaryMuscles);
        }
      }

      // 4) Recomendar
      const recommended = recommendExercises(allExercises, {
        goal,
        level,
        equipment,
        recentMuscles,
        count: 5,
      });
      setExercises(recommended);
      setLoading(false);
    }
    load();
  }, [goal, level, equipment]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-on-surface-variant">
          Configura tu equipamiento para ver recomendaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {exercises.map((ex, idx) => {
        const muscleEs = tMuscle(ex.primaryMuscles[0] ?? "Fuerza");
        const muscleColor = MUSCLE_COLORS[muscleEs] ?? "bg-surface-container";
        const nameEs = tExerciseName(ex.name);
        const descEs = tExerciseDescription(ex.name);

        return (
          <Link
            key={ex.id}
            href={`/exercises/${ex.id}`}
            className="group flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            {/* Número de orden */}
            <div className="shrink-0 w-7 h-7 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center tabular-nums">
              {idx + 1}
            </div>

            {/* Imagen */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0">
              <Image
                src={`${FEDB_IMAGE_BASE}/${ex.images[0]}`}
                alt={nameEs}
                fill
                sizes="56px"
                loading="lazy"
                className="object-cover"
              />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-on-surface leading-tight line-clamp-1">
                {nameEs}
              </h3>
              {descEs && (
                <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                  {descEs}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${muscleColor}`}>
                  {muscleEs}
                </span>
                <span className="text-[10px] text-outline">·</span>
                <span className="text-[10px] text-on-surface-variant capitalize">
                  {ex.equipment === "bodyweight" ? "peso corporal" : ex.equipment}
                </span>
              </div>
            </div>

            {/* Chevron */}
            <ArrowRight className="w-4 h-4 text-outline shrink-0 group-hover:text-primary transition-colors" aria-hidden />
          </Link>
        );
      })}
    </div>
  );
}
