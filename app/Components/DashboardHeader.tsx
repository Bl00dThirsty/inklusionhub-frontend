'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, Menu, LogOut, Settings, MessageSquare, Calendar } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Image from 'next/image';
import { useGetCurrentUserQuery } from '@/state/api';
import { useAuth } from '@/app/(auth)/sign-in/context/authContext';

interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  userAvatar?: string;
  userEmail: string;
}

export default function DashboardHeader({ 
  userName = 'Utilisateur',
  userRole = 'malentendant',
  userAvatar 
}: DashboardHeaderProps) {
  const router = useRouter();
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const { user: authUser, logout } = useAuth(); // Appel de la fonction logout depuis le Authcontexte
   // TODO: Implémenter la déconnexion
  const handleLogout = async () => {
    try {
      await logout(); // Appel de la fonction logout
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };
  // Fermer les menus en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigation items selon le rôle
  const getNavItems = () => {
    const baseItems = [
      { label: 'Tableau de bord', href: '/dashboard', icon: '🏠' },
      { label: 'Communication', href: '/dashboard/communication', icon: '💬' },
      { label: 'Formation', href: '/dashboard/formation', icon: '📚' },
    ];

    if (userRole === 'traducteur') {
      baseItems.push({ label: 'Mes services', href: '/dashboard/services', icon: '👋' });
    }
    
    if (userRole === 'employeur') {
      baseItems.push({ label: 'Recrutement', href: '/dashboard/recrutement', icon: '💼' });
    }
    
    baseItems.push(
      { label: 'Communauté', href: '/dashboard/communaute', icon: '👥' },
      { label: 'Outils', href: '/dashboard/outils', icon: '🛠️' }
    );

    return baseItems;
  };

  // const handleLogout = () => {
  //   // TODO: Implémenter la déconnexion
  //   localStorage.removeItem('userData');
  //   const current = Number(localStorage.getItem("OnboardProgress")) || 0;
  //     const updated = current * 0;

  //     localStorage.setItem("OnboardProgress", String(updated));
  //   router.push('/role-selection');
  // };

  const handleMobileNavigation = (href: string) => {
    router.push(href);
    setShowMobileMenu(false);
  };

 
  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo et navigation principale */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              <div className="w-10 h-10 bg-green-400  rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">IH</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden md:block">
                InklusionHub
              </span>
            </div>

            {/* Navigation principale */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Actions droite */}
          <div className="flex items-center space-x-4">
            {/* Recherche globale */}
            <div className="hidden md:block relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bouton mobile recherche */}
            <button className="md:hidden p-2">
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Bouton mobile menu */}
            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                {showMobileMenu ? (
                  <p className="h-5 w-5 text-gray-600 dark:text-gray-400">X</p>
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Menu mobile dropdown */}
              {showMobileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-3 z-50">
                  {/* En-tête mobile */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {userAvatar ? (
                        <Image
                          src={userAvatar}
                          alt="U"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                        <p className="text-sm text-gray-500 capitalize">{userRole}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation mobile */}
                  <div className="py-2 max-h-[60vh] overflow-y-auto">
                    {navItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleMobileNavigation(item.href)}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Actions mobile */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        router.push('/account/profil');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="h-5 w-5" />
                      <span>Mon profil</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        router.push('/account/profil');
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Mon profil Pro</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        router.push('/dashboard/profile');
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Mon agendas</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        router.push('/dashboard/settings');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Paramètres</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </button>

              {/* Dropdown Notifications */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 lg:w-80 xl:w-80 sm:w-70 md:w-70 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {/* Notification items */}
                    {[
                      { id: 1, title: 'Nouveau message', description: 'Jean vous a envoyé un message', time: '5 min', read: false },
                      { id: 2, title: 'Cours recommandé', description: 'LSF Niveau 2 disponible', time: '1h', read: false },
                      { id: 3, title: 'Événement', description: 'Webinaire inclusion demain', time: '2h', read: true },
                    ].map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{notification.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{notification.description}</p>
                          </div>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                    <a href="/dashboard/notifications" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Voir toutes les notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Thème */}
            {/* <div className="hidden sm:block">
              <ThemeToggle />
            </div> */}
            <ThemeToggle />

            {/* Profil */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="relative">
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt={userName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Badge rôle */}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {userRole === 'malentendant' && '👂'}
                    {userRole === 'traducteur' && '👋'}
                    {userRole === 'employeur' && '💼'}
                    {userRole === 'apprenant' && '📚'}
                    {userRole === 'entendant' && '👤'}
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
              </button>

              {/* Dropdown Profil */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {/* Info utilisateur */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{userRole}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <a
                      href="/account/profil"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4" />
                      <span>Mon profil</span>
                    </a>
                    <a
                      href="/dashboard/profil_Pro"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Mon profil Pro</span>
                    </a>
                    <a
                      href="/dashboard/calendar"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Mon agendas</span>
                    </a>
                    <a
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </a>
                  </div>

                  {/* Déconnexion */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}

               {/* Profil mobile (mini) */}
            <div className="lg:hidden">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowMobileSearch(false);
                  setShowProfileMenu(!showProfileMenu);
                }}
                className="p-2"
              >
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={userName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>
            </div>

        {/* Thème mobile (en dessous) */}
        <div className="sm:hidden flex justify-center mt-3">
          <ThemeToggle />
        </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}