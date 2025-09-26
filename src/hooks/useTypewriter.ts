import { useState, useEffect } from 'react';

export function useTypewriter(text: string, delay: number = 50, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText(text);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay, enabled]);

  return { displayedText, isTyping };
}


export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const playAudio = (audioUrl: string, entryId?: string) => {
    
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (audioUrl === 'data:audio/mpeg;base64,mock-audio-data') {
    
      setIsPlaying(true);
      setPlayingId(entryId || null);
      setTimeout(() => {
        setIsPlaying(false);
        setPlayingId(null);
      }, 3000);
      return;
    }

    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    setIsPlaying(true);
    setPlayingId(entryId || null);
    
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
      setPlayingId(null);
    };
    
    audio.onerror = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
      setPlayingId(null);
    };
    
    audio.play().catch(() => {
      setIsPlaying(false);
      setCurrentAudio(null);
      setPlayingId(null);
    });
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    setPlayingId(null);
  };

  return { isPlaying, playAudio, stopAudio, playingId };
}