import rawExercises from "@/data/exercises.json";
import { type Exercise, normalizeEquipment } from "@/types/exercise";

/**
 * Free Exercise DB normalizado.
 * El JSON se carga una vez y se cachea en memoria del servidor.
 */
function loadExercises(): Exercise[] {
  return (rawExercises as Array<Omit<Exercise, "equipment"> & { equipment: string }>).map(
    (ex) => ({
      ...ex,
      equipment: normalizeEquipment(ex.equipment),
    })
  );
}

let _cache: Exercise[] | null = null;

export function getAllExercises(): Exercise[] {
  if (!_cache) _cache = loadExercises();
  return _cache;
}

export function getExerciseById(id: string): Exercise | undefined {
  return getAllExercises().find((e) => e.id === id);
}

export function searchExercises(query: string): Exercise[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return getAllExercises().filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.primaryMuscles.some((m) => m.toLowerCase().includes(q))
  );
}
