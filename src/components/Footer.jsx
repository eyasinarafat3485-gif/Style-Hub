import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-50 border-t border-gray-200 text-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <Link to="/" className="font-serif text-2xl font-extrabold tracking-tight text-slate-900">
                StyleHub<span className="text-[#ff2056]">.</span>
              </Link>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold -mt-1">
                Wear Your Style
              </span>
            </div>
            
            <p className="text-gray-600 text-xs leading-relaxed max-w-xs">
              Your one-stop destination for stylish, comfortable & premium quality clothing in Bangladesh.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full text-slate-700 hover:text-[#ff2056] shadow-xs border border-gray-200 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full text-slate-700 hover:text-[#ff2056] shadow-xs border border-gray-200 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full text-slate-700 hover:text-[#ff2056] shadow-xs border border-gray-200 transition-colors">
                <span className="text-xs font-black">Tk</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full text-slate-700 hover:text-[#ff2056] shadow-xs border border-gray-200 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Shop Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm tracking-wide">Shop</h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li><Link to="/men" className="hover:text-[#ff2056] transition-colors">Men</Link></li>
              <li><Link to="/women" className="hover:text-[#ff2056] transition-colors">Women</Link></li>
              <li><Link to="/kids" className="hover:text-[#ff2056] transition-colors">Kids</Link></li>
              <li><Link to="/shop?category=Panjabi" className="hover:text-[#ff2056] transition-colors">Panjabi Collection</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-[#ff2056] transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm tracking-wide">Customer Service</h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li><Link to="/contact" className="hover:text-[#ff2056] transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-[#ff2056] transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="hover:text-[#ff2056] transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-[#ff2056] transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="hover:text-[#ff2056] transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Col 4: Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm tracking-wide">Company</h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li><Link to="/about-us" className="hover:text-[#ff2056] transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-[#ff2056] transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-[#ff2056] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#ff2056] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/blog" className="hover:text-[#ff2056] transition-colors">Fashion Blog</Link></li>
            </ul>
          </div>

          {/* Col 5: Contact Us */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm tracking-wide">Contact Us</h4>
            <div className="space-y-2 text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ff2056] shrink-0" />
                <span>+880 1711-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ff2056] shrink-0" />
                <span>support@stylehub.com.bd</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#ff2056] shrink-0 mt-0.5" />
                <span>House 12, Road 5, Dhanmondi, Dhaka-1205, Bangladesh</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright and payment badges */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 font-medium">
            © {new Date().getFullYear()} StyleHub Bangladesh. All Rights Reserved.
          </p>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-[#e2136e] text-white font-extrabold text-[10px] rounded tracking-wide shadow-xs">
              bKash
            </span>
            <span className="px-2.5 py-1 bg-[#f7941d] text-white font-extrabold text-[10px] rounded tracking-wide shadow-xs">
              নগদ
            </span>
            <span className="px-2.5 py-1 bg-[#1a1f71] text-white font-extrabold text-[10px] rounded tracking-wide shadow-xs">
              VISA
            </span>
            <span className="px-2.5 py-1 bg-[#eb001b] text-white font-extrabold text-[10px] rounded tracking-wide shadow-xs">
              mastercard
            </span>
            <span className="px-2.5 py-1 bg-[#ff2056] text-white font-extrabold text-[10px] rounded tracking-wide shadow-xs">
              COD
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
