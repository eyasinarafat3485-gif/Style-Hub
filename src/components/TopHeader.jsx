import React from 'react';
import { Truck, RotateCcw, Banknote, Headset, ShieldCheck, Sparkles } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const defaultIcons = [Truck, RotateCcw, Banknote, ShieldCheck, Headset, Sparkles];

const defaultAnnouncements = [
  'Free Delivery on orders over ৳1499',
  '30 Days Easy Returns & Exchange',
  'Cash on Delivery Available Nationwide',
  '100% Authentic Quality Guaranteed',
  '24/7 Dedicated Help & Support',
  'New Season Collections & Trending Outfits',
];

const TopHeader = () => {
  const { settings } = useSiteSettings();

  const enabled = settings?.topNotice?.enabled !== false;
  if (!enabled) return null;

  const rawList = settings?.topNotice?.announcements?.length
    ? settings.topNotice.announcements
    : defaultAnnouncements;

  const list = rawList.map((text, idx) => ({
    icon: defaultIcons[idx % defaultIcons.length],
    text,
  }));

  return (
    <div className="bg-[#ff2056] text-white text-xs font-semibold py-2.5 overflow-hidden border-b border-rose-400/30 select-none relative z-30">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Edge Fade Gradients matching top bar background */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#ff2056] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#ff2056] to-transparent z-10 pointer-events-none" />

        <div className="relative w-full overflow-hidden">
          {/* Continuous Right-to-Left Infinite Marquee Carousel (Centered) */}
          <div className="animate-marquee flex items-center gap-12 sm:gap-16 whitespace-nowrap pr-12 sm:pr-16">
            {/* Set 1 */}
            {list.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`top-1-${idx}`}
                  className="announcement-item flex items-center gap-2 text-white hover:text-white/90 transition-colors duration-200 shrink-0 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.2] shrink-0 transition-colors duration-200" />
                  <span className="tracking-wide font-semibold transition-colors duration-200">
                    {item.text}
                  </span>
                </div>
              );
            })}

            {/* Set 2 for Infinite Seamless Loop */}
            {list.map((item, idx) => {
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

            {/* Set 3 for Seamless Loop on Ultra-Wide / Zoom-out */}
            {list.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`top-3-${idx}`}
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
    </div>
  );
};

export default TopHeader;
