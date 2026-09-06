import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Home,
  ShieldCheck,
  PlusCircle,
  X,
  ChevronRight,
  ChevronDown,
  Layers,
  Award,
  FolderTree,
  Tag,
  Sliders,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  onLogout,
  user,
  isOpen,
  onClose,
}) => {
  const productSubItems = [
    'products',
    'add-product',
    'brands',
    'categories',
    'tags',
    'attributes',
    'reviews',
  ];
  const isProductTabActive = productSubItems.includes(activeTab);

  const [isProductsOpen, setIsProductsOpen] = useState(true);

  // Auto expand if activeTab is one of products sub-items
  useEffect(() => {
    if (isProductTabActive) {
      setIsProductsOpen(true);
    }
  }, [activeTab, isProductTabActive]);

  const initialLetter = (user?.name || user?.email || 'A').charAt(0).toUpperCase();

  const productSubMenuItems = [
    { id: 'products', label: 'All Products', icon: Layers },
    { id: 'add-product', label: 'Add new product', icon: PlusCircle },
    { id: 'brands', label: 'Brands', icon: Award },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'attributes', label: 'Attributes', icon: Sliders },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 lg:z-0 w-72 bg-slate-950 text-slate-300 flex flex-col justify-between border-r border-slate-800/80 shadow-2xl lg:shadow-none p-5 h-full overflow-y-auto shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div className="space-y-6">
          {/* User Profile Header Card */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-11 h-11 rounded-full object-cover border-2 border-rose-500/40 shadow-xs"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white font-serif font-bold text-base flex items-center justify-center shadow-xs">
                    {initialLetter}
                  </div>
                )}
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"
                  title="Online"
                />
              </div>

              <div className="overflow-hidden text-left">
                <h3 className="font-bold text-white text-xs sm:text-sm font-serif truncate">
                  {user?.name || 'Administrator'}
                </h3>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{user?.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                    {user?.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Main Management
            </p>

            {/* Overview */}
            <button
              onClick={() => {
                setActiveTab('overview');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'overview'
                  ? 'bg-[#ff2056] text-white shadow-lg shadow-rose-600/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard
                  className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-400'}`}
                />
                <span>Dashboard Overview</span>
              </div>
            </button>

            {/* Products Accordion Menu */}
            <div className="space-y-1">
              <button
                onClick={() => setIsProductsOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  isProductTabActive && !isProductsOpen
                    ? 'bg-[#ff2056]/20 text-[#ff2056] border border-rose-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag
                    className={`w-4 h-4 ${isProductTabActive ? 'text-[#ff2056]' : 'text-slate-400'}`}
                  />
                  <span>Products</span>
                </div>
                {isProductsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Products Dropdown Items */}
              {isProductsOpen && (
                <div className="ml-3 pl-3 border-l border-slate-800 space-y-1 pt-1 pb-1">
                  {productSubMenuItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeTab === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveTab(subItem.id);
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                          isSubActive
                            ? 'bg-[#ff2056] text-white shadow-md font-bold'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                        }`}
                      >
                        <SubIcon
                          className={`w-3.5 h-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`}
                        />
                        <span>{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Orders & Sales */}
            <button
              onClick={() => {
                setActiveTab('orders');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'orders'
                  ? 'bg-[#ff2056] text-white shadow-lg shadow-rose-600/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package
                  className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-slate-400'}`}
                />
                <span>Orders & Sales</span>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  activeTab === 'orders'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-[#ff2056] border border-rose-500/20'
                }`}
              >
                12 New
              </span>
            </button>

            {/* Customers */}
            <button
              onClick={() => {
                setActiveTab('customers');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'customers'
                  ? 'bg-[#ff2056] text-white shadow-lg shadow-rose-600/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users
                  className={`w-4 h-4 ${activeTab === 'customers' ? 'text-white' : 'text-slate-400'}`}
                />
                <span>Customers</span>
              </div>
            </button>

            {/* Reports & Analytics */}
            <button
              onClick={() => {
                setActiveTab('analytics');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'analytics'
                  ? 'bg-[#ff2056] text-white shadow-lg shadow-rose-600/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3
                  className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-white' : 'text-slate-400'}`}
                />
                <span>Reports & Analytics</span>
              </div>
            </button>

            {/* Store Settings */}
            <button
              onClick={() => {
                setActiveTab('settings');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-[#ff2056] text-white shadow-lg shadow-rose-600/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings
                  className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400'}`}
                />
                <span>Store Settings</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Footer Section in Sidebar */}
        <div className="space-y-2 pt-4 border-t border-slate-800/80 mt-6">
          {/* Back to Home Button */}
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-slate-400" />
              <span>Back to Home</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

