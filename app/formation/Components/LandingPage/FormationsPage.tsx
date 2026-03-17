// app/formations/page.tsx
import React from 'react';
import { 
  BookOpen, 
  Users, 
  Award, 
  Video, 
  FileText, 
  MessageSquare,
  ChevronRight,
  Star,
  CheckCircle,
  PlayCircle,
  Globe,
  Clock,
  UserCheck,
  TrendingUp,
  Heart,
  Bookmark,
  Share2,
  Hand,
  Link,
  Film,
  Gamepad2
} from 'lucide-react';

export default function FormationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-600 leading-tight mb-6">
                Formation<br />
                Inclusive<br />
                en Ligne
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Apprenez, échangez, grandissez ensemble - 
                Quel que soit votre profil
              </p>
             <a href="/formation/Components/Decouvrir" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center">
                Découvrir les formations
                <ChevronRight className="ml-2 w-5 h-5" />
              </a>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-300 to-purple-300 rounded-2xl p-6 text-white shadow-xl">
                  <div className="text-4xl font-bold mb-2">5000+</div>
                  <div className="text-lg">apprenants</div>
                  <div className="flex mt-2">
                    {[1,].map((i) => (
                      <Users key={i} className="w-5 h-5 mr-1 opacity-80" />
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-300 to-teal-300 rounded-2xl p-6 text-white shadow-xl">
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-lg">de satisfaction</div>
                  <div className="flex mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 mr-1 fill-white" />
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-300 to-pink-300 rounded-2xl p-6 text-white shadow-xl col-span-2 mt-4">
                  <div className="flex items-center">
                    <Award className="w-12 h-12 mr-4" />
                    <div>
                      <div className="text-2xl font-bold">25+</div>
                      <div className="text-lg">Formations en lignes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue de Formations */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-600 mb-4">
              Catalogue de Formations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des parcours adaptés à tous les besoins et tous les niveaux
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Formation 1 - LSF */}
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8 border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                  <div className="relative">
                      <Hand className="w-4 h-4 transform rotate-12" />
                      <Hand className="w-4 h-4 transform -rotate-12 -ml-4" />
                    </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Langue des Signes Française</h3>
                  <div className="flex items-center text-blue-600">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>LSF</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Maîtrisez la Langue des Signes Française avec notre méthode progressive adaptée à tous.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span className='text-black'>Niveaux débutant à expert</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span className='text-black'>Cours avec interprètes certifiés</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span className='text-black'>Certification reconnue</span>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                <PlayCircle className="w-5 h-5 mr-2" />
                Voir le programme
              </button>
            </div>

            {/* Formation 2 - Communication */}
            <div className="bg-gradient-to-b from-purple-50 to-white rounded-3xl p-8 border border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Communication Inclusive</h3>
                  <div className="flex items-center text-purple-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Mixte</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Apprenez à communiquer efficacement dans des environnements mixtes et inclusifs.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span className='text-black'>Techniques adaptatives</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span className='text-black'>Outils numériques inclusifs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span className='text-black'>Cas pratiques réels</span>
                </div>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center">
                <PlayCircle className="w-5 h-5 mr-2" />
                Voir le programme
              </button>
            </div>

            {/* Formation 3 - Professionnel */}
            <div className="bg-gradient-to-b from-green-50 to-white rounded-3xl p-8 border border-green-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-300 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Compétences Professionnelles</h3>
                  <div className="flex items-center text-green-600">
                   <Award className="w-4 h-4 mr-1" />
                    <span>Certifiante</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Développez des compétences recherchées dans le domaine de l'inclusion professionnelle.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span className='text-black'>Accessibilité numérique</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span className='text-black'>Management inclusif</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span className='text-black'>Certifications reconnues</span>
                </div>
              </div>
              <button className="w-full bg-green-300 text-white py-3 rounded-xl font-medium hover:bg-green-300 transition-colors flex items-center justify-center">
                <PlayCircle className="w-5 h-5 mr-2" />
                Voir le programme
              </button>
            </div>
          </div>

          <div className="text-center">
            <button className="text-blue-600 font-semibold text-lg hover:text-blue-700 transition-colors flex items-center justify-center mx-auto">
              Voir toutes les formations
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Méthodologie Pédagogique */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
            Méthodologie Pédagogique
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Film, title: "Vidéos", desc: "Multimodales" },
              { icon: FileText, title: "Textes", desc: "Adaptés" },
              { icon: Users, title: "Classes", desc: "Virtuelles" },
              { icon: Gamepad2, title: "Exercices", desc: "Interactifs" }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                  <div className="flex justify-center mb-4">
                    <IconComponent className="w-12 h-12 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Une approche unique et inclusive</h3>
                <p className="text-gray-600 mb-6">
                  Notre méthodologie combine les meilleures pratiques pédagogiques avec des technologies d'accessibilité avancées pour garantir un apprentissage efficace pour tous.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className='text-black'>Contenu accessible sous 3 formats minimum</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className='text-black'>Apprentissage à votre rythme</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className='text-black'>Support personnalisé inclusif</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="flex justify-center mb-4">
                      <TrendingUp className="w-12 h-12" />
                    </div>
                    <div className="text-xl font-bold">+45% de réussite</div>
                    <div className="opacity-90">avec notre méthode</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Témoignages
            </h2>
            <p className="text-xl text-gray-600">
              Ce que disent nos apprenants
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie L.",
                role: "Enseignante",
                text: "Grâce aux formations LSF, je peux maintenant communiquer avec tous mes élèves sans barrière.",
                rating: 5,
                 image: "/images/sophie.jpg",
              },
              {
                name: "Thomas D.",
                role: "Manager IT",
                text: "La formation sur l'accessibilité numérique a transformé notre façon de concevoir nos produits.",
                rating: 5,
                image: "/images/thomas.jpg",
              },
              {
                name: "Sophie M.",
                role: "Étudiante",
                text: "En tant que malentendante, j'ai enfin trouvé des formations vraiment adaptées à mes besoins.",
                rating: 5,
                 image: "/images/sophie.jpg",
              }
            ].map((temoignage, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4"><img src={temoignage.image} alt={temoignage.name} className="w-24 h-24 rounded-full" /></div>
                  <div>
                    <h4 className="font-bold text-lg text-black">{temoignage.name}</h4>
                    <p className="text-gray-600">{temoignage.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">"{temoignage.text}"</p>
                <div className="flex">
                  {[...Array(temoignage.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Commencez votre parcours de formation inclusif
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Rejoignez notre communauté d'apprenants et développez vos compétences dans un environnement 100% inclusif.
          </p>
        </div>
      </section>
    </div>
  );
}