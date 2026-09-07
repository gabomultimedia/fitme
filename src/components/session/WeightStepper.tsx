"use client";

import { NumberStepper } from "./NumberStepper";
import { Dumbbell } from "lucide-react";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function WeightStepper({ value, onChange }: Props) {
  return (
    <NumberStepper
      label="Peso Total"
      value={value}
      onChange={onChange}
      min={0}
      max={500}
      step={2.5}
      unit="kg"
      icon={Dumbbell}
      ariaLabelDecrement="Restar peso"
      ariaLabelIncrement="Sumar peso"
    />
  );
}
