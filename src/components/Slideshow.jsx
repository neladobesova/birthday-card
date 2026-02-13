import { useEffect, useRef, useState } from 'react';
import { getSlideTexts, SLIDESHOW_REVEAL_BUTTON } from '../utils/env';

export default function Slideshow({ onScroll, onRevealClick }) {
  const containerRef = useRef(null);
  const hasScrolled = useRef(false);
  const slideTexts = getSlideTexts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const autoScrollTimeoutRef = useRef(null);
  const userInteractedRef = useRef(false);

  // Get auto-scroll settings from env
  const autoScrollEnabled = import.meta.env.VITE_AUTO_SCROLL_ENABLED === 'true';
  const autoScrollInterval = parseInt(import.meta.env.VITE_AUTO_SCROLL_INTERVAL || '5000', 10);
  const scrollIndicatorText = import.meta.env.VITE_SCROLL_INDICATOR_TEXT || 'Swipe down';

  // Track manual scroll to pause auto-scroll
  useEffect(() => {
    const handleScroll = () => {
      // Detect manual user scroll
      userInteractedRef.current = true;

      // Hide scroll indicator after any scroll
      setShowScrollIndicator(false);

      // Calculate current slide based on scroll position
      const container = containerRef.current;
      if (container) {
        const slideHeight = container.clientHeight;
        const scrollPosition = container.scrollTop;
        const calculatedSlide = Math.round(scrollPosition / slideHeight);
        setCurrentSlide(calculatedSlide);

        // Only trigger scroll event when reaching the last page
        if (!hasScrolled.current && calculatedSlide >= slideTexts.length - 1) {
          hasScrolled.current = true;
          onScroll();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [onScroll]);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScrollEnabled || userInteractedRef.current) {
      return;
    }

    // Stop auto-scrolling at the last slide
    if (currentSlide >= slideTexts.length - 1) {
      return;
    }

    // Schedule next slide
    autoScrollTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (container && !userInteractedRef.current) {
        const nextSlide = currentSlide + 1;
        const slideHeight = container.clientHeight;

        container.scrollTo({
          top: nextSlide * slideHeight,
          behavior: 'smooth'
        });

        setCurrentSlide(nextSlide);
      }
    }, autoScrollInterval);

    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, [currentSlide, slideTexts.length, autoScrollEnabled, autoScrollInterval]);

  return (
    <div ref={containerRef} className="slideshow-container">
      {slideTexts.map((text, index) => (
        <div key={index} className="slide">
          <div className="slide-content animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {text}
            </h1>
            {index === slideTexts.length - 1 && (
              <button
                className="btn btn-primary btn-lg mt-8 animate-pulse-glow"
                onClick={onRevealClick}
              >
                {SLIDESHOW_REVEAL_BUTTON}
              </button>
            )}
          </div>
          {/* Show scroll indicator on first slide when auto-scroll is off */}
          {index === 0 && !autoScrollEnabled && showScrollIndicator && (
            <div className="scroll-indicator">
              <div className="scroll-indicator-text">{scrollIndicatorText}</div>
              <div className="scroll-indicator-arrow">↓</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
