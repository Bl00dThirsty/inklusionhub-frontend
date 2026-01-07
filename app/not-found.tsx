// app/not-found.tsx
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Page non trouvée
        </h2>
        <p className="text-gray-600 mb-8">
          Désolé, nous n'avons pas trouvé la page que vous cherchez.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home size={20} />
            Retour à l'accueil
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <Search size={20} />
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}