"use client";
import { useRouter } from 'next/navigation';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Testimonials from "../../Components/Testimonials";
import Image from "next/image";
import { BriefcaseIcon, UserGroupIcon, DocumentCheckIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function VieProPage() {
  const router = useRouter();
  const features = [
    {
      icon: <BriefcaseIcon className="h-10 w-10" />,
      title: "Offres d'emploi inclusives",
      color: 'text-blue-500 bg-blue-50',
      description: "Des opportunités spécialement adaptées pour les personnes sourdes et malentendantes dans des entreprises engagées pour l'inclusion."
    },
    {
      icon: <UserGroupIcon className="h-10 w-10" />,
      title: "Recrutement adapté",
      color: 'text-purple-500 bg-purple-50',
      description: "Processus de recrutement pensé pour valoriser les compétences au-delà des barrières de communication."
    },
    {
      icon: <DocumentCheckIcon className="h-10 w-10" />,
      title: "Profils professionnels",
      color: 'text-green-500 bg-green-50',
      description: "Créez votre profil professionnel, déposez votre CV et mettez en avant vos compétences de manière accessible."
    },
    {
      icon: <CalendarDaysIcon className="h-10 w-10" />,
      title: "Entretiens adaptés",
      color: 'text-indigo-500 bg-indigo-50',
      description: "Planifiez des entretiens avec interprétation LSF ou des aménagements selon vos besoins spécifiques."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Pour les employeurs",
      items: [
        "Publiez vos offres d'emploi inclusives",
        "Accédez à des profils qualifiés",
        "Planifiez des entretiens avec interprétation LSF",
        "Bénéficiez d'un accompagnement pour l'inclusion"
      ]
    },
    {
      step: "2",
      title: "Pour les candidats",
      items: [
        "Créez votre profil professionnel",
        "Déposez votre CV et portfolio",
        "Postulez aux offres adaptées",
        "Suivez vos candidatures en temps réel"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
       <section className="relative py-24 overflow-hidden">
        {/* Image de fond avec flou */}
            <div className="absolute inset-0 z-0">
                <Image
                src="/images/viep.jpg"
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
                    Vie Professionnelle
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 drop-shadow-md">
                     Une plateforme dédiée à l'inclusion professionnelle des personnes sourdes 
              et malentendantes. Connectez talents et opportunités sans barrières.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                       onClick={() => router.push('/sign-in')}
                       className="bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                       Voir les offres d'emploi
                    </button>
                    <button 
                       onClick={() => router.push('/offer')}
                       className="bg-white text-blue-600 px-8 py-4 rounded-full font-medium hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                       style={{ backgroundColor: "#82EFCF" }}
                    >
                      Publier une offre
                    </button>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-black text-center mb-12">
              Comment fonctionne notre plateforme emploi ?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div 
                   className={`mb-4 w-14 h-14 rounded-xl flex items-center justify-center ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* How It Works */}
            <div className="grid md:grid-cols-2 gap-12">
              {howItWorks.map((section) => (
                <div key={section.step} className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {section.step}
                    </div>
                    <h3 className="text-2xl font-bold text-black">{section.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-100 to-green-100">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-black mb-2">500+</div>
                <div className="text-gray-600">Offres d'emploi</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-black mb-2">200+</div>
                <div className="text-gray-600">Entreprises partenaires</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-black mb-2">1,500+</div>
                <div className="text-gray-600">Candidats actifs</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-black mb-2">85%</div>
                <div className="text-gray-600">Taux de satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* < Testimonials /> */}

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">
              Prêt à faire avancer l'inclusion professionnelle ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Que vous soyez employeur cherchant des talents ou candidat recherchant 
              une opportunité, rejoignez notre communauté inclusive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => router.push(`/sign-up/`)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
                Créer un compte
              </button>
              
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}