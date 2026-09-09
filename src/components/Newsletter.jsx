import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-[#ff2056] text-white py-6 sm:py-8 lg:py-10 border-b border-rose-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
        
        {/* Left Form Content */}
        <div className="lg:col-span-8 space-y-2 sm:space-y-3">
          <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Get 10% Off Your First Order
          </h2>
          <p className="text-[11px] sm:text-xs lg:text-sm text-rose-100/90 max-w-xl font-normal leading-relaxed">
            Join our newsletter and be the first to know about new arrivals, exclusive offers, and more.
          </p>

          {subscribed ? (
            <div className="p-2.5 sm:p-3 bg-[#d61343] border border-rose-400 rounded-xl text-[11px] sm:text-xs font-bold text-white max-w-md animate-fade-in">
              🎉 Thank you for subscribing! Check your inbox for your 10% off coupon code.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-row items-center gap-2 max-w-md pt-1">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3.5 py-2 sm:py-2.5 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-white flex-1 font-medium shadow-xs"
              />
              <button
                type="submit"
                className="bg-[#d61343] hover:bg-[#b80e38] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all border border-rose-400/50 shadow-xs shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Right Feature Checkmarks (Inline on mobile, vertical column on desktop) */}
        <div className="lg:col-span-4 flex flex-row flex-wrap lg:flex-col justify-start lg:justify-center gap-x-4 gap-y-1.5 sm:gap-y-2.5 border-t lg:border-t-0 lg:border-l border-rose-400/30 pt-3 lg:pt-0 lg:pl-8 text-[11px] sm:text-xs font-semibold text-rose-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-200 shrink-0" />
            <span>Exclusive Offers</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-200 shrink-0" />
            <span>New Arrivals</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-200 shrink-0" />
            <span>Style Tips</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Newsletter;
