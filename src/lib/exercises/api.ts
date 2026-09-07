// Data loader con 2 fuentes:
// 1. ExerciseDB API (preferida) — GIFs animados + videos + body parts
//    Requiere NEXT_PUBLIC_EXERCISEDB_API_KEY (RapidAPI)
//    URL: https://exercisedb.p.rapidapi.com
// 2. Free Exercise DB (fallback) — JSON estático local, JPGs

import rawExercises from "@/data/exercises.json";
import { normalizeEquipment, type Exercise } from "@/types/exercise";

const API_KEY = process.env.NEXT_PUBLIC_EXERCISEDB_API_KEY;
const API_HOST = process.env.NEXT_PUBLIC_EXERCISEDB_API_HOST || "exercisedb.p.rapidapi.com";
const API_BASE = `https://${API_HOST}`;

interface ApiExercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export type DataSource = "exercisedb-api" | "local-fallback";

let _apiCache: { exercises: ApiExercise[]; source: DataSource } | null = null;

export function isApiConfigured(): boolean {
  return Boolean(API_KEY);
}

export async function loadExercises(): Promise<{
  exercises: Exercise[];
  source: DataSource;
}> {
  if (!API_KEY) {
    return { exercises: loadLocalExercises(), source: "local-fallback" };
  }

  if (_apiCache) {
    return { exercises: mapApiToLocal(_apiCache.exercises), source: _apiCache.source };
  }

  try {
    const res = await fetch(`${API_BASE}/exercises?limit=200`, {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
      // Cache 1h en Vercel
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[exercises] ExerciseDB API ${res.status}, fallback to local`);
      return { exercises: loadLocalExercises(), source: "local-fallback" };
    }

    const apiExercises: ApiExercise[] = await res.json();
    _apiCache = { exercises: apiExercises, source: "exercisedb-api" };
    return { exercises: mapApiToLocal(apiExercises), source: "exercisedb-api" };
  } catch (err) {
    console.warn("[exercises] ExerciseDB API failed, fallback to local:", err);
    return { exercises: loadLocalExercises(), source: "local-fallback" };
  }
}

function loadLocalExercises(): Exercise[] {
  return (rawExercises as Array<Omit<Exercise, "equipment"> & { equipment: string }>).map(
    (ex) => ({ ...ex, equipment: normalizeEquipment(ex.equipment) })
  );
}

function mapApiToLocal(api: ApiExercise[]): Exercise[] {
  return api.map((ex) => ({
    id: ex.id,
    name: ex.name,
    force: null,
    level: "intermediate",
    mechanic: null,
    equipment: normalizeEquipment(ex.equipment),
    primaryMuscles: ex.target ? [ex.target.toLowerCase()] : [],
    secondaryMuscles: (ex.secondaryMuscles || []).map((m) => m.toLowerCase()),
    instructions: ex.instructions || [],
    category: ex.bodyPart?.toLowerCase() || "strength",
    images: [ex.gifUrl, ex.gifUrl], // API usa un solo GIF, lo duplicamos
  }));
}
