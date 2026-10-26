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
            fontSize: isSmall ? '12px' : '16px',
            color: '#2A6B52',
            letterSpacing: '0.04em',
            textShadow: '2px 2px 0px #A9C4B8',
          }}
        >
          LEARN
        </span>
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: isSmall ? '10px' : '13px',
            color: '#E8A857',
            letterSpacing: '0.04em',
            textShadow: '2px 2px 0px rgba(30, 77, 59, 0.2)',
          }}
        >
          WITH FUN
        </span>
      </div>
    </div>
  );
}
