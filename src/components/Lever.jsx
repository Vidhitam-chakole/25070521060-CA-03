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
        width: '64px',
        userSelect: 'none',
      }}
    >
      {showAnnotation && (
        <div
          style={{
            position: 'absolute',
            top: '-58px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <PullLeverAnnotation />
        </div>
      )}

      <div
        onClick={handlePull}
        title="Pull lever to spin"
        style={{
          position: 'relative',
          width: '50px',
          height: '140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
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
            height: '124px',
            marginBottom: '6px',
          }}
        >
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
              zIndex: 3,
            }}
          >
            <div style={{ width: '14px', height: '2px', backgroundColor: '#8E6EC4' }} />
            <div style={{ width: '16px', height: '2px', backgroundColor: '#8E6EC4' }} />
            <div style={{ width: '14px', height: '2px', backgroundColor: '#8E6EC4' }} />
          </motion.div>

          <div
            style={{
              width: '8px',
              flex: 1,
              backgroundColor: '#1E4D3B',
              borderRadius: '0px',
              border: '1px solid #0E3B33',
              boxShadow: 'inset 2px 0 0 rgba(255, 255, 255, 0.25)',
              margin: '-2px 0',
            }}
          />
        </motion.div>

        <div
          style={{
            width: '20px',
            height: '16px',
            borderRadius: '0px',
            backgroundColor: '#1E4D3B',
            border: '2px solid #0E3B33',
            boxShadow: '2px 2px 0px #0E3B33',
            zIndex: 4,
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            width: '28px',
            height: '6px',
            backgroundColor: '#D9D5C7',
            border: '1px solid #1E4D3B',
            borderRadius: '0px',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}
