import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag, GraduationCap } from 'lucide-react';
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '../context/SiteSettingsContext';

const colorPresets = {
  amber: {
    badgeIcon: Sparkles,
    badgeClass: 'text-amber-700 bg-amber-100/80 border-amber-200',
    buttonClass: 'bg-[#ff2056] hover:bg-[#e01648] text-white shadow-[#ff2056]/20',
    bgClass: 'bg-gradient-to-br from-[#faf7f2] via-[#f5efe6] to-[#ebe1d3]/40 border-[#e8dfd3]',
    gradientFade: 'from-[#faf7f2]',
  },
  emerald: {
    badgeIcon: Tag,
    badgeClass: 'text-emerald-800 bg-emerald-100/80 border-emerald-200',
    buttonClass: 'bg-slate-900 hover:bg-black text-white shadow-slate-900/20',
    bgClass: 'bg-gradient-to-br from-[#f8f9fa] via-[#f1f4f6] to-[#e5ebf0]/50 border-[#dde3e8]',
    gradientFade: 'from-[#f8f9fa]',
  },
  rose: {
    badgeIcon: GraduationCap,
    badgeClass: 'text-rose-700 bg-rose-100/80 border-rose-200',
    buttonClass: 'bg-[#ff2056] hover:bg-[#e01648] text-white shadow-[#ff2056]/20',
    bgClass: 'bg-gradient-to-br from-[#fdf6f7] via-[#faebed] to-[#f4d9dd]/40 border-[#f2d4d9]',
    gradientFade: 'from-[#fdf6f7]',
  },
};

const PromoBanners = () => {
  const { settings } = useSiteSettings();
  const rawBanners = settings?.promoBanners?.length
    ? settings.promoBanners.filter((b) => b.active !== false)
    : DEFAULT_SITE_SETTINGS.promoBanners;

  const dynamicBanners = (rawBanners.length > 0 ? rawBanners : DEFAULT_SITE_SETTINGS.promoBanners).map((b, i) => {
    const colorKey = b.badgeColor || (i === 0 ? 'amber' : i === 1 ? 'emerald' : 'rose');
    const preset = colorPresets[colorKey] || colorPresets.amber;
    return {
      ...b,
      badgeIcon: preset.badgeIcon,
      badgeClass: preset.badgeClass,
      buttonClass: preset.buttonClass,
      bgClass: preset.bgClass,
      gradientFade: preset.gradientFade,
    };
  });

  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const banners = dynamicBanners;

  // Observe if section is visible in viewport so it only animates when user is looking at it
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Purely scroll container internally without ever touching the page vertical scroll
  const scrollToSlide = (idx) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[idx];
      if (child) {
        // Calculate offset strictly inside the container
        const targetLeft = child.offsetLeft - container.offsetLeft;
        container.scrollTo({
          left: targetLeft,
          behavior: 'smooth',
        });
      } else {
        const cardWidth = container.clientWidth * 0.84;
        container.scrollTo({
          left: idx * (cardWidth + 16),
          behavior: 'smooth',
        });
      }
      setActiveIndex(idx);
    }
  };

  // Track active slide index on user horizontal swipe
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.84));
      setActiveIndex(Math.min(banners.length - 1, Math.max(0, index)));
    }
  };

  // Auto-scroll loop ONLY when section is visible and viewport is mobile (< 768px)
  useEffect(() => {
    if (isPaused || !isInView) return;

    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768 && scrollRef.current) {
        const nextIndex = (activeIndex + 1) % banners.length;
        scrollToSlide(nextIndex);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, isInView, banners.length]);

  return (
    <section ref={sectionRef} className="py-6 sm:py-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Carousel Container: Mobile Horizontal Auto-Scroll (snap-x) | Desktop Grid (md:grid-cols-3) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 4000)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar pb-3 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {banners.map((item) => {
            const Icon = item.badgeIcon;
            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 min-h-[200px] sm:min-h-[220px] md:min-h-[240px] flex ${item.bgClass} w-[84vw] sm:w-[320px] md:w-auto shrink-0 md:shrink snap-center`}
              >
                {/* Text Content */}
                <div className="relative z-10 w-[58%] sm:w-[56%] p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                  <div className="space-y-1.5 sm:space-y-2">
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase border shadow-2xs backdrop-blur-xs ${item.badgeClass}`}>
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.badge}</span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
                      {item.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2 sm:pt-3">
                    <Link
                      to={item.link}
                      className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm hover:shadow group/btn ${item.buttonClass}`}
                    >
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Fashion Model Image with Smooth Gradient Blend */}
                <div className="absolute right-0 top-0 bottom-0 w-[46%] sm:w-[48%] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Seamless Left Fade Gradient */}
                  <div
                    className={`absolute inset-y-0 left-0 w-12 bg-gradient-to-r ${item.gradientFade} to-transparent pointer-events-none`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Pagination Dots Indicator */}
        <div className="flex md:hidden items-center justify-center gap-1.5 pt-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsPaused(true);
                scrollToSlide(idx);
                setTimeout(() => setIsPaused(false), 4000);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-6 bg-[#ff2056]'
                  : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PromoBanners;
