"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { useLoginUserMutation, } from "@/state/api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../context/authContext";

/* ---------------------------------------------
   Utils – Type guards
---------------------------------------------- */

function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

/* ---------------------------------------------
   Component
---------------------------------------------- */

export default function LoginComponent() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ submit: '' });
  const [login, { isLoading, error }] = useLoginUserMutation();
  const { login: authLogin } = useAuth();
  const ROLE_ROUTES = {
    admin: "/dashboard/admin",
    employeur: "/dashboard/",
    traducteur: "/dashboard/traducteur",
    malentendant: "/dashboard/malentendant",
    entendant: "/dashboard/entendant",
    apprenant: "/dashboard/apprenant",
  } as const;

  /* ---------------------------------------------
     Centralized error message
  ---------------------------------------------- */

  const errorMessage =
    isFetchBaseQueryError(error)
      ? (error.data as any)?.detail ||
        (error.data as any)?.message ||
        "Email ou mot de passe incorrect."
      : null;

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const result = await login({ email, password }).unwrap();

  //     const userRole =
  //       result.user.role as keyof typeof ROLE_ROUTES;

  //     const redirectPath =
  //       ROLE_ROUTES[userRole] ?? "/dashboard";

  //     router.push(redirectPath);

  //   } catch (err) {
  //     console.error("Erreur login:", err);

  //     // fallback sécurité (au cas où)
  //     alert(
  //       isFetchBaseQueryError(err)
  //         ? (err.data as any)?.detail ||
  //           (err.data as any)?.message ||
  //           "Email ou mot de passe incorrect."
  //         : "Erreur inconnue. Veuillez réessayer."
  //     );
  //   }
  // };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({ submit: '' });

  try {
    const result = await login({ email, password }).unwrap();

    if (!result?.access || !result?.refresh) {
  throw new Error("Tokens manquants dans la réponse");
}

    //  STOCKAGE DES TOKENS (OBLIGATOIRE)
    localStorage.setItem("access_token", result.access);
    localStorage.setItem("refresh_token", result.refresh);

    //  CONTEXTE AUTH (UI / state)
    authLogin(
      {
        access: result.access,
        refresh: result.refresh,
      },
      result.user
    );

    router.push("/dashboard");

  } catch (error) {
    console.error("Erreur login:", error);
    setErrors({ submit: "Email ou mot de passe incorrect." });
  }
};


  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Adresse e-mail
        </label>

        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md
                     placeholder-gray-400 focus:outline-none focus:ring-blue-500
                     focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
          placeholder="Entrez votre email"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Mot de passe
        </label>

        <div className="mt-1 relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md
                       placeholder-gray-400 focus:outline-none focus:ring-blue-500
                       focus:border-blue-500 sm:text-sm pr-10 disabled:bg-gray-100"
            placeholder="Entrez votre mot de passe"
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 pr-3 flex items-center
                       focus:outline-none disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 rounded-md text-white bg-blue-600
                   hover:bg-blue-700 focus:outline-none focus:ring-2
                   focus:ring-offset-2 focus:ring-blue-500
                   disabled:opacity-50"
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>

      {/* Error display */}
      {errorMessage && (
        <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded">
          {errorMessage}
        </div>
      )}
    </form>
  );
}
