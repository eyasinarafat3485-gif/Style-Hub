import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const slides = [
  {
    badge: "NEW SEASON 2025",
    titleStart: "STYLE THAT SPEAKS ",
    titleHighlight: "YOU",
    subtitle: "Premium quality outfits for every occasion. Comfort. Style. Confidence.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80",
    bgGradient: "from-stone-100 via-rose-50/40 to-amber-50/30",
  },
  {
    badge: "FESTIVE COLLECTION",
    titleStart: "ELEGANCE IN EVERY ",
    titleHighlight: "THREAD",
    subtitle: "Exclusive designer Panjabis & traditional wear for Jummah, Eid & celebrations.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80",
    bgGradient: "from-amber-50/60 via-stone-100 to-rose-50/30",
  },
  {
    badge: "MODERN STREETWEAR",
    titleStart: "COMFORT MEETS ",
    titleHighlight: "TRENDS",
    subtitle: "Oversized t-shirts, polo tops and denim crafted for modern urban lifestyle.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80",
    bgGradient: "from-stone-100 via-gray-50 to-rose-50/50",
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-stone-100 border-b border-gray-200">
      <div className={`transition-all duration-700 bg-gradient-to-r ${slide.bgGradient} py-12`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[460px]">

          {/* Right Hero Image Frame */}
          <div className="order-1 lg:order-2 lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80">
              <img
                src={slide.image}
                alt={slide.badge}
                className="w-full h-full object-cover object-top transition-transform duration-1000 transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Left Hero Content */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 sm:space-y-6 z-10 animate-fade-in pl-2 lg:pl-6 text-center lg:text-left">
            <span className="inline-block px-3.5 py-1 text-xs font-extrabold tracking-widest text-[#ff2056] bg-rose-100/90 rounded-sm uppercase">
              {slide.badge}
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              {slide.titleStart}
              <span className="text-[#ff2056] underline decoration-rose-400 decoration-wavy decoration-2">
                {slide.titleHighlight}
              </span>
            </h1>

            <p className="text-xs sm:text-base text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              {slide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                to="/men"
                className="bg-[#ff2056] hover:bg-[#e01648] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                Shop Men
              </Link>
              <Link
                to="/women"
                className="border-2 border-gray-800 hover:border-[#ff2056] text-gray-800 hover:text-[#ff2056] px-6 sm:px-7 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-bold tracking-wide transition-all bg-white/60 hover:bg-white"
              >
                Shop Women
              </Link>
            </div>

            {/* Features check list */}
            <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#ff2056]" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#ff2056]" />
                <span>Trendy Designs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#ff2056]" />
                <span>Best Prices</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${current === idx ? 'bg-[#ff2056] w-6' : 'bg-gray-400/60 hover:bg-gray-600'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
