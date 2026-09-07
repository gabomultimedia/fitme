import { createClient } from "@/lib/supabase/server";
import { getAllExercises } from "@/lib/exercises/data";
import { filterByEquipment } from "@/lib/exercises/filter-by-equipment";
import { ExerciseCard } from "@/components/exercise/ExerciseCard";
import { redirect } from "next/navigation";

export const metadata = { title: "Biblioteca | FitMe" };

export default async function ExercisesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("equipment_available")
    .eq("id", user.id)
    .single();

  const allExercises = getAllExercises();
  const filtered = filterByEquipment(
    allExercises,
    profile?.equipment_available ?? []
  );

  return (
    <div className="flex flex-col gap-4 p-4 pb-32">
      <header>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Biblioteca</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {filtered.length} ejercicios disponibles con tu equipo
        </p>
      </header>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-on-surface-variant">
            No hay ejercicios. Configura tu equipamiento en el perfil.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
}
