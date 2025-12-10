"use client";

import FileItem from "./FileItem";

interface File {
  id: number;
  name: string;
  size: string;
  senderName: string; // nom de l'utilisateur qui a envoyé le fichier
}

export default function FileHistory() {
  // Fichiers partagés par Alice Dupont
  const aliceFiles: File[] = [
    { id: 1, name: "Rapport_final.pdf", size: "1.2 Mo", senderName: "Alice Dupont" },
    { id: 2, name: "Maquette_UI.png", size: "875 Ko", senderName: "Alice Dupont" },
    { id: 3, name: "Notes_réunion.docx", size: "95 Ko", senderName: "Alice Dupont" },
  ];

  return (
    <div className="col-span-3 px-3">
      <h2 className="font-semibold mb-3 text-black">Historique et fichiers partagés</h2>

      <h3 className="text-sm font-semibold text-gray-500 mb-2">Fichiers partagés</h3>

      <div className="space-y-3 mb-6 text-black">
        {aliceFiles.map((file) => (
          <div key={file.id}>
            {/* Nom de l'expéditeur */}
            <p className="text-xs text-gray-500 mb-1">{file.senderName}</p>
            <FileItem name={file.name} size={file.size} />
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-gray-500 mb-2 text-black">Historique</h3>

      <ul className="text-sm space-y-2 text-black">
        <li>🔗 Lien partagé : inklusionhub.com/docs</li>
        <li>📞 Appel vidéo terminé — 11h25</li>
        <li>⭐ Discussion marquée prioritaire — Mardi, 09:12</li>
      </ul>
    </div>
  );
}
