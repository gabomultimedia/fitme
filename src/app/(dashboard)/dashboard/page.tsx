import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatTodayEs } from "@/lib/dates";
import { TodayRoutine } from "@/components/dashboard/TodayRoutine";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { BarChart3 } from "lucide-react";
import type { Goal, Level } from "@/lib/exercises/recommender";

export const metadata = { title: "Home | FitMe" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, weight_kg, weight_goal_kg, goal, level, equipment_available")
    .eq("id", user.id)
    .single();

  // Stats del mes
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count: workoutsThisMonth } = await supabase
    .from("workout_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("started_at", monthStart.toISOString());

  // Peso del primer registro del mes (para delta)
  const { data: firstWeightThisMonth } = await supabase
    .from("weight_logs")
    .select("weight_kg")
    .eq("user_id", user.id)
    .gte("logged_on", monthStart.toISOString().slice(0, 10))
    .order("logged_on", { ascending: true })
    .limit(1)
    .single();

  const weightDelta =
    profile?.weight_kg != null && firstWeightThisMonth?.weight_kg != null
      ? Math.round((profile.weight_kg - firstWeightThisMonth.weight_kg) * 10) / 10
      : null;

  // Calcular racha
  const { data: recentSessions } = await supabase
    .from("workout_sessions")
    .select("started_at")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(60);

  const streak = calculateStreak(recentSessions ?? []);

  return (
    <div className="flex flex-col gap-6 p-4 pb-32">
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">
            Hola, {profile?.display_name ?? "atleta"}
          </h1>
          <p className="text-sm text-on-surface-variant capitalize">
            {formatTodayEs()}
          </p>
        </div>
      </div>

      <TodayRoutine
        goal={(profile?.goal as Goal) ?? "both"}
        level={(profile?.level as Level) ?? "beginner"}
        equipment={(profile?.equipment_available as string[]) ?? []}
      />

      <section>
        <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5" aria-hidden /> Tu progreso
        </h2>
        <StatsGrid
          workoutsThisMonth={workoutsThisMonth ?? 0}
          streak={streak}
          weightKg={profile?.weight_kg ?? null}
          weightDelta={weightDelta}
        />
      </section>
    </div>
  );
}

function calculateStreak(
  sessions: Array<{ started_at: string }>
): number {
  if (sessions.length === 0) return 0;

  // Días únicos con sesión (en horario local)
  const days = new Set<string>();
  for (const s of sessions) {
    const d = new Date(s.started_at);
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // Si hoy no entrenó, empezar desde ayer
  const todayKey = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
  if (!days.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (days.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
