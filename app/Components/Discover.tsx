"use client";

export default function Discover() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-start">
      <div>
        <h2 className="text-2xl font-bold text-black text-left">Découvrir la surdité</h2>
        <p className="mt-4 text-gray-600 text-left text-lg">
          Plongez dans une expérience immersive pour mieux comprendre le monde
          des personnes sourdes et malentendantes.
        </p>

        <div className="mt-4 flex text-gray-500 items-right gap-3 text-sm">
          <span>🎬 Sous-titres disponibles</span>
          <span>🤟 Traduction LSF</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden shadow-md">
        <iframe
            className="w-full h-64 rounded-xl"
            src="https://www.youtube.com/embed/dBK4xEYhjXc"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        >
        </iframe>
      </div>
    </section>
  );
}
