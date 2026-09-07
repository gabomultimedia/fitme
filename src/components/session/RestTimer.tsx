"use client";

import { Plus, Hourglass } from "lucide-react";
import { useRestTimer } from "@/lib/session/use-rest-timer";

interface Props {
  initialSeconds: number;
  targetSeconds?: number;
}

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function RestTimer({ initialSeconds, targetSeconds = 90 }: Props) {
  const { remainingSeconds, addTime } = useRestTimer({ initialSeconds });

  const progress = Math.max(0, Math.min(1, remainingSeconds / targetSeconds));
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="rounded-xl p-4 bg-surface-container-lowest shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56" aria-hidden>
            <circle
              cx="28"
              cy="28"
              r={RADIUS}
              fill="transparent"
              strokeWidth="4"
              className="stroke-surface-container-high"
            />
            <circle
              data-testid="progress-ring"
              cx="28"
              cy="28"
              r={RADIUS}
              fill="transparent"
              strokeWidth="4"
              strokeLinecap="round"
              className="stroke-secondary transition-all duration-300"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <Hourglass className="w-5 h-5 text-secondary absolute" aria-hidden />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Descanso entre series
          </span>
          <div className="flex items-baseline gap-2">
            <span
              data-testid="rest-timer-countdown"
              className="text-2xl font-semibold text-on-surface tabular-nums"
            >
              {formatTime(remainingSeconds)}
            </span>
            <span className="text-sm text-outline">Meta: {targetSeconds}s</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => addTime(30)}
        aria-label="Agregar 30 segundos al descanso"
        className="min-h-[44px] min-w-[44px] px-3 rounded-lg bg-surface-container text-on-surface-variant text-sm font-medium flex items-center gap-1 active:scale-95 hover:bg-surface-container-high transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" aria-hidden />
        30s
      </button>
    </div>
  );
}
