import React from 'react';
import {
  LayoutDashboard,
  Package,
  Heart,
  Bell,
  Gift,
  MapPin,
  User,
  Home,
  LogOut,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

const UserSidebar = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  orderCount = 2,
  isOpen,
  onClose,
  unreadNotifications = 3,
}) => {
  const { wishlist } = useShop();
  const initialLetter = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders & Tracking', icon: Package, badge: orderCount ? `${orderCount}` : null },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlist.length ? `${wishlist.length}` : null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications ? `${unreadNotifications}` : null },
    { id: 'address', label: 'Delivery Address', icon: MapPin },
    { id: 'account', label: 'Profile & Security', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 lg:z-0 w-72 bg-white text-slate-800 flex flex-col justify-between border-r border-gray-200/80 shadow-2xl lg:shadow-none p-5 h-full overflow-y-auto shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* User Info Header Card */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-11 h-11 rounded-full object-cover border-2 border-rose-200 shadow-xs"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white font-serif font-bold text-base flex items-center justify-center shadow-xs">
                    {initialLetter}
                  </div>
                )}
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                  title="Online"
                />
              </div>

              <div className="overflow-hidden text-left space-y-0.5">
                <h3 className="font-bold text-slate-900 text-sm font-sans truncate tracking-tight">
                  {user?.name || 'Valued Member'}
                </h3>
                {user?.email && (
                  <p className="text-[11px] text-gray-500 truncate max-w-[130px] font-normal">{user.email}</p>
                )}
                <div className="flex items-center gap-1 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#ff2056] border border-rose-100">
                    <ShieldCheck className="w-3 h-3 text-[#ff2056]" />
                    <span>{user?.role === 'admin' ? 'Admin' : 'Regular User'}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-slate-800 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Customer Portal
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#ff2056] text-white shadow-md shadow-rose-500/20 font-bold'
                      : 'text-slate-700 hover:bg-rose-50/70 hover:text-[#ff2056]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-50 text-[#ff2056]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / Quick Actions */}
        <div className="space-y-2 pt-4 border-t border-gray-100 mt-6">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-gray-50 hover:text-[#ff2056] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-gray-400" />
              <span>Back to Home</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
