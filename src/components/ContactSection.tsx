import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clipboard, Check, HelpCircle, Car, Key, Copy, Compass } from 'lucide-react';
import { getGeneralContent } from '../utils/content';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [generalContent, setGeneralContent] = useState(getGeneralContent);

  useEffect(() => {
    const sync = () => {
      setGeneralContent(getGeneralContent());
    };
    window.addEventListener('acek_content_update', sync);
    return () => window.removeEventListener('acek_content_update', sync);
  }, []);

  const clinicAddress = generalContent.address;

  const handleCopy = () => {
    navigator.clipboard.writeText(clinicAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const businessHours = [
    { day: "Monday — Friday", hours: "09:30 AM — 07:00 PM", note: "Regular medical hours" },
    { day: "Saturday", hours: "10:00 AM — 04:00 PM", note: "By prior hold booking only" },
    { day: "Sunday", hours: "Closed", note: "Private VIP reservations only" }
  ];

  return (
    <div id="contact-coordinates" className="scroll-mt-24">
      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold font-mono">ENQUIRIES</span>
        <h3 className="text-3xl md:text-4xl font-serif text-[#333333] mt-2 font-light">Connect With Our Team</h3>
        <p className="text-gray-500 mt-3 text-sm leading-relaxed max-w-xl mx-auto font-sans">
          Our clinic is positioned in the luxury high-rise commercial sector. Drop by or schedule a virtual inquiry with our front desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Essential details & Business Hours */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 flex-1">
            <h4 className="text-lg font-serif text-gray-800 uppercase tracking-wider font-semibold border-b border-gray-150 pb-3">
              Direct Channels
            </h4>

            <div className="space-y-4">
              {/* Phone Line */}
              <a
                href={`tel:${generalContent.phone}`}
                className="flex items-start gap-4 p-3 bg-[#F9F9F7] hover:bg-[#F9F9F7]/60 border border-gray-150 hover:border-gray-250 rounded-xl transition-all group"
              >
                <span className="p-2 bg-amber-500/5 border border-amber-500/15 text-[#B8860B] rounded-lg">
                  <Phone className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-gray-400">Concierge Desk</span>
                  <span className="text-sm font-semibold text-gray-800 mt-0.5 block group-hover:text-[#B8860B] transition-all font-mono animate-fadeIn">
                    {generalContent.phone}
                  </span>
                </div>
              </a>

              {/* Email contact */}
              <a
                href={`mailto:${generalContent.email}`}
                className="flex items-start gap-4 p-3 bg-[#F9F9F7] hover:bg-[#F9F9F7]/60 border border-gray-150 hover:border-gray-250 rounded-xl transition-all group"
              >
                <span className="p-2 bg-amber-500/5 border border-amber-500/15 text-[#B8860B] rounded-lg">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-gray-400">Inquiry Department</span>
                  <span className="text-sm font-semibold text-gray-800 mt-0.5 block group-hover:text-[#B8860B] transition-all font-mono animate-fadeIn">
                    {generalContent.email}
                  </span>
                </div>
              </a>

              {/* Physical Address with Copy Tool */}
              <div className="p-3 bg-[#F9F9F7] border border-gray-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#B8860B]" /> Clinic Location
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-[10px] text-[#B8860B] hover:text-[#B8860B]/85 flex items-center gap-1.5 font-mono cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Address
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-700 font-serif leading-relaxed mt-1 animate-fadeIn">
                  {clinicAddress}
                </p>
              </div>
            </div>

            {/* Business hours listing */}
            <div className="pt-4 border-t border-gray-150">
              <h5 className="text-xs uppercase tracking-widest text-[#B8860B] font-mono font-semibold mb-3">
                Admissions Calendar
              </h5>
              <div className="space-y-2.5">
                {businessHours.map((bh, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="block text-gray-800 font-semibold">{bh.day}</span>
                      <span className="text-[10px] text-gray-400 font-sans italic">{bh.note}</span>
                    </div>
                    <span className="font-mono text-[#B8860B] text-right font-semibold">{bh.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Google Maps Interactive Experience */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between h-full space-y-6">
            <h4 className="text-lg font-serif text-gray-800 uppercase tracking-wider font-semibold border-b border-gray-150 pb-3">
              Visual Directions & Parking Map
            </h4>

            {/* Custom Interactive map artwork */}
            <div className="relative h-64 w-full bg-[#F4F4F2] border border-gray-200 rounded-xl overflow-hidden shadow-inner flex items-center justify-center select-none group">
              {/* Simulated blueprint vector lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
              
              {/* Simulated Map Streets using simple grid layout lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-10 pointer-events-none">
                <div className="h-0.5 bg-gray-300/30 w-full transform rotate-3"></div>
                <div className="h-0.5 bg-gray-300/40 w-full"></div>
                <div className="h-0.5 bg-gray-300/30 w-full"></div>
              </div>
              <div className="absolute inset-0 flex justify-between px-16 pointer-events-none">
                <div className="w-0.5 bg-gray-300/30 h-full"></div>
                <div className="w-0.5 bg-gray-300/40 h-full transform -rotate-6"></div>
                <div className="w-0.5 bg-gray-300/30 h-full"></div>
              </div>

              {/* Landmark A: TK Avenue */}
              <div className="absolute top-8 left-12 text-[10px] font-mono text-gray-500 uppercase border border-gray-200 bg-white/85 px-2 py-0.5 rounded shadow-sm">
                TK Avenue Mall
              </div>

              {/* Landmark B: St 592 Parking */}
              <div className="absolute bottom-10 right-10 text-[10px] font-mono text-gray-500 uppercase border border-gray-200 bg-white/85 px-2 py-0.5 rounded shadow-sm">
                TK Olive Parking
              </div>

              {/* Central Gold Indicator: ACE K CLINIC */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center group-hover:scale-105 transition-all duration-300">
                {/* Visual pulsating locator ring */}
                <div className="absolute -inset-4 bg-amber-500/5 border border-[#D4AF37]/45 rounded-full animate-ping opacity-75"></div>
                
                <div className="relative bg-white border-2 border-[#D4AF37] px-4 py-2 rounded-xl shadow-md flex items-center gap-2 max-w-xs mx-auto">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></span>
                  <div>
                    <span className="block text-[11px] font-mono font-extrabold text-gray-800 tracking-wider">ACE K Clinic</span>
                    <span className="block text-[8px] font-sans text-[#B8860B] leading-none mt-0.5 uppercase tracking-widest font-bold">TK Olive, 1st Floor</span>
                  </div>
                </div>
              </div>

              {/* Directions quick link */}
              <div className="absolute bottom-3 left-3 bg-white/90 border border-gray-200 text-[10px] font-mono px-2 py-1 rounded text-[#B8860B] flex items-center gap-1 shadow-sm">
                <Compass className="w-3 h-3 text-[#B8860B]" />
                <span>Geographic coordinates: 11.5724° N, 104.8966° E</span>
              </div>
            </div>

            {/* Accessibility features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-2">
              <div className="flex gap-2.5 items-start">
                <span className="p-2 bg-[#F9F9F7] border border-gray-200 rounded-lg text-amber-500 flex-shrink-0">
                  <Car className="w-4 h-4 text-[#B8860B]" />
                </span>
                <div>
                  <h5 className="font-serif text-[12px] font-bold uppercase tracking-wider text-gray-850">Convenient Parking</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-sans leading-relaxed">
                    Underground parking with valet validation is fully available at the Gilded Pavilion entrance gate.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="p-2 bg-[#F9F9F7] border border-gray-200 rounded-lg text-amber-500 flex-shrink-0">
                  <Key className="w-4 h-4 text-[#B8860B]" />
                </span>
                <div>
                  <h5 className="font-serif text-[12px] font-bold uppercase tracking-wider text-gray-850">Secured Privacy</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-sans leading-relaxed">
                    Includes access to our private elevator lobbies for patients who wish to step in and out discretely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
