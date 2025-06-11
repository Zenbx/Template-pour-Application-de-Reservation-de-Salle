// src/app/recap-horaire/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { useReservations } from '@/hooks/useReservations';
import { useFormations } from '@/hooks/useFormations';
import { Clock, Calendar, BookOpen, MapPin, Download, Users, BarChart3, User, TrendingUp, Loader2 } from 'lucide-react';

// Thèmes colorés subtils par jour
const joursThemes = {
  LUNDI: {
    nom: 'Lundi',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    accentColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700'
  },
  MARDI: {
    nom: 'Mardi', 
    borderColor: 'border-l-purple-500',
    bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
    accentColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-700'
  },
  MERCREDI: {
    nom: 'Mercredi',
    borderColor: 'border-l-green-500',
    bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
    accentColor: 'text-green-600',
    badgeColor: 'bg-green-100 text-green-700'
  },
  JEUDI: {
    nom: 'Jeudi',
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-gradient-to-r from-orange-50 to-amber-50',
    accentColor: 'text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-700'
  },
  VENDREDI: {
    nom: 'Vendredi',
    borderColor: 'border-l-indigo-500',
    bgColor: 'bg-gradient-to-r from-indigo-50 to-violet-50',
    accentColor: 'text-indigo-600',
    badgeColor: 'bg-indigo-100 text-indigo-700'
  }
};

