"use client";

import { Minus, Plus, type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: LucideIcon;
  ariaLabelDecrement: string;
  ariaLabelIncrement: string;
}

export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  unit,
  icon: Icon,
  ariaLabelDecrement,
  ariaLabelIncrement,
}: Props) {
  const dec = () => onChange(Math.max(min, Math.round((value - step) * 100) / 100));
  const inc = () => onChange(Math.min(max, Math.round((value + step) * 100) / 100));
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);

  return (
    <div className="flex flex-col gap-2 bg-surface-container p-3 rounded-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-primary" aria-hidden />}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={dec}
          aria-label={ariaLabelDecrement}
          className="w-11 h-11 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center active:scale-95 shadow-sm transition-transform cursor-pointer"
        >
          <Minus className="w-5 h-5" aria-hidden />
        </button>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-on-surface tabular-nums">
            {formatted}
          </span>
          {unit && <span className="text-xs text-outline">{unit}</span>}
        </div>
        <button
          onClick={inc}
          aria-label={ariaLabelIncrement}
          className="w-11 h-11 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center active:scale-95 shadow-sm transition-transform cursor-pointer"
        >
          <Plus className="w-5 h-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
