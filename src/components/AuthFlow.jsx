import { useState } from 'react';
import {
  AUTH_ANSWERS,
  AUTH_INITIAL_EMOJI,
  AUTH_INITIAL_QUESTION,
  AUTH_BUTTON_NO,
  AUTH_BUTTON_YES,
  AUTH_QUESTION_LABEL,
  AUTH_HACKER_LINES,
  getAuthQuestions,
} from '../utils/env';

export default function AuthFlow({ onSuccess, onFail }) {
  const [step, setStep] = useState('initial'); // initial, questions, hacker
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const QUESTIONS = getAuthQuestions();

  const handleInitialAnswer = (isAnnicka) => {
    if (isAnnicka) {
      setStep('questions');
    } else {
      onFail();
    }
  };

  const handleQuestionAnswer = (answer) => {
    const correctAnswer = AUTH_ANSWERS[currentQuestion + 1];

    if (answer !== correctAnswer) {
      onFail();
      return;
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered correctly
      setStep('hacker');
      setTimeout(() => {
        onSuccess();
      }, 3000); // Show hacker animation for 3 seconds
    }
  };

  if (step === 'initial') {
    return (
      <div className="auth-container">
        <div className="auth-card animate-bounce-in">
          <h1 className="text-4xl font-bold text-center mb-8">
            {AUTH_INITIAL_EMOJI}
          </h1>
          <h2 className="text-2xl font-bold text-center mb-6">
            {AUTH_INITIAL_QUESTION}
          </h2>
          <div className="flex gap-4 justify-center">
            <button
              className="btn btn-lg btn-outline btn-error"
              onClick={() => handleInitialAnswer(false)}
            >
              {AUTH_BUTTON_NO}
            </button>
            <button
              className="btn btn-lg btn-primary"
              onClick={() => handleInitialAnswer(true)}
            >
              {AUTH_BUTTON_YES}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'questions') {
    const question = QUESTIONS[currentQuestion];
    return (
      <div className="auth-container">
        <div className="auth-card animate-slide-up">
          <div className="mb-4">
            <span className="badge badge-primary">
              {AUTH_QUESTION_LABEL} {currentQuestion + 1} / {QUESTIONS.length}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-6">
            {question.question}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                className="btn btn-lg btn-outline justify-start"
                onClick={() => handleQuestionAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'hacker') {
    return <HackerAnimation />;
  }

  return null;
}

function HackerAnimation() {
  return (
    <div className="hacker-container">
      <MatrixBackground />
      <div className="hacker-text animate-fade-in">
        <div className="mb-4">{AUTH_HACKER_LINES[0]}</div>
        <div className="mb-4">{AUTH_HACKER_LINES[1]}</div>
        <div className="mb-4">{AUTH_HACKER_LINES[2]}</div>
        <div className="text-green-400 text-2xl">{AUTH_HACKER_LINES[3]}</div>
      </div>
    </div>
  );
}

function MatrixBackground() {
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
  const columns = 20;

  return (
    <div className="matrix-bg">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="matrix-char"
          style={{
            left: `${(i / columns) * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          {chars[Math.floor(Math.random() * chars.length)]}
        </div>
      ))}
    </div>
  );
}
