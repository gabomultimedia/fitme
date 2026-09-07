"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UseRestTimerOptions {
  initialSeconds: number;
  onComplete?: () => void;
}

export interface UseRestTimerReturn {
  remainingSeconds: number;
  isComplete: boolean;
  addTime: (seconds: number) => void;
  reset: (seconds: number) => void;
}

/**
 * Hook para el timer de descanso entre series.
 *
 * FIX UX #3: usa timestamp + Page Visibility API en vez de setInterval naive
 * para evitar drift al cambiar de pestaña. Re-sincroniza cada 250ms calculando
 * elapsed desde el timestamp inicial.
 */
export function useRestTimer({
  initialSeconds,
  onComplete,
}: UseRestTimerOptions): UseRestTimerReturn {
  const [remainingSeconds, setRemaining] = useState(initialSeconds);
  const [isComplete, setComplete] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const totalSeconds = useRef<number>(initialSeconds);
  const completedRef = useRef<boolean>(false);

  const tick = useCallback(() => {
    const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
    const remaining = Math.max(0, totalSeconds.current - elapsed);
    setRemaining(remaining);
    if (remaining === 0 && !completedRef.current) {
      completedRef.current = true;
      setComplete(true);
      onComplete?.();
    }
  }, [onComplete]);

  useEffect(() => {
    const id = setInterval(tick, 250);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") tick();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tick]);

  const addTime = useCallback((seconds: number) => {
    totalSeconds.current += seconds;
    setRemaining((prev) => prev + seconds);
    completedRef.current = false;
    setComplete(false);
  }, []);

  const reset = useCallback((seconds: number) => {
    startedAt.current = Date.now();
    totalSeconds.current = seconds;
    setRemaining(seconds);
    setComplete(false);
    completedRef.current = false;
  }, []);

  return { remainingSeconds, isComplete, addTime, reset };
}
