import { WelcomeHero } from "@/components/landing/WelcomeHero";

export const metadata = {
  title: "FitMe — Tu gimnasio, tu app",
  description: "Registra tus entrenamientos personalizados según el equipamiento de tu gimnasio.",
};

export default function HomePage() {
  return <WelcomeHero />;
}
