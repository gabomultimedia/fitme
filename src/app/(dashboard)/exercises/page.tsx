"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Loader2 } from "lucide-react";
import { ExerciseCard } from "@/components/exercise/ExerciseCard";
import type { Exercise } from "@/types/exercise";

export default function ExercisesPage() {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1) Cargar equipment del profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("equipment_available")
        .eq("id", user.id)
        .single();
      setEquipment(profile?.equipment_available ?? []);

      // 2) Cargar JSON de ejercicios
      const res = await fetch("/api/exercises");
      const data: Exercise[] = await res.json();
      setAllExercises(data);
      setLoading(false);
    }
    load();
  }, []);

  // Filtrar por equipment + search + muscle
  const filtered = useMemo(() => {
    return allExercises.filter((ex) => {
      // Filter por equipment (incluir bodyweight siempre)
      if (ex.equipment !== "bodyweight" && !equipment.includes(ex.equipment)) {
        return false;
      }
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesMuscle = ex.primaryMuscles.some((m) => m.toLowerCase().includes(q));
        if (!matchesName && !matchesMuscle) return false;
      }
      // Muscle filter
      if (muscleFilter) {
        const allMuscles = [...ex.primaryMuscles, ...ex.secondaryMuscles];
        if (!allMuscles.some((m) => m.toLowerCase() === muscleFilter.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [allExercises, equipment, search, muscleFilter]);

  // Top músculos (para chips de filtro rápido)
  const topMuscles = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ex of allExercises) {
      for (const m of ex.primaryMuscles) {
        counts.set(m, (counts.get(m) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([m]) => m);
  }, [allExercises]);

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
          {filtered.length} de {allExercises.length} ejercicios
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

      {/* Muscle filter chips */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        <button
          onClick={() => setMuscleFilter(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            !muscleFilter
              ? "bg-primary text-on-primary"
              : "bg-surface-container-lowest text-on-surface border border-outline-variant"
          }`}
        >
          Todos
        </button>
        {topMuscles.map((m) => (
          <button
            key={m}
            onClick={() => setMuscleFilter(muscleFilter === m ? null : m)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
              muscleFilter === m
                ? "bg-primary text-on-primary"
                : "bg-surface-container-lowest text-on-surface border border-outline-variant"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-on-surface-variant mb-2">
            {equipment.length === 0
              ? "Configura tu equipamiento en el perfil para ver ejercicios personalizados."
              : "No hay ejercicios que coincidan con tu búsqueda."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
}
