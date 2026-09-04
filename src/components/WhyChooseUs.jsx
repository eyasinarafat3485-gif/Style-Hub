import React from 'react';
import { Heart, Sparkles, Tag, Headset } from 'lucide-react';

const reasons = [
  {
    icon: Heart,
    title: 'Premium Quality',
    desc: 'Finest fabrics & stitching',
    color: 'text-[#ff2056] bg-rose-50',
  },
  {
    icon: Sparkles,
    title: 'Trendy & Modern',
    desc: 'Latest styles, always',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Tag,
    title: 'Affordable Price',
    desc: 'Best value for money',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Headset,
    title: '24/7 Support',
    desc: 'Always here to assist you',
    color: 'text-rose-600 bg-rose-50',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-10 sm:py-14 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6 sm:mb-8">
          Why Choose StyleHub?
        </h2>

        {/* 2 Cards per line on mobile, 4 Cards on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-xl bg-gray-50/70 border border-gray-100/90 hover:border-[#ff2056]/40 hover:bg-white shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center gap-2.5 sm:gap-3.5 group"
              >
                <div className={`p-2.5 sm:p-3.5 rounded-full ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#ff2056] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 sm:mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
