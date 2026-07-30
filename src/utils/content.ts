import { Service, GalleryItem, Product, Booking } from '../types';
import { CLINIC_SERVICES, RESULTS_GALLERY } from '../data';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';

export interface ClinicGeneralContent {
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
  ceoImage?: string;
  // Actual Co-Founder & CEO fields
  actualCeoName: string;
  actualCeoSubtitle: string;
  actualCeoParagraph1: string;
  actualCeoParagraph2: string;
  actualCeoImage?: string;
  heroImages?: string[];
  web3formsKey?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  logoUrl?: string;
  showPrices?: boolean;
}

export const DEFAULT_GENERAL_CONTENT: ClinicGeneralContent = {
  clinicName: 'ACE K CLINIC',
  heroTitle: 'Subtle Restorations & Aesthetic Integrity',
  heroSubTitle: 'Welcome to a private space where non-surgical cosmetics is elevated to a high fine-art. We formulate subtle treatments tailored to enhance your dynamic structural lines.',
  phone: '+855 (0) 17 827 898 / +855 (0) 69 827 898',
  email: 'acekservice.kh@gmail.com',
  address: '№ 592, St 592, First Floor, TK Olive Building, Sangkat Boeung Kak II, Khan Toul Kork, Phnom Penh, Cambodia',
  logoUrl: '',
  showPrices: false,
  ceoMessageTitle: 'Dr. Choi Sung Su, MD',
  ceoMessageSubtitle: 'Our Commitment to Undetectable Restoration',
  ceoParagraph1: 'We believe that top-tier aesthetics is completely invisible. The goal is never to look "done," but rather to look wonderfully rested, structurally balanced, and refreshed. Each micro-dose injectables pattern or premium laser setting is chosen in alignment with your natural skin architecture.',
  ceoParagraph2: 'By preserving your unique motion characteristics and respecting the real anatomy underneath, we deliver restorations that stand up to the test of high-resolution digital cameras and direct morning sunlight.',
  ceoImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
  actualCeoName: 'Mr. KANG SEUNG WEON',
  actualCeoSubtitle: 'The Vision of Elevating the Standard of Wellness',
  actualCeoParagraph1: 'Our vision for ACE K Clinic was born out of a desire to create a sanctuary where state-of-the-art non-surgical medicine meets unparalleled client hospitality. We believe that professional aesthetic care should not feel clinical, sterile, or rushed. It must be an immersive experience of absolute safety, extreme precision, and tailored high-end wellness.',
  actualCeoParagraph2: 'We have intentionally designed our private lounges and acoustic sound barriers to ensure complete physical privacy and absolute discretion. Your comfort, your trust, and your exquisite results are the cornerstones of our institution.',
  actualCeoImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
  heroImages: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1800',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1800',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1800'
  ],
  web3formsKey: '',
  telegramBotToken: '8862166334:AAFOLcTnkKHMVgbk8sECiq7fSMEkl76mn7U',
  telegramChatId: '-5321786477'
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'cellular-exosome-serum',
    category: 'serum',
    nameEn: 'ACE K Cellular Regen Exosome Serum',
    nameKo: 'ACE K 셀룰러 리젠 엑소좀 세럼',
    subEn: 'Stem Cell Stemmed Exosomes & Bio-peptides',
    subKo: '고이동성 줄기세포 유래 엑소좀 & 바이오 펩타이드',
    descEn: 'A high-potency clinical formulation with 15% active exosomes to rapidly restore cellular cohesion, accelerate cellular migration, and return youthful radiance following intensive laser procedures.',
    descKo: '15% 고농축 정제 엑소좀과 멀티 펩타이드 복합체를 배합하여 시술 후 지친 피부의 미세 장벽 세포 재생을 가속화하고 세련된 물광 볼륨을 복원해주는 하이엔드 복원 영양 세럼.',
    priceUsd: 140,
    priceKrw: 185000,
    volume: '30 ml / 1.01 fl. oz.',
    activeEn: ['15% Human Stem-Cell Derived Exosomes', '1.5% Copper Tripeptide-1', 'Niacinamide USP & Adenosine'],
    activeKo: ['인체 지방 세포 유래 정제 엑소좀 15%', '카퍼 트라이펩타이드-1 1.5%', '식약처 공인 이중기능성 나이아신아마이드 & 아데노신'],
    usageEn: 'Apply 3-4 drops morning and evening to fully cleansed face. Gently press into sensitive areas. Excellent post-fractional laser or microneedling care.',
    usageKo: '아침, 저녁 세안 후 토너 다음 단계에서 3~4방울을 취해 얼굴 전체에 부드럽게 펴 바르고 깊이 흡수시켜 줍니다. 프락셔널 레이저 또는 스킨부스터 시술 후 복원 관리에 매우 효과적입니다.',
    imgUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'epidermal-lipid-cream',
    category: 'cream',
    nameEn: 'ACE K Epidermal Ceramide Lipid Cream',
    nameKo: 'ACE K 에피더멀 세라마이드 리피드 크림',
    subEn: 'Bio-Mimetic Intercellular Lipid Restorer (3:1:1 Ratio)',
    subKo: '장벽지질 구조 복제 세·콜·지 (3:1:1 최적 배합) 영양 크림',
    descEn: 'A rich, comforting cream engineered with golden ratios of ceramides, natural cholesterol, and fatty acids. Restructures vulnerable skin barriers, alleviates severe dryness, and shields epidermal moisture.',
    descKo: '손상된 피부 장벽 세포간 지질 성분인 세라마이드, 콜레스테롤, 유기 지방산을 이상적인 3:1:1 비율로 결조한 복합 크림. 시술 직후 극도로 예민해지고 건조해진 피부 각질층을 차분하고 견고하게 밀봉합니다.',
    priceUsd: 95,
    priceKrw: 125000,
    volume: '50 ml / 1.69 fl. oz.',
    activeEn: ['3.5% Pure Ceramide NP Complex', 'Phytosphingosine & Squalane', 'Centella Asiatica (TECA 1%)'],
    activeKo: ['고순도 세라마이드 엔피 복합체 3.5%', '피토스핑고신 & 에센셜 스쿠알란', '병풀 추출 정제 고순도 센텔라아시아티카 정량 추출물 (TECA) 1%'],
    usageEn: 'Warm a pea-sized amount between clean fingertips and press gently into dry or recovering skin barrier layers. Reapply as needed throughout the day.',
    usageKo: '진주알 정도의 적당량을 취해 손끝 온도롤 가볍게 녹인 뒤, 건조하거나 시술 후 자극받은 장벽 부위에 도포하여 가볍게 눌러 안착시킵니다. 수시로 덧발라주면 치유에 도움을 줍니다.',
    imgUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ultra-mela-emulsion',
    category: 'serum',
    nameEn: 'ACE K Ultra-Mela Brightening Emulsion',
    nameKo: 'ACE K 울트라 멜라 브라이트닝 에멀전',
    subEn: 'Tranexamic Acid, Glutathione & Radiance Actives',
    subKo: '기미 완화 전용 트라넥사믹산 & 백옥 글루타티온 이중 표적 제제',
    descEn: 'A dermatologist-grade corrective treatment targeting deep melasma, dark brown spots, and uneven complexions. Slows melanin synthesis while delivering lightweight moisture and cellular clarity.',
    descKo: '색소 병변 및 난치성 기미 개선을 목표로 개발된 임상 등급 브라이트닝 제제. 트라넥사믹산과 글루타티온의 이중 작용이 잡티 형성 기전의 핵심적 연결고리를 차단하여 맑은 상백안색을 도출합니다.',
    priceUsd: 120,
    priceKrw: 160000,
    volume: '40 ml / 1.35 fl. oz.',
    activeEn: ['3.0% Clinical Tranexamic Acid', '99% Pure Glutathione Complex', 'Alpha-Arbutin & Ethyl Ascorbic Acid'],
    activeKo: ['의학 검증 트라넥사믹 에씨드 3.0%', '순도 99% 백옥 유효 글루타치온 복합체', '식약처 미백 고시 성분 알파-알부틴 & 비타민 C 유도체'],
    usageEn: 'Massage 1-2 pumps over clean face after serum application. For dynamic photo-aging recovery, follow with physical sunscreen SPF 50+ during daytime.',
    usageKo: '세럼 사용 후 1~2회 펌핑하여 얼굴 전체 또는 색소 침착 부위에 부드럽게 마사지하여 흡수시킵니다. 효과적인 색소 예방을 위해 낮 시간에는 자외선 차단 보습제와 함께 적용해야 합니다.',
    imgUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'silky-physical-uv',
    category: 'protection',
    nameEn: 'ACE K Silky Physical Broad-Spectrum SPF 50+',
    nameKo: 'ACE K 실키 피지컬 마일드 UV 선밀크 SPF 50+',
    subEn: 'Pure Zinc Oxide Non-Nano Mineral Sun Shield',
    subKo: '백탁 Zero 무기 자차 징크옥사이드 포스트-케어 저자극 보호제',
    descEn: 'An ultra-refined, non-toxic mineral sunscreen providing complete UVA/UVB dispersion. Designed for delicate post-treatment skin, leaving a silky, velvet-like weightless finish that neutralizes heat redness.',
    descKo: '미세 가공 논나노 무기 자차로 민감한 상처막 표면에 얇은 수분 쉴드를 씌워 자외선을 가뿐하게 차단합니다. 끈적임이나 백탁 없이 실크처럼 매끄러운 피부결을 가꾸며, 온열 붉은 기를 완화합니다.',
    priceUsd: 55,
    priceKrw: 72000,
    volume: '50 ml / 1.69 fl. oz.',
    activeEn: ['22.5% Non-Nano Micronized Zinc Oxide', 'Centella Asiatica & Madecassoside', 'Thermus Thermophillus Anti-Heat Ferment'],
    activeKo: ['논나노 안심 징크옥사이드 22.5%', '센텔라 정량 추출물 & 마데카소사이드', '온열 적외선 자극 차단 테르무스 테르모필루스 발효 진정 성분'],
    usageEn: 'Shake well. Apply generously 15 minutes before sun exposure as the final layer of your clinical morning skincare routine. Reapply every 2 hours if outdoors.',
    usageKo: '사용 전 충분히 흔들어 준 뒤, 아침 외출 15분 전 또는 임상 시술 스킨케어 마지막 단계에서 두 손끝을 이용하여 촉촉히 고르게 펴 바릅니다. 외부 활동 시 수시 덧바르면 노화를 철벽 방어합니다.',
    imgUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600'
  }
];

