// src/app/gestion-enseignants/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  useEnseignants, 
  useCreateEnseignant, 
  useUpdateEnseignant, 
  useDeleteEnseignant 
} from '@/hooks/useEnseignants';
import { 
  EnseignantDTO, 
  CreateEnseignantRequest, 
  UpdateEnseignantRequest 
} from '@/types';
import { Plus, Edit, Trash2, Mail, Phone, MapPin, Users, Search, Loader2 } from 'lucide-react';

interface EnseignantFormData {
  nomEnseignant: string;
  prenomEnseignant: string;
  email: string;
  telephone?: string;
  specialite?: string;
}

function EnseignantModal({ 
  isOpen, 
  onClose, 
  enseignant, 
  onSave 
}: {
  isOpen: boolean;
  onClose: () => void;
  enseignant?: EnseignantDTO | null;
  onSave: (data: EnseignantFormData) => void;
}) {
  const [formData, setFormData] = useState<EnseignantFormData>({
    nomEnseignant: '',
    prenomEnseignant: '',
    email: '',
    telephone: '',
    specialite: ''
  });

  useEffect(() => {
    if (enseignant) {
      setFormData({
        nomEnseignant: enseignant.nomEnseignant,
        prenomEnseignant: enseignant.prenomEnseignant,
        email: enseignant.email,
        telephone: enseignant.telephone || '',
        specialite: enseignant.specialite || ''
      });
    } else {
      setFormData({
        nomEnseignant: '',
        prenomEnseignant: '',
        email: '',
        telephone: '',
        specialite: ''
      });
    }
  }, [enseignant, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={enseignant ? 'Modifier l\'enseignant' : 'Nouvel enseignant'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom *"
          value={formData.nomEnseignant}
          onChange={(e) => setFormData(prev => ({ ...prev, nomEnseignant: e.target.value }))}
          placeholder="Dubois"
          required
        />

        <Input
          label="Prénom *"
          value={formData.prenomEnseignant}
          onChange={(e) => setFormData(prev => ({ ...prev, prenomEnseignant: e.target.value }))}
          placeholder="Marie"
          required
        />

        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="marie.dubois@univ.fr"
          required
        />

        <Input
          label="Téléphone"
          value={formData.telephone || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
          placeholder="01 23 45 67 89"
        />

        <Input
          label="Spécialité"
          value={formData.specialite || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, specialite: e.target.value }))}
          placeholder="Intelligence Artificielle"
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {enseignant ? 'Modifier' : 'Ajouter'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function GestionEnseignantsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { success, error, warning } = useToast();

  // Hooks API
  const { data: enseignants = [], isLoading, error: fetchError } = useEnseignants();
  const createEnseignant = useCreateEnseignant();
  const updateEnseignant = useUpdateEnseignant();
  const deleteEnseignant = useDeleteEnseignant();

  // États locaux pour UI
  const [searchTerm, setSearchTerm] = useState('');
  const [specialiteFilter, setSpecialiteFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState<EnseignantDTO | null>(null);

  // Rediriger si non connecté ou pas responsable
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (user?.role !== 'RESPONSABLE') {
      warning('Accès refusé', 'Cette page est réservée aux responsables');
    }
  }, [isAuthenticated, user, warning]);

  const handleSaveEnseignant = async (data: EnseignantFormData) => {
    try {
      if (selectedEnseignant) {
        // Modification
        await updateEnseignant.mutateAsync({
          id: selectedEnseignant.idEnseignant,
          data: data as UpdateEnseignantRequest
        });
      } else {
        // Ajout
        await createEnseignant.mutateAsync(data as CreateEnseignantRequest);
      }
      
      setShowModal(false);
      setSelectedEnseignant(null);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  const handleDeleteEnseignant = async (enseignant: EnseignantDTO) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${enseignant.prenomEnseignant} ${enseignant.nomEnseignant} ?`)) {
      try {
        await deleteEnseignant.mutateAsync(enseignant.idEnseignant);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  // Filtrage des enseignants
  const enseignantsFiltres = enseignants.filter(ens => {
    const matchSearch = !searchTerm || 
      ens.nomEnseignant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ens.prenomEnseignant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ens.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ens.specialite?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchSpecialite = !specialiteFilter || ens.specialite === specialiteFilter;
    
    return matchSearch && matchSpecialite;
  });

  // Statistiques calculées
  const statsEnseignants = {
    total: enseignants.length,
    enseignants: enseignants.length, // Tous sont enseignants dans cette API
    responsables: 0 // À adapter selon votre logique métier
  };

  // Extraire les spécialités uniques pour le filtre
  const specialitesUniques = [...new Set(enseignants.map(e => e.specialite).filter(Boolean))];

  // Gestion des erreurs et loading
  if (fetchError) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <div className="text-red-600 mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-4">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">
              Impossible de charger la liste des enseignants.
            </p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'RESPONSABLE') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Accès restreint</h2>
              <p className="text-gray-600 mb-4">
                Cette page est réservée aux responsables.
              </p>
              {!isAuthenticated && (
                <Button onClick={() => setShowAuthModal(true)}>
                  Se connecter
                </Button>
              )}
            </div>
          </Card>
        </main>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLoginClick={() => setShowAuthModal(true)} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                👥 Gestion des Enseignants
              </h1>
              
              <Button 
                onClick={() => {
                  setSelectedEnseignant(null);
                  setShowModal(true);
                }}
                disabled={createEnseignant.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                {createEnseignant.isPending ? 'Ajout...' : 'Nouvel enseignant'}
              </Button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        statsEnseignants.total
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Total enseignants</div>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {specialitesUniques.length}
                    </div>
                    <div className="text-sm text-gray-600">Spécialités</div>
                  </div>
                  <div className="text-2xl">📚</div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {enseignantsFiltres.length}
                    </div>
                    <div className="text-sm text-gray-600">Résultats filtrés</div>
                  </div>
                  <div className="text-2xl">🔍</div>
                </div>
              </Card>
            </div>

            {/* Filtres */}
            <Card className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, prénom, email ou spécialité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={specialiteFilter}
                  onChange={(e) => setSpecialiteFilter(e.target.value)}
                  options={[
                    { value: '', label: 'Toutes les spécialités' },
                    ...specialitesUniques.map(spec => ({
                      value: spec!,
                      label: `📚 ${spec}`
                    }))
                  ]}
                />
              </div>
            </Card>

            {/* Liste des enseignants */}
            <Card title={`Enseignants (${enseignantsFiltres.length})`}>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-600">Chargement des enseignants...</span>
                </div>
              ) : enseignantsFiltres.length > 0 ? (
                <div className="space-y-4">
                  {enseignantsFiltres.map(enseignant => (
                    <div key={enseignant.idEnseignant} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xl">👨‍🏫</span>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Dr. {enseignant.prenomEnseignant} {enseignant.nomEnseignant}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {enseignant.email}
                              </div>
                              {enseignant.telephone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {enseignant.telephone}
                                </div>
                              )}
                              {enseignant.specialite && (
                                <div className="flex items-center gap-1">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    📚 {enseignant.specialite}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEnseignant(enseignant);
                              setShowModal(true);
                            }}
                            disabled={updateEnseignant.isPending}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            {updateEnseignant.isPending ? 'Modification...' : 'Modifier'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEnseignant(enseignant)}
                            className="text-red-600 hover:bg-red-50 hover:border-red-300"
                            disabled={deleteEnseignant.isPending}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {deleteEnseignant.isPending ? 'Suppression...' : 'Supprimer'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun enseignant trouvé
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || specialiteFilter 
                      ? 'Aucun enseignant ne correspond à vos critères de recherche'
                      : 'Commencez par ajouter des enseignants'
                    }
                  </p>
                  {!searchTerm && !specialiteFilter && (
                    <Button 
                      className="mt-4"
                      onClick={() => {
                        setSelectedEnseignant(null);
                        setShowModal(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter le premier enseignant
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Modal d'ajout/modification */}
      <EnseignantModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEnseignant(null);
        }}
        enseignant={selectedEnseignant}
        onSave={handleSaveEnseignant}
      />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}