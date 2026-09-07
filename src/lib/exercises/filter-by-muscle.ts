import type { Exercise } from "@/types/exercise";

/**
 * Filtra ejercicios que trabajan un músculo (primario o secundario).
 */
export function filterByMuscle(exercises: Exercise[], muscle: string): Exercise[] {
  const lower = muscle.toLowerCase();
  return exercises.filter(
    (e) =>
      e.primaryMuscles.some((m) => m.toLowerCase() === lower) ||
      e.secondaryMuscles.some((m) => m.toLowerCase() === lower)
  );
}

/**
 * Agrupa ejercicios por músculo primario.
 */
export function groupByPrimaryMuscle(exercises: Exercise[]): Record<string, Exercise[]> {
  return exercises.reduce(
    (acc, ex) => {
      const muscle = ex.primaryMuscles[0] ?? "other";
      if (!acc[muscle]) acc[muscle] = [];
      acc[muscle].push(ex);
      return acc;
    },
    {} as Record<string, Exercise[]>
  );
}
