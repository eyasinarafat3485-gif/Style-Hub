import React from 'react';
import { ArrowRight } from 'lucide-react';

const inspirationGallery = [
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    title: 'Festive Panjabi Collection',
    tag: '#StyleHubFestive'
  },
  {
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    title: 'Casual Summer Flatlay',
    tag: '#CasualComfort'
  },
  {
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    title: 'Women Ethnic Grace',
    tag: '#StyleHubWomen'
  },
  {
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    title: 'Executive Shirt Trends',
    tag: '#SmartCasual'
  },
];

const StyleInspiration = () => {
  return (
    <section className="py-10 sm:py-14 bg-gray-50/50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Style Inspiration
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Tag @StyleHub_BD on Instagram to get featured
            </p>
          </div>
          
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-[#ff2056] transition-colors group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 4 Cards Grid - 2 per line on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {inspirationGallery.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-200/80 transition-all duration-300 cursor-pointer bg-white"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Overlay & Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3.5 sm:p-5 text-white">
                <div className="flex items-center gap-1.5 mb-1 text-[#ff2056]">
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-[10px] font-bold tracking-wide uppercase opacity-90">{item.tag}</span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold line-clamp-1 group-hover:text-rose-200 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StyleInspiration;
