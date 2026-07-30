import React, { useState, useEffect } from 'react';
import { useLanguage } from '../utils/language';
import { getProductsContent } from '../utils/content';
import { Product } from '../types';
import { openBookingPopup } from '../utils/booking';
import { 
  Sparkles, 
  Droplet, 
  Layers, 
  ShieldCheck, 
  ShoppingBag, 
  Compass, 
  Check, 
  ArrowRight,
  RefreshCw,
  ShoppingBag as CartIcon,
  Search,
  Eye,
  Activity,
  Heart
} from 'lucide-react';


// Diagnostic Quiz Data
interface QuizQuestion {
  id: number;
  questionEn: string;
  questionKo: string;
  options: {
    textEn: string;
    textKo: string;
    pointsFor: string; // product id this answer points to
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionEn: 'What is your primary skin restoration priority?',
    questionKo: '현재 시술 일정 중 가장 집중하여 채워야 할 피부 고민은?',
    options: [
      { textEn: 'Enhance cellular repair after intensive chemical or laser procedures', textKo: '프락셀, 스킨부스터 등 강력한 침습 시술 후 신속한 세포 재생', pointsFor: 'cellular-exosome-serum' },
      { textEn: 'Soothe severe dryness, tight sensation, or protective barrier flakiness', textKo: '시술 후 예민함, 거칠어짐, 피부 속당김 철저 차단 및 지질 보강', pointsFor: 'epidermal-lipid-cream' },
      { textEn: 'Fade dark spots, uneven hyperpigmentation, or general dullness', textKo: '기미, 주근깨, 색소 레이저 토닝 시술 후 기미 세포 증식 억제', pointsFor: 'ultra-mela-emulsion' },
      { textEn: 'Prevent dynamic uv aging and soothe thermal redness with mineral shield', textKo: '일상 중 자외선 차단 및 열 자국 차분한 진정 무기 보호막 원할 시', pointsFor: 'silky-physical-uv' }
    ]
  },
  {
    id: 2,
    questionEn: 'Describe your current skin texture baseline.',
    questionKo: '평소 피부 표면의 유수분 밸런스 상태는 어떤가요?',
    options: [
      { textEn: 'Severely dehydrated, flaky, or feeling physically tight after washing', textKo: '극심한 건성 단계로 각질이 겉돌고 세안 후 강한 당김을 느낌', pointsFor: 'epidermal-lipid-cream' },
      { textEn: 'Delicate, easily irritated, redness-prone, and reactive to touch', textKo: '매우 얇고 마찰 및 계절 변화에 수시로 붉어지는 완전 오예민형', pointsFor: 'cellular-exosome-serum' },
      { textEn: 'Mainly balanced or oily-tzone, with hyperpigmentation concerns', textKo: '유분기가 다소 있지만 칙칙한 잡티와 균일하지 못한 안색이 특징', pointsFor: 'ultra-mela-emulsion' },
      { textEn: 'Sensitive to chemical sunscreens (experiencing stinging eyes or raw spots)', textKo: '유기 자외선 차단 제제 적용 시 눈 시림 또는 트러블 반응 있음', pointsFor: 'silky-physical-uv' }
    ]
  },
  {
    id: 3,
    questionEn: 'Which texture finish does your skin embrace best?',
    questionKo: '피부에 닿아 흡수되었을 때 가장 만족스러운 마무리는?',
    options: [
      { textEn: 'High-absorption, lightweight, and dewy liquid feel', textKo: '잔여물 없이 깃털처럼 밀착되며 촉촉하게 스며드는 가벼운 수분액 성상', pointsFor: 'cellular-exosome-serum' },
      { textEn: 'Rich, moisture-locking cream blanket that prevents evaporation', textKo: '밤(Balm) 타입처럼 든든하고 보호막을 씌우는 도톰하고 풍부한 광택', pointsFor: 'epidermal-lipid-cream' },
      { textEn: 'Creamy milk consistency that spreads evenly with clinical finish', textKo: '매끄럽고 부드럽게 롤링되며 수분과 미백 유효 물질을 전하는 실키 로션', pointsFor: 'ultra-mela-emulsion' },
      { textEn: 'Velvety-soft physical shield that controls sebum and matches makeup', textKo: '모공을 보송하게 메우고 피지를 다독여주는 완벽 무기 자차 펄 피팅', pointsFor: 'silky-physical-uv' }
    ]
  }
];

interface OurProductProps {
  showPrices?: boolean;
}

