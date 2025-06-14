// src/hooks/useRecapHoraire.ts
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useReservationsByEnseignant } from '@/hooks/useReservations';
import { generateSemaines, creneauxHoraires } from '@/lib/data';
import { Semaine, RecapHoraire } from '@/types'
import { calculateDuration, isDateInRange } from '@/lib/utils';

export function useRecapHoraire() {
  const { user } = useAuth();
  const [selectedSemaine, setSelectedSemaine] = useState<Semaine | null>(null);
  const [semaines] = useState(() => generateSemaines(12));

  // Récupérer les réservations de l'utilisateur connecté
  const { data: userReservations = [], isLoading, error } = useReservationsByEnseignant(
    user?.idEnseignant || 0
  );

  // Sélectionner la semaine actuelle par défaut
  useEffect(() => {
    if (semaines.length > 0 && !selectedSemaine) {
      setSelectedSemaine(semaines[0]);
    }
  }, [semaines, selectedSemaine]);

  // Calculer le récap pour la semaine sélectionnée
  const recapHoraire = useMemo((): RecapHoraire | null => {
    if (!user || !selectedSemaine || !userReservations) return null;

    // Filtrer les réservations de la semaine
    const reservationsSemaine = userReservations.filter(res => 
      res.statut === 'CONFIRMEE' &&
      isDateInRange(res.jour, selectedSemaine.debut, selectedSemaine.fin)
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
      if (res.salle) {
        const duree = calculateDuration(res.heureDebut, res.heureFin);
        
        // Convertir la date en jour de la semaine
        const resDate = new Date(res.jour);
        const jourSemaine = resDate.toLocaleDateString('fr-FR', { weekday: 'long' }).toUpperCase();
        
        // Mapper les jours français vers notre format
        const jourMapping: { [key: string]: string } = {
          'LUNDI': 'LUNDI',
          'MARDI': 'MARDI',
          'MERCREDI': 'MERCREDI',
          'JEUDI': 'JEUDI',
          'VENDREDI': 'VENDREDI'
        };

        const jour = jourMapping[jourSemaine];
        if (jour && heuresParJour[jour] !== undefined) {
          heuresParJour[jour] += duree;
          totalHeures += duree;
        }
      }
    });

    // Générer la liste des cours
    const cours = reservationsSemaine
      .filter(res => res.salle)
      .map(res => {
        const duree = calculateDuration(res.heureDebut, res.heureFin);
        
        return {
          nom: res.motif,
          heures: duree,
          salle: res.salle?.codeSalle || 'Non définie'
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
    if (!user || !userReservations) return null;

    const reservationsActives = userReservations.filter(res => res.statut === 'CONFIRMEE');
    
    // Réservations d'aujourd'hui
    const reservationsAujourdhui = reservationsActives.filter(res => {
      const today = new Date();
      const resDate = new Date(res.jour);
      return resDate.toDateString() === today.toDateString();
    });

    // Compter les salles uniques réservées
    const sallesReservees = new Set(
      reservationsActives
        .filter(res => res.salle)
        .map(res => res.salle?.codeSalle)
        .filter(Boolean)
    ).size;

    // Compter le matériel emprunté
    const materielEmprunte = reservationsActives.filter(res => res.materiel).length;

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
    setSelectedSemaine,
    isLoading,
    error
  };
}