import { useState, useRef, useEffect } from 'react';
import { BIRTHDAY_SONG_URL } from '../utils/env';

export default function AudioPlayer({ autoplay = false }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (autoplay && audioRef.current) {
      // Try to autoplay, but handle browsers that block it
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Autoplay prevented:', error);
            // Autoplay was prevented, user needs to interact
            setIsPlaying(false);
          });
      }
    }
  }, [autoplay]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="audio-controls">
      <audio
        ref={audioRef}
        src={BIRTHDAY_SONG_URL}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
