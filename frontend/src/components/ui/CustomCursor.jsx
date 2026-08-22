import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Smooth Spring physics configuration
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Detect coarse touch pointer devices
    const checkTouch = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      setIsTouchDevice(isCoarse);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorText(target.getAttribute('data-cursor') || '');
        setIsHovered(true);
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Suppress custom cursor on mobile touch screens
  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Precision Core Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-caveno-gold transition-transform duration-200 ${
          isHovered ? 'scale-0' : 'scale-100'
        }`}
      />

      {/* Fluid Dynamic Outer Badge */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? (cursorText ? 100 : 48) : 36,
          height: isHovered ? (cursorText ? 100 : 48) : 36,
          backgroundColor: isHovered ? 'rgba(212, 175, 55, 0.15)' : 'rgba(212, 175, 55, 0.05)',
          borderColor: isHovered ? 'rgba(212, 175, 55, 0.6)' : 'rgba(212, 175, 55, 0.3)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 rounded-full border backdrop-blur-xs flex items-center justify-center text-center shadow-lg"
      >
        {isHovered && cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-[9px] font-bold uppercase tracking-widest text-caveno-cream"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
};

export default CustomCursor;
