"use client";

interface CommunicationLayoutProps {
  children: React.ReactNode;
  className?: string; // optional className
}

export default function CommunicationLayout({ children, className }: CommunicationLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-6">
      <h1 className="text-3xl font-bold text-black mb-2">Communication</h1>
      <p className="text-gray-600 mb-6">
        Échangez dans un espace moderne, simple et accessible.
      </p>

      <div
        className={`grid grid-cols-12 gap-4 w-full max-w-[2000px] bg-white shadow-xl rounded-2xl p-4 md:p-6 mx-auto ${className || ''}`}
      >
        {children}
      </div>
    </div>
  );
}
