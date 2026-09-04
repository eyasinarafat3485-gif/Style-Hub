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
    <section className="bg-[#ff2056] text-white py-12 border-b border-rose-700">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Form Content */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Get 10% Off Your First Order
          </h2>
          <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl font-normal">
            Join our newsletter and be the first to know about new arrivals, exclusive offers, and more.
          </p>

          {subscribed ? (
            <div className="p-3 bg-[#d61343] border border-rose-400 rounded-md text-xs font-bold text-white max-w-md animate-fade-in">
              🎉 Thank you for subscribing! Check your inbox for your 10% off coupon code.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 rounded text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-white flex-1 font-medium"
              />
              <button
                type="submit"
                className="bg-[#d61343] hover:bg-[#b80e38] text-white px-6 py-2.5 rounded text-xs font-bold transition-all border border-rose-400/50 shadow"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Right Feature Checkmarks */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-2.5 border-t lg:border-t-0 lg:border-l border-rose-400/40 pt-6 lg:pt-0 lg:pl-8 text-xs font-semibold text-rose-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-rose-200 shrink-0" />
            <span>Exclusive Offers</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-rose-200 shrink-0" />
            <span>New Arrivals</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-rose-200 shrink-0" />
            <span>Style Tips</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Newsletter;
