// Nombres amigables en español para los ejercicios
// Formato: nombre técnico original → nombre en español + descripción
// "Bench Press" → "Press de Banca"
// "3/4 Sit-Up" → "Sit-up 3/4 (abdominales parciales)"

export interface ExerciseAlias {
  es: string;
  /** Descripción corta de cómo se ve el movimiento */
  description?: string;
}

export const EXERCISE_NAMES_ES: Record<string, ExerciseAlias> = {
  // === PECHO ===
  "barbell bench press": { es: "Press de Banca con Barra", description: "Press plano acostado, baja la barra al pecho medio" },
  "barbell incline bench press": { es: "Press Inclinado con Barra", description: "Press en banco inclinado 30-45°" },
  "barbell decline bench press": { es: "Press Declinado con Barra", description: "Press en banco declinado" },
  "dumbbell bench press": { es: "Press de Banca con Mancuernas", description: "Press plano con mancuernas" },
  "dumbbell incline press": { es: "Press Inclinado con Mancuernas", description: "Press en banco inclinado con mancuernas" },
  "dumbbell flyes": { es: "Aperturas con Mancuernas", description: "Aperturas acostado, abre los brazos en T" },
  "incline dumbbell flyes": { es: "Aperturas Inclinadas", description: "Aperturas en banco inclinado" },
  "cable crossover": { es: "Cruce en Poleas", description: "Jala las poleas al centro del pecho" },
  "cable crossovers": { es: "Cruce en Poleas", description: "Jala las poleas al centro del pecho" },
  "decline dumbbell bench press": { es: "Press Declinado con Mancuernas" },
  "pushups": { es: "Lagartijas (Flexiones)", description: "Flexiones de pecho en el suelo" },
  "push-ups": { es: "Lagartijas (Flexiones)", description: "Flexiones de pecho en el suelo" },
  "chest dip": { es: "Fondos en Paralelas", description: "Fondos inclinando el torso al frente" },
  "pec deck": { es: "Pec Deck (Aperturas en Máquina)" },

  // === ESPALDA ===
  "pullups": { es: "Dominadas", description: "Dominadas con agarre prono" },
  "pull-ups": { es: "Dominadas", description: "Dominadas con agarre prono" },
  "chinups": { es: "Dominadas Supinadas", description: "Dominadas con agarre supino" },
  "lat pulldown": { es: "Jalón al Pecho", description: "Jala la barra al pecho en polea alta" },
  "barbell rows": { es: "Remo con Barra", description: "Remo inclinado con barra" },
  "bent over barbell row": { es: "Remo con Barra", description: "Remo inclinado con barra" },
  "dumbbell row": { es: "Remo con Mancuerna", description: "Remo a un brazo apoyado en banco" },
  "seated cable rows": { es: "Remo en Polea Sentado" },
  "t-bar row": { es: "Remo en T" },
  "face pull": { es: "Face Pull", description: "Jala la cuerda a la cara en polea" },
  "deadlift": { es: "Peso Muerto", description: "Levanta la barra del suelo con piernas y espalda" },

  // === PIERNAS ===
  "barbell squat": { es: "Sentadilla con Barra", description: "Sentadilla profunda con barra en espalda" },
  "barbell full squat": { es: "Sentadilla Completa" },
  "barbell front squat": { es: "Sentadilla Frontal", description: "Barra al frente del cuerpo" },
  "barbell lunge": { es: "Zancada con Barra", description: "Paso largo al frente, rodilla a 90°" },
  "barbell walking lunge": { es: "Zancadas Caminando" },
  "barbell side lunge": { es: "Zancada Lateral" },
  "dumbbell lunge": { es: "Zancada con Mancuernas" },
  "dumbbell squat": { es: "Sentadilla con Mancuernas" },
  "leg press": { es: "Prensa de Piernas", description: "Empuja la plataforma con los pies" },
  "leg extension": { es: "Extensión de Cuádriceps" },
  "leg curl": { es: "Curl Femoral" },
  "romanian deadlift": { es: "Peso Muerto Rumano", description: "Hiperextensión, trabaja isquios" },
  "stiff-legged deadlift": { es: "Peso Muerto Piernas Rígidas" },
  "calf raise": { es: "Elevación de Pantorrillas" },
  "seated calf raise": { es: "Elevación de Pantorrillas Sentado" },
  "hack squat": { es: "Hack Squat" },
  "barbell step ups": { es: "Step-ups con Barra" },
  "sissy squat": { es: "Sentadilla Sissy" },
  "glute kickback": { es: "Patada de Glúteo" },

  // === HOMBROS ===
  "overhead press": { es: "Press Militar", description: "Press de hombros de pie con barra" },
  "barbell shoulder press": { es: "Press de Hombros con Barra" },
  "dumbbell shoulder press": { es: "Press de Hombros con Mancuernas" },
  "seated dumbbell press": { es: "Press de Hombros Sentado" },
  "lateral raise": { es: "Elevaciones Laterales", description: "Eleva los brazos a los lados hasta 90°" },
  "dumbbell lateral raise": { es: "Elevaciones Laterales" },
  "front raise": { es: "Elevaciones Frontales" },
  "dumbbell front raise": { es: "Elevaciones Frontales" },
  "rear delt fly": { es: "Aperturas Posteriores", description: "Aperturas invertidas para deltoides posterior" },
  "bent over lateral raise": { es: "Elevaciones Laterales Inclinadas" },
  "face pulls": { es: "Face Pull" },
  "upright row": { es: "Remo al Mentón" },
  "shrugs": { es: "Encogimientos", description: "Encoge los hombros para trapecios" },
  "barbell shrugs": { es: "Encogimientos con Barra" },
  "dumbbell shrugs": { es: "Encogimientos con Mancuernas" },
  "arnold press": { es: "Press Arnold" },

  // === BÍCEPS ===
  "barbell curl": { es: "Curl con Barra" },
  "dumbbell biceps curl": { es: "Curl con Mancuernas" },
  "biceps curl": { es: "Curl de Bíceps" },
  "hammer curl": { es: "Curl Martillo", description: "Curl con agarre neutro" },
  "dumbbell hammer curl": { es: "Curl Martillo" },
  "preacher curl": { es: "Curl en Banco Scott" },
  "incline dumbbell curl": { es: "Curl Inclinado" },
  "concentration curl": { es: "Curl Concentrado" },
  "cable curl": { es: "Curl en Polea" },
  "ez bar curl": { es: "Curl con Barra Z" },
  "zottman curl": { es: "Curl Zottman" },

  // === TRÍCEPS ===
  "triceps pushdown": { es: "Extensión de Tríceps en Polea" },
  "cable triceps pushdown": { es: "Extensión de Tríceps en Polea" },
  "tricep dips": { es: "Fondos (Tríceps)", description: "Fondos en banco, baja y sube" },
  "close-grip bench press": { es: "Press de Banca Agarre Estrecho" },
  "skullcrusher": { es: "Press Francés", description: "Extensión acostado con barra Z" },
  "lying triceps extension": { es: "Press Francés" },
  "overhead triceps extension": { es: "Extensión de Tríceps por Encima" },
  "tricep dumbbell kickback": { es: "Patada de Tríceps" },
  "diamond push-ups": { es: "Lagartijas Diamante" },

  // === CORE / ABDOMINALES ===
  "crunches": { es: "Crunches", description: "Abdominales parciales acostado" },
  "sit-ups": { es: "Lagartijas Abdominales (Sit-ups)" },
  "3/4 sit-up": { es: "Sit-up 3/4", description: "Abdominales parciales (3/4 del rango)" },
  "hanging leg raise": { es: "Elevación de Piernas Colgado" },
  "leg raise": { es: "Elevación de Piernas" },
  "plank": { es: "Plancha", description: "Mantén posición de plancha" },
  "side plank": { es: "Plancha Lateral" },
  "russian twist": { es: "Giros Rusos" },
  "bicycle crunch": { es: "Crunch en Bicicleta" },
  "mountain climbers": { es: "Mountain Climbers" },
  "ab crunch machine": { es: "Crunch en Máquina" },
  "cable crunch": { es: "Crunch en Polea" },
  "toes to bar": { es: "Pies a la Barra" },
  "wood chop": { es: "Leñador en Polea" },
  "reverse crunch": { es: "Crunch Inverso" },
  "knee raise": { es: "Elevación de Rodillas" },

  // === CARDIO / OTROS ===
  "burpee": { es: "Burpee" },
  "jumping rope": { es: "Saltar Comba" },
  "jump rope": { es: "Saltar Comba" },
  "jumping jacks": { es: "Saltos de Tijera" },
};

/**
 * Devuelve el nombre en español si existe, sino el original
 */
export function tExerciseName(name: string): string {
  const key = name.toLowerCase().trim();
  return EXERCISE_NAMES_ES[key]?.es ?? name;
}

/**
 * Devuelve la descripción corta del ejercicio
 */
export function tExerciseDescription(name: string): string | null {
  const key = name.toLowerCase().trim();
  return EXERCISE_NAMES_ES[key]?.description ?? null;
}

/**
 * Devuelve nombre + descripción si existe
 */
export function tExerciseWithDescription(name: string): { name: string; description: string | null } {
  return {
    name: tExerciseName(name),
    description: tExerciseDescription(name),
  };
}
