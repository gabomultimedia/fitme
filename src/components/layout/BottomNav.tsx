"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Plus, BarChart3, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home, match: (p) => p === "/dashboard" },
  { href: "/exercises", label: "Biblioteca", icon: Dumbbell, match: (p) => p.startsWith("/exercises") },
  { href: "/workouts/session", label: "Nuevo", icon: Plus, match: (p) => p === "/workouts/session" },
  { href: "/progress", label: "Progreso", icon: BarChart3, match: (p) => p.startsWith("/progress") },
  { href: "/profile", label: "Perfil", icon: User, match: (p) => p.startsWith("/profile") },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-4px_20px_rgba(19,27,46,0.06)]"
    >
      <div className="flex items-center justify-around h-20 px-2 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match ? item.match(pathname ?? "") : pathname === item.href;
          const Icon = item.icon;
          const isCenter = item.label === "Nuevo";

          if (isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label="Iniciar nuevo entrenamiento"
                className="flex items-center justify-center -mt-6 cursor-pointer"
              >
                <span className="w-14 h-14 rounded-full bg-secondary-container text-on-primary flex items-center justify-center shadow-[0_4px_14px_0_rgba(249,115,22,0.4)] active:scale-95 transition-transform">
                  <Icon className="w-7 h-7" aria-hidden />
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-14 transition-all gap-1 cursor-pointer",
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <Icon className="w-6 h-6" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
