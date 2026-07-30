import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../utils/language';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-banner');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        // If the bottom of the hero banner is less than or equal to 0, it has been scrolled past
        setIsVisible(rect.bottom <= 0);
      } else {
        // Fallback: scroll threshold of 600px
        setIsVisible(window.scrollY > 600);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="back-to-top-button"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          whileHover={{ 
            scale: 1.05, 
            borderColor: '#D4AF37', 
            boxShadow: '0 8px 24px -6px rgba(212, 175, 55, 0.35)',
            y: -2
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-md border border-gray-200/80 hover:border-[#D4AF37] text-gray-700 hover:text-[#B8860B] rounded-full shadow-lg cursor-pointer outline-none group transition-colors duration-300"
          title={t('backToTop')}
          aria-label={t('backToTop')}
        >
          <ArrowUp className="w-5 h-5 text-[#D4AF37] transition-transform duration-300 group-hover:-translate-y-0.5 stroke-[2.25px]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
