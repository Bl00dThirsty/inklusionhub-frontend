"use client";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react"
import Image from "next/image";
import { ThemeToggle } from "../Components/ThemeToggle";

export default function Header() {
  const router = useRouter();
  return (
    <header className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-400 rounded-full"></div>
        <span className="text-black">InklusionHub</span>
      </div>

      {/* Navigation */}
      <nav className="flex gap-6 text-sm">
        <a href="/" className="text-blue-600">Accueil</a>
        <a href="/Communication" className="text-black">Communication</a>
        <a href="/formation" className="text-black">Formation</a>
        <a href="/communaute" className="text-black">Communauté</a>
      </nav>

      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => router.push(`/sign-up/`)}
          className="px-4 py-1 rounded-full text-sm text-white" style={{ backgroundColor: "#82EFCF" }}>
          S'inscrire
        </button>
        <button 
          onClick={() => router.push(`/sign-in/`)}
          className="px-4 py-1 bg-blue-600 text-white rounded-full text-sm">
          Connexion
        </button>
      </div>
      <ThemeToggle />
    </header>
  );
}
