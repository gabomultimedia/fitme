"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Dumbbell, Play, Pause } from "lucide-react";
import type { Exercise } from "@/types/exercise";
import { cn } from "@/lib/utils";

const FEDB_IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

interface Props {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: Props) {
  // Detectar si es GIF (ExerciseDB API) o JPG (Free Exercise DB)
  const imgPath = exercise.images[0];
  const isGif = imgPath.endsWith(".gif") || imgPath.startsWith("http") && !imgPath.includes("raw.githubusercontent");

  // Si es del Free Exercise DB local, construir URL
  const imageUrl = isGif
    ? imgPath
    : `${FEDB_IMAGE_BASE}/${imgPath}`;

  const [playing, setPlaying] = useState(isGif); // GIFs se animan automáticamente
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="group block rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="relative aspect-square bg-surface-container">
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-surface-container animate-pulse" />
        )}

        {isGif && playing ? (
          // GIF animado
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`Demostración animada de ${exercise.name}`}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setLoaded(true)}
            loading="lazy"
          />
        ) : isGif ? (
          // GIF pausado (mostrar primer frame)
          <Image
            src={imageUrl}
            alt={`Demostración de ${exercise.name}`}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            loading="lazy"
            unoptimized
            className={cn(
              "object-cover transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          // JPG estático (Free Exercise DB)
          <Image
            src={imageUrl}
            alt={`Demostración de ${exercise.name}`}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            loading="lazy"
            className={cn(
              "object-cover transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setLoaded(true)}
          />
        )}

        {/* Músculo badge (esquina superior derecha) */}
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wide text-on-surface">
          {exercise.primaryMuscles[0] || "Fuerza"}
        </span>

        {/* Play/Pause button para GIFs */}
        {isGif && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setPlaying(!playing);
            }}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-inverse-surface/80 backdrop-blur-sm text-inverse-on-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {playing ? (
              <Pause className="w-3.5 h-3.5" aria-hidden />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" aria-hidden />
            )}
          </button>
        )}
      </div>

      <div className="p-2.5 flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold text-on-surface line-clamp-1">
          {exercise.name}
        </h3>
        <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
          <Dumbbell className="w-3 h-3 shrink-0" aria-hidden />
          <span className="capitalize truncate">
            {exercise.equipment.replace(/_/g, " ")}
          </span>
        </div>
      </div>
    </Link>
  );
}
