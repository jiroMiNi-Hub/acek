import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { getGeneralContent, getBookings, deleteBookingFromFirestore } from '../utils/content';
import { useLanguage } from '../utils/language';
import { openBookingPopup } from '../utils/booking';
import { Calendar, Clock, Sparkles, Trash2, CalendarDays, ShieldCheck, ArrowRight } from 'lucide-react';

interface BookingSystemProps {
  preselectedService?: any;
  onClearPreselected?: () => void;
  showPrices?: boolean;
}

export default function BookingSystem({ showPrices = true }: BookingSystemProps = {}) {
  const { language } = useLanguage();
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const loadBookings = () => {
      setExistingBookings(getBookings());
    };

    loadBookings();
    window.addEventListener('storage', loadBookings);
    window.addEventListener('acek_bookings_update', loadBookings);
    return () => {
      window.removeEventListener('storage', loadBookings);
      window.removeEventListener('acek_bookings_update', loadBookings);
    };
  }, []);

  const handleCancelBooking = (id: string) => {
    deleteBookingFromFirestore(id);
  };

  const getFormatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div id="reservation-engine" className="scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold font-mono">RESERVATIONS</span>
        <h3 className="text-3xl md:text-4xl font-serif text-[#333333] mt-2 font-light">
          {language === 'ko' ? '비공개 진료 및 상담 예약' : 'Book Your Private Experience'}
        </h3>
        <p className="text-gray-500 mt-3 text-sm leading-relaxed max-w-xl mx-auto font-sans">
          {language === 'ko'
            ? '온라인 팝업 예약 시스템을 통해 원하시는 날짜와 시간을 선택하시고 간편하게 예약을 완료하세요.'
            : 'Click below to open our interactive booking calendar popup, select your date & time, and enter your details step by step.'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        {/* Main CTA Reservation Card */}
        <div className="md:col-span-7 bg-white border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-600"></div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-[#FAF9F5] border border-[#D4AF37]/30 rounded-full py-1 px-3 text-[10px] font-mono tracking-widest text-[#B8860B] uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{language === 'ko' ? '실시간 팝업 예약 시스템' : 'Interactive Pop-Up Reservation'}</span>
            </div>

            <h4 className="text-2xl font-serif text-gray-900 font-bold">
              {language === 'ko' ? '맞춤 진료 일정 선택하기' : 'Schedule Your Personal Consultation'}
            </h4>

            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              {language === 'ko'
                ? '원하는 진료 날짜, 희망 시간대, 환자 인적사항을 단계별로 입력하실 수 있습니다.'
                : 'Select available clinic time slots, doctor specialists, and medical notes in a fast, step-by-step popup form.'}
            </p>

            <div className="space-y-2 pt-2 text-xs font-mono text-gray-700">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#B8860B]" />
                <span>{language === 'ko' ? '1단계: 날짜 및 희망 시간 선택' : 'Step 1: Choose Date & Time Slot'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                <span>{language === 'ko' ? '2단계: 환자 인적사항 및 특이사항 입력' : 'Step 2: Enter Patient Details Step-by-Step'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-150">
            <button
              onClick={() => openBookingPopup()}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-mono font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
            >
              <span>{language === 'ko' ? '날짜 및 시간 선택하여 예약하기' : 'Select Date & Time to Book'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Registered Bookings List Side Panel */}
        <div className="md:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h5 className="font-serif text-sm text-gray-900 uppercase tracking-wider font-bold border-b border-gray-150 pb-3 mb-4 flex items-center justify-between">
              <span>{language === 'ko' ? '나의 예약 내역' : 'My Registered Bookings'}</span>
              <span className="bg-[#D4AF37]/10 text-[#B8860B] rounded-full text-[10px] font-mono px-2.5 py-0.5 font-bold">
                {existingBookings.length}
              </span>
            </h5>

            {existingBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                <Calendar className="w-7 h-7 mx-auto stroke-1 mb-2 text-gray-300" />
                <p className="text-xs font-sans">
                  {language === 'ko' ? '등록된 예약 내역이 없습니다.' : 'No active appointments requested yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {existingBookings.map((b) => (
                  <div key={b.id} className="bg-[#FAF9F5] border border-gray-150 rounded-xl p-3 text-xs relative">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-mono text-gray-400 uppercase font-bold">
                        ID: {b.id}
                      </span>
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-0.5 rounded cursor-pointer"
                        title="Cancel appointment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-serif text-xs text-gray-900 font-bold leading-tight">
                      {b.serviceName}
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-[#B8860B] bg-amber-500/10 py-1 px-2 rounded inline-block font-semibold">
                      {getFormatDate(b.date)} | {b.timeSlot}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-[10px] text-gray-400 font-sans mt-4 text-center">
            {language === 'ko' ? '원내에서 안전하게 일정이 보관됩니다.' : 'Hold booking requests are stored locally on your device.'}
          </p>
        </div>
      </div>
    </div>
  );
}