// --- LOCALSTORAGE GETTERS ---

export const getGeneralContent = (): ClinicGeneralContent => {
  const stored = localStorage.getItem('acek_general_content');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const merged = { ...DEFAULT_GENERAL_CONTENT, ...parsed };
      if (!merged.telegramBotToken) {
        merged.telegramBotToken = DEFAULT_GENERAL_CONTENT.telegramBotToken;
      }
      if (!merged.telegramChatId) {
        merged.telegramChatId = DEFAULT_GENERAL_CONTENT.telegramChatId;
      }
      return merged;
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_GENERAL_CONTENT;
};

export const getServicesContent = (): Service[] => {
  const stored = localStorage.getItem('acek_services_content');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return CLINIC_SERVICES;
};

export const getGalleryContent = (): GalleryItem[] => {
  const stored = localStorage.getItem('acek_gallery_content');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return RESULTS_GALLERY;
};

export const getProductsContent = (): Product[] => {
  const stored = localStorage.getItem('acek_products_content');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_PRODUCTS;
};

export const getBookings = (): Booking[] => {
  const stored = localStorage.getItem('acek_bookings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
};

// --- FIRESTORE SYNC & SAVE FUNCTIONS ---

export const saveGeneralContent = (content: ClinicGeneralContent) => {
  localStorage.setItem('acek_general_content', JSON.stringify(content));
  window.dispatchEvent(new Event('acek_content_update'));
  setDoc(doc(db, 'content', 'general'), content).catch(err => {
    console.error('Firestore save general content failed:', err);
  });
};

export const saveServicesContent = async (services: Service[]) => {
  localStorage.setItem('acek_services_content', JSON.stringify(services));
  window.dispatchEvent(new Event('acek_content_update'));

  try {
    const snap = await getDocs(collection(db, 'services'));
    const currentIds = new Set(services.map(s => s.id));
    snap.docs.forEach(d => {
      if (!currentIds.has(d.id)) {
        deleteDoc(doc(db, 'services', d.id)).catch(console.error);
      }
    });
    for (const service of services) {
      await setDoc(doc(db, 'services', service.id), service);
    }
  } catch (err) {
    console.error('Firestore save services failed:', err);
  }
};

export const saveGalleryContent = async (gallery: GalleryItem[]) => {
  localStorage.setItem('acek_gallery_content', JSON.stringify(gallery));
  window.dispatchEvent(new Event('acek_content_update'));

  try {
    const snap = await getDocs(collection(db, 'gallery'));
    const currentIds = new Set(gallery.map(g => g.id));
    snap.docs.forEach(d => {
      if (!currentIds.has(d.id)) {
        deleteDoc(doc(db, 'gallery', d.id)).catch(console.error);
      }
    });
    for (const item of gallery) {
      await setDoc(doc(db, 'gallery', item.id), item);
    }
  } catch (err) {
    console.error('Firestore save gallery failed:', err);
  }
};

export const saveProductsContent = async (products: Product[]) => {
  localStorage.setItem('acek_products_content', JSON.stringify(products));
  window.dispatchEvent(new Event('acek_content_update'));

  try {
    const snap = await getDocs(collection(db, 'products'));
    const currentIds = new Set(products.map(p => p.id));
    snap.docs.forEach(d => {
      if (!currentIds.has(d.id)) {
        deleteDoc(doc(db, 'products', d.id)).catch(console.error);
      }
    });
    for (const product of products) {
      await setDoc(doc(db, 'products', product.id), product);
    }
  } catch (err) {
    console.error('Firestore save products failed:', err);
  }
};

export const saveBookingToFirestore = async (booking: Booking) => {
  // Update local storage first
  const current = getBookings();
  const updated = [booking, ...current.filter(b => b.id !== booking.id)];
  localStorage.setItem('acek_bookings', JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));

  try {
    await setDoc(doc(db, 'bookings', booking.id), booking);
  } catch (err) {
    console.error('Firestore save booking failed:', err);
  }
};

