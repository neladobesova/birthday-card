import { useState, useEffect } from 'react';
import { getErrorMessages, ERROR_PAGE_MESSAGE, ERROR_RETRY_BUTTON } from '../utils/env';

export default function FuckYouPage({ onRetry }) {
  const [message, setMessage] = useState(0);
  const messages = getErrorMessages();

  useEffect(() => {
    setMessage(Math.floor(Math.random() * messages.length));
  }, [messages.length]);

  const current = messages[message];

  return (
    <div className="fuck-you-container">
      <div className="fuck-you-emoji mb-8">
        {current.emoji}
      </div>
      <h1 className="text-5xl font-bold text-white mb-6 text-center animate-shake">
        {current.text}
      </h1>
      <p className="text-2xl text-white mb-8 text-center">
        {ERROR_PAGE_MESSAGE}
      </p>
      <button
        className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-red-500"
        onClick={onRetry}
      >
        {ERROR_RETRY_BUTTON}
      </button>
    </div>
  );
}
