import type { Exercise } from "@/types/exercise";

interface Options {
  /** Incluir ejercicios bodyweight (no requieren equipo). Default: true */
  includeBodyweight?: boolean;
}

/**
 * Filtra ejercicios por el equipamiento disponible del usuario.
 * Bodyweight siempre incluido por defecto (no requiere equipo).
 */
export function filterByEquipment(
  exercises: Exercise[],
  available: string[],
  options: Options = { includeBodyweight: true }
): Exercise[] {
  const set = new Set(available);
  return exercises.filter((ex) => {
    if (ex.equipment === "bodyweight") return options.includeBodyweight;
    return set.has(ex.equipment);
  });
}
