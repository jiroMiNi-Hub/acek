import React, { useState, useEffect } from 'react';
import { ShieldCheck, Compass, Heart } from 'lucide-react';
import { getGeneralContent } from '../utils/content';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps = {}) {
  const [generalContent, setGeneralContent] = useState(getGeneralContent);

  useEffect(() => {
    const sync = () => {
      setGeneralContent(getGeneralContent());
    };
    window.addEventListener('acek_content_update', sync);
    return () => window.removeEventListener('acek_content_update', sync);
  }, []);

  const handleScrollToSegment = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getAbbreviation = (name: string) => {
    if (!name) return 'A';
    return name.split(' ').map(w => w[0]).join('').substring(0, 3);
  };

  return (
    <footer className="bg-[#1E1E1C] border-t border-gray-800 text-gray-400 text-xs py-12 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent"></div>

      <div className="max-w-full mx-auto px-4 sm:px-10 lg:px-16 xl:px-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10">
        {/* Left column info */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            {generalContent.logoUrl ? (
              <img
                src={generalContent.logoUrl}
                alt={generalContent.clinicName}
                className="h-10 w-auto max-w-[180px] object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <>
                <div className="w-8 h-8 rounded-full border border-[#D4AF37] bg-white/5 flex items-center justify-center text-xs font-serif text-[#D4AF37]">
                  {getAbbreviation(generalContent.clinicName)}
                </div>
                <div>
                  <h4 className="text-sm font-serif text-white tracking-[3px] uppercase font-normal pointer-events-none animate-fadeIn">
                    {generalContent.clinicName}
                  </h4>
                  <span className="text-[8px] uppercase tracking-[4px] text-[#A37B24] block mt-0.5">
                    EST. 2018
                  </span>
                </div>
              </>
            )}
          </div>
          <p className="text-xs text-gray-350 max-w-sm leading-relaxed">
            Leading-edge medical aesthetics and non-surgical skin therapies focusing on discrete elegance, youth restoration, and uncompromised safety standards.
          </p>
        </div>

        {/* Center column links */}
        <div className="md:col-span-3 space-y-3">
          <h5 className="font-serif text-[13px] uppercase tracking-wider text-white font-bold font-mono">
            Navigation Map
          </h5>
          <ul className="space-y-2 text-gray-400 font-mono text-xs uppercase tracking-wider font-bold">
            <li>
              <button onClick={() => handleScrollToSegment('philosophy-story')} className="hover:text-[#D4AF37] transition-all cursor-pointer font-bold">
                Clinical Philosophy
              </button>
            </li>
            <li>
              <button onClick={() => handleScrollToSegment('treatments-catalog')} className="hover:text-[#D4AF37] transition-all cursor-pointer font-bold">
                Treatment Catalog
              </button>
            </li>
            <li>
              <button onClick={() => handleScrollToSegment('results-gallery-showcase')} className="hover:text-[#D4AF37] transition-all cursor-pointer font-bold">
                Results comparison
              </button>
            </li>
            <li>
              <button onClick={() => handleScrollToSegment('contact-coordinates')} className="hover:text-[#D4AF37] transition-all cursor-pointer font-bold">
                Suite Coordinates
              </button>
            </li>
          </ul>
        </div>

        {/* Right column legal / standard guidelines */}
        <div className="md:col-span-4 space-y-3">
          <h5 className="font-serif text-[13px] uppercase tracking-wider text-white font-bold font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Licensing & Compliance
          </h5>
          <p className="text-[12px] text-gray-450 leading-relaxed font-sans">
            Aesthetic and therapeutic treatments are performed under the registered supervision of Dr. Choi Sung Su, MD and licensed Nurse practitioners. All materials adhere strictly to US FDA clearance standards. Individual physiological dermatological profiles may result in variations.
          </p>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-10 lg:px-16 xl:px-24 border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-[10px] uppercase font-mono tracking-widest">
        <div>
          &copy; {new Date().getFullYear()} ACE K Clinic. All Rights Reserved.
        </div>
        <div className="flex flex-wrap items-center gap-1.5 justify-center">
          <span>Crafted in slate & gold</span>
          <Heart className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>with premium care</span>
          {onOpenAdmin && (
            <>
              <span className="text-gray-700 font-normal select-none">•</span>
              <button 
                onClick={onOpenAdmin} 
                className="hover:text-[#D4AF37] transition-all flex items-center gap-1 uppercase tracking-widest font-mono text-[10px] bg-transparent border-none cursor-pointer text-gray-500 hover:scale-102"
              >
                <span>Admin Console</span>
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
