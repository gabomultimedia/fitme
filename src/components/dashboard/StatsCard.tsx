import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  value: string | number;
  unit?: string;
  label: string;
  trend?: { value: string; tone: "good" | "bad" | "neutral" };
}

const TONE_CLASSES = {
  good: "text-tertiary",
  bad: "text-error",
  neutral: "text-secondary",
} as const;

export function StatsCard({ icon: Icon, iconBg, iconColor, value, unit, label, trend }: Props) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between min-h-[112px]">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center ${iconColor} mb-2`}>
        <Icon className="w-4 h-4" aria-hidden />
      </div>
      <div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-3xl font-bold text-on-surface leading-none tabular-nums">
            {value}
          </span>
          {unit && <span className="text-xs text-on-surface-variant">{unit}</span>}
        </div>
        <p className="text-xs text-on-surface-variant mt-1 leading-tight">{label}</p>
        {trend && (
          <p className={`text-xs font-semibold mt-1 ${TONE_CLASSES[trend.tone]}`}>
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
