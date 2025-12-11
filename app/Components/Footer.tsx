// export default function Footer() {
//   return (
//     <footer className="py-6 bg-[#1f1f1f] text-center text-gray-300 text-sm">
//       © 2025 InklusionHub. Tous droits réservés.
//     </footer>
//   );
// }

import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const socialLinks = [
    { icon: <Facebook size={20} />, href: "https://facebook.com/inklusionhub", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "https://twitter.com/inklusionhub", label: "Twitter (X)" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com/company/inklusionhub", label: "LinkedIn" },
    { icon: <Instagram size={20} />, href: "https://instagram.com/inklusionhub", label: "Instagram" },
  ];

  return (
    <footer className="bg-[#1f1f1f] text-gray-300">
      <div className="container mx-auto px-6 py-8">
        {/* Section principale */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright à gauche */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">IH</span>
              </div>
              <span className="text-white font-semibold">InklusionHub</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 InklusionHub. Tous droits réservés.
            </p>
          </div>

          {/* Liens utiles au centre */}
          <div className="flex gap-6 text-sm">
            <Link href="/#" className="text-gray-400 hover:text-white transition-colors">
              Conditions
            </Link>
            <Link href="/#" className="text-gray-400 hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Réseaux sociaux à droite */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}