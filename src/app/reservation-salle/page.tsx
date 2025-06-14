// src/app/reservation-salle/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReservation } from '@/hooks/useReservations';
import { useSalles } from '@/hooks/useSalles';
import { useToast } from '@/hooks/useToast';
import { salles, creneauxHoraires } from '@/lib/data';
import { CreateReservationRequest } from '@/types';

interface ReservationSalleData {
  salleCode: string;
  date: Date;
  heureDebut: string;
  heureFin: string;
  motif: string;
  nombreParticipants: number;
  commentaire?: string;
}

export default function ReservationSallePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { data: sallesAPI = [] } = useSalles();
  const createReservationMutation = useCreateReservation();
  const { warning, success, error } = useToast();

  // Utiliser les salles de l'API ou les données mockées
  const sallesF = sallesAPI.length > 0 ? sallesAPI : salles;

  const [formData, setFormData] = useState<Partial<ReservationSalleData>>({
    date: new Date(),
    nombreParticipants: 1
  });

  const [filtres, setFiltres] = useState({
    capaciteMin: '',
    type: '',
    equipement: ''
  });

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.salleCode || !formData.heureDebut || !formData.heureFin || !formData.date || !formData.motif) {
      warning('Attention', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!user) {
      error('Erreur', 'Utilisateur non connecté');
      return;
    }

    // Vérifier que l'heure de fin est après l'heure de début
    if (formData.heureDebut >= formData.heureFin) {
      warning('Attention', 'L\'heure de fin doit être postérieure à l\'heure de début');
      return;
    }

    try {
      const reservationData: CreateReservationRequest = {
        jour: formData.date.toISOString().split('T')[0],
        heureDebut: formData.heureDebut,
        heureFin: formData.heureFin,
        motif: formData.motif,
        nombreParticipants: formData.nombreParticipants || 1,
        enseignantId: user.idEnseignant,
        salleCode: formData.salleCode
      };

      await createReservationMutation.mutateAsync(reservationData);
      
      // Réinitialiser le formulaire
      setFormData({
        date: new Date(),
        nombreParticipants: 1
      });
      
      success('Succès', 'Réservation créée avec succès !');
    } catch (err: any) {
      error('Erreur', err.message || 'Erreur lors de la création de la réservation');
    }
  };

  const sallesFiltrees = sallesF.filter(salle => {
    if (filtres.capaciteMin && salle.capacite < parseInt(filtres.capaciteMin)) return false;
    if (filtres.type && salle.typeSalle !== filtres.type) return false;
    if (filtres.equipement && !salle.equipements.toLowerCase().includes(filtres.equipement.toLowerCase())) return false;
    return true;
  });

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push({ value: timeString, label: timeString });
      }
    }
    return options;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md" rounded="3xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Connexion requise</h2>
              <p className="text-gray-600 mb-6">
                Vous devez être connecté pour accéder aux réservations de salles.
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar onLoginClick={() => setShowAuthModal(true)} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🏢</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Réservation de Salle</h1>
                  <p className="text-blue-100 mt-2">Réservez facilement vos espaces de travail</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulaire de réservation stylé */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Section Filtres */}
                <Card 
                  title="🔍 Filtrer les salles" 
                  rounded="2xl" 
                  className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Capacité minimum"
                      type="number"
                      value={filtres.capaciteMin}
                      onChange={(e) => setFiltres(prev => ({
                        ...prev, 
                        capaciteMin: e.target.value
                      }))}
                      placeholder="Ex: 30"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                    />
                    <Select
                      label="Type de salle"
                      value={filtres.type}
                      onChange={(e) => setFiltres(prev => ({
                        ...prev, 
                        type: e.target.value
                      }))}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                      options={[
                        { value: '', label: 'Tous les types' },
                        { value: 'Amphithéâtre', label: '🎭 Amphithéâtre' },
                        { value: 'Salle TP', label: '💻 Salle TP' },
                        { value: 'Salle de cours', label: '📚 Salle de cours' },
                        { value: 'Laboratoire', label: '🧪 Laboratoire' }
                      ]}
                    />
                    <Input
                      label="Équipement recherché"
                      value={filtres.equipement}
                      onChange={(e) => setFiltres(prev => ({
                        ...prev, 
                        equipement: e.target.value
                      }))}
                      placeholder="Ex: Vidéoprojecteur"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                    />
                  </div>
                </Card>

                {/* Section Sélection de salle */}
                <Card 
                  title="🏛️ Sélection de la salle" 
                  rounded="2xl"
                  className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
                >
                  <Select
                    label="Salle disponible *"
                    value={formData.salleCode || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev, 
                      salleCode: e.target.value
                    }))}
                    className="border-green-200 focus:border-green-500 focus:ring-green-200"
                    options={[
                      { value: '', label: 'Sélectionner une salle...' },
                      ...sallesFiltrees.map(salle => ({
                        value: salle.codeSalle,
                        label: `${salle.nomSalle} (${salle.capacite} places) - ${salle.typeSalle}`
                      }))
                    ]}
                  />
                  
                  {sallesFiltrees.length === 0 && (
                    <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                      <p className="text-orange-700 text-sm">
                        ⚠️ Aucune salle ne correspond à vos critères de recherche
                      </p>
                    </div>
                  )}
                </Card>

                {/* Section Date et Horaires */}
                <Card 
                  title="📅 Date et créneaux horaires" 
                  rounded="2xl"
                  className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Date de réservation *"
                      type="date"
                      value={formData.date ? formData.date.toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev, 
                        date: new Date(e.target.value)
                      }))}
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-200"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    
                    <Select
                      label="Heure de début *"
                      value={formData.heureDebut || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev, 
                        heureDebut: e.target.value
                      }))}
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-200"
                      options={[
                        { value: '', label: 'Heure de début...' },
                        ...generateTimeOptions()
                      ]}
                    />

                    <Select
                      label="Heure de fin *"
                      value={formData.heureFin || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev, 
                        heureFin: e.target.value
                      }))}
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-200"
                      options={[
                        { value: '', label: 'Heure de fin...' },
                        ...generateTimeOptions()
                      ]}
                    />
                  </div>
                </Card>

                {/* Section Détails */}
                <Card 
                  title="📝 Détails de la réservation" 
                  rounded="2xl"
                  className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50"
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Motif de la réservation *"
                        value={formData.motif || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          motif: e.target.value
                        }))}
                        placeholder="Ex: Cours de Mathématiques, Réunion équipe..."
                        className="border-orange-200 focus:border-orange-500 focus:ring-orange-200"
                      />

                      <Input
                        label="Nombre de participants *"
                        type="number"
                        min="1"
                        value={formData.nombreParticipants || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          nombreParticipants: parseInt(e.target.value) || 1
                        }))}
                        placeholder="Ex: 25"
                        className="border-orange-200 focus:border-orange-500 focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <label className="form-label">Commentaire (optionnel)</label>
                      <textarea
                        value={formData.commentaire || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          commentaire: e.target.value
                        }))}
                        placeholder="Informations supplémentaires, besoins spécifiques..."
                        rows={3}
                        className="w-full px-4 py-3 border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 font-poppins transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>
                </Card>

                {/* Bouton de soumission */}
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    onClick={handleSubmit}
                    isLoading={createReservationMutation.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    {createReservationMutation.isPending ? (
                      <>🔄 Traitement en cours...</>
                    ) : (
                      <>✨ Confirmer la réservation</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Panneau d'information de la salle */}
              <div className="space-y-6">
                {formData.salleCode ? (
                  <Card 
                    title="🏛️ Détails de la salle" 
                    rounded="2xl"
                    className="sticky top-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200"
                    hover
                  >
                    {(() => {
                      const salle = salles.find(s => s.codeSalle === formData.salleCode);
                      if (!salle) return null;

                      return (
                        <div className="space-y-6">
                          {/* Info principale */}
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white">
                            <h4 className="font-bold text-lg">{salle.nomSalle}</h4>
                            <div className="flex items-center space-x-4 mt-2 text-blue-100">
                              <span>🏢 {salle.typeSalle}</span>
                              <span>👥 {salle.capacite} places</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-blue-100">
                              <span>🏗️ {salle.batiment}</span>
                              <span>📊 {salle.etage}</span>
                            </div>
                          </div>
                          
                          {/* Équipements */}
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                              ⚙️ Équipements disponibles
                            </h5>
                            <div className="grid grid-cols-1 gap-2">
                              {salle.equipements.split(', ').map((eq, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-xl"
                                >
                                  <span className="text-green-600">✅</span>
                                  <span className="text-green-700 text-sm font-medium">{eq}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Validation capacité */}
                          {formData.nombreParticipants && (
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                                📊 Validation de capacité
                              </h5>
                              <div className={`p-4 rounded-2xl border-2 ${
                                formData.nombreParticipants <= salle.capacite
                                  ? 'bg-green-50 border-green-300 text-green-800'
                                  : 'bg-red-50 border-red-300 text-red-800'
                              }`}>
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">
                                    {formData.nombreParticipants <= salle.capacite ? '✅' : '⚠️'}
                                  </span>
                                  <div>
                                    <div className="font-semibold">
                                      {formData.nombreParticipants} / {salle.capacite} participants
                                    </div>
                                    <div className="text-sm opacity-80">
                                      {formData.nombreParticipants <= salle.capacite
                                        ? 'Capacité suffisante'
                                        : 'Capacité dépassée'
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </Card>
                ) : (
                  <Card 
                    title="💡 Guide de réservation" 
                    rounded="2xl"
                    className="sticky top-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200"
                  >
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-600 text-lg">1️⃣</span>
                        <div>
                          <div className="font-medium text-yellow-800">Filtrez les salles</div>
                          <div className="text-yellow-600">Utilisez les filtres pour trouver la salle idéale</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-600 text-lg">2️⃣</span>
                        <div>
                          <div className="font-medium text-yellow-800">Sélectionnez une salle</div>
                          <div className="text-yellow-600">Choisissez parmi les salles disponibles</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-600 text-lg">3️⃣</span>
                        <div>
                          <div className="font-medium text-yellow-800">Définissez les horaires</div>
                          <div className="text-yellow-600">Sélectionnez la date et les créneaux</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-600 text-lg">4️⃣</span>
                        <div>
                          <div className="font-medium text-yellow-800">Confirmez la réservation</div>
                          <div className="text-yellow-600">Remplissez les détails et validez</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
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