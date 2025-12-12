// app/formations/decouvrir/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  Star, 
  Users, 
  Clock, 
  Award, 
  BookOpen,
  MessageSquare,
  Code,
  Globe,
  Heart,
  TrendingUp,
  Video,
  FileText,
  Headphones,
  Hand,
  Filter,
  Check,
  PlayCircle,
  Shield,
  Mail,
  HelpCircle,
  Link
} from 'lucide-react';
import Image from 'next/image';

export default function DiscoverFormationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { icon: <Hand className="w-8 h-8" />, name: 'Langue des Signes', count: 24 },
    { icon: <MessageSquare className="w-8 h-8" />, name: 'Communication', count: 18 },
    { icon: <Code className="w-8 h-8" />, name: 'Accessibilité Web', count: 15 },
    { icon: <Globe className="w-8 h-8" />, name: 'Inclusion Digitale', count: 12 },
    { icon: <Headphones className="w-8 h-8" />, name: 'Technologies Adaptées', count: 9 },
    { icon: <BookOpen className="w-8 h-8" />, name: 'Pédagogie Inclusive', count: 21 },
    { icon: <Award className="w-8 h-8" />, name: 'Certifications', count: 14 },
    { icon: <Users className="w-8 h-8" />, name: 'Management Inclusif', count: 11 }
  ];

  const popularCourses = [
    {
      id: 1,
      title: 'LSF Niveau 1 - Les Fondamentaux',
      instructor: 'Marie Dubois',
      rating: 4.8,
      students: 1243,
      duration: '8h',
      price: 49,
      originalPrice: 79,
      imageColor: 'from-blue-500 to-blue-600',
      badge: 'Populaire',
      accessibility: ['lsf', 'subtitles']
    },
    {
      id: 2,
      title: 'Communication Inclusive en Entreprise',
      instructor: 'Thomas Leroy',
      rating: 4.9,
      students: 892,
      duration: '6h',
      price: 59,
      originalPrice: 89,
      imageColor: 'from-purple-500 to-purple-600',
      badge: 'Certifiante',
      accessibility: ['lsf', 'subtitles', 'audio']
    },
    {
      id: 3,
      title: 'Accessibilité Numérique WCAG 2.1',
      instructor: 'Sophie Martin',
      rating: 4.7,
      students: 1567,
      duration: '10h',
      price: 79,
      originalPrice: 99,
      imageColor: 'from-emerald-500 to-teal-600',
      badge: 'Essentiel',
      accessibility: ['subtitles', 'transcript']
    }
  ];

  const newCourses = [
    {
      id: 4,
      title: 'LSF Avancé - Conversation Fluide',
      instructor: 'Jean Petit',
      rating: 4.9,
      students: 345,
      duration: '12h',
      price: 89,
      originalPrice: 129,
      imageColor: 'from-orange-500 to-amber-600',
      badge: 'Nouveau',
      accessibility: ['lsf', 'subtitles', 'audio', 'transcript']
    },
    {
      id: 5,
      title: 'Design Inclusif UX/UI',
      instructor: 'Laura Chen',
      rating: 4.6,
      students: 521,
      duration: '7h',
      price: 69,
      originalPrice: 99,
      imageColor: 'from-pink-500 to-rose-600',
      badge: 'Nouveau',
      accessibility: ['subtitles', 'transcript']
    },
    {
      id: 6,
      title: 'Parentalité et Surdité',
      instructor: 'Emma Rousseau',
      rating: 4.8,
      students: 432,
      duration: '5h',
      price: 39,
      originalPrice: 59,
      imageColor: 'from-indigo-500 to-violet-600',
      badge: 'Nouveau',
      accessibility: ['lsf', 'subtitles', 'audio']
    }
  ];

  const faqs = [
    {
      question: 'Les formations sont-elles accessibles aux personnes sourdes ?',
      answer: 'Oui, toutes nos formations incluent au minimum des sous-titres professionnels et une option LSF. La plupart proposent également une transcription texte complète.'
    },
    {
      question: 'Puis-je suivre les formations à mon rythme ?',
      answer: 'Absolument ! Toutes nos formations sont disponibles en ligne 24h/24 et vous pouvez les suivre à votre propre rythme, avec un accès à vie au contenu.'
    },
    {
      question: 'Y a-t-il des certifications reconnues ?',
      answer: 'Oui, nos formations certifiantes sont reconnues par plusieurs organismes professionnels et peuvent être financées via le CPF.'
    },
    {
      question: 'Comment fonctionne l\'essai gratuit ?',
      answer: 'Vous pouvez accéder gratuitement au premier module de chaque formation. Pas de carte bancaire requise, pas d\'engagement.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white py-20 px-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-64 translate-y-64"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-300">
                Formations adaptées, accessibles, et interactives
              </h1>
              <p className="text-xl mb-10 opacity-90 max-w-2xl">
                Apprenez à votre rythme avec des cours conçus pour tous les profils : entendants, malentendants et sourds-muets.
              </p>
              
              <div className="relative max-w-2xl mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une formation, une compétence, un formateur..."
                    className="w-full px-6 py-4 pr-14 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2">
                    <Search className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="text-sm opacity-80">Suggestions :</span>
                  {['LSF débutant', 'Accessibilité web', 'Communication'].map((tag) => (
                    <button
                      key={tag}
                      className="bg-white/20 hover:bg-white/30 text-sm px-3 py-1 rounded-full transition-colors"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/*<div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  <span>Garantie satisfaction 30 jours</span>
                </div>
                <div className="flex items-center">
                  <PlayCircle className="w-6 h-6 mr-2" />
                  <span>+500h de contenu</span>
                </div>
              </div>*/}
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/20 rounded-2xl p-6">
                      <div className="text-3xl font-bold mb-2">5000+</div>
                      <div className="opacity-90">Apprenants actifs</div>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-6">
                      <div className="text-3xl font-bold mb-2">98%</div>
                      <div className="opacity-90">Satisfaction</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mr-4">
                        <Hand className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Formations en LSF</div>
                        <div className="text-sm opacity-80">Niveau débutant à expert</div>
                      </div>
                    </div>
                      {/*<div className="flex items-center">
                     <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center mr-4">
                        <Headphones className="w-6 h-6 text-white" />
                      </div>
                     <div>
                        <div className="font-semibold">Audio-description</div>
                        <div className="text-sm opacity-80">Pour les malvoyants</div>
                      </div>
                    </div>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories de formations */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explorez par catégorie
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              Tout voir
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>   
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.count} formations</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formations populaires */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Les formations les plus populaires
              </h2>
              <p className="text-gray-600">Choisies par des milliers d'apprenants</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              Tout voir
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <div 
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className={`h-40 bg-gradient-to-r ${course.imageColor} relative`}>
                  {course.badge && (
                    <div className="absolute top-4 left-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {course.badge}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{course.instructor}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{course.students}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.accessibility.map((acc) => (
                      <span 
                        key={acc} 
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {acc === 'lsf' && '👐 LSF'}
                        {acc === 'subtitles' && '📝 Sous-titres'}
                        {acc === 'audio' && '🎧 Audio'}
                        {acc === 'transcript' && '📄 Transcription'}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-2xl text-gray-900">{course.price}€</span>
                      {course.originalPrice && (
                        <span className="text-gray-500 line-through ml-2">{course.originalPrice}€</span>
                      )}
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nouvelles formations */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Nouvelles formations
              </h2>
              <p className="text-gray-600">Découvrez nos dernières créations</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              Tout voir
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {newCourses.map((course) => (
              <div 
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
              >
                <div className={`h-40 bg-gradient-to-r ${course.imageColor} relative`}>
                  {course.badge && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {course.badge}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{course.instructor}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{course.students}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.accessibility.map((acc) => (
                      <span 
                        key={acc} 
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {acc === 'lsf' && '👐 LSF'}
                        {acc === 'subtitles' && '📝 Sous-titres'}
                        {acc === 'audio' && '🎧 Audio'}
                        {acc === 'transcript' && '📄 Transcription'}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-2xl text-gray-900">{course.price}€</span>
                      {course.originalPrice && (
                        <span className="text-gray-500 line-through ml-2">{course.originalPrice}€</span>
                      )}
                    </div>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105">
                      Démarrer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bandeau promotionnel */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-300">
              Commencez votre parcours d'apprentissage aujourd'hui !
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Rejoignez notre communauté de 5000+ apprenants et développez des compétences recherchées en inclusion et accessibilité.
            </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-400 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                Voir toutes les formations
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
               {/*<button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors">
                Essai gratuit 30 jours
              </button>*/}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">Vous avez d'autres questions ?</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5 mr-2" />
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}