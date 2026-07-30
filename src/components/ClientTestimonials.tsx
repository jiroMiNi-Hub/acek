import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Play, Pause, Quote, CheckCircle, Award, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../utils/language';

interface Testimonial {
  id: string;
  name: string;
  category: 'injectables' | 'skin' | 'laser' | 'all';
  membership: string;
  location: string;
  treatmentName: string;
  rating: number;
  highlight: string;
  quote: string;
  journeyDetails: string;
  date: string;
  timeframe: string; // e.g., "3 weeks post-treatment"
  avatarInitials: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'testi-01',
    name: 'Helena Rothschild',
    category: 'injectables',
    membership: 'Elite VIP Circle',
    location: 'Beverly Hills / London',
    treatmentName: 'Signature Lip Sculpting & Precision Botulinum',
    rating: 5,
    highlight: 'Absolutely undetectable restoration. I look 10 years younger without anyone knowing why.',
    quote: 'Dr. Choi’s approach is pure architectural art. She respects the natural movement of the face. My friends think I spent a month in a stress-free alpine retreat, rather than a 45-minute afternoon session at ACE K. Truly the standard-bearer of quiet luxury.',
    journeyDetails: 'The treatment took exactly 45 minutes inside the quiet acoustic suite. Minimal swelling occurred on day one, which fully resolved by the third morning. By week two, the symmetry and hydration index of my skin and lips were completely restored to my early-thirties ratio. Truly impeccable work.',
    date: 'May 2026',
    timeframe: '2 weeks post-session',
    avatarInitials: 'HR'
  },
  {
    id: 'testi-02',
    name: 'Marcus Kensington',
    category: 'skin',
    membership: 'Founding Member',
    location: 'West Vancouver',
    treatmentName: '24K Gold Micro-Infusion & Microneedling Duo',
    rating: 5,
    highlight: 'Shattered my stubborn hyperpigmentation. Flawless cellular skin texture.',
    quote: 'The 24K Gold Micro-Infusion is a masterclass in skincare hydration. As a busy executive with constant screen exposure and high cortisol, my face looked dull, strained, and dehydrated. The results are instantly glassy, tight, and refreshed. Complete, quiet discretion.',
    journeyDetails: 'The micro-infusion treatment is virtually pain-free. Dr. Choi curated a specialized cocktail containing pure bio-growth vitamins and ultra-diluted skin-tighteners. Within 48 hours, my pores were noticeably tighter, and my skin had a healthy, glass-like reflecting glow that persists even under harsh boardroom downlights.',
    date: 'April 2026',
    timeframe: '4 days post-session',
    avatarInitials: 'MK'
  },
  {
    id: 'testi-03',
    name: 'Vanessa Sterling',
    category: 'laser',
    membership: 'Privé Platinum Member',
    location: 'Kensington, UK',
    treatmentName: 'PicoGlow Nano-Laser & CO2 Regenerative Suite',
    rating: 5,
    highlight: 'The pitted scars on my cheeks are virtually gone. Skin texture feels like silk.',
    quote: 'I had moderate acne pitting from my university years that three different high-end London clinics couldn’t fully resolve. After two targeted PicoGlow treatments at ACE K, the texture is incredibly smooth. The precision is astonishing, and the recovery protocol they gave me was stellar.',
    journeyDetails: 'We scheduled the Fractional CO2 on a Thursday afternoon. The healing balm provided by ACE K calmed the heat sensation within hours, allowing me to take video meetings by Monday morning. The deep collagen restructuring has literally filled in 90% of my ancient ice-pick scars. Overwhelmingly satisfied.',
    date: 'March 2026',
    timeframe: '1 month post-session',
    avatarInitials: 'VS'
  },
  {
    id: 'testi-04',
    name: 'Genevieve Vance-DuPont',
    category: 'injectables',
    membership: 'Elite VIP Circle',
    location: 'Montreal & Paris',
    treatmentName: 'Chin & Jawline Architecture Spec Suite',
    rating: 5,
    highlight: 'Sharpened my profile lines beautifully. Outstanding aesthetic balance.',
    quote: 'What sets Mr. KANG SEUNG WEON and Dr. Choi apart is their utter rejection of generic trends. They did not try to give me a template face. Instead, they structurally aligned my jaw shape with my high cheekbones, creating a beautifully elevated profile that is sharp, elegant, and entirely authentic to me.',
    journeyDetails: 'They modeled my facial planes using the clinical screen before touching a single needle. Every injection point was measured to the millimeter. The high-density dermal filler integrates naturally into my muscle layers, so it feels completely indistinguishable from real bone structure.',
    date: 'June 2026',
    timeframe: '10 days post-session',
    avatarInitials: 'GV'
  }
];

