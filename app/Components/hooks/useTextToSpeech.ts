"use client";

export function useTextToSpeech(lang = "fr-FR") {
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = speechSynthesis.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith("fr"));
    if (frenchVoice) utterance.voice = frenchVoice;

    speechSynthesis.speak(utterance);
  };

  return { speak };
}
