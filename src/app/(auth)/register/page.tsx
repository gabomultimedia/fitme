import { redirect } from "next/navigation";

export const metadata = { title: "Acceso restringido | FitMe" };

// Solo 2 usuarios fijos (Gabriel + Verónica). El registro público está deshabilitado.
export default function RegisterPage() {
  redirect("/login");
}
