// src/components/FrameworkAccordion.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, Lightbulb } from 'lucide-react';
import { FRAMEWORKS } from '../data/interviewPrep';
import { FlowerDoodle } from './Doodles';
import { sound } from '../utils/audio';

export function FrameworkAccordion() {
  const [openId, setOpenId] = useState('star'); // Default open STAR

  const toggle = (id) => {
    const isOpening = openId !== id;
    sound.playAccordionToggle(isOpening);
    setOpenId((curr) => (curr === id ? null : id));
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '9px',
        marginTop: '16px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontSize: '11px',
          fontFamily: "'Press Start 2P', monospace",
          fontWeight: 400,
          color: '#557667',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}
      >
        FRAMEWORKS
      </div>

      {FRAMEWORKS.map((fw) => {
        const isOpen = openId === fw.id;

        return (
          <div
            key={fw.id}
            style={{
              backgroundColor: '#FCFBF7',
              border: '2px solid #1E4D3B',
              borderRadius: '0px',
              overflow: 'hidden',
              boxShadow: '3px 3px 0px #1E4D3B',
            }}
          >
            {/* Header */}
            <button
              onClick={() => toggle(fw.id)}
              style={{
                width: '100%',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {fw.iconType === 'star' && (
                  <Star size={16} color="#E8A857" fill="#E8A857" />
                )}
                {fw.iconType === 'bulb' && (
                  <Lightbulb size={16} color="#E8A857" />
                )}
                {fw.iconType === 'flower' && (
                  <FlowerDoodle size={16} color="#E8A857" />
                )}

                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '11px',
                    color: '#1E4D3B',
                    letterSpacing: '0.03em',
                  }}
                >
                  {fw.label}
                </span>

                <span
                  style={{
                    fontSize: '12.5px',
                    fontFamily: "'Pixelify Sans', monospace",
                    color: '#6E8B7E',
                    fontWeight: 600,
                    marginLeft: '4px',
                  }}
                >
                  {fw.subtitle}
                </span>
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                style={{ color: '#557667', display: 'flex' }}
              >
                <ChevronDown size={17} />
              </motion.div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      padding: '0 14px 14px 14px',
                      fontSize: '13px',
                      fontFamily: "'Pixelify Sans', monospace",
                      color: '#2A463B',
                      borderTop: '2px dashed #ECE7DA',
                      paddingTop: '10px',
                    }}
                  >
                    <p style={{ margin: '0 0 8px 0', color: '#4E6A5E', lineHeight: '1.4', fontWeight: 500 }}>
                      {fw.desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {fw.steps.map((st, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '8px',
                            lineHeight: '1.35',
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: '#1E4D3B',
                              color: '#F9F6EC',
                              fontSize: '9px',
                              fontFamily: "'Press Start 2P', monospace",
                              fontWeight: 700,
                              width: '18px',
                              height: '18px',
                              borderRadius: '0px',
                              border: '1px solid #0E3B33',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {st.letter}
                          </span>
                          <div>
                            <strong style={{ color: '#1E4D3B' }}>{st.title}: </strong>
                            <span style={{ color: '#3A574A' }}>{st.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        marginTop: '10px',
                        padding: '6px 10px',
                        backgroundColor: '#F3EFE3',
                        border: '1px solid #1E4D3B',
                        borderRadius: '0px',
                        fontSize: '12px',
                        color: '#4C6A5D',
                      }}
                    >
                      💡 {fw.proTip}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
