"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ExerciseDetail } from "@/components/exercise/ExerciseDetail";
import type { Exercise } from "@/types/exercise";

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const [exercise, setExercise] = useState<Exercise | null | undefined>(undefined);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      const res = await fetch("/exercises.json");
      const data: Exercise[] = await res.json();
      const found = data.find((e) => e.id === id);
      if (!found) {
        notFound();
        return;
      }
      setExercise(found);
    }
    load();
  }, [params]);

  if (exercise === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (exercise === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-xl font-bold mb-2">Ejercicio no encontrado</h1>
        <Link href="/exercises" className="text-primary underline">
          Volver a biblioteca
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-sm">
        <div className="h-14 px-4 flex items-center gap-2">
          <Link
            href="/exercises"
            aria-label="Volver a biblioteca"
            className="w-11 h-11 -ml-2 rounded-full text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-semibold truncate">Detalle Ejercicio</h1>
        </div>
      </header>
      <ExerciseDetail exercise={exercise} />
    </div>
  );
}
