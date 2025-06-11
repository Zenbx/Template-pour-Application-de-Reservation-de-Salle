// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import { StatsCard } from '@/components/StatsCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRecapHoraire } from '@/hooks/useRecapHoraire';
import { Calendar, Clock, Users, BookOpen, MapPin, Settings, TrendingUp, Zap, Shield, Star, ChevronRight, Home } from 'lucide-react';

// Composant pour les feature cards
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href?: string;
}

function FeatureCard({ icon, title, description, color, href }: FeatureCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      border: 'border-l-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    green: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-l-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      badge: 'bg-green-100 text-green-700'
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
      border: 'border-l-purple-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700'
    },
    orange: {
      bg: 'bg-gradient-to-r from-orange-50 to-amber-50',
      border: 'border-l-orange-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-700'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card rounded="xl" className={`border-l-4 ${colors.border} ${colors.bg} p-6 hover:shadow-md transition-all duration-200 cursor-pointer`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 ${colors.iconBg} rounded-xl`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-6 w-6 ${colors.iconColor}`
          })}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
              Disponible
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <Button variant="outline" size="sm" className="text-xs">
            Accéder <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Composant pour les stats améliorées
interface EnhancedStatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: 'up' | 'down' | 'neutral';
}

function EnhancedStatCard({ icon, value, label, subtitle, color, trend = 'neutral' }: EnhancedStatCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/25',
    purple: 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/25',
    orange: 'bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/25'
  };

  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-green-400" />,
    down: <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />,
    neutral: <Zap className="h-4 w-4 text-blue-400" />
  };

  return (
    <Card rounded="xl" className={`${colorClasses[color]} text-white p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden relative`}>
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transform -skew-x-12 transition-all duration-700 hover:translate-x-full"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            {React.cloneElement(icon as React.ReactElement, { 
              className: "h-6 w-6"
            })}
          </div>
          {trendIcons[trend]}
        </div>
        
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-white text-opacity-90 font-medium mb-1">{label}</div>
        <div className="text-white text-opacity-70 text-sm">{subtitle}</div>
      </div>
    </Card>
  );
}

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { statsGlobales } = useRecapHoraire();
  const router = useRouter();

  // Rediriger les utilisateurs non connectés vers le planning
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/planning');
    }
  }, [isAuthenticated, router]);

  // Afficher un loader pendant la redirection
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLoginClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            <p className="text-gray-600">Redirection vers le planning...</p>
          </div>
        </main>
      </div>
    );
  }

  const isResponsable = user?.role === 'RESPONSABLE';

  const features = [
    {
      icon: <Calendar />,
      title: "Planning général",
      description: "Vue d'ensemble de tous les créneaux et réservations",
      color: 'blue' as const,
      href: '/planning'
    },
    {
      icon: <MapPin />,
      title: "Réservation de salles",
      description: "Réservez des espaces pour vos cours et réunions",
      color: 'green' as const,
      href: '/reservations'
    },
    {
      icon: <BookOpen />,
      title: "Gestion du matériel",
      description: "Empruntez projecteurs, ordinateurs et équipements",
      color: 'purple' as const,
      href: '/materiel'
    },
    {
      icon: <TrendingUp />,
      title: "Récap horaire",
      description: "Consultez vos statistiques et planning personnel",
      color: 'orange' as const,
      href: '/recap-horaire'
    },
    ...(isResponsable ? [
      {
        icon: <Users />,
        title: "Gestion des enseignants",
        description: "Administrez les comptes et permissions utilisateurs",
        color: 'blue' as const,
        href: '/enseignants'
      },
      {
        icon: <Settings />,
        title: "Administration système",
        description: "Configurez les paramètres généraux de la plateforme",
        color: 'green' as const,
        href: '/admin'
      }
    ] : [])
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLoginClick={() => setShowAuthModal(true)} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-8 mb-8 text-white overflow-hidden">
              {/* Effets de fond */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                      <Home className="h-10 w-10" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">
                        Tableau de bord {isResponsable ? 'Responsable' : 'Enseignant'}
                      </h1>
                      <p className="text-indigo-100 text-lg mb-2">
                        Bienvenue, {user?.fullName}
                      </p>
                      <p className="text-indigo-200 text-sm max-w-2xl">
                        {isResponsable 
                          ? "Gérez l'ensemble des plannings et supervisez l'utilisation des ressources."
                          : "Accédez à vos outils de réservation et consultez votre planning personnel."
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-indigo-100 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Système opérationnel</span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-100">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Connecté et sécurisé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message d'accueil utilisateur connecté */}
            <Card rounded="xl" className={`mb-8 border-l-4 ${
              isResponsable 
                ? 'border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50' 
                : 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50'
            }`}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isResponsable ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {isResponsable ? (
                      <Users className="h-6 w-6 text-purple-600" />
                    ) : (
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Espace {isResponsable ? 'Responsable' : 'Enseignant'}
                    </h2>
                    <p className="text-gray-600">
                      Vous avez accès à tous les outils de {isResponsable ? 'gestion et supervision' : 'réservation et consultation'}.
                      Utilisez le menu ci-dessous pour naviguer rapidement vers vos fonctionnalités.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Fonctionnalités disponibles */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="h-6 w-6 text-indigo-600" />
                Vos outils
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    color={feature.color}
                    href={feature.href}
                  />
                ))}
              </div>
            </div>

            {/* Statistiques personnelles */}
            {statsGlobales && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                  Vos statistiques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <EnhancedStatCard
                    icon={<Calendar />}
                    value={statsGlobales.reservationsAujourdhui}
                    label="Cours aujourd'hui"
                    subtitle="Sessions programmées"
                    color="blue"
                    trend="up"
                  />
                  <EnhancedStatCard
                    icon={<MapPin />}
                    value={statsGlobales.sallesReservees}
                    label="Salles réservées"
                    subtitle="Espaces occupés"
                    color="green"
                    trend="up"
                  />
                  <EnhancedStatCard
                    icon={<BookOpen />}
                    value={statsGlobales.materielEmprunte}
                    label="Matériel emprunté"
                    subtitle="Équipements en cours"
                    color="purple"
                    trend="neutral"
                  />
                  <EnhancedStatCard
                    icon={<Clock />}
                    value={`${statsGlobales.heuresSeaine}h`}
                    label="Heures semaine"
                    subtitle="Temps d'enseignement"
                    color="orange"
                    trend="up"
                  />
                </div>
              </div>
            )}

            {/* Actions rapides */}
            <Card rounded="xl" title="🚀 Actions rapides" className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white justify-start gap-3 p-4 h-auto">
                  <Calendar className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Voir le planning</div>
                    <div className="text-xs text-blue-100">Consultation complète</div>
                  </div>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white justify-start gap-3 p-4 h-auto">
                  <MapPin className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Réserver une salle</div>
                    <div className="text-xs text-green-100">Réservation rapide</div>
                  </div>
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white justify-start gap-3 p-4 h-auto">
                  <TrendingUp className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Mon récap horaire</div>
                    <div className="text-xs text-purple-100">Statistiques perso</div>
                  </div>
                </Button>
              </div>
            </Card>
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