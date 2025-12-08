"use client";

import { ChevronDown, Search } from "lucide-react";
import { ReactNode } from "react";

interface FormationLayoutProps {
  children?: ReactNode;
}

export default function FormationLayout({ children }: FormationLayoutProps) {
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* --- Hero Banner --- */}
      <div className="relative h-[400px] bg-gradient-to-r bg-[url('/images/banner.jpg')] bg-cover bg-center mb-12">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl">
            Apprenez, progressez et améliorez vos connaissances
          </h1>
          <p className="text-xl mt-6 text-center max-w-2xl">
            Explorez nos formations pour maîtriser la communication inclusive
          </p>
        </div>
      </div>

      {/* --- Search & Filters --- */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Catalogue des cours</h2>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un cours"
            className="w-full pl-12 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span>Niveau</span>
            <ChevronDown size={16} />
          </button>

          <button className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span>Durée</span>
            <ChevronDown size={16} />
          </button>

          <button className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span>Langue</span>
            <ChevronDown size={16} />
          </button>

          <button className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
            <span>LSF Disponible</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}