import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Clock,
  Gift,
  Lock,
  Tag,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { cart, cartTotal, formatPrice, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.address?.phone || user?.phone || '',
    deliveryZone: 'inside_dhaka',
    city: user?.address?.district || user?.address?.city || 'Dhaka',
    address: user?.address?.street || '',
    postalCode: user?.address?.postalCode || '',
    paymentMethod: 'Cash on Delivery',
    notes: '',
  });

  // Promo Code State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // amount in BDT
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Mobile Banking Form State (bKash / Nagad)
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [mobileBankingDetails, setMobileBankingDetails] = useState({
    senderPhone: '',
    trxId: '',
  });

  const handleCopyNumber = (numberToCopy = '+8801304513475') => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(numberToCopy);
    }
    setCopiedNumber(true);
    toast.info(`📋 নাম্বার "${numberToCopy}" কপি করা হয়েছে!`);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  // Processing & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Dynamic Store Settings from Database
  const [storeSettings, setStoreSettings] = useState({
    shipping: {
      insideDhakaFee: 60,
      outsideDhakaFee: 120,
      freeShippingThreshold: 3000,
      estimatedDeliveryInside: '24-48 Hours',
      estimatedDeliveryOutside: '2-4 Days',
    },
    paymentMethods: [
      {
        id: 'cod',
        name: 'Cash on Delivery',
        badge: 'Most Popular',
        description: 'Pay cash to the delivery rider once you receive and verify your parcel at your doorstep.',
        icon: 'banknote',
        enabled: true,
      },
      {
        id: 'bkash_mobile',
        name: 'bKash / Mobile Banking',
        badge: '0% Extra Fee',
        description: 'Pay securely using bKash, Nagad, or Upay personal/merchant wallet.',
        icon: 'mobile',
        enabled: true,
      },
      {
        id: 'card_payment',
        name: 'Card Payment',
        badge: 'Secure SSL',
        description: 'Debit / Credit Card (Visa / Mastercard) instant online payment.',
        icon: 'card',
        enabled: true,
      },
    ],
  });

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings`);
        const data = await res.json();
        if (data.success && data.settings) {
          setStoreSettings(data.settings);
          if (data.settings.paymentMethods && data.settings.paymentMethods.length > 0) {
            const enabledMethods = data.settings.paymentMethods.filter((m) => m.enabled !== false);
            if (enabledMethods.length > 0) {
              setFormData((prev) => {
                const isValid = enabledMethods.some(
                  (m) => m.name === prev.paymentMethod || m.id === prev.paymentMethod
                );
                return isValid ? prev : { ...prev, paymentMethod: enabledMethods[0].name };
              });
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load store settings for checkout:', err);
      }
    };
    fetchStoreSettings();
  }, []);

  // Autofill user data if logged in
  useEffect(() => {
    if (user) {
      const userPhone =
        user.address?.phone || user.phone || '';

      const rawDistrict =
        user.address?.district || user.address?.city || '';

      const cleanCity = rawDistrict
        ? rawDistrict.replace(' - City', '').trim()
        : 'Dhaka';

      // Build clean address text
      const addressParts = [];
      if (user.address?.street) addressParts.push(user.address.street);
      if (user.address?.thana && user.address.thana !== user.address.street) {
        addressParts.push(user.address.thana);
      }
      if (cleanCity && !addressParts.includes(cleanCity)) {
        addressParts.push(cleanCity);
      }

      const userAddress =
        addressParts.length > 0
          ? addressParts.join(', ')
          : (typeof user.address === 'string' ? user.address : '');

      const userPostal = user.address?.postalCode || '';

      // Determine delivery zone: if district/city or address contains "dhaka", inside_dhaka, otherwise outside_dhaka
      const isDhaka =
        cleanCity.toLowerCase().includes('dhaka') ||
        userAddress.toLowerCase().includes('dhaka');

      const resolvedDeliveryZone = isDhaka ? 'inside_dhaka' : 'outside_dhaka';

      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: userPhone || prev.phone,
        address: userAddress || prev.address,
        city: cleanCity || prev.city,
        postalCode: userPostal || prev.postalCode,
        deliveryZone: resolvedDeliveryZone,
      }));
    }
  }, [user]);

  // Dynamic Delivery Cost Calculation from Database Settings
  const insideDhakaCost = storeSettings.shipping?.insideDhakaFee ?? 60;
  const outsideDhakaCost = storeSettings.shipping?.outsideDhakaFee ?? 120;
  const freeThreshold = storeSettings.shipping?.freeShippingThreshold ?? 3000;

  const isFreeDelivery = cartTotal >= freeThreshold;
  const shippingFee = isFreeDelivery
    ? 0
    : formData.deliveryZone === 'inside_dhaka'
    ? insideDhakaCost
    : outsideDhakaCost;

  // Grand Total Calculation
  const grandTotal = Math.max(0, cartTotal + shippingFee - appliedDiscount);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'city') {
        const isDhaka = value.toLowerCase().includes('dhaka');
        updated.deliveryZone = isDhaka ? 'inside_dhaka' : 'outside_dhaka';
      }
      return updated;
    });
  };

  // Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (cleanCode === 'STYLE10' || cleanCode === 'STYLEHUB10') {
      const discount = Math.round(cartTotal * 0.1); // 10%
      setAppliedDiscount(discount);
      setCouponSuccess(`Coupon Applied! You saved ${formatPrice(discount)} (10% OFF)`);
    } else if (cleanCode === 'WELCOME' || cleanCode === 'SAVE100') {
      const discount = Math.min(100, cartTotal);
      setAppliedDiscount(discount);
      setCouponSuccess(`Welcome Offer Applied! You saved ${formatPrice(discount)}`);
    } else {
      setCouponError('Invalid or expired coupon code. Try code "STYLE10"');
    }
  };

  // Handle Order Submit
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      toast.error('Please provide your full name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please provide a valid Bangladeshi phone number');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please provide your detailed delivery address');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('Please provide your city/district');
      return;
    }
    if (cart.length === 0) {
      toast.error('Your shopping cart is empty.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token =
        localStorage.getItem('stylehub_token') ||
        localStorage.getItem('stylehub_auth_token') ||
        user?.token;

      // Prepare order items
      const orderItems = cart.map((item) => ({
        name: item.name || item.title || 'StyleHub Product',
        quantity: item.quantity || 1,
        image: item.image || '',
        price: Number(item.price) || 0,
        selectedSize: item.selectedSize || 'M',
        selectedColor: item.selectedColor || '',
        status: 'Pending',
      }));

      const payload = {
        orderItems,
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
        },
        customerInfo: {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shippingFee,
        totalPrice: grandTotal,
        notes: [
          formData.notes.trim(),
          mobileBankingDetails.senderPhone ? `bKash/Nagad Sender: ${mobileBankingDetails.senderPhone.trim()}` : '',
          mobileBankingDetails.trxId ? `TrxID: ${mobileBankingDetails.trxId.trim()}` : '',
        ].filter(Boolean).join(' | '),
      };

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('🎉 Order confirmed successfully!');
        setPlacedOrder(data.order);
        clearCart();
      } else {
        toast.error(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      toast.error('Network error. Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (placedOrder) {
    const shortId = placedOrder._id
      ? `SH-${placedOrder._id.slice(-6).toUpperCase()}`
      : 'SH-ORDER';

    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden text-center p-8 sm:p-12 space-y-6">
            
            {/* Animated Celebration Badge */}
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                Order Confirmed & Placed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
                Thank You for Your Order!
              </h1>
              <p className="text-sm text-gray-500 max-w-md mx-auto font-medium">
                We have received your order and our team is preparing it for shipment.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-slate-50/80 border border-gray-200 rounded-2xl p-6 text-left space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-200">
                <div>
                  <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Order ID</span>
                  <span className="text-base font-black text-[#ff2056]">{shortId}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Payment Method</span>
                  <span className="text-xs font-extrabold text-slate-800">{placedOrder.paymentMethod || 'Cash on Delivery'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Total Amount</span>
                  <span className="text-base font-black text-slate-900">{formatPrice(placedOrder.totalPrice)}</span>
                </div>
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div className="space-y-1">
                  <span className="font-bold text-gray-500">Shipping To:</span>
                  <p className="font-semibold text-slate-900">{placedOrder.shippingAddress?.fullName}</p>
                  <p className="text-gray-600 leading-relaxed">{placedOrder.shippingAddress?.address}, {placedOrder.shippingAddress?.city}</p>
                  <p className="text-gray-600 font-medium">Phone: {placedOrder.shippingAddress?.phone}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-gray-500">Estimated Delivery:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>24 - 48 Hours (Fast Courier)</span>
                  </p>
                  <p className="text-gray-500">Status: <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Pending Approval</span></p>
                </div>
              </div>

              {/* Items List Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2.5">
                <span className="text-xs font-bold text-gray-700 block">Ordered Items ({placedOrder.orderItems?.length || 0}):</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {placedOrder.orderItems?.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-200/70">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt={it.name} className="w-10 h-12 object-cover rounded border border-gray-200" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{it.name}</p>
                          <span className="text-[11px] text-gray-500">Size: {it.selectedSize} | Qty: {it.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/dashboard/orders"
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-[#ff2056] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Track Order in Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART VIEW
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-stone-50/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 text-center max-w-md w-full space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-[#ff2056] rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            You don't have any items in your shopping cart to checkout. Browse our trending fashion catalog!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all w-full"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/shop" className="hover:text-slate-900 transition-colors">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-slate-900">Checkout</span>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff2056] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
            Secure Checkout
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Fill in your delivery address and choose your preferred payment option to complete your purchase.
          </p>
        </div>

        {/* Checkout Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: FORM DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* User Login Status Banner */}
            {user ? (
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Logged in as {user.name}</p>
                    <p className="text-gray-500">{user.email} {user.phone ? `• ${user.phone}` : ''}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Verified Account
                </span>
              </div>
            ) : (
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ff2056] text-white flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Ordering as Guest Customer</p>
                    <p className="text-gray-500">Already have a StyleHub account? Log in for instant autofill.</p>
                  </div>
                </div>
                <Link
                  to="/login?redirect=/checkout"
                  className="px-3.5 py-1.5 bg-white border border-rose-300 text-[#ff2056] hover:bg-[#ff2056] hover:text-white text-xs font-bold rounded-xl transition-all text-center shrink-0 shadow-2xs"
                >
                  Log In Now
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* STEP 1: Customer & Delivery Address Information */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-[#ff2056] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#ff2056]" />
                    <span>Delivery Address & Contact Details</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>Full Name</span>
                      <span className="text-[#ff2056]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Md. Eyasin Arafat"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>Mobile Phone Number</span>
                      <span className="text-[#ff2056]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. 01712-345678"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>Email Address</span>
                        <span className="text-gray-400 text-[10px] font-normal">(For order receipt & tracking updates)</span>
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. yourname@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Delivery Zone / Area */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700">
                      Select Delivery Location:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          formData.deliveryZone === 'inside_dhaka'
                            ? 'border-[#ff2056] bg-rose-50/50 shadow-xs ring-1 ring-[#ff2056]'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="deliveryZone"
                            value="inside_dhaka"
                            checked={formData.deliveryZone === 'inside_dhaka'}
                            onChange={handleInputChange}
                            className="text-[#ff2056] focus:ring-[#ff2056]"
                          />
                          <div>
                            <p className="font-bold text-slate-900">Inside Dhaka</p>
                            <p className="text-[11px] text-gray-500">
                              {storeSettings.shipping?.estimatedDeliveryInside || '24-48 Hours Delivery'}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#ff2056] text-xs">
                          {isFreeDelivery ? 'FREE' : `৳${insideDhakaCost}`}
                        </span>
                      </label>

                      <label
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          formData.deliveryZone === 'outside_dhaka'
                            ? 'border-[#ff2056] bg-rose-50/50 shadow-xs ring-1 ring-[#ff2056]'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="deliveryZone"
                            value="outside_dhaka"
                            checked={formData.deliveryZone === 'outside_dhaka'}
                            onChange={handleInputChange}
                            className="text-[#ff2056] focus:ring-[#ff2056]"
                          />
                          <div>
                            <p className="font-bold text-slate-900">Outside Dhaka (All BD)</p>
                            <p className="text-[11px] text-gray-500">
                              {storeSettings.shipping?.estimatedDeliveryOutside || '2-4 Days Courier'}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#ff2056] text-xs">
                          {isFreeDelivery ? 'FREE' : `৳${outsideDhakaCost}`}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* City / District */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>City / District</span>
                      <span className="text-[#ff2056]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Dhaka, Chittagong, Sylhet"
                      className="w-full px-3 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none text-xs font-medium text-slate-900"
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">
                      Postal / ZIP Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="e.g. 1209"
                      className="w-full px-3 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none text-xs font-medium text-slate-900"
                    />
                  </div>

                  {/* Full Street Address */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>Full Delivery Address (House, Road, Area)</span>
                      <span className="text-[#ff2056]">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      placeholder="e.g. House #14, Road #5, Block D, Dhanmondi, Dhaka"
                      className="w-full px-3 py-2 bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none text-xs font-medium text-slate-900 resize-none"
                    />
                  </div>

                  {/* Order Notes */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span>Order Notes / Delivery Instructions (Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Please call before arriving or leave with security"
                      className="w-full px-3 py-2 bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none text-xs font-medium text-slate-900"
                    />
                  </div>

                </div>
              </div>

              {/* STEP 2: Payment Method Selection */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-[#ff2056] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#ff2056]" />
                    <span>Select Payment Method</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {(storeSettings.paymentMethods || [])
                    .filter((m) => m.enabled !== false)
                    .map((method) => {
                      const isSelected =
                        formData.paymentMethod === method.name ||
                        formData.paymentMethod === method.id;

                      const isMobileBanking =
                        method.id?.includes('bkash') ||
                        method.id?.includes('nagad') ||
                        method.name?.toLowerCase().includes('bkash') ||
                        method.name?.toLowerCase().includes('nagad') ||
                        Boolean(method.accountNumber);

                      const isCod =
                        method.id?.includes('cod') ||
                        method.name?.toLowerCase().includes('cash');

                      const isCard =
                        method.id?.includes('card') ||
                        method.name?.toLowerCase().includes('card') ||
                        method.name?.toLowerCase().includes('ssl');

                      return (
                        <div key={method.id || method._id} className="space-y-3">
                          <label
                            className={`p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#ff2056] bg-rose-50/40 ring-1 ring-[#ff2056] shadow-xs'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.name}
                                checked={isSelected}
                                onChange={handleInputChange}
                                className="mt-0.5 text-[#ff2056] focus:ring-[#ff2056]"
                              />
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {isMobileBanking ? (
                                      <span className="w-5 h-5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                                        ৳
                                      </span>
                                    ) : isCard ? (
                                      <CreditCard className="w-4 h-4 text-blue-600" />
                                    ) : (
                                      <Banknote className="w-4 h-4 text-emerald-600" />
                                    )}
                                    <span className="font-bold text-slate-900 text-xs">
                                      {method.name}
                                    </span>
                                  </div>
                                  {method.badge && (
                                    <span className="text-[10px] font-bold bg-rose-100 text-[#ff2056] px-2 py-0.5 rounded-full">
                                      {method.badge}
                                    </span>
                                  )}
                                </div>
                                {method.description && (
                                  <p className="text-[11px] text-gray-600 leading-relaxed">
                                    {method.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </label>

                          {/* Mobile Banking / bKash / Nagad Interactive Form when selected */}
                          {isSelected && isMobileBanking && (
                            <div className="bg-gradient-to-br from-rose-50/90 to-pink-50/60 border border-rose-200 rounded-xl p-4 space-y-3.5 text-xs text-slate-800 animate-fadeIn shadow-xs">
                              {/* Quick Copy Number Banner */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-rose-200 p-3 rounded-xl gap-2.5 shadow-xs">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[11px] font-bold text-slate-700">
                                      bKash & Nagad (Personal Wallet)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm sm:text-base font-extrabold text-[#ff2056] font-mono tracking-wider">
                                      {method.accountNumber || '+8801304513475'}
                                    </span>
                                    <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                                      Send Money
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopyNumber(method.accountNumber || '+8801304513475')}
                                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs active:scale-95 w-full sm:w-auto"
                                >
                                  {copiedNumber ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-white" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5 text-white" />
                                      <span>Copy Number</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Bengali Step-by-Step Payment Instructions */}
                              <div className="space-y-1.5 text-[11px] text-slate-700 bg-white/70 p-3 rounded-lg border border-rose-100 leading-relaxed">
                                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>📌</span>
                                  <span>পেমেন্ট নির্দেশিকা (Payment Instructions):</span>
                                </p>
                                <ol className="list-decimal list-inside space-y-1 pl-1 text-gray-700">
                                  <li>
                                    আপনার বিকাশ অথবা নগদ অ্যাপ ওপেন করে <strong className="text-slate-900">Send Money</strong> অপশনে যান।
                                  </li>
                                  <li>
                                    নাম্বার বক্সে উপরে দেওয়া নাম্বারে (<strong className="text-[#ff2056]">{method.accountNumber || '+8801304513475'}</strong>) মোট <strong className="text-slate-900">{formatPrice(grandTotal)}</strong> সেন্ড মানি করুন।
                                  </li>
                                  <li>
                                    পেমেন্ট সম্পন্ন হওয়ার পর প্রাপ্ত <strong className="text-slate-900">TrxID (ট্রানজেকশন আইডি)</strong> এবং আপনার <strong className="text-slate-900">প্রেরক নাম্বার</strong> নিচে প্রদান করে অর্ডার কনফার্ম করুন।
                                  </li>
                                </ol>
                              </div>

                              {/* Sender Details Input Fields */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-slate-700 block">
                                    আপনার প্রেরক নাম্বার (Sender Mobile) <span className="text-[#ff2056]">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 017XXXXXXXX"
                                    value={mobileBankingDetails.senderPhone}
                                    onChange={(e) =>
                                      setMobileBankingDetails((prev) => ({
                                        ...prev,
                                        senderPhone: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-slate-900 outline-none focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-slate-700 block">
                                    Transaction ID (TrxID) <span className="text-[#ff2056]">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. BL92XK89Q"
                                    value={mobileBankingDetails.trxId}
                                    onChange={(e) =>
                                      setMobileBankingDetails((prev) => ({
                                        ...prev,
                                        trxId: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-slate-900 outline-none focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] uppercase"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Reassurance note for Cash on Delivery */}
                          {isSelected && isCod && (
                            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-800 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span>ডেলিভারি রাইডারের কাছ থেকে পণ্য বুঝে পেয়ে চেক করে নগদ মূল্য পরিশোধ করুন।</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Submit Button (Mobile/Tablet Friendly) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#ff2056] hover:bg-[#d6103e] text-white text-sm font-extrabold rounded-2xl transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Place Order ({formatPrice(grandTotal)})</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  256-Bit SSL Secured
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  Fast Nationwide Delivery
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  100% Authentic
                </span>
              </div>

            </form>

          </div>

          {/* RIGHT 5 COLS: ORDER SUMMARY & PROMO */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#ff2056]" />
                  <span>Order Summary ({cart.length} items)</span>
                </h3>
                <span className="text-xs font-bold text-gray-500">
                  {cart.reduce((s, i) => s + (i.quantity || 1), 0)} pcs
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-gray-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name || item.title}
                      className="w-14 h-16 object-cover rounded-lg border border-gray-200 shrink-0 bg-gray-50"
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.name || item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Size: <strong className="text-slate-800">{item.selectedSize || 'M'}</strong>
                        {item.selectedColor ? ` | Color: ${item.selectedColor}` : ''}
                      </p>
                      <p className="text-xs font-extrabold text-[#ff2056]">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code (e.g. STYLE10)"
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase font-bold text-slate-900 focus:bg-white focus:border-[#ff2056] outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-[#ff2056] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>

                {couponSuccess && (
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{couponSuccess}</span>
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartTotal)}</span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Delivery Charge ({formData.deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span className="font-bold text-[#ff2056]">
                    {isFreeDelivery ? 'FREE (Orders > ৳3,000)' : formatPrice(shippingFee)}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>- {formatPrice(appliedDiscount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-lg text-[#ff2056]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Trust Guarantee Box */}
              <div className="bg-stone-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-[#ff2056]" />
                  <span>StyleHub Shopping Guarantee</span>
                </div>
                <ul className="text-[11px] text-gray-500 space-y-1 list-disc list-inside">
                  <li>7-Day Free Exchange & Easy Return</li>
                  <li>100% Cotton & Premium Fabric Guarantee</li>
                  <li>Check package before payment on COD</li>
                </ul>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
