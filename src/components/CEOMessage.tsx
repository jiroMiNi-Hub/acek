import React, { useState, useEffect } from 'react';
import { Leaf, Award, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';
import { getGeneralContent } from '../utils/content';
import { useLanguage } from '../utils/language';

export default function CEOMessage() {
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

  const values = [
    {
      num: "01",
      icon: <Award className="w-5 h-5 text-[#D4AF37]" />,
      title: language === 'ko' ? "철저한 검증 테라피" : "Scientific Rigour",
      text: language === 'ko' 
        ? "원내 도입되는 모든 첨단 레이저, 디클래스 앰플 원액 스킨 장비는 학술 보건 검증을 거쳐 철저한 부작용 방지 및 하이 퀄리티 스킨 이펙트를 지향합니다." 
        : "Every device, clinical protocol, and serum is meticulously backed by peer-reviewed dermatology research to guarantee complete safety."
    },
    {
      num: "02",
      icon: <Leaf className="w-5 h-5 text-[#D4AF37]" />,
      title: language === 'ko' ? "고유 미학 및 특징 보존" : "Preserved Identity",
      text: language === 'ko'
        ? "어색해지지 않는 복원(Undetectable Restoration)을 통해, 과한 성형적 변형이 아닌 당신이 가진 최상의 화사함과 입체감을 자연스럽게 되살립니다."
        : "We specialize in 'undetectable restorations'. Our philosophy is to refresh and highlight, never to reshape, keeping your true natural structure intact."
    },
    {
      num: "03",
      icon: <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />,
      title: language === 'ko' ? "철저한 1:1 기밀 케어 정책" : "Private Medical Care",
      text: language === 'ko'
        ? "우리는 하루 유효 예약 방문 환자 수를 엄격히 제한하여, 전담 의료진의 고품격 어조 조율과 충분한 상담 시간, 완벽한 사생활 아웃 가이드를 선사합니다."
        : "We restrict active bookings to ensure Dr. Choi and senior nurses can offer uncompromised focus, luxury pacing, and absolute patient confidentiality."
    }
  ];

  return (
    <div className="space-y-8 lg:space-y-12 animate-fadeIn">
      {/* Top Part: Asymmetric Editorial Feature Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Aspect: Majestic Framed Portrait with Overlap Accents */}
        <div className="lg:col-span-5 relative">
          {/* Decorative artistic background cards */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-[#B8860B]/2 rounded-3xl blur-2xl transform scale-105 pointer-events-none"></div>
          
          <div id="ceo-portrait-frame" className="relative z-10 mx-auto max-w-md lg:mx-0">
            {/* Elegant off-center dual gold lines frame */}
            <div className="absolute -inset-3 border border-[#D4AF37]/35 rounded-3xl pointer-events-none transform -rotate-1 scale-[0.99] transition-transform duration-500 hover:rotate-0"></div>
            <div className="absolute -inset-1 border-2 border-[#D4AF37]/15 rounded-3xl pointer-events-none transform rotate-1 scale-[1.01]"></div>

            <div className="relative overflow-hidden rounded-2xl bg-[#333333] aspect-[4/5] border border-gray-100 shadow-2xl group">
              <img
                src={activeGeneralContent.ceoImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"}
                alt={activeGeneralContent.ceoMessageTitle || "Dr. Choi Sung Su, Director of ACE K"}
                className="w-full h-full object-cover object-top grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 pointer-events-none filter brightness-95"
                referrerPolicy="no-referrer"
              />
              
              {/* Refined minimalist clinician ribbon overlay */}
              <div className="absolute bottom-4 inset-x-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-[#D4AF37]/25 shadow-lg text-center transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xs font-mono tracking-widest text-[#B8860B] font-bold block">{(activeGeneralContent.ceoMessageTitle || "DR. CHOI SUNG SU, MD").toUpperCase()}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-sans block mt-1">
                  {language === 'ko' ? '설립자 겸 수석 미적 전담의' : 'Founder & Lead Aesthetic Specialist'}
                </span>
              </div>
            </div>

            {/* Floating Atelier Badge on top-right */}
            <div className="absolute -top-4 -right-4 bg-[#B8860B] text-white px-3 py-1.5 rounded-full shadow-lg border border-white/20 text-[9px] font-mono tracking-widest font-bold uppercase z-20 flex items-center gap-1.5">
              <Sparkles className="w-2.5 h-2.5 text-[#F9F9F7]" />
              <span>{language === 'ko' ? '원내 전임 진료' : 'In-Residence'}</span>
            </div>
          </div>
        </div>

        {/* Right Aspect: Narrative Letter with High-End Editorial Typography */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-8 lg:py-2">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-[1px] w-8 bg-[#D4AF37]"></span>
                <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold font-mono">
                  {language === 'ko' ? '의학적 신념과 미학 지향점' : 'OUR PHILOSOPHY'}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4.5xl font-serif text-[#333333] font-light leading-tight tracking-tight">
                "{activeGeneralContent.ceoMessageSubtitle}"
              </h2>
            </div>

            {/* Narrative with a gorgeous drop-cap lead */}
            <div className="space-y-5 text-gray-650 text-sm leading-relaxed font-sans scroll-smooth">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-normal first-letter:text-[#B8860B] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
                {language === 'ko' ? (
                  <>
                    <strong className="text-[#B8860B] font-serif font-semibold">{activeGeneralContent.clinicName}</strong>에 오신 것을 진심으로 환영합니다. 우리의 프라이빗 진료 스위트에서는 상업적인 뷰티 트렌드를 무분별하게 쫓지 않습니다. 섬세하게 조율된 코스메틱 에스테틱이란 정교하게 설계된 미적 인체 기하학이며 메디컬 과학입니다.
                  </>
                ) : (
                  <>
                    Welcome to <strong className="text-[#B8860B] font-serif font-semibold">{activeGeneralContent.clinicName}</strong>. Inside our private treatment suites, we do not follow commercial trends. We treat cosmetic enhancement as a meticulous medical science paired with fine geometric artistry.
                  </>
                )}
              </p>
              <p className="text-gray-650">
                {activeGeneralContent.ceoParagraph1}
              </p>
              {activeGeneralContent.ceoParagraph2 && (
                <p className="text-gray-650 border-l-2 border-[#D4AF37]/20 pl-4 italic bg-[#F9F9F7]/60 py-2 rounded-r-xl">
                  {activeGeneralContent.ceoParagraph2}
                </p>
              )}
            </div>
          </div>

          {/* Hand written sign-off layout */}
          <div className="pt-6 border-t border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-serif italic text-xl text-gray-800 tracking-wide">
                {activeGeneralContent.ceoMessageTitle}
              </div>
              <div className="text-xs font-mono text-[#B8860B] tracking-wider uppercase font-semibold">
                {language === 'ko' ? '설립자 겸 대표원장' : 'Founder & Clinical Director'} • {activeGeneralContent.clinicName}
              </div>
              <div className="text-[10px] text-gray-500 font-sans">
                {language === 'ko' 
                  ? 'M.D., 피부 의학 전문의 및 최정상급 정밀 주사 자격 보유'
                  : 'M.D., Board-Certified Aesthetic Dermatologist & Laser Surgeon'}
              </div>
            </div>
            
            {/* Minimalist medical seal */}
            <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-full border border-[#D4AF37]/20 bg-[#F9F9F7] w-16 h-16 text-center select-none">
              <span className="text-[6px] font-mono font-bold text-[#B8860B] tracking-widest leading-none">ACE K</span>
              <span className="text-[5px] font-sans font-bold text-gray-400 uppercase tracking-widest mt-1">
                {language === 'ko' ? '인증' : 'SEAL OF'}
              </span>
              <span className="text-[5px] font-sans font-bold text-gray-400 uppercase tracking-widest leading-none">
                {language === 'ko' ? '보증서' : 'RIGOUR'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Part: Premium Horizontal Columns Grid for Core Pillars */}
      <div className="pt-4 animate-slideUp">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
            {language === 'ko' ? '에이스 케이 클리닉 3대 에스테틱 원칙' : 'THE THREE FOUNDATIONAL CRITERIA'}
          </span>
          <div className="h-[1px] w-12 bg-gray-200 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((v, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 group relative flex flex-col justify-between"
            >
              {/* Index Number background decoration */}
              <div className="absolute top-4 right-4 text-3xl font-mono font-bold text-gray-100 group-hover:text-amber-500/5 select-none transition-colors">
                {v.num}
              </div>

              <div>
                <div className="p-2.5 rounded-xl bg-[#F9F9F7] border border-gray-150 flex-shrink-0 w-fit text-[#B8860B] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300 mb-4 shadow-sm">
                  {v.icon}
                </div>
                
                <h4 className="font-serif text-[15px] text-gray-800 uppercase tracking-wider font-semibold mb-2 group-hover:text-[#B8860B] transition-colors">
                  {v.title}
                </h4>
                
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  {v.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
