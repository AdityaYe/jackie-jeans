import React from 'react';

const LARGE_LOGO_BRANDS = new Set(['Good American', 'Reformation', 'American Eagle', 'Topshop', 'Everlane']);

function getLogoVariant(name) {
  if (LARGE_LOGO_BRANDS.has(name)) return ' large-brand-logo';
  return '';
}

export default function BrandCard({ name, logo, selected, onClick }) {
  const logoVariant = getLogoVariant(name);

  return (
    <button
      type="button"
      className={`brand-card${selected ? ' selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="brand-card-logo-wrap">
        <img
          className={`brand-card-logo${logoVariant}`}
          src={logo}
          alt=""
          aria-hidden="true"
        />
      </span>
      <span className="brand-card-name">{name}</span>
    </button>
  );
}
