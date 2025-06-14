// src/lib/data.ts
import { SalleDTO, Materiel, Semaine, CreneauHoraire, Reservation, UserRole } from '@/types';
import { addWeeks, startOfWeek, endOfWeek, format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données des salles
export const salles: SalleDTO[] = [
  {
    id: 'S001',
    nom: 'Amphithéâtre A',
    capacite: 150,
    type: 'Amphithéâtre',
    equipements: ['Vidéoprojecteur', 'Micro', 'Tableau numérique'],
    etage: 0,
    batiment: 'A'
  },
  {
    id: 'S002',
    nom: 'Salle 101',
    capacite: 30,
    type: 'TD',
    equipements: ['Tableau blanc', 'Vidéoprojecteur'],
    etage: 1,
    batiment: 'A'
  },
  {
    id: 'S003',
    nom: 'Salle 102',
    capacite: 30,
    type: 'TD',
    equipements: ['Tableau blanc', 'Écran tactile'],
    etage: 1,
    batiment: 'A'
  },
  {
    id: 'S004',
    nom: 'Labo Info 1',
    capacite: 25,
    type: 'Laboratoire',
    equipements: ['Ordinateurs', 'Réseau', 'Vidéoprojecteur'],
    etage: 2,
    batiment: 'B'
  },
  {
    id: 'S005',
    nom: 'Labo Info 2',
    capacite: 25,
    type: 'Laboratoire',
    equipements: ['Ordinateurs', 'Réseau', 'Logiciels spécialisés'],
    etage: 2,
    batiment: 'B'
  },
  {
    id: 'S006',
    nom: 'Salle Visio',
    capacite: 20,
    type: 'Visioconférence',
    equipements: ['Caméras', 'Micro directionnel', 'Écrans multiples'],
    etage: 1,
    batiment: 'C'
  }
];

// Données du matériel
export const materiels: Materiel[] = [
  {
    id: 'M001',
    nom: 'Vidéoprojecteur Portable',
    type: 'AUDIOVISUEL',
    disponible: true,
    description: 'Vidéoprojecteur portable Full HD avec connectiques HDMI/VGA',
    quantiteStock: 10,
    quantiteDisponible: 7
  },
  {
    id: 'M002',
    nom: 'Ordinateur Portable',
    type: 'INFORMATIQUE',
    disponible: true,
    description: 'Laptop professionnel avec suite bureautique installée',
    quantiteStock: 15,
    quantiteDisponible: 12
  },
  {
    id: 'M003',
    nom: 'Micro-casque',
    type: 'AUDIOVISUEL',
    disponible: true,
    description: 'Micro-casque sans fil pour présentations',
    quantiteStock: 8,
    quantiteDisponible: 6
  },
  {
    id: 'M004',
    nom: 'Microscope',
    type: 'LABORATOIRE',
    disponible: true,
    description: 'Microscope optique professionnel',
    quantiteStock: 5,
    quantiteDisponible: 3
  },
  {
    id: 'M005',
    nom: 'Tableau Portable',
    type: 'MOBILIER',
    disponible: true,
    description: 'Tableau à roulettes double face',
    quantiteStock: 6,
    quantiteDisponible: 4
  },
  {
    id: 'M006',
    nom: 'Webcam 4K',
    type: 'INFORMATIQUE',
    disponible: true,
    description: 'Webcam haute définition pour cours en ligne',
    quantiteStock: 12,
    quantiteDisponible: 9
  }
];

// Créneaux horaires standards
export const creneauxHoraires: CreneauHoraire[] = [
  { id: 'C001', heureDebut: '08:00', heureFin: '10:00', jour: 'LUNDI' },
  { id: 'C002', heureDebut: '10:15', heureFin: '12:15', jour: 'LUNDI' },
  { id: 'C003', heureDebut: '13:30', heureFin: '15:30', jour: 'LUNDI' },
  { id: 'C004', heureDebut: '15:45', heureFin: '17:45', jour: 'LUNDI' },
  
  { id: 'C005', heureDebut: '08:00', heureFin: '10:00', jour: 'MARDI' },
  { id: 'C006', heureDebut: '10:15', heureFin: '12:15', jour: 'MARDI' },
  { id: 'C007', heureDebut: '13:30', heureFin: '15:30', jour: 'MARDI' },
  { id: 'C008', heureDebut: '15:45', heureFin: '17:45', jour: 'MARDI' },
  
  { id: 'C009', heureDebut: '08:00', heureFin: '10:00', jour: 'MERCREDI' },
  { id: 'C010', heureDebut: '10:15', heureFin: '12:15', jour: 'MERCREDI' },
  { id: 'C011', heureDebut: '13:30', heureFin: '15:30', jour: 'MERCREDI' },
  { id: 'C012', heureDebut: '15:45', heureFin: '17:45', jour: 'MERCREDI' },
  
  { id: 'C013', heureDebut: '08:00', heureFin: '10:00', jour: 'JEUDI' },
  { id: 'C014', heureDebut: '10:15', heureFin: '12:15', jour: 'JEUDI' },
  { id: 'C015', heureDebut: '13:30', heureFin: '15:30', jour: 'JEUDI' },
  { id: 'C016', heureDebut: '15:45', heureFin: '17:45', jour: 'JEUDI' },
  
  { id: 'C017', heureDebut: '08:00', heureFin: '10:00', jour: 'VENDREDI' },
  { id: 'C018', heureDebut: '10:15', heureFin: '12:15', jour: 'VENDREDI' },
  { id: 'C019', heureDebut: '13:30', heureFin: '15:30', jour: 'VENDREDI' },
  { id: 'C020', heureDebut: '15:45', heureFin: '17:45', jour: 'VENDREDI' }
];

// Génération des semaines
export function generateSemaines(nbSemaines: number = 12): Semaine[] {
  const semaines: Semaine[] = [];
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });

  for (let i = 0; i < nbSemaines; i++) {
    const debut = addWeeks(currentWeekStart, i);
    const fin = endOfWeek(debut, { weekStartsOn: 1 });
    
    semaines.push({
      id: `S${i + 1}`,
      debut,
      fin,
      numeroSemaine: parseInt(format(debut, 'w'))
    });
  }

  return semaines;
}

// Données de réservations de test
export const reservationsTest: Reservation[] = [
  {
    id: 'R001',
    type: 'SALLE',
    salleId: 'S001',
    utilisateurId: '3',
    creneauId: 'C001',
    date: new Date(),
    statut: 'CONFIRMEE',
    motif: 'Cours de Mathématiques',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'R002',
    type: 'MATERIEL',
    materielId: 'M001',
    utilisateurId: '3',
    creneauId: 'C005',
    date: addWeeks(new Date(), 1),
    statut: 'CONFIRMEE',
    motif: 'Présentation projet',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: fr });
}

export function formatDateTime(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
}

export function formatTime(time: string): string {
  return time;
}

export function calculateDuration(heureDebut: string, heureFin: string): number {
  const [startHour, startMin] = heureDebut.split(':').map(Number);
  const [endHour, endMin] = heureFin.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return (endMinutes - startMinutes) / 60; // Retourne en heures
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function isResponsable(userRole: UserRole): boolean {
  return userRole === UserRole.RESPONSABLE;
}

export function canAccessView(userRole: UserRole | null, view: string): boolean {
  if (!userRole) {
    return ['DASHBOARD', 'PLANNING'].includes(view);
  }
  
  if (view === 'GESTION_ENSEIGNANTS') {
    return isResponsable(userRole);
  }
  
  return true;
}