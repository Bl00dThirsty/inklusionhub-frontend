"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommunicationLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function CommunicationLayout({ children, className }: CommunicationLayoutProps) {
  const router = useRouter();
  
  return (
    <div className="h-full flex flex-col bg-gray-50 px-4 py-6 md:px-6 md:py-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-black">Communication</h1>
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full gap-2 bg-white shadow-md text-black px-4 py-2 rounded-lg flex items-center"
          aria-label="Retour"
        >
          <ArrowLeft size={22} />
        </button>
      </div>
      
      <div className={`flex-1 bg-white shadow-xl rounded-2xl p-4 md:p-6 overflow-hidden ${className || ''}`}>
        
          {children}
       
      </div>
    </div>
  );
}