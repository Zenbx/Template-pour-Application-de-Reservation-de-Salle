// src/hooks/useRecapHoraire.ts
'use client';

import { useState, useEffect, useMemo } from 'react';
import { RecapHoraire, Semaine } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useReservations } from '@/hooks/useReservations';
import { generateSemaines, creneauxHoraires } from '@/lib/data';
import { calculateDuration, isDateInRange } from '@/lib/utils';

export function useRecapHoraire() {
  const { user } = useAuth();
  const { userReservations } = useReservations();
  const [selectedSemaine, setSelectedSemaine] = useState<Semaine | null>(null);
  const [semaines] = useState(() => generateSemaines(12));

  // Sélectionner la semaine actuelle par défaut
  useEffect(() => {
    if (semaines.length > 0 && !selectedSemaine) {
      setSelectedSemaine(semaines[0]);
    }
  }, [semaines, selectedSemaine]);

  // Calculer le récap pour la semaine sélectionnée
  const recapHoraire = useMemo((): RecapHoraire | null => {
    if (!user || !selectedSemaine) return null;

    // Filtrer les réservations de la semaine
    const reservationsSemaine = userReservations.filter(res => 
      res.statut === 'CONFIRMEE' &&
      isDateInRange(res.date, selectedSemaine.debut, selectedSemaine.fin)
    );

    // Calculer les heures par jour
    const heuresParJour: { [jour: string]: number } = {
      'LUNDI': 0,
      'MARDI': 0,
      'MERCREDI': 0,
      'JEUDI': 0,
      'VENDREDI': 0
    };

    let totalHeures = 0;

    reservationsSemaine.forEach(res => {
      if (res.type === 'SALLE' && res.creneauId) {
        const creneau = creneauxHoraires.find(c => c.id === res.creneauId);
        if (creneau) {
          const duree = calculateDuration(creneau.heureDebut, creneau.heureFin);
          heuresParJour[creneau.jour] += duree;
          totalHeures += duree;
        }
      }
    });

    // Simuler des cours (données de test)
    const cours = reservationsSemaine
      .filter(res => res.type === 'SALLE')
      .map(res => {
        const creneau = creneauxHoraires.find(c => c.id === res.creneauId);
        const duree = creneau ? calculateDuration(creneau.heureDebut, creneau.heureFin) : 2;
        
        return {
          nom: res.motif,
          heures: duree,
          salle: res.salleId || 'Non définie'
        };
      });

    return {
      utilisateurId: user.id,
      semaine: selectedSemaine,
      totalHeures,
      heuresParJour,
      reservations: reservationsSemaine,
      cours
    };
  }, [user, selectedSemaine, userReservations]);

  // Calculer les statistiques globales
  const statsGlobales = useMemo(() => {
    if (!user) return null;

    const reservationsActives = userReservations.filter(res => res.statut === 'CONFIRMEE');
    const reservationsAujourdhui = reservationsActives.filter(res => {
      const today = new Date();
      return res.date.toDateString() === today.toDateString();
    });

    const sallesReservees = new Set(
      reservationsActives
        .filter(res => res.type === 'SALLE')
        .map(res => res.salleId)
    ).size;

    const materielEmprunte = reservationsActives.filter(res => res.type === 'MATERIEL').length;

    return {
      reservationsAujourdhui: reservationsAujourdhui.length,
      sallesReservees,
      materielEmprunte,
      heuresSeaine: recapHoraire?.totalHeures || 0
    };
  }, [user, userReservations, recapHoraire]);

  return {
    recapHoraire,
    statsGlobales,
    semaines,
    selectedSemaine,
    setSelectedSemaine
  };
}