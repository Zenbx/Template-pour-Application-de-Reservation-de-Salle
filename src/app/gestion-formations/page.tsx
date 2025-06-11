// src/app/gestion-formations/page.tsx
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
  useFormations, 
  useCreateFormation, 
  useUpdateFormation, 
  useDeleteFormation 
} from '@/hooks/useFormations';
import { useEnseignants } from '@/hooks/useEnseignants';
import { 
  FormationDTO, 
  CreateFormationRequest, 
  UpdateFormationRequest,
  FormationFilters 
} from '@/types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Users, 
  Search, 
  Loader2, 
  Clock,
  GraduationCap,
  User,
  Filter
} from 'lucide-react';

interface FormationFormData {
  codeFormation: string;
  nomFormation: string;
  description: string;
  niveau: string;
  dureeHeures: number;
  responsableId: number;
}

function FormationModal({ 
  isOpen, 
  onClose, 
  formation, 
  onSave,
  enseignants = []
}: {
  isOpen: boolean;
  onClose: () => void;
  formation?: FormationDTO | null;
  onSave: (data: FormationFormData) => void;
  enseignants: any[];
}) {
  const [formData, setFormData] = useState<FormationFormData>({
    codeFormation: '',
    nomFormation: '',
    description: '',
    niveau: '',
    dureeHeures: 0,
    responsableId: 0
  });

  useEffect(() => {
    if (formation) {
      setFormData({
        codeFormation: formation.codeFormation,
        nomFormation: formation.nomFormation,
        description: formation.description,
        niveau: formation.niveau,
        dureeHeures: formation.dureeHeures,
        responsableId: formation.responsable.idEnseignant
      });
    } else {
      setFormData({
        codeFormation: '',
        nomFormation: '',
        description: '',
        niveau: '',
        dureeHeures: 0,
        responsableId: 0
      });
    }
  }, [formation, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const niveauxOptions = [
    { value: 'L1', label: '🎓 L1 - Licence 1ère année' },
    { value: 'L2', label: '🎓 L2 - Licence 2ème année' },
    { value: 'L3', label: '🎓 L3 - Licence 3ème année' },
    { value: 'M1', label: '🎯 M1 - Master 1ère année' },
    { value: 'M2', label: '🎯 M2 - Master 2ème année' },
    { value: 'DOCTORAT', label: '🎖️ Doctorat' },
    { value: 'AUTRE', label: '📚 Autre formation' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={formation ? 'Modifier la formation' : 'Nouvelle formation'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Code de formation *"
            value={formData.codeFormation}
            onChange={(e) => setFormData(prev => ({ ...prev, codeFormation: e.target.value }))}
            placeholder="Ex: INFO301"
            required
          />

          <Select
            label="Niveau *"
            value={formData.niveau}
            onChange={(e) => setFormData(prev => ({ ...prev, niveau: e.target.value }))}
            options={[
              { value: '', label: 'Sélectionner un niveau...' },
              ...niveauxOptions
            ]}
            required
          />
        </div>

        <Input
          label="Nom de la formation *"
          value={formData.nomFormation}
          onChange={(e) => setFormData(prev => ({ ...prev, nomFormation: e.target.value }))}
          placeholder="Ex: Algorithmes et Structures de Données"
          required
        />

        <div>
          <label className="form-label">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description détaillée de la formation, objectifs pédagogiques..."
            rows={4}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 font-poppins transition-all duration-200 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Durée (heures) *"
            type="number"
            min="1"
            max="500"
            value={formData.dureeHeures || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, dureeHeures: parseInt(e.target.value) || 0 }))}
            placeholder="Ex: 40"
            required
          />

          <Select
            label="Responsable *"
            value={formData.responsableId?.toString() || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, responsableId: parseInt(e.target.value) }))}
            options={[
              { value: '', label: 'Sélectionner un responsable...' },
              ...enseignants.map(ens => ({
                value: ens.idEnseignant.toString(),
                label: `👨‍🏫 ${ens.prenomEnseignant} ${ens.nomEnseignant} ${ens.specialite ? `(${ens.specialite})` : ''}`
              }))
            ]}
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {formation ? 'Modifier' : 'Créer'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function GestionFormationsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { success, error, warning } = useToast();

  // États pour les filtres
  const [filters, setFilters] = useState<FormationFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [niveauFilter, setNiveauFilter] = useState('');
  const [responsableFilter, setResponsableFilter] = useState('');

  // États pour le modal
  const [showModal, setShowModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<FormationDTO | null>(null);

  // Hooks API
  const { data: formations = [], isLoading, error: fetchError } = useFormations(filters);
  const { data: enseignants = [] } = useEnseignants();
  const createFormation = useCreateFormation();
  const updateFormation = useUpdateFormation();
  const deleteFormation = useDeleteFormation();

  // Rediriger si non connecté ou pas responsable
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (user?.role !== 'RESPONSABLE') {
      warning('Accès refusé', 'Cette page est réservée aux responsables');
    }
  }, [isAuthenticated, user, warning]);

  // Mettre à jour les filtres API quand les filtres locaux changent
  useEffect(() => {
    const newFilters: FormationFilters = {};
    if (searchTerm) {
      newFilters.nomFormation = searchTerm;
    }
    if (niveauFilter) {
      newFilters.niveau = niveauFilter;
    }
    if (responsableFilter) {
      newFilters.responsableId = parseInt(responsableFilter);
    }
    setFilters(newFilters);
  }, [searchTerm, niveauFilter, responsableFilter]);

  const handleSaveFormation = async (data: FormationFormData) => {
    try {
      if (selectedFormation) {
        // Modification
        await updateFormation.mutateAsync({
          id: selectedFormation.idFormation,
          data: data as UpdateFormationRequest
        });
      } else {
        // Ajout
        await createFormation.mutateAsync(data as CreateFormationRequest);
      }
      
      setShowModal(false);
      setSelectedFormation(null);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  const handleDeleteFormation = async (formation: FormationDTO) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la formation "${formation.nomFormation}" ?`)) {
      try {
        await deleteFormation.mutateAsync(formation.idFormation);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  // Calculer les statistiques
  const statsFormations = {
    total: formations.length,
    dureeTotal: formations.reduce((acc, f) => acc + f.dureeHeures, 0),
    niveauxUniques: [...new Set(formations.map(f => f.niveau))].length,
    responsablesUniques: [...new Set(formations.map(f => f.responsable.idEnseignant))].length
  };

  // Extraire les options de filtres
  const niveauxUniques = [...new Set(formations.map(f => f.niveau))];
  const responsablesUniques = [...new Set(formations.map(f => f.responsable))];

  // Gestion des erreurs
  if (fetchError) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <div className="text-red-600 mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-4">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">
              Impossible de charger la liste des formations.
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
            {/* En-tête */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                📚 Gestion des Formations
              </h1>
              
              <Button 
                onClick={() => {
                  setSelectedFormation(null);
                  setShowModal(true);
                }}
                disabled={createFormation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                {createFormation.isPending ? 'Création...' : 'Nouvelle formation'}
              </Button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        statsFormations.total
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Total formations</div>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{statsFormations.dureeTotal}h</div>
                    <div className="text-sm text-gray-600">Volume horaire total</div>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{statsFormations.niveauxUniques}</div>
                    <div className="text-sm text-gray-600">Niveaux différents</div>
                  </div>
                  <GraduationCap className="h-8 w-8 text-purple-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{statsFormations.responsablesUniques}</div>
                    <div className="text-sm text-gray-600">Responsables actifs</div>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
            </div>

            {/* Filtres */}
            <Card className="mb-8" title="🔍 Filtres">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom de formation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={niveauFilter}
                  onChange={(e) => setNiveauFilter(e.target.value)}
                  options={[
                    { value: '', label: 'Tous les niveaux' },
                    ...niveauxUniques.map(niveau => ({
                      value: niveau,
                      label: `🎓 ${niveau}`
                    }))
                  ]}
                />

                <Select
                  value={responsableFilter}
                  onChange={(e) => setResponsableFilter(e.target.value)}
                  options={[
                    { value: '', label: 'Tous les responsables' },
                    ...responsablesUniques.map(resp => ({
                      value: resp.idEnseignant.toString(),
                      label: `👨‍🏫 ${resp.prenomEnseignant} ${resp.nomEnseignant}`
                    }))
                  ]}
                />
              </div>

              {(searchTerm || niveauFilter || responsableFilter) && (
                <div className="mt-4 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Filtres actifs :</span>
                  {searchTerm && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      Recherche: "{searchTerm}"
                    </span>
                  )}
                  {niveauFilter && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      Niveau: {niveauFilter}
                    </span>
                  )}
                  {responsableFilter && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Responsable sélectionné
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setNiveauFilter('');
                      setResponsableFilter('');
                    }}
                    className="text-xs"
                  >
                    Réinitialiser
                  </Button>
                </div>
              )}
            </Card>

            {/* Liste des formations */}
            <Card title={`Formations (${formations.length})`}>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-600">Chargement des formations...</span>
                </div>
              ) : formations.length > 0 ? (
                <div className="space-y-6">
                  {formations.map(formation => (
                    <div key={formation.idFormation} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                                📚
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{formation.nomFormation}</h3>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                  {formation.codeFormation}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                  🎓 {formation.niveau}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-4 leading-relaxed">
                                {formation.description}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Clock className="h-4 w-4 text-green-500" />
                                  <span className="font-medium">Durée:</span>
                                  <span>{formation.dureeHeures} heures</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-600">
                                  <User className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">Responsable:</span>
                                  <span>{formation.responsable.prenomEnseignant} {formation.responsable.nomEnseignant}</span>
                                </div>

                                {formation.responsable.specialite && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <BookOpen className="h-4 w-4 text-orange-500" />
                                    <span className="font-medium">Spécialité:</span>
                                    <span>{formation.responsable.specialite}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFormation(formation);
                              setShowModal(true);
                            }}
                            disabled={updateFormation.isPending}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            {updateFormation.isPending ? 'Modification...' : 'Modifier'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteFormation(formation)}
                            className="text-red-600 hover:bg-red-50 hover:border-red-300"
                            disabled={deleteFormation.isPending}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {deleteFormation.isPending ? 'Suppression...' : 'Supprimer'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune formation trouvée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || niveauFilter || responsableFilter
                      ? 'Aucune formation ne correspond à vos critères de recherche'
                      : 'Commencez par créer votre première formation'
                    }
                  </p>
                  {!searchTerm && !niveauFilter && !responsableFilter && (
                    <Button 
                      onClick={() => {
                        setSelectedFormation(null);
                        setShowModal(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Créer la première formation
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Modal d'ajout/modification */}
      <FormationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedFormation(null);
        }}
        formation={selectedFormation}
        onSave={handleSaveFormation}
        enseignants={enseignants}
      />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}