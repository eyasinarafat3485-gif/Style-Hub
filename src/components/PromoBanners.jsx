import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanners = () => {
  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Banner 1: Summer Collection */}
        <div className="relative bg-stone-100 rounded-xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[260px] group shadow-xs hover:shadow-lg transition-all border border-stone-200/80">
          <div className="z-10 max-w-[65%] space-y-2">
            <span className="text-xs font-extrabold text-[#ff2056] tracking-wider uppercase">
              Summer Collection
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-900 leading-tight">
              Up to 40% Off
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Light, breathable & perfect for this season.
            </p>
            <div className="pt-3">
              <Link
                to="/shop"
                className="inline-block bg-[#ff2056] hover:bg-[#e01648] text-white px-5 py-2 rounded text-xs font-bold transition-all shadow"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80"
            alt="Summer Collection"
            className="absolute right-0 bottom-0 w-1/2 h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Banner 2: Panjabi Collection */}
        <div className="relative bg-amber-50/50 rounded-xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[260px] group shadow-xs hover:shadow-lg transition-all border border-amber-100/80">
          <div className="z-10 max-w-[65%] space-y-2">
            <span className="text-xs font-extrabold text-amber-900 tracking-wider uppercase">
              Panjabi Collection
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-900 leading-tight">
              New Arrivals
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Elegant designs for every occasion.
            </p>
            <div className="pt-3">
              <Link
                to="/shop?category=Panjabi"
                className="inline-block bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded text-xs font-bold transition-all shadow"
              >
                Explore
              </Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80"
            alt="Panjabi Collection"
            className="absolute right-0 bottom-0 w-1/2 h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Banner 3: Student Discount */}
        <div className="relative bg-rose-50/70 rounded-xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[260px] group shadow-xs hover:shadow-lg transition-all border border-rose-100">
          <div className="z-10 max-w-[65%] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-700 tracking-wider uppercase">
              <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-[10px]">🎓</span>
              <span>Special Offer</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Student Discount Extra 10% Off
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Verify your student ID and get discount.
            </p>
            <div className="pt-3">
              <Link
                to="/shop"
                className="inline-block bg-[#ff2056] hover:bg-[#e01648] text-white px-5 py-2 rounded text-xs font-bold transition-all shadow"
              >
                Get Discount
              </Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"
            alt="Student Discount"
            className="absolute right-0 bottom-0 w-1/2 h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
};

export default PromoBanners;
