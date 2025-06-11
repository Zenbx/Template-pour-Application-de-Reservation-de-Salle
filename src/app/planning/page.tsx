// src/app/planning/page.tsx (VERSION CONNECTÉE À L'API)
'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useReservations } from '@/hooks/useReservations';
import { useSalles } from '@/hooks/useSalles';
import { Calendar, MapPin, Clock, Users, Building, Eye, Filter, Loader2 } from 'lucide-react';

// Thèmes colorés par jour
const joursThemes = {
  LUNDI: {
    nom: 'Lundi',
    emoji: '🌟',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-300',
    accent: 'blue'
  },
  MARDI: {
    nom: 'Mardi', 
    emoji: '🚀',
    gradient: 'from-purple-500 to-pink-600',
    bg: 'from-purple-50 to-pink-50',
    border: 'border-purple-300',
    accent: 'purple'
  },
  MERCREDI: {
    nom: 'Mercredi',
    emoji: '⚡',
    gradient: 'from-green-500 to-emerald-600',
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-300',
    accent: 'green'
  },
  JEUDI: {
    nom: 'Jeudi',
    emoji: '🎯',
    gradient: 'from-orange-500 to-red-600',
    bg: 'from-orange-50 to-red-50',
    border: 'border-orange-300',
    accent: 'orange'
  },
  VENDREDI: {
    nom: 'Vendredi',
    emoji: '🎉',
    gradient: 'from-teal-500 to-cyan-600',
    bg: 'from-teal-50 to-cyan-50',
    border: 'border-teal-300',
    accent: 'teal'
  }
};

// Créneaux horaires fixes (remplace l'import de data)
const creneauxHoraires = [
  { id: '1', heureDebut: '08:00', heureFin: '10:00', jour: 'LUNDI' },
  { id: '2', heureDebut: '10:15', heureFin: '12:15', jour: 'LUNDI' },
  { id: '3', heureDebut: '13:30', heureFin: '15:30', jour: 'LUNDI' },
  { id: '4', heureDebut: '15:45', heureFin: '17:45', jour: 'LUNDI' },
  { id: '5', heureDebut: '08:00', heureFin: '10:00', jour: 'MARDI' },
  { id: '6', heureDebut: '10:15', heureFin: '12:15', jour: 'MARDI' },
  { id: '7', heureDebut: '13:30', heureFin: '15:30', jour: 'MARDI' },
  { id: '8', heureDebut: '15:45', heureFin: '17:45', jour: 'MARDI' },
  { id: '9', heureDebut: '08:00', heureFin: '10:00', jour: 'MERCREDI' },
  { id: '10', heureDebut: '10:15', heureFin: '12:15', jour: 'MERCREDI' },
  { id: '11', heureDebut: '13:30', heureFin: '15:30', jour: 'MERCREDI' },
  { id: '12', heureDebut: '15:45', heureFin: '17:45', jour: 'MERCREDI' },
  { id: '13', heureDebut: '08:00', heureFin: '10:00', jour: 'JEUDI' },
  { id: '14', heureDebut: '10:15', heureFin: '12:15', jour: 'JEUDI' },
  { id: '15', heureDebut: '13:30', heureFin: '15:30', jour: 'JEUDI' },
  { id: '16', heureDebut: '15:45', heureFin: '17:45', jour: 'JEUDI' },
  { id: '17', heureDebut: '08:00', heureFin: '10:00', jour: 'VENDREDI' },
  { id: '18', heureDebut: '10:15', heureFin: '12:15', jour: 'VENDREDI' },
  { id: '19', heureDebut: '13:30', heureFin: '15:30', jour: 'VENDREDI' },
  { id: '20', heureDebut: '14:45', heureFin: '17:45', jour: 'VENDREDI' },
];

