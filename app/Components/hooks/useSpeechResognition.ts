"use client";

import { useEffect, useRef, useState } from "react";

type SpeechRecognitionType =
  | typeof window.SpeechRecognition
  | typeof window.webkitSpeechRecognition
  | null;

export function useSpeechRecognition(lang = "fr-FR") {
  const recognitionRef = useRef<any>(null);

  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition: SpeechRecognitionType =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition non supporté");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          setFinalTranscript(prev => prev + " " + transcript);
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [lang]);

  const start = () => recognitionRef.current?.start();
  const stop = () => recognitionRef.current?.stop();

  return {
    isListening,
    transcript: finalTranscript + " " + interimTranscript,
    start,
    stop,
  };
}