// Générer les semaines
const generateSemaines = (nbSemaines: number) => {
  const semaines = [];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  
  for (let i = 0; i < nbSemaines; i++) {
    const debut = new Date(startOfWeek);
    debut.setDate(startOfWeek.getDate() + (i * 7));
    
    const fin = new Date(debut);
    fin.setDate(debut.getDate() + 4);
    
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

// Composant StatCard avec accents colorés
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, subtitle, icon, color, trend = 'neutral' }: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      border: 'border-l-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-gray-900'
    },
    green: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-l-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-gray-900'
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
      border: 'border-l-purple-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      valueColor: 'text-gray-900'
    },
    orange: {
      bg: 'bg-gradient-to-r from-orange-50 to-amber-50',
      border: 'border-l-orange-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      valueColor: 'text-gray-900'
    }
  };

  const colors = colorClasses[color];
  
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <Card rounded="xl" className={`p-6 border-l-4 ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-semibold ${colors.valueColor} mb-1`}>
            {value}
          </div>
          <div className="text-sm font-medium text-gray-700 mb-1">
            {title}
          </div>
          <div className={`text-xs ${trendColors[trend]}`}>
            {subtitle}
          </div>
        </div>
        <div className={`p-3 ${colors.iconBg} rounded-xl`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-5 w-5 ${colors.iconColor}`
          })}
        </div>
      </div>
    </Card>
  );
}

// Composant CoursCard avec couleurs subtiles
interface CoursCardProps {
  cours: {
    nom: string;
    heures: number;
    salle: string;
  };
  index: number;
}

function CoursCard({ cours, index }: CoursCardProps) {
  const colors = ['blue', 'green', 'purple', 'orange'];
  const color = colors[index % colors.length];
  
  const colorClasses = {
    blue: 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50',
    green: 'border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50',
    purple: 'border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50',
    orange: 'border-l-orange-500 bg-gradient-to-r from-orange-50 to-amber-50'
  };

  return (
    <div className={`border-l-4 ${colorClasses[color]} rounded-xl p-4 hover:shadow-sm transition-all duration-200`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-medium text-gray-900 mb-1">{cours.nom}</div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {cours.salle}
          </div>
        </div>
        <div className="px-3 py-1 bg-white bg-opacity-80 text-gray-700 text-sm rounded-full font-medium border">
          {cours.heures}h
        </div>
      </div>
    </div>
  );
}

export default function RecapHorairePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Hooks API
  const { data: reservations = [], isLoading: reservationsLoading } = useReservations();
  const { data: formations = [], isLoading: formationsLoading } = useFormations();

  // États locaux
  const [selectedSemaine, setSelectedSemaine] = useState<any>(null);
  const semaines = generateSemaines(12);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  // Initialiser avec la semaine courante
  useEffect(() => {
    if (semaines.length > 0 && !selectedSemaine) {
      setSelectedSemaine(semaines[0]); // Semaine courante
    }
  }, [semaines, selectedSemaine]);

  // Calculer les données de récap pour la semaine sélectionnée
  const recapHoraire = useMemo(() => {
    if (!selectedSemaine || !user || reservationsLoading) return null;

    // Filtrer les réservations de l'utilisateur pour cette semaine
    const reservationsUtilisateur = reservations.filter(reservation => {
      if (reservation.enseignant.idEnseignant !== user.idEnseignant) return false;
      
      const reservationDate = new Date(reservation.jour);
      return reservationDate >= selectedSemaine.debut && reservationDate <= selectedSemaine.fin;
    });

    // Calculer les heures par jour
    const heuresParJour: Record<string, number> = {
      LUNDI: 0,
      MARDI: 0,
      MERCREDI: 0,
      JEUDI: 0,
      VENDREDI: 0
    };

    const joursMapping = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

    reservationsUtilisateur.forEach(reservation => {
      const reservationDate = new Date(reservation.jour);
      const jourSemaine = joursMapping[reservationDate.getDay()];
      
      if (heuresParJour.hasOwnProperty(jourSemaine)) {
        // Calculer la durée en heures (supposons 2h par créneau)
        const heureDebut = new Date(`2000-01-01T${reservation.heureDebut}`);
        const heureFin = new Date(`2000-01-01T${reservation.heureFin}`);
        const dureeHeures = (heureFin.getTime() - heureDebut.getTime()) / (1000 * 60 * 60);
        heuresParJour[jourSemaine] += dureeHeures;
      }
    });

    const totalHeures = Object.values(heuresParJour).reduce((sum, heures) => sum + heures, 0);

    // Créer des cours fictifs à partir des réservations
    const cours = reservationsUtilisateur.map(reservation => ({
      nom: reservation.motif,
      heures: 2, // Supposons 2h par cours
      salle: reservation.salle?.nomSalle || 'Salle non définie'
    }));

    return {
      utilisateurId: user.idEnseignant.toString(),
      semaine: selectedSemaine,
      totalHeures,
      heuresParJour,
      reservations: reservationsUtilisateur,
      cours,
      formations: formations.filter(f => f.responsable.idEnseignant === user.idEnseignant)
    };
  }, [selectedSemaine, user, reservations, formations, reservationsLoading]);

  // Calculer les statistiques globales
  const statsGlobales = useMemo(() => {
    if (!user || reservationsLoading) return null;

    const aujourdhui = new Date().toISOString().split('T')[0];
    const reservationsAujourdhui = reservations.filter(r => 
      r.enseignant.idEnseignant === user.idEnseignant &&
      r.jour === aujourdhui &&
      r.statut === 'CONFIRMEE'
    ).length;

    const sallesReservees = new Set(
      reservations
        .filter(r => r.enseignant.idEnseignant === user.idEnseignant && r.statut === 'CONFIRMEE')
        .map(r => r.salle?.codeSalle)
        .filter(Boolean)
    ).size;

    const materielEmprunte = reservations.filter(r => 
      r.enseignant.idEnseignant === user.idEnseignant &&
      r.materiel &&
      r.statut === 'CONFIRMEE'
    ).length;

    const heuresSeaine = recapHoraire?.totalHeures || 0;

    return {
      reservationsAujourdhui,
      sallesReservees,
      materielEmprunte,
      heuresSeaine
    };
  }, [reservations, user, reservationsLoading, recapHoraire]);

  const exportData = () => {
    if (!recapHoraire || !user) return;

    const data = {
      utilisateur: `${user.prenomEnseignant} ${user.nomEnseignant}`,
      semaine: `${formatDate(recapHoraire.semaine.debut)} - ${formatDate(recapHoraire.semaine.fin)}`,
      totalHeures: recapHoraire.totalHeures,
      heuresParJour: recapHoraire.heuresParJour,
      cours: recapHoraire.cours,
      reservations: recapHoraire.reservations.length
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recap-horaire-${user.prenomEnseignant}-${user.nomEnseignant}-semaine-${recapHoraire.semaine.numeroSemaine}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Card rounded="xl" className={`p-8 max-w-md border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Connexion requise
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Vous devez être connecté pour accéder à votre récap horaire.
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Se connecter
              </Button>
            </div>
          </Card>
        </main>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  if (reservationsLoading || formationsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Card rounded="xl" className="p-8 text-center">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chargement de votre récap horaire
            </h3>
            <p className="text-gray-600">
              Récupération des données depuis l'API...
            </p>
          </Card>
        </main>
      </div>
    );
  }

  const joursOrdre = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];
  const joursNoms = {
    LUNDI: 'Lundi',
    MARDI: 'Mardi', 
    MERCREDI: 'Mercredi',
    JEUDI: 'Jeudi',
    VENDREDI: 'Vendredi'
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLoginClick={() => setShowAuthModal(true)} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header avec accent coloré */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  📊 Récap Horaire
                </h1>
                <p className="text-gray-600">
                  Visualisez votre planning et vos statistiques
                </p>
              </div>
              
              {recapHoraire && (
                <Button onClick={exportData} variant="outline" className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
              )}
            </div>

            {/* En-tête utilisateur avec couleur */}
            <Card rounded="xl" className={`p-6 mb-8 border-l-4 ${
              user?.role === 'RESPONSABLE' 
                ? 'border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50' 
                : 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    user?.role === 'RESPONSABLE' 
                      ? 'bg-purple-100' 
                      : 'bg-blue-100'
                  }`}>
                    {user?.role === 'RESPONSABLE' ? (
                      <Users className={`h-6 w-6 ${user?.role === 'RESPONSABLE' ? 'text-purple-600' : 'text-blue-600'}`} />
                    ) : (
                      <User className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {user?.prenomEnseignant} {user?.nomEnseignant}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {user?.role === 'RESPONSABLE' ? (
                        'Responsable • Gestion des plannings'
                      ) : (
                        'Enseignant • Planning personnel'
                      )}
                    </p>
                    {user?.specialite && (
                      <p className="text-xs text-gray-500">📚 {user.specialite}</p>
                    )}
                  </div>
                </div>

                <div className="w-64">
                  <Select
                    label="Semaine"
                    value={selectedSemaine?.id || ''}
                    onChange={(e) => {
                      const semaine = semaines.find(s => s.id === e.target.value);
                      if (semaine) setSelectedSemaine(semaine);
                    }}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    options={semaines.map(semaine => ({
                      value: semaine.id,
                      label: `Semaine ${semaine.numeroSemaine} (${formatDate(semaine.debut)})`
                    }))}
                  />
                </div>
              </div>
            </Card>

            {/* Statistiques avec couleurs subtiles */}
            {statsGlobales && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Cours aujourd'hui"
                  value={statsGlobales.reservationsAujourdhui}
                  subtitle="Sessions prévues"
                  icon={<Calendar />}
                  color="blue"
                  trend="neutral"
                />
                
                <StatCard
                  title="Salles réservées"
                  value={statsGlobales.sallesReservees}
                  subtitle="Espaces utilisés"
                  icon={<MapPin />}
                  color="green"
                  trend="up"
                />
                
                <StatCard
                  title="Matériel emprunté"
                  value={statsGlobales.materielEmprunte}
                  subtitle="Équipements actifs"
                  icon={<BookOpen />}
                  color="purple"
                  trend="neutral"
                />
                
                <StatCard
                  title="Heures semaine"
                  value={`${statsGlobales.heuresSeaine}h`}
                  subtitle="Temps d'enseignement"
                  icon={<Clock />}
                  color="orange"
                  trend="up"
                />
              </div>
            )}

            {recapHoraire ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Planning hebdomadaire avec thèmes colorés */}
                <div className="lg:col-span-2">
                  <Card 
                    title={`Planning - Semaine ${recapHoraire.semaine.numeroSemaine}`}
                    rounded="xl"
                    className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50"
                  >
                    <div className="space-y-6">
                      {joursOrdre.map(jour => {
                        const theme = joursThemes[jour as keyof typeof joursThemes];
                        const heuresJour = recapHoraire.heuresParJour[jour] || 0;
                        
                        return (
                          <div key={jour} className={`border-l-4 ${theme.borderColor} ${theme.bgColor} rounded-xl p-4 border-b border-gray-100 pb-6 last:border-b-0`}>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-medium text-gray-900 text-lg">
                                {theme.nom}
                              </h3>
                              <div className={`text-sm px-3 py-1 rounded-full font-medium ${theme.badgeColor}`}>
                                {heuresJour}h de cours
                              </div>
                            </div>

                            {heuresJour > 0 ? (
                              <div className="space-y-3">
                                {recapHoraire.reservations
                                  .filter(res => {
                                    const resDate = new Date(res.jour);
                                    const joursMapping = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
                                    return joursMapping[resDate.getDay()] === jour;
                                  })
                                  .slice(0, 3)
                                  .map(res => (
                                    <div key={res.numero} className="flex items-center justify-between p-4 bg-white bg-opacity-80 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow duration-200">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                                          <BookOpen className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div>
                                          <div className="font-medium text-gray-900">{res.motif}</div>
                                          <div className="text-sm text-gray-600 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {res.salle?.nomSalle || res.materiel ? 'Matériel' : 'Non défini'}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-sm text-gray-600 font-medium">
                                        {res.heureDebut} - {res.heureFin}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-400">
                                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">Aucun cours prévu</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* Sidebar avec couleurs */}
                <div className="space-y-6">
                  {/* Résumé */}
                  <Card 
                    title="Résumé hebdomadaire"
                    rounded="xl"
                    className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white bg-opacity-80 rounded-xl border border-green-200">
                        <span className="text-gray-700 font-medium flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          Total heures :
                        </span>
                        <span className="font-semibold text-xl text-gray-900">{recapHoraire.totalHeures}h</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700 mb-3">Répartition par jour</div>
                        {joursOrdre.map(jour => {
                          const theme = joursThemes[jour as keyof typeof joursThemes];
                          const heures = recapHoraire.heuresParJour[jour] || 0;
                          
                          return (
                            <div key={jour} className="flex items-center justify-between py-2 px-3 rounded-xl bg-white bg-opacity-60">
                              <span className="text-sm text-gray-600">
                                {theme.nom}
                              </span>
                              <span className={`text-sm font-medium px-2 py-1 rounded ${theme.badgeColor}`}>
                                {heures}h
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Réservations actives</span>
                          <span className="font-medium text-gray-900">{recapHoraire.reservations.length}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Cours dispensés */}
                  <Card 
                    title="Cours dispensés"
                    rounded="xl"
                    className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50"
                  >
                    {recapHoraire.cours.length > 0 ? (
                      <div className="space-y-3">
                        {recapHoraire.cours.slice(0, 5).map((cours, index) => (
                          <CoursCard key={index} cours={cours} index={index} />
                        ))}
                        {recapHoraire.cours.length > 5 && (
                          <div className="text-center py-2 text-sm text-gray-500">
                            ... et {recapHoraire.cours.length - 5} autres cours
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Aucun cours cette semaine</p>
                      </div>
                    )}
                  </Card>

                  {/* Formations responsables */}
                  {recapHoraire.formations && recapHoraire.formations.length > 0 && (
                    <Card 
                      title="Formations sous votre responsabilité"
                      rounded="xl"
                      className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50"
                    >
                      <div className="space-y-3">
                        {recapHoraire.formations.slice(0, 3).map((formation) => (
                          <div key={formation.idFormation} className="p-3 bg-white bg-opacity-80 rounded-xl border border-blue-200">
                            <div className="font-medium text-gray-900 mb-1">{formation.nomFormation}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formation.dureeHeures}h
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {formation.niveau}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Actions responsable */}
                  {user?.role === 'RESPONSABLE' && (
                    <Card 
                      title="Actions"
                      rounded="xl"
                      className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-amber-50"
                    >
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                          <Users className="h-4 w-4" />
                          Voir autres enseignants
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2 border-green-200 text-green-600 hover:bg-green-50">
                          <BarChart3 className="h-4 w-4" />
                          Rapport global
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2 border-purple-200 text-purple-600 hover:bg-purple-50">
                          <Calendar className="h-4 w-4" />
                          Modifier planning
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card rounded="xl" className="text-center py-16 border-l-4 border-l-gray-400 bg-gradient-to-r from-gray-50 to-slate-50">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune donnée disponible
                </h3>
                <p className="text-gray-600">
                  Sélectionnez une semaine pour voir votre récap horaire
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