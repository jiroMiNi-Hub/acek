import React, { useState, useEffect } from 'react';
import { getGeneralContent } from '../utils/content';
import { Service } from '../types';
import { Clock, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../utils/language';
import { openBookingPopup } from '../utils/booking';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

interface ServiceMenuProps {
  onSelectService: (service: Service) => void;
  showPrices?: boolean;
}

export default function ServiceMenu({ onSelectService, showPrices = true }: ServiceMenuProps) {
  const { language, t, getTranslatedServices } = useLanguage();
  
  const [activeCategory, setActiveCategory] = useState<'all' | 'injectables' | 'skin' | 'laser' | 'body'>('all');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  
  const services = getTranslatedServices();
  const [, setGeneralContent] = useState(getGeneralContent);

  useEffect(() => {
    const sync = () => {
      setGeneralContent(getGeneralContent());
    };
    window.addEventListener('acek_content_update', sync);
    return () => window.removeEventListener('acek_content_update', sync);
  }, []);

  const categories = language === 'ko' ? [
    { id: 'all', label: '전체 메뉴' },
    { id: 'injectables', label: '주입 및 보톡스' },
    { id: 'skin', label: '프리미엄 스킨 케어' },
    { id: 'laser', label: '레이저 및 침착 치료' },
    { id: 'body', label: '바디 조각 테라피' }
  ] : [
    { id: 'all', label: 'Complete Menu' },
    { id: 'injectables', label: 'Injectables & Botox' },
    { id: 'skin', label: 'Advanced Skin & Gold' },
    { id: 'laser', label: 'Laser & Pigmentation' },
    { id: 'body', label: 'Body Reshaping' }
  ];

  categories[0].label = language === 'ko' ? '전체 메뉴' : 'Complete Menu';

  const filteredServices = services.filter(
    (s) => activeCategory === 'all' || s.category === activeCategory
  );

  const toggleExpand = (id: string) => {
    setExpandedServiceId(expandedServiceId === id ? null : id);
  };

  return (
    <div id="service-menu-component-wrapper" className="animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-gray-200 pb-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold font-mono">{t('exquisiteMenu')}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-serif text-[#333333] mt-2 font-light tracking-tight">
            {t('curatedRestorations')}
          </h3>
          <p className="text-gray-500 mt-3 text-sm leading-relaxed font-sans">
            {t('menuDesc')}
          </p>
        </div>
      </div>

      {/* Categories Filter Bar with luxury sliding background indicator */}
      <div id="service-category-tabs" className="flex flex-wrap justify-center gap-1.5 p-1 mb-6 border-b border-gray-150 pb-4 max-w-3xl mx-auto">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className="relative px-4 py-2 rounded-xl text-xs font-mono font-medium tracking-wide transition-colors cursor-pointer focus:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-[#D4AF37] rounded-xl shadow-sm"
                  transition={{ type: "spring", stiffness: 320, damping: 25 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${
                isActive ? 'text-white font-semibold' : 'text-gray-600 hover:text-gray-950'
              }`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* CLASSIC CARDS GRID LAYOUT */}
      <div className="relative">
        <motion.div
          key={`${activeCategory}-cards-layout`}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          id="grid-classic-container"
        >
          {filteredServices.map((service) => {
            const isExpanded = expandedServiceId === service.id;
            return (
              <motion.div
                layout
                variants={itemVariants}
                whileHover={{ 
                  y: -6, 
                  borderColor: '#D4AF37',
                  boxShadow: '0 12px 30px -8px rgba(212, 175, 55, 0.12)' 
                }}
                transition={{ duration: 0.25 }}
                key={service.id}
                id={`service-card-${service.id}`}
                className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden relative group transition-colors duration-300 ${
                  isExpanded
                    ? 'border-[#D4AF37] shadow-lg scale-[1.01]'
                    : 'border-gray-200 hover:border-[#D4AF37]/50'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8860B] bg-amber-500/5 px-2.5 py-0.5 rounded font-bold">
                      {service.category}
                    </span>
                    <div className="text-right">
                      {showPrices ? (
                        <span className="text-base font-mono font-semibold text-[#B8860B]">${service.price}</span>
                      ) : (
                        <span className="text-[9px] font-mono uppercase text-[#B8860B] bg-amber-500/5 px-2.5 py-0.5 rounded tracking-wide leading-none font-semibold">Consult</span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-serif text-[#333333] group-hover:text-[#B8860B] transition-colors font-medium mt-1 leading-snug">
                    {service.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2 font-sans leading-relaxed">
                    {service.description}
                  </p>

                  {/* Display always brief duration */}
                  <span className="inline-flex items-center gap-1 mt-3 font-mono text-[10px] text-gray-400">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    {language === 'ko' ? '임상 시술 소요 시간:' : 'Duration:'} {service.duration} mins
                  </span>

                  {/* Expanded Details Panel with smooth sliding transitions */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-4 border-t border-gray-100 space-y-4">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#B8860B] tracking-wider block mb-2 font-bold select-none">
                              {language === 'ko' ? '정밀 효능 가이드:' : 'Exquisite Benefits:'}
                            </span>
                            <ul className="space-y-1.5 text-xs text-gray-650 font-sans">
                              {service.benefits.map((benefit, bIdx) => (
                                <li key={bIdx} className="flex gap-2 items-start">
                                  <span className="w-3.5 h-3.5 bg-amber-500/5 border border-amber-500/25 text-[#B8860B] rounded-full flex items-center justify-center flex-shrink-0 text-[8px] mt-0.5">
                                    ✓
                                  </span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-[#F9F9F7] p-3 rounded-xl border border-gray-150 border-l-2 border-l-[#D4AF37]">
                            <span className="text-[9px] font-mono uppercase text-[#B8860B] tracking-widest block mb-0.5 font-bold">
                              {language === 'ko' ? '추천 대상 피부:' : 'Ideal Profile:'}
                            </span>
                            <p className="text-[11px] text-gray-500 font-sans leading-relaxed italic font-medium">"{service.idealFor}"</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons Footer */}
                <div className="p-6 pt-0 border-t border-gray-100 bg-[#F9F9F7]/10 flex gap-2 items-center">
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className="flex-1 text-center bg-gray-100 hover:bg-gray-150 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all relative cursor-pointer"
                  >
                    {isExpanded ? (language === 'ko' ? '상세 접기' : 'Hide Details') : (language === 'ko' ? '효능 보기' : 'View Benefits')}
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectService) onSelectService(service);
                      openBookingPopup(service);
                    }}
                    className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-mono text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm group cursor-pointer"
                  >
                    <span>{language === 'ko' ? '지금 예약' : 'Book'}</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
