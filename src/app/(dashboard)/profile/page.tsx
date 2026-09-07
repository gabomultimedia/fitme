import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { User, Scale, Wrench, LogOut, Target, Activity } from "lucide-react";
import { SignOutButton } from "./signout-button";
import { formatTodayEs } from "@/lib/dates";
import { EQUIPMENT_CATALOG } from "@/lib/equipment/catalog";
import Link from "next/link";

export const metadata = { title: "Perfil | FitMe" };

const GOAL_LABELS = {
  weight_loss: "Pérdida de peso",
  muscle_gain: "Ganancia muscular",
  both: "Ambos",
} as const;

const LEVEL_LABELS = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
} as const;

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userEquipment = (profile?.equipment_available ?? []) as string[];
  const equipmentLabels = EQUIPMENT_CATALOG
    .filter((eq) => userEquipment.includes(eq.id))
    .map((eq) => eq.label);

  return (
    <div className="flex flex-col gap-6 p-4 pb-32">
      <header className="flex flex-col items-center text-center pt-4">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-on-primary" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{profile?.display_name ?? "Atleta"}</h1>
        <p className="text-sm text-on-surface-variant">{user.email}</p>
        <p className="text-xs text-outline mt-1 capitalize">{formatTodayEs()}</p>
      </header>

      {/* Stats card */}
      <section className="grid grid-cols-2 gap-2">
        <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4 text-primary" aria-hidden />
            <span className="text-xs font-bold text-outline uppercase">Peso</span>
          </div>
          <p className="text-2xl font-bold tabular-nums">
            {profile?.weight_kg ?? "—"}{" "}
            {profile?.weight_kg && <span className="text-sm text-outline">kg</span>}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-secondary" aria-hidden />
            <span className="text-xs font-bold text-outline uppercase">Meta</span>
          </div>
          <p className="text-sm font-semibold">
            {profile?.goal ? GOAL_LABELS[profile.goal] : "—"}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-tertiary" aria-hidden />
            <span className="text-xs font-bold text-outline uppercase">Nivel</span>
          </div>
          <p className="text-sm font-semibold">
            {profile?.level ? LEVEL_LABELS[profile.level] : "—"}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4 text-primary" aria-hidden />
            <span className="text-xs font-bold text-outline uppercase">Peso meta</span>
          </div>
          <p className="text-2xl font-bold tabular-nums">
            {profile?.weight_goal_kg ?? "—"}{" "}
            {profile?.weight_goal_kg && <span className="text-sm text-outline">kg</span>}
          </p>
        </div>
      </section>

      {/* Equipos */}
      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" aria-hidden />
            Equipos de tu gimnasio
          </h2>
          <Link
            href="/onboarding/equipment"
            className="text-sm font-medium text-primary underline"
          >
            Editar
          </Link>
        </div>
        {equipmentLabels.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            Aún no has configurado tus equipos.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {equipmentLabels.map((label) => (
              <span
                key={label}
                className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Acciones */}
      <section className="flex flex-col gap-2">
        <Link
          href="/onboarding/equipment"
          className="w-full min-h-[48px] bg-surface-container-lowest border border-outline-variant rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
        >
          <Wrench className="w-5 h-5" aria-hidden />
          Editar equipos
        </Link>

        <SignOutButton />
      </section>

      <p className="text-center text-xs text-outline">FitMe v2.1 · 1 app, 2 usuarios</p>
    </div>
  );
}
