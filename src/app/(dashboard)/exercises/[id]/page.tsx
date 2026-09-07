import { notFound } from "next/navigation";
import { getExerciseById } from "@/lib/exercises/data";
import { ExerciseDetail } from "@/components/exercise/ExerciseDetail";

export async function generateStaticParams() {
  // Para producción: solo generar params para los ejercicios
  // Por ahora lo dejamos dinámico (Next 16 + 800+ ejercicios)
  return [];
}

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = getExerciseById(id);
  if (!exercise) notFound();
  return <ExerciseDetail exercise={exercise} />;
}
