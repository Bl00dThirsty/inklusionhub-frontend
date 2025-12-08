"use client";

import Image from "next/image";

export default function Services() {
  const data = [
    { title: "Communication", img: "/images/com.jpg" },
    { title: "Formations", img: "/images/form.jpg" },
    { title: "Vie Professionnelle", img: "/images/viep.jpg" },
    { title: "Communauté", img: "/images/cmu.jpg" },
  ];

  return (
    <section className="text-center py-16 bg-white">
      <h2 className="text-2xl font-bold text-black">Nos Services</h2>
      <p className="mt-2 text-gray-600 text-base">Decouvrez nos outils pour une communication inclusive.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-10">
        {data.map((item, key) => (
          <div key={key} className="bg-white p-6 rounded-xl shadow-sm border-white">
            <Image
              src={item.img}
              alt={item.title}
              width={600}
              height={120}
              className="mx-auto"
            />
            <p className="mt-4 font-medium text-black">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
