import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Shield, FileText, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'treatment' | 'policy' | 'general';
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'treatment',
    question: "What is the clinic's philosophy on natural-looking results?",
    answer: "At our clinic, we subscribe strictly to the 'Undetectable Enhancements' philosophy. Our objective is to restore symmetry, improve texture, and enhance natural features without introducing synthetic stiffness or over-volumizing. Your dynamic facial markers and natural character are preserved with utmost care."
  },
  {
    category: 'treatment',
    question: "How should I prepare for my cosmetic injectable session?",
    answer: "To minimize bruising, we recommend avoiding alcohol, blood thinners (such as aspirin, ibuprofen, or fish oil), and high doses of Vitamin E for at least 48 to 72 hours before your appointment. Please arrive well-hydrated, and have a light meal prior to your session."
  },
  {
    category: 'policy',
    question: "What is your cancellation and rescheduling policy?",
    answer: "To ensure slow-paced, designated time slots for every client, we require at least 24 hours of notice for any cancellation or rescheduling of appointments. Cancellations within this window or failure to attend a scheduled session may forfeit the holding fee."
  },
  {
    category: 'general',
    question: "Will my cosmetic practitioner be a certified medical professional?",
    answer: "Absolutely. All clinical procedures inside our lounges are personally performed or directly supervised by Dr. Choi Sung Su and licensed Registered Nurses who hold elite certifications in facial aesthetics and dermal safety. We strictly select premium, FDA-approved therapeutic ingredients and FDA-cleared devices."
  },
  {
    category: 'treatment',
    question: "What should I expect regarding post-treatment downtime?",
    answer: "Most treatments, including our refined dermal therapies and skin-polishing peels, involve little to no downtime. Minor localized swelling or faint redness can occur, but typically subsides within a few hours to two days. Personalized recovery instructions and high-grade aftercare creams are provided after every session."
  },
  {
    category: 'general',
    question: "Can I customize my treatment protocol dynamically on the day of?",
    answer: "Yes. Every appointment initiates with a bespoke clinical consultation. During this pre-treatment discussion, your expert practitioner will analyze your skin structure, answer questions, and custom-tailor the protocol to match your immediate aesthetic desires."
  },
  {
    category: 'policy',
    question: "How does local reservation data security work?",
    answer: "Your reservations and patient files are securely saved locally on your client device using industry-standard disk keys. We honor absolute privacy: zero personal contact information or aesthetic maps are synchronized to shared databases, unless you explicitly request a medical record migration."
  }
];

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'treatment' | 'policy' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFAQs = FAQ_ITEMS.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div id="faq-section" className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#D4AF37]/2 blur-3xl rounded-full pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-gray-150 pb-6">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold font-mono">CLIENT ASSISTANCE</span>
          <h3 className="text-3xl md:text-4xl font-serif text-[#333333] mt-2 font-light">Frequently Asked Inquiries</h3>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed font-sans">
            Review detailed guidelines on cosmetic protocols, safety oversight, and clinic reservation agreements.
          </p>
        </div>

        {/* Custom Search field */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-sans outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] bg-[#F9F9F7]/50"
          />
        </div>
      </div>

      {/* Categories Toggle */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'all', label: 'All Inquiries', icon: HelpCircle },
          { id: 'treatment', label: 'Treatments & Recovery', icon: Shield },
          { id: 'policy', label: 'Booking & Policies', icon: Calendar },
          { id: 'general', label: 'Staff & General', icon: FileText }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setExpandedIndex(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wide transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#D4AF37] text-white border-[#D4AF37] shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-[#B8860B] bg-[#F9F9F7] border-gray-200 hover:bg-[#F9F9F7]/80'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all duration-300 ${
                  isExpanded
                    ? 'border-[#D4AF37] bg-amber-500/[0.01] shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full flex items-center justify-between text-left p-5 gap-4 font-serif text-gray-800 text-sm sm:text-base font-semibold cursor-pointer"
                >
                  <span className="flex-1 leading-relaxed">{faq.question}</span>
                  <div className={`p-1.5 rounded-lg border border-gray-150 transition-all ${isExpanded ? 'bg-[#D4AF37] border-[#D4AF37] text-white' : 'text-gray-400'}`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-sm text-gray-500 font-sans border-t border-gray-100 mt-1 leading-relaxed">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-3xl">
            <HelpCircle className="w-10 h-10 text-gray-350 mx-auto mb-3 text-gray-300 stroke-[1.5px]" />
            <p className="text-sm font-serif text-gray-500">No matches found for "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="text-[#B8860B] text-xs font-mono underline hover:no-underline mt-2 cursor-pointer"
            >
              Reset filters & search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
