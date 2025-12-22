"use client";

import { Trophy, Play, Eye } from "lucide-react";

interface ProgressItem {
  id: number;
  title: string;
  progress: number;
  status: string;
  excellent?: boolean;
}

const progressItems: ProgressItem[] = [
  { id: 1, title: "Communcation en milieu pro", progress: 2, status: "Démarrer le Quiz" },
  { id: 2, title: "Base de la LSF", progress: 90, status: "Exellent travail!", excellent: true },
  { id: 3, title: "Base de la LSF", progress: 90, status: "Reprendre où j'ai arrêté" },
];

export default function LearningProgress() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Mon apprentissage</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Cards */}
          <div className="space-y-6">
            {progressItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{item.title}</h3>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Progression total</span>
                    <span className={`font-bold ${
                      item.excellent ? "text-green-600" : "text-blue-600"
                    }`}>
                      {item.progress}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.excellent ? "bg-green-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {item.excellent && <Trophy className="text-yellow-500" size={20} />}
                    <span className={`font-medium ${
                      item.excellent ? "text-green-600" : "text-gray-700"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <button className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    item.excellent 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}>
                    {item.excellent ? (
                      <>
                        <Play size={16} />
                        Reprendre où j'ai arrêté
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Démarrer le Quiz
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Lesson Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="mb-6">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Aperçu de la leçon
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Leçon 3: les salutations en LSF
            </h3>
            
            <p className="text-gray-600 mb-6">
              Un aperçu rapide des signes essentiels pour saluer et présenter
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-gray-700 font-medium mr-4">Niveau:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Débutant
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">LSF:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-gray-700">Activer la traduction LSF</span>
                </label>
              </div>
            </div>
            
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Voir les cours
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}