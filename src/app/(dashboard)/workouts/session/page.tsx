"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Flame,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Timer as TimerIcon,
} from "lucide-react";
import { RestTimer } from "@/components/session/RestTimer";
import { RepsStepper } from "@/components/session/RepsStepper";
import { WeightStepper } from "@/components/session/WeightStepper";
import { SessionCloseGuard } from "@/components/session/SessionCloseGuard";
import { SetHistoryTable, type SetLog } from "@/components/session/SetHistoryTable";

const MOCK_SETS: SetLog[] = [
  { number: 1, reps: 12, weight: 25, rpe: 7, status: "done" },
  { number: 2, reps: 10, weight: 25, rpe: 6, status: "done" },
  { number: 3, reps: 10, weight: 25, rpe: 5, status: "active" },
];

const SESSION_START = Date.now();

function formatSessionTime(): string {
  const elapsed = Math.floor((Date.now() - SESSION_START) / 1000);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SessionPage() {
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(25);
  const [hasUnsaved, setHasUnsaved] = useState(true);
  const [sessionTime, setSessionTime] = useState("00:00");
  const [restActive, setRestActive] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setSessionTime(formatSessionTime()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setHasUnsaved(true);
  }, [reps, weight]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-sm">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              aria-label="Volver"
              onClick={() => history.back()}
              className="w-11 h-11 -ml-2 rounded-full text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden />
            </button>
            <h1 className="text-base font-semibold truncate">Nuevo Entrenamiento</h1>
          </div>
          <SessionCloseGuard hasUnsavedChanges={hasUnsaved} />
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-4 p-4 pb-32">
        {/* Sesión header + progreso */}
        <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                Sesión Activa
              </p>
              <h2 className="text-2xl font-semibold text-on-surface">Pecho + Tríceps</h2>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full">
              <TimerIcon className="w-4 h-4 text-primary" aria-hidden />
              <span className="text-sm font-semibold text-primary tabular-nums">
                {sessionTime}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>3/6 Ejercicios completados</span>
              <span className="text-primary font-semibold tabular-nums">50%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: "50%" }}
              />
            </div>
          </div>
        </section>

        {/* Ejercicio activo */}
        <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              Ejercicio 4 de 6
            </p>
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2 mt-1">
              <Flame className="w-6 h-6 text-secondary" aria-hidden />
              Cable Crossover
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                Cable
              </span>
              <span className="px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold">
                Pecho
              </span>
              <span className="px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold">
                Intermedio
              </span>
            </div>
          </div>

          <SetHistoryTable sets={MOCK_SETS} />

          <div className="grid grid-cols-2 gap-3">
            <RepsStepper value={reps} onChange={setReps} />
            <WeightStepper value={weight} onChange={setWeight} />
          </div>
        </section>

        {/* Rest timer */}
        {restActive && <RestTimer initialSeconds={90} targetSeconds={90} />}

        {/* CTA principal */}
        <button
          className="w-full min-h-[56px] bg-tertiary-container text-on-tertiary-container text-lg font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
          onClick={() => {
            setHasUnsaved(false);
            setRestActive(true);
          }}
        >
          <CheckCircle2 className="w-6 h-6 fill-current" aria-hidden />
          Completar serie
        </button>

        {/* Navegación entre ejercicios */}
        <nav
          aria-label="Navegación entre ejercicios"
          className="grid grid-cols-2 gap-3"
        >
          <button className="min-h-[48px] rounded-lg bg-surface-container text-on-surface font-semibold flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
            <ChevronLeft className="w-5 h-5" aria-hidden />
            Anterior
          </button>
          <button className="min-h-[48px] rounded-lg bg-surface-container-high text-on-surface font-semibold flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
            Siguiente
            <ChevronRight className="w-5 h-5" aria-hidden />
          </button>
        </nav>
      </main>
    </div>
  );
}
