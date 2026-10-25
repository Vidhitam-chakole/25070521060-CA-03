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
          lineHeight: '1.2',
        }}
      >
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: isSmall ? '13px' : '17px',
            color: '#2A6B52',
            letterSpacing: '0.04em',
            textShadow: '2px 2px 0px #A9C4B8',
          }}
        >
          SPEECH
        </span>
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: isSmall ? '13px' : '17px',
            color: '#2A6B52',
            letterSpacing: '0.04em',
            textShadow: '2px 2px 0px #A9C4B8',
          }}
        >
          PACT
        </span>
      </div>
    </div>
  );
}
