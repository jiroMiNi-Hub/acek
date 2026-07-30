import { Service, Specialist, GalleryItem } from './types';

export const CLINIC_SERVICES: Service[] = [
  // Injectables
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
  // Skin
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
  // Laser
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
  // Body
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
];

export const CLINIC_SPECIALISTS: Specialist[] = [
  {
    id: 'spec-01',
    name: 'Dr. Choi Sung Su, MD',
    role: 'Clinical Director & Lead Dermatologist',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    bio: 'With over 12 years of clinical expertise, Dr. Choi is a board-certified dermatologist specializing in non-surgical facial sculpting and state-of-the-art laser therapies.',
    availability: 'Mon, Tue, Thu, Fri'
  },
  {
    id: 'spec-02',
    name: 'Samantha Vance, RN',
    role: 'Senior Aesthetic Injection Nurse',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800',
    bio: 'Samantha is highly regarded for her subtle, artistic approach to dermal fillers and custom toxin layouts, ensuring natural, refreshed outcomes.',
    availability: 'Mon, Wed, Thu, Sat'
  },
  {
    id: 'spec-03',
    name: 'Marcus Sterling, LE',
    role: 'Clinical Dermal Specialist',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800',
    bio: 'Marcus focuses on deep dermal therapies, 24K Gold infusions, and clinical chemical peels tailored specifically to complex sensitive skin conditions.',
    availability: 'Tue, Wed, Fri, Sat'
  }
];

export const RESULTS_GALLERY: GalleryItem[] = [
  {
    id: 'res-01',
    title: 'Signature Lip Sculpting',
    category: 'Injectable Contouring',
    beforeImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600', // Close up hydration
    afterImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', // Asian model glass glow
    description: 'Restored lip symmetry and added discrete hydration volume to a client with dry, thin lips.'
  },
  {
    id: 'res-02',
    title: 'Acne Scar Correction',
    category: 'Laser Resurfacing & Microneedling',
    beforeImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600', // Textured skin
    afterImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600', // Clear glass-skin tone
    description: 'Two sessions of fractional laser combined with growth factors, resulting in a dramatic flattening of deep scar tissue.'
  },
  {
    id: 'res-03',
    title: 'Under-Eye & Cheek Revitalization',
    category: 'Precision Dermal Fillers',
    beforeImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f6d?auto=format&fit=crop&q=80&w=600', // Shadowed expressions
    afterImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600', // Radiating Asian model smile
    description: 'Lifted sunken tear-troughs and defined cheeks, establishing a refreshed, well-rested focal gaze.'
  }
];
