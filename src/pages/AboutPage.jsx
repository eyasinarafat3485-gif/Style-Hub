import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Truck, Award, ArrowRight, Users, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white text-slate-800">
      {/* 1. Hero Header Banner */}
      <section className="relative bg-gradient-to-r from-stone-100 via-rose-50/50 to-amber-50/40 py-16 md:py-24 border-b border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-extrabold tracking-widest text-[#ff2056] bg-rose-100/90 rounded-md uppercase border border-rose-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ff2056]" />
            <span>Our Story & Passion</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-4">
            Redefine Your Style With <span className="text-[#ff2056]">StyleHub</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Crafting premium, comfortable, and trendy fashion wear tailored for modern lifestyles across Bangladesh and beyond.
          </p>
        </div>
      </section>

      {/* 2. Brand Story & Vision */}
      <section className="py-16 md:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="StyleHub Studio Showcase"
                className="w-full h-[400px] md:h-[480px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-[#ff2056] text-white p-5 rounded-xl shadow-xl max-w-xs hidden sm:block">
              <p className="text-2xl font-serif font-extrabold text-white">100%</p>
              <p className="text-xs font-medium text-rose-100 mt-1">Dedicated to quality, premium fabric selection and authentic craftsmanship.</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 leading-snug">
              Elevating Fashion Experience with Elegance & Comfort
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Founded with a vision to deliver premium quality attire at accessible prices, StyleHub brings together contemporary streetwear, authentic ethnic wear like designer Panjabis, and everyday casual outfits.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Every garment in our catalog undergoes rigorous quality checks to ensure breathability, perfect fitting, and long-lasting fabric durability. Whether you're dressing for Friday Jummah, festive celebrations, or casual hangouts, we’ve got you covered.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ff2056] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Premium Fabrics</h4>
                  <p className="text-xs text-gray-500">Hand-picked cotton & luxury textiles</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ff2056] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">64 Districts Shipping</h4>
                  <p className="text-xs text-gray-500">Fast Cash on Delivery across BD</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="py-16 bg-gray-50/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">Why Customers Love Us</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">The pillars that define our commitment to your wardrobe.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-rose-100 text-[#ff2056] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Uncompromised Quality</h3>
              <p className="text-xs text-gray-500 leading-relaxed">We source top-tier fabrics and inspect stitches to maintain superior quality in every product.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-rose-100 text-[#ff2056] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Modern Aesthetic</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Our designers blend global fashion trends with local style preferences to keep you ahead.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-rose-100 text-[#ff2056] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Express Delivery</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Quick processing and reliable door-step delivery nationwide with live tracking support.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-rose-100 text-[#ff2056] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Customer First</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Dedicated support team ready to assist with sizing, exchange, or order questions anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stats Banner */}
      <section className="bg-[#ff2056] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-white">50,000+</p>
            <p className="text-xs sm:text-sm text-rose-100 font-medium mt-1">Happy Customers</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-white">100%</p>
            <p className="text-xs sm:text-sm text-rose-100 font-medium mt-1">Authentic Fabric</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-white">64</p>
            <p className="text-xs sm:text-sm text-rose-100 font-medium mt-1">Districts Cover</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-white">4.9 ★</p>
            <p className="text-xs sm:text-sm text-rose-100 font-medium mt-1">Average Rating</p>
          </div>
        </div>
      </section>

      {/* 5. Call to Action */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">Ready to Refresh Your Wardrobe?</h2>
          <p className="text-xs sm:text-base text-gray-600">Explore our latest arrivals, trending outfits, and exclusive festive collections today.</p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#ff2056] hover:bg-[#e01648] text-white px-8 py-3.5 rounded-md text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
