import { useState, useEffect } from 'react';
import { Service, Specialist } from '../types';

export type Language = 'en' | 'ko';

const LANGUAGE_KEY = 'acek_active_language';

export const getLanguage = (): Language => {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return (stored === 'ko' ? 'ko' : 'en') as Language;
};

export const setLanguage = (lang: Language) => {
  localStorage.setItem(LANGUAGE_KEY, lang);
  window.dispatchEvent(new Event('acek_language_update'));
};

// UI Dictionary lookup
export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Nav & Controls
    home: 'Home',
    services: 'Treatments',
    results: 'Results',
    contact: 'Contact Us',
    bookPlacement: 'Book Placement',
    exploreTreatments: 'Explore Treatments &rarr;',
    inquireSession: 'Inquire & Book Session',
    admissionsBanner: 'ACE K CLINIC Admissions — 2026 Season Open',
    
    // Highlights
    highlightsTitle1: 'Undetectable Enhancements',
    highlightsDesc1: 'Carefully balanced dermal therapy designed specifically to preserve dynamic facial markers, strictly avoiding synthetic over-corrections.',
    highlightsTitle2: 'Elite Medical Licensing',
    highlightsDesc2: 'All treatments are formulated and directly supervised under Dr. Choi Sung Su and Registered Nurses using FDA cleared devices.',
    highlightsTitle3: 'Tailored Treatment Suites',
    highlightsDesc3: 'Indulge with luxurious, slow-paced appointments inside noise-insulated therapy lounges for full physical privacy.',
    
    // Titles & Sections
    executiveAddress: 'EXECUTIVE ADDRESS',
    founderOffice: 'FOUNDER OFFICE',
    chiefDirector: 'CHIEF MEDICAL DIRECTOR',
    medicalIntegrity: 'MEDICAL INTEGRITY',
    exquisiteMenu: 'ACE K CLINIC EXQUISITE MENU',
    curatedRestorations: 'Curated Restorations & Formulations',
    menuDesc: 'Meticulously planned clinical procedures designed to deliver undetectable results, using elite skin components and state-of-the-art precision tools.',
    splitLookbook: 'Split Lookbook',
    classicCards: 'Classic Cards',
    selectTreatment: 'SELECT A TREATMENT:',
    viewBenefits: 'View Benefits',
    hideDetails: 'Hide Details',
    bookNow: 'Book Now',
    scheduleTreatment: 'Schedule Professional Session',
    durationMinutes: 'Minutes Session',
    primaryLocation: 'PRIMARY LOCATION',
    procedureCompleted: 'PROCEDURE COMPLETED',
    timeframe: 'REFLECTIVE TIMEFRAME',
    verifiedRecognition: 'VERIFIED RECOGNITION',
    trustNotice: 'Every testimonial is obtained following strictly signed HIPAA-compliant disclosure waivers. Real identity files remain physically locked away inside the medical archive vaults.',
    faqTitle: 'Client Inquiries & Accommodations FAQ',
    faqSub: 'Answers to essential questions regarding our private lounge security, booking policies, and luxury care standards.',
    bookTitle: 'Reserve Private Consultation Suite',
    bookSub: 'Secure your customized clinical treatment. Choose your dedicated clinical specialist and pick a quiet time slot.',
    contactTitle: 'Direct Coordinates & Private Lounges',
    contactSub: 'Reach our clinical concierge team or locate our quiet grand pavilion suites.',
    adminConsole: 'ACE K CLINIC Console',
    authorized: 'Authorized',
    backToTop: 'Return to Top',
  },
  ko: {
    // Nav & Controls
    home: '인사말',
    services: '시술 프로그램',
    results: '시술 결과',
    contact: '오시는 길',
    bookPlacement: '프라이빗 예약',
    exploreTreatments: '시술 목록 탐색하기 &rarr;',
    inquireSession: '상담 및 세션 안내 받기',
    admissionsBanner: 'ACE K CLINIC 신규 멤버십 접수 개시 — 2026 시즌',
    
    // Highlights
    highlightsTitle1: '자연스러운 완벽함',
    highlightsDesc1: '부자연스러움을 완전히 배제하고 개개인의 자연스러운 표정 특징과 안면 표상 마커를 해치지 않도록 조율된 디테일 세션.',
    highlightsTitle2: '최정상급 의료 전문성',
    highlightsDesc2: '검증된 미국 FDA 승인 기기만을 엄선하여 최성수 대표원장 및 숙련된 전담 사간호사의 책임 주도 하에 세심하게 케어합니다.',
    highlightsTitle3: '음향 차음 상담 스위트',
    highlightsDesc3: '소음이 완전히 차단되는 개인 고급 테라피 스위트에서 여유롭고 안락하게 1:1 맞춤형 웰니스 과정을 누려보세요.',
    
    // Titles & Sections
    executiveAddress: '최고경영자 서한',
    founderOffice: '설립자 집무실',
    chiefDirector: '원장 약력',
    medicalIntegrity: '메디컬 인테그리티',
    exquisiteMenu: 'ACE K CLINIC 프리미엄 품격 메뉴',
    curatedRestorations: '자연스러운 조화를 위한 맞춤형 복원 포뮬러',
    menuDesc: '최고의 유효 원료와 첨단 마이크로 정밀 기기를 조화롭게 융합하여 어색하지 않은 자연스러운 광채와 입체감을 선사하는 트리트먼트.',
    splitLookbook: '클래식 룩북',
    classicCards: '그리드 멀티 레이아웃',
    selectTreatment: '시술 선택하기:',
    viewBenefits: '효과 상세 보기',
    hideDetails: '상세정보 접기',
    bookNow: '예약 신청',
    scheduleTreatment: '1:1 방문 상담 신청하기',
    durationMinutes: '분 세션 소요',
    primaryLocation: '내원 경로',
    procedureCompleted: '시술 프로그램',
    timeframe: '진단 분석 기간',
    verifiedRecognition: '공식 임증 후기',
    trustNotice: '고객 신원과 기밀 보장을 최우선으로 선서합니다. 모든 시술 전후 비교 및 후기는 고객의 서명날인된 고지 동의 하에 제한적으로 게시됩니다.',
    faqTitle: '고객 문의 및 안내 사항 (FAQ)',
    faqSub: '프라이빗 라운지 보안 체계, 슬로우 예약 정책 및 최고급 치료 안전 기준 등에 관한 핵심 정보를 제공합니다.',
    bookTitle: '원원 상담 스위트 개인 룸 신청',
    bookSub: '당신의 완벽한 케어를 위해 전담 피부 전문의 리스트 및 원하는 평온한 시간대를 맞춤 예약하세요.',
    contactTitle: '라운지 공식 안내 및 다이렉트 좌표',
    contactSub: '클리닉 로비의 수석 리셉셔니스트 또는 오셔닉 그랜드 파빌리온의 스위트 입구에 문의하세요.',
    adminConsole: 'ACE K CLINIC 인트라넷 제어 콘솔',
    authorized: '정식 사용자 확인됨',
    backToTop: '맨 위로 이동',
  }
};

