import { useState, useEffect, useMemo } from "react";
import "./App.css";
import AuthFlow from "./components/AuthFlow";
import FuckYouPage from "./components/FuckYouPage";
import Slideshow from "./components/Slideshow";
import GiftSection from "./components/GiftSection";
import ConfettiAnimation from "./components/ConfettiAnimation";
import AudioPlayer from "./components/AudioPlayer";
import { useDiscordWebhook } from "./hooks/useDiscordWebhook";

// npm run deploy

function App() {
  const [appState, setAppState] = useState("auth"); // auth, fuck-you, slideshow, gift
  const [showConfetti, setShowConfetti] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);

  const { sendEvent } = useDiscordWebhook();

  // Available and unavailable dates from environment variables
  const { availableDates, unavailableDates } = useMemo(() => {
    const datesString = import.meta.env.VITE_AVAILABLE_DATES;
    const unavailableString = import.meta.env.VITE_UNAVAILABLE_DATES;

    const parseList = s =>
      (s || "")
        .split(",")
        .map(d => d.trim())
        .filter(Boolean);

    const baseDates = parseList(datesString);
    const unavailable = unavailableString ? parseList(unavailableString) : [];

    const available = baseDates.filter(d => !unavailable.includes(d));
    return { availableDates: available, unavailableDates: unavailable };
  }, []);

  // Track page load
  useEffect(() => {
    if (appState === "slideshow") {
      sendEvent("page_load");
    }
  }, [appState, sendEvent]);

  const handleAuthSuccess = () => {
    setShowConfetti(true);
    setPlayAudio(true);
    setAppState("slideshow");
  };

  const handleIncorrectAnswer = (questionId, details) => {
    sendEvent("incorrect_answer", {
      question: questionId,
      ...details,
    });
  };

  const handleAuthFail = () => {
    setAppState("fuck-you");
  };

  const handleRetry = () => {
    setAppState("auth");
  };

  const handleScroll = () => {
    sendEvent("scroll");
  };

  const handleRevealClick = () => {
    sendEvent("gift_reveal_click");
    setAppState("gift");
    setShowConfetti(false); // Stop confetti when moving to gift section
  };

  const handleLinkClick = (destinationName, url) => {
    sendEvent("link_click", {
      destination: destinationName,
      url: url,
    });
  };

  const handleCalendarOpen = () => {
    sendEvent("calendar_opened");
  };

  const handleDateSelect = weekend => {
    sendEvent("date_selected", { weekend });
  };

  return (
    <>
      {appState === "auth" && (
        <AuthFlow
          onSuccess={handleAuthSuccess}
          onFail={handleAuthFail}
          onIncorrectAnswer={handleIncorrectAnswer}
        />
      )}

      {appState === "fuck-you" && <FuckYouPage onRetry={handleRetry} />}

      {appState === "slideshow" && (
        <>
          {showConfetti && <ConfettiAnimation />}
          <Slideshow
            onScroll={handleScroll}
            onRevealClick={handleRevealClick}
          />
        </>
      )}

      {appState === "gift" && (
        <GiftSection
          availableDates={availableDates}
          unavailableDates={unavailableDates}
          onDateSelect={handleDateSelect}
          onLinkClick={handleLinkClick}
          onCalendarOpen={handleCalendarOpen}
        />
      )}

      {playAudio && <AudioPlayer autoplay />}
    </>
  );
}

export default App;
