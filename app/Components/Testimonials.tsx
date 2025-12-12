"use client";
import Image from "next/image";

export default function Testimonials() {
  const people = [
    {
      name: "Marc Dupont",
      text: "Une plateforme incroyable qui m’a aidé à mieux comprendre la communauté sourde.",
      image: "/images/marc.jpg",
    },
    {
      name: "Thomas Martin",
      text: "Les formations sont claires, inclusives et très professionnelles. Bravo !",
      image: "/images/thomas.jpg",
    },
    {
      name: "Sophie Leroy",
      text: "J’ai appris la LSF avec InklusionHub. Une expérience enrichissante.",
      image: "/images/sophie.jpg",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <h2 className="text-center text-2xl font-bold text-black">Témoignages</h2>
      <p className="text-center text-gray-600 mt-2 text-base">
        Découvrez les expériences de notre communauté
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12 px-6">
        {people.map((person, i) => (
          <div
            key={i}
            className="bg-white px-6 py-6 rounded-xl shadow-sm  flex flex-col"
          >
            {/* Ligne photo + nom */}
            <div className="flex items-center gap-4 mb-4">
              {/* Photo */}
              <div className="w-20 h-20 relative">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              {/* Nom + étoiles */}
              <div className="flex flex-col">
                <p className="font-semibold text-black">{person.name}</p>
                <p className="text-yellow-500 text-sm">★★★★★</p>
              </div>
            </div>

            {/* Texte */}
            <p className="text-gray-700">{person.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
