import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WeightChart } from "@/components/progress/WeightChart";
import { WeightLogForm } from "@/components/progress/WeightLogForm";
import { TrendingUp } from "lucide-react";
import { WeightLogger } from "./weight-logger";

export const metadata = { title: "Progreso | FitMe" };

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: logs }] = await Promise.all([
    supabase
      .from("profiles")
      .select("weight_kg, weight_goal_kg")
      .eq("id", user.id)
      .single(),
    supabase
      .from("weight_logs")
      .select("logged_on, weight_kg")
      .eq("user_id", user.id)
      .order("logged_on", { ascending: false })
      .limit(60),
  ]);

  return (
    <div className="flex flex-col gap-6 p-4 pb-32">
      <header>
        <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2 tracking-tight">
          <TrendingUp className="w-6 h-6 text-primary" aria-hidden />
          Tu progreso
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Registra tu peso y mira la tendencia.
        </p>
      </header>

      <WeightLogger currentWeight={profile?.weight_kg} />

      <WeightChart
        logs={logs ?? []}
        goalKg={profile?.weight_goal_kg ?? undefined}
      />
    </div>
  );
}
