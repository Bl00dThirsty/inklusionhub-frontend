// app/formations/categories/page.tsx
import React from 'react';
import { 
  Hand, MessageSquare, Code, Globe, 
  Headphones, BookOpen, Award, Users,
  Search, Filter
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  { 
    id: 'langue-des-signes',
    icon: <Hand className="w-8 h-8" />, 
    name: 'Langue des Signes', 
    count: 24,
    description: 'Maîtrisez la LSF avec nos formations adaptées'
  },
  { 
    id: 'communication',
    icon: <MessageSquare className="w-8 h-8" />, 
    name: 'Communication', 
    count: 18,
    description: 'Communication inclusive et adaptative'
  },
  { 
    id: 'accessibilite-web',
    icon: <Code className="w-8 h-8" />, 
    name: 'Accessibilité Web', 
    count: 15,
    description: 'Standards WCAG et développement accessible'
  },
  { 
    id: 'inclusion-digitale',
    icon: <Globe className="w-8 h-8" />, 
    name: 'Inclusion Digitale', 
    count: 12,
    description: 'Transformation digitale accessible'
  },
  { 
    id: 'technologies-adaptees',
    icon: <Headphones className="w-8 h-8" />, 
    name: 'Technologies Adaptées', 
    count: 9,
    description: 'Outils et technologies d\'assistance'
  },
  { 
    id: 'pedagogie-inclusive',
    icon: <BookOpen className="w-8 h-8" />, 
    name: 'Pédagogie Inclusive', 
    count: 21,
    description: 'Méthodes pédagogiques adaptées'
  },
  { 
    id: 'certifications',
    icon: <Award className="w-8 h-8" />, 
    name: 'Certifications', 
    count: 14,
    description: 'Formations certifiantes reconnues'
  },
  { 
    id: 'management-inclusif',
    icon: <Users className="w-8 h-8" />, 
    name: 'Management Inclusif', 
    count: 11,
    description: 'Leadership et management inclusifs'
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Explorez toutes nos catégories de formations
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Découvrez plus de 100 formations organisées par thème pour trouver exactement ce dont vous avez besoin.
            </p>
            
            <div className="relative max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une catégorie..."
                  className="w-full px-6 py-4 pr-14 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2">
                  <Search className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Toutes les catégories
              </h2>
              <p className="text-gray-600">{categories.length} catégories disponibles</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-700 hover:text-blue-600">
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/formations/categories/${category.id}`}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2 text-gray-900 group-hover:text-blue-600">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">
                    {category.count} formations
                  </span>
                  <span className="text-gray-400 group-hover:text-blue-400">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour discuter de vos besoins spécifiques. Nous pouvons créer des formations sur mesure.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all">
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}