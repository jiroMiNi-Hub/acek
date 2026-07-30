import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ActualCEOMessage from './components/ActualCEOMessage';
import CEOMessage from './components/CEOMessage';
import ServiceMenu from './components/ServiceMenu';
import ClinicGallery from './components/ClinicGallery';
import ClientTestimonials from './components/ClientTestimonials';
import FAQSection from './components/FAQSection';
import BookingSystem from './components/BookingSystem';
import BookingModal from './components/BookingModal';
import ContactSection from './components/ContactSection';
import AdminPortal from './components/AdminPortal';
import BackToTop from './components/BackToTop';
import OurProduct from './components/OurProduct';
import { Service } from './types';
import { getGeneralContent } from './utils/content';
import { useLanguage } from './utils/language';
import { openBookingPopup } from './utils/booking';
import { Sparkles, Award, Star,ShieldCheck, ChevronLeft, ChevronRight, Calendar, ArrowDown } from 'lucide-react';

export default function App() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [generalContent, setGeneralContent] = useState(getGeneralContent);
  const [showPrices, setShowPrices] = useState(() => {
    const gen = getGeneralContent();
    if (gen.showPrices !== undefined) return gen.showPrices;
    const saved = localStorage.getItem('acek_show_prices');
    return saved !== null ? saved === 'true' : false;
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalService, setBookingModalService] = useState<Service | null>(null);
  const { language, t, getTranslatedGeneral } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeGeneralContent = { ...generalContent, ...getTranslatedGeneral() };

  const heroImages = activeGeneralContent.heroImages || [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1800',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1800'
  ];

  // Listen for global open booking popup requests
  useEffect(() => {
    const handleOpenBooking = (e: any) => {
      if (e.detail?.service) {
        setBookingModalService(e.detail.service);
      } else {
        setBookingModalService(null);
      }
      setIsBookingModalOpen(true);
    };

    window.addEventListener('acek_open_booking', handleOpenBooking);
    return () => window.removeEventListener('acek_open_booking', handleOpenBooking);
  }, []);

  useEffect(() => {
    const sync = () => {
      const gen = getGeneralContent();
      setGeneralContent(gen);
      if (gen.showPrices !== undefined) {
        setShowPrices(gen.showPrices);
      }
    };
    window.addEventListener('acek_content_update', sync);
    return () => window.removeEventListener('acek_content_update', sync);
  }, []);

  // Safe auto-advance slideshow
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleSelectServiceInApp = (service: Service) => {
    setSelectedService(service);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#333333] selection:bg-[#D4AF37]/30 selection:text-white flex flex-col relative">
      {/* Background radial gold glow effect orbs */}
      <div className="absolute top-[8%] left-[10%] w-[450px] h-[450px] bg-[#D4AF37]/3 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[35%] right-[5%] w-[400px] h-[400px] bg-amber-600/2 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[5%] w-[500px] h-[500px] bg-[#D4AF37]/2 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Sticky Premium Navbar Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 pt-20">
        
        {/* HERO SECTION WITH LUXURY COVER BACKGROUND */}
        <section 
          id="hero-banner" 
          className="relative min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 overflow-hidden bg-neutral-900"
        >
          {/* Slideshow background images with smooth cross-fade */}
          {heroImages.map((imgUrl, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out pointer-events-none"
              style={{
                backgroundImage: `url('${imgUrl}')`,
                opacity: index === currentSlide ? 1 : 0,
                zIndex: 0,
              }}
            />
          ))}

          {/* Luxurious Dark Glass-Vignette Overlay to ensure perfect text contrast */}
          <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[0.5px] z-10"></div>
          
          {/* Subtle gold ray gradient light leaks */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/15 via-transparent to-[#B8860B]/15 z-10"></div>

          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-20 text-white">
            {/* Admissions Banner */}
            <div className="inline-flex items-center gap-2 bg-white/95 border border-[#D4AF37]/35 rounded-full py-1.5 px-4 text-[10px] sm:text-xs font-mono tracking-widest text-[#B8860B] uppercase shadow-lg animate-fadeIn backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>{t('admissionsBanner')}</span>
            </div>

            {/* Display Headings */}
            <div className="space-y-4">
              <span className="block text-xs uppercase tracking-[8px] text-amber-100/90 font-mono font-semibold">{activeGeneralContent.clinicName}</span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white font-light tracking-wide leading-tight animate-fadeIn filter drop-shadow-md">
                {activeGeneralContent.heroTitle.split('&').map((text, idx) => (
                  <span key={idx}>
                    {idx > 0 && <span className="text-[#D4AF37] font-sans font-light"> & </span>}
                    {text}
                  </span>
                ))}
              </h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6"></div>
            </div>

            {/* Subheading */}
            <p className="text-gray-250 text-neutral-200 font-sans text-sm sm:text-base leading-relaxed max-w-xl mx-auto animate-fadeIn drop-shadow-sm">
              {activeGeneralContent.heroSubTitle}
            </p>

            {/* Navigation Handles */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-mono">
              <button
                onClick={() => openBookingPopup()}
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8860B] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-lg shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {t('inquireSession')}
              </button>
              
              <button
                onClick={() => scrollToSection('treatments-catalog')}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs uppercase tracking-widest py-3.5 px-8 rounded-lg transition-all backdrop-blur-md"
              >
                {t('exploreTreatments').replace('&rarr;', '→')}
              </button>
            </div>

            {/* Arrow Scroll Indicator */}
            <button
              onClick={() => scrollToSection('highlights-ribbon')}
              className="mx-auto block text-gray-300 hover:text-[#D4AF37] transition-all pt-6 animate-bounce cursor-pointer focus:outline-none"
              title="Scroll down"
            >
              <ArrowDown className="w-5 h-5 mx-auto stroke-[1.5px]" />
            </button>
          </div>

          {/* Carousel Buttons (Left & Right Arrows) */}
          {heroImages.length > 1 && (
            <>
              <button
                onClick={() => {
                  setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white/70 hover:text-white transition-all z-30 border border-white/10 hidden sm:block cursor-pointer"
                title="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setCurrentSlide((prev) => (prev + 1) % heroImages.length);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white/70 hover:text-white transition-all z-30 border border-white/10 hidden sm:block cursor-pointer"
                title="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Carousel Slide Indicators (Dots) */}
          {heroImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlide 
                      ? 'bg-[#D4AF37] w-6' 
                      : 'bg-white/40 hover:bg-white/80'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* HIGHLIGHTS / STATS RIBBON */}
        <section id="highlights-ribbon" className="relative z-10 border-y border-gray-200 bg-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-center md:text-left">
            
            {/* Badge 1 */}
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="p-3 bg-[#F9F9F7] border border-gray-150 rounded-xl text-[#B8860B] max-w-fit animate-fadeIn">
                <ShieldCheck className="w-6 h-6 stroke-[1.25px]" />
              </div>
              <div>
                <h4 className="font-serif text-sm text-gray-800 uppercase tracking-wider font-semibold">{t('highlightsTitle1')}</h4>
                <p className="text-xs text-gray-500 mt-1 font-sans leading-relaxed">
                  {t('highlightsDesc1')}
                </p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="p-3 bg-[#F9F9F7] border border-gray-150 rounded-xl text-[#B8860B] max-w-fit animate-fadeIn">
                <Award className="w-6 h-6 stroke-[1.25px]" />
              </div>
              <div>
                <h4 className="font-serif text-sm text-gray-800 uppercase tracking-wider font-semibold">{t('highlightsTitle2')}</h4>
                <p className="text-xs text-gray-500 mt-1 font-sans leading-relaxed">
                  {t('highlightsDesc2')}
                </p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="p-3 bg-[#F9F9F7] border border-gray-150 rounded-xl text-[#B8860B] max-w-fit animate-fadeIn">
                <Star className="w-6 h-6 stroke-[1.25px]" />
              </div>
              <div>
                <h4 className="font-serif text-sm text-gray-800 uppercase tracking-wider font-semibold">{t('highlightsTitle3')}</h4>
                <p className="text-xs text-gray-500 mt-1 font-sans leading-relaxed">
                  {t('highlightsDesc3')}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* PILLARS STORY & CEO MESSAGE */}
        <section id="philosophy-story" className="max-w-full mx-auto px-4 sm:px-10 lg:px-16 xl:px-24 py-10 sm:py-16 relative z-10 space-y-10 lg:space-y-16">
          <ActualCEOMessage />
          <CEOMessage />
        </section>

        {/* TREATMENTS CORE CATALOG */}
        <section id="treatments-catalog" className="bg-white border-y border-gray-200 py-10 sm:py-16 relative z-10 px-4 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-full mx-auto">
            <ServiceMenu onSelectService={handleSelectServiceInApp} showPrices={showPrices} />
          </div>
        </section>

        {/* CLINICAL PREMIUM PRODUCTS HIGHLIGHT */}
        <section id="our-products-catalog" className="bg-[#FAF9F5] py-10 sm:py-16 relative z-10 px-4 sm:px-10 lg:px-16 xl:px-24 border-b border-gray-200">
          <div className="max-w-full mx-auto">
            <OurProduct showPrices={showPrices} />
          </div>
        </section>

        {/* BEFORE & AFTER RESULTS GALLERY */}
        <section id="results-gallery-showcase" className="max-w-full mx-auto px-4 sm:px-10 lg:px-16 xl:px-24 py-10 sm:py-16 relative z-10">
          <ClinicGallery />
        </section>

        {/* CLIENT TESTIMONIALS */}
        <section id="client-testimonials" className="bg-[#F9F9F7]/95 border-y border-gray-200 py-10 sm:py-16 relative z-10 px-4 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-full mx-auto">
            <ClientTestimonials />
          </div>
        </section>

        {/* CLIENT INQUIRIES & ACCOMMODATIONS FAQ */}
        <section id="clinic-faqs" className="max-w-full mx-auto px-4 sm:px-10 lg:px-16 xl:px-24 py-10 sm:py-16 relative z-10">
          <FAQSection />
        </section>

        {/* BOOKING SYSTEMS MODULE */}
        <section className="bg-[#F9F9F7] border-y border-gray-200 py-10 sm:py-16 relative z-10 px-4 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-full mx-auto">
            <BookingSystem
              preselectedService={selectedService}
              onClearPreselected={() => setSelectedService(null)}
              showPrices={showPrices}
            />
          </div>
        </section>

        {/* ENQUIRIES & CONTACT/LOCATION */}
        <section id="contact-coordinates" className="max-w-full mx-auto px-4 sm:px-10 lg:px-16 xl:px-24 py-10 sm:py-16 relative z-10">
          <ContactSection />
        </section>
        
      </main>

      {/* Footer Navigation */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Slide-over Center Management Administrative Terminal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        showPrices={showPrices}
        setShowPrices={setShowPrices}
      />

      {/* Floating Back to Top Control */}
      <BackToTop />

      {/* Global Interactive Booking Pop-Up Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedService={bookingModalService || selectedService}
        showPrices={showPrices}
      />
    </div>
  );
}
