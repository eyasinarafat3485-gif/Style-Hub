import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Truck,
  Award,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  MapPin,
  Flame,
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white text-slate-800 animate-fadeIn">
      {/* 1. Hero Header Banner */}
      <section className="relative bg-gradient-to-br from-stone-50 via-rose-50/40 to-amber-50/30 py-12 sm:py-16 md:py-20 border-b border-gray-200/80 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-3 sm:space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-extrabold tracking-widest text-[#ff2056] bg-rose-100/80 rounded-full uppercase border border-rose-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#ff2056]" />
            <span>Our Heritage & Craftsmanship</span>
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Redefine Your Style With <span className="text-[#ff2056]">StyleHub</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Crafting premium, comfortable, and trendy fashion wear tailored for modern lifestyles across Bangladesh and beyond.
          </p>
        </div>
      </section>

      {/* 2. Brand Story & Vision */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="StyleHub Studio Showcase"
                className="w-full h-[280px] sm:h-[380px] md:h-[440px] object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-2 sm:right-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-xl max-w-[240px] sm:max-w-xs border border-slate-700 hidden sm:block">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>100% Authentic Quality</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Dedicated to premium fabric selection and Bangladeshi traditional craftsmanship.
              </p>
            </div>
          </div>

          {/* Story Content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff2056] bg-rose-50 px-2.5 py-1 rounded-md">
              Who We Are
            </span>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
              Elevating Fashion Experience with Elegance & Comfort
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              Founded with a vision to deliver premium quality attire at accessible prices, StyleHub brings together contemporary streetwear, authentic ethnic wear like designer Panjabis, and everyday casual outfits.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              Every garment in our catalog undergoes rigorous quality checks to ensure breathability, perfect fitting, and long-lasting fabric durability for any occasion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#ff2056] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Premium Fabrics</h4>
                  <p className="text-[11px] text-gray-500">Hand-picked cotton & luxury textiles</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#ff2056] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">64 Districts Shipping</h4>
                  <p className="text-[11px] text-gray-500">Fast Cash on Delivery across BD</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="py-12 sm:py-16 bg-gray-50/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-lg mx-auto mb-8 sm:mb-12 space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff2056]">
              Core Pillars
            </span>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">
              Why Customers Love Us
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              The commitments that define our standard of excellence in fashion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-rose-200 transition-all text-center space-y-2">
              <div className="w-10 h-10 bg-rose-50 text-[#ff2056] rounded-xl flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                Uncompromised Quality
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                We source top-tier fabrics and inspect stitches to maintain superior quality in every product.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-rose-200 transition-all text-center space-y-2">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                Modern Aesthetic
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                Our designers blend global fashion trends with local style preferences to keep you ahead.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-rose-200 transition-all text-center space-y-2">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                Express Delivery
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                Quick processing and reliable door-step delivery nationwide with live tracking support.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-rose-200 transition-all text-center space-y-2">
              <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mx-auto shadow-xs">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                Customer First
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                Dedicated support team ready to assist with sizing, exchange, or order questions anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stats & Milestone Banner (Balanced, Refined Typography) */}
      <section className="bg-gradient-to-r from-[#ff2056] via-[#ea1447] to-[#d6103e] text-white py-8 sm:py-10 md:py-12 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-x divide-rose-400/20">
          <div className="space-y-0.5">
            <p className="text-xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
              50,000+
            </p>
            <p className="text-[11px] sm:text-xs md:text-sm text-rose-100 font-semibold tracking-wide">
              Happy Customers
            </p>
          </div>
          <div className="space-y-0.5 pl-4 sm:pl-6">
            <p className="text-xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
              100%
            </p>
            <p className="text-[11px] sm:text-xs md:text-sm text-rose-100 font-semibold tracking-wide">
              Authentic Fabric
            </p>
          </div>
          <div className="space-y-0.5 pl-4 sm:pl-6">
            <p className="text-xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
              64
            </p>
            <p className="text-[11px] sm:text-xs md:text-sm text-rose-100 font-semibold tracking-wide">
              Districts Cover
            </p>
          </div>
          <div className="space-y-0.5 pl-4 sm:pl-6">
            <p className="text-xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight flex items-center justify-center gap-1">
              <span>4.9</span>
              <span className="text-amber-300 text-lg sm:text-2xl">★</span>
            </p>
            <p className="text-[11px] sm:text-xs md:text-sm text-rose-100 font-semibold tracking-wide">
              Average Rating
            </p>
          </div>
        </div>
      </section>

      {/* 5. Call to Action Section */}
      <section className="py-12 sm:py-16 md:py-20 text-center bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff2056] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Start Your Journey
          </span>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Ready to Refresh Your Wardrobe?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            Explore our latest arrivals, trending outfits, and exclusive festive collections today.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#ff2056] hover:bg-[#d6103e] text-white px-7 py-3 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide transition-all shadow-md shadow-rose-600/25 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
