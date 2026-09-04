import React from 'react';
import { Truck, RotateCcw, Banknote, Headset, ShieldCheck, Sparkles } from 'lucide-react';

const announcements = [
  {
    icon: Truck,
    text: 'Free Delivery on orders over ৳1499',
  },
  {
    icon: RotateCcw,
    text: '30 Days Easy Returns & Exchange',
  },
  {
    icon: Banknote,
    text: 'Cash on Delivery Available Nationwide',
  },
  {
    icon: ShieldCheck,
    text: '100% Authentic Quality Guaranteed',
  },
  {
    icon: Headset,
    text: '24/7 Dedicated Help & Support',
  },
  {
    icon: Sparkles,
    text: 'New Season Collections & Trending Outfits',
  },
];

const TopHeader = () => {
  return (
    <div className="bg-[#ff2056] text-white text-xs font-semibold py-2.5 overflow-hidden border-b border-rose-400/30 select-none relative z-30">
      <div className="relative w-full overflow-hidden">
        {/* Continuous Right-to-Left Infinite Marquee Carousel */}
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 whitespace-nowrap">
          {/* Set 1 */}
          {announcements.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`top-1-${idx}`}
                className="announcement-item flex items-center gap-2 text-white hover:text-white/9
                0 transition-colors duration-200 shrink-0 cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.2] shrink-0 transition-colors duration-200" />
                <span className="tracking-wide font-semibold transition-colors duration-200">
                  {item.text}
                </span>
              </div>
            );
          })}

          {/* Set 2 for Infinite Seamless Loop */}
          {announcements.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`top-2-${idx}`}
                className="announcement-item flex items-center gap-2 text-white hover:text-white/90 transition-colors duration-200 shrink-0 cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.2] shrink-0 transition-colors duration-200" />
                <span className="tracking-wide font-semibold transition-colors duration-200">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
