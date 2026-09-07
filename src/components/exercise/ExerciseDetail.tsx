"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Lightbulb,
  Plus,
  Flame,
  Activity,
  Wrench,
  Award,
  Play,
  ListOrdered,
} from "lucide-react";
import type { Exercise } from "@/types/exercise";
import { tMuscle, tEquipment, tLevel, tMechanic, tForce } from "@/lib/i18n/exercise-es";
import { cn } from "@/lib/utils";

const FEDB_IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

interface Props {
  exercise: Exercise;
}

export function ExerciseDetail({ exercise }: Props) {
  const [favorited, setFavorited] = useState(false);
  const youtubeQuery = encodeURIComponent(
    `${exercise.name} técnica correcta español`
  );

  const imagePath = `${FEDB_IMAGE_BASE}/${exercise.images[0]}`;

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Hero image */}
      <div className="relative w-full px-4 pt-3 pb-2">
        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-md bg-surface-container-high">
          <Image
            src={imagePath}
            alt={`Demostración de ${exercise.name}`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary text-xs font-bold uppercase shadow-sm flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" aria-hidden />
              {tMechanic(exercise.mechanic)}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary-fixed" aria-hidden />
              <span className="text-sm font-medium text-surface-bright">Verificado</span>
            </div>
            <button
              onClick={() => setFavorited(!favorited)}
              aria-label="Guardar ejercicio"
              className="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
            >
              <Bookmark
                className={cn(
                  "w-5 h-5",
                  favorited ? "fill-primary text-primary" : "text-secondary"
                )}
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-5">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight flex items-center gap-2">
          <Flame className="w-6 h-6 text-secondary" aria-hidden />
          {exercise.name}
        </h1>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {exercise.primaryMuscles.slice(0, 2).map((m) => (
            <span
              key={m}
              className="px-3 py-1.5 rounded-full bg-error-container text-on-error-container text-xs font-bold capitalize flex items-center gap-1.5 shadow-sm"
            >
              <Activity className="w-3.5 h-3.5" aria-hidden />
              {tMuscle(m)}
            </span>
          ))}
          <span className="px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" aria-hidden />
            {tEquipment(exercise.equipment)}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold capitalize flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" aria-hidden />
            {tLevel(exercise.level)}
          </span>
        </div>

        {/* Video tutorial card */}
        <div className="rounded-xl p-4 bg-surface-container-lowest shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" aria-hidden />
              <h2 className="text-lg font-semibold text-on-surface">Video tutorial</h2>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
              YouTube
            </span>
          </div>
          <a
            href={`https://www.youtube.com/results?search_query=${youtubeQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full aspect-video rounded-lg overflow-hidden bg-surface-container-high group"
          >
            <Image
              src={imagePath}
              alt={`Miniatura video ${exercise.name}`}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-inverse-surface/40 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 ml-1 fill-current" aria-hidden />
              </div>
            </div>
          </a>
        </div>

        {/* Stats bento */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-low rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-outline uppercase">Reps</p>
            <p className="text-xl font-bold text-on-surface tabular-nums">6-10</p>
            <p className="text-xs text-on-surface-variant">por serie</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-outline uppercase">Descanso</p>
            <p className="text-xl font-bold text-on-surface tabular-nums">90s</p>
            <p className="text-xs text-on-surface-variant">entre series</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-outline uppercase">Esfuerzo</p>
            <p className="text-xl font-bold text-secondary tabular-nums">8.0</p>
            <p className="text-xs text-on-surface-variant">RPE sugerido</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-xl p-4 bg-surface-container-lowest shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-on-surface" aria-hidden />
              <h3 className="text-lg font-semibold text-on-surface">Instrucciones</h3>
            </div>
            <span className="text-xs font-bold text-outline uppercase">
              {exercise.instructions.length} pasos
            </span>
          </div>
          <ol className="flex flex-col gap-3 list-none p-0">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed font-bold flex items-center justify-center shrink-0 mt-0.5 text-base tabular-nums">
                  {i + 1}
                </span>
                <p className="text-base text-on-surface leading-6">{step}</p>
              </li>
            ))}
          </ol>
          <p className="text-xs text-on-surface-variant italic">
            📝 Instrucciones en inglés (de la fuente original). El video tutorial tiene versiones en español.
          </p>
        </div>

        {/* Pro tip */}
        <div className="bg-secondary-fixed/50 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Lightbulb className="w-6 h-6 text-secondary shrink-0 mt-0.5" aria-hidden />
          <div>
            <h4 className="text-base font-semibold text-on-secondary-fixed">
              Consejo de seguridad
            </h4>
            <p className="text-sm text-on-secondary-fixed-variant mt-1 leading-normal">
              Usa topes de barra o un compañero cuando pruebes nuevos pesos máximos (PR) para evitar
              lesiones en la última repetición.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA dock */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl px-4 py-3 pb-safe shadow-lg flex items-center justify-center">
        <button className="w-full max-w-md min-h-[48px] bg-primary text-on-primary rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer">
          <Plus className="w-5 h-5" aria-hidden />
          Agregar a mi rutina
        </button>
      </div>
    </div>
  );
}
