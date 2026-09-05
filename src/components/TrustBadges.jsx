import React from 'react';
import { Headset, Truck, RotateCcw, ShieldCheck, Banknote } from 'lucide-react';

const badges = [
  {
    icon: Headset,
    title: '24/7 Support',
    desc: "We're here to help",
  },
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
];

const TrustBadges = () => {
  return (
    <section className="bg-white border-b border-gray-100 py-3.5 sm:py-4 select-none overflow-hidden relative">
      {/* Subtle edge fade gradient for professional luxury finish */}
      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Infinite Right-to-Left Continuous Marquee Carousel (No Box, Single Line) */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-20 sm:gap-28 lg:gap-32 whitespace-nowrap pr-20 sm:pr-28 lg:pr-32">
          {/* Set 1 */}
          {badges.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={`tb1-${index}`}
                className="flex items-center gap-3 shrink-0 group cursor-default transition-all"
              >
                <Icon className="w-5 h-5 text-[#ff2056] group-hover:scale-110 transition-transform shrink-0 stroke-[1.8]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#ff2056] transition-colors whitespace-nowrap">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium whitespace-nowrap">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Set 2 for Seamless Infinite Loop */}
          {badges.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={`tb2-${index}`}
                className="flex items-center gap-3 shrink-0 group cursor-default transition-all"
              >
                <Icon className="w-5 h-5 text-[#ff2056] group-hover:scale-110 transition-transform shrink-0 stroke-[1.8]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#ff2056] transition-colors whitespace-nowrap">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium whitespace-nowrap">
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

export default TrustBadges;
