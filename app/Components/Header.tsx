"use client";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react"
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../Components/ThemeToggle";
import { usePathname } from 'next/navigation';
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/Communication/LandingPage', label: 'Communication' },
    { href: '/formation/LandingPage', label: 'Formation' },
    { href: '/ViePro/landing_page', label: 'Emplois' },
    { href: '/VieCom/landing_page', label: 'Communauté' },
  ];
  return (
     <header className="w-full bg-white shadow-sm py-4 px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <div className="w-8 h-8 bg-green-400 rounded-full"></div>
        <span className="text-black font-semibold text-base">InklusionHub</span>
      </div>

      {/* Navigation */}
       <nav className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0 text-sm">
      {navItems.map((link) => {
        const isActive = pathname === link.href; // Vérifie si on est sur la page actuelle

        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
                : 'text-black hover:text-blue-500 transition'
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => router.push(`/sign-up/`)}
          className="px-6 py-2 rounded-full text-sm text-blue-600 hover:scale-105" style={{ backgroundColor: "#82EFCF" }}>
          S'inscrire
        </button>
        <button 
          onClick={() => router.push(`/sign-in/`)}
          className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm hover:scale-105">
          Connexion
        </button>
      </div>
      <ThemeToggle />
    </header>
  );
}
