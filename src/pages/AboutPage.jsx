import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  ShoppingBag,
  Check,
  Star,
  Award,
} from 'lucide-react';
import FAQSection from '../components/FAQSection';

const values = [
  {
    num: '01',
    title: 'Pure Fabric Standards',
    desc: 'Every piece is crafted from 100% combed organic cotton, natural linen, or fine silk. Breathable, durable, and shrink-resistant for everyday wear.',
  },
  {
    num: '02',
    title: 'Ergonomic Modern Fitting',
    desc: 'Designed with precision tailored cuts crafted specifically for South Asian ergonomics, delivering an effortlessly sharp and comfortable fit.',
  },
  {
    num: '03',
    title: 'Customer-Centric Promises',
    desc: 'Cash on delivery across all 64 districts with instant parcel inspection, 7-day doorstep exchange, and 24/7 support.',
  },
];

const stats = [
  { value: '50,000+', label: 'Happy Customers' },
  { value: '100%', label: 'Authentic Fabrics' },
  { value: '64', label: 'Districts Covered' },
  { value: '4.9 ★', label: 'Average Rating' },
];

const AboutPage = () => {
  return (
    <div className="bg-white text-slate-900 selection:bg-[#ff2056] selection:text-white">
      
      {/* 1. MINIMALIST CLEAN HERO */}
      <section className="pt-14 pb-12 sm:pt-20 sm:pb-16 bg-gradient-to-b from-stone-50/80 via-white to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#ff2056] bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100/80">
            About StyleHub
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.2]">
            Modern fashion designed for <br className="hidden sm:inline" />
            <span className="text-[#ff2056]">uncompromising quality & comfort.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed pt-1">
            StyleHub is an independent fashion brand founded on the belief that everyday clothing should look sharp, feel effortless, and stand the test of time.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              to="/shop"
              className="bg-[#ff2056] hover:bg-[#e01648] text-white px-7 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE STORY & IMAGE SHOWCASE (Sleek Two-Column) */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-slate-50 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                  alt="StyleHub Craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Bangladeshi Heritage</span>
                    <span className="text-[11px] text-gray-500">Fine Cotton & Artisanal Wear</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#ff2056] bg-rose-50 px-2.5 py-1 rounded-lg">
                    Est. 2024
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Our Standard
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                Redefining Everyday Attire with Thoughtful Craftsmanship
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                From luxury polo t-shirts and breathable casual linen shirts to designer festive Panjabis, we prioritize clean silhouettes, premium raw textiles, and honest pricing.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                We believe in conscious creation: zero harmful dyes, thorough pre-shrink treatments, and packaging engineered to reduce waste.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 border-t border-gray-100">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#ff2056]" />
                    <span>Quality First</span>
                  </h4>
                  <p className="text-[11px] text-gray-500">Rigorous 3-step quality inspection.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#ff2056]" />
                    <span>Nationwide COD</span>
                  </h4>
                  <p className="text-[11px] text-gray-500">Fast delivery across 64 districts.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CLEAN 3 VALUES CARDS */}
      <section className="py-14 sm:py-16 bg-slate-50/70 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff2056]">
              Core Principles
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Choose StyleHub
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.num}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-xs hover:border-rose-200 hover:shadow-md transition-all space-y-3"
              >
                <span className="text-xs font-black text-[#ff2056] font-mono tracking-wider bg-rose-50 px-2.5 py-1 rounded-md">
                  {v.num}
                </span>
                <h4 className="font-serif font-bold text-base text-slate-900">
                  {v.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATS BAR */}
      <section className="py-10 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-800">
          {stats.map((s, index) => (
            <div key={s.label} className={index > 0 ? 'pl-4 sm:pl-6' : ''}>
              <p className="text-2xl sm:text-3xl font-serif font-black text-white">
                {s.value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTEGRATED FAQ SECTION */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Quick answers to common questions about our products, delivery, and returns."
      />

    </div>
  );
};

export default AboutPage;
