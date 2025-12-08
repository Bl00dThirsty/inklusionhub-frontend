'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Logique de connexion ici
      console.log({ email });
    };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié ?</h1>
            <p className="text-gray-600">Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
            {/* <h2 className="mt-4 text-2xl font-semibold text-gray-900">BIENVENUE</h2> */}
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
             <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse e-mail
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Votre email"
                  />
                </div>
             </div>
          
          
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Envoyer
              </button>
            </div>
          </form>
          {/* Divider */}
          <div className="mt-6">

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Retour à la page de{' '}
                <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
                  connexion
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}