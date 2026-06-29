import React from 'react';

export default function Landing({ onManual, onVoice }) {
  return (
    <div className="page landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <img
            src="/jj-logo.svg"
            alt=""
            aria-hidden="true"
            className="landing-logo"
          />
          <img
            src="/jj-title.svg"
            alt="Jackie Jeans"
            className="landing-title"
          />
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-content animate-fade-in-up">
          <h1 className="landing-heading">
            Find your fit,<br />
            <span>minus the <span className="landing-heading-accent">Guesswork.</span></span>
          </h1>

          <p className="landing-copy">
            Let's talk fit. What you like, what you don't, and the details that make denim feel like yours.
          </p>

          <div className="landing-actions">
            <button
              id="start-manual"
              onClick={onManual}
              className="landing-cta landing-cta-primary"
            >
              <div className="landing-cta-icon landing-cta-icon-primary">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M9 9h6M9 12h6M9 15h4" />
                </svg>
              </div>
              <div className="landing-cta-copy">
                <p className="landing-cta-title">
                  Take the quiz yourself
                </p>
                <p className="landing-cta-subtitle landing-cta-subtitle-primary">
                  10 quick questions - ~60 seconds
                </p>
              </div>
              <svg className="landing-cta-arrow" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <button
              id="start-voice"
              onClick={onVoice}
              className="landing-cta landing-cta-secondary"
            >
              <div className="landing-cta-icon landing-cta-icon-secondary">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M19 10a7 7 0 0 1-14 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              </div>
              <div className="landing-cta-copy">
                <p className="landing-cta-title">Talk to a fit stylist</p>
                <p className="landing-cta-subtitle">
                  Speak naturally - hands-free
                </p>
              </div>
              <svg className="landing-cta-arrow" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <p className="landing-privacy">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Your answers are private and not stored
          </p>
        </div>
      </main>

      <footer className="landing-footer">
        <p>
          © 2026 Jackie Jeans. Made in India. Worn everywhere.
        </p>
      </footer>
    </div>
  );
}
