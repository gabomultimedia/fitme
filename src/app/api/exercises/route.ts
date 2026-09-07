import { NextResponse } from "next/server";
import rawExercises from "@/data/exercises.json";
import { normalizeEquipment } from "@/types/exercise";

// Carga on-demand del JSON estático (cached en memoria)
let _cache: ReturnType<typeof normalize> | null = null;

function normalize() {
  return (rawExercises as Array<{
    id: string;
    name: string;
    force: string | null;
    level: "beginner" | "intermediate" | "advanced";
    mechanic: string | null;
    equipment: string;
    primaryMuscles: string[];
    secondaryMuscles: string[];
    instructions: string[];
    category: string;
    images: [string, string];
  }>).map((ex) => ({
    id: ex.id,
    name: ex.name,
    force: ex.force,
    level: ex.level,
    mechanic: ex.mechanic,
    equipment: normalizeEquipment(ex.equipment),
    primaryMuscles: ex.primaryMuscles,
    secondaryMuscles: ex.secondaryMuscles,
    instructions: ex.instructions,
    category: ex.category,
    images: ex.images,
  }));
}

export async function GET() {
  if (!_cache) _cache = normalize();
  return NextResponse.json(_cache, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
