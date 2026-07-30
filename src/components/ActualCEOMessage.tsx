import React, { useState, useEffect } from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { getGeneralContent } from '../utils/content';
import { useLanguage } from '../utils/language';

export default function ActualCEOMessage() {
  const [generalContent, setGeneralContent] = useState(getGeneralContent);
  const { language, t, getTranslatedGeneral } = useLanguage();

  useEffect(() => {
    const sync = () => {
      setGeneralContent(getGeneralContent());
    };
    window.addEventListener('acek_content_update', sync);
    return () => window.removeEventListener('acek_content_update', sync);
  }, []);

  const activeGeneralContent = { ...generalContent, ...getTranslatedGeneral() };

  return (
    <div className="animate-fadeIn pb-8 lg:pb-12 border-b border-gray-200">
      {/* Top Part: Asymmetric Editorial Feature Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Aspect: Narrative Letter with High-End Editorial Typography */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-8 lg:py-2 order-2 lg:order-1">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-[1px] w-8 bg-[#D4AF37]"></span>
                <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold font-mono">{t('executiveAddress')}</span>
              </div>
              <h2 className="text-3xl sm:text-4.5xl font-serif text-[#333333] font-light leading-tight tracking-tight">
                "{activeGeneralContent.actualCeoSubtitle}"
              </h2>
            </div>
 
            {/* Narrative with a gorgeous drop-cap lead */}
            <div className="space-y-5 text-gray-650 text-sm leading-relaxed font-sans scroll-smooth">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-normal first-letter:text-[#B8860B] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
                {language === 'ko' ? (
                  <>
                    <strong className="text-[#B8860B] font-serif font-semibold">{activeGeneralContent.clinicName}</strong>는 미학적 스킨 및 안티에이징 의학을 단순한 병원 시술에 가두지 않고, 인간적인 깊은 신뢰와 최고급 명품 서비스, 그리고 완벽한 과학적 정밀성이 하나로 결합된 고도의 예술적 조화로 정의합니다.
                  </>
                ) : (
                  <>
                    At <strong className="text-[#B8860B] font-serif font-semibold">{activeGeneralContent.clinicName}</strong>, we view aesthetic medicine not merely as a clinical service, but as an elegant synthesis of human trust, luxury hospitality, and advanced scientific rigor.
                  </>
                )}
              </p>
              <p className="text-gray-650">
                {activeGeneralContent.actualCeoParagraph1}
              </p>
              {activeGeneralContent.actualCeoParagraph2 && (
                <p className="text-gray-650 border-l-2 border-[#D4AF37]/20 pl-4 italic bg-[#F9F9F7]/60 py-2 rounded-r-xl">
                  {activeGeneralContent.actualCeoParagraph2}
                </p>
              )}
            </div>
          </div>

          {/* Business Signature */}
          <div className="pt-6 border-t border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-serif italic text-xl text-gray-800 tracking-wide">
                {activeGeneralContent.actualCeoName}
              </div>
              <div className="text-xs font-mono text-[#B8860B] tracking-wider uppercase font-semibold">
                {language === 'ko' ? '공동설립자 겸 최고경영자(CEO)' : 'Co-Founder & Chief Executive Officer'} • {activeGeneralContent.clinicName}
              </div>
              <div className="text-[10px] text-gray-500 font-sans">
                {language === 'ko' 
                  ? 'MBA, 메디컬 경영전략 및 럭셔리 스파 운영총괄 시스템 전문가' 
                  : 'MBA, Luxury Operations & Healthcare Administration Specialist'}
              </div>
            </div>
            
            {/* Minimalist executive emblem */}
            <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-full border border-[#D4AF37]/20 bg-[#F9F9F7] w-16 h-16 text-center select-none">
              <span className="text-[6px] font-mono font-bold text-[#B8860B] tracking-widest leading-none">ACE K</span>
              <span className="text-[5px] font-sans font-bold text-gray-400 uppercase tracking-widest mt-1">
                {language === 'ko' ? '설립자' : 'FOUNDER'}
              </span>
              <span className="text-[5px] font-sans font-bold text-gray-400 uppercase tracking-widest leading-none">
                {language === 'ko' ? '집무실' : 'OFFICE'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Aspect: Portrait of Co-Founder/CEO */}
        <div className="lg:col-span-5 relative order-1 lg:order-2">
          {/* Decorative background gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-[#B8860B]/2 rounded-3xl blur-2xl transform scale-105 pointer-events-none"></div>
          
          <div id="ceo-vance-portrait-frame" className="relative z-10 mx-auto max-w-md lg:mx-0">
            {/* Golden frames around picture matching luxury theme */}
            <div className="absolute -inset-3 border border-[#D4AF37]/35 rounded-3xl pointer-events-none transform rotate-1 scale-[0.99] transition-transform duration-500 hover:rotate-0"></div>
            <div className="absolute -inset-1 border-2 border-[#D4AF37]/15 rounded-3xl pointer-events-none transform -rotate-1 scale-[1.01]"></div>

            <div className="relative overflow-hidden rounded-2xl bg-[#333333] aspect-[4/5] border border-gray-100 shadow-2xl group">
              <img
                src={activeGeneralContent.actualCeoImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800"}
                alt={activeGeneralContent.actualCeoName || "Mr. KANG SEUNG WEON, Co-Founder & CEO of ACE K"}
                className="w-full h-full object-cover object-top grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 pointer-events-none filter brightness-95"
                referrerPolicy="no-referrer"
              />
              
              {/* Executive overlay tag */}
              <div className="absolute bottom-4 inset-x-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-[#D4AF37]/25 shadow-lg text-center transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xs font-mono tracking-widest text-[#B8860B] font-bold block">{(activeGeneralContent.actualCeoName || "Mr. KANG SEUNG WEON").toUpperCase()}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-sans block mt-1">
                  {language === 'ko' ? '공동설립자 겸 최고경영자(CEO)' : 'Co-Founder & Chief Executive Officer'}
                </span>
              </div>
            </div>

            {/* Floating crest style badge */}
            <div className="absolute -top-4 -left-4 bg-[#B8860B] text-white px-3 py-1.5 rounded-full shadow-lg border border-white/20 text-[9px] font-mono tracking-widest font-bold uppercase z-20 flex items-center gap-1.5">
              <Compass className="w-2.5 h-2.5 text-[#F9F9F7]" />
              <span>{language === 'ko' ? '최고의사결정위원회' : 'Executive Directory'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
