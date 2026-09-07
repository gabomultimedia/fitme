"use client";

import { NumberStepper } from "./NumberStepper";
import { Repeat } from "lucide-react";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function RepsStepper({ value, onChange }: Props) {
  return (
    <NumberStepper
      label="Repeticiones"
      value={value}
      onChange={onChange}
      min={1}
      max={50}
      step={1}
      icon={Repeat}
      ariaLabelDecrement="Restar repetición"
      ariaLabelIncrement="Sumar repetición"
    />
  );
}