const KOREAN_OVERLAYS: Record<string, Partial<Testimonial>> = {
  'testi-01': {
    membership: '엘리트 VIP 서클',
    location: '비벌리힐스 / 런던',
    treatmentName: '시그니처 입술 입체 조각 & 정밀 보툴리눔',
    highlight: '어색하지 않고 아주 자연스러운 복원이네요. 남몰래 10년은 젊어진 느낌입니다.',
    quote: '최 원장님의 시술 철학은 하나의 완벽한 건축학적 예술입니다. 얼굴 표정 근육의 움직임과 각도를 세심히 배려하여 대칭을 맞춥니다. 주변 지인들은 제가 에이스 케이 클리닉에서 45분 남짓 진료를 받았을 뿐인데, 스위스 최고급 요양원에서 한 달 동안 스트레스 없이 푹 쉬고 리프레시하고 돌아온 줄 압니다.',
    journeyDetails: '진료는 정숙함과 고요함이 흐르는 리스닝 어쿠스틱 스위트룸에서 정확히 45분 동안 진행되었습니다. 시술 당일 약간의 미세한 부기가 발생했으나, 3일째 아침이 되자 완벽하게 가라앉았습니다. 시술 2주 차가 지나자 피부와 입술의 대칭, 수분 감각이 30대 초반 당시의 탄력 배율로 아름답게 안착했습니다.',
    timeframe: '시술 2주 후'
  },
  'testi-02': {
    membership: '창립 VIP 멤버',
    location: '웨스트 밴쿠버',
    treatmentName: '24K 순금 스킨 인퓨전 & 오토 니들링 듀오',
    highlight: '수년간 저를 괴롭히던 만성 색소 침착 요철을 날려버렸습니다. 무결점 결 케어가 무엇인지 보여줍니다.',
    quote: '24K 순금 스킨 인퓨전 프로그램은 건조함과 피로 가득한 진피 피막 내부 깊숙이 영양 수분을 공급하는 진정한 명작입니다. 과도한 업무 스트레스와 화면 전자파 노출로 푸석하고 칙칙했는데, 시술 즉시 유리알처럼 매끄럽고 쫀쫀한 피부 장벽 탄력을 되찾았습니다.',
    journeyDetails: '순금 미세 주입 요법은 통증이 사실상 전무했습니다. 최 원장님이 순수 성장 촉진 인자 활성 비타민과 극초희석 스킨 텐서 칵테일을 정교하게 직접 배합해 주었습니다. 48시간 이내에 늘어지고 넓어진 모공이 눈에 띄게 조여졌고, 회의실 인공광 아래에서도 유리판처럼 매끈하게 반사되는 탄력이 오랜 시간 동안 안전하게 유지되고 있습니다.',
    timeframe: '시술 4일 후'
  },
  'testi-03': {
    membership: '프리베 플래티넘 회원',
    location: '영국 켄싱턴',
    treatmentName: '피코글로우 나노 레이저 & CO2 재생 치료 패키지',
    highlight: '양쪽 뺨에 남아있던 만성 흉터 요철이 마법처럼 가득 찼습니다. 아기 살결처럼 보드랍습니다.',
    quote: '대학 시절부터 안면에 남은 여드름 함몰 흉터 때문에 런던에서 내로라하는 상위 클리닉 세 곳을 다녔지만 의미 있는 변화는 없었습니다. 에이스 케이에서 설계한 정밀 PicoGlow 나노 치료를 단 두 번 받은 후, 울퉁불퉁했던 질감이 믿기지 않을 정도로 평평하고 매끈해졌습니다.',
    journeyDetails: '목요일 오후에 프랙셔널 CO2와 타겟 프락셀 시술을 예약했습니다. 병원에서 사후 홈 케어용으로 제공한 고농축 피부 복원 재생 연고 덕분에 몇 시간 만에 레이저 화끈거림이 가라앉았고, 차주 월요일 아침 실시간 비디오 화상 회의에 참여할 수 있었습니다. 깊은 부위의 콜가엔 생성 기전이 무려 90% 이상 흉터 홀을 채웠습니다.',
    timeframe: '시술 1달 후'
  },
  'testi-04': {
    membership: '엘리트 VIP 서클',
    location: '몬트리올 & 파리',
    treatmentName: '안면 윤곽 지지 골격 & 턱 선 다크 픽셀 주입 스펙',
    highlight: '측면 실루엣 라인이 아주 선명하고 날렵하게 살아났습니다. 가히 완벽하고 입체적인 각도 밸런스입니다.',
    quote: '강승원 최고경영자와 최 원장님이 다른 필러 에이전시들과 완전히 차별화되는 지점은, 인위적이고 획일화된 공장형 성형 공식을 철저하게 배격하는 세심함에 있습니다. 제 광대뼈 각도를 계산하여 턱끝 라인의 정밀 기하학을 맞춰 시술하므로 전체 이목구비가 완벽히 살아납니다.',
    journeyDetails: '실제 시술 바늘을 대기 전에 고해상도 안면 투사 스크린을 통해 가상의 입체 면적 시뮬레이션을 철저히 설계했습니다. 모든 주입 각도와 미세 압력 조절 깊이가 1mm 단위 이하로 정량 계산되었습니다. 시술된 천연 히알루론 고밀도 볼륨이 실제 뼈나 가슴 연골의 탄력과 구분하기 힘들 정도로 근육 조직 사이에 자연스럽게 고정 안착했습니다.',
    timeframe: '시술 10일 후'
  }
};

