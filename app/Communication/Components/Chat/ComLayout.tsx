"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommunicationLayoutProps {
  children: React.ReactNode;
  className?: string; // optional className
}

export default function CommunicationLayout({ children, className }: CommunicationLayoutProps) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-6">
      <h1 className="text-3xl font-bold text-black mb-2">Communication</h1>
      <p className="text-gray-600 mb-6">
        Échangez dans un espace moderne, simple et accessible.
      </p>
        <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          aria-label="Retour"
        >
          <ArrowLeft size={22} />
        </button>
        </div>
      <div
        className={`grid grid-cols-12 gap-4 w-full max-w-[2000px] bg-white shadow-xl rounded-2xl p-4 md:p-6 mx-auto ${className || ''}`}
      >
        {children}
      </div>
    </div>
  );
}
