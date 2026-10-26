// src/components/Lever.jsx
import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { PullLeverAnnotation } from './Doodles';
import { sound } from '../utils/audio';

export function Lever({ onPull, isSpinning, showAnnotation = true }) {
  const [isPulled, setIsPulled] = useState(false);
  const controls = useAnimation();

  const handlePull = async () => {
    if (isSpinning || isPulled) return;

    setIsPulled(true);
    sound.playLeverPull();

    await controls.start({
      rotate: 42,
      scaleY: 0.85,
      transition: { duration: 0.22, ease: 'easeIn' },
    });

    onPull();

    await controls.start({
      rotate: 0,
      scaleY: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 14,
        mass: 0.6,
      },
    });

    setIsPulled(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '54px',
        height: '220px',
        userSelect: 'none',
      }}
    >
      {showAnnotation && (
        <div
          style={{
            position: 'absolute',
            top: '-46px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <PullLeverAnnotation />
        </div>
      )}

      {/* CLICKABLE LEVER ASSEMBLY */}
      <div
        onClick={handlePull}
        title="Pull lever to spin"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
        }}
      >
        {/* 1. UPPER ROTATING LEVER ARM & HANDLE BUTTON */}
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(50% + 9px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 5,
          }}
        >
          <motion.div
            animate={controls}
            initial={{ rotate: 0, scaleY: 1 }}
            style={{
              originX: 0.5,
              originY: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '92px',
              justifyContent: 'flex-start',
            }}
          >
            {/* The Purple Handle Button / Knob */}
            <motion.div
              whileHover={!isSpinning ? { scale: 1.08 } : {}}
              whileTap={!isSpinning ? { scale: 0.94 } : {}}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '0px',
                backgroundColor: '#B79AE6',
                border: '2px solid #1E4D3B',
                boxShadow: '3px 3px 0px #1E4D3B, inset 2px 2px 0px rgba(255, 255, 255, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: isSpinning ? 'not-allowed' : 'grab',
                flexShrink: 0,
              }}
            >
              <div style={{ width: '14px', height: '2px', backgroundColor: '#8E6EC4' }} />
              <div style={{ width: '16px', height: '2px', backgroundColor: '#8E6EC4' }} />
              <div style={{ width: '14px', height: '2px', backgroundColor: '#8E6EC4' }} />
            </motion.div>

            {/* Solid continuous lever rod connecting directly into pivot box with zero gap */}
            <div
              style={{
                width: '8px',
                flex: 1,
                backgroundColor: '#1E4D3B',
                borderRadius: '0px',
                borderLeft: '1px solid #0E3B33',
                borderRight: '1px solid #0E3B33',
                boxShadow: 'inset 2px 0 0 rgba(255, 255, 255, 0.3)',
                margin: '0',
              }}
            />
          </motion.div>
        </div>

        {/* 2. CENTRAL PIVOT GEARBOX (At top: 50%, connecting directly to drum axle) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '24px',
            height: '20px',
            borderRadius: '0px',
            backgroundColor: '#1E4D3B',
            border: '2px solid #0E3B33',
            boxShadow: '2px 2px 0px #0E3B33',
            zIndex: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Axle coupling extending left to meet the cylinder axle with zero gap */}
          <div
            style={{
              position: 'absolute',
              left: '-14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '14px',
              height: '14px',
              background: 'linear-gradient(180deg, #7A7465 0%, #FAF8F2 40%, #1E4D3B 100%)',
              border: '2px solid #0E3B33',
              borderRight: 'none',
              zIndex: 3,
            }}
          />

          {/* Gold Center Pivot Bearing */}
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#C8AA58',
              border: '1px solid #0E3B33',
              boxShadow: 'inset 1px 1px 0px #FAF8F0',
            }}
          />
        </div>

        {/* 3. LOWER STAND LEG (Extending down to the table) */}
        <div
          style={{
            position: 'absolute',
            top: 'calc(50% + 9px)',
            bottom: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 2,
          }}
        >
          {/* Vertical strut */}
          <div
            style={{
              width: '8px',
              flex: 1,
              backgroundColor: '#1E4D3B',
              borderLeft: '1px solid #0E3B33',
              borderRight: '1px solid #0E3B33',
              boxShadow: '2px 0px 0px #0E3B33',
            }}
          />
          {/* Base plate on table */}
          <div
            style={{
              width: '28px',
              height: '5px',
              backgroundColor: '#0E3B33',
              borderRadius: '0px',
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
