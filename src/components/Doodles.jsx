// src/components/Doodles.jsx
import React from 'react';

/** Orange wavy squiggle between title words */
export function WavySquiggle({ width = 160, height = 18, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block' }}
    >
      <path
        d="M3 10 C 15 2, 25 16, 38 9 C 50 2, 62 16, 75 9 C 88 2, 100 16, 112 9 C 125 2, 137 16, 157 9"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small orange arc strokes (sparkles around titles) */
export function SparkleArcs({ color = '#E8A857', size = 26, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5 8 C 8 5, 12 5, 15 7"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M3 15 C 6 12, 10 12, 13 14"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M7 21 C 10 19, 14 19, 17 21"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 4-point star doodle */
export function StarDoodle({ size = 22, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 2 C12 7, 7 12, 2 12 C7 12, 12 17, 12 22 C12 17, 17 12, 22 12 C17 12, 12 7, 12 2 Z" />
    </svg>
  );
}

/** Flower doodle for Interview Prep */
export function FlowerDoodle({ size = 24, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="3" fill={color} />
      <circle cx="12" cy="6" r="2.5" fill={color} opacity="0.9" />
      <circle cx="18" cy="12" r="2.5" fill={color} opacity="0.9" />
      <circle cx="12" cy="18" r="2.5" fill={color} opacity="0.9" />
      <circle cx="6" cy="12" r="2.5" fill={color} opacity="0.9" />
    </svg>
  );
}

/** Hand-drawn underline (smooth wobble) */
export function HandUnderline({ width = 100, height = 12, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <path
        d="M2 7 C 25 3, 55 10, 98 4"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Dotted hand-drawn underline */
export function DottedUnderline({ width = 110, height = 10, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <line
        x1="2"
        y1="5"
        x2="108"
        y2="5"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 7"
      />
    </svg>
  );
}

/** Tiny orange tick marks above words */
export function TickMarks({ count = 3, color = '#E8A857', size = 18, className = '' }) {
  return (
    <svg
      width={size * count * 0.7}
      height={size * 0.6}
      viewBox="0 0 40 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="8" y1="12" x2="14" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="19" y1="14" x2="23" y2="3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="13" x2="33" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Hand-drawn Smiley Face */
export function SmileyFace({ size = 20, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.2" />
      <circle cx="9" cy="10" r="1.3" fill={color} />
      <circle cx="15" cy="10" r="1.3" fill={color} />
      <path
        d="M8.5 14.5 C 10 17, 14 17, 15.5 14.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Curved arrow with "pull lever ↓" annotation */
export function PullLeverAnnotation({ className = '' }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Caveat Brush', 'Patrick Hand', cursive",
        color: '#4C7362',
        fontSize: '17px',
        lineHeight: '1.1',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <span style={{ whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>pull lever</span>
      <svg
        width="26"
        height="26"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginTop: '2px' }}
      >
        <path
          d="M8 4 C 18 8, 16 16, 14 22"
          stroke="#4C7362"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M10 18 L14 23 L18 17"
          stroke="#4C7362"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
