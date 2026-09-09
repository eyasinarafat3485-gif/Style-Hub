import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Package,
  ShoppingCart,
  Heart,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Clock,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const NotificationDropdown = ({ align = 'right' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch recent notifications
  const fetchNotifications = async () => {
    const token =
      localStorage.getItem('stylehub_token') ||
      localStorage.getItem('stylehub_auth_token') ||
      user?.token;
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/notifications?page=1&limit=5', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleSync = () => {
      fetchNotifications();
    };

    window.addEventListener('stylehub_notifications_updated', handleSync);
    // Auto-refresh notifications every 15 seconds for live alert experience
    const interval = setInterval(fetchNotifications, 15000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('stylehub_notifications_updated', handleSync);
    };
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    const token =
      localStorage.getItem('stylehub_token') ||
      localStorage.getItem('stylehub_auth_token') ||
      user?.token;
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        window.dispatchEvent(new CustomEvent('stylehub_notifications_updated'));
        toast.success('All notifications marked as read! ✔️');
      }
    } catch (err) {
      console.error('Error marking notifications read:', err);
    }
  };

  // Mark single notification as read & navigate if applicable
  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      const token =
        localStorage.getItem('stylehub_token') ||
        localStorage.getItem('stylehub_auth_token') ||
        user?.token;
      if (token) {
        try {
          await fetch(`http://localhost:5000/api/notifications/${notif._id}/read`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          setNotifications((prev) =>
            prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
          window.dispatchEvent(new CustomEvent('stylehub_notifications_updated'));
        } catch (err) {
          console.warn('Error marking notification read:', err);
        }
      }
    }

    setIsOpen(false);

    // Route to appropriate view
    if (notif.orderId || notif.type === 'order_status') {
      if (user?.role === 'admin') {
        navigate('/dashboard/orders');
      } else {
        navigate('/dashboard/orders');
      }
    } else {
      navigate('/dashboard/notifications');
    }
  };

  // Format Relative Timestamp
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const now = new Date();
    const past = new Date(dateStr);
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return 'Yesterday';
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get icon by notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_status':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'cart_add':
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'wishlist_add':
      case 'wishlist_to_cart':
        return <Heart className="w-4 h-4 text-[#ff2056]" />;
      case 'promo':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 text-gray-700 hover:text-[#ff2056] hover:bg-rose-50 rounded-xl transition-all cursor-pointer focus:outline-none"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-[#ff2056] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popup Card */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in divide-y divide-gray-100`}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-stone-50/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-[#ff2056] text-white text-[10px] font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-[#ff2056] hover:underline flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Recent Notification Items List (3 to 5 items) */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 scrollbar-thin">
            {isLoading && notifications.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-5 h-5 border-2 border-rose-200 border-t-[#ff2056] rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-400">Loading alerts...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center px-4 space-y-2">
                <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">No Notifications Yet</p>
                <p className="text-[11px] text-gray-500">
                  You're all caught up! Updates regarding your orders and offers will show here.
                </p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 sm:p-4 transition-all flex items-start gap-3 cursor-pointer hover:bg-stone-50 ${
                    !notif.isRead ? 'bg-rose-50/30' : 'bg-white'
                  }`}
                >
                  {/* Icon or Product Thumbnail */}
                  <div className="relative shrink-0 mt-0.5">
                    {notif.productImage ? (
                      <img
                        src={notif.productImage}
                        alt={notif.productName || 'Product'}
                        className="w-10 h-11 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                        {getNotificationIcon(notif.type)}
                      </div>
                    )}
                    {!notif.isRead && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff2056] rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs truncate ${
                          !notif.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-700'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.orderId && (
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {notif.orderId}
                        </span>
                        {notif.price > 0 && (
                          <span className="text-[10px] font-extrabold text-[#ff2056]">
                            ৳{Number(notif.price).toLocaleString('en-BD')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action Links */}
          <div className="p-2.5 bg-stone-50 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/dashboard/notifications');
              }}
              className="w-full py-2 bg-white hover:bg-rose-50 text-slate-800 hover:text-[#ff2056] text-xs font-bold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>View All Notifications ({notifications.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
