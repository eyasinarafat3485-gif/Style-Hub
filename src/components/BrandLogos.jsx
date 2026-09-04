import React from 'react';

const brands = [
  "JACK & JONES",
  "celio*",
  "BURTON MENSWEAR",
  "LEVI'S",
  "MANGO",
  "ZARA",
  "H&M",
  "PULL&BEAR",
  "GUESS",
  "DOCKERS"
];

const BrandLogos = () => {
  return (
    <section className="py-10 bg-gray-50/70 border-b border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        {/* Centered Heading */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wider uppercase mb-6 text-center">
          Trusted by 10,000+ Customers
        </h3>

        {/* Continuous Right-to-Left Infinite Marquee Carousel */}
        <div className="relative w-full overflow-x-auto scrollbar-none py-2 select-none">
          <div className="animate-marquee flex items-center gap-12 sm:gap-16 opacity-75 hover:opacity-100 transition-opacity">
            {/* First Set of Brands */}
            {brands.map((brand, idx) => (
              <span
                key={`b1-${idx}`}
                className="font-serif text-lg md:text-xl font-black text-slate-700 tracking-widest uppercase hover:text-[#ff2056] transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                {brand}
              </span>
            ))}
            
            {/* Duplicated Set for Seamless Infinite Loop */}
            {brands.map((brand, idx) => (
              <span
                key={`b2-${idx}`}
                className="font-serif text-lg md:text-xl font-black text-slate-700 tracking-widest uppercase hover:text-[#ff2056] transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default BrandLogos;
