"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface Props {
  hasUnsavedChanges: boolean;
  redirectTo?: string;
}

export function SessionCloseGuard({ hasUnsavedChanges, redirectTo = "/dashboard" }: Props) {
  const router = useRouter();

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  function handleClose() {
    if (!hasUnsavedChanges) {
      router.push(redirectTo);
      return;
    }
    const confirmed = window.confirm(
      "Tienes series sin guardar. ¿Seguro que quieres salir? Perderás el progreso actual."
    );
    if (confirmed) router.push(redirectTo);
  }

  return (
    <button
      onClick={handleClose}
      aria-label="Cerrar sesión de entrenamiento"
      className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
    >
      <X className="w-5 h-5" aria-hidden />
    </button>
  );
}
