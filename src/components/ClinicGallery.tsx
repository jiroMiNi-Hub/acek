import React, { useState, useEffect } from 'react';
import { getGalleryContent } from '../utils/content';
import BeforeAfterSlider from './BeforeAfterSlider';
import { Sparkles, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function ClinicGallery() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'injectables' | 'skin'>('all');
  const [galleryItems, setGalleryItems] = useState(getGalleryContent);

  useEffect(() => {
    const sync = () => {
      setGalleryItems(getGalleryContent());
    };
    window.addEventListener('acek_content_update', sync);
    return () => window.removeEventListener('acek_content_update', sync);
  }, []);

  const filteredGallery = galleryItems.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'injectables') return item.category.toLowerCase().includes('injectable');
    if (activeCategory === 'skin') return item.category.toLowerCase().includes('laser') || item.category.toLowerCase().includes('skin') || item.category.toLowerCase().includes('peel') || item.category.toLowerCase().includes('rejuvenation');
    return true;
  });

  return (
    <div>
      {/* Title & Introduction block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-gray-200 pb-4">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold font-mono">
            {language === 'ko' ? '임상 결과 모델' : 'CLINICAL EVIDENCE'}
          </span>
          <h3 className="text-3xl md:text-4xl font-serif text-[#333333] mt-2 font-light">
            {language === 'ko' ? '고정밀 전후 치료 갤러리' : 'Precision Outcomes Gallery'}
          </h3>
          <p className="text-gray-550 mt-3 text-sm leading-relaxed font-sans text-gray-500">
            {language === 'ko' 
              ? '보정이나 왜곡이 없는 에이스 케이 클리닉의 실제 치료 사례입니다. 전후 투사 카드의 슬라이드 핸들을 좌우로 드래그하여 고른 모공 수축 및 입체 윤곽의 대칭 개선을 세밀히 검토해 보십시오.' 
              : 'Honest, unretouched results from real ACE K Clinic patients. Drag the vertical divider on any card left or right to review the skin glow and symmetry improvements.'}
          </p>
        </div>

        {/* Local category toggle tabs */}
        <div className="flex bg-[#F9F9F7] border border-gray-200 p-1.5 rounded-xl gap-1 flex-shrink-0 self-start md:self-auto shadow-sm">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#D4AF37] text-white border border-[#D4AF37] shadow-sm'
                : 'text-gray-500 hover:text-[#B8860B]'
            }`}
          >
            {language === 'ko' ? '모든 솔루션' : 'All Areas'}
          </button>
          <button
            onClick={() => setActiveCategory('injectables')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all cursor-pointer ${
              activeCategory === 'injectables'
                ? 'bg-[#D4AF37] text-white border border-[#D4AF37] shadow-sm'
                : 'text-gray-500 hover:text-[#B8860B]'
            }`}
          >
            {language === 'ko' ? '주입 테라피' : 'Injectables'}
          </button>
          <button
            onClick={() => setActiveCategory('skin')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all cursor-pointer ${
              activeCategory === 'skin'
                ? 'bg-[#D4AF37] text-white border border-[#D4AF37] shadow-sm'
                : 'text-gray-500 hover:text-[#B8860B]'
            }`}
          >
            {language === 'ko' ? '피부 결&레이저 재생' : 'Dermal Rejuvenation'}
          </button>
        </div>
      </div>

      {/* Grid of Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGallery.map((item) => {
          // Translate card titles / descriptions bilingually for standard template items
          let displayTitle = item.title;
          let displayDesc = item.description;
          let displayCat = item.category;

          if (language === 'ko') {
            if (item.title === 'Full Dermal Lift') {
              displayTitle = '풀 페이셜 더멀 리프팅';
              displayDesc = '볼륨 충전 및 턱 끝 입체화를 통하여 자연스러운 안면 거상 수축 효과를 이끌어 냅니다.';
              displayCat = '주입 요법';
            } else if (item.title === 'Micro-Gold Glow') {
              displayTitle = '24K 순금 스킨 인퓨전';
              displayDesc = '순금 미세 주사 채널을 통해 유기 수분을 진피 깊숙히 공급하고 화사한 물광 모공 수축을 이끕니다.';
              displayCat = '프리미엄 관리';
            } else if (item.title === 'Elite Laser Resurfacing') {
              displayTitle = '엘리트 정밀 레이저 리서페이싱';
              displayDesc = '불규칙한 여드름 요철 흉터 부위를 대폭 메우고 오래된 잡티를 깨끗이 분쇄하여 투명한 결을 완성합니다.';
              displayCat = '레이저 수술';
            }
          }

          return (
            <BeforeAfterSlider
              key={item.id}
              title={displayTitle}
              category={displayCat}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              description={displayDesc}
            />
          );
        })}
      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap max-w-3xl mx-auto shadow-sm">
        <div className="flex gap-3 items-center">
          <span className="p-2 rounded-full bg-amber-500/5 text-[#B8860B] flex-shrink-0">
            <ArrowRightLeft className="w-4 h-4" />
          </span>
          <p className="text-xs text-gray-500 font-sans leading-normal">
            {language === 'ko'
              ? '귀중한 환자 분들의 의료 신상 및 사생활 기밀 보장을 위해 온라인에는 극히 한정된 갤러리 자료만 기재하고 있습니다. 풍부하고 완벽한 전형적 실제 피부 타입별 전후 임상 북은 오프라인 스위트 내원 시 VIP 대면 상담 과정을 통해 기밀 열람 가능합니다.'
              : 'To guard our clients’ medical privacy, we limit our online gallery. Comprehensive clinical results binder logs are available for private study during your physical consultation in Dr. Choi\'s private suite.'}
          </p>
        </div>
      </div>
    </div>
  );
}
