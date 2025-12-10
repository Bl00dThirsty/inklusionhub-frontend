"use client";

export default function CommunicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <h1 className="text-3xl font-bold text-black mb-2">Communication</h1>
      <p className="text-gray-600 mb-6">Échangez dans un espace moderne, simple et accessible.</p>

     <div className="grid grid-cols-12 gap-4 w-full max-w-[2000px] bg-white shadow-xl rounded-2xl p-6 mx-auto">
        {children}
      </div>
    </div>
  );
}
