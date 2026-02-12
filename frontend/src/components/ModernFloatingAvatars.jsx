import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FloatingAvatar.css';

const FloatingAvatar = ({ emoji, gender, action, text, side, scrollRange }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isVisible = scrollY >= scrollRange[0] && scrollY <= scrollRange[1];
  
  if (!isVisible) return null;

  const dynamicTop = Math.min(100 + scrollY * 0.3, window.innerHeight - 200);

  return (
    <AnimatePresence>
      <motion.div
        className={`floating-avatar ${side}`}
        style={{ top: `${dynamicTop}px` }}
        initial={{ opacity: 0, x: side === 'left' ? -100 : 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: side === 'left' ? -100 : 100 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="avatar-container">
          {/* Glow effect */}
          <div className="avatar-glow" />
          
          {/* Avatar circle */}
          <div className={`avatar-circle ${gender} action-${action}`}>
            <div className="avatar-emoji">{emoji}</div>
            
            {/* Particles */}
            <div className="avatar-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>

          {/* Speech bubble */}
          {text && (
            <motion.div
              className={`speech-bubble ${side}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {text}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const ModernFloatingAvatars = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const avatars = [
    {
      emoji: '👩‍💼',
      gender: 'female',
      action: 'wave',
      text: '👋 Vítejte! Jsem AJI',
      side: 'left',
      scrollRange: [0, 800]
    },
    {
      emoji: '👨‍💼',
      gender: 'male',
      action: 'point',
      text: '👉 Podívejte na výhody!',
      side: 'right',
      scrollRange: [600, 1800]
    },
    {
      emoji: '👩‍💼',
      gender: 'female',
      action: 'celebrate',
      text: '🎉 Skvělé příklady!',
      side: 'left',
      scrollRange: [1500, 3000]
    },
    {
      emoji: '👨‍💼',
      gender: 'male',
      action: 'dance',
      text: '💃 Vyberte balíček!',
      side: 'right',
      scrollRange: [2800, 4500]
    },
    {
      emoji: '👩‍💼',
      gender: 'female',
      action: 'wave',
      text: '📞 Zavoláme vám!',
      side: 'left',
      scrollRange: [4200, 10000]
    }
  ];

  return (
    <>
      {avatars.map((avatar, index) => (
        <FloatingAvatar
          key={index}
          emoji={avatar.emoji}
          gender={avatar.gender}
          action={avatar.action}
          text={avatar.text}
          side={avatar.side}
          scrollRange={avatar.scrollRange}
        />
      ))}
    </>
  );
};

export default ModernFloatingAvatars;
