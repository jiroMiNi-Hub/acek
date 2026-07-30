import React, { useState, useEffect } from 'react';
import { Service, Specialist, Booking } from '../types';
import { getServicesContent, getGeneralContent, saveBookingToFirestore } from '../utils/content';
import { CLINIC_SPECIALISTS } from '../data';
import { useLanguage } from '../utils/language';
import {
  Calendar,
  Clock,
  User,
  Sparkles,
  CheckCircle,
  ShieldAlert,
  CalendarDays,
  KeyRound,
  Check,
  Mail,
  Send,
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: Service | null;
  showPrices?: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  preselectedService,
  showPrices = true
}: BookingModalProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState(getServicesContent);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // Selection states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Form input states
  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientConcerns, setPatientConcerns] = useState<string>('');

  // Submitted booking state (for receipt screen)
  const [lastSubmittedBooking, setLastSubmittedBooking] = useState<Booking | null>(null);

  // Available Dates
  const [availableDates, setAvailableDates] = useState<{
    dateString: string;
    dayName: string;
    dayNum: string;
    monthName: string;
  }[]>([]);

  // Email Notification States
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailSendStatus, setEmailSendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Time Slots
  const timeSlots = [
    '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
    '01:15 PM', '02:00 PM', '02:45 PM', '03:30 PM',
    '04:15 PM', '05:00 PM', '05:45 PM', '06:30 PM'
  ];

  // Sync services from content
  useEffect(() => {
    const sync = () => {
      setServices(getServicesContent());
    };
    window.addEventListener('acek_content_update', sync);
    return () => window.removeEventListener('acek_content_update', sync);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Set default or preselected service
  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
    } else if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [preselectedService, services]);

  // Default specialist
  useEffect(() => {
    if (CLINIC_SPECIALISTS.length > 0 && !selectedSpecialist) {
      setSelectedSpecialist(CLINIC_SPECIALISTS[0]);
    }
  }, [selectedSpecialist]);

  // Generate next 12 available days
  useEffect(() => {
    const dates = [];
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 1; i <= 14; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);

      // Skip Sundays (clinic closed)
      if (nextDay.getDay() === 0) continue;

      const year = nextDay.getFullYear();
      const monthIndex = nextDay.getMonth();
      const dateNum = String(nextDay.getDate()).padStart(2, '0');
      const monthNum = String(monthIndex + 1).padStart(2, '0');

      dates.push({
        dateString: `${year}-${monthNum}-${dateNum}`,
        dayName: days[nextDay.getDay()],
        dayNum: String(nextDay.getDate()),
        monthName: months[monthIndex]
      });

      if (dates.length >= 12) break;
    }
    setAvailableDates(dates);
  }, []);

  // Format date helper
  const getFormatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Dispatch Email Notification
  const sendEmailNotificationOnBooking = async (booking: Booking) => {
    const general = getGeneralContent();
    const recipientEmail = general.email || 'acekservice.kh@gmail.com';
    const key = general.web3formsKey || '';

    setIsSendingEmail(true);
    setEmailSendStatus('idle');

    try {
      let response;
      if (key) {
        response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            access_key: key,
            subject: `🔔 New Hold Booking [${booking.id}] - ${booking.patientName}`,
            from_name: `${general.clinicName || 'ACE K CLINIC'} Booking System`,
            to_email: recipientEmail,
            replyto: booking.patientEmail,
            message: `NEW APPOINTMENT RESERVATION PLACED

• Booking ID: ${booking.id}
• Treatment: ${booking.serviceName}
• Practitioner: ${booking.specialistName}
• Scheduled Date: ${booking.date}
• Scheduled Time Slot: ${booking.timeSlot}
• Estimated Cost: ${showPrices ? `$${booking.totalPrice}` : 'By Consultation'}

• Patient Name: ${booking.patientName}
• Phone: ${booking.patientPhone}
• Email: ${booking.patientEmail}
• Notes: "${booking.concerns || 'None specified.'}"`
          })
        });
      } else {
        response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            _subject: `🔔 New Booking hold [${booking.id}] - ${booking.patientName}`,
            _replyto: booking.patientEmail,
            "Booking ID": booking.id,
            "Treatment Protocol": booking.serviceName,
            "Practitioner": booking.specialistName,
            "Reservation Date": getFormatDate(booking.date),
            "Time Slot": booking.timeSlot,
            "Estimated Price": showPrices ? `$${booking.totalPrice}` : "By Consultation",
            "Patient Full Name": booking.patientName,
            "Patient Mobile": booking.patientPhone,
            "Patient Email": booking.patientEmail,
            "Clinical Notes": booking.concerns || "No concerns specified."
          })
        });
      }

      if (response.ok) {
        setEmailSendStatus('success');
      } else {
        setEmailSendStatus('error');
      }
    } catch (err) {
      console.error("Error dispatching booking notification email:", err);
      setEmailSendStatus('error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Dispatch Telegram Notification
  const sendTelegramNotificationOnBooking = async (booking: Booking) => {
    const general = getGeneralContent();
    const botToken = general.telegramBotToken || '';
    const chatId = general.telegramChatId || '';

    if (!botToken || !chatId) return;

    try {
      const messageText = `🔔 <b>[ACE K CLINIC] NEW RESERVATION ALERT</b>

📋 <b>APPOINTMENT DETAILS:</b>
• <b>ID:</b> <code>${booking.id}</code>
• <b>Treatment:</b> ${booking.serviceName}
• <b>Specialist:</b> ${booking.specialistName}
• <b>Date:</b> 📅 ${getFormatDate(booking.date)}
• <b>Time:</b> ⏰ ${booking.timeSlot}
• <b>Est. Cost:</b> ${showPrices ? `$${booking.totalPrice}` : 'By Consultation'}

👤 <b>PATIENT INFO:</b>
• <b>Name:</b> ${booking.patientName}
• <b>Phone:</b> ${booking.patientPhone}
• <b>Email:</b> ${booking.patientEmail}

🩺 <b>NOTES:</b>
<i>"${booking.concerns || 'None specified.'}"</i>`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: messageText, parse_mode: "HTML" })
      });
    } catch (err) {
      console.error("Telegram error:", err);
    }
  };

  // Submit Booking Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSpecialist || !selectedDate || !selectedTime || !patientName || !patientEmail || !patientPhone) {
      return;
    }

    const uniqueId = `ACK-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking: Booking = {
      id: uniqueId,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      specialistId: selectedSpecialist.id,
      specialistName: selectedSpecialist.name,
      date: selectedDate,
      timeSlot: selectedTime,
      patientName,
      patientEmail,
      patientPhone,
      concerns: patientConcerns,
      status: 'confirmed',
      totalPrice: selectedService.price,
      createdAt: new Date().toISOString()
    };

    // Save to LocalStorage and Firestore database globally
    saveBookingToFirestore(newBooking);

    setLastSubmittedBooking(newBooking);
    setStep(3); // Receipt step

    // Background notifications
    sendEmailNotificationOnBooking(newBooking);
    sendTelegramNotificationOnBooking(newBooking);
  };

  const resetModalState = () => {
    setStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setPatientConcerns('');
    setLastSubmittedBooking(null);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-neutral-900/75 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
          className="relative w-full max-w-2xl bg-white border border-[#D4AF37]/35 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        >
          {/* Top Gold Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-600 flex-shrink-0" />

          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-gray-150 flex items-center justify-between bg-[#FAF9F5] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 text-[#B8860B]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-gray-900 font-bold leading-tight">
                  {language === 'ko' ? '비공개 상담 및 진료 예약' : 'Private Appointment Reservation'}
                </h3>
                <p className="text-[11px] font-mono text-[#B8860B] uppercase tracking-wider mt-0.5">
                  {step === 1 && (language === 'ko' ? '1단계: 날짜 및 시간 선택' : 'Step 1 of 2: Select Date & Time')}
                  {step === 2 && (language === 'ko' ? '2단계: 환자 정보 입력' : 'Step 2 of 2: Patient Details')}
                  {step === 3 && (language === 'ko' ? '예약 완료 확인서' : 'Reservation Confirmation')}
                </p>
              </div>
            </div>

            {/* Close Modal Button */}
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Content Body */}
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 flex-1">

            {/* STEP 1: SELECT DATE & TIME */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Treatment Protocol Selection Bar */}
                <div className="bg-[#FAF9F5] border border-[#D4AF37]/30 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#B8860B] font-bold">
                      {language === 'ko' ? '선택된 시술 프로그램' : 'Selected Treatment Protocol'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                      className="text-[11px] font-mono font-semibold text-[#B8860B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showServiceDropdown ? 'Close Selector' : 'Change Protocol'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {selectedService && !showServiceDropdown && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <span className="font-serif font-bold text-gray-900 text-sm">{selectedService.name}</span>
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                        <span>{selectedService.duration} Mins</span>
                        {showPrices && <span className="text-[#B8860B] font-bold">${selectedService.price}</span>}
                      </div>
                    </div>
                  )}

                  {/* Dropdown to change treatment */}
                  {showServiceDropdown && (
                    <div className="pt-2 border-t border-gray-200 space-y-1.5 max-h-48 overflow-y-auto">
                      {services.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setSelectedService(s);
                            setShowServiceDropdown(false);
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            selectedService?.id === s.id
                              ? 'border-[#D4AF37] bg-amber-500/10 text-gray-900 font-bold'
                              : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <span className="font-serif">{s.name}</span>
                          <span className="font-mono text-[#B8860B]">
                            {showPrices ? `$${s.price}` : `${s.duration}m`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Grid */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gray-700 font-bold mb-3">
                    <CalendarDays className="w-4 h-4 text-[#B8860B]" />
                    <span>{language === 'ko' ? '1. 진료 예약 날짜 선택' : '1. Choose Consultation Date'}</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableDates.map((d) => {
                      const isSelected = selectedDate === d.dateString;
                      return (
                        <div
                          key={d.dateString}
                          onClick={() => setSelectedDate(d.dateString)}
                          className={`border rounded-xl p-2.5 text-center cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#D4AF37] bg-amber-500/10 shadow-sm ring-2 ring-[#D4AF37]/30'
                              : 'border-gray-200 bg-[#FAF9F5]/60 hover:border-gray-300 hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <span className="block text-[10px] font-mono text-gray-500 uppercase font-semibold">
                            {d.dayName}
                          </span>
                          <span className="block text-lg font-serif font-bold text-gray-800 my-0.5">
                            {d.dayNum}
                          </span>
                          <span className="block text-[10px] font-mono text-[#B8860B] font-semibold">
                            {d.monthName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gray-700 font-bold mb-3">
                    <Clock className="w-4 h-4 text-[#B8860B]" />
                    <span>{language === 'ko' ? '2. 진료 희망 시간 선택' : '2. Select Preferred Time Slot'}</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`border rounded-xl py-2.5 px-2 text-center cursor-pointer transition-all text-xs font-mono ${
                            isSelected
                              ? 'border-[#D4AF37] bg-[#D4AF37] text-white font-bold shadow-sm'
                              : 'border-gray-200 bg-[#FAF9F5]/60 hover:border-gray-300 text-gray-700 hover:bg-white'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selection Status Banner */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-gray-600 font-sans text-center sm:text-left">
                    {selectedDate && selectedTime ? (
                      <span>
                        {language === 'ko' ? '선택 일시: ' : 'Selected Schedule: '}
                        <strong className="text-[#B8860B] font-mono">{getFormatDate(selectedDate)}</strong> at <strong className="text-[#B8860B] font-mono">{selectedTime}</strong>
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        {language === 'ko' ? '예약 날짜와 시간을 모두 선택해주세요.' : 'Please select both a date and time slot.'}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(2)}
                    className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-mono font-bold transition-all shadow-sm flex items-center gap-2 ${
                      selectedDate && selectedTime
                        ? 'bg-[#D4AF37] hover:bg-[#B8860B] text-white cursor-pointer active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{language === 'ko' ? '다음 단계 (정보 입력) →' : 'Continue to Details →'}</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: FILL PATIENT INFORMATION */}
            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-gray-150">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#B8860B]" />
                    <h4 className="font-serif font-bold text-gray-900 text-base sm:text-lg">
                      {language === 'ko' ? '환자 인적사항 입력' : 'Patient Information Details'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-mono text-[#B8860B] hover:underline cursor-pointer"
                  >
                    &larr; {language === 'ko' ? '일정 변경' : 'Back to Schedule'}
                  </button>
                </div>

                {/* Selected Schedule Recap Banner */}
                <div className="p-3 bg-[#FAF9F5] border border-[#D4AF37]/30 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Appointment Slot</span>
                    <span className="font-serif font-bold text-gray-900">{selectedService?.name}</span>
                  </div>
                  <div className="text-right font-mono text-[#B8860B] font-semibold">
                    <div>{getFormatDate(selectedDate)}</div>
                    <div>{selectedTime}</div>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 font-mono mb-1.5 font-bold">
                        {language === 'ko' ? '성함' : 'Full Name'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full bg-[#FAF9F5] border border-gray-250 rounded-xl py-2.5 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 font-mono mb-1.5 font-bold">
                        {language === 'ko' ? '연락처' : 'Phone Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 019-2834"
                        className="w-full bg-[#FAF9F5] border border-gray-250 rounded-xl py-2.5 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-mono mb-1.5 font-bold">
                      {language === 'ko' ? '이메일 주소' : 'Email Address'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="e.g. eleanor@example.com"
                      className="w-full bg-[#FAF9F5] border border-gray-250 rounded-xl py-2.5 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-mono mb-1.5 font-bold">
                      {language === 'ko' ? '피부 고민 및 요청사항 (선택)' : 'Aesthetic Concerns or Notes (Optional)'}
                    </label>
                    <textarea
                      rows={3}
                      value={patientConcerns}
                      onChange={(e) => setPatientConcerns(e.target.value)}
                      placeholder={language === 'ko' ? '특이사항이나 집중 치료를 원하시는 부위를 기재해주세요...' : 'Describe any particular skin areas or sensitivities...'}
                      className="w-full bg-[#FAF9F5] border border-gray-250 rounded-xl py-2.5 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
                    />
                  </div>

                  {/* Disclaimer Box */}
                  <div className="bg-[#FAF9F5] border border-gray-200 p-3.5 rounded-xl flex gap-3 text-gray-600">
                    <ShieldAlert className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      {language === 'ko'
                        ? '온라인 예약 시 즉시 결제는 진행되지 않으며, 시술 후 원내에서 안내드립니다.'
                        : 'No online payment is processed today. Payment and billing occur after your direct in-person consultation.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-150 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-xl text-xs font-mono text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      {language === 'ko' ? '이전' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-mono font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      {language === 'ko' ? '예약 확정하기' : 'Confirm Reservation'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: RECEIPT / CONFIRMATION */}
            {step === 3 && lastSubmittedBooking && (
              <div className="text-center py-4 space-y-5 animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold">
                    {language === 'ko' ? '예약 신청이 접수되었습니다!' : 'Reservation Order Confirmed!'}
                  </h4>
                  <p className="text-xs text-[#B8860B] font-mono tracking-wider uppercase mt-1 font-bold">
                    ID: {lastSubmittedBooking.id}
                  </p>
                </div>

                {/* Ticket Receipt Box */}
                <div className="bg-[#FAF9F5] border border-gray-200 rounded-xl p-4 sm:p-5 text-left max-w-md mx-auto space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-mono text-gray-500 uppercase text-[10px]">Treatment</span>
                    <span className="font-serif font-bold text-gray-900">{lastSubmittedBooking.serviceName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-mono text-gray-500 uppercase text-[10px]">Scheduled Date</span>
                    <span className="font-mono font-semibold text-[#B8860B]">{getFormatDate(lastSubmittedBooking.date)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-mono text-gray-500 uppercase text-[10px]">Time Slot</span>
                    <span className="font-mono font-semibold text-gray-900">{lastSubmittedBooking.timeSlot}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-mono text-gray-500 uppercase text-[10px]">Patient Name</span>
                    <span className="font-semibold text-gray-900">{lastSubmittedBooking.patientName}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-mono">
                    <span className="text-[#B8860B] font-bold">Estimated Cost</span>
                    <span className="font-bold text-gray-900">{showPrices ? `$${lastSubmittedBooking.totalPrice}` : 'By Consultation'}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed font-sans">
                  {language === 'ko'
                    ? '예약 정보가 데이터베이스 및 담당 실장에게 전달되었습니다. 지정하신 전화번호로 확인 안내 연락을 드릴 예정입니다.'
                    : 'A calendar hold reservation has been logged. Our concierge team will reach out via phone/email shortly.'}
                </p>

                {/* Status indicator */}
                <div className="pt-2">
                  <button
                    onClick={handleClose}
                    className="bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-mono font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {language === 'ko' ? '확인 및 창 닫기' : 'Done & Close Window'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
