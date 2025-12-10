// app/communication-inclusive/page.tsx
import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Hand, 
  MessageSquare, 
  Video, 
  Captions, 
  Mic, 
  Type, 
  Users, 
  Zap,
  CheckCircle,
  Globe,
  Smartphone,
  Headphones
} from 'lucide-react';

export default function CommunicationInclusivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Communication Inclusive en Temps Réel
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Combler le fossé entre les communautés entendantes, malentendantes et sourdes
              </p>
              {/*<button className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                Découvrir comment ça marche
              </button>*/}
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-pink-400 rounded-full opacity-20"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-400 rounded-full"></div>
                      <div>
                        <div className="font-semibold">Personne qui parle</div>
                        <div className="text-sm opacity-80">En train de parler...</div>
                      </div>
                    </div>
                    <Mic className="w-8 h-8" />
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl mb-4">
                    <div className="text-lg mb-2">"Bonjour, comment allez-vous ?"</div>
                    <div className="flex items-center text-sm">
                      <Captions className="w-4 h-4 mr-2" />
                      Sous-titres activés
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                      <Hand className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Avatar LSF</div>
                      <div className="text-sm opacity-80">Traduction en Langue des Signes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Pour Tous" */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Une plateforme adaptée à chaque besoin
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Carte Entendants */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Volume2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Pour les entendants</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Interface intuitive et familière</span>
                </li>
                <li className="flex items-start">
                  <Mic className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Chat vocal haute qualité</span>
                </li>
                <li className="flex items-start">
                  <Video className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Appels vidéo fluides</span>
                </li>
                <li className="flex items-start">
                  <Type className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Messagerie texte instantanée</span>
                </li>
              </ul>
            </div>

            {/* Carte Malentendants */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <VolumeX className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Pour les malentendants</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Captions className="w-5 h-5 text-purple-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Sous-titrage automatique temps réel</span>
                </li>
                <li className="flex items-start">
                  <Headphones className="w-5 h-5 text-purple-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Amplification audio personnalisable</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-purple-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Indicateurs visuels des sons</span>
                </li>
                 {/*<li className="flex items-start">
                  <Smartphone className="w-5 h-5 text-purple-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Compatibilité prothèses auditives</span>
                </li>*/}
              </ul>
            </div>

            {/* Carte Sourds-muets */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <Hand className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Pour les sourds-muets</h3>
              </div>
              <ul className="space-y-4">
                {/*<li className="flex items-start">
                  <div className="w-5 h-5 text-green-600 mr-3 mt-1"></div>
                  <span className='text-gray-600'>Reconnaissance LSF par IA avancée</span>
                </li>*/}
                <li className="flex items-start">
                  <Type className="w-5 h-5 text-green-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Transcription instantanée des signes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 text-green-600 mr-3 mt-1">👤</div>
                  <span className='text-gray-600'>Avatar 3D signant en temps réel</span>
                </li>
                <li className="flex items-start">
                  <Users className="w-5 h-5 text-green-600 mr-3 mt-1" />
                  <span className='text-gray-600'>Communauté de signeurs intégrée</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités Techniques */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Technologies Innovantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Mic className="w-8 h-8" />,
                title: "Reconnaissance vocale → texte",
                desc: "Transcription précise en temps réel"
              },
              {
                icon: <Type className="w-8 h-8" />,
                title: "Synthèse texte → parole",
                desc: "Voices naturelles et personnalisables"
              },
              {
                icon: <Hand className="w-8 h-8" />,
                title: "Reconnaissance LSF par IA",
                desc: "Détection précise des signes"
              },
              {
                icon: <Captions className="w-8 h-8" />,
                title: "Sous-titrage temps réel",
                /*desc: "Précision de 99%, délai < 1s"*/
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Chat multimodal",
                desc: "Texte, audio, vidéo, signes"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Traduction multilingue",
                desc: "Plus de 5 langues supportées"
              }
            ].map((tech, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-blue-600">
                    {tech.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{tech.title}</h3>
                <p className="text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Démonstration */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Comment ça marche ?
          </h2>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Une conversation fluide et naturelle</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                      1
                    </div>
                    <div>
                      <div className="font-semibold">Une personne parle</div>
                      <div className="opacity-90">La reconnaissance vocale capte la parole</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                      2
                    </div>
                    <div>
                      <div className="font-semibold">Transcription instantanée</div>
                      <div className="opacity-90">Le texte apparaît avec les sous-titres</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                      3
                    </div>
                    <div>
                      <div className="font-semibold">Traduction en LSF</div>
                      <div className="opacity-90">L'avatar 3D signe le message</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 rounded-2xl p-6">
                  <div className="text-center">
                    <iframe
                          className="w-full h-64 rounded-xl"
                          src="https://www.youtube.com/embed/U0FiuzEd-gY" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                      >
                    </iframe>
                    <div className="opacity-80 mt-2">Voir une demonstration</div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Les avantages de notre solution
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Communication sans barrière",
                desc: "Supprime les obstacles entre les communautés"
              },
              {
                title: "Apprentissage inclusif",
                desc: "Éducation accessible à tous les profils"
              },
              {
                title: "Intégration professionnelle",
                desc: "Outil essentiel pour l'inclusion en entreprise"
              },
              {
                title: "Accessibilité permanente",
                desc: "24/7, sur tous vos appareils"
              }
            ].map((avantage, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <CheckCircle className="w-10 h-10 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{avantage.title}</h3>
                <p className="text-gray-600">{avantage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Prêt à communiquer sans limites ?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà franchi le pas vers une communication véritablement inclusive.
          </p>
         {/*<div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
              S'inscrire gratuitement
            </button>
            <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105">
              Voir la démo
            </button>
          </div>
          <p className="mt-8 text-gray-500">
            Aucune carte bancaire requise • Essai de 30 jours
          </p>*/}
        </div>
      </section>

        {/*Footer 
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-400">
            © 2024 InklusionHub. Tous droits réservés. | 
            <a href="#" className="ml-2 hover:text-white transition-colors">Accessibilité</a> • 
            <a href="#" className="ml-2 hover:text-white transition-colors">Confidentialité</a> • 
            <a href="#" className="ml-2 hover:text-white transition-colors">Conditions d'utilisation</a>
          </p>
        </div>
      </footer>*/}
    </div>
  );
}