import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  Truck,
  RotateCcw,
  CreditCard,
  ShieldCheck,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const defaultFaqs = [
  {
    id: 'faq-1',
    category: 'Orders & Delivery',
    icon: Truck,
    question: 'How long does delivery take across Bangladesh?',
    answer:
      'Delivery inside Dhaka city usually takes 24 to 48 hours. For areas outside Dhaka (sub-districts & all 64 districts), delivery typically takes 2 to 4 business days via our trusted courier partners (Steadfast, Pathao & RedX).',
  },
  {
    id: 'faq-2',
    category: 'Orders & Delivery',
    icon: Truck,
    question: 'How can I track my active order?',
    answer:
      'Once your order is confirmed, you will receive real-time status updates in your StyleHub User Dashboard under "My Orders". You will also receive an SMS with the courier tracking ID once shipped.',
  },
  {
    id: 'faq-3',
    category: 'Payments & Security',
    icon: CreditCard,
    question: 'What payment methods do you support? Is Cash on Delivery available?',
    answer:
      'Yes! We offer 100% Cash on Delivery (COD) all over Bangladesh. We also accept instant online payments via bKash, Nagad, Rocket, Visa, Mastercard, and Debit/Credit cards with bank-grade 256-bit encryption.',
  },
  {
    id: 'faq-4',
    category: 'Returns & Exchange',
    icon: RotateCcw,
    question: 'What is your return & exchange policy?',
    answer:
      'We offer an easy 7-day hassle-free return and exchange policy! If you receive a defective item, wrong size, or are unsatisfied with the fit, simply initiate a return from your dashboard or contact our WhatsApp helpline (+880 1700-000000).',
  },
  {
    id: 'faq-5',
    category: 'Product & Quality',
    icon: ShieldCheck,
    question: 'Are the products 100% authentic and premium quality?',
    answer:
      'Absolutely. Every StyleHub garment is crafted from 100% combed organic cotton, authentic linen, or pure silk fabrics. All items undergo a strict 3-stage quality inspection before packaging.',
  },
  {
    id: 'faq-6',
    category: 'Product & Quality',
    icon: Sparkles,
    question: 'How do I choose the correct size for me?',
    answer:
      'Every product details page includes an accurate Size Guide (S, M, L, XL, XXL) with chest and length measurements in inches. If you are between two sizes, we recommend ordering one size larger for a relaxed fit.',
  },
  {
    id: 'faq-7',
    category: 'Payments & Security',
    icon: CreditCard,
    question: 'Are there any hidden delivery or handling charges?',
    answer:
      'No hidden charges at all! Standard delivery is ৳60 inside Dhaka and ৳120 outside Dhaka. We also offer Free Delivery on orders over ৳2,000!',
  },
  {
    id: 'faq-8',
    category: 'Returns & Exchange',
    icon: PhoneCall,
    question: 'How do I contact customer support if I face an issue?',
    answer:
      'Our dedicated customer support team is available 7 days a week from 9:00 AM to 11:00 PM. You can reach us via live chat, WhatsApp hotline, email support@stylehub.com, or phone call.',
  },
];

const FAQSection = ({
  title = 'Frequently Asked Questions',
  subtitle = 'Find quick answers to common questions about orders, delivery, sizes, and returns.',
  defaultCategory = 'All',
  showCategories = true,
  showSearch = true,
  items,
  className = '',
}) => {
  const { settings } = useSiteSettings();
  const activeItems = items || (settings?.pageContent?.faq?.length ? settings.pageContent.faq : defaultFaqs);

  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState(['faq-1', 'faq-3']); // First and third open by default

  const categories = useMemo(() => {
    const unique = Array.from(new Set(activeItems.map((item) => item.category || 'General')));
    return ['All', ...unique];
  }, [activeItems]);

  const filteredFaqs = useMemo(() => {
    return activeItems.filter((faq) => {
      const matchesCategory =
        activeCategory === 'All' || (faq.category || 'General') === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        (faq.category && faq.category.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeItems, activeCategory, searchQuery]);

  const toggleFaq = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className={`py-12 sm:py-16 md:py-20 bg-white border-t border-gray-100 ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-extrabold tracking-widest text-[#ff2056] bg-rose-50 rounded-full uppercase border border-rose-100 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#ff2056]" />
            <span>Help Center & FAQ</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>

        {/* Search Bar (Optional) */}
        {showSearch && (
          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic (e.g. delivery, bKash, size, return)..."
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#ff2056] focus:ring-2 focus:ring-[#ff2056]/20 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs text-gray-400 hover:text-gray-600 font-bold px-2 py-0.5"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Category Pills (Optional) */}
        {showCategories && categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-xl mx-auto mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs scale-102'
                    : 'bg-slate-50 text-gray-600 hover:bg-slate-100 hover:text-slate-900 border border-gray-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
              <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No questions found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching with a different keyword or view all questions.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              const IconComp = faq.icon || HelpCircle;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-rose-200/80 shadow-sm'
                      : 'bg-slate-50/70 hover:bg-white border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-rose-50 text-[#ff2056]'
                            : 'bg-white text-gray-500 shadow-2xs'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 block">
                          {faq.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#ff2056] text-white rotate-180'
                          : 'bg-white text-gray-400 border border-gray-100'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                      <div className="pl-11 pr-2">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Banner Footer */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-7 bg-slate-900 rounded-2xl sm:rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Subtle background glow accent */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#ff2056]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 text-center sm:text-left z-10 w-full sm:w-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#ff2056] shrink-0 border border-white/10 shadow-inner">
              <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-1 sm:space-y-0.5">
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Still have questions?
              </h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xs sm:max-w-none">
                Our support team is available 24/7 to help you with your order.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#ff2056] hover:bg-[#e01648] text-white px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-[#ff2056]/25 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98] z-10"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
