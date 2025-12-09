"use client";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react"
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../Components/ThemeToggle";
export default function Header() {
  const router = useRouter();
  return (
     <header className="w-full bg-white shadow-sm py-4 px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <div className="w-8 h-8 bg-green-400 rounded-full"></div>
        <span className="text-black font-semibold text-base">InklusionHub</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0 text-sm">
        <Link href="/" className="text-blue-600">Accueil</Link>
        <Link href="/Communication" className="text-black">Communication</Link>
        <Link href="/formation" className="text-black">Formation</Link>
        <Link href="/ViePro" className="text-black">Emplois</Link>
        <Link href="/VieCom" className="text-black">Communauté</Link>
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
