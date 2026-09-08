import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag, GraduationCap } from 'lucide-react';

const PromoBanners = () => {
  const banners = [
    {
      id: 1,
      badge: 'Summer Edit',
      badgeIcon: Sparkles,
      badgeClass: 'text-amber-700 bg-amber-100/80 border-amber-200',
      title: 'Up to 40% Off',
      description: 'Light, breathable & fresh seasonal styles.',
      buttonText: 'Shop Now',
      buttonClass: 'bg-[#ff2056] hover:bg-[#e01648] text-white shadow-[#ff2056]/20',
      link: '/shop?category=Women',
      bgClass: 'bg-gradient-to-br from-[#faf7f2] via-[#f5efe6] to-[#ebe1d3]/40 border-[#e8dfd3]',
      // High-fashion female model in elegant summer dress
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
      alt: 'Summer Fashion Collection',
      gradientFade: 'from-[#faf7f2]',
    },
    {
      id: 2,
      badge: 'Panjabi & Ethnic',
      badgeIcon: Tag,
      badgeClass: 'text-emerald-800 bg-emerald-100/80 border-emerald-200',
      title: 'New Arrivals',
      description: 'Exquisite designs for festive occasions.',
      buttonText: 'Explore',
      buttonClass: 'bg-slate-900 hover:bg-black text-white shadow-slate-900/20',
      link: '/shop?category=Panjabi',
      bgClass: 'bg-gradient-to-br from-[#f8f9fa] via-[#f1f4f6] to-[#e5ebf0]/50 border-[#dde3e8]',
      // Handsome male model in elegant traditional kurta/ethnic wear
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      alt: 'Panjabi Collection Men',
      gradientFade: 'from-[#f8f9fa]',
    },
    {
      id: 3,
      badge: 'Student Offer',
      badgeIcon: GraduationCap,
      badgeClass: 'text-rose-700 bg-rose-100/80 border-rose-200',
      title: 'Extra 10% Off',
      description: 'Verify your student ID & save instantly.',
      buttonText: 'Get Discount',
      buttonClass: 'bg-[#ff2056] hover:bg-[#e01648] text-white shadow-[#ff2056]/20',
      link: '/shop',
      bgClass: 'bg-gradient-to-br from-[#fdf6f7] via-[#faebed] to-[#f4d9dd]/40 border-[#f2d4d9]',
      // Trendy young fashion model in stylish streetwear/casual outfit
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
      alt: 'Student Casual Wear',
      gradientFade: 'from-[#fdf6f7]',
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {banners.map((item) => {
            const Icon = item.badgeIcon;
            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 min-h-[220px] sm:min-h-[240px] flex ${item.bgClass}`}
              >
                {/* Text Content - Fixed width with plenty of breathing room */}
                <div className="relative z-10 w-[58%] sm:w-[56%] p-5 sm:p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase border shadow-2xs backdrop-blur-xs ${item.badgeClass}`}>
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.badge}</span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
                      {item.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-3">
                    <Link
                      to={item.link}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm hover:shadow group/btn ${item.buttonClass}`}
                    >
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Fashion Model Image with Smooth Gradient Blend */}
                <div className="absolute right-0 top-0 bottom-0 w-[46%] sm:w-[48%] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Seamless Left Fade Gradient */}
                  <div
                    className={`absolute inset-y-0 left-0 w-12 bg-gradient-to-r ${item.gradientFade} to-transparent pointer-events-none`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
