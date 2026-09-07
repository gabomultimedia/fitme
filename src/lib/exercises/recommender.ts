// Algoritmo de recomendación de ejercicios
// Basado en: goal, level, equipment, historial reciente

import type { Exercise } from "@/types/exercise";
import { filterByEquipment } from "./filter-by-equipment";

export type Goal = "weight_loss" | "muscle_gain" | "both";
export type Level = "beginner" | "intermediate" | "advanced";

export interface RecommendationInput {
  goal: Goal;
  level: Level;
  equipment: string[];
  /** Músculos trabajados en los últimos N días (para evitar repetir) */
  recentMuscles: string[];
  /** Número de ejercicios a recomendar */
  count?: number;
  /** Si es null, recomienda todos los grupos musculares balanceados */
  targetMuscleGroups?: string[];
  /** Si es para principiantes, evita ejercicios muy avanzados */
  maxLevel?: Level;
}

export interface RecommendedExercise extends Exercise {
  score: number;
  reason: string;
}

// Grupos musculares principales
const ALL_MUSCLE_GROUPS = ["chest", "back", "shoulders", "arms", "legs", "core"];

// Plan semanal por defecto (rotación de grupos musculares)
const DEFAULT_WEEKLY_PLAN: Record<number, string[]> = {
  0: ["chest", "triceps", "core"],          // Lunes: Pecho + Tríceps
  1: ["back", "biceps", "forearms"],         // Martes: Espalda + Bíceps
  2: ["legs", "calves", "core"],             // Miércoles: Pierna
  3: ["shoulders", "arms", "core"],         // Jueves: Hombros + brazos
  4: ["chest", "back", "core"],             // Viernes: Upper body mix
  5: ["legs", "shoulders", "core"],         // Sábado: Lower + hombros
  6: ["cardio", "core"],                     // Domingo: Cardio + core
};

function muscleToGroups(muscles: string[]): string[] {
  const groups = new Set<string>();
  for (const m of muscles) {
    const lower = m.toLowerCase();
    if (["chest", "pectoralis"].includes(lower)) groups.add("chest");
    if (["lats", "middle back", "lower back", "traps", "back"].includes(lower)) groups.add("back");
    if (["shoulders", "deltoid"].includes(lower)) groups.add("shoulders");
    if (["biceps", "triceps", "forearms"].includes(lower)) groups.add("arms");
    if (["quadriceps", "hamstrings", "calves", "glutes", "adductors", "abductors"].includes(lower)) groups.add("legs");
    if (["abdominals", "abs", "core", "obliques"].includes(lower)) groups.add("core");
  }
  return Array.from(groups);
}

function exerciseTargetsGroups(ex: Exercise, groups: string[]): boolean {
  const exerciseGroups = muscleToGroups([...ex.primaryMuscles, ...ex.secondaryMuscles]);
  return groups.some((g) => exerciseGroups.includes(g));
}

/**
 * Recomienda ejercicios personalizados
 */
export function recommendExercises(
  allExercises: Exercise[],
  input: RecommendationInput
): RecommendedExercise[] {
  const {
    goal,
    level,
    equipment,
    recentMuscles = [],
    count = 6,
    targetMuscleGroups,
    maxLevel,
  } = input;

  // 1. Filtrar por equipment
  let candidates = filterByEquipment(allExercises, equipment);

  // 2. Filtrar por level (principiantes no ven ejercicios avanzados)
  if (maxLevel === "beginner") {
    candidates = candidates.filter((e) => e.level === "beginner");
  } else if (maxLevel === "intermediate" || level === "beginner") {
    candidates = candidates.filter((e) => e.level !== "advanced");
  }

  // 3. Si hay targetMuscleGroups, filtrar
  const targetGroups = targetMuscleGroups ?? getTodayTargetGroups(recentMuscles);

  if (targetGroups.length > 0) {
    candidates = candidates.filter((ex) => exerciseTargetsGroups(ex, targetGroups));
  }

  // 4. Calcular score
  const scored = candidates.map((ex) => ({
    exercise: ex,
    score: scoreExercise(ex, { goal, level, recentMuscles, targetGroups }),
  }));

  // 5. Ordenar y tomar N
  scored.sort((a, b) => b.score - a.score);

  // 6. Diversificar: máximo 2 ejercicios del mismo primaryMuscle
  const result: RecommendedExercise[] = [];
  const seen = new Map<string, number>();
  for (const { exercise, score } of scored) {
    const muscle = exercise.primaryMuscles[0] ?? "other";
    const count = seen.get(muscle) ?? 0;
    if (count >= 2) continue;
    seen.set(muscle, count + 1);
    result.push({
      ...exercise,
      score,
      reason: buildReason(exercise, { goal, level, recentMuscles, targetGroups }),
    });
    if (result.length >= (input.count ?? 6)) break;
  }

  return result;
}

