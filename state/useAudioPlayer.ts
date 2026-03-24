import { useState, useRef, useEffect, useCallback } from "react";

interface AudioPlayerState {
  currentUrl: string | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
}

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioPlayerState>({
    currentUrl: null,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Jouer un audio
  const play = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.play();
    setState((prev) => ({
      ...prev,
      currentUrl: url,
      isPlaying: true,
      duration: audio.duration || 0,
      currentTime: 0,
    }));

    // Mettre à jour le temps courant toutes les 200ms
    intervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        setState((prev) => ({
          ...prev,
          currentTime: audioRef.current!.currentTime,
          duration: audioRef.current!.duration || prev.duration,
        }));
      }
    }, 200);

    audio.addEventListener("ended", () => {
      stop();
    });

    audio.addEventListener("loadedmetadata", () => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration,
      }));
    });
  }, []);

  // Pause
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Stop
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState({
      currentUrl: null,
      isPlaying: false,
      duration: 0,
      currentTime: 0,
    });
  }, []);

  // Toggle
  const toggle = useCallback((url: string) => {
    if (state.currentUrl === url && state.isPlaying) {
      pause();
    } else {
      play(url);
    }
  }, [state.currentUrl, state.isPlaying, pause, play]);

  // Cleanup si component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    toggle,
  };
};