// src/types/index.ts

export enum UserRole {
  ENSEIGNANT = 'ENSEIGNANT',
  RESPONSABLE = 'RESPONSABLE'
}

export enum StatutReservation {
  CONFIRMEE = 'CONFIRMEE',
  ANNULEE = 'ANNULEE',
  EN_ATTENTE = 'EN_ATTENTE'
}

export enum TypeMateriel {
  ORDINATEUR = 'ORDINATEUR',
  VIDEO_PROJECTEUR = 'VIDEO_PROJECTEUR'
}

// Interface correspondant à Enseignant de l'API
export interface Enseignant {
  idEnseignant: number;
  nomEnseignant: string;
  prenomEnseignant: string;
  email: string;
  telephone: string;
  specialite: string;
  reservations?: Reservation[];
  formationsResponsables?: Formation[];
}

// DTO simplifié pour les listes
export interface EnseignantSimple {
  idEnseignant: number;
  nomEnseignant: string;
  prenomEnseignant: string;
  email: string;
  telephone: string;
  specialite: string;
}

// Interface correspondant à Salle de l'API
export interface Salle {
  codeSalle: string;
  nomSalle: string;
  capacite: number;
  disponibilite: boolean;
  typeSalle: string;
  batiment: string;
  etage: string;
  equipements: string;
  reservations?: Reservation[];
}

// Interface de base pour le matériel
export interface MaterielBase {
  codeMateriel: string;
  disponibilite: boolean;
  marque: string;
  modele: string;
  etat: string;
  dateAcquisition: string;
  localisation: string;
  reservations?: Reservation[];
  type: TypeMateriel;
}

// Interface pour Ordinateur (hérite de MaterielBase)
export interface Ordinateur extends MaterielBase {
  type: TypeMateriel.ORDINATEUR;
  processeur: string;
  ram: string;
  stockage: string;
  tailleEcran: string;
  systemeExploitation: string;
  typeOrdinateur: string;
}

// Interface pour VideoProjecteur (hérite de MaterielBase)
export interface VideoProjecteur extends MaterielBase {
  type: TypeMateriel.VIDEO_PROJECTEUR;
  description: string;
  resolution: string;
  luminosite: string;
  connectivite: string;
  poids: number;
  typeProjection: string;
}

// Union type pour le matériel
export type Materiel = Ordinateur | VideoProjecteur;

// DTOs simplifiés pour le matériel
export interface MaterielSimple extends Omit<MaterielBase, 'reservations'> {}

export interface OrdinateurSimple extends Omit<Ordinateur, 'reservations'> {}

export interface VideoProjecteurSimple extends Omit<VideoProjecteur, 'reservations'> {}

// Interface correspondant à Formation de l'API
export interface Formation {
  idFormation: number;
  codeFormation: string;
  nomFormation: string;
  description: string;
  niveau: string;
  dureeHeures: number;
  responsable: Enseignant;
  reservations?: Reservation[];
}

// DTO simplifié pour Formation
export interface FormationSimple {
  idFormation: number;
  codeFormation: string;
  nomFormation: string;
  description: string;
  niveau: string;
  dureeHeures: number;
  responsable: EnseignantSimple;
}

// Interface correspondant à Reservation de l'API
export interface Reservation {
  numero: number;
  jour: string; // format date
  heureDebut: string;
  heureFin: string;
  motif: string;
  statut: StatutReservation;
  nombreParticipants: number;
  enseignant: Enseignant;
  salle?: Salle;
  materiel?: Materiel;
  formation?: Formation;
}

// DTO simplifié pour Reservation
export interface ReservationSimple {
  numero: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  motif: string;
  statut: string;
  nombreParticipants: number;
}

// DTOs complets avec relations
export interface ReservationDTO {
  numero: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  motif: string;
  statut: string;
  nombreParticipants: number;
  enseignant: EnseignantSimple;
  salle?: Salle;
  materiel?: MaterielSimple | OrdinateurSimple | VideoProjecteurSimple;
  formation?: FormationSimple;
}

export interface SalleDTO {
  codeSalle: string;
  nomSalle: string;
  capacite: number;
  disponibilite: boolean;
  typeSalle: string;
  batiment: string;
  etage: string;
  equipements: string;
  reservations?: ReservationSimple[];
}

export interface FormationDTO {
  idFormation: number;
  codeFormation: string;
  nomFormation: string;
  description: string;
  niveau: string;
  dureeHeures: number;
  responsable: EnseignantSimple;
  reservations?: ReservationSimple[];
}

export interface EnseignantDTO {
  idEnseignant: number;
  nomEnseignant: string;
  prenomEnseignant: string;
  email: string;
  telephone: string;
  specialite: string;
  formationsResponsables?: FormationSimple[];
  reservations?: ReservationSimple[];
}

