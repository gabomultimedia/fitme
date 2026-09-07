// Diccionario de traducciones para contenido de ejercicios
// Las instrucciones de los ejercicios quedan en inglés (fuente original)
// pero TODO el metadata visible está en español

// Músculos (primary + secondary)
export const MUSCLE_ES: Record<string, string> = {
  abdominals: "abdominales",
  hamstrings: "isquiotibiales",
  calves: "pantorrillas",
  shoulders: "hombros",
  biceps: "bíceps",
  triceps: "tríceps",
  forearms: "antebrazos",
  quadriceps: "cuádriceps",
  lats: "dorsales",
  "middle back": "espalda media",
  "lower back": "espalda baja",
  traps: "trapecios",
  glutes: "glúteos",
  chest: "pecho",
  neck: "cuello",
  adductors: "aductores",
  abductors: "abductores",
};

// Body parts
export const BODY_PART_ES: Record<string, string> = {
  back: "espalda",
  cardio: "cardio",
  chest: "pecho",
  "lower arms": "antebrazos",
  "lower legs": "piernas",
  neck: "cuello",
  shoulders: "hombros",
  "upper arms": "brazos",
  "upper legs": "muslos",
  waist: "cintura",
};

// Equipment (id normalizado)
export const EQUIPMENT_ES: Record<string, string> = {
  barbell: "barra",
  dumbbell: "mancuernas",
  cable: "poleas",
  machine: "máquina",
  bodyweight: "peso corporal",
  kettlebells: "kettlebell",
  ez_bar: "barra z",
  trap_bar: "barra hexagonal",
  bands: "bandas",
  medicine_ball: "medicina ball",
  exercise_ball: "pelota suiza",
  roller: "rodillo",
  pull_up_bar: "barra de dominadas",
  bench: "banco",
  jump_rope: "comba",
  smith_machine: "smith machine",
  other: "otro",
};

// Niveles
export const LEVEL_ES: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

// Mecánica
export const MECHANIC_ES: Record<string, string> = {
  compound: "Compuesto",
  isolation: "Aislamiento",
};

// Fuerza
export const FORCE_ES: Record<string, string> = {
  push: "Empuje",
  pull: "Jalón",
  static: "Estático",
};

// Categoría
export const CATEGORY_ES: Record<string, string> = {
  strength: "Fuerza",
  stretching: "Estiramiento",
  plyometrics: "Pliometría",
  strongman: "Strongman",
  cardio: "Cardio",
  olympic_weightlifting: "Halterofilia",
  powerlifting: "Powerlifting",
};

/**
 * Traduce un músculo, devuelve el original si no encuentra traducción
 */
export function tMuscle(muscle: string): string {
  const lower = muscle.toLowerCase().trim();
  return MUSCLE_ES[lower] ?? muscle;
}

/**
 * Traduce un body part
 */
export function tBodyPart(part: string): string {
  const lower = part.toLowerCase().trim();
  return BODY_PART_ES[lower] ?? part;
}

/**
 * Traduce un equipment
 */
export function tEquipment(eq: string): string {
  const lower = eq.toLowerCase().trim();
  return EQUIPMENT_ES[lower] ?? eq.replace(/_/g, " ");
}

/**
 * Traduce nivel
 */
export function tLevel(level: string): string {
  return LEVEL_ES[level] ?? level;
}

/**
 * Traduce mecánica
 */
export function tMechanic(mechanic: string | null): string {
  if (!mechanic) return "Fuerza";
  return MECHANIC_ES[mechanic] ?? mechanic;
}

/**
 * Traduce fuerza
 */
export function tForce(force: string | null): string | null {
  if (!force) return null;
  return FORCE_ES[force] ?? force;
}

/**
 * Traduce categoría
 */
export function tCategory(category: string): string {
  return CATEGORY_ES[category] ?? category;
}
