import Image from "next/image";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import type { Exercise } from "@/types/exercise";

const FEDB_IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  // Las imágenes son: images[0] = "Bench_Press/0.jpg"
  // Construimos: BASE + "/" + images[0]
  const imgPath = `${FEDB_IMAGE_BASE}/${exercise.images[0]}`;

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="block rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative aspect-[3/2] bg-surface-container">
        <Image
          src={imgPath}
          alt={`Demostración de ${exercise.name}`}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          loading="lazy"
          className="object-cover"
        />
      </div>
      <div className="p-3 flex flex-col gap-1">
        <h3 className="text-base font-semibold text-on-surface line-clamp-1">
          {exercise.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <Dumbbell className="w-3.5 h-3.5" aria-hidden />
          <span className="capitalize">{exercise.equipment.replace(/_/g, " ")}</span>
          <span aria-hidden>·</span>
          <span className="capitalize">{exercise.primaryMuscles[0]}</span>
        </div>
      </div>
    </Link>
  );
}
