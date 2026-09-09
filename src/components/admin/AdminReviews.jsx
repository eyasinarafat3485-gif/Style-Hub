import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { Star, Trash2, Search, RefreshCw, MessageSquare, CheckCircle2, ChevronLeft, ChevronRight, User, Eye, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';

const bgColors = [
  'bg-indigo-600',
  'bg-blue-600',
  'bg-[#ff2056]',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-purple-600',
];

const getAvatarBgClass = (str) => {
  if (!str) return bgColors[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
};

const UserAvatar = ({ userAvatar, name, bgClass }) => {
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

  const computedBg = bgClass || getAvatarBgClass(name);

  if (isValid && !imgFailed) {
    return (
      <img
        src={userAvatar}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
      />
    );
  }

  return (
    <div
      className={`w-7 h-7 rounded-full ${computedBg} text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs uppercase border border-white/20`}
    >
      {getInitials(name)}
    </div>
  );
};

const AdminReviews = () => {
  const { user } = useAuth();
  const { products, setQuickViewProduct } = useShop();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(5.0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // View Product Modal Details & Reviews
  const handleViewProduct = (productId, productName, productImage) => {
    let target = (products || []).find(
      (p) => String(p.id) === String(productId) || String(p._id) === String(productId)
    );

    if (!target && productName) {
      target = (products || []).find(
        (p) =>
          p.name?.toLowerCase() === productName.toLowerCase() ||
          p.title?.toLowerCase() === productName.toLowerCase()
      );
    }

    if (target) {
      setQuickViewProduct(target);
    } else {
      // Fallback modal object if product deleted or static
      setQuickViewProduct({
        id: String(productId || Date.now()),
        name: productName || 'Product Details',
        price: 1200,
        image: productImage || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
        category: 'Fashion',
        description: 'Product customer feedback and review details.',
      });
    }
  };

  // Fetch Real Reviews from MongoDB Database
  const fetchAdminReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          setTotalCount(data.count || data.reviews.length);
          setAvgRating(data.averageRating || 5.0);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, using local cache:', err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAdminReviews();
  }, []);

  // Delete Review Modal State & Handler
  const [deleteReviewModal, setDeleteReviewModal] = useState({
    isOpen: false,
    reviewId: null,
    reviewerName: '',
    isDeleting: false,
  });

  const promptDeleteReview = (reviewId, reviewerName) => {
    setDeleteReviewModal({
      isOpen: true,
      reviewId,
      reviewerName: reviewerName || 'Customer',
      isDeleting: false,
    });
  };

  const handleConfirmDeleteReview = async () => {
    if (!deleteReviewModal.reviewId) return;
    const reviewId = deleteReviewModal.reviewId;
    setDeleteReviewModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Review deleted successfully');
        const updated = reviews.filter((r) => r._id !== reviewId);
        setReviews(updated);
        setTotalCount(updated.length);

        if (updated.length > 0) {
          const newAvg = Number(
            (updated.reduce((s, r) => s + Number(r.rating || 5), 0) / updated.length).toFixed(1)
          );
          setAvgRating(newAvg);
        } else {
          setAvgRating(5.0);
        }
        return;
      }
    } catch (err) {
      console.error('Failed to delete review:', err.message);
    } finally {
      setDeleteReviewModal({ isOpen: false, reviewId: null, reviewerName: '', isDeleting: false });
    }

    // Local state fallback if offline
    const updated = reviews.filter((r) => r._id !== reviewId);
    setReviews(updated);
    setTotalCount(updated.length);
    toast.success('Review removed locally');
  };

  // Filter Reviews by Search Query
  const filteredReviews = reviews.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.productName && r.productName.toLowerCase().includes(q)) ||
      (r.comment && r.comment.toLowerCase().includes(q))
    );
  });

  // Pagination Logic (10 reviews per page)
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header & Overall Rating Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#ff2056]" />
            <span>Customer Ratings &amp; Reviews</span>
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Monitor product feedback, customer ratings, and reviews saved in MongoDB database
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={fetchAdminReviews}
            className="p-2 text-gray-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-gray-200"
            title="Refresh reviews"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-xl shadow-xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-amber-900">{avgRating} / 5.0</span>
            <span className="text-[10px] font-semibold text-amber-700">({totalCount} total)</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search reviews by name, email, product, or comment..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] outline-none transition-all"
          />
        </div>

        <span className="text-xs font-bold text-gray-500">
          Showing {currentReviews.length} of {filteredReviews.length} reviews
        </span>
      </div>

      {/* Review Content: Desktop Table + Mobile Responsive Cards */}
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-gray-500 space-y-2">
            <div className="w-7 h-7 border-2 border-rose-200 border-t-[#ff2056] rounded-full animate-spin mx-auto" />
            <p>Loading real reviews from database...</p>
          </div>
        ) : currentReviews.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">
            {searchTerm ? 'No reviews match your search query.' : 'No customer reviews found in MongoDB database.'}
          </div>
        ) : (
          <>
            {/* 1. DESKTOP VIEW (md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3 w-28">Rating</th>
                    <th className="py-2.5 px-3">Review / Comment</th>
                    <th className="py-2.5 px-3 w-28">Date</th>
                    <th className="py-2.5 px-3 w-16 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-xs text-slate-800">
                  {currentReviews.map((rev, index) => {
                    const globalIndex = indexOfFirstItem + index + 1;
                    const avatarBg = getAvatarBgClass(rev.name || rev.email);

                    const effectiveAvatar =
                      rev.userAvatar ||
                      (user && user.email && rev.email && user.email.toLowerCase() === rev.email.toLowerCase()
                        ? user.avatar || user.picture || user.image
                        : '');

                    return (
                      <tr key={rev._id || index} className="hover:bg-slate-50/80 transition-colors">
                        {/* Index */}
                        <td className="py-2.5 px-3 text-center text-gray-400 font-mono text-[11px]">
                          {globalIndex}
                        </td>

                        {/* Customer Info */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar
                              userAvatar={effectiveAvatar}
                              name={rev.name}
                              bgClass={avatarBg}
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate leading-tight">
                                {rev.name}
                              </span>
                              <span className="text-[10px] text-gray-400 truncate block">
                                {rev.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Product Badge */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2 max-w-[180px]">
                            {rev.productImage && (
                              <img
                                src={rev.productImage}
                                alt={rev.productName || 'Product'}
                                className="w-7 h-7 rounded-md object-cover border border-gray-200 shrink-0"
                              />
                            )}
                            <span className="font-semibold text-slate-800 text-[11px] truncate">
                              {rev.productName || `Product #${rev.productId}`}
                            </span>
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <div className="flex items-center text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Number(rev.rating || 5)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-bold text-[11px] text-slate-900 ml-0.5">
                              {rev.rating}.0
                            </span>
                          </div>
                        </td>

                        {/* Comment (Max 2 lines with ...) */}
                        <td className="py-2.5 px-3 max-w-xs">
                          <p
                            className="text-gray-700 text-xs italic font-normal line-clamp-2 leading-snug overflow-hidden text-ellipsis"
                            title={rev.comment}
                          >
                            "{rev.comment}"
                          </p>
                        </td>

                        {/* Date */}
                        <td className="py-2.5 px-3 text-[11px] font-medium text-gray-500 whitespace-nowrap">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recently'}
                        </td>

                        {/* Actions (View & Delete) */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewProduct(rev.productId, rev.productName, rev.productImage)}
                              className="p-1.5 text-gray-500 hover:text-[#ff2056] hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="View product & customer reviews"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => promptDeleteReview(rev._id, rev.name)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Delete review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 2. MOBILE VIEW (< md) */}
            <div className="block md:hidden divide-y divide-gray-100">
              {currentReviews.map((rev, index) => {
                const globalIndex = indexOfFirstItem + index + 1;
                const avatarBg = getAvatarBgClass(rev.name || rev.email);
                const effectiveAvatar =
                  rev.userAvatar ||
                  (user && user.email && rev.email && user.email.toLowerCase() === rev.email.toLowerCase()
                    ? user.avatar || user.picture || user.image
                    : '');

                return (
                  <div key={rev._id || index} className="p-4 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar
                          userAvatar={effectiveAvatar}
                          name={rev.name}
                          bgClass={avatarBg}
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{rev.name}</p>
                          <span className="text-[10px] text-gray-400 block">{rev.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    {/* Product & Comment */}
                    <div className="bg-slate-50 p-2.5 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2">
                        {rev.productImage && (
                          <img
                            src={rev.productImage}
                            alt={rev.productName}
                            className="w-7 h-7 rounded-md object-cover border border-gray-200 shrink-0"
                          />
                        )}
                        <span className="font-semibold text-slate-800 text-[11px] line-clamp-1">
                          {rev.productName || `Product #${rev.productId}`}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 italic">"{rev.comment}"</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400 border-t border-gray-50">
                      <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewProduct(rev.productId, rev.productName, rev.productImage)}
                          className="px-2 py-1 bg-gray-100 hover:bg-slate-900 hover:text-white text-gray-700 rounded-md font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => promptDeleteReview(rev._id, rev.name)}
                          className="p-1 bg-rose-50 text-[#ff2056] hover:bg-[#ff2056] hover:text-white rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination Footer (10 items per page) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-medium">
            Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-900">{totalPages}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#ff2056] text-white shadow-xs'
                      : 'border border-gray-200 text-gray-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {deleteReviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-gray-100 text-center space-y-5 animate-scaleUp relative">
            <button
              onClick={() => setDeleteReviewModal({ isOpen: false, reviewId: null, reviewerName: '', isDeleting: false })}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#ff2056] border border-rose-100 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold font-serif text-slate-900">
                Delete Review?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-sans">
                Are you sure you want to remove the review by <strong className="text-slate-900 font-bold">"{deleteReviewModal.reviewerName}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteReviewModal({ isOpen: false, reviewId: null, reviewerName: '', isDeleting: false })}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteReviewModal.isDeleting}
                onClick={handleConfirmDeleteReview}
                className="w-1/2 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleteReviewModal.isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
