import React from 'react';

const COLORS = {
  idle: { orb: 'var(--surface)', bar: 'var(--accent)', ring: 'transparent' },
  speaking: { orb: 'var(--accent)', bar: 'var(--fg)', ring: 'var(--accent-ring)' },
  listening: { orb: 'var(--surface-2)', bar: 'var(--accent)', ring: 'var(--selection-ring)' },
  processing: { orb: 'var(--surface-2)', bar: 'var(--accent-warm)', ring: 'var(--selection-ring)' },
};

export default function VoiceOrb({ state = 'idle', size = 140 }) {
  const colors = COLORS[state] || COLORS.idle;
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isProcessing = state === 'processing';

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label={`Voice status: ${state}`}
      role="status"
    >
      {(isListening || isSpeaking) && (
        <>
          {[0, 0.7, 1.4].map(delay => (
            <div
              key={delay}
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                border: `2px solid ${colors.ring}`,
                animation: 'ripple 2s ease-out infinite',
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </>
      )}

      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: colors.orb,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.4s ease',
          animation: state === 'idle' ? 'breathe 3s ease-in-out infinite' : undefined,
          boxShadow: isSpeaking || isListening || isProcessing ? 'var(--shadow-md)' : 'none',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {isProcessing ? (
          <svg
            width={size * 0.3}
            height={size * 0.3}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.bar}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ animation: 'spin 1s linear infinite' }}
            aria-hidden="true"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        ) : isSpeaking ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 28 }} aria-hidden="true">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 6,
                  borderRadius: 2,
                  background: colors.bar,
                  animation: 'waveBar 0.8s ease-in-out infinite',
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <svg
            width={size * 0.35}
            height={size * 0.35}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isListening ? colors.bar : 'var(--accent)'}
            strokeWidth={isListening ? '2' : '1.8'}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: isListening ? 1 : 0.6 }}
            aria-hidden="true"
          >
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M19 10a7 7 0 0 1-14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        )}
      </div>
    </div>
  );
}
