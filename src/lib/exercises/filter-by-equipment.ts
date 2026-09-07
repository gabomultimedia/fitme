import type { Exercise } from "@/types/exercise";

interface Options {
  includeBodyweight?: boolean;
}

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

export function groupByMuscle(exercises: Exercise[]): Map<string, Exercise[]> {
  const groups = new Map<string, Exercise[]>();
  for (const ex of exercises) {
    const muscle = ex.primaryMuscles[0] ?? "other";
    if (!groups.has(muscle)) groups.set(muscle, []);
    groups.get(muscle)!.push(ex);
  }
  return groups;
}
