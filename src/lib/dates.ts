import { format, isToday as fnsIsToday, isThisWeek as fnsIsThisWeek, parseISO } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea la fecha actual en español: "lunes 7 de septiembre"
 */
export function formatTodayEs(): string {
  return format(new Date(), "EEEE d 'de' MMMM", { locale: es });
}

/**
 * Formato corto: "7 sep"
 */
export function formatDateShortEs(iso: string): string {
  return format(parseISO(iso), "d MMM", { locale: es });
}

/**
 * Formato medio: "7 sept 2026"
 */
export function formatDateMediumEs(iso: string): string {
  return format(parseISO(iso), "d MMM yyyy", { locale: es });
}

export function isToday(iso: string): boolean {
  return fnsIsToday(parseISO(iso));
}

export function isThisWeek(iso: string): boolean {
  return fnsIsThisWeek(parseISO(iso));
}
