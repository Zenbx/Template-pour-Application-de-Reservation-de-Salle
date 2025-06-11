'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  Building, 
  Laptop, 
  Clock, 
  Users, 
  LogIn, 
  LogOut,
  Home,
  BookOpen,
  Settings,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Navigation pour utilisateurs connectés
const authenticatedNavigation = [
  { name: 'Tableau de bord', href: '/', icon: Home },
  { name: 'Planning', href: '/planning', icon: Calendar },
  { name: 'Réserver Salle', href: '/reservation-salle', icon: Building },
  { name: 'Réserver Matériel', href: '/reservation-materiel', icon: Laptop },
  { name: 'Récap Horaire', href: '/recap-horaire', icon: Clock },
];

// Navigation pour visiteurs publics
const publicNavigation = [
  { name: 'Planning', href: '/planning', icon: Calendar },
];

// Navigation supplémentaire pour responsables
const responsableNavigation = [
  { name: 'Gestion Enseignants', href: '/gestion-enseignants', icon: Users },
  { name: 'Gestion Formations', href: '/gestion-formations', icon: BookOpen },
  { name: 'Administration', href: '/admin', icon: Settings },
];

interface SidebarProps {
  onLoginClick: () => void;
}

export function Sidebar({ onLoginClick }: SidebarProps) {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  // Vérifier si l'utilisateur est responsable
  const isResponsable = user?.role === 'RESPONSABLE';
  
  // Logique de navigation selon l'état de connexion
  const allNavigation = isAuthenticated 
    ? [...authenticatedNavigation, ...(isResponsable ? responsableNavigation : [])]
    : publicNavigation;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🏢</span>
          </div>
          <div className="text-white font-poppins font-semibold text-lg">
            RESAMA
          </div>
        </div>
      </div>

      {/* User Info Card - Loading state ou utilisateur connecté */}
      {isLoading ? (
        <div className="p-4 border-b border-gray-100">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-2xl flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
              </div>
            </div>
          </div>
        </div>
      ) : isAuthenticated && user ? (
        <div className="p-4 border-b border-gray-100">
          <div className={`rounded-2xl p-4 border ${
            isResponsable 
              ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-semibold ${
                isResponsable ? 'bg-purple-500' : 'bg-blue-500'
              }`}>
                {user.prenomEnseignant?.[0]?.toUpperCase()}{user.nomEnseignant?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 font-poppins truncate">
                  {user.prenomEnseignant} {user.nomEnseignant}
                </div>
                <div className={`text-xs font-poppins ${
                  isResponsable ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  {isResponsable ? '👨‍💼 Responsable' : '👨‍🏫 Enseignant'}
                </div>
                {user.specialite && (
                  <div className="text-xs text-gray-500 truncate">
                    📚 {user.specialite}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Information pour visiteurs publics */
        <div className="p-4 border-b border-gray-100">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
            <div className="text-center">
              <div className="text-2xl mb-2">👀</div>
              <div className="text-sm font-medium text-green-900 font-poppins mb-1">
                Mode Consultation
              </div>
              <div className="text-xs text-green-600 font-poppins">
                Visualisez les plannings en temps réel
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 font-poppins">
          {isAuthenticated ? 'Tableau de bord' : 'Consultation'}
        </div>
        
        {allNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 font-poppins relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
              )}
            >
              {/* Effet de survol animé */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200 rounded-2xl"></div>
              )}
              
              {/* Icône */}
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-xl mr-3 transition-all duration-200',
                isActive
                  ? 'bg-white bg-opacity-20'
                  : 'group-hover:bg-blue-50 group-hover:text-blue-600'
              )}>
                <Icon className="h-5 w-5" />
              </div>
              
              {/* Texte */}
              <span className="flex-1">{item.name}</span>
              
              {/* Indicateur actif */}
              {isActive && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Features preview pour visiteurs publics */}
      {!isAuthenticated && !isLoading && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
            <div className="text-center mb-3">
              <div className="text-sm font-medium text-indigo-900 font-poppins mb-2">
                🚀 Débloquez plus de fonctionnalités
              </div>
              <div className="text-xs text-indigo-600 font-poppins space-y-1">
                <div>• Réservation de salles</div>
                <div>• Gestion du matériel</div>
                <div>• Récap horaire personnel</div>
                <div>• Tableau de bord privé</div>
                {isResponsable && (
                  <>
                    <div>• Gestion des enseignants</div>
                    <div>• Administration système</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informations utilisateur connecté */}
      {isAuthenticated && user && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-3 mb-3">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span className="truncate">{user.email}</span>
              </div>
              {user.telephone && (
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>{user.telephone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>🔑</span>
                <span>Connecté depuis cette session</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Section */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        {isLoading ? (
          /* État de chargement */
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Vérification...</span>
          </div>
        ) : isAuthenticated ? (
          <>
            {/* Bouton de déconnexion stylisé */}
            <Button
              onClick={handleLogout}
              variant="outline"
              rounded="xl"
              className="w-full justify-center bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 hover:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </>
        ) : (
          <>
            {/* Message d'invitation */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="text-center">
                <div className="text-2xl mb-2">👋</div>
                <div className="text-sm font-medium text-blue-900 font-poppins mb-1">
                  Rejoignez-nous !
                </div>
                <div className="text-xs text-blue-600 font-poppins">
                  Connectez-vous pour accéder à votre tableau de bord
                </div>
              </div>
            </div>
            
            {/* Bouton de connexion stylisé */}
            <Button
              onClick={onLoginClick}
              rounded="xl"
              className="w-full justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Button>
          </>
        )}
      </div>
    </div>
  );
}