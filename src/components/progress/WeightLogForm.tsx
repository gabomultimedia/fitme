"use client";

import { useState } from "react";
import { Scale, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  currentWeight?: number | null | undefined;
  onLogged: () => void;
}

export function WeightLogForm({ currentWeight, onLogged }: Props) {
  const [weight, setWeight] = useState<string>(currentWeight?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w || w < 20 || w > 300) return;
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    // 1) Insertar log
    await supabase.from("weight_logs").insert({
      user_id: user.id,
      weight_kg: w,
      logged_on: new Date().toISOString().slice(0, 10),
    });
    // 2) Actualizar profile.weight_kg (cache)
    await supabase
      .from("profiles")
      .update({ weight_kg: w })
      .eq("id", user.id);

    setSaving(false);
    setSaved(true);
    onLogged();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-end gap-3"
    >
      <label className="flex-1 flex flex-col gap-1.5">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Peso de hoy
        </span>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="min-h-[48px] px-4 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-2xl font-bold tabular-nums w-full"
            placeholder="85.0"
            inputMode="decimal"
            required
          />
          <span className="text-sm text-outline font-semibold">kg</span>
        </div>
      </label>
      <button
        type="submit"
        disabled={saving || !weight}
        className="min-h-[48px] px-6 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 active:scale-[0.98] transition-transform cursor-pointer disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : saved ? (
          <Check className="w-5 h-5" />
        ) : (
          <Scale className="w-5 h-5" />
        )}
        {saved ? "Listo" : "Registrar"}
      </button>
    </form>
  );
}
