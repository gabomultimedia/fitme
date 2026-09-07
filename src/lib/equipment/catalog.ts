import {
  Dumbbell,
  Weight,
  Cable,
  Settings,
  PersonStanding,
  Bell,
  ArrowUp,
  CircleDot,
  Square,
  Cable as Rope,
  Activity,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface EquipmentOption {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  category: "free_weights" | "machines" | "bodyweight" | "accessories";
}

export const EQUIPMENT_CATALOG: EquipmentOption[] = [
  { id: "barbell", label: "Barra", shortLabel: "Barra", icon: Weight, category: "free_weights" },
  { id: "dumbbell", label: "Mancuernas", shortLabel: "Mancu", icon: Dumbbell, category: "free_weights" },
  { id: "kettlebells", label: "Kettlebell", shortLabel: "Kettle", icon: Bell, category: "free_weights" },
  { id: "cable", label: "Poleas", shortLabel: "Cable", icon: Cable, category: "machines" },
  { id: "machine", label: "Máquinas", shortLabel: "Máqui", icon: Settings, category: "machines" },
  { id: "smith_machine", label: "Smith Machine", shortLabel: "Smith", icon: Wrench, category: "machines" },
  { id: "bodyweight", label: "Peso corporal", shortLabel: "Cuerpo", icon: PersonStanding, category: "bodyweight" },
  { id: "pull_up_bar", label: "Barra dominadas", shortLabel: "Domin", icon: ArrowUp, category: "bodyweight" },
  { id: "bench", label: "Banco", shortLabel: "Banco", icon: Square, category: "accessories" },
  { id: "exercise_ball", label: "Pelota suiza", shortLabel: "Pelot", icon: CircleDot, category: "accessories" },
  { id: "bands", label: "Bandas", shortLabel: "Banda", icon: Activity, category: "accessories" },
  { id: "jump_rope", label: "Comba", shortLabel: "Comba", icon: Rope, category: "accessories" },
];