// DTO pour le tableau de bord responsable
export interface TableauBordResponsable {
  nombreFormations: number;
  nombreEnseignantsTotal: number;
  nombreEnseignantsNonResponsables: number;
  formations: FormationSimple[];
  enseignants: EnseignantSimple[];
}

// Interfaces pour les créations/mises à jour
export interface CreateFormationRequest {
  codeFormation: string;
  nomFormation: string;
  description: string;
  niveau: string;
  dureeHeures: number;
  responsableId: number; // Changé en number pour correspondre à idEnseignant
}

export interface UpdateFormationRequest extends Partial<CreateFormationRequest> {
  idFormation: number;
}

export interface CreateReservationRequest {
  jour: string; // format date
  heureDebut: string;
  heureFin: string;
  motif: string;
  nombreParticipants: number;
  enseignantId: number;
  salleCode?: string;
  materielCode?: string;
  formationId?: number;
}

export interface UpdateReservationRequest extends Partial<CreateReservationRequest> {
  numero: number;
  statut?: StatutReservation;
}

// Interfaces pour les filtres et la recherche
export interface FormationFilters {
  niveau?: string;
  responsableId?: number;
  codeFormation?: string;
  nomFormation?: string;
  dureeMin?: number;
  dureeMax?: number;
}

export interface EnseignantFilters {
  specialite?: string;
  nomEnseignant?: string;
  prenomEnseignant?: string;
  email?: string;
}

export interface ReservationFilters {
  statut?: StatutReservation;
  dateDebut?: string;
  dateFin?: string;
  enseignantId?: number;
  formationId?: number;
}

// Statistiques
export interface FormationStats {
  totalFormations: number;
  formationsParNiveau: Record<string, number>;
  moyenneDureeHeures: number;
  formationsParResponsable: Record<string, number>;
}

export interface DashboardStats {
  reservationsAujourdhui: number;
  sallesReservees: number;
  materielEmprunte: number;
  totalEnseignants: number;
  totalFormations: number;
}

// Types pour l'interface utilisateur
export type ViewType =
  | 'DASHBOARD'
  | 'PLANNING'
  | 'RESERVATION_SALLE'
  | 'RESERVATION_MATERIEL'
  | 'GESTION_ENSEIGNANTS'
  | 'GESTION_FORMATIONS'
  | 'GESTION_MATERIEL';

export interface AuthState {
  enseignant: Enseignant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Interfaces pour les créations/mises à jour - Enseignants
export interface CreateEnseignantRequest {
  nomEnseignant: string;
  prenomEnseignant: string;
  email: string;
  telephone: string;
  specialite: string;
  password?: string; // Pour la création d'un compte
}

export interface UpdateEnseignantRequest extends Partial<CreateEnseignantRequest> {
  idEnseignant: number;
}

// Interfaces pour les créations/mises à jour - Salles
export interface CreateSalleRequest {
  codeSalle: string;
  nomSalle: string;
  capacite: number;
  disponibilite?: boolean;
  typeSalle: string;
  batiment: string;
  etage: string;
  equipements: string;
}

export interface UpdateSalleRequest extends Partial<CreateSalleRequest> {
  codeSalle: string;
}

// Interfaces pour les créations/mises à jour - Matériel
export interface CreateMaterielRequest {
  codeMateriel: string;
  disponibilite?: boolean;
  marque: string;
  modele: string;
  etat: string;
  dateAcquisition: string;
  localisation: string;
  type: TypeMateriel;
  // Propriétés spécifiques selon le type
  processeur?: string; // Pour ordinateur
  ram?: string;
  stockage?: string;
  tailleEcran?: string;
  systemeExploitation?: string;
  typeOrdinateur?: string;
  description?: string; // Pour vidéoprojecteur
  resolution?: string;
  luminosite?: string;
  connectivite?: string;
  poids?: number;
  typeProjection?: string;
}

export interface UpdateMaterielRequest extends Partial<CreateMaterielRequest> {
  codeMateriel: string;
}

// Interfaces pour l'authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  enseignant: EnseignantDTO;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Types utilitaires
export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Types pour les erreurs API
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Types pour les options de requête
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Interface pour les réponses de recherche
export interface SearchResponse<T> extends PaginatedResponse<T> {
  query: string;
  filters?: Record<string, any>;
}

export interface CreneauHoraire {
  id: string;
  jour: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI';
  heureDebut: string;
  heureFin: string;
  label: string;
}

export interface Semaine {
  numero: number;
  debut: Date;
  fin: Date;
  label: string;
}