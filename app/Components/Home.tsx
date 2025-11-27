"use client";
import Image from "next/image";

export default function Home() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-3xl font-bold text-black leading-tight">
          Connecter les mondes, <br /> briser les barrières
        </h1>
        <p className="mt-4 text-gray-600">
          Bienvenue sur InklusionHub, la passerelle entre le monde des sourds,
          malentendants et entendants.
        </p>

        <div className="flex gap-4 mt-6">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full">
            Commencer maintenant
          </button>
          <button className="border px-5 py-2 rounded-full"style={{ backgroundColor: "#82EFCF" }}>
            Découvrir la surdité
          </button>
        </div>
      </div>
      <Image
        src={"/images/lsf.jpg"}
        alt="Hero image"
        width={600}
        height={400}
        className="rounded-xl shadow-md"
      />
    </section>
  );
}
