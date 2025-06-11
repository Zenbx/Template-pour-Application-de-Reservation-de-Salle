// src/components/AuthModal.tsx
'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Le mot de passe doit contenir au moins 3 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  const success = await login(formData.email.trim(), formData.password);
  if (success) {
    onClose();
    setFormData({ email: '', password: '' });
    setErrors({});
  } else {
    setErrors({ password: 'Identifiants incorrects' });
  }
};

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Comptes de démonstration
  const demoAccounts = [
    {
      type: 'Responsable',
      email: 'responsable@univ.fr',
      password: 'password123',
      icon: '👨‍💼',
      description: 'Accès complet à toutes les fonctionnalités'
    },
    {
      type: 'Enseignant',
      email: 'enseignant@univ.fr', 
      password: 'password123',
      icon: '👨‍🏫',
      description: 'Réservations et consultation du planning'
    }
  ];

  const fillDemoAccount = (email: string, password: string) => {
    setFormData({ email, password });
    setErrors({});
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="🔐 Connexion"
      size="md"
    >
      <div className="space-y-6">
        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Email */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              Adresse email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="votre.email@univ.fr"
              disabled={isLoading}
              className={errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-500">⚠️</span>
                {errors.email}
              </p>
            )}
          </div>
          
          {/* Champ Mot de passe */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-500" />
              Mot de passe *
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Votre mot de passe"
                disabled={isLoading}
                className={errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'pr-10'}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-500">⚠️</span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={!formData.email || !formData.password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  🔑 Se connecter
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </form>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou utilisez un compte de démonstration</span>
          </div>
        </div>

        {/* Comptes de démonstration */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-3">
            🎯 Comptes de test disponibles
          </div>
          
          {demoAccounts.map((account, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => fillDemoAccount(account.email, account.password)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                  {account.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">
                    {account.type}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {account.description}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📧 {account.email}</span>
                    <span>🔑 {account.password}</span>
                  </div>
                </div>
                <div className="text-blue-600 hover:text-blue-800 transition-colors">
                  <span className="text-sm font-medium">Utiliser →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Information de sécurité */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600">🔒</span>
            </div>
            <div>
              <div className="font-medium text-blue-900 mb-1">
                Sécurité et confidentialité
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Vos identifiants sont chiffrés et sécurisés</div>
                <div>• La session expire automatiquement après inactivité</div>
                <div>• Utilisez les comptes de test pour découvrir l'application</div>
              </div>
            </div>
          </div>
        </div>

        {/* Aide */}
        <div className="text-center">
          <div className="text-sm text-gray-500">
            Besoin d'aide ? Contactez l'administrateur système
          </div>
          <div className="text-xs text-gray-400 mt-1">
            📧 admin@univ.fr • 📞 01 23 45 67 89
          </div>
        </div>
      </div>
    </Modal>
  );
}