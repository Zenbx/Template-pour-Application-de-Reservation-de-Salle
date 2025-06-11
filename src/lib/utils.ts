import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, locale: string = 'fr-FR'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatTime(time: string): string {
  return time.substring(0, 5); // "08:00:00" -> "08:00"
}

export function calculateDuration(heureDebut: string, heureFin: string): number {
  const debut = new Date(`2000-01-01T${heureDebut}`);
  const fin = new Date(`2000-01-01T${heureFin}`);
  return (fin.getTime() - debut.getTime()) / (1000 * 60 * 60); // en heures
}