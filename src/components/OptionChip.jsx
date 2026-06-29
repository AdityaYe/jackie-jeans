import React from 'react';

export default function OptionChip({ label, active, onClick, size = 'normal' }) {
  const brandStyle = size === 'brand' ? ' brand-chip' : '';
  return (
    <button
      type="button"
      className={`chip${brandStyle}${active ? ' active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {active && (
        <span style={{ marginRight: 4, fontSize: '0.85em' }}>✓</span>
      )}
      {label}
    </button>
  );
}
