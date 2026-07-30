import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, BookOpen, Globe } from 'lucide-react';
import { getGeneralContent } from '../utils/content';
import { useLanguage } from '../utils/language';
import { openBookingPopup } from '../utils/booking';

const MENU_ITEMS_RAW = [
  { labelEn: 'Home', labelKo: '인사말', targetId: 'philosophy-story' },
  { labelEn: 'Treatments', labelKo: '시술 프로그램', targetId: 'treatments-catalog' },
  { labelEn: 'Our Product', labelKo: '클리닉 제품', targetId: 'our-products-catalog' },
  { labelEn: 'Results', labelKo: '시술 결과', targetId: 'results-gallery-showcase' },
  { labelEn: 'Contact Us', labelKo: '오시는 길', targetId: 'contact-coordinates' }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [generalContent, setGeneralContent] = useState(getGeneralContent);
  const [activeSection, setActiveSection] = useState('philosophy-story');
  
  const { language, setLanguage, t } = useLanguage();

  const MENU_ITEMS = MENU_ITEMS_RAW.map(item => ({
    label: language === 'ko' ? item.labelKo : item.labelEn,
    targetId: item.targetId
  }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Determine active section using scroll offset threshold
      const scrollPosition = window.scrollY + 120;
      let currentSection = 'philosophy-story';

      // Scan items in reverse to match deepest section currently scrolled past
      const reversedItems = [...MENU_ITEMS].reverse();
      for (const item of reversedItems) {
        const el = document.getElementById(item.targetId);
        if (el) {
          if (scrollPosition >= el.offsetTop) {
            currentSection = item.targetId;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    
    const sync = () => {
      setGeneralContent(getGeneralContent());
    };
    window.addEventListener('acek_content_update', sync);

    // Trigger on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('acek_content_update', sync);
    };
  }, [language]); // Depend on language so labels update correctly on scroll check

  const handleScrollToSegment = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getAbbreviation = (name: string) => {
    if (!name) return 'A';
    return name.split(' ').map(w => w[0]).join('').substring(0, 3);
  };

  const clinicLabel = language === 'ko' ? '에이스 케이 클리닉' : (generalContent.clinicName || 'ACE K CLINIC');
  const parts = clinicLabel.split(' ');
  const mainName = parts.slice(0, -1).join(' ') || parts[0];
  const subName = parts.length > 1 ? parts[parts.length - 1] : '';

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-[#D4AF37] py-3 shadow-md' 
        : 'bg-white/90 backdrop-blur-sm border-b border-gray-200 py-4'
    }`}>
      <div className="max-w-full mx-auto px-4 sm:px-10 lg:px-16 xl:px-24 flex justify-between items-center">
        {/* Clinic Branding Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer flex items-center gap-2.5 group animate-fadeIn"
        >
          {generalContent.logoUrl ? (
            <img 
              src={generalContent.logoUrl} 
              alt={clinicLabel} 
              className="h-10 sm:h-12 w-auto max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <>
              <div className="w-9 h-9 rounded-full border border-[#D4AF37] flex items-center justify-center text-xs font-serif text-[#B8860B] bg-amber-500/5 group-hover:bg-amber-500/15 transition-all duration-500">
                {getAbbreviation(clinicLabel)}
              </div>
              <div>
                <h1 className="text-lg font-serif text-[#B8860B] tracking-[4px] leading-none uppercase font-semibold">
                  {mainName}
                </h1>
                {subName && (
                  <span className="text-[9px] uppercase tracking-[6px] text-gray-400 block mt-0.5 font-mono">
                    {subName}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Desktop Anchor Menu Items & Toggle */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-mono tracking-widest text-gray-600 uppercase font-bold">
            {MENU_ITEMS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleScrollToSegment(item.targetId)}
                className={`pb-1 transition-all duration-200 cursor-pointer border-b-2 font-bold tracking-widest select-none outline-none ${
                  activeSection === item.targetId
                    ? 'text-[#B8860B] border-[#D4AF37]'
                    : 'text-gray-500 border-transparent hover:text-[#B8860B] hover:border-[#D4AF37]/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Premium Language Pill-Switch */}
          <div className="flex items-center bg-[#F4F4F2] border border-[#D4AF37]/20 p-1.5 rounded-lg shadow-inner gap-1">
            <Globe className="w-3 h-3 text-[#B8860B] mx-1 opacity-75" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#B8860B] text-white shadow'
                  : 'text-gray-500 hover:text-gray-900 bg-transparent'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ko')}
              className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                language === 'ko'
                  ? 'bg-[#B8860B] text-white shadow'
                  : 'text-gray-500 hover:text-gray-900 bg-transparent'
              }`}
            >
              KO
            </button>
          </div>
          
          <button
            onClick={() => openBookingPopup()}
            className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-bold px-5 py-2.5 rounded-md transition-all shadow-sm text-xs uppercase tracking-widest cursor-pointer"
          >
            {t('bookPlacement')}
          </button>
        </div>

        {/* Mobile menu trigger & Compact Language Toggle */}
        <div className="flex md:hidden items-center gap-3">
          {/* Compact language switch for mobile navbar access */}
          <div className="flex items-center bg-[#F4F4F2] border border-gray-250 p-1 rounded-lg gap-1 Scale-90">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#B8860B] text-white'
                  : 'text-gray-500 bg-transparent'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ko')}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold transition-all cursor-pointer ${
                language === 'ko'
                  ? 'bg-[#B8860B] text-white'
                  : 'text-gray-500 bg-transparent'
              }`}
            >
              KO
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-[#B8860B] transition-colors p-1 cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sliding Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white/98 border-b border-gray-200 animate-slideDown absolute top-full left-0 right-0 p-5 space-y-4 shadow-lg">
          <div className="flex flex-col gap-4 text-sm font-mono uppercase tracking-widest text-[#B8860B] text-center font-bold">
            {MENU_ITEMS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleScrollToSegment(item.targetId)}
                className={`py-2 rounded-xl text-sm font-mono uppercase tracking-widest transition-all border-b cursor-pointer font-bold ${
                  activeSection === item.targetId
                    ? 'text-[#B8860B] border-[#D4AF37]/35 bg-amber-500/5 font-bold'
                    : 'text-gray-500 border-gray-100 hover:text-[#B8860B]'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <button
              onClick={() => {
                setIsOpen(false);
                openBookingPopup();
              }}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-bold py-3 rounded-lg text-sm tracking-widest cursor-pointer"
            >
              {t('bookPlacement')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
