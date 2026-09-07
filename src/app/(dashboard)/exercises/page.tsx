"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Loader2, Info } from "lucide-react";
import { ExerciseCard } from "@/components/exercise/ExerciseCard";
import type { Exercise } from "@/types/exercise";
import { tMuscle, tEquipment } from "@/lib/i18n/exercise-es";
import { cn } from "@/lib/utils";

const MUSCLE_COLORS: Record<string, string> = {
  abdominales: "bg-tertiary-container text-on-tertiary-container",
  pecho: "bg-error-container text-on-error-container",
  bíceps: "bg-secondary-fixed text-on-secondary-fixed",
  tríceps: "bg-secondary-container text-on-secondary-container",
  hombros: "bg-primary-fixed text-on-primary-fixed",
  dorsales: "bg-surface-container-high text-on-surface",
  "espalda media": "bg-surface-container-high text-on-surface",
  "espalda baja": "bg-surface-container-high text-on-surface",
  cuádriceps: "bg-tertiary-container text-on-tertiary-container",
  isquiotibiales: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  pantorrillas: "bg-surface-container-high text-on-surface",
  glúteos: "bg-primary-fixed text-on-primary-fixed",
  antebrazos: "bg-secondary-fixed text-on-secondary-fixed-variant",
  trapecios: "bg-surface-container-high text-on-surface",
};

function getMuscleColor(muscle: string): string {
  return MUSCLE_COLORS[muscle.toLowerCase()] ?? "bg-surface-container text-on-surface";
}

export default function ExercisesPage() {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "grouped">("grouped");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1) Equipment del profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("equipment_available")
        .eq("id", user.id)
        .single();
      const userEquipment = profile?.equipment_available ?? [];
      setEquipment(userEquipment);

      // 2) Ejercicios desde JSON estático
      const res = await fetch("/exercises.json");
      const data: Exercise[] = await res.json();

      // 3) Filtrar por equipment
      const eqSet = new Set(userEquipment);
      const filtered = data.filter((ex) => {
        if (ex.equipment === "bodyweight") return true;
        return eqSet.has(ex.equipment);
      });
      setAllExercises(filtered);
      setLoading(false);
    }
    load();
  }, []);

  // Filtrar por search + muscle
  const filtered = useMemo(() => {
    return allExercises.filter((ex) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesMuscle = ex.primaryMuscles.some((m) => m.toLowerCase().includes(q));
        if (!matchesName && !matchesMuscle) return false;
      }
      if (muscleFilter) {
        const allMuscles = [...ex.primaryMuscles, ...ex.secondaryMuscles];
        if (!allMuscles.some((m) => m.toLowerCase() === muscleFilter.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [allExercises, search, muscleFilter]);

  // Top músculos con count
  const topMuscles = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ex of allExercises) {
      for (const m of ex.primaryMuscles) {
        counts.set(m, (counts.get(m) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [allExercises]);

  // Agrupar por músculo
  const grouped = useMemo(() => {
    const groups = new Map<string, Exercise[]>();
    for (const ex of filtered) {
      const m = ex.primaryMuscles[0] ?? "other";
      if (!groups.has(m)) groups.set(m, []);
      groups.get(m)!.push(ex);
    }
    return Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-32">
      <header>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Biblioteca</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {filtered.length} de {allExercises.length} ejercicios · {grouped.length} grupos musculares
        </p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar ejercicio o músculo..."
          className="w-full min-h-[44px] pl-11 pr-4 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      {/* Top muscle chips */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        <button
          onClick={() => setMuscleFilter(null)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors",
            !muscleFilter
              ? "bg-primary text-on-primary"
              : "bg-surface-container-lowest text-on-surface border border-outline-variant"
          )}
        >
          Todos ({allExercises.length})
        </button>
        {topMuscles.map(([m, count]) => (
          <button
            key={m}
            onClick={() => setMuscleFilter(muscleFilter === m ? null : m)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors",
              muscleFilter === m
                ? "bg-primary text-on-primary"
                : `${getMuscleColor(m)} border border-transparent`
            )}
          >
            {tMuscle(m)} ({count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center text-center py-12 gap-2">
          <Info className="w-8 h-8 text-outline" />
          <p className="text-on-surface-variant max-w-xs">
            {equipment.length === 0
              ? "Configura tu equipamiento en el perfil para ver ejercicios personalizados."
              : "No hay ejercicios que coincidan con tu búsqueda."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([muscle, exercises]) => (
            <section key={muscle}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-on-surface capitalize flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", getMuscleColor(muscle).split(" ")[0])} />
                  {tMuscle(muscle)}
                </h2>
                <span className="text-xs text-on-surface-variant">{exercises.length}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {exercises.map((ex) => (
                  <ExerciseCard key={ex.id} exercise={ex} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