// Bilingual content for dynamic sections
export const TRANSLATED_GENERAL: Record<Language, {
  clinicName: string;
  heroTitle: string;
  heroSubTitle: string;
  phone: string;
  email: string;
  address: string;
  ceoMessageTitle: string;
  ceoMessageSubtitle: string;
  ceoParagraph1: string;
  ceoParagraph2: string;
  actualCeoName: string;
  actualCeoSubtitle: string;
  actualCeoParagraph1: string;
  actualCeoParagraph2: string;
}> = {
  en: {
    clinicName: 'ACE K CLINIC',
    heroTitle: 'Subtle Restorations & Aesthetic Integrity',
    heroSubTitle: 'Welcome to a private space where non-surgical cosmetics is elevated to a high fine-art. We formulate subtle treatments tailored to enhance your dynamic structural lines.',
    phone: '+855 (0) 17 827 898 / +855 (0) 69 827 898',
    email: 'acekservice.kh@gmail.com',
    address: '№ 592, St 592, First Floor, TK Olive Building, Sangkat Boeung Kak II, Khan Toul Kork, Phnom Penh, Cambodia',
    ceoMessageTitle: 'Dr. Choi Sung Su, MD',
    ceoMessageSubtitle: 'Our Commitment to Undetectable Restoration',
    ceoParagraph1: 'We believe that top-tier aesthetics is completely invisible. The goal is never to look "done," but rather to look wonderfully rested, structurally balanced, and refreshed. Each micro-dose injectables pattern or premium laser setting is chosen in alignment with your natural skin architecture.',
    ceoParagraph2: 'By preserving your unique motion characteristics and respecting the real anatomy underneath, we deliver restorations that stand up to the test of high-resolution digital cameras and direct morning sunlight.',
    actualCeoName: 'Mr. KANG SEUNG WEON',
    actualCeoSubtitle: 'The Vision of Elevating the Standard of Wellness',
    actualCeoParagraph1: 'Our vision for ACE K Clinic was born out of a desire to create a sanctuary where state-of-the-art non-surgical medicine meets unparalleled client hospitality. We believe that professional aesthetic care should not feel clinical, sterile, or rushed. It must be an immersive experience of absolute safety, extreme precision, and tailored high-end wellness.',
    actualCeoParagraph2: 'We have intentionally designed our private lounges and acoustic sound barriers to ensure complete physical privacy and absolute discretion. Your comfort, your trust, and your exquisite results are the cornerstones of our institution.',
  },
  ko: {
    clinicName: '에이스 케이 클리닉 (ACE K CLINIC)',
    heroTitle: '지나치지 않는 완벽함과 피부 본연의 투명함',
    heroSubTitle: '비수술적 페이셜 디자인과 메디컬 에스테틱을 일상 속 심오한 안식처로 끌어올리는 극상의 VIP 스페이스에 오신 것을 환영합니다. 자연스러운 고유의 인상 선을 복원하겠습니다.',
    phone: '+855 (0) 17 827 898 / +855 (0) 69 827 898',
    email: 'acekservice.kh@gmail.com',
    address: '№ 592, St 592, First Floor, TK Olive Building, Sangkat Boeung Kak II, Khan Toul Kork, Phnom Penh, Cambodia',
    ceoMessageTitle: '최성수 원장 (Dr. Choi Sung Su, MD)',
    ceoMessageSubtitle: '인위적이지 않고 자연스러운 에스테틱을 향한 자부심',
    ceoParagraph1: '최고 수준의 안티에이징 기술이란 시술을 한 티가 나지 않도록 고도로 숨겨진 정밀함에 있습니다. 목표는 성형적인 흔적을 보이는 것이 아니라 자연스럽게 숙면을 취한 듯 한층 생기를 찾고 균형이 정밀하게 회복된 만족감에 있습니다. 주입되는 필러의 미량 미세 분배 시스템과 고정밀 레이저 요법은 환자의 피부 두께와 해부학적 구조를 철저히 기준하여 진행됩니다.',
    ceoParagraph2: '환자가 본연의 성격이나 개성에 따라 웃거나 찡그릴 때의 동적 안면 근육의 수축 특성까지 세심히 고려함으로, 밝은 오전의 야외 채광이나 초고휘도 디지털 카메라 앵글 앞에서도 완전한 안심과 품격을 보장합니다.',
    actualCeoName: '강승원 (Mr. KANG SEUNG WEON)',
    actualCeoSubtitle: '의료 안전성과 5성급 호스피탈리티의 차원 높은 결합',
    actualCeoParagraph1: '우리가 생각하는 에이스 케이 클리닉의 지향점은 멸균을 넘는 예술적 미학과 한 분만을 극진히 모시는 웰니스 케어 체계에 있습니다. 치료와 상담이란 단순히 정해진 시간에 차갑고 황폐하게 조급히 밀어내는 과정이어서는 안 됩니다. 최상의 감각적 호사로 거듭나야 합니다.',
    actualCeoParagraph2: '소수 회원제 스케줄 운영 모델을 고집하며, 모든 상담실 벽과 트리트먼트 개인 전실 내부에는 높은 데시벨 차음 음향 모듈을 빌트인하여 철저하게 비밀이 지켜집니다. 귀하의 기밀과 소중한 인상의 완벽성만을 서포트합니다.',
  }
};

