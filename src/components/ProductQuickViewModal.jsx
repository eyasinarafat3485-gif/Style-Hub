import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  Check,
  MessageSquare,
  Send,
  User,
  Mail,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const UserAvatar = ({ userAvatar, name, bgClass = 'bg-gradient-to-tr from-[#ff2056] to-rose-400' }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const isValid =
    userAvatar &&
    typeof userAvatar === 'string' &&
    (userAvatar.startsWith('http') || userAvatar.startsWith('data:') || userAvatar.startsWith('/'));

  const getInitials = (str) => {
    if (!str) return 'C';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  if (isValid && !imgFailed) {
    return (
      <img
        src={userAvatar}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
      />
    );
  }

  return (
    <div
      className={`w-8 h-8 rounded-full ${bgClass} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs uppercase border border-white/20`}
    >
      {getInitials(name)}
    </div>
  );
};

const ProductQuickViewModal = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useShop();

  const { user, isAuthenticated } = useAuth();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Image Hover Zoom State (GlamNGrace style)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  // Review System State
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(5.0);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Synchronize options & user data when modal product opens or changes
  useEffect(() => {
    if (quickViewProduct) {
      const sizes = quickViewProduct.sizes || ['S', 'M', 'L', 'XL'];
      setSelectedSize(sizes[0] || 'M');

      const colors = quickViewProduct.colors || [];
      setSelectedColor(colors[0] || '');

      setQuantity(1);
      setUserRating(5);
      setComment('');

      // Auto-fill user credentials if logged in
      if (isAuthenticated && user) {
        setReviewerName(user.name || user.email?.split('@')[0] || '');
        setReviewerEmail(user.email || '');
      } else {
        setReviewerName('');
        setReviewerEmail('');
      }

      // Fetch reviews from backend
      fetchReviews(quickViewProduct.id, quickViewProduct.name || quickViewProduct.title || '');
    }
  }, [quickViewProduct, isAuthenticated, user]);

  // Fetch reviews for current product
  const fetchReviews = async (productId, productName = '') => {
    setIsLoadingReviews(true);
    const nameQuery = productName ? `?name=${encodeURIComponent(productName)}` : '';
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/product/${productId}${nameQuery}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews || []);
          setAvgRating(data.averageRating || quickViewProduct?.rating || 5.0);
          setTotalReviewsCount(data.count || 0);
          setRatingCounts(data.ratingCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
          setIsLoadingReviews(false);
          return;
        }
      }
    } catch (err) {
      console.log('Backend review fetch notice (offline/fallback mode active):', err.message);
    }

    // Local fallback for offline mode or fallback products
    const stored = localStorage.getItem(`stylehub_reviews_${productId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReviews(parsed);
        const count = parsed.length;
        const avg = count > 0 ? Number((parsed.reduce((s, r) => s + r.rating, 0) / count).toFixed(1)) : 5.0;
        setAvgRating(avg);
        setTotalReviewsCount(count);
      } catch (_) {
        setReviews([]);
      }
    } else {
      setReviews([]);
      setAvgRating(quickViewProduct?.rating || 5.0);
      setTotalReviewsCount(quickViewProduct?.reviewCount || 0);
    }
    setIsLoadingReviews(false);
  };

  // Submit Review Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!reviewerEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmittingReview(true);

    const reviewPayload = {
      productId: String(quickViewProduct.id),
      productName: quickViewProduct.name || quickViewProduct.title || '',
      productImage: quickViewProduct.image || '',
      userAvatar: user?.avatar || user?.picture || user?.photoURL || user?.image || '',
      name: reviewerName.trim(),
      email: reviewerEmail.trim(),
      rating: Number(userRating),
      comment: comment.trim(),
    };

    let newReviewObj = null;

    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        newReviewObj = data.review;
      }
    } catch (err) {
      console.warn('Backend unavailable, using local review save:', err.message);
    }

    // Fallback if backend didn't return
    if (!newReviewObj) {
      newReviewObj = {
        _id: String(Date.now()),
        productId: String(quickViewProduct.id),
        productName: quickViewProduct.name,
        productImage: quickViewProduct.image,
        name: reviewerName.trim(),
        email: reviewerEmail.trim(),
        rating: Number(userRating),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };
    }

    const updatedList = [newReviewObj, ...reviews];
    setReviews(updatedList);

    // Save to local storage cache for persistence
    localStorage.setItem(`stylehub_reviews_${quickViewProduct.id}`, JSON.stringify(updatedList));

    // Update aggregate counts
    const newCount = updatedList.length;
    const newAvg = Number((updatedList.reduce((s, r) => s + Number(r.rating), 0) / newCount).toFixed(1));
    setTotalReviewsCount(newCount);
    setAvgRating(newAvg);

    // Update local ratingCounts
    setRatingCounts((prev) => ({
      ...prev,
      [userRating]: (prev[userRating] || 0) + 1,
    }));

    toast.success('Thank you! Your review has been submitted successfully.');
    setComment('');
    setIsSubmittingReview(false);
  };

  if (!quickViewProduct) return null;

  const wish = isWishlisted(quickViewProduct.id);
  const sizes = quickViewProduct.sizes || ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = quickViewProduct.colors || [];

  // Related products from same category (excluding current product)
  const relatedProducts = (products || [])
    .filter(
      (p) =>
        String(p.id) !== String(quickViewProduct.id) &&
        p.category?.toLowerCase() === quickViewProduct.category?.toLowerCase()
    )
    .slice(0, 4);

  // Fallback related products if category has no other products
  const displayedRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : (products || []).filter((p) => String(p.id) !== String(quickViewProduct.id)).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop overlay */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Main Modal Container */}
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-y-auto z-10 custom-scrollbar border border-gray-100 flex flex-col my-auto">
        
        {/* Sticky Modal Header / Close Button */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff2056]">
            <Sparkles className="w-4 h-4" />
            <span>Product Quick View</span>
          </div>
          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-2 text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-full transition-all"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-10">
          {/* SECTION 1: Product Top Overview (Grid 2 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Product Image with Interactive GlamNGrace Hover Zoom */}
            <div className="space-y-3">
              <div
                className="relative aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-gray-100 cursor-crosshair select-none group"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-top pointer-events-none transition-transform duration-150 ease-out"
                  style={
                    isZoomed
                      ? {
                          transform: 'scale(2.4)',
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        }
                      : {
                          transform: 'scale(1)',
                          transformOrigin: 'center center',
                        }
                  }
                />
                {!isZoomed && (
                  <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#ff2056]" />
                    <span>Hover to Zoom</span>
                  </div>
                )}
                {quickViewProduct.discountBadge && (
                  <span className="absolute top-4 left-4 bg-[#ff2056] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg pointer-events-none">
                    {quickViewProduct.discountBadge}
                  </span>
                )}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-slate-700 shadow-sm flex items-center gap-1 pointer-events-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Authentic</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-[#ff2056] text-[11px] font-bold uppercase tracking-wider mb-2">
                  {quickViewProduct.category}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                  {quickViewProduct.name}
                </h2>

                {/* Rating Summary Header with Fractional Star Fill */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const fillPct = Math.max(0, Math.min(100, (avgRating - index) * 100));
                      return (
                        <div key={index} className="relative inline-block w-4 h-4">
                          <Star className="w-4 h-4 text-gray-300 fill-gray-200" />
                          {fillPct > 0 && (
                            <div
                              className="absolute left-0 top-0 bottom-0 overflow-hidden"
                              style={{ width: `${fillPct}%` }}
                            >
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-sm font-bold text-slate-800">{avgRating}</span>
                  <span className="text-gray-400 text-xs font-medium">
                    ({totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl font-black text-slate-900">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.oldPrice && (
                    <span className="text-base text-gray-400 line-through font-medium">
                      {formatPrice(quickViewProduct.oldPrice)}
                    </span>
                  )}
                  {quickViewProduct.oldPrice && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Save {formatPrice(quickViewProduct.oldPrice - quickViewProduct.price)}
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm text-gray-600 mt-4 leading-relaxed">
                  {quickViewProduct.description ||
                    'Premium craftmanship designed for superior comfort, elegant fit, and durable everyday style.'}
                </p>

                {/* Color Selector (if available) */}
                {colors.length > 0 && (
                  <div className="mt-5">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block mb-2">
                      Color Option: <span className="font-semibold text-gray-600">{selectedColor || colors[0]}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            selectedColor === c
                              ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                              : 'border-gray-200 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                <div className="mt-5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block mb-2">
                    Select Size: <span className="text-[#ff2056] font-bold">{selectedSize}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`w-11 h-10 rounded-xl text-xs font-bold transition-all border ${
                          selectedSize === sz
                            ? 'border-[#ff2056] bg-[#ff2056] text-white shadow-md scale-105'
                            : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="mt-5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center w-32 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, quantity, selectedSize, selectedColor);
                      toast.success(`Added ${quantity}x "${quickViewProduct.name}" to cart!`);
                    }}
                    className="flex-1 bg-[#ff2056] hover:bg-[#e01648] text-white py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart ({formatPrice(quickViewProduct.price * quantity)})</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(quickViewProduct)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      wish
                        ? 'border-rose-200 bg-rose-50 text-[#ff2056]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                    title={wish ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${wish ? 'fill-[#ff2056]' : ''}`} />
                  </button>
                </div>
              </div>

            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 2: Related Category Products */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Related Products in <span className="text-[#ff2056]">{quickViewProduct.category}</span>
                </h3>
                <p className="text-xs text-gray-500">You may also be interested in these items</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {displayedRelated.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => setQuickViewProduct(rel)}
                  className="group cursor-pointer bg-slate-50 hover:bg-white rounded-2xl p-3 border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white mb-2">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#ff2056]" />
                        Quick View
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#ff2056] transition-colors">
                      {rel.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-black text-slate-900">
                        {formatPrice(rel.price)}
                      </span>
                      <div className="flex items-center text-amber-400 text-[10px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="ml-0.5 text-gray-600 font-bold">{rel.rating || 5.0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 3: Customer Rating & Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#ff2056]" />
                  <span>Customer Reviews & Ratings</span>
                </h3>
                <p className="text-xs text-gray-500">Real feedback from verified buyers</p>
              </div>
            </div>

            {/* Overall Rating & Rating Bar Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-gray-100">
              
              {/* Left Score Box */}
              <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6">
                <span className="text-4xl font-black text-slate-900">{avgRating}</span>
                <div className="flex items-center gap-0.5 my-1.5">
                  {[0, 1, 2, 3, 4].map((index) => {
                    const fillPct = Math.max(0, Math.min(100, (avgRating - index) * 100));
                    return (
                      <div key={index} className="relative inline-block w-4 h-4">
                        <Star className="w-4 h-4 text-gray-300 fill-gray-200" />
                        {fillPct > 0 && (
                          <div
                            className="absolute left-0 top-0 bottom-0 overflow-hidden"
                            style={{ width: `${fillPct}%` }}
                          >
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  Based on {totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>

              {/* Right Rating Progress Bars */}
              <div className="md:col-span-2 space-y-2 justify-center flex flex-col">
                {[5, 4, 3, 2, 1].map((starNum) => {
                  const count = ratingCounts[starNum] || 0;
                  const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                  return (
                    <div key={starNum} className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 w-12 font-bold text-gray-700">
                        <span>{starNum}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right font-medium text-gray-500">{pct}%</span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Write a Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Write a Customer Review
                </h4>
                {isAuthenticated && (
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Logged in as {user?.name || user?.email}
                  </span>
                )}
              </div>

              {/* Star Rating Input Selector */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Your Rating: <span className="text-amber-500 font-extrabold">{userRating} / 5 Stars</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-gray-300 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || userRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* User Information Fields (Name & Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Your Email Address <span className="text-rose-500">*</span>
                    {isAuthenticated && (
                      <span className="ml-1 text-[10px] text-gray-400 font-normal">(Read-only)</span>
                    )}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={reviewerEmail}
                      onChange={(e) => setReviewerEmail(e.target.value)}
                      required
                      readOnly={isAuthenticated}
                      placeholder="Enter your email address"
                      className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border outline-none transition-all ${
                        isAuthenticated
                          ? 'bg-slate-100 border-slate-200 text-slate-600 font-medium cursor-not-allowed'
                          : 'bg-white border-gray-200 focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Review Comment Textarea */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Your Review / Comment <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  placeholder="Share your opinion, material feel, size fit, or overall experience with this product..."
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-[#ff2056] hover:bg-[#e01648] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>

            {/* Display Customer Reviews List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Customer Feedback ({reviews.length})
              </h4>

              {isLoadingReviews ? (
                <div className="text-center py-6 text-xs text-gray-500">Loading customer reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 space-y-1">
                  <MessageSquare className="w-8 h-8 mx-auto text-gray-300" />
                  <p className="text-xs font-bold text-slate-700">No reviews yet</p>
                  <p className="text-[11px] text-gray-400">Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev, index) => (
                    <div
                      key={rev._id || index}
                      className="bg-slate-50/70 p-4 rounded-2xl border border-gray-100 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            userAvatar={
                              rev.userAvatar ||
                              (user && user.email && rev.email && user.email.toLowerCase() === rev.email.toLowerCase()
                                ? user.avatar || user.picture || user.image
                                : '')
                            }
                            name={rev.name}
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">
                              {rev.name}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                              <Check className="w-3 h-3 text-emerald-600" /> Verified Buyer
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (rev.rating || 5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductQuickViewModal;
