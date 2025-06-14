import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDateInRange(date: Date | string, debut: Date | string, fin: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const debutObj = typeof debut === 'string' ? new Date(debut) : debut;
  const finObj = typeof fin === 'string' ? new Date(fin) : fin;
  
  return dateObj >= debutObj && dateObj <= finObj;
}

export function formatDate(date: Date | string, locale: string = 'fr-FR'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
   if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('fr-FR', options);
}

export function formatTime(time: string): string {
  return time.substring(0, 5); // "08:00:00" -> "08:00"
}

export function calculateDuration(heureDebut: string, heureFin: string): number {
  const debut = new Date(`2000-01-01T${heureDebut}`);
  const fin = new Date(`2000-01-01T${heureFin}`);
  return (fin.getTime() - debut.getTime()) / (1000 * 60 * 60); // en heures
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function getWeekDays(startDate: Date): Date[] {
  const days = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 5; i++) { // Lundi à Vendredi
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  
  return days;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}