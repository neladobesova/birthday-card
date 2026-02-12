import { useState, useEffect, useMemo } from 'react';
import './App.css';
import AuthFlow from './components/AuthFlow';
import FuckYouPage from './components/FuckYouPage';
import Slideshow from './components/Slideshow';
import GiftSection from './components/GiftSection';
import ConfettiAnimation from './components/ConfettiAnimation';
import AudioPlayer from './components/AudioPlayer';
import { useDiscordWebhook } from './hooks/useDiscordWebhook';

function App() {
  const [appState, setAppState] = useState('auth'); // auth, fuck-you, slideshow, gift
  const [showConfetti, setShowConfetti] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);

  const { sendEvent } = useDiscordWebhook();

  // Available dates from environment variable
  const availableDates = useMemo(() => {
    const datesString = import.meta.env.VITE_AVAILABLE_DATES;
    if (!datesString) {
      // Fallback to default dates if not configured
      return [
        '2026-03-06',
        '2026-03-07',
        '2026-03-13',
        '2026-03-14',
        '2026-04-03',
        '2026-04-04',
        '2026-04-10',
        '2026-04-11',
      ];
    }
    return datesString.split(',').map(date => date.trim());
  }, []);

  // Track page load
  useEffect(() => {
    if (appState === 'slideshow') {
      sendEvent('page_load');
    }
  }, [appState, sendEvent]);

  const handleAuthSuccess = () => {
    setShowConfetti(true);
    setPlayAudio(true);
    setAppState('slideshow');
  };

  const handleAuthFail = () => {
    setAppState('fuck-you');
  };

  const handleRetry = () => {
    setAppState('auth');
  };

  const handleScroll = () => {
    sendEvent('scroll');
  };

  const handleRevealClick = () => {
    setAppState('gift');
    setShowConfetti(false); // Stop confetti when moving to gift section
  };

  const handleLinkClick = (destinationName, url) => {
    sendEvent('link_click', {
      destination: destinationName,
      url: url
    });
  };

  const handleDateSelect = (weekend) => {
    sendEvent('date_selected', { weekend });
  };

  return (
    <>
      {appState === 'auth' && (
        <AuthFlow onSuccess={handleAuthSuccess} onFail={handleAuthFail} />
      )}

      {appState === 'fuck-you' && <FuckYouPage onRetry={handleRetry} />}

      {appState === 'slideshow' && (
        <>
          {showConfetti && <ConfettiAnimation />}
          <Slideshow onScroll={handleScroll} onRevealClick={handleRevealClick} />
          {playAudio && <AudioPlayer autoplay />}
        </>
      )}

      {appState === 'gift' && (
        <>
          <GiftSection
            availableDates={availableDates}
            onDateSelect={handleDateSelect}
            onLinkClick={handleLinkClick}
          />
          {playAudio && <AudioPlayer autoplay />}
        </>
      )}
    </>
  );
}

export default App;
