// app/VieCom/page.tsx
'use client';

import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  MapPinIcon,
  UsersIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VieComPage() {
  const router = useRouter();
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const communityFeatures = [
    {
      icon: <UserGroupIcon className="h-10 w-10" />,
      title: "Mise en relation",
      description: "Trouvez des traducteurs LSF près de chez vous et planifiez des rendez-vous avec facilité."
    },
    {
      icon: <CalendarIcon className="h-10 w-10" />,
      title: "Événements",
      description: "Créez et participez à des événements inclusifs pour la communauté sourde et malentendante."
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-10 w-10" />,
      title: "Forums de discussion",
      description: "Rejoignez des groupes de partage et échangez avec d'autres membres sur des sujets variés."
    }
  ];

  const translatorServices = [
    "Traduction pour rendez-vous médicaux",
    "Accompagnement professionnel",
    "Support pour événements",
    "Cours de LSF personnalisés",
    "Interprétation à distance",
    "Traduction de documents officiels",
    "Assistance administrative",
    "Accompagnement scolaire/universitaire"
  ];

  const eventTypes = [
    {
      type: "Ateliers",
      examples: ["Atelier LSF débutant", "Sensibilisation à la surdité", "Techniques de communication"]
    },
    {
      type: "Rencontres sociales",
      examples: ["Café signe", "Sorties culturelles", "Groupes de soutien"]
    },
    {
      type: "Formations",
      examples: ["Formation professionnelle", "Développement personnel", "Compétences numériques"]
    }
  ];

  // Animation pour le carousel des services
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % translatorServices.length);
    }, 3000); // Change toutes les 3 secondes

    return () => clearInterval(interval);
  }, [isAutoPlaying, translatorServices.length]);

  const nextService = () => {
    setCurrentServiceIndex((prev) => (prev + 1) % translatorServices.length);
    setIsAutoPlaying(false);
  };

  const prevService = () => {
    setCurrentServiceIndex((prev) => (prev - 1 + translatorServices.length) % translatorServices.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section avec image de fond */}
        <section className="relative py-24 overflow-hidden">
          {/* Image de fond avec flou */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/cmu.jpg"
              alt="Communauté unie"
              fill
              className="object-cover blur-sm brightness-90"
              priority
            />
            {/* Overlay pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40"></div>
          </div>
          
          {/* Contenu */}
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Vie Communautaire
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 drop-shadow-md">
              Un espace de rencontre, d'échange et de partage pour la communauté 
              sourde, malentendante et ses alliés. Connectez-vous, échangez et grandissez ensemble.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/sign-in')}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Rejoindre la communauté
              </button>
              <button 
                onClick={() => router.push('/events')}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-medium hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: "#82EFCF" }}
              >
                Voir les événements
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 -mt-10">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-black text-center mb-16">
              Découvrez notre communauté
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {communityFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="text-blue-600 mb-6">
                    <div className="inline-block p-3 bg-blue-50 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Translator Services avec carousel */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-blue-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <VideoCameraIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-black">Services de traduction LSF</h3>
              </div>
              <p className="text-gray-600 mb-8 text-lg max-w-3xl">
                Trouvez le traducteur qu'il vous faut pour vos rendez-vous professionnels, 
                médicaux ou personnels. Notre plateforme facilite la mise en relation et la planification.
              </p>
              
              {/* Carousel des services */}
              <div className="relative max-w-4xl mx-auto">
                {/* Service actuel avec animation */}
                <div 
                  key={currentServiceIndex}
                  className="bg-white p-8 rounded-xl shadow-md mb-8 transform transition-all duration-500 ease-in-out"
                >
                  <div className="flex items-center justify-center gap-4">
                    
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-2xl font-semibold text-gray-800">
                          {translatorServices[currentServiceIndex]}
                        </span>
                      </div>
                      
                    
                    {/* <div className="hidden md:block">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-4xl">
                        {currentServiceIndex + 1}
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Contrôles du carousel */}
                <div className="flex items-center justify-center gap-8">
                  <button
                    onClick={prevService}
                    className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ArrowLeftIcon className="h-6 w-6 text-blue-600" />
                  </button>
                  
                  {/* Indicateurs */}
                  <div className="flex gap-2">
                    {translatorServices.slice(0, 5).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentServiceIndex(index);
                          setIsAutoPlaying(false);
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentServiceIndex === index 
                            ? 'bg-blue-600 w-8' 
                            : 'bg-blue-300 hover:bg-blue-400'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextService}
                    className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ArrowRightIcon className="h-6 w-6 text-blue-600" />
                  </button>
                </div>

                {/* Bouton auto-play */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto"
                  >
                    <div className={`w-4 h-4 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    {isAutoPlaying ? 'Lecture en cours' : 'Cliquez pour activer'}
                  </button>
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CalendarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-black">Événements communautaires</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {eventTypes.map((eventType, index) => (
                  <div 
                    key={eventType.type} 
                    className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-shadow duration-300 group"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <h4 className="text-xl font-semibold text-black">{eventType.type}</h4>
                    </div>
                    <ul className="space-y-4">
                      {eventType.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform">
                          <MapPinIcon className="h-6 w-6 text-blue-400 mt-0.5 flex-shrink-0 group-hover/item:text-blue-600 transition-colors" />
                          <span className="text-gray-700">{example}</span>
                        </li>
                      ))}
                    </ul>
                    {/* <button className="mt-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium group/btn">
                      Voir les événements
                      <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button> */}
                  </div>
                ))}
              </div>
            </div>

            {/* Forums Section avec image animée */}
            <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-lg p-8 mb-12 overflow-hidden border border-blue-100">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Texte à gauche */}
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <UsersIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-black">Forums de discussion</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-4">Pour les membres</h4>
                      <ul className="space-y-4">
                        <li className="flex items-center gap-3 group hover:translate-x-2 transition-transform">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-700">Échangez sur des sujets qui vous passionnent</span>
                        </li>
                        <li className="flex items-center gap-3 group hover:translate-x-2 transition-transform">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-gray-700">Partagez vos expériences et conseils</span>
                        </li>
                        <li className="flex items-center gap-3 group hover:translate-x-2 transition-transform">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-gray-700">Créez vos propres groupes de discussion</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-4">Pour les traducteurs</h4>
                      <ul className="space-y-4">
                        <li className="flex items-center gap-3 group hover:translate-x-2 transition-transform">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          <span className="text-gray-700">Animez des discussions spécialisées</span>
                        </li>
                        <li className="flex items-center gap-3 group hover:translate-x-2 transition-transform">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          <span className="text-gray-700">Partagez vos connaissances en LSF</span>
                        </li>
                        <li className="flex items-center gap-3 group hover:translate-x-2 transition-transform">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          <span className="text-gray-700">Connectez-vous avec la communauté</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                </div>

                {/* Image animée à droite */}
                <div className="lg:w-1/2 relative">
                  <div className="relative h-64 lg:h-96 rounded-xl overflow-hidden shadow-2xl">
                    {/* Image statique avec overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-10"></div>
                    
                    {/* Animation de bulles de discussion */}
                    <div className="absolute inset-0 z-20">
                      {/* Bulle 1 */}
                      <div className="absolute top-8 left-8 w-16 h-16 bg-white rounded-full shadow-lg animate-float">
                        <div className="absolute inset-2 bg-blue-100 rounded-full"></div>
                      </div>
                      
                      {/* Bulle 2 */}
                      <div className="absolute top-20 right-12 w-20 h-20 bg-white rounded-full shadow-lg animate-float" style={{animationDelay: '0.5s'}}>
                        <div className="absolute inset-3 bg-green-100 rounded-full"></div>
                      </div>
                      
                      {/* Bulle 3 */}
                      <div className="absolute bottom-16 left-12 w-14 h-14 bg-white rounded-full shadow-lg animate-float" style={{animationDelay: '1s'}}>
                        <div className="absolute inset-2 bg-purple-100 rounded-full"></div>
                      </div>
                      
                      {/* Bulle 4 */}
                      <div className="absolute bottom-8 right-8 w-24 h-24 bg-white rounded-full shadow-lg animate-float" style={{animationDelay: '1.5s'}}>
                        <div className="absolute inset-4 bg-yellow-100 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Texte au centre */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <div className="text-center">
                        <div className="text-6xl mb-4">💬</div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Échanges dynamiques</h4>
                        <p className="text-gray-600">Discussions en temps réel</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Points décoratifs */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-300 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-300 rounded-full opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section finale */}
        <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">
              Rejoignez notre communauté inclusive
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Que vous cherchiez à rencontrer des traducteurs, participer à des événements 
              ou simplement échanger avec des personnes partageant vos expériences, 
              vous trouverez votre place ici.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => router.push('/sign-in')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
                S'inscrire gratuitement
              </button>
              <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors">
                Explorer la communauté
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Styles CSS pour les animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}