/**
 * Obtiene los grupos musculares objetivo del día
 */
export function getTodayTargetGroups(recentMuscles: string[] = []): string[] {
  const today = new Date().getDay();
  let plan = DEFAULT_WEEKLY_PLAN[today] ?? ["chest", "back", "legs"];

  // Si trabajó recientemente, evitar esos grupos
  if (recentMuscles.length > 0) {
    const recentGroups = muscleToGroups(recentMuscles);
    const filtered = plan.filter((g) => !recentGroups.includes(g));
    if (filtered.length >= 2) plan = filtered;
  }

  return plan;
}

interface ScoreInput {
  goal: Goal;
  level: Level;
  recentMuscles: string[];
  targetGroups: string[];
}

function scoreExercise(ex: Exercise, input: ScoreInput): number {
  let score = 0;

  // Match con target groups (peso alto)
  const exerciseGroups = muscleToGroups([...ex.primaryMuscles, ...ex.secondaryMuscles]);
  const matches = input.targetGroups.filter((g) => exerciseGroups.includes(g));
  score += matches.length * 30;

  // Bonus por primary muscle en target
  const primaryGroups = muscleToGroups(ex.primaryMuscles);
  if (primaryGroups.some((g) => input.targetGroups.includes(g))) {
    score += 25;
  }

  // Compound > isolation (más eficiente)
  if (ex.mechanic === "compound") score += 15;

  // Bonus por equipment versátil (bodyweight, dumbbell)
  if (["bodyweight", "dumbbell", "cable"].includes(ex.equipment)) score += 10;

  // Bonus por popularidad (categoría strength es lo más común)
  if (ex.category === "strength") score += 5;

  // Penalizar ejercicios avanzados si el usuario es principiante
  if (input.level === "beginner" && ex.level === "advanced") score -= 50;
  if (input.level === "intermediate" && ex.level === "advanced") score -= 20;

  // Penalizar músculos recién trabajados
  if (input.recentMuscles.length > 0) {
    const overlap = ex.primaryMuscles.filter((m) =>
      input.recentMuscles.includes(m.toLowerCase())
    );
    score -= overlap.length * 20;
  }

  // Goal-specific bonus
  if (input.goal === "weight_loss") {
    // Quemar más calorías: compound + bodyweight
    if (ex.mechanic === "compound") score += 5;
    if (ex.equipment === "bodyweight") score += 5;
  } else if (input.goal === "muscle_gain") {
    // Hipertrofia: isolation + niveles intermedios
    if (ex.mechanic === "isolation") score += 5;
    if (ex.level === "intermediate") score += 3;
  }

  return score;
}

function buildReason(ex: Exercise, input: ScoreInput): string {
  const reasons: string[] = [];
  if (ex.mechanic === "compound") reasons.push("compuesto (más músculos)");
  if (ex.equipment === "bodyweight") reasons.push("sin equipo");
  if (input.goal === "weight_loss" && ex.mechanic === "compound") reasons.push("quema más calorías");
  if (input.goal === "muscle_gain" && ex.level === "intermediate") reasons.push("bueno para hipertrofia");
  if (reasons.length === 0) reasons.push("recomendado para ti");
  return reasons.join(" · ");
}

void buildReason;
