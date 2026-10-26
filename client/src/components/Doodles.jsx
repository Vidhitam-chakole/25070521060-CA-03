// src/components/Doodles.jsx - Pixel Art Edition
import React from 'react';

/** Orange pixel stepped wave between title words */
export function WavySquiggle({ width = 160, height = 18, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', shapeRendering: 'crispEdges' }}
    >
      {/* 8-bit Stepped Pixel Wave */}
      <rect x="0" y="8" width="10" height="4" fill={color} />
      <rect x="10" y="4" width="10" height="4" fill={color} />
      <rect x="20" y="0" width="12" height="4" fill={color} />
      <rect x="32" y="4" width="10" height="4" fill={color} />
      <rect x="42" y="8" width="10" height="4" fill={color} />
      <rect x="52" y="12" width="12" height="4" fill={color} />
      <rect x="64" y="8" width="10" height="4" fill={color} />
      <rect x="74" y="4" width="10" height="4" fill={color} />
      <rect x="84" y="0" width="12" height="4" fill={color} />
      <rect x="96" y="4" width="10" height="4" fill={color} />
      <rect x="106" y="8" width="10" height="4" fill={color} />
      <rect x="116" y="12" width="12" height="4" fill={color} />
      <rect x="128" y="8" width="10" height="4" fill={color} />
      <rect x="138" y="4" width="10" height="4" fill={color} />
      <rect x="148" y="0" width="12" height="4" fill={color} />
    </svg>
  );
}

/** 8-bit pixel sparkles around titles */
export function SparkleArcs({ color = '#E8A857', size = 26, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Pixel Sparkle 1 */}
      <rect x="6" y="2" width="2" height="6" fill={color} />
      <rect x="4" y="4" width="6" height="2" fill={color} />

      {/* Pixel Sparkle 2 */}
      <rect x="16" y="10" width="3" height="9" fill={color} />
      <rect x="13" y="13" width="9" height="3" fill={color} />
      <rect x="15" y="12" width="5" height="5" fill={color} />

      {/* Pixel Sparkle 3 */}
      <rect x="4" y="16" width="2" height="5" fill={color} />
      <rect x="2" y="18" width="6" height="2" fill={color} />
    </svg>
  );
}

/** 8-bit pixel star doodle */
export function StarDoodle({ size = 22, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <rect x="7" y="0" width="2" height="16" fill={color} />
      <rect x="0" y="7" width="16" height="2" fill={color} />
      <rect x="5" y="2" width="6" height="12" fill={color} />
      <rect x="2" y="5" width="12" height="6" fill={color} />
      <rect x="4" y="4" width="8" height="8" fill={color} />
      <rect x="6" y="6" width="4" height="4" fill={color} />
    </svg>
  );
}

/** 8-bit pixel flower */
export function FlowerDoodle({ size = 24, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Center pixel box */}
      <rect x="6" y="6" width="4" height="4" fill={color} />
      {/* Top petal */}
      <rect x="5" y="1" width="6" height="4" fill={color} opacity="0.9" />
      {/* Bottom petal */}
      <rect x="5" y="11" width="6" height="4" fill={color} opacity="0.9" />
      {/* Left petal */}
      <rect x="1" y="5" width="4" height="6" fill={color} opacity="0.9" />
      {/* Right petal */}
      <rect x="11" y="5" width="4" height="6" fill={color} opacity="0.9" />
    </svg>
  );
}

/** 8-bit stepped pixel underline */
export function HandUnderline({ width = 100, height = 12, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      style={{ display: 'block', shapeRendering: 'crispEdges' }}
    >
      <rect x="0" y="4" width="25" height="3" fill={color} />
      <rect x="25" y="2" width="25" height="3" fill={color} />
      <rect x="50" y="4" width="25" height="3" fill={color} />
      <rect x="75" y="2" width="25" height="3" fill={color} />
    </svg>
  );
}

/** Square pixel dotted underline */
export function DottedUnderline({ width = 110, height = 10, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      style={{ shapeRendering: 'crispEdges' }}
    >
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((x) => (
        <rect key={x} x={x} y="1" width="4" height="4" fill={color} />
      ))}
    </svg>
  );
}

/** 8-bit pixel diagonal ticks */
export function TickMarks({ count = 3, color = '#E8A857', size = 18, className = '' }) {
  return (
    <svg
      width={size * count * 0.7}
      height={size * 0.6}
      viewBox="0 0 36 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Tick 1 */}
      <rect x="4" y="8" width="3" height="3" fill={color} />
      <rect x="6" y="5" width="3" height="3" fill={color} />
      <rect x="8" y="2" width="3" height="3" fill={color} />

      {/* Tick 2 */}
      <rect x="15" y="8" width="3" height="3" fill={color} />
      <rect x="17" y="5" width="3" height="3" fill={color} />
      <rect x="19" y="2" width="3" height="3" fill={color} />

      {/* Tick 3 */}
      <rect x="26" y="8" width="3" height="3" fill={color} />
      <rect x="28" y="5" width="3" height="3" fill={color} />
      <rect x="30" y="2" width="3" height="3" fill={color} />
    </svg>
  );
}

/** 8-bit retro pixel smiley face */
export function SmileyFace({ size = 20, color = '#E8A857', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', shapeRendering: 'crispEdges' }}
    >
      {/* Border circle in pixels */}
      <rect x="4" y="1" width="8" height="2" fill={color} />
      <rect x="4" y="13" width="8" height="2" fill={color} />
      <rect x="1" y="4" width="2" height="8" fill={color} />
      <rect x="13" y="4" width="2" height="8" fill={color} />
      <rect x="2" y="2" width="3" height="3" fill={color} />
      <rect x="11" y="2" width="3" height="3" fill={color} />
      <rect x="2" y="11" width="3" height="3" fill={color} />
      <rect x="11" y="11" width="3" height="3" fill={color} />

      {/* Pixel eyes */}
      <rect x="4" y="5" width="2" height="3" fill={color} />
      <rect x="10" y="5" width="2" height="3" fill={color} />

      {/* Pixel smile */}
      <rect x="4" y="9" width="2" height="2" fill={color} />
      <rect x="10" y="9" width="2" height="2" fill={color} />
      <rect x="6" y="10" width="4" height="2" fill={color} />
    </svg>
  );
}

/** Pixel arrow with retro font "pull lever ↓" */
export function PullLeverAnnotation({ className = '' }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Press Start 2P', monospace",
        color: '#4C7362',
        fontSize: '9px',
        lineHeight: '1.2',
        pointerEvents: 'none',
        userSelect: 'none',
        letterSpacing: '0.04em',
      }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>PULL LEVER</span>
      <svg
        width="16"
        height="18"
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginTop: '4px', shapeRendering: 'crispEdges' }}
      >
        {/* Pixel down arrow */}
        <rect x="7" y="0" width="2" height="10" fill="#4C7362" />
        <rect x="5" y="8" width="6" height="2" fill="#4C7362" />
        <rect x="4" y="10" width="8" height="2" fill="#4C7362" />
        <rect x="3" y="12" width="10" height="2" fill="#4C7362" />
        <rect x="5" y="14" width="6" height="2" fill="#4C7362" />
        <rect x="7" y="16" width="2" height="2" fill="#4C7362" />
      </svg>
    </div>
  );
}

