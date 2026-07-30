export interface Service {
  id: string;
  name: string;
  category: 'injectables' | 'skin' | 'laser' | 'body';
  description: string;
  duration: number; // in minutes
  price: number; // in USD
  benefits: string[];
  idealFor: string;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  rating: number;
  image: string;
  bio: string;
  availability: string; // e.g. "Mon, Wed, Fri"
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  specialistId: string;
  specialistName: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  concerns: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  totalPrice: number;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

export interface Product {
  id: string;
  category: 'serum' | 'cream' | 'protection' | 'all';
  nameEn: string;
  nameKo: string;
  subEn: string;
  subKo: string;
  descEn: string;
  descKo: string;
  priceUsd: number;
  priceKrw: number;
  volume: string;
  activeEn: string[];
  activeKo: string[];
  usageEn: string;
  usageKo: string;
  imgUrl: string;
}

