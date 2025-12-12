"use client";

import { CheckCircle, Clock } from "lucide-react";

interface QuizItem {
  id: number;
  title: string;
  status: "Terminer" | "A Faire";
  progress: number;
}

const quizItems: QuizItem[] = [
  { id: 1, title: "Quiz du module 1", status: "Terminer", progress: 100 },
  { id: 2, title: "Quiz du module 2", status: "A Faire", progress: 0 },
  { id: 3, title: "Quiz du module 3", status: "A Faire", progress: 0 },
];

export default function QuizSection() {
  return (
    <section className="py-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Quiz</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizItems.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{quiz.title}</h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Progression</span>
                  <span className={`font-bold ${
                    quiz.status === "Terminer" ? "text-green-600" : "text-blue-600"
                  }`}>
                    {quiz.progress}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      quiz.status === "Terminer" ? "bg-green-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${quiz.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {quiz.status === "Terminer" ? (
                    <>
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="text-green-600 font-medium">{quiz.status}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="text-blue-600" size={20} />
                      <span className="text-blue-600 font-medium">{quiz.status}</span>
                    </>
                  )}
                </div>
                
                <button className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  quiz.status === "Terminer" 
                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}>
                  {quiz.status === "Terminer" ? "Réviser" : "Commencer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}