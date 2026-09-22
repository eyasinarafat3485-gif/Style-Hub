import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  Check,
  MessageSquare,
  Send,
  User,
  Mail,
  ChevronRight,
  ShieldCheck,
  Eye,
  ArrowLeft,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import FAQSection from '../components/FAQSection';

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
        className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
      />
    );
  }

  return (
    <div
      className={`w-9 h-9 rounded-full ${bgClass} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs uppercase border border-white/20`}
    >
      {getInitials(name)}
    </div>
  );
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, formatPrice, addToCart, toggleWishlist, isWishlisted } = useShop();
  const { user, isAuthenticated } = useAuth();

  // Find product by id or slug
  const product = useMemo(() => {
    return (
      products.find(
        (p) =>
          String(p.id) === String(id) ||
          String(p._id) === String(id) ||
          String(p.slug) === String(id)
      ) || null
    );
  }, [products, id]);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Image Hover Zoom State
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

  // Auto-scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Synchronize options & user data when product changes
  useEffect(() => {
    if (product) {
      const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
      setSelectedSize(sizes[0] || 'M');

      const colors = product.colors || [];
      setSelectedColor(colors[0] || '');

      setQuantity(1);
      setUserRating(5);
      setComment('');

      if (isAuthenticated && user) {
        setReviewerName(user.name || user.email?.split('@')[0] || '');
        setReviewerEmail(user.email || '');
      } else {
        setReviewerName('');
        setReviewerEmail('');
      }

      fetchReviews(product.id, product.name || product.title || '');
    }
  }, [product, isAuthenticated, user]);

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
          setAvgRating(data.averageRating || product?.rating || 5.0);
          setTotalReviewsCount(data.count || 0);
          setRatingCounts(data.ratingCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
          setIsLoadingReviews(false);
          return;
        }
      }
    } catch (err) {
      console.log('Backend review fetch notice:', err.message);
    }

    // Local storage fallback for offline mode
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
      setAvgRating(product?.rating || 5.0);
      setTotalReviewsCount(product?.reviewCount || 0);
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
      productId: String(product.id),
      productName: product.name || product.title || '',
      productImage: product.image || '',
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

    if (!newReviewObj) {
      newReviewObj = {
        _id: String(Date.now()),
        productId: String(product.id),
        productName: product.name,
        productImage: product.image,
        name: reviewerName.trim(),
        email: reviewerEmail.trim(),
        rating: Number(userRating),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };
    }

    const updatedList = [newReviewObj, ...reviews];
    setReviews(updatedList);

    localStorage.setItem(`stylehub_reviews_${product.id}`, JSON.stringify(updatedList));

    const newCount = updatedList.length;
    const newAvg = Number((updatedList.reduce((s, r) => s + Number(r.rating), 0) / newCount).toFixed(1));
    setTotalReviewsCount(newCount);
    setAvgRating(newAvg);

    setRatingCounts((prev) => ({
      ...prev,
      [userRating]: (prev[userRating] || 0) + 1,
    }));

    toast.success('Thank you! Your review has been submitted successfully.');
    setComment('');
    setIsSubmittingReview(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'StyleHub Product',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Product link copied to clipboard!');
    }
  };

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 bg-rose-50 text-[#ff2056] rounded-full flex items-center justify-center mb-4">
          <Eye className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-serif mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          The product you are looking for may have been removed, sold out, or is temporarily unavailable.
        </p>
        <Link
          to="/shop"
          className="bg-[#ff2056] hover:bg-[#e01648] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Products</span>
        </Link>
      </div>
    );
  }

  const wish = isWishlisted(product.id);
  const sizes = product.sizes || ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = product.colors || [];

  // Related products from same category
  const relatedProducts = (products || [])
    .filter(
      (p) =>
        String(p.id) !== String(product.id) &&
        p.category?.toLowerCase() === product.category?.toLowerCase()
    )
    .slice(0, 4);

  const displayedRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : (products || []).filter((p) => String(p.id) !== String(product.id)).slice(0, 4);

  return (
    <div className="bg-slate-50/60 min-h-screen py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium overflow-x-auto">
            <Link to="/" className="hover:text-[#ff2056] transition-colors whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link to="/shop" className="hover:text-[#ff2056] transition-colors whitespace-nowrap">
              Shop
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link
              to={`/shop?category=${encodeURIComponent(product.category || 'All')}`}
              className="hover:text-[#ff2056] transition-colors whitespace-nowrap"
            >
              {product.category || 'General'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-[#ff2056] hover:bg-gray-50 transition-colors cursor-pointer"
              title="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Product Image Gallery / Zoom (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div
                className="relative aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-gray-100 cursor-crosshair select-none group"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={product.image}
                  alt={product.name}
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
                  <div className="hidden lg:flex absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity items-center gap-1">
                    <Eye className="w-3 h-3 text-[#ff2056]" />
                    <span>Hover to Zoom</span>
                  </div>
                )}

                {product.discountBadge && (
                  <span className="absolute top-4 left-4 bg-[#ff2056] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg pointer-events-none">
                    {product.discountBadge}
                  </span>
                )}

                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-slate-700 shadow-sm flex items-center gap-1 pointer-events-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Authentic</span>
                </div>
              </div>

              {/* Quality Guarantee Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-gray-100">
                  <Truck className="w-4 h-4 text-[#ff2056] mb-1" />
                  <span className="text-[10px] font-bold text-slate-800">Fast Delivery</span>
                  <span className="text-[9px] text-gray-500">Inside BD</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-gray-100">
                  <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-800">7 Days Return</span>
                  <span className="text-[9px] text-gray-500">Easy Policy</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-gray-100">
                  <ShieldCheck className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-800">100% Safe</span>
                  <span className="text-[9px] text-gray-500">Secure Order</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info & Actions (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-[#ff2056] text-[11px] font-bold uppercase tracking-wider">
                    {product.category || 'General'}
                  </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                    In Stock
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Rating Summary with Click to scroll to reviews */}
                <div className="flex items-center gap-3 mt-3">
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
                  <a
                    href="#reviews-section"
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold underline underline-offset-2"
                  >
                    ({totalReviewsCount} customer {totalReviewsCount === 1 ? 'review' : 'reviews'})
                  </a>
                </div>

                {/* Pricing Display */}
                <div className="flex items-baseline gap-3 mt-5 p-4 rounded-2xl bg-slate-50/80 border border-gray-100">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-base sm:text-lg text-gray-400 line-through font-medium">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                  {product.oldPrice && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      Save {formatPrice(product.oldPrice - product.price)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 mt-5 leading-relaxed">
                  {product.description ||
                    'Premium craftsmanship designed for superior comfort, elegant fit, and durable everyday style.'}
                </p>

                {/* Color Selector */}
                {colors.length > 0 && (
                  <div className="mt-6">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block mb-2">
                      Color Option:{' '}
                      <span className="font-semibold text-gray-600">
                        {selectedColor || colors[0]}
                      </span>
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            selectedColor === c
                              ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                              : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                <div className="mt-6">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block mb-2">
                    Select Size: <span className="text-[#ff2056] font-bold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`w-12 h-11 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
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
                <div className="mt-6">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center w-36 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-11 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-11 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(product, quantity, selectedSize, selectedColor);
                      toast.success(`Added ${quantity}x "${product.name}" to cart! 🛒`);
                    }}
                    className="flex-1 bg-[#ff2056] hover:bg-[#e01648] text-white py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart ({formatPrice(product.price * quantity)})</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
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
        </div>

        {/* SECTION 2: Related Category Products */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Related Products in <span className="text-[#ff2056]">{product.category}</span>
              </h3>
              <p className="text-xs text-gray-500">You may also love these handpicked styles</p>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category || 'All')}`}
              className="text-xs font-bold text-[#ff2056] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedRelated.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/product/${rel.id}`)}
                className="group cursor-pointer bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 mb-3">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="hidden lg:flex absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                    <span className="bg-white/90 text-slate-900 text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#ff2056]" />
                      View Details
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-[#ff2056] transition-colors">
                    {rel.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {formatPrice(rel.price)}
                    </span>
                    <div className="flex items-center text-amber-400 text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="ml-1 text-gray-600 font-bold">{rel.rating || 5.0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Customer Rating & Reviews Section */}
        <div id="reviews-section" className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#ff2056]" />
              <span>Customer Reviews & Ratings</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">Real feedback and ratings from verified buyers</p>
          </div>

          {/* Rating Summary Breakdown Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-gray-100">
            {/* Left Rating Score */}
            <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-8">
              <span className="text-5xl font-black text-slate-900">{avgRating}</span>
              <div className="flex items-center gap-1 my-2">
                {[0, 1, 2, 3, 4].map((index) => {
                  const fillPct = Math.max(0, Math.min(100, (avgRating - index) * 100));
                  return (
                    <div key={index} className="relative inline-block w-5 h-5">
                      <Star className="w-5 h-5 text-gray-300 fill-gray-200" />
                      {fillPct > 0 && (
                        <div
                          className="absolute left-0 top-0 bottom-0 overflow-hidden"
                          style={{ width: `${fillPct}%` }}
                        >
                          <Star className="w-5 h-5 fill-amber-400 text-amber-400 shrink-0" />
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

            {/* Right Progress Bars */}
            <div className="md:col-span-2 space-y-2.5 justify-center flex flex-col">
              {[5, 4, 3, 2, 1].map((starNum) => {
                const count = ratingCounts[starNum] || 0;
                const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                return (
                  <div key={starNum} className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 w-14 font-bold text-gray-700">
                      <span>{starNum}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-medium text-gray-500">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write a Review Form */}
          <form
            onSubmit={handleReviewSubmit}
            className="bg-slate-50/70 rounded-2xl p-6 md:p-8 border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Write a Customer Review
              </h4>
              {isAuthenticated && (
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Logged in as {user?.name || user?.email}
                </span>
              )}
            </div>

            {/* Star Rating Selector */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">
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
                    className="p-1 text-gray-300 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || userRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Email Fields */}
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
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 bg-white focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none transition-all"
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
                className="w-full p-3 text-xs rounded-xl border border-gray-200 bg-white focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-[#ff2056] hover:bg-[#e01648] text-white px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </div>
          </form>

          {/* Display Customer Reviews List */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Customer Feedback ({reviews.length})
            </h4>

            {isLoadingReviews ? (
              <div className="text-center py-8 text-xs text-gray-500">Loading customer reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 space-y-1">
                <MessageSquare className="w-8 h-8 mx-auto text-gray-300" />
                <p className="text-xs font-bold text-slate-700">No reviews yet</p>
                <p className="text-[11px] text-gray-400">Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev, index) => (
                  <div
                    key={rev._id || index}
                    className="bg-slate-50/80 p-5 rounded-2xl border border-gray-100 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
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
                          <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
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

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: Product & Shopping FAQ Section */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <FAQSection
            title={`Questions About Shopping & Delivery`}
            subtitle="Everything you need to know about sizing, authenticity, return policy, and nationwide delivery."
            className="border-0 py-8 sm:py-12"
          />
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;
