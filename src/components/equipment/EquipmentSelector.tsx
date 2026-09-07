"use client";

import { Check, type LucideIcon } from "lucide-react";
import { EQUIPMENT_CATALOG, type EquipmentOption } from "@/lib/equipment/catalog";

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
  maxColumns?: 2 | 3 | 4;
}

export function EquipmentSelector({ selected, onChange, maxColumns = 3 }: Props) {
  function toggle(id: string) {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  }

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[maxColumns];

  return (
    <div className={`grid ${gridClass} gap-3`}>
      {EQUIPMENT_CATALOG.map((eq) => (
        <EquipmentButton
          key={eq.id}
          option={eq}
          selected={selected.includes(eq.id)}
          onToggle={() => toggle(eq.id)}
        />
      ))}
    </div>
  );
}

function EquipmentButton({
  option,
  selected,
  onToggle,
}: {
  option: EquipmentOption;
  selected: boolean;
  onToggle: () => void;
}) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={`${selected ? "Quitar" : "Agregar"} ${option.label}`}
      className={`
        relative min-h-[88px] min-w-[88px] p-3 rounded-xl flex flex-col items-center justify-center gap-1
        transition-all active:scale-95 cursor-pointer
        ${
          selected
            ? "bg-primary text-on-primary shadow-md"
            : "bg-surface-container-lowest text-on-surface border border-outline-variant hover:border-primary"
        }
      `}
    >
      <Icon className="w-7 h-7" aria-hidden />
      <span className="text-xs font-semibold leading-tight text-center">
        {option.shortLabel}
      </span>
      {selected && (
        <Check
          className="w-4 h-4 absolute top-1 right-1"
          aria-hidden
        />
      )}
    </button>
  );
}
