import React, { useCallback, useEffect, useState } from 'react';

const REDIRECT_URL = 'https://jackie-jeans.vercel.app/';

export default function CompletionScreen({ answers }) {
  const [countdown, setCountdown] = useState(5);

  const handleRedirect = useCallback(() => {
    // Build a query string from answers to carry the fit profile
    const params = new URLSearchParams();
    if (answers.height)    params.set('height', answers.height);
    if (answers.weight)    params.set('weight', answers.weight);
    if (answers.weightUnit) params.set('weight_unit', answers.weightUnit);
    if (answers.waist)     params.set('waist', answers.waist);
    if (answers.hip)       params.set('hip', answers.hip);
    if (answers.waistFit)  params.set('waist_fit', answers.waistFit);
    if (answers.rise)      params.set('rise', answers.rise);
    if (answers.thighFit)  params.set('thigh_fit', answers.thighFit);
    if (answers.frustration) params.set('frustration', answers.frustration);
    if (answers.brands?.length) params.set('brands', answers.brands.join(','));

    const url = `${REDIRECT_URL}?${params.toString()}`;
    window.location.href = url;
  }, [answers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleRedirect]);

  // Build a simple summary sentence
  const summaryParts = [];
  if (answers.height) summaryParts.push(answers.height);
  if (answers.waist) summaryParts.push(`${answers.waist} waist`);
  if (answers.hip) summaryParts.push(`${answers.hip} hip`);
  if (answers.rise) summaryParts.push(answers.rise.toLowerCase());
  if (answers.thighFit) summaryParts.push(`${answers.thighFit.toLowerCase()} through the thigh`);

  return (
    <div
      className="page"
      style={{
        background: 'var(--bg)',
        color: 'var(--fg)',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
      }}
    >
      <div className="animate-fade-in-up" style={{ maxWidth: 380 }}>
        {/* Check mark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--accent-light)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="label-sm" style={{ color: 'var(--fg-muted)', marginBottom: 12 }}>
          Your fit profile is ready
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.8rem, 7vw, 2.8rem)',
            fontWeight: 600,
            lineHeight: 1.15,
            marginBottom: 20,
            letterSpacing: 0,
          }}
        >
          You're all set.
        </h1>

        {summaryParts.length > 0 && (
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--fg-muted)',
              lineHeight: 1.6,
              marginBottom: 36,
              fontStyle: 'italic',
            }}
          >
            {summaryParts.join(' · ')}
          </p>
        )}

        <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', marginBottom: 28 }}>
          Taking you to Jackie Jeans in {countdown}s
        </p>

        <button
          className="btn btn-primary"
          onClick={handleRedirect}
          style={{
            width: '100%',
            justifyContent: 'center',
            fontSize: '1rem',
            padding: '16px 28px',
          }}
        >
          Explore Jackie Jeans
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Divider */}
        <div style={{ margin: '32px 0', borderTop: '1px solid var(--border)' }} />

        {/* Fit summary cards */}
        {Object.keys(answers).length > 0 && (
          <div style={{ textAlign: 'left' }}>
            <p className="label-sm" style={{ color: 'var(--fg-muted)', marginBottom: 16 }}>
              What we learned about you
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {answers.height && <SummaryCard label="Height" value={answers.height} />}
              {answers.weight && <SummaryCard label="Weight" value={`${answers.weight} ${answers.weightUnit || 'lb'}`} />}
              {answers.waist && <SummaryCard label="Waist" value={answers.waist} />}
              {answers.hip && <SummaryCard label="Hip" value={answers.hip} />}
              {answers.waistFit && <SummaryCard label="Waist fit" value={answers.waistFit} />}
              {answers.rise && <SummaryCard label="Rise" value={answers.rise} />}
              {answers.thighFit && <SummaryCard label="Thigh" value={answers.thighFit} />}
              {answers.frustration && <SummaryCard label="Focus area" value={answers.frustration} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 12,
        padding: '12px 14px',
        border: '1px solid var(--border)',
      }}
    >
      <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: '0.9rem', color: 'var(--fg)', fontWeight: 500 }}>
        {value}
      </p>
    </div>
  );
}
