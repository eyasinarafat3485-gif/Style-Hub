import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Store,
  Menu,
} from 'lucide-react';

const DashboardTopBar = ({
  user,
  isAdmin,
  sidebarOpen,
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-30 shadow-xs">
      {/* Left: Brand & Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-slate-900 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white flex items-center justify-center font-serif font-black shadow-md shadow-rose-600/20">
            S
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-extrabold text-slate-900 text-lg tracking-tight">StyleHub</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-rose-50 text-[#ff2056] border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isAdmin
                ? 'Search products, orders, customers...'
                : 'Search your orders and saved items...'
            }
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-2 bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-[#ff2056] rounded-xl text-xs text-slate-900 placeholder:text-gray-400 focus:outline-none transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded shadow-2xs">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Return to Live Store Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-1.5 px-3 sm:px-3.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-slate-700 hover:text-[#ff2056] text-xs font-bold transition-all border border-gray-200/60 shadow-2xs"
        >
          <Store className="w-3.5 h-3.5 text-[#ff2056]" />
          <span className="hidden sm:inline">Live Store</span>
        </Link>

        {/* Notifications Bell */}
        <button
          className="relative p-2 text-gray-600 hover:text-[#ff2056] hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff2056] rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};

export default DashboardTopBar;
