// src/components/StepsList.jsx
import React from 'react';
import {
  HandUnderline,
  DottedUnderline,
  TickMarks,
  SmileyFace,
} from './Doodles';

export function StepsList({ mode }) {
  if (mode === 'interview-prep') {
    return null; // Interview Prep has FrameworkAccordion instead of steps
  }

  if (mode === 'learn-vocab') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          fontFamily: "'Pixelify Sans', monospace",
          fontSize: '20px',
          fontWeight: 600,
          color: '#1E4D3B',
          marginTop: '22px',
          marginBottom: '26px',
          lineHeight: '1.3',
        }}
      >
        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', color: '#1E4D3B' }}>1)</span>
          <span>Get random vocab</span>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', color: '#1E4D3B' }}>2)</span>
          <span>Set</span>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span>30 sec</span>
            <div style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%' }}>
              <HandUnderline width={60} height={8} color="#E8A857" />
            </div>
          </div>
          <span>timer</span>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', color: '#1E4D3B' }}>3)</span>
          <span>Use</span>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span>vocab in speech</span>
            <div style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%' }}>
              <HandUnderline width={135} height={8} color="#E8A857" />
            </div>
          </div>
          <span>!!</span>
          <SmileyFace size={20} color="#E8A857" />
        </div>
      </div>
    );
  }

  if (mode === 'deep-research') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          fontFamily: "'Pixelify Sans', monospace",
          fontSize: '20px',
          fontWeight: 600,
          color: '#1E4D3B',
          marginTop: '22px',
          marginBottom: '26px',
          lineHeight: '1.3',
        }}
      >
        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', color: '#1E4D3B' }}>1)</span>
          <span>Pick a random topic</span>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', color: '#1E4D3B' }}>2)</span>
          <span>Research for</span>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span>10 min</span>
            <div style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%' }}>
              <HandUnderline width={65} height={8} color="#E8A857" />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', color: '#1E4D3B' }}>3)</span>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span>Record & Speak</span>
            <div style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%' }}>
              <HandUnderline width={125} height={8} color="#E8A857" />
            </div>
          </div>
          <span>!!</span>
          <SmileyFace size={20} color="#E8A857" />
        </div>
      </div>
    );
  }

  // Default: Random Topics
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: "'Pixelify Sans', monospace",
        fontSize: '21px',
        fontWeight: 600,
        color: '#1E4D3B',
        marginTop: '24px',
        marginBottom: '26px',
        lineHeight: '1.3',
      }}
    >
      {/* Step 1: Get random topic (orange dotted underline + tick marks above) */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', color: '#1E4D3B' }}>1)</span>
        <span>Get</span>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Tick marks above */}
          <div style={{ position: 'absolute', top: '-11px', left: '26px' }}>
            <TickMarks count={3} color="#E8A857" size={15} />
          </div>
          <span>random topic</span>
          {/* Dotted underline */}
          <div style={{ position: 'absolute', bottom: '-3px', left: 0, width: '100%' }}>
            <DottedUnderline width={110} height={8} color="#E8A857" />
          </div>
        </div>
      </div>

      {/* Step 2: Set 1 min timer ("1 min" orange hand-drawn underline) */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', color: '#1E4D3B' }}>2)</span>
        <span>Set</span>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <span>1 min</span>
          <div style={{ position: 'absolute', bottom: '-3px', left: 0, width: '100%' }}>
            <HandUnderline width={48} height={8} color="#E8A857" />
          </div>
        </div>
        <span>timer</span>
      </div>

      {/* Step 3: Record & Speak !! ("speak" orange underline, small smiley face drawn at the end) */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', color: '#1E4D3B' }}>3)</span>
        <span>Record &</span>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <span>Speak</span>
          <div style={{ position: 'absolute', bottom: '-3px', left: 0, width: '100%' }}>
            <HandUnderline width={54} height={8} color="#E8A857" />
          </div>
        </div>
        <span>!!</span>
        <span style={{ marginLeft: '4px' }}>
          <SmileyFace size={21} color="#E8A857" />
        </span>
      </div>
    </div>
  );
}