// Générer les semaines
const generateSemaines = (nbSemaines: number) => {
  const semaines = [];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi de cette semaine
  
  for (let i = 0; i < nbSemaines; i++) {
    const debut = new Date(startOfWeek);
    debut.setDate(startOfWeek.getDate() + (i * 7));
    
    const fin = new Date(debut);
    fin.setDate(debut.getDate() + 4); // Vendredi
    
    // Calculer le numéro de semaine
    const firstDayOfYear = new Date(debut.getFullYear(), 0, 1);
    const pastDaysOfYear = (debut.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    
    semaines.push({
      id: `semaine-${i}`,
      debut,
      fin,
      numeroSemaine: weekNumber
    });
  }
  
  return semaines;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short' 
  });
};

// Composant pour une carte de créneau moderne
interface CreneauCardProps {
  creneau: any;
  salle: any;
  date: Date;
  isOccupied: boolean;
  reservationInfo?: {
    motif: string;
    enseignant: string;
  };
  jourTheme: any;
  compact?: boolean;
}

function CreneauCard({ creneau, salle, date, isOccupied, reservationInfo, jourTheme, compact = false }: CreneauCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`group relative border-2 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl ${
        compact ? 'rounded-2xl p-4' : 'rounded-3xl p-6'
      } ${
        isOccupied 
          ? 'bg-gradient-to-br from-red-50 via-pink-50 to-red-100 border-red-300 hover:border-red-400' 
          : 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-green-300 hover:border-green-400'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full"></div>
      
      {/* En-tête du créneau */}
      <div className={`flex items-center justify-between ${compact ? 'mb-4' : 'mb-6'}`}>
        <div className="flex items-center gap-3">
          <div className={`transition-all duration-300 ${
            compact ? 'p-2 rounded-xl' : 'p-3 rounded-2xl'
          } ${
            isOccupied 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
              : 'bg-green-500 text-white shadow-lg shadow-green-500/30'
          } ${isHovered ? 'scale-110 rotate-12' : ''}`}>
            <Clock className={compact ? 'h-4 w-4' : 'h-6 w-6'} />
          </div>
          <div>
            <div className={`font-bold text-gray-900 ${compact ? 'text-lg' : 'text-xl'}`}>
              {creneau.heureDebut} - {creneau.heureFin}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
              Durée : 2 heures
            </div>
          </div>
        </div>
        <div className={`transition-all duration-300 ${
          compact ? 'px-3 py-2 rounded-xl text-sm' : 'px-5 py-3 rounded-2xl text-lg'
        } font-bold ${
          isOccupied 
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
            : 'bg-green-500 text-white shadow-lg shadow-green-500/30'
        } ${isHovered ? 'scale-110' : ''}`}>
          {isOccupied ? '🔴 OCCUPÉ' : '🟢 LIBRE'}
        </div>
      </div>

      {/* Informations de la salle */}
      {!compact && (
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="font-bold text-gray-900 text-lg">{salle.nomSalle}</span>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                👥 {salle.capacite} places
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                🏢 {salle.typeSalle}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            📍 Bâtiment {salle.batiment} • Étage {salle.etage}
          </div>
        </div>
      )}

      {/* Version compacte des infos salle */}
      {compact && (
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-3 mb-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-bold text-gray-900">{salle.nomSalle}</span>
            </div>
            <div className="flex gap-1">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                👥 {salle.capacite}
              </span>
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                🏢 {salle.typeSalle}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Contenu selon l'état */}
      {isOccupied && reservationInfo ? (
        <div className={`bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl ${
          compact ? 'rounded-xl p-4' : 'rounded-2xl p-5'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`bg-white bg-opacity-20 flex items-center justify-center ${
              compact ? 'w-8 h-8 rounded-lg text-lg' : 'w-12 h-12 rounded-xl text-2xl'
            }`}>
              📚
            </div>
            <div className="flex-1">
              <div className={`font-bold text-white ${compact ? 'text-lg mb-1' : 'text-xl mb-2'}`}>
                {reservationInfo.motif}
              </div>
              <div className="text-red-100 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-200 rounded-full"></span>
                Enseignant : {reservationInfo.enseignant}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl ${
          compact ? 'rounded-xl p-4' : 'rounded-2xl p-5'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`bg-white bg-opacity-20 flex items-center justify-center ${
              compact ? 'w-8 h-8 rounded-lg text-lg' : 'w-12 h-12 rounded-xl text-2xl'
            }`}>
              ✨
            </div>
            <div>
              <div className={`font-bold text-white ${compact ? 'text-lg' : 'text-xl'}`}>
                Salle disponible
              </div>
              <div className="text-green-100 text-sm">Prête pour une nouvelle réservation</div>
            </div>
          </div>
        </div>
      )}

      {/* Equipements - Affichage conditionnel */}
      {!compact && salle.equipements && (
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-2 font-medium">ÉQUIPEMENTS DISPONIBLES</div>
          <div className="flex flex-wrap gap-1">
            {salle.equipements.split(',').slice(0, 3).map((eq: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                {eq.trim()}
              </span>
            ))}
            {salle.equipements.split(',').length > 3 && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg">
                +{salle.equipements.split(',').length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour mini-cards dans vue d'ensemble
function MiniSalleCard({ salle, isOccupied, reservationInfo }: { 
  salle: any; 
  isOccupied: boolean; 
  reservationInfo?: { motif: string; enseignant: string; } 
}) {
  return (
    <div className={`group border-2 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      isOccupied 
        ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:border-red-300' 
        : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${
            isOccupied ? 'bg-red-500' : 'bg-green-500'
          } shadow-lg`}></div>
          <span className="font-bold text-sm text-gray-900">{salle.nomSalle}</span>
        </div>
        <span className={`px-2 py-1 rounded-xl text-xs font-bold ${
          isOccupied 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {isOccupied ? '🔴' : '🟢'}
        </span>
      </div>
      
      <div className="text-xs text-gray-600 mb-3 space-y-1">
        <div className="flex items-center gap-1">
          <span>👥</span> {salle.capacite} places
        </div>
        <div className="flex items-center gap-1">
          <span>🏢</span> {salle.typeSalle}
        </div>
        <div className="flex items-center gap-1">
          <span>📍</span> Bât. {salle.batiment} • Ét. {salle.etage}
        </div>
      </div>

      {isOccupied && reservationInfo ? (
        <div className="bg-white bg-opacity-80 p-3 rounded-xl border border-red-200">
          <div className="font-bold text-xs text-gray-900 mb-1">{reservationInfo.motif}</div>
          <div className="text-xs text-gray-600">{reservationInfo.enseignant}</div>
        </div>
      ) : (
        <div className="text-xs text-center py-2 bg-green-100 text-green-700 rounded-xl font-medium">
          ✨ Disponible
        </div>
      )}
    </div>
  );
}

export default function PlanningPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const { user, isAuthenticated } = useAuth();
  
  // Hooks API
  const { data: salles = [], isLoading: sallesLoading } = useSalles();
  const { data: reservations = [], isLoading: reservationsLoading } = useReservations();

  const [selectedSalle, setSelectedSalle] = useState<string>('');
  const [selectedSemaine, setSelectedSemaine] = useState<string>('');
  
  const semaines = generateSemaines(12);

  // Initialiser avec la première semaine
  useEffect(() => {
    if (semaines.length > 0 && !selectedSemaine) {
      setSelectedSemaine(semaines[0].id);
    }
  }, [semaines, selectedSemaine]);

  const selectedSemaineData = semaines.find(s => s.id === selectedSemaine);
  const selectedSalleData = salles.find(s => s.codeSalle === selectedSalle);

  // Vérifier si un créneau est occupé et récupérer les infos
  const getCreneauInfo = (creneau: any, salle: any, date: Date) => {
    // Chercher une réservation confirmée pour cette salle, ce créneau et cette date
    const reservation = reservations.find(r => 
      r.salle?.codeSalle === salle.codeSalle &&
      r.jour === date.toISOString().split('T')[0] &&
      r.heureDebut === creneau.heureDebut &&
      r.statut === 'CONFIRMEE'
    );

    if (reservation) {
      return {
        isOccupied: true,
        reservationInfo: {
          motif: reservation.motif,
          enseignant: `${reservation.enseignant.prenomEnseignant} ${reservation.enseignant.nomEnseignant}`
        }
      };
    }

    return { isOccupied: false };
  };

  // Générer les données de planning pour la semaine
  const generatePlanningData = () => {
    if (!selectedSemaineData) return [];

    const jours = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];
    const planningData = [];

    for (let i = 0; i < jours.length; i++) {
      const jour = jours[i];
      const date = new Date(selectedSemaineData.debut);
      date.setDate(date.getDate() + i);

      const creneauxJour = creneauxHoraires.filter(c => c.jour === jour);
      
      planningData.push({
        jour,
        date,
        creneaux: creneauxJour,
        theme: joursThemes[jour as keyof typeof joursThemes]
      });
    }

    return planningData;
  };

  const planningData = generatePlanningData();

  // Calculer les statistiques
  const calculateStats = () => {
    if (!selectedSemaineData) return { total: 0, occupied: 0, free: 0, occupancy: 0 };

    let total = 0;
    let occupied = 0;

    planningData.forEach(({ creneaux, date }) => {
      creneaux.forEach(creneau => {
        if (selectedSalleData) {
          total++;
          const { isOccupied } = getCreneauInfo(creneau, selectedSalleData, date);
          if (isOccupied) occupied++;
        } else {
          salles.forEach(salle => {
            total++;
            const { isOccupied } = getCreneauInfo(creneau, salle, date);
            if (isOccupied) occupied++;
          });
        }
      });
    });

    return {
      total,
      occupied,
      free: total - occupied,
      occupancy: total > 0 ? Math.round((occupied / total) * 100) : 0
    };
  };

  const stats = calculateStats();

  // Loading state
  if (sallesLoading || reservationsLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Card rounded="xl" className="p-8 text-center">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chargement du planning
            </h3>
            <p className="text-gray-600">
              Récupération des données en cours...
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar onLoginClick={() => setShowAuthModal(true)} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white overflow-hidden">
              {/* Fond animé */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-4xl">📅</span>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">Planning des Salles</h1>
                      <p className="text-indigo-100 text-lg">
                        Visualisez et gérez les réservations en temps réel
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-indigo-100">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm">Données live de l'API</span>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-100">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">
                            {isAuthenticated && user ? (
                              user.role === 'RESPONSABLE' ? 'Mode Responsable' : 'Mode Enseignant'
                            ) : 'Mode Public'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Stats */}
                  {selectedSemaineData && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-3xl font-bold">{stats.total}</div>
                        <div className="text-xs text-indigo-100">Créneaux totaux</div>
                      </div>
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-3xl font-bold text-red-200">{stats.occupied}</div>
                        <div className="text-xs text-indigo-100">Réservés</div>
                      </div>
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-3xl font-bold text-green-200">{stats.free}</div>
                        <div className="text-xs text-indigo-100">Disponibles</div>
                      </div>
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-3xl font-bold text-yellow-200">{stats.occupancy}%</div>
                        <div className="text-xs text-indigo-100">Occupation</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mode Indicator & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              
              {/* Mode utilisateur */}
              <Card 
                rounded="2xl" 
                className={`border-l-4 ${
                  isAuthenticated && user?.role === 'RESPONSABLE' 
                    ? 'border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50' 
                    : isAuthenticated 
                    ? 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50'
                    : 'border-l-gray-500 bg-gradient-to-r from-gray-50 to-slate-50'
                }`}
                hover
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    isAuthenticated && user?.role === 'RESPONSABLE' 
                      ? 'bg-purple-500 text-white' 
                      : isAuthenticated 
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {isAuthenticated && user?.role === 'RESPONSABLE' ? (
                      <Users className="h-8 w-8" />
                    ) : isAuthenticated ? (
                      <Calendar className="h-8 w-8" />
                    ) : (
                      <Eye className="h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {isAuthenticated && user ? (
                        user.role === 'RESPONSABLE' ? '👨‍💼 Mode Responsable' : '👨‍🏫 Mode Enseignant'
                      ) : '👀 Mode Public'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {isAuthenticated && user ? (
                        user.role === 'RESPONSABLE' 
                          ? 'Gestion complète • Modification des plannings'
                          : 'Consultation et réservation • Accès personnel'
                      ) : (
                        'Consultation publique • Connectez-vous pour réserver'
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Filtres rapides */}
              <Card title="🎛️ Filtres" rounded="2xl" className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50" hover>
                <div className="space-y-4">
                  <Select
                    label="Salle"
                    value={selectedSalle}
                    onChange={(e) => setSelectedSalle(e.target.value)}
                    className="border-green-200 focus:border-green-500 focus:ring-green-200"
                    options={[
                      { value: '', label: '📋 Vue d\'ensemble' },
                      ...salles.map(salle => ({
                        value: salle.codeSalle,
                        label: `🏢 ${salle.nomSalle} (${salle.capacite}p)`
                      }))
                    ]}
                  />

                  <Select
                    label="Semaine"
                    value={selectedSemaine}
                    onChange={(e) => setSelectedSemaine(e.target.value)}
                    className="border-green-200 focus:border-green-500 focus:ring-green-200"
                    options={semaines.map(semaine => ({
                      value: semaine.id,
                      label: `📅 S${semaine.numeroSemaine} (${formatDate(semaine.debut)})`
                    }))}
                  />
                </div>
              </Card>

              {/* Actions rapides */}
              <Card title="⚡ Actions rapides" rounded="2xl" className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-red-50" hover>
                <div className="space-y-3">
                  <Button 
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    onClick={() => setViewMode('grid')}
                    className="w-full justify-start"
                    size="sm"
                  >
                    📋 Vue Grille
                  </Button>
                  <Button 
                    variant={viewMode === 'timeline' ? 'primary' : 'outline'}
                    onClick={() => setViewMode('timeline')}
                    className="w-full justify-start"
                    size="sm"
                  >
                    ⏰ Vue Timeline
                  </Button>
                  {!isAuthenticated && (
                    <Button 
                      onClick={() => setShowAuthModal(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="sm"
                    >
                      🔑 Se connecter
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Salle sélectionnée - Info détaillée */}
            {selectedSalleData && (
              <Card 
                rounded="2xl"
                className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                hover
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Building className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{selectedSalleData.nomSalle}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                          <div className="font-medium">Type</div>
                          <div className="text-blue-100">{selectedSalleData.typeSalle}</div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                          <div className="font-medium">Capacité</div>
                          <div className="text-blue-100">{selectedSalleData.capacite} places</div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                          <div className="font-medium">Bâtiment</div>
                          <div className="text-blue-100">{selectedSalleData.batiment}</div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                          <div className="font-medium">Étage</div>
                          <div className="text-blue-100">{selectedSalleData.etage}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-blue-100 mb-2">⚙️ Équipements</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSalleData.equipements?.split(',').map((eq, index) => (
                        <span key={index} className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full">
                          {eq.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Planning principal */}
            {selectedSemaineData ? (
              <div className="space-y-8">
                {selectedSalleData ? (
                  // Vue détaillée pour une salle spécifique - VERSION COMPACTE
                  planningData.map(({ jour, date, creneaux, theme }) => (
                    <Card 
                      key={jour} 
                      rounded="2xl"
                      className={`border-l-4 ${theme.border} bg-gradient-to-r ${theme.bg} overflow-hidden`}
                      hover
                    >
                      <div className="mb-6">
                        <div className={`bg-gradient-to-r ${theme.gradient} text-white p-4 rounded-2xl`}>
                          <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="text-3xl">{theme.emoji}</span>
                            {theme.nom} {formatDate(date)}
                          </h2>
                        </div>
                      </div>
                      
                      {/* Grille 3 colonnes au lieu de 2 pour un affichage plus dense */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {creneaux.map(creneau => {
                          const { isOccupied, reservationInfo } = getCreneauInfo(creneau, selectedSalleData, date);
                          
                          return (
                            <CreneauCard
                              key={creneau.id}
                              creneau={creneau}
                              salle={selectedSalleData}
                              date={date}
                              isOccupied={isOccupied}
                              reservationInfo={reservationInfo}
                              jourTheme={theme}
                              compact={true}
                            />
                          );
                        })}
                      </div>
                    </Card>
                  ))
                ) : (
                  // Vue d'ensemble de toutes les salles
                  planningData.map(({ jour, date, creneaux, theme }) => (
                    <Card 
                      key={jour} 
                      rounded="2xl"
                      className={`border-l-4 ${theme.border} bg-gradient-to-r ${theme.bg}`}
                      hover
                    >
                      <div className="mb-6">
                        <div className={`bg-gradient-to-r ${theme.gradient} text-white p-4 rounded-2xl`}>
                          <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="text-3xl">{theme.emoji}</span>
                            {theme.nom} {formatDate(date)}
                          </h2>
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                        {creneaux.map(creneau => (
                          <div key={creneau.id} className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6">
                            <div className="flex items-center gap-4 mb-6">
                              <div className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl flex items-center justify-center`}>
                                <Clock className="h-6 w-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-xl text-gray-900">
                                  {creneau.heureDebut} - {creneau.heureFin}
                                </h4>
                                <p className="text-sm text-gray-600">Créneaux de 2 heures</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                              {salles.map(salle => {
                                const { isOccupied, reservationInfo } = getCreneauInfo(creneau, salle, date);
                                
                                return (
                                  <MiniSalleCard
                                    key={salle.codeSalle}
                                    salle={salle}
                                    isOccupied={isOccupied}
                                    reservationInfo={reservationInfo}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))
                )}

                {/* Légende et informations */}
                <Card 
                  title="📖 Guide d'utilisation" 
                  rounded="2xl"
                  className="bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-200">
                      <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold">
                        🟢
                      </div>
                      <div>
                        <div className="font-bold text-green-700">Salle libre</div>
                        <div className="text-xs text-green-600">Prête pour réservation</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl border border-red-200">
                      <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold">
                        🔴
                      </div>
                      <div>
                        <div className="font-bold text-red-700">Salle occupée</div>
                        <div className="text-xs text-red-600">Cours en cours</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                      <Clock className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="font-bold text-blue-700">2h par créneau</div>
                        <div className="text-xs text-blue-600">Durée standard</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-200">
                      <MapPin className="w-8 h-8 text-purple-500" />
                      <div>
                        <div className="font-bold text-purple-700">Données temps réel</div>
                        <div className="text-xs text-purple-600">API synchronisée</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl">
                        💡
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-2">Informations techniques</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Données chargées depuis l'API RESAMA en temps réel</li>
                          <li>• {salles.length} salles et {reservations.length} réservations synchronisées</li>
                          <li>• Filtrage et recherche optimisés côté client</li>
                          {isAuthenticated ? (
                            <li>• Accès authentifié avec gestion des permissions</li>
                          ) : (
                            <li>• Mode consultation publique • Connectez-vous pour plus de fonctionnalités</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              // État initial - pas de semaine sélectionnée
              <Card rounded="3xl" className="text-center py-20 bg-gradient-to-br from-white to-gray-50">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Calendar className="h-20 w-20 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Sélectionnez une semaine
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Choisissez une semaine dans les filtres pour voir le planning détaillé et interactif
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}