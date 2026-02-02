"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';

// 🧠 Déclaration de type pour les différents constructeurs possibles
// Certains navigateurs exposent `SpeechRecognition`, d’autres `webkitSpeechRecognition`.
type SpeechRecognitionType =
  | typeof window.SpeechRecognition
  | typeof window.webkitSpeechRecognition
  | null;

/**
 * 🎤 Hook React personnalisé : useSpeechRecognition
 * 
 * Ce hook gère toute la logique de reconnaissance vocale dans le navigateur :
 * - Initialise `SpeechRecognition` (Web Speech API)
 * - Écoute et transcrit la voix en texte (final et intermédiaire)
 * - Fournit des fonctions `start` / `stop` pour le contrôle
 *
 * @param lang (optionnel) - code de langue, par défaut "fr-FR"
 * @returns { isListening, transcript, start, stop }
 */

export function useSpeechRecognition(lang = "fr-FR") {
  // 🔄 Référence mutable vers l’instance de SpeechRecognition
  // (permet de la garder entre les rendus sans la réinitialiser)
  const recognitionRef = useRef<any>(null);

  // ⚙️ États réactifs pour piloter le hook :
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

 // 🧩 Effet d’initialisation — exécuté une fois au montage du composant
  useEffect(() => {
    // 🧱 Vérifie que le code s’exécute bien côté navigateur
    if (typeof window === "undefined") return;
    
    // 🗣️ Récupère la classe du constructeur `SpeechRecognition`
    // Compatible Chrome et Edge (`webkitSpeechRecognition`)
    const SpeechRecognition: SpeechRecognitionType =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;

     // ⚠️ Si non supporté, affiche un message visuel et console.warn.
    if (!SpeechRecognition) {
      toast.warning("La reconnaissance vocale n'est pas supportée par ce navigateur.Veuillez utiliser Chrome ou Edge.");
      console.warn("SpeechRecognition non supporté");
      return;
    }
    
    // 🎤 Crée une instance de reconnaissance vocale
    const recognition = new SpeechRecognition();

    // 🌍 Configure la langue de reconnaissance
    recognition.lang = lang;

    // 🔁 continuous = true → la reconnaissance reste ouverte (écoute longue)
    // interimResults = true → renvoie les mots même avant validation finale
    recognition.continuous = true; 
    recognition.interimResults = true;
  
    // 📡 Callback exécuté à chaque nouveau résultat de reconnaissance
    recognition.onresult = (event: any) => {
      let interim = "";// texte temporaire de cette itération

      // 🔍 Parcourt tous les résultats reçus lors de cet événement
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        // 🏁 Si le segment est finalisé, on l’ajoute au texte final
        if (event.results[i].isFinal) {
          setFinalTranscript(prev => prev + " " + transcript);
        } else {
          // ✍️ Sinon, on l’accumule dans le texte temporaire
          interim += transcript;
        }
      }
      // 📥 Met à jour le texte provisoire affiché en temps réel
      setInterimTranscript(interim);
    };
   
    // 🎬 Lorsque la reconnaissance démarre
    recognition.onstart = () => setIsListening(true);

    // 🛑 Lorsqu’elle s’arrête
    recognition.onend = () => setIsListening(false);

   // 💾 Stocke l’instance dans la ref (utilisé par start() et stop())
    recognitionRef.current = recognition;

    // 🧹 Nettoyage à la fin du cycle de vie du composant (componentWillUnmount)
    // Stoppe la reconnaissance si le composant est démonté
    return () => recognition.stop();
  }, [lang]);// 🔁 L'effet se relance uniquement si la langue change


  // ▶️ Fonction publique pour démarrer la reconnaissance vocale
  const start = () => recognitionRef.current?.start();

  // ⏹️ Fonction publique pour arrêter la reconnaissance vocale
  const stop = () => recognitionRef.current?.stop();
  
  return {
    
    isListening,// booléen : indique si le micro écoute actuellement
    transcript: finalTranscript + " " + interimTranscript,// texte combiné : final + en cours
    start,// fonction pour démarrer l’écoute
    stop,// fonction pour arrêter l’écoute
  };
}
