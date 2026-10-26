// src/components/HeroTitle.jsx
import React from 'react';
import {
  WavySquiggle,
  SparkleArcs,
  StarDoodle,
  FlowerDoodle,
  TickMarks,
  HandUnderline,
} from './Doodles';

export function HeroTitle({ mode }) {
  if (mode === 'interview-prep') {
    return (
      <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>
        {/* Star doodle top right of INTERVIEW */}
        <div style={{ position: 'absolute', top: '-14px', right: '-12px' }}>
          <StarDoodle size={24} color="#E8A857" />
        </div>

        {/* Flower doodle left of PREP */}
        <div style={{ position: 'absolute', bottom: '12px', left: '-30px' }}>
          <FlowerDoodle size={26} color="#E8A857" />
        </div>

        {/* Star doodle right of PREP */}
        <div style={{ position: 'absolute', bottom: '16px', right: '-24px' }}>
          <StarDoodle size={20} color="#E8A857" />
        </div>

        <h1
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(20px, 5.5vw, 44px)',
            lineHeight: '1.2',
            color: '#2A6B52',
            textShadow: '3px 3px 0px #A9C4B8, 6px 6px 0px rgba(169, 196, 184, 0.5)',
            letterSpacing: '0.04em',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          INTERVIEW
          <br />
          PREP
        </h1>
      </div>
    );
  }

  if (mode === 'learn-vocab') {
    return (
      <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>
        {/* Tick marks above LEARN */}
        <div style={{ position: 'absolute', top: '-18px', left: '16px' }}>
          <TickMarks count={3} color="#E8A857" size={20} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(22px, 5.5vw, 48px)',
                lineHeight: '1.15',
                color: '#2A6B52',
                textShadow: '3px 3px 0px #A9C4B8, 6px 6px 0px rgba(169, 196, 184, 0.5)',
                letterSpacing: '0.04em',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              LEARN
            </h1>
            <div style={{ position: 'absolute', bottom: '-8px', left: '2px', width: '92%' }}>
              <HandUnderline width={180} height={10} color="#E8A857" />
            </div>
          </div>

          <div style={{ position: 'relative', display: 'inline-block', marginTop: '12px' }}>
            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(22px, 5.5vw, 48px)',
                lineHeight: '1.15',
                color: '#2A6B52',
                textShadow: '3px 3px 0px #A9C4B8, 6px 6px 0px rgba(169, 196, 184, 0.5)',
                letterSpacing: '0.04em',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              VOCAB
            </h1>
            <div style={{ position: 'absolute', bottom: '-8px', left: '2px', width: '92%' }}>
              <HandUnderline width={180} height={10} color="#E8A857" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'deep-research') {
    return (
      <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>
        {/* Star doodles scattered around */}
        <div style={{ position: 'absolute', top: '-16px', right: '10px' }}>
          <StarDoodle size={22} color="#E8A857" />
        </div>
        <div style={{ position: 'absolute', top: '48px', left: '-28px' }}>
          <StarDoodle size={18} color="#E8A857" />
        </div>
        <div style={{ position: 'absolute', bottom: '-6px', right: '-20px' }}>
          <StarDoodle size={22} color="#E8A857" />
        </div>

        <h1
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(19px, 5vw, 42px)',
            lineHeight: '1.25',
            color: '#2A6B52',
            textShadow: '3px 3px 0px #A9C4B8, 6px 6px 0px rgba(169, 196, 184, 0.5)',
            letterSpacing: '0.04em',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          DEEP
          <br />
          RESEARCH
        </h1>
      </div>
    );
  }

  // Default: Random Topics ("Learn" over "With Fun")
  return (
    <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>
      {/* Arc sparkle top-left of Learn */}
      <div style={{ position: 'absolute', top: '-14px', left: '-22px' }}>
        <SparkleArcs color="#E8A857" size={26} />
      </div>

      {/* Arc sparkle bottom-left of With Fun */}
      <div style={{ position: 'absolute', bottom: '-4px', left: '-26px' }}>
        <SparkleArcs color="#E8A857" size={24} />
      </div>

      {/* Arc sparkle bottom-right of With Fun */}
      <div style={{ position: 'absolute', bottom: '6px', right: '-24px' }}>
        <SparkleArcs color="#E8A857" size={24} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(24px, 6vw, 52px)',
            lineHeight: '1.15',
            color: '#2A6B52',
            textShadow: '3px 3px 0px #A9C4B8, 6px 6px 0px rgba(169, 196, 184, 0.5)',
            letterSpacing: '0.03em',
            margin: 0,
          }}
        >
          Learn
        </h1>

        {/* Orange pixel wave running between the two words */}
        <div style={{ margin: '4px 0 6px 2px' }}>
          <WavySquiggle width={170} height={16} color="#E8A857" />
        </div>

        <h1
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(20px, 5vw, 44px)',
            lineHeight: '1.15',
            color: '#2A6B52',
            textShadow: '3px 3px 0px #A9C4B8, 6px 6px 0px rgba(169, 196, 184, 0.5)',
            letterSpacing: '0.03em',
            margin: 0,
          }}
        >
          With Fun
        </h1>
      </div>
    </div>
  );
}
