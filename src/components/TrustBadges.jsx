import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Banknote, Headset } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'On orders over ৳1499',
  },
  {
    icon: RotateCcw,
    title: '30 Days Returns',
    desc: 'Easy return & exchange',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    desc: '100% secure checkout',
  },
  {
    icon: Banknote,
    title: 'Cash on Delivery',
    desc: 'Pay at your doorstep',
  },
  {
    icon: Headset,
    title: '24/7 Support',
    desc: "We're here to help",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-6 bg-white border-b border-gray-100 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto">
        {/* Infinite Right-to-Left Continuous Marquee Carousel */}
        <div className="relative w-full overflow-x-auto scrollbar-none py-1">
          <div className="animate-marquee flex items-center gap-8 sm:gap-12">

            {/* Set 1 */}
            {badges.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={`tb1-${index}`}
                  className="flex items-center gap-3 p-2 bg-stone-50/80 hover:bg-white border border-stone-200/60 rounded-xl shadow-2xs hover:shadow-md transition-all shrink-0 group min-w-[210px]"
                >
                  <div className="p-2.5 bg-rose-50 rounded-lg group-hover:bg-[#ff2056] group-hover:text-white text-[#ff2056] transition-colors shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#ff2056] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              );
            })}

            {/* Set 2 for Infinite Seamless Loop */}
            {badges.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={`tb2-${index}`}
                  className="flex items-center gap-3 p-2 bg-stone-50/80 hover:bg-white border border-stone-200/60 rounded-xl shadow-2xs hover:shadow-md transition-all shrink-0 group min-w-[210px]"
                >
                  <div className="p-2.5 bg-rose-50 rounded-lg group-hover:bg-[#ff2056] group-hover:text-white text-[#ff2056] transition-colors shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#ff2056] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
