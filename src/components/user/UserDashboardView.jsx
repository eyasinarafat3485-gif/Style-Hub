import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Heart,
  User,
  MapPin,
  Gift,
  ShoppingBag,
  Trash2,
  Calendar,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import UserSidebar from './UserSidebar';

const UserDashboardView = ({ user, onLogout }) => {
  const { wishlist, formatPrice, removeFromWishlist, addToCart } = useShop();
  const [activeTab, setActiveTab] = useState('orders');

  // Customer Mock Orders
  const myOrders = [
    {
      id: 'SH-87391',
      date: 'Sep 02, 2026',
      items: 'Royal Silk Embroidered Panjabi (L) x 1',
      total: '৳ 3,850',
      status: 'Delivered',
      deliveryEstimate: 'Delivered on Sep 04, 2026',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'SH-87102',
      date: 'Aug 20, 2026',
      items: 'Premium Pima Cotton Polo (Navy, XL) x 1',
      total: '৳ 1,450',
      status: 'Delivered',
      deliveryEstimate: 'Delivered on Aug 23, 2026',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Customer Left Sidebar */}
      <UserSidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        orderCount={myOrders.length}
      />

      {/* Main Tab Content */}
      <main className="flex-1 w-full min-w-0 space-y-6">
        {/* Top Summary Banner */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">Welcome back, {user?.name}!</h2>
            <p className="text-xs text-gray-500">
              Manage your orders, saved fashion items, and shipping addresses
            </p>
          </div>
          <Link
            to="/shop"
            className="px-4 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop New Arrivals</span>
          </Link>
        </div>

        {/* TAB 1: My Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">Order History</h3>
                <p className="text-xs text-gray-500">Track shipment status and view previous purchases</p>
              </div>
              <Link to="/shop" className="text-xs font-bold text-[#ff2056] hover:underline flex items-center gap-1">
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {myOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl border border-gray-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gray-300 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{ord.id}</span>
                      <span className="text-xs text-gray-400">• {ord.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{ord.items}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{ord.deliveryEstimate}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-slate-900 text-sm">{ord.total}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${ord.statusColor}`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Saved Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">Saved Wishlist ({wishlist.length})</h3>
                <p className="text-xs text-gray-500">Your favorite fashion items saved for later</p>
              </div>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 bg-rose-50 text-[#ff2056] rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Your wishlist is empty</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Save items you love by clicking the heart icon on any product card.
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-5 py-2.5 bg-[#ff2056] text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-xl border border-gray-200/80 flex items-center justify-between gap-3 bg-gray-50/50 hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-14 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{product.title}</p>
                        <p className="text-xs font-extrabold text-[#ff2056]">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3 py-1.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Delivery Address */}
        {activeTab === 'address' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">Delivery Addresses</h3>
                <p className="text-xs text-gray-500">Manage shipping addresses for speedy checkout</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/20 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ff2056] text-white text-[10px] font-bold uppercase">
                    Primary Address
                  </span>
                  <MapPin className="w-4 h-4 text-[#ff2056]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{user?.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">House #42, Road #7, Dhanmondi</p>
                  <p className="text-xs text-slate-600">Dhaka - 1209, Bangladesh</p>
                  <p className="text-xs text-gray-500 mt-2">Phone: +880 1712-345678</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-[#ff2056] transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                  +
                </div>
                <span className="text-xs font-bold text-slate-700">Add New Delivery Address</span>
                <p className="text-[11px] text-gray-400">Office or alternative location</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Rewards & Coupons */}
        {activeTab === 'rewards' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">Member Coupons & Promo Codes</h3>
              <p className="text-xs text-gray-500">Apply these discount codes at checkout</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50/70 to-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#ff2056] uppercase">Welcome Discount</span>
                  <Gift className="w-4 h-4 text-[#ff2056]" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900 font-serif">15% OFF</h4>
                  <p className="text-[11px] text-gray-500">On your entire first order</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-rose-100">
                  <code className="px-2.5 py-1 bg-white border border-rose-200 rounded text-xs font-mono font-bold text-[#ff2056]">
                    STYLE15
                  </code>
                  <span className="text-[10px] text-emerald-600 font-bold">Valid till Oct 2026</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/70 to-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-600 uppercase">Free Delivery</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900 font-serif">FREE SHIPPING</h4>
                  <p className="text-[11px] text-gray-500">On orders above ৳ 2,500</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                  <code className="px-2.5 py-1 bg-white border border-blue-200 rounded text-xs font-mono font-bold text-blue-600">
                    FREESHIP
                  </code>
                  <span className="text-[10px] text-blue-600 font-bold">Auto-applied</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Profile & Account Settings */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">Account Profile & Security</h3>
              <p className="text-xs text-gray-500">Manage credentials and login information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Personal Profile</h4>
                <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Full Name:</span>
                    <span className="font-bold text-slate-800">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-bold text-slate-800">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Login Method:</span>
                    <span className="font-bold text-[#ff2056] capitalize">{user?.authProvider || 'Local'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Account Status</h4>
                <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Membership Tier:</span>
                    <span className="font-bold text-slate-800">Regular User</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Security Encryption:</span>
                    <span className="font-bold text-slate-800">256-bit SSL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Verified:</span>
                    <span className="font-bold text-emerald-600">Yes (Active)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboardView;