// Bilingual treatments content
export const TRANSLATED_SERVICES: Record<Language, Service[]> = {
  en: [
    {
      id: 'filler-01',
      name: 'Signature Lip Sculpting & Hydration',
      category: 'injectables',
      description: 'Custom hyaluronic acid delivery focusing on optimal ratio balance, crisp vermilion border Definition, and deep volume hydration.',
      duration: 45,
      price: 650,
      benefits: ['Subtle, detectable volume enhancement', 'Smoothened lip lines', 'Crisply defined borders', 'Premium safety profiles'],
      idealFor: 'Dull lips, volume depletion, asymmetrical contours'
    },
    {
      id: 'botox-02',
      name: 'Precision Expression Smoothing',
      category: 'injectables',
      description: 'Micro-dose botulinum toxin therapy meticulously targeting forehead lines, crow’s feet, and frown furrows while preserving natural charisma.',
      duration: 30,
      price: 420,
      benefits: ['Relaxed, high-refresh display', 'Minimizes static furrow lines', 'Preserves natural forehead expression', 'Quick lunch-break procedure'],
      idealFor: 'Dynamic expression wrinkles, brow tenseness'
    },
    {
      id: 'contour-03',
      name: 'Chin & Jawline Architecture',
      category: 'injectables',
      description: 'High-density deep dermal fillers designed to elongate chin projections and define structurally sharp angles along the jawline.',
      duration: 60,
      price: 850,
      benefits: ['Stronger chin projection', 'Sleek, shadow-defining jawline lines', 'Provides structural support', 'Instantly visible contours'],
      idealFor: 'Soft lower face profile, weak chin structure'
    },
    {
      id: 'skin-01',
      name: '24K Gold Micro-Infusion Facial',
      category: 'skin',
      description: 'An ultra-exclusive cocktail of pure hyaluronic skin-boosters, vitamins, and nano-toxins micro-channeled through fine 24-karat gold needles.',
      duration: 75,
      price: 480,
      benefits: ['Shrinks dilated skin pores', 'Brightens uneven tone instantly', 'Deep hydration and glassy shine', 'Pain-free, soothing hydration treatment'],
      idealFor: 'Large pores, dry skin, dull complexion'
    },
    {
      id: 'skin-02',
      name: 'Bio-Growth Factor Microneedling',
      category: 'skin',
      description: 'Medical-grade adjustable microneedling infused with concentrated human growth factors and peptides to trigger heavy collagen repair.',
      duration: 60,
      price: 350,
      benefits: ['Accelerated dermal collagen renew', 'Repairs deep scars and texture holes', 'Substantial elasticity increase', 'Even, glowing skin thickness'],
      idealFor: 'Acne scarring, uneven skin texture, fine wrinkles'
    },
    {
      id: 'laser-01',
      name: 'PicoGlow Nano-Laser Toning',
      category: 'laser',
      description: 'Advanced picosecond laser sessions targeting deep melanin blocks to shatter pigment patches, evening out tone with zero pain or down-time.',
      duration: 40,
      price: 390,
      benefits: ['Shatters hyperpigmentation spots', 'Addresses localized melasma', 'Refines cellular turnover speed', 'Safe for all dark/light skin types'],
      idealFor: 'Dullness, pigmentation marks, freckles, melasma'
    },
    {
      id: 'laser-02',
      name: 'Fractional CO2 Skin Resurfacing',
      category: 'laser',
      description: 'High-depth micro-beam laser vaporizes tiny skin columns to force dramatic, deep restructuring and smooth out deep acne pitting scars.',
      duration: 90,
      price: 790,
      benefits: ['Unbelievable flat-smoothing of scars', 'Substantial wrinkle reduction', 'Complete skin resurfacing', 'Tightens loose dermis matrix'],
      idealFor: 'Severe acne scars, deep-set wrinkles, age spot damage'
    },
    {
      id: 'body-01',
      name: 'CryoSlim Thermal Lipolysis',
      category: 'body',
      description: 'Non-invasive fat freezing targeting persistent fat cells in stubborn sections. The destroyed fat is naturally flushed by the lymphatic system.',
      duration: 60,
      price: 550,
      benefits: ['Eliminates up to 25% fat cells in area', 'No downtime, completely non-surgical', 'Symmetric, precision contours', 'Permanently removes treated cells'],
      idealFor: 'Persistent regional fat deposits, belly, flanks'
    }
  ],
  ko: [
    {
      id: 'filler-01',
      name: '시그니처 미세 입술 드로잉 & 수분 볼륨',
      category: 'injectables',
      description: '최적의 대칭 비율 분배 및 입술 산 디자인과 고밀도 물광 히알루론 테라피로 우아하고 도톰한 라인을 그리는 미량 침술 요법.',
      duration: 45,
      price: 650,
      benefits: ['투명하고 이물감 없는 속볼륨 개선', '세로 주름을 가라앉히는 깊은 입술 수분막', '한올한올 돋보이는 테두리 입체화', '고급 오가닉 메디컬 테스트 통과 특허 성분'],
      idealFor: '볼륨이 소실되고 찢어지기 쉬우며 주름이 깊은 비대칭 입술'
    },
    {
      id: 'botox-02',
      name: '페이스 내추럴 주름 근육 완화 세션',
      category: 'injectables',
      description: '근육 근막층 마이크로 보톨리눔 주입으로 이마 라인, 양 미간 주름과 눈가 지지 근육을 정교하게 이완하여 인자하고 환한 안색 복원.',
      duration: 30,
      price: 420,
      benefits: ['어색하지 않게 눈을 마주하고 표정 짓는 감각', '만성화되기 쉬운 중력 주름 각인 차단', '안면 신경 방향을 엄밀히 존중', '점심 시간에 간편히 진행하는 런치 세션'],
      idealFor: '나이 들어 보이고 화난 근육, 이마 가로 주름 라인 완화'
    },
    {
      id: 'contour-03',
      name: '턱 리프팅 아웃라인 & 아키텍처 디자인',
      category: 'injectables',
      description: '초미세 심부 주사 바늘을 사용해 처진 안면 연부 조직을 정교하게 고정하고 턱 선 지지 각도를 시각적으로 수축 및 긴밀하게 고정.',
      duration: 60,
      price: 850,
      benefits: ['얼굴이 더욱 작고 선명해지는 턱선 투사', '자연스러운 쉐이딩 연출을 통한 귀밑 턱 각도 디테일', '근육 수축 현상과 노화 탄력 저하 상쇄', '시술 마감 이후 곧바로 체감하는 결과 만족도'],
      idealFor: '흐릿해진 귀밑 이중턱 가두리, 또렷한 임체 프로필을 꿈꾸는 분'
    },
    {
      id: 'skin-01',
      name: '24K 프리미엄 골드 하이드레이션',
      category: 'skin',
      description: '최상 연구소산 히알루론 스킨부스터 6종 조합, 노화방지 활성비타민 앰플과 진피 재생 성분을 24K 순금 마이크로 아큐침 공법으로 깊이 유도.',
      duration: 75,
      price: 480,
      benefits: ['피부 모공 밀도 리액터 축소', '화사하게 뿜어져 나오는 극도의 안색 투명감', '조밀하게 차오르는 콜라겐 광채 수분 피막', '트러블 위험 없이 부드러운 스페셜 영양 리셋'],
      idealFor: '모공이 두드러지고 땀구멍이 깊으며 푸석푸석한 피부 리뉴얼'
    },
    {
      id: 'skin-02',
      name: '줄기세포 성장인자 활성 테라피 (MTS / Microneedling)',
      category: 'skin',
      description: '정밀 하이드로 마이크로니들 헤드를 활용해 피부 진피 주위 채널을 자극하고 세포 성장 단백질과 고분자 텝타이드를 무통증 직접 인퓨전.',
      duration: 60,
      price: 350,
      benefits: ['인체 친화 신생 유기 콜라겐 고효율 합성', '여드름 자국 및 피부 표층 움푹 패인 공간 정상 복원', '탄력 스프링을 강화하는 탄성 유도', '피부 밀도 전반의 긴밀한 장벽 강화'],
      idealFor: '오래된 여드름 안색 흉터, 표면 각질층 요철, 얇고 푸석한 결'
    },
    {
      id: 'laser-01',
      name: '피코글로우(PicoGlow) 나노 색소 토닝',
      category: 'laser',
      description: '첨단 1조분의 1초 펄스 레이저빔을 방출해 기미, 주근깨, 잡티를 유발하는 멜라닌 중심 층을 아주 잘게 파편화하여 전반적인 맑은 안색을 회복합니다.',
      duration: 40,
      price: 390,
      benefits: ['주변 피하 정상 세포 손상 방지 레이저 빔', '얼룩덜룩하고 거친 톤 고르게 미백 정화', '속건조 색소 주위 세포 복합 정화 작용', '시술 직후 홍조나 화끈거림 없이 안전하게 컴백'],
      idealFor: '부분 잡티, 뺨 주변 불평등한 멜라닌 점포, 칙칙한 각화 안색'
    },
    {
      id: 'laser-02',
      name: 'Fractional CO2 표피 조각술 & 진피 재생',
      category: 'laser',
      description: '마이크로 미세 광학 빔이 모공 중심 세포층을 순간 기화시켜 인체 방어 기전을 가동해 신선하고 깨끗한 새살이 돋아나도록 촉진하는 전문 요법.',
      duration: 90,
      price: 790,
      benefits: ['모공 수축 및 요철과 피지선 정화 작용 극대화', '굵은 미세 주름을 차근차근 펴고 영양 세포 충전', '결 점 제거 및 스킨 턴오버 세포 주기 강제 수축', '느슨해져 축 처진 얼굴 윤곽선의 극대 타이트닝'],
      idealFor: '여드름으로 고르지 못한 부위가 넓게 퍼져 안면 밸런스를 개선하고자 하는 분'
    },
    {
      id: 'body-01',
      name: '크라이오슬림(CryoSlim) 저온 분해 린 메디라인',
      category: 'body',
      description: '시술용 초저온 석션 컵을 피하 비셀 영역에 부착해 선택적으로 냉각 파괴를 유도하여 군살 세포를 요하 수분을 통해 배출하는 타겟 리디자인.',
      duration: 60,
      price: 550,
      benefits: ['해당 타겟 유효 체지방 층 세포의 25% 이상 감축 촉진', '안전 실리콘 가이드 패치로 피부 손상 제로에 도달', '좌우 체형 골반 비례 정밀 바디 조각술', '인위적 통증이나 부작용 없이 순차 배출 요도'],
      idealFor: '국소 축적된 러브핸들, 복부 심층 비대칭 부분 다이어트 실패군'
    }
  ]
};

