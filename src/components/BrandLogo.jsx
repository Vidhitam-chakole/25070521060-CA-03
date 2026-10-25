// src/components/BrandLogo.jsx
import React from 'react';

export function BrandLogo({ onClick, size = 'default' }) {
  const isSmall = size === 'small';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '6px' : '10px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: '0.88',
        }}
      >
        <span
          style={{
            fontFamily: "'Knewave', 'Shrikhand', 'Gochi Hand', cursive",
            fontSize: isSmall ? '18px' : '24px',
            color: '#2A6B52',
            letterSpacing: '0.02em',
            textShadow: '1.5px 1.5px 0px #A9C4B8',
          }}
        >
          Speech
        </span>
        <span
          style={{
            fontFamily: "'Knewave', 'Shrikhand', 'Gochi Hand', cursive",
            fontSize: isSmall ? '18px' : '24px',
            color: '#2A6B52',
            letterSpacing: '0.04em',
            textShadow: '1.5px 1.5px 0px #A9C4B8',
          }}
        >
          Pact
        </span>
      </div>
    </div>
  );
}
