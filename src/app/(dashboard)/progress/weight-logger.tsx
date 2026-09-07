"use client";

import { useRouter } from "next/navigation";
import { WeightLogForm } from "@/components/progress/WeightLogForm";

export function WeightLogger({ currentWeight }: { currentWeight: number | null | undefined }) {
  const router = useRouter();
  return (
    <WeightLogForm
      currentWeight={currentWeight}
      onLogged={() => router.refresh()}
    />
  );
}