export default function ClientTestimonials() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'injectables' | 'skin' | 'laser'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showFullJournal, setShowFullJournal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const rawFilteredData = TESTIMONIALS_DATA.filter(
    (item) => activeTab === 'all' || item.category === activeTab
  );

  const filteredData = rawFilteredData.map(item => {
    if (language === 'ko' && KOREAN_OVERLAYS[item.id]) {
      return { ...item, ...KOREAN_OVERLAYS[item.id] } as Testimonial;
    }
    return item;
  });

  // If index becomes out of bounds post-filtering, reset it
  useEffect(() => {
    setCurrentIndex(0);
    setProgressWidth(0);
    setShowFullJournal(false);
  }, [activeTab]);

  // Handle slide advance timer
  useEffect(() => {
    if (!isPlaying || filteredData.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const duration = 8000; // 8 seconds per slide
    const interval = 50; // increment every 50ms
    const step = (100 / (duration / interval));

    setProgressWidth(0);

    progressIntervalRef.current = setInterval(() => {
      setProgressWidth((prev) => {
        if (prev >= 100) {
          // Advance slide
          setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredData.length);
          setShowFullJournal(false);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, currentIndex, filteredData.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredData.length - 1 : prev - 1));
    setProgressWidth(0);
    setShowFullJournal(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredData.length);
    setProgressWidth(0);
    setShowFullJournal(false);
  };

  const currentTestimonial = filteredData[currentIndex];

  if (!currentTestimonial) {
    return (
      <div className="text-center p-8 bg-white border border-gray-150 rounded-2xl">
        <p className="text-gray-500 font-mono text-xs">
          {language === 'ko' ? '환자 검증 일지 아카이브 불러오는 중...' : 'Awaiting client logs validation...'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative" id="client-testimonials-section-root">
      
      {/* Decorative Golden Ambient Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#D4AF37]/3 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Block & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-gray-200 pb-4 relative z-10">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-[#D4AF37] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold font-mono">
              {language === 'ko' ? '임상 검증 및 자필 치료 회고록' : 'SOCIAL PROOF & JOURNAL'}
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-serif text-[#333333] mt-2 font-light">
            {language === 'ko' ? '검증된 실제 VIP 성공 후기' : 'Verified Client Success Stories'}
          </h3>
          <p className="text-gray-550 mt-3 text-sm leading-relaxed font-sans text-gray-500">
            {language === 'ko'
              ? '리스토어링 치료 솔루션을 마이크로 플랜에 맞추어 직접 경험하신 최정상 프라이빗 회원 일지 및 리포트 기록입니다.'
              : 'Read comprehensive reflections from our private members on their restorative treatments, discrete experiences, and high-fidelity skin improvements.'}
          </p>
        </div>

        {/* Category filtering tabs */}
        <div className="flex flex-wrap bg-[#F9F9F7] border border-gray-200 p-1 rounded-xl gap-0.5 shadow-sm max-w-sm md:max-w-none self-start md:self-auto" id="testimonial-filter-group">
          {['all', 'injectables', 'skin', 'laser'].map((tab) => (
            <button
              id={`tab-filter-${tab}`}
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#D4AF37] text-white font-medium shadow-sm'
                  : 'text-gray-500 hover:text-[#B8860B] hover:bg-amber-500/5'
              }`}
            >
              {tab === 'all' 
                ? (language === 'ko' ? '전체 보기' : 'All Reviews') 
                : tab === 'injectables' 
                  ? (language === 'ko' ? '주입 시술' : tab)
                  : tab === 'skin'
                    ? (language === 'ko' ? '스킨 케어' : tab)
                    : tab === 'laser'
                      ? (language === 'ko' ? '레이저 재생' : tab)
                      : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Single Showcase Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl hover:shadow-gray-150/40 transition-all duration-300 relative z-10 overflow-hidden" id="active-testimonial-panel">
        
        {/* Subtle Watermark Quote Mark */}
        <div className="absolute right-8 top-8 text-[#D4AF37]/10 pointer-events-none translate-x-4 -translate-y-4">
          <Quote className="w-36 h-36 stroke-[0.5px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Column A: Client Meta details */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
            
            <div className="flex items-center gap-4">
              {/* Circular Avatar Badge */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-serif text-[#B8860B] font-semibold text-lg select-none">
                  {currentTestimonial.avatarInitials}
                </div>
              </div>

              <div>
                <h4 className="font-serif text-lg text-gray-800 font-medium tracking-tight">
                  {currentTestimonial.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#B8860B]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-semibold tracking-wider uppercase">{currentTestimonial.membership}</span>
                </div>
              </div>
            </div>

            {/* Structured Specs Lists */}
            <div className="bg-[#F9F9F7] border border-gray-150 rounded-2xl p-4.5 space-y-3.5 text-xs font-sans text-gray-650" id="testimonial-meta-specs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                  {language === 'ko' ? '기본 내원지' : 'PRIMARY LOCATION'}
                </span>
                <span className="text-gray-800 font-medium font-serif italic">{currentTestimonial.location}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                  {language === 'ko' ? '시술 완료' : 'PROCEDURE COMPLETED'}
                </span>
                <span className="text-gray-800 font-mono text-[10px] font-semibold tracking-tight text-right truncate max-w-[170px]" title={currentTestimonial.treatmentName}>
                  {currentTestimonial.treatmentName}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                  {language === 'ko' ? '정밀 진단 회고' : 'REFLECTIVE TIMEFRAME'}
                </span>
                <span className="text-[#B8860B] font-mono text-[10px] font-bold uppercase tracking-widest">{currentTestimonial.timeframe}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                  {language === 'ko' ? '검증된 실제 인증' : 'VERIFIED RECOGNITION'}
                </span>
                <span className="text-emerald-700 font-mono text-[10px] flex items-center gap-1 font-semibold">
                  <span>★★★★★</span>
                  <span>{language === 'ko' ? '100% 진실성 보장' : '100% Truth'}</span>
                </span>
              </div>
            </div>

            {/* Action buttons matching Luxury layout */}
            <div className="flex items-center gap-3">
              <button
                id="btn-toggle-journal-expand"
                onClick={() => setShowFullJournal(!showFullJournal)}
                className={`flex-1 py-3 px-5 rounded-xl text-xs font-mono uppercase tracking-widest transition-all cursor-pointer border flex items-center justify-center gap-2 ${
                  showFullJournal
                    ? 'bg-[#B8860B] border-[#B8860B] text-white font-bold shadow-md shadow-amber-700/10'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-[#D4AF37] hover:text-[#B8860B]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 stroke-[2px]" />
                <span>
                  {showFullJournal 
                    ? (language === 'ko' ? '일지 닫기' : 'Collapse Journal') 
                    : (language === 'ko' ? '자필 치료 일지 열람' : 'Read Full Journal')}
                </span>
              </button>
            </div>

          </div>

          {/* Column B: Quote & Reflections Narrative */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6 h-full">
            <div>
              {/* Star Indicator */}
              <div className="flex items-center gap-1.5 align-middle mb-4">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
                <span className="text-gray-400 font-mono text-[11px] ml-2 font-bold uppercase tracking-widest">
                  {language === 'ko' ? '극상의 품격 경험 평가 5.0' : '5.0 EXQUISITE EXPERIENCE'}
                </span>
              </div>

              {/* Highlight Punchline */}
              <h4 className="text-xl sm:text-2xl font-serif text-gray-900 font-light tracking-tight leading-snug mb-5 italic border-l-2 border-[#D4AF37]/50 pl-4 bg-amber-500/2 py-1 rounded-r-xl">
                "{currentTestimonial.highlight}"
              </h4>

              {/* Full Core Quote */}
              <p className="text-gray-650 text-sm sm:text-base leading-relaxed font-sans first-letter:text-3xl first-letter:font-serif first-letter:text-[#B8860B] first-letter:font-bold first-letter:float-left first-letter:mr-2">
                {currentTestimonial.quote}
              </p>

              {/* Collapsed/Expanded Journey Journal Panel */}
              {showFullJournal && (
                <div className="mt-6 p-5 sm:p-6 bg-[#F9F9F7] border border-[#D4AF37]/20 rounded-2xl animate-fadeIn space-y-4 border-l-4 border-l-[#D4AF37]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#B8860B] uppercase font-bold">
                    <Award className="w-4 h-4" />
                    <span>{language === 'ko' ? '임상 진행 및 케어 일지' : 'Clinical Progression & Care Log'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-sans">
                    {currentTestimonial.journeyDetails}
                  </p>
                  <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                    <span>{language === 'ko' ? '환자 식별 코드' : 'PATIENT REFERENCE'}: {currentTestimonial.id.toUpperCase()}-LOG</span>
                    <span>{language === 'ko' ? '기록 일자' : 'LOG DATE'}: {currentTestimonial.date}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation & Continuous Play Rails */}
            <div className="pt-6 border-t border-gray-150 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Previous/Next and Selector Indicators */}
              <div className="flex items-center gap-3">
                <button
                  id="btn-testimonial-prev"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#D4AF37] text-gray-500 hover:text-[#B8860B] flex items-center justify-center transition-all bg-white shadow-sm cursor-pointer hover:shadow"
                  aria-label="Previous Success Story"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[1.5px]" />
                </button>
                
                {/* Index indicators */}
                <div className="text-[11px] font-mono text-gray-400 px-3 py-1 bg-[#F9F9F7] border border-gray-150 rounded-lg">
                  <span className="text-gray-800 font-bold">{currentIndex + 1}</span>{' '}
                  <span className="text-gray-300">/</span>{' '}
                  <span>{filteredData.length}</span>
                </div>

                <button
                  id="btn-testimonial-next"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#D4AF37] text-gray-500 hover:text-[#B8860B] flex items-center justify-center transition-all bg-white shadow-sm cursor-pointer hover:shadow"
                  aria-label="Next Success Story"
                >
                  <ChevronRight className="w-5 h-5 stroke-[1.5px]" />
                </button>
              </div>

              {/* Progress Bar & Play/Pause controls */}
              <div className="flex items-center gap-4 w-full sm:w-auto flex-1 justify-end max-w-xs sm:max-w-none">
                {/* Visual Slide Remaining Progress Meter */}
                <div className="flex-1 sm:w-32 bg-gray-100 rounded-full h-1 relative overflow-hidden hidden sm:block">
                  <div
                    className="bg-[#D4AF37] h-full transition-all duration-75 rounded-full"
                    style={{ width: `${progressWidth}%` }}
                  ></div>
                </div>

                {/* Pause/Play controller */}
                <button
                  id="btn-testimonial-toggle-play"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#D4AF37] text-[10px] text-gray-500 hover:text-[#B8860B] font-mono uppercase tracking-wider transition-all bg-white cursor-pointer select-none"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                      <span>{language === 'ko' ? '자동재생 일시정지' : 'PAUSE CYCLE'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                      <span>{language === 'ko' ? '자동 슬라이드 재생' : 'AUTOPLAY'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Trust Quote Accent Ribbon below card */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4.5 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-3xl mx-auto text-center md:text-left z-10 relative">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-full bg-amber-500/5 text-[#B8860B] flex-shrink-0">
            <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
          </span>
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            {language === 'ko'
              ? '에이스 케이 클리닉은 환자의 사생활 권리와 기밀 유지를 최우선 가치로 고집합니다. 모든 검증 실명 후기는 사전 동의 하에 제한적으로 작성 및 등재되며, 상세 원본 일지는 물리 통제 금고에 극비리에 보관됩니다.'
              : 'Every testimonial is obtained following strictly signed HIPAA-compliant disclosure waivers. Real identity files remain physically locked away inside the medical archive vaults.'}
          </p>
        </div>
      </div>

    </div>
  );
}
