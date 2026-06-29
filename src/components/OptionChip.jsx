import React from 'react';

export default function OptionChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={`chip${active ? ' active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
