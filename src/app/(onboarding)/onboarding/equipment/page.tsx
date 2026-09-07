"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { EquipmentSelector } from "@/components/equipment/EquipmentSelector";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function EquipmentOnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      // Cargar selección existente si hay
      const { data: profile } = await supabase
        .from("profiles")
        .select("equipment_available")
        .eq("id", u.id)
        .single();
      if (profile?.equipment_available) {
        setSelected(profile.equipment_available);
      }
      setLoading(false);
    });
  }, [router]);

  async function handleSave() {
    if (!user || selected.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      // 1) Asegurar que el profile exista
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existing) {
        // Crear profile inicial (cast a any para evitar strictness con campos null)
        const { error: insertErr } = await supabase.from("profiles").insert({
          id: user.id,
          display_name: user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "Usuario",
          goal: "both",
          level: "beginner",
          equipment_available: selected,
        } as never);
        if (insertErr) {
          setError(insertErr.message);
          setSaving(false);
          return;
        }
      } else {
        // Solo actualizar equipos
        const { error: updateErr } = await supabase
          .from("profiles")
          .update({ equipment_available: selected })
          .eq("id", user.id);
        if (updateErr) {
          setError(updateErr.message);
          setSaving(false);
          return;
        }
      }
      router.push("/dashboard");
    } catch (err) {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-sm">
        <div className="h-14 px-4 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            aria-label="Volver"
            className="w-11 h-11 -ml-2 rounded-full text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold">Equipos</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-4 pb-32">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Equipos de tu gimnasio</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Selecciona los que tienes disponibles. Solo verás ejercicios que puedas hacer.
          </p>
        </div>

        <EquipmentSelector selected={selected} onChange={setSelected} maxColumns={3} />

        <p className="text-sm text-on-surface-variant text-center">
          {selected.length} {selected.length === 1 ? "seleccionado" : "seleccionados"}
        </p>

        {error && (
          <p role="alert" className="text-sm text-error text-center">
            {error}
          </p>
        )}
      </main>

      <div className="fixed bottom-0 inset-x-0 p-4 pb-safe bg-surface/95 backdrop-blur-xl border-t border-outline-variant">
        <button
          onClick={handleSave}
          disabled={selected.length === 0 || saving}
          className="w-full min-h-[48px] bg-primary text-on-primary font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer disabled:opacity-40"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {saving ? "Guardando..." : "Continuar"}
        </button>
      </div>
    </div>
  );
}
