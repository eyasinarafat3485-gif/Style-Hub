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
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '../context/SiteSettingsContext';

const defaultValues = [
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

const defaultStats = [
  { value: '50,000+', label: 'Happy Customers' },
  { value: '100%', label: 'Authentic Fabrics' },
  { value: '64', label: 'Districts Covered' },
  { value: '4.9 ★', label: 'Average Rating' },
];

const AboutPage = () => {
  const { settings } = useSiteSettings();
  const about = settings?.pageContent?.aboutUs || DEFAULT_SITE_SETTINGS.pageContent.aboutUs;
  const brandName = settings?.branding?.logoText || 'StyleHub';

  const badge = about?.badge || `About ${brandName}`;
  const heroTitle = about?.heroTitle || 'Modern fashion designed for uncompromising quality & comfort.';
  const heroSubtitle = about?.heroSubtitle || `${brandName} is an independent fashion brand founded on the belief that everyday clothing should look sharp, feel effortless, and stand the test of time.`;
  const heroImage = about?.heroImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80';
  const storyHeading = about?.storyHeading || 'Redefining Everyday Attire with Thoughtful Craftsmanship';
  const storyText1 = about?.storyText1 || 'From luxury polo t-shirts and breathable casual linen shirts to designer festive Panjabis, we prioritize clean silhouettes, premium raw textiles, and honest pricing.';
  const storyText2 = about?.storyText2 || 'We believe in conscious creation: zero harmful dyes, thorough pre-shrink treatments, and packaging engineered to reduce waste.';

  const valuesList = Array.isArray(about?.values) && about.values.length > 0 ? about.values : defaultValues;
  const statsList = Array.isArray(about?.stats) && about.stats.length > 0 ? about.stats : defaultStats;

  return (
    <div className="bg-white text-slate-900 selection:bg-[#ff2056] selection:text-white">

      {/* 1. COMPACT HERO SECTION */}
      <section className="py-6 sm:py-10 bg-gradient-to-b from-stone-50/80 via-white to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-2.5 sm:space-y-3">
          <span className="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#ff2056] bg-rose-50 px-3 py-0.5 rounded-full border border-rose-100/80">
            {badge}
          </span>

          <h1 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {heroTitle}
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 max-w-lg sm:max-w-xl mx-auto font-medium leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="pt-1.5 flex items-center justify-center gap-3">
            <Link
              to="/shop"
              className="bg-[#ff2056] hover:bg-[#e01648] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Explore Products</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE STORY & IMAGE SHOWCASE (Compact Two-Column) */}
      <section className="py-6 sm:py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">

            {/* Left Column: Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-slate-50 aspect-[16/10] sm:aspect-[4/3]">
                <img
                  src={heroImage}
                  alt={`${brandName} Craftsmanship`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-900 block">Bangladeshi Heritage</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-500">Fine Cotton & Artisanal Wear</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-[#ff2056] bg-rose-50 px-2 py-0.5 rounded-md">
                    Est. 2024
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Our Standard
              </span>
              <h2 className="font-serif text-base sm:text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
                {storyHeading}
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                {storyText1}
              </p>
              {storyText2 && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {storyText2}
                </p>
              )}

              <div className="pt-2 grid grid-cols-2 gap-3 border-t border-gray-100">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#ff2056]" />
                    <span>Quality First</span>
                  </h4>
                  <p className="text-[10px] text-gray-500">Rigorous 3-step inspection.</p>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#ff2056]" />
                    <span>Nationwide COD</span>
                  </h4>
                  <p className="text-[10px] text-gray-500">Fast delivery to 64 districts.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CLEAN 3 VALUES CARDS */}
      <section className="py-6 sm:py-10 bg-slate-50/70 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-5 space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#ff2056]">
              Core Principles
            </span>
            <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900">
              Why Choose {brandName}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {valuesList.map((v, i) => (
              <div
                key={v.num || i}
                className="bg-white p-3.5 sm:p-5 rounded-xl border border-gray-200/80 shadow-2xs hover:border-rose-200 transition-all space-y-1.5"
              >
                <span className="text-[9px] sm:text-[10px] font-black text-[#ff2056] font-mono tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                  {v.num || `0${i + 1}`}
                </span>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900">
                  {v.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATS BAR */}
      <section className="py-5 sm:py-7 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center divide-x divide-slate-800">
          {statsList.map((s, index) => (
            <div key={s.label || index} className={index > 0 ? 'pl-2 sm:pl-4' : ''}>
              <p className="text-lg sm:text-2xl font-serif font-black text-white">
                {s.value}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-medium">
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
        className="py-6 sm:py-10"
      />

    </div>
  );
};

export default AboutPage;
