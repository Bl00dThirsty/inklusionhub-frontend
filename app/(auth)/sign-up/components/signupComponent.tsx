'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from "lucide-react";

export default function SignupComponent() {
  const [formData, setFormData] = useState({
    name: '',
    forename:'',
    email: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  }

  if (!/\d/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre";
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Le mot de passe doit contenir au moins un caractère spécial";
  }

  return null;
};

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // 🔐 Validation mot de passe
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    setErrors({ password: passwordError });
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/register/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        forename: formData.forename,
        email: formData.email,
        password: formData.password
      }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // 1. Stocker le token d'accès JWT
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      
      console.log('Token stocké:', data.tokens.access.substring(0, 20) + '...');
      // 2. Stocker les infos utilisateur 
      //localStorage.setItem('user', JSON.stringify(data.user));      
      // 3. Rediriger vers l'onboarding
      router.push('/role-selection');
    } else {
      setErrors({ 
        submit: data.message || data.error || 'Erreur lors de l\'inscription' 
      });
    }
  } catch (error) {
    console.error('Erreur:', error);
    setErrors({ submit: 'Erreur de connexion au serveur' });
  }
};

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom 
          
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Entrez votre nom"
          />
        </div>
      </div>
        {/* Forename */}
      <div>
        <label htmlFor="forename" className="block text-sm font-medium text-gray-700">
          Prénom 
          
        </label>
        <div className="mt-1">
          <input
            id="forename"
            name="forename"
            type="text"
            autoComplete="forename"
            required
            value={formData.forename}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Entrez votre prenom"
          />
        </div>
      </div>


      {/* Email */}
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
            value={formData.email}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Entrez votre e-mail"
          />
        </div>
      </div>

       
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
             Mot de passe
        </label>

      <div className="mt-1 relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Entrez un mot de passe"
      />

         {/* Bouton show/hide */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
     </div>

      {errors.password && (
      <p className="mt-1 text-sm text-red-600">
        {errors.password}
      </p>
      )}
    </div>


      {/* Terms & Conditions */}
      <div className="text-sm text-center text-gray-600">
        <p>
          En cliquant sur Continuer, vous acceptez nos{' '}
          <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
            Conditions d'utilisation
          </Link>{' '}
          et notre{' '}
          <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
            Politique de confidentialité
          </Link>
        </p>
      </div>

      {/* Soumettre*/}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continuer
        </button>
      </div>
    </form>
  );
}


{/* Role Selection */}
      {/* <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          S'inscrire en tant que
        </label>
        <div className="mt-1">
          <select
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Selectionnez votre role</option>
            <option value="malentendant">Malentendant</option>
            <option value="apprenant">Apprenant</option>
            <option value="employeur">Employeur</option>
            <option value="traducteur">Traducteur</option>
            <option value="formateur">Formateur</option>
          </select>
        </div>
      </div> */}