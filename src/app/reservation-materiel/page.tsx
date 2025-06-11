// src/app/reservation-materiel/page.tsx (VERSION CONNECTÉE À L'API)
'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { useReservations, useCreateReservation } from '@/hooks/useReservations';
import { useMateriel } from '@/hooks/useMateriel';
import { useFormations } from '@/hooks/useFormations';
import { useToast } from '@/hooks/useToast';
import { CreateReservationRequest, MaterielSimple } from '@/types';
import { Package, Wifi, Camera, FlaskConical, Table, Loader2 } from 'lucide-react';

const typeIcons = {
  ORDINATEUR: Wifi,
  VIDEO_PROJECTEUR: Camera,
  LABORATOIRE: FlaskConical,
  MOBILIER: Table,
  INFORMATIQUE: Wifi,
  AUDIOVISUEL: Camera
};

const typeColors = {
  ORDINATEUR: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border-blue-300',
  VIDEO_PROJECTEUR: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800 border-purple-300',
  INFORMATIQUE: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border-blue-300',
  AUDIOVISUEL: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800 border-purple-300',
  LABORATOIRE: 'bg-gradient-to-br from-green-100 to-green-200 text-green-800 border-green-300',
  MOBILIER: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800 border-orange-300'
};

const typeAccents = {
  ORDINATEUR: 'blue',
  VIDEO_PROJECTEUR: 'purple',
  INFORMATIQUE: 'blue',
  AUDIOVISUEL: 'purple',
  LABORATOIRE: 'green',
  MOBILIER: 'orange'
};

export default function ReservationMaterielPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { warning } = useToast();

  // Hooks API
  const { data: materielList = [], isLoading: materielLoading } = useMateriel();
  const { data: formations = [] } = useFormations();
  const createReservation = useCreateReservation();

  const [formData, setFormData] = useState({
    materielCode: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    motif: '',
    commentaire: '',
    formationId: ''
  });

  const [filtres, setFiltres] = useState({
    type: '',
    recherche: ''
  });

  const [selectedMateriel, setSelectedMateriel] = useState<MaterielSimple | null>(null);

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.materielCode || !formData.dateDebut || !formData.dateFin || !formData.motif) {
      warning('Attention', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (new Date(formData.dateFin) <= new Date(formData.dateDebut)) {
      warning('Attention', 'La date de fin doit être postérieure à la date de début');
      return;
    }

    if (!selectedMateriel || !selectedMateriel.disponibilite) {
      warning('Attention', 'Matériel non disponible');
      return;
    }

    try {
      // Créer une réservation adaptée à notre API
      const reservationData: CreateReservationRequest = {
        jour: formData.dateDebut,
        heureDebut: '08:00', // Heure par défaut
        heureFin: '18:00',   // Heure par défaut
        motif: formData.motif,
        nombreParticipants: 1,
        enseignantId: user!.idEnseignant,
        materielCode: formData.materielCode,
        formationId: formData.formationId ? parseInt(formData.formationId) : undefined
      };

      await createReservation.mutateAsync(reservationData);
      
      // Réinitialiser le formulaire
      setFormData({
        materielCode: '',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        motif: '',
        commentaire: '',
        formationId: ''
      });
      setSelectedMateriel(null);
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
    }
  };

  // Filtrer le matériel
  const materielsFiltres = materielList.filter(materiel => {
    if (filtres.type && materiel.type !== filtres.type) return false;
    if (filtres.recherche) {
      const searchLower = filtres.recherche.toLowerCase();
      return (
        materiel.marque?.toLowerCase().includes(searchLower) ||
        materiel.modele?.toLowerCase().includes(searchLower) ||
        materiel.codeMateriel.toLowerCase().includes(searchLower)
      );
    }
    return materiel.disponibilite; // Afficher seulement le matériel disponible
  });

  const handleMaterielSelect = (materielCode: string) => {
    const materiel = materielList.find(m => m.codeMateriel === materielCode);
    setSelectedMateriel(materiel || null);
    setFormData(prev => ({
      ...prev,
      materielCode
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md" rounded="3xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💻</span>
              </div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Connexion requise</h2>
              <p className="text-gray-600 mb-6">
                Vous devez être connecté pour accéder aux réservations de matériel.
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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

  if (materielLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Card rounded="xl" className="p-8 text-center">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-purple-500 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chargement du matériel
            </h3>
            <p className="text-gray-600">
              Récupération des équipements disponibles...
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Sidebar onLoginClick={() => setShowAuthModal(true)} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">💻</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Réservation de Matériel</h1>
                  <p className="text-purple-100 mt-2">Empruntez le matériel dont vous avez besoin</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-purple-100">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">{materielList.length} équipements chargés</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-100">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">
                        {materielList.filter(m => m.disponibilite).length} disponibles
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Section matériels */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Filtres */}
                <Card 
                  title="🔍 Filtrer le matériel" 
                  rounded="2xl"
                  className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Type de matériel"
                      value={filtres.type}
                      onChange={(e) => setFiltres(prev => ({
                        ...prev, 
                        type: e.target.value
                      }))}
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-200"
                      options={[
                        { value: '', label: 'Tous les types' },
                        { value: 'ORDINATEUR', label: '💻 Ordinateurs' },
                        { value: 'VIDEO_PROJECTEUR', label: '📹 Vidéoprojecteurs' },
                        { value: 'INFORMATIQUE', label: '💻 Informatique' },
                        { value: 'AUDIOVISUEL', label: '📹 Audiovisuel' }
                      ]}
                    />
                    <Input
                      label="Recherche"
                      value={filtres.recherche}
                      onChange={(e) => setFiltres(prev => ({
                        ...prev, 
                        recherche: e.target.value
                      }))}
                      placeholder="Marque, modèle, code..."
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-200"
                    />
                  </div>
                </Card>

                {/* Catalogue de matériels */}
                <Card 
                  title={`📦 Catalogue de matériels (${materielsFiltres.length})`}
                  rounded="2xl"
                  className="border-l-4 border-l-indigo-500"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {materielsFiltres.map(materiel => {
                      const Icon = typeIcons[materiel.type as keyof typeof typeIcons] || Package;
                      const isSelected = selectedMateriel?.codeMateriel === materiel.codeMateriel;
                      const accent = typeAccents[materiel.type as keyof typeof typeAccents] || 'gray';
                      
                      return (
                        <div
                          key={materiel.codeMateriel}
                          className={`group border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                            isSelected 
                              ? `border-${accent}-400 bg-gradient-to-br from-${accent}-50 to-${accent}-100 shadow-lg` 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          onClick={() => handleMaterielSelect(materiel.codeMateriel)}
                        >
                          <div className="space-y-4">
                            {/* En-tête avec icône */}
                            <div className="flex items-start justify-between">
                              <div className={`p-3 rounded-2xl border ${typeColors[materiel.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                <Icon className="h-6 w-6" />
                              </div>
                              
                              <div className="text-right">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  materiel.disponibilite 
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {materiel.disponibilite ? '✅ Disponible' : '❌ Indisponible'}
                                </div>
                              </div>
                            </div>
                            
                            {/* Informations */}
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg group-hover:text-gray-800 mb-2">
                                {materiel.marque} {materiel.modele}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Code: {materiel.codeMateriel}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>📍 {materiel.localisation}</span>
                                <span>•</span>
                                <span>📅 {materiel.dateAcquisition}</span>
                              </div>
                            </div>
                            
                            {/* Footer avec type */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${typeColors[materiel.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-700'} border`}>
                                {materiel.type.toLowerCase()}
                              </span>
                              
                              {isSelected && (
                                <div className="flex items-center space-x-1 text-blue-600">
                                  <span className="text-lg">✅</span>
                                  <span className="text-sm font-medium">Sélectionné</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {materielsFiltres.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Package className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun matériel trouvé</h3>
                      <p className="text-gray-500">
                        {filtres.recherche || filtres.type 
                          ? 'Essayez de modifier vos critères de recherche'
                          : 'Aucun équipement disponible pour le moment'
                        }
                      </p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Panneau de réservation */}
              <div className="space-y-6">
                {selectedMateriel ? (
                  <>
                    {/* Résumé du matériel */}
                    <Card 
                      title="📋 Matériel sélectionné" 
                      rounded="2xl"
                      className="sticky top-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200"
                      hover
                    >
                      <div className="space-y-6">
                        {/* Info principale */}
                        <div className={`bg-gradient-to-r from-${typeAccents[selectedMateriel.type as keyof typeof typeAccents] || 'gray'}-500 to-${typeAccents[selectedMateriel.type as keyof typeof typeAccents] || 'gray'}-600 rounded-2xl p-6 text-white`}>
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                              {React.createElement(typeIcons[selectedMateriel.type as keyof typeof typeIcons] || Package, { className: "h-6 w-6" })}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{selectedMateriel.marque} {selectedMateriel.modele}</h4>
                              <p className={`text-${typeAccents[selectedMateriel.type as keyof typeof typeAccents] || 'gray'}-100 text-sm`}>
                                {selectedMateriel.type.toLowerCase()}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Code</div>
                              <div className="text-white text-opacity-90">{selectedMateriel.codeMateriel}</div>
                            </div>
                            <div>
                              <div className="font-medium">État</div>
                              <div className="text-white text-opacity-90">{selectedMateriel.etat}</div>
                            </div>
                            <div>
                              <div className="font-medium">Localisation</div>
                              <div className="text-white text-opacity-90">{selectedMateriel.localisation}</div>
                            </div>
                            <div>
                              <div className="font-medium">Acquisition</div>
                              <div className="text-white text-opacity-90">{selectedMateriel.dateAcquisition}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Disponibilité */}
                        <div className={`border rounded-2xl p-4 ${
                          selectedMateriel.disponibilite 
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-semibold ${
                                selectedMateriel.disponibilite ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {selectedMateriel.disponibilite ? 'Équipement disponible' : 'Équipement indisponible'}
                              </div>
                              <div className={`text-sm ${
                                selectedMateriel.disponibilite ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {selectedMateriel.disponibilite 
                                  ? 'Prêt à être emprunté'
                                  : 'Non disponible pour l\'emprunt'
                                }
                              </div>
                            </div>
                            <div className="text-2xl">
                              {selectedMateriel.disponibilite ? '✅' : '❌'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Formulaire de réservation */}
                    <Card 
                      title="✨ Détails de la réservation" 
                      rounded="2xl"
                      className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
                    >
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Date de début *"
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.dateDebut}
                            onChange={(e) => setFormData(prev => ({
                              ...prev, 
                              dateDebut: e.target.value
                            }))}
                            className="border-green-200 focus:border-green-500 focus:ring-green-200"
                          />

                          <Input
                            label="Date de fin *"
                            type="date"
                            min={formData.dateDebut}
                            value={formData.dateFin}
                            onChange={(e) => setFormData(prev => ({
                              ...prev, 
                              dateFin: e.target.value
                            }))}
                            className="border-green-200 focus:border-green-500 focus:ring-green-200"
                          />
                        </div>

                        {/* Formation (optionnel) */}
                        <Select
                          label="Formation associée (optionnel)"
                          value={formData.formationId}
                          onChange={(e) => setFormData(prev => ({
                            ...prev, 
                            formationId: e.target.value
                          }))}
                          className="border-green-200 focus:border-green-500 focus:ring-green-200"
                          options={[
                            { value: '', label: 'Aucune formation' },
                            ...formations.map(formation => ({
                              value: formation.idFormation.toString(),
                              label: `${formation.nomFormation} (${formation.niveau})`
                            }))
                          ]}
                        />

                        {/* Motif */}
                        <Input
                          label="Motif de l'emprunt *"
                          value={formData.motif}
                          onChange={(e) => setFormData(prev => ({
                            ...prev, 
                            motif: e.target.value
                          }))}
                          placeholder="Ex: Présentation projet, Formation..."
                          className="border-green-200 focus:border-green-500 focus:ring-green-200"
                        />

                        {/* Commentaire */}
                        <div>
                          <label className="form-label">Commentaire (optionnel)</label>
                          <textarea
                            value={formData.commentaire}
                            onChange={(e) => setFormData(prev => ({
                              ...prev, 
                              commentaire: e.target.value
                            }))}
                            placeholder="Besoins spécifiques, conditions d'utilisation..."
                            rows={3}
                            className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 font-poppins transition-all duration-200 resize-none"
                          />
                        </div>

                        {/* Durée calculée */}
                        {formData.dateDebut && formData.dateFin && (
                          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-blue-600 text-lg">📅</span>
                              <div>
                                <div className="font-semibold text-blue-800">
                                  Durée de l'emprunt
                                </div>
                                <div className="text-sm text-blue-600">
                                  {Math.ceil((new Date(formData.dateFin).getTime() - new Date(formData.dateDebut).getTime()) / (1000 * 60 * 60 * 24))} jour(s)
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bouton de soumission */}
                        <Button 
                          type="submit" 
                          isLoading={createReservation.isPending}
                          size="lg"
                          className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                          disabled={!selectedMateriel?.disponibilite}
                        >
                          {createReservation.isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Traitement en cours...
                            </>
                          ) : (
                            <>🎯 Confirmer l'emprunt</>
                          )}
                        </Button>
                      </form>
                    </Card>
                  </>
                ) : (
                  <Card 
                    title="💡 Guide d'emprunt" 
                    rounded="2xl"
                    className="sticky top-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200"
                  >
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-600 text-lg">1️⃣</span>
                        <div>
                          <div className="font-medium text-yellow-800">Filtrez le matériel</div>
                          <div className="text-yellow-600">Utilisez les filtres pour trouver ce dont vous avez besoin</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-600 text-lg">2️⃣</span>
                        <div>
                          <div className="font-medium text-yellow-800">Sélectionnez un équipement</div>
                          <div className="text-yellow-600">Cliquez sur l'équipement souhaité dans le catalogue</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-600 text-lg">3️⃣</span>
                        <div>
                          <div className="font-medium text-yellow-800">Définissez la période</div>
                          <div className="text-yellow-600">Choisissez les dates de début et fin d'emprunt</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-600 text-lg">4️⃣</span>
                        <div>
                          <div className="font-medium text-yellow-800">Confirmez l'emprunt</div>
                          <div className="text-yellow-600">Remplissez les détails et validez</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                      <div className="flex items-center space-x-2 text-orange-700">
                        <span className="text-lg">ℹ️</span>
                        <div>
                          <div className="font-medium">Informations techniques</div>
                          <div className="text-sm">
                            Données synchronisées avec l'API • {materielList.length} équipements disponibles
                          </div>
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