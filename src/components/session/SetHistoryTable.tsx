"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SetLog {
  number: number;
  reps: number;
  weight: number;
  rpe: number;
  status: "done" | "active" | "pending";
}

const RPE_DOTS: Record<number, string> = {
  1: "○",
  2: "○○",
  3: "●○○",
  4: "●●○○",
  5: "●●●○○",
  6: "●●●●○",
  7: "●●●●●",
  8: "●●●●●○",
  9: "●●●●●●",
  10: "●●●●●●●",
};

export function SetHistoryTable({ sets }: { sets: SetLog[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-bold text-outline uppercase tracking-wider px-2">
        <span className="w-16">Serie</span>
        <span className="w-12 text-center">Esfuerzo</span>
        <span className="flex-1 text-right">Carga</span>
        <span className="w-20 text-right">Estado</span>
      </div>
      {sets.map((set) => (
        <div
          key={set.number}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg transition-colors",
            set.status === "active" &&
              "bg-primary-fixed text-on-primary-fixed shadow-sm",
            set.status === "done" && "bg-surface-container-low",
            set.status === "pending" && "bg-surface-container opacity-60"
          )}
        >
          <div className="flex items-center gap-2 w-16">
            <span
              className={cn(
                "w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center",
                set.status === "done" &&
                  "bg-tertiary-container text-on-tertiary-container",
                set.status === "active" &&
                  "bg-primary text-on-primary animate-pulse",
                set.status === "pending" && "bg-surface-container-high"
              )}
            >
              {set.number}
            </span>
            <span className="text-sm font-medium">S{set.number}</span>
          </div>
          <div
            className={cn(
              "w-12 text-center text-sm tabular-nums",
              set.status === "active" ? "text-primary" : "text-tertiary"
            )}
            aria-label={`RPE ${set.rpe} de 10`}
          >
            {RPE_DOTS[set.rpe]}
          </div>
          <span className="flex-1 text-right text-sm font-semibold tabular-nums">
            {set.reps} × {set.weight}kg
          </span>
          <span className="w-20 text-right text-xs flex items-center justify-end gap-1">
            {set.status === "done" && (
              <>
                <Check className="w-4 h-4 text-tertiary" aria-hidden />
                Hecha
              </>
            )}
            {set.status === "active" && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary uppercase tracking-wider text-[10px] font-bold">
                Actual
              </span>
            )}
            {set.status === "pending" && <span className="text-outline">—</span>}
          </span>
        </div>
      ))}
    </div>
  );
}
