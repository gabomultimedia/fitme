// Tipos del Free Exercise DB
// Schema: https://github.com/yuhonas/free-exercise-db

export type ExerciseLevel = "beginner" | "intermediate" | "advanced";

export type ExerciseForce = "push" | "pull" | "static" | null;

export type ExerciseMechanic = "compound" | "isolation" | null;

export interface Exercise {
  id: string;
  name: string;
  force: ExerciseForce;
  level: ExerciseLevel;
  mechanic: ExerciseMechanic;
  /** ID normalizado: "barbell" | "dumbbell" | "cable" | etc. */
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: [string, string];
}

/** Mapeo de equipment crudo del FEDB a IDs normalizados */
const EQUIPMENT_MAP: Record<string, string> = {
  "body only": "bodyweight",
  barbell: "barbell",
  dumbbell: "dumbbell",
  "cable": "cable",
  machine: "machine",
  "kettlebells": "kettlebells",
  "e-z curl bar": "ez_bar",
  "olympic barbell": "barbell",
  "trap bar": "trap_bar",
  bands: "bands",
  "medicine ball": "medicine_ball",
  "exercise ball": "exercise_ball",
  "swiss ball": "exercise_ball",
  "stability ball": "exercise_ball",
  "bosu ball": "other",
  "resistance band": "bands",
  "rope": "other",
  "roller": "roller",
  "wheel roller": "roller",
  "foam roll": "roller",
  "sled machine": "other",
  "tire": "other",
  "stepmill machine": "machine",
  "upper body ergometer": "machine",
  "elliptical machine": "machine",
  "stationary bike": "machine",
  "spin bike": "machine",
};

export function normalizeEquipment(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return EQUIPMENT_MAP[lower] ?? lower.replace(/\s+/g, "_");
}
