"use client";
import { toast } from 'sonner';

/**
 * 🔊 Hook React personnalisé : useTextToSpeech
 * Permet de transformer un texte en parole (Text-to-Speech)
 * en utilisant l'API Web Speech du navigateur.
 *
 * @param lang (optionnel) — code de langue du texte à lire (par défaut "fr-FR").
 * @returns { speak } — une fonction qui prend un texte et le fait prononcer.
 */

export function useTextToSpeech(lang = "fr-FR") {

     /**
   * 📢 Fonction principale : speak(text)
   * - Prend une chaîne `text` en entrée
   * - Configure la synthèse vocale
   * - Lance la lecture via l’API SpeechSynthesis
   */

  const speak = (text: string) => {
    // ✅ Vérifie que l’environnement supporte l’API SpeechSynthesis.
    // Si ce n’est pas le cas (ancien navigateur, SSR, etc.), un toast est affiché.
    if (!window.speechSynthesis){ 
        toast.warning("La reconnaissance vocale n'est pas supportée par ce navigateur.Veuillez utiliser Chrome ou Edge.");
        return;
    } 
     
    // 🗣️ Crée un objet représentant l’énoncé à prononcer.
    // C’est une instance de SpeechSynthesisUtterance fournie par le navigateur.
    const utterance = new SpeechSynthesisUtterance(text);

    // 🌍 Définit la langue utilisée pour la prononciation.
    // Exemple : "fr-FR" → français, "en-US" → anglais américain.
    utterance.lang = lang;

    // 🎤 Sélectionne une voix correspondant à la langue (si disponible).
    const voices = speechSynthesis.getVoices();

    // Essaie de trouver une voix française, Cherche une voix dont le code de langue commence par "fr"
    const frenchVoice = voices.find(v => v.lang.startsWith("fr"));

    // 🧩 Si une voix française a été trouvée, on l’assigne à l’énoncé.
    // Sinon, la voix par défaut du navigateur sera utilisée.
    if (frenchVoice) utterance.voice = frenchVoice;

    // ▶️ Lance la synthèse vocale : le navigateur prononce le texte.
     // Cette fonction ajoute l’énoncé dans la file d’attente de synthèse vocale.
    speechSynthesis.speak(utterance);
  };

  // 🔁 Le hook retourne simplement la fonction `speak`
  return { speak };
}
