import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, ShieldCheck } from 'lucide-react';

// Dynamic Reviews Data
const reviewsData = [
  {
    id: 1,
    name: 'Arosh Mia',
    avatarText: 'AM',
    avatarBg: 'bg-blue-600',
    rating: 5,
    comment:
      'This premium shirt is incredibly comfortable to wear and the overall fitting works exactly as expected. The fabric is clean, breathable and responsive.',
  },
  {
    id: 2,
    name: 'Eyasin Arafat',
    avatarImg:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment:
      'An excellent clothing brand with powerful attention to details. The cotton tailoring and stitching quality make everyday style much easier.',
  },
  {
    id: 3,
    name: 'Md: Sabit',
    avatarText: 'MS',
    avatarBg: 'bg-indigo-600',
    rating: 5,
    comment:
      'Excellent clothing line with a clean finish, soft textures, and smooth performance. Got exactly what was pictured on the site. Super fast delivery!',
  },
  {
    id: 4,
    name: 'Nusrat Jahan',
    avatarText: 'NJ',
    avatarBg: 'bg-rose-600',
    rating: 5,
    comment:
      'I ordered two festive outfits and the color richness and fabric drape are genuinely five star. Customer service was also very helpful.',
  },
  {
    id: 5,
    name: 'Tanvir Hasan',
    avatarText: 'TH',
    avatarBg: 'bg-amber-600',
    rating: 5,
    comment:
      'The pure cotton executive shirts are unbeatable at this price point. Packaging was luxurious and cash on delivery arrived within 24 hours in Dhaka.',
  },
  {
    id: 6,
    name: 'Farhan Ahmed',
    avatarText: 'FA',
    avatarBg: 'bg-emerald-600',
    rating: 5,
    comment:
      '100% authentic quality. The fabric feels soft against the skin and doesn’t lose shape after washing. A truly reliable Bangladeshi fashion brand.',
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#fafaf9] border-b border-gray-200/70 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 text-left">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Member Reviews &amp; Rating
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1.5">
            Authentic feedback from verified StyleHub shoppers &amp; members
          </p>
        </div>

        {/* Reviews Grid & Carousel Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Rating Summary Card */}
          <div className="lg:col-span-3 flex">
            <div className="w-full bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs flex flex-col items-center justify-center text-center">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Excellent
              </h3>

              {/* 5 Solid Amber Star Boxes (Exact match to reference) */}
              <div className="flex items-center gap-1.5 my-3.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 bg-amber-400 rounded-md flex items-center justify-center shadow-xs"
                  >
                    <Star className="w-4 h-4 fill-white text-white" />
                  </div>
                ))}
              </div>

              {/* Rating Text */}
              <p className="text-xs font-semibold text-gray-700">
                <span className="font-bold text-slate-900">5</span> out of{' '}
                <span className="font-bold text-slate-900">5</span> based on{' '}
                <span className="font-bold text-slate-900">480+</span> reviews
              </p>

              {/* Verified Member Reviews Badge */}
              <div className="mt-5 pt-4 border-t border-gray-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Verified Member Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Column: Continuous Right-to-Left Carousel Track */}
          <div className="lg:col-span-9 overflow-hidden relative rounded-2xl flex items-center">
            {/* Subtle Gradient Fade on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#fafaf9] to-transparent z-10 pointer-events-none hidden sm:block" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fafaf9] to-transparent z-10 pointer-events-none hidden sm:block" />

            {/* Continuous Marquee Scrolling Right to Left */}
            <div className="animate-marquee-slow flex items-stretch gap-5 py-2">
              {/* Set 1 */}
              {reviewsData.map((item) => (
                <div
                  key={`rev-1-${item.id}`}
                  className="w-[300px] sm:w-[350px] shrink-0 bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs hover:shadow-md hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Quotation Icon */}
                    <div className="text-3xl font-serif font-black text-rose-300/80 leading-none mb-3 select-none">
                      ““
                    </div>

                    {/* Review Comment */}
                    <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed italic font-normal">
                      "{item.comment}"
                    </p>
                  </div>

                  {/* Reviewer Profile */}
                  <div className="flex items-center gap-3 pt-5 mt-4 border-t border-gray-100">
                    {item.avatarImg ? (
                      <img
                        src={item.avatarImg}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-xs shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full ${item.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}
                      >
                        {item.avatarText}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#ff2056] transition-colors">
                          {item.name}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                      </div>

                      {/* 5 Rating Stars */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Set 2 for Infinite Seamless Loop */}
              {reviewsData.map((item) => (
                <div
                  key={`rev-2-${item.id}`}
                  className="w-[300px] sm:w-[350px] shrink-0 bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs hover:shadow-md hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Quotation Icon */}
                    <div className="text-3xl font-serif font-black text-rose-300/80 leading-none mb-3 select-none">
                      ““
                    </div>

                    {/* Review Comment */}
                    <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed italic font-normal">
                      "{item.comment}"
                    </p>
                  </div>

                  {/* Reviewer Profile */}
                  <div className="flex items-center gap-3 pt-5 mt-4 border-t border-gray-100">
                    {item.avatarImg ? (
                      <img
                        src={item.avatarImg}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-xs shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full ${item.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}
                      >
                        {item.avatarText}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#ff2056] transition-colors">
                          {item.name}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                      </div>

                      {/* 5 Rating Stars */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