export const deleteBookingFromFirestore = async (id: string) => {
  const current = getBookings();
  const updated = current.filter(b => b.id !== id);
  localStorage.setItem('acek_bookings', JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));

  try {
    await deleteDoc(doc(db, 'bookings', id));
  } catch (err) {
    console.error('Firestore delete booking failed:', err);
  }
};

// --- REAL-TIME FIRESTORE LISTENERS ---

let isListenerActive = false;

export function initFirestoreRealtimeSync() {
  if (isListenerActive || typeof window === 'undefined') return;
  isListenerActive = true;

  try {
    // 1. General Content Listener
    onSnapshot(doc(db, 'content', 'general'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ClinicGeneralContent;
        localStorage.setItem('acek_general_content', JSON.stringify(data));
        window.dispatchEvent(new Event('acek_content_update'));
      } else {
        // Seed initial default content if empty
        setDoc(doc(db, 'content', 'general'), DEFAULT_GENERAL_CONTENT).catch(console.error);
      }
    }, (err) => console.warn('General content sync notice:', err));

    // 2. Services Listener
    onSnapshot(collection(db, 'services'), (querySnap) => {
      if (!querySnap.empty) {
        const list = querySnap.docs.map(d => d.data() as Service);
        localStorage.setItem('acek_services_content', JSON.stringify(list));
        window.dispatchEvent(new Event('acek_content_update'));
      } else {
        // Seed initial services
        CLINIC_SERVICES.forEach(s => setDoc(doc(db, 'services', s.id), s).catch(console.error));
      }
    }, (err) => console.warn('Services sync notice:', err));

    // 3. Gallery Listener
    onSnapshot(collection(db, 'gallery'), (querySnap) => {
      if (!querySnap.empty) {
        const list = querySnap.docs.map(d => d.data() as GalleryItem);
        localStorage.setItem('acek_gallery_content', JSON.stringify(list));
        window.dispatchEvent(new Event('acek_content_update'));
      } else {
        // Seed initial gallery
        RESULTS_GALLERY.forEach(g => setDoc(doc(db, 'gallery', g.id), g).catch(console.error));
      }
    }, (err) => console.warn('Gallery sync notice:', err));

    // 4. Products Listener
    onSnapshot(collection(db, 'products'), (querySnap) => {
      if (!querySnap.empty) {
        const list = querySnap.docs.map(d => d.data() as Product);
        localStorage.setItem('acek_products_content', JSON.stringify(list));
        window.dispatchEvent(new Event('acek_content_update'));
      } else {
        // Seed initial products
        DEFAULT_PRODUCTS.forEach(p => setDoc(doc(db, 'products', p.id), p).catch(console.error));
      }
    }, (err) => console.warn('Products sync notice:', err));

    // 5. Bookings Listener
    onSnapshot(collection(db, 'bookings'), (querySnap) => {
      if (!querySnap.empty) {
        const list = querySnap.docs.map(d => d.data() as Booking);
        // Sort newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem('acek_bookings', JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('acek_bookings_update'));
      }
    }, (err) => console.warn('Bookings sync notice:', err));

  } catch (err) {
    console.error('Error starting Firestore real-time listeners:', err);
  }
}

// Automatically boot real-time sync
if (typeof window !== 'undefined') {
  initFirestoreRealtimeSync();
}
