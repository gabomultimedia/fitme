import { CalendarDays, Flame, Weight } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface Props {
  workoutsThisMonth: number;
  streak: number;
  weightKg: number | null;
  weightDelta: number | null;
}

export function StatsGrid({ workoutsThisMonth, streak, weightKg, weightDelta }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatsCard
        icon={CalendarDays}
        iconBg="bg-primary-fixed"
        iconColor="text-primary"
        value={workoutsThisMonth}
        label="workouts este mes"
      />
      <StatsCard
        icon={Flame}
        iconBg="bg-secondary-fixed"
        iconColor="text-secondary"
        value={streak}
        unit={streak === 1 ? "día" : "días"}
        label="racha activa"
      />
      <StatsCard
        icon={Weight}
        iconBg="bg-tertiary-fixed"
        iconColor="text-tertiary"
        value={weightKg ?? "—"}
        unit={weightKg ? "kg" : undefined}
        label="peso actual"
        trend={
          weightDelta !== null
            ? {
                value: `${weightDelta > 0 ? "+" : ""}${weightDelta} kg este mes`,
                tone: weightDelta < 0 ? "good" : weightDelta > 0 ? "neutral" : "neutral",
              }
            : undefined
        }
      />
    </div>
  );
}