// Bilingual specialists content
export const TRANSLATED_SPECIALISTS: Record<Language, Specialist[]> = {
  en: [
    {
      id: 'spec-01',
      name: 'Dr. Choi Sung Su, MD',
      role: 'Clinical Director & Lead Dermatologist',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
      bio: 'With over 12 years of clinical expertise, Dr. Choi is a board-certified dermatologist specializing in non-surgical facial sculpting and state-of-the-art laser therapies.',
      availability: 'Mon, Tue, Thu, Fri'
    },
    {
      id: 'spec-02',
      name: 'Samantha Vance, RN',
      role: 'Senior Aesthetic Injection Nurse',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=800',
      bio: 'Samantha is highly regarded for her subtle, artistic approach to dermal fillers and custom toxin layouts, ensuring natural, refreshed outcomes.',
      availability: 'Mon, Wed, Thu, Sat'
    },
    {
      id: 'spec-03',
      name: 'Marcus Sterling, LE',
      role: 'Clinical Dermal Specialist',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
      bio: 'Marcus focuses on deep dermal therapies, 24K Gold infusions, and clinical chemical peels tailored specifically to complex sensitive skin conditions.',
      availability: 'Tue, Wed, Fri, Sat'
    }
  ],
  ko: [
    {
      id: 'spec-01',
      name: '최성수 원장 (Dr. Choi Sung Su, MD)',
      role: '피부과학 전문 의료 디렉터 / 대표원장',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
      bio: '최 원장은 12년 이상의 풍부한 임상 노하우와 섬세한 미적 감각을 가진 보건복지 연수 전문 피부 전문의로서, 자연스러운 필러 리액티브 믹스 설계의 전문가입니다.',
      availability: '월, 화, 목, 금'
    },
    {
      id: 'spec-02',
      name: '사만다 밴스 (Samantha Vance, RN)',
      role: '수석 페이셜 주사 주동 수간호사',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=800',
      bio: '사만다 전담 선임 인젝터 간호사는 비대칭 보완 입술과 맞춤 턱 끝 드로잉 수술 기법에 탁월한 손끝 감각을 발판으로 높은 신뢰를 받고 있습니다.',
      availability: '월, 수, 목, 토'
    },
    {
      id: 'spec-03',
      name: '마커스 스털링 (Marcus Sterling, LE)',
      role: '임상 특수 피부 트리트먼트 스페셜리스트',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
      bio: '마커스 수석 테라피스트는 하이엔드 24K 순금 피부 청정 인퓨전 및 과민성 장벽 강화 앰플 케어를 주 설계하며, 원내 피부 방어력을 최고조로 조절합니다.',
      availability: '화, 수, 금, 토'
    }
  ]
};

// Custom React hook for component injection
export const useLanguage = () => {
  const [lang, setLang] = useState<Language>(getLanguage());

  useEffect(() => {
    const handleUpdate = () => {
      setLang(getLanguage());
    };
    window.dispatchEvent(new Event('acek_content_update')); // Trigger sync in others
    window.addEventListener('acek_language_update', handleUpdate);
    return () => window.removeEventListener('acek_language_update', handleUpdate);
  }, []);

  const translate = (key: string): string => {
    const section = UI_TRANSLATIONS[lang];
    if (section && section[key]) {
      return section[key];
    }
    // Deep fallback search inside the active translation block
    return UI_TRANSLATIONS['en'][key] || key;
  };

  const getTranslatedGeneral = () => {
    return TRANSLATED_GENERAL[lang];
  };

  const getTranslatedServices = () => {
    return TRANSLATED_SERVICES[lang];
  };

  const getTranslatedSpecialists = () => {
    return TRANSLATED_SPECIALISTS[lang];
  };

  return {
    language: lang,
    setLanguage,
    t: translate,
    getTranslatedGeneral,
    getTranslatedServices,
    getTranslatedSpecialists
  };
};