export default function OurProduct({ showPrices = true }: OurProductProps) {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(getProductsContent());
  const [activeCategory, setActiveCategory] = useState<'all' | 'serum' | 'cream' | 'protection'>('all');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  
  // Custom interactive features
  const [cartInquiries, setCartInquiries] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState<string | null>(null);

  // Sync content dynamically when localStorage is modified by Admin portal
  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getProductsContent());
    };
    window.addEventListener('acek_content_update', handleUpdate);
    return () => window.removeEventListener('acek_content_update', handleUpdate);
  }, []);

  // Skincare finder quiz state
  const [quizStep, setQuizStep] = useState<number>(0); // 0 = not started, 1, 2, 3 = quiz, 4 = results
  const [quizScore, setQuizScore] = useState<Record<string, number>>({
    'cellular-exosome-serum': 0,
    'epidermal-lipid-cream': 0,
    'ultra-mela-emulsion': 0,
    'silky-physical-uv': 0,
  });
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  // Tab state within detail modal
  const [detailTab, setDetailTab] = useState<'ingredients' | 'usage'>('ingredients');

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const startQuiz = () => {
    setQuizScore({
      'cellular-exosome-serum': 0,
      'epidermal-lipid-cream': 0,
      'ultra-mela-emulsion': 0,
      'silky-physical-uv': 0,
    });
    setQuizStep(1);
    setRecommendedProduct(null);
  };

  const handleQuizAnswer = (pointsFor: string) => {
    const updatedScore = {
      ...quizScore,
      [pointsFor]: (quizScore[pointsFor] || 0) + 1
    };
    setQuizScore(updatedScore);

    if (quizStep < QUIZ_QUESTIONS.length) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate winner
      let maxScore = -1;
      let winnerId = 'cellular-exosome-serum'; // default fallback
      
      Object.keys(updatedScore).forEach(key => {
        if (updatedScore[key] > maxScore) {
          maxScore = updatedScore[key];
          winnerId = key;
        }
      });

      const matchedProd = products.find(p => p.id === winnerId) || products[0];
      setRecommendedProduct(matchedProd);
      setQuizStep(4); // Show winner screen
    }
  };

  const toggleCartInquiry = (productName: string) => {
    if (cartInquiries.includes(productName)) {
      setCartInquiries(cartInquiries.filter(item => item !== productName));
    } else {
      setCartInquiries([...cartInquiries, productName]);
    }
  };

  // Add selected products into the scheduling concern block directly
  const handleTransferToReservation = () => {
    if (cartInquiries.length === 0) return;
    
    // Convert inquiries into string
    const textToInsert = language === 'ko'
      ? `[원내 화장품 상담 포함 요청]: ${cartInquiries.join(', ')}`
      : `[Products Counseling Request]: ${cartInquiries.join(', ')}`;

    // Try finding the patient concerns text area manually or inject into session storage
    sessionStorage.setItem('acek_pref_products_inquiry', textToInsert);
    
    // Dispatch a custom event so BookingSystem updates immediately if mounted
    window.dispatchEvent(new Event('acek_add_product_inquiry'));

    // Open booking modal
    openBookingPopup();
  };

  const handleCopyProductInfo = (product: Product) => {
    const infoText = language === 'ko'
      ? `💊 원내 공식 처방 화장품: ${product.nameKo} (${product.volume}) - 성분: ${product.activeKo.join(', ')}`
      : `💊 ACE K Clinic Skin Formula: ${product.nameEn} (${product.volume}) - Actives: ${product.activeEn.join(', ')}`;

    navigator.clipboard.writeText(infoText).then(() => {
      setIsCopied(product.id);
      setTimeout(() => setIsCopied(null), 2200);
    });
  };

  return (
    <div className="space-y-8 py-2 scroll-mt-24" id="our-products-catalog">
      {/* SECTION HEADER */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/5 border border-[#D4AF37]/35 rounded-full py-1 px-3 text-[10px] font-mono tracking-widest text-[#B8860B] uppercase">
          <Droplet className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span>{language === 'ko' ? '스킨 레시피' : 'PHYSIOLOGICAL SKINCARE'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 tracking-wide font-medium leading-tight">
          {language === 'ko' ? 'ACE K 원내 독점 처방 제품' : 'Our Professional Clinical Products'}
        </h2>
        <div className="h-0.5 w-16 bg-[#D4AF37] mx-auto"></div>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans font-light">
          {language === 'ko' 
            ? '시술 이후 완벽 상처 재생과 유지를 극대화하기 위해 ACE K 연구조직이 정밀 처방한 스페셜 코스메슈티컬 라인업입니다.'
            : 'Meticulously crafted formulas containing clinically-proven active ingredients to strengthen the cellular skin mantle, protect dynamic recovery, and restore absolute radiance.'}
        </p>
      </div>

      {/* DYNAMICS FILTERS & INTERACTIVE COUNTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto border-b border-gray-200 pb-5">
        {/* Horizontal Category Pill Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'serum', 'cream', 'protection'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest transition-all cursor-pointer select-none outline-none ${
                activeCategory === cat
                  ? 'bg-[#B8860B] text-white shadow-sm font-semibold'
                  : 'bg-gray-100/70 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900'
              }`}
            >
              {cat === 'all' && (language === 'ko' ? '전체 에디션' : 'All Formulas')}
              {cat === 'serum' && (language === 'ko' ? '재생 세럼 및 앰플' : 'Serums & Ampoules')}
              {cat === 'cream' && (language === 'ko' ? '포스트 리피드 크림' : 'Recovery Creams')}
              {cat === 'protection' && (language === 'ko' ? '자외선 에이징 차단제' : 'Sun Protective')}
            </button>
          ))}
        </div>

        {/* Prescription basket indicator if user added elements */}
        {cartInquiries.length > 0 && (
          <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 px-4 py-2.5 rounded-xl animate-fadeIn">
            <span className="text-[11px] text-[#B8860B] font-sans font-medium">
              🛒 {language === 'ko' ? `${cartInquiries.length}개 처방 상담 항목 누적됨` : `${cartInquiries.length} items targeted`}
            </span>
            <button
              onClick={handleTransferToReservation}
              className="px-3.5 py-1.5 bg-[#B8860B] hover:bg-[#996F04] text-white rounded-lg text-[9px] font-mono font-bold tracking-widest uppercase transition-all shadow-sm cursor-pointer"
            >
              {language === 'ko' ? '예약서 연동하기' : 'Link with Booking'}
            </button>
          </div>
        )}
      </div>

      {/* CORE PRODUCTS PHOTO-DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
        {filteredProducts.map((product) => {
          const isSelectedInCart = cartInquiries.includes(language === 'ko' ? product.nameKo : product.nameEn);
          
          return (
            <article 
              key={product.id} 
              className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row group"
            >
              {/* Product Visual Container */}
              <div className="w-full sm:w-2/5 aspect-square relative bg-neutral-100 flex-shrink-0 overflow-hidden">
                <img 
                  src={product.imgUrl} 
                  alt={language === 'ko' ? product.nameKo : product.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Micro category tag */}
                <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-sm text-white font-mono text-[8.5px] uppercase tracking-widest px-2.5 py-1 rounded">
                  {product.category}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 sm:opacity-100" />
              </div>

              {/* Product Content Specifications */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-serif text-lg text-gray-800 font-semibold group-hover:text-[#B8860B] transition-colors leading-tight">
                        {language === 'ko' ? product.nameKo : product.nameEn}
                      </h3>
                      <p className="text-[10px] text-[#B8860B] font-mono leading-relaxed mt-0.5">
                        {language === 'ko' ? product.subKo : product.subEn}
                      </p>
                    </div>

                    {/* Price if visible */}
                    {showPrices && (
                      <span className="font-mono text-xs font-semibold text-[#B8860B] bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10 flex-shrink-0">
                        {language === 'ko' 
                          ? `₩${product.priceKrw.toLocaleString()}` 
                          : `$${product.priceUsd}`}
                      </span>
                    )}
                  </div>

                  <p className="text-[11.5px] text-gray-500 font-sans leading-relaxed font-light line-clamp-3">
                    {language === 'ko' ? product.descKo : product.descEn}
                  </p>
                </div>

                {/* Secondary data container (collapsible look / details preview) */}
                <div className="bg-[#FAF9F5] border border-gray-150 p-3 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">
                    <span>{language === 'ko' ? '포뮬라 고유 규격' : 'FORMULA DATA'}</span>
                    <span>{product.volume}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-mono font-bold text-gray-600 block">{language === 'ko' ? '주요성분:' : 'Key Actives:'}</span>
                    <p className="text-[10px] text-gray-500 font-sans leading-tight mt-0.5">
                      {language === 'ko' ? product.activeKo.join(' • ') : product.activeEn.join(' • ')}
                    </p>
                  </div>
                </div>

                {/* CTA Action Panel */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedProductDetails(product);
                      setDetailTab('ingredients');
                    }}
                    className="p-2 sm:px-3 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
                    title="View detailed application steps"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === 'ko' ? '전성분 및 적용법' : 'Full Specs'}</span>
                  </button>

                  <button
                    onClick={() => toggleCartInquiry(language === 'ko' ? product.nameKo : product.nameEn)}
                    className={`flex-1 py-2 rounded-lg text-[10.5px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border cursor-pointer select-none outline-none ${
                      isSelectedInCart
                        ? 'bg-emerald-650 hover:bg-emerald-750 text-white border-emerald-600 shadow-sm'
                        : 'bg-white hover:bg-amber-500/5 text-gray-700 hover:text-[#B8860B] border-gray-250 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isSelectedInCart ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} transition-all`} />
                    {isSelectedInCart 
                      ? (language === 'ko' ? '상담 리스트 추가됨' : 'Inquiry Selected')
                      : (language === 'ko' ? '원내 상담 추가' : 'Inquire Prescription')}
                  </button>

                  <button
                    onClick={() => handleCopyProductInfo(product)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-lg text-[10px] font-mono transition-all cursor-pointer focus:outline-none flex items-center justify-center"
                    title="Copy details specs"
                  >
                    {isCopied === product.id ? (
                      <span className="text-[8px] font-bold text-emerald-600">Copied!</span>
                    ) : (
                      <CartIcon className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* FULL IN-DEPTH COMPREHENSIVE MODAL FOR SINGLE PRODUCT */}
      {selectedProductDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header portion */}
            <div className="p-5 border-b border-gray-150 bg-[#FAF9F5] flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-[#B8860B] uppercase tracking-widest">{selectedProductDetails.volume}</span>
                <h3 className="font-serif text-lg text-gray-800 font-bold mt-0.5">
                  {language === 'ko' ? selectedProductDetails.nameKo : selectedProductDetails.nameEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="p-1 px-2 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Segment selectors */}
            <div className="flex border-b border-gray-150 text-xs font-mono">
              <button
                onClick={() => setDetailTab('ingredients')}
                className={`flex-1 py-3 text-center transition-all ${
                  detailTab === 'ingredients'
                    ? 'border-b-2 border-[#D4AF37] text-[#B8860B] font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {language === 'ko' ? '활성 효능 및 활성원료' : 'Bio-Active Agents'}
              </button>
              <button
                onClick={() => setDetailTab('usage')}
                className={`flex-1 py-3 text-center transition-all ${
                  detailTab === 'usage'
                    ? 'border-b-2 border-[#D4AF37] text-[#B8860B] font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {language === 'ko' ? '원내 권장 투약 가이드' : 'Usage & Clinical Protocols'}
              </button>
            </div>

            {/* Scrollable details panel */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm font-sans text-gray-600">
              {detailTab === 'ingredients' ? (
                <div className="space-y-4">
                  <p className="italic text-gray-500 leading-relaxed text-xs">
                    {language === 'ko' 
                      ? '본 제품은 민감한 재생 피부 보호막에 염증 유발 자극을 주는 인공 시트러스 오일, 합성 파라벤, 아보벤존 등의 유해 보존 화학 성분을 일체 배제하여 알러지 유발을 억제합니다.'
                      : 'ACE K physiological items are formulated without artificial masking oils, irritating parabens, or complex synthetic fillers to guarantee absolute skin barrier compatibility.'}
                  </p>
                  
                  <div className="space-y-2">
                    <h5 className="font-mono text-[10px] font-bold text-gray-800 uppercase tracking-wider">{language === 'ko' ? '주요 처방 복합체' : 'PRESCRIPTION CHEMISTRY'}</h5>
                    <ul className="space-y-2">
                      {(language === 'ko' ? selectedProductDetails.activeKo : selectedProductDetails.activeEn).map((act, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs text-gray-600 bg-amber-500/5 p-2 rounded-lg border border-amber-500/5">
                          <Check className="w-3.5 h-3.5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 leading-relaxed">
                  <div className="flex gap-2.5 items-start bg-neutral-50 p-4 rounded-xl border border-gray-150">
                    <Activity className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-mono text-xs font-bold text-gray-800 uppercase tracking-widest">{language === 'ko' ? '적용 순서 및 방법' : 'HOW TO CO-APPLY'}</h5>
                      <p className="text-gray-500 text-xs mt-1.5">
                        {language === 'ko' ? selectedProductDetails.usageKo : selectedProductDetails.usageEn}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 font-sans leading-normal">
                    {language === 'ko' 
                      ? '💡 시술 직후 붉은 염증과 붓기가 활성화되어 있는 동안에는 화장솜을 이용한 마찰 롤링을 일체 삼가하고, 깨끗이 소독된 손끝 마디를 이용해 가볍게 얹히듯 마감해 주십시오.'
                      : '💡 During the initial 48-hour localized heat window following fractional therapies, avoid cotton-pad friction entirely. Smooth the emulsion/cream directly via sterilized finger pads.'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer close button */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                {language === 'ko' ? '확인 완료' : 'Close Specs'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
