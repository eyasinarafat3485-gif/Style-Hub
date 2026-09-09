import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

const UserAvatar = ({ userAvatar, name, bgClass = 'bg-[#ff2056]' }) => {
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
        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
      />
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-full ${bgClass} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs uppercase border border-white/20`}
    >
      {getInitials(name)}
    </div>
  );
};

const CustomerReviews = () => {
  const { user } = useAuth();
  const [reviewsList, setReviewsList] = useState([]);
  const [avgRating, setAvgRating] = useState(5.0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Real Reviews directly from MongoDB Database
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/reviews`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.reviews)) {
            const dbReviews = data.reviews;

            if (dbReviews.length > 0) {
              const formattedDb = dbReviews.map((r, i) => ({
                id: r._id || `db-${i}`,
                name: r.name || 'Customer',
                avatarText: (r.name || 'C').substring(0, 2).toUpperCase(),
                avatarBg: getAvatarBgClass(r.name || r.email),
                userAvatar: r.userAvatar || null,
                rating: Number(r.rating) || 5,
                comment: r.comment || '',
                productImage: r.productImage || null,
                productName: r.productName || null,
                createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recently',
              }));

              // STRICT MATCH: Only display database reviews!
              setReviewsList(formattedDb);

              // Calculate exact average rating & count from MongoDB
              const sum = formattedDb.reduce((acc, curr) => acc + Number(curr.rating || 5), 0);
              const computedAvg = Number((sum / formattedDb.length).toFixed(1));
              setAvgRating(computedAvg);
              setTotalCount(formattedDb.length);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.log('MongoDB reviews fetch notice:', err.message);
      }
      setIsLoading(false);
    };

    fetchAllReviews();
  }, []);

  // Compute dynamic label based on real database average
  const ratingLabel =
    avgRating >= 4.8
      ? 'Excellent'
      : avgRating >= 4.3
      ? 'Very Good'
      : avgRating >= 3.8
      ? 'Good'
      : 'Satisfactory';

  if (isLoading) {
    return (
      <section className="py-12 bg-[#fafaf9] border-b border-gray-200/70 text-center text-xs text-gray-500">
        Loading real customer reviews from database...
      </section>
    );
  }

  if (reviewsList.length === 0) {
    return (
      <section className="py-12 bg-[#fafaf9] border-b border-gray-200/70 select-none">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Member Reviews &amp; Rating</h2>
          <p className="text-xs text-gray-500 mt-2">No reviews in database yet. Be the first to leave a review!</p>
        </div>
      </section>
    );
  }

  // Multiply items for smooth infinite loop if review count is small
  const marqueeItems =
    reviewsList.length < 5
      ? [...reviewsList, ...reviewsList, ...reviewsList, ...reviewsList]
      : reviewsList;

  return (
    <section className="py-12 sm:py-16 bg-[#fafaf9] border-b border-gray-200/70 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 text-left">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Member Reviews &amp; Rating
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1.5">
            Authentic feedback from verified StyleHub shoppers (Database Real-time Sync)
          </p>
        </div>

        {/* Reviews Grid & Carousel Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Real MongoDB Rating Summary Card */}
          <div className="lg:col-span-4 xl:col-span-3 flex">
            <div className="w-full bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs flex flex-col items-center justify-center text-center">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                {ratingLabel}
              </h3>

              {/* 5 Star Boxes with Fractional / Partial Fill (e.g. 3.3 = 3 full + 30% of 4th star) */}
              <div className="flex items-center gap-1.5 my-3.5">
                {[0, 1, 2, 3, 4].map((index) => {
                  const fillPct = Math.max(0, Math.min(100, (avgRating - index) * 100));
                  return (
                    <div
                      key={index}
                      className="relative w-7 h-7 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden shadow-xs shrink-0"
                    >
                      {/* Background Gray Star */}
                      <Star className="w-4 h-4 fill-gray-400 text-gray-400 z-0" />

                      {/* Dynamic Partial Amber Overlay */}
                      {fillPct > 0 && (
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-amber-400 flex items-center overflow-hidden transition-all duration-300 z-10"
                          style={{ width: `${fillPct}%` }}
                        >
                          <div className="w-7 h-7 flex items-center justify-center shrink-0">
                            <Star className="w-4 h-4 fill-white text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Exact Real Rating Text from MongoDB */}
              <p className="text-xs font-semibold text-gray-700">
                <span className="font-bold text-slate-900">{avgRating}</span> out of{' '}
                <span className="font-bold text-slate-900">5</span> based on{' '}
                <span className="font-bold text-slate-900">{totalCount}</span> {totalCount === 1 ? 'review' : 'reviews'}
              </p>

              {/* Verified Member Reviews Badge */}
              <div className="mt-5 pt-4 border-t border-gray-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Verified Customer Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real MongoDB Reviews Display */}
          <div className="lg:col-span-8 xl:col-span-9 overflow-hidden relative rounded-2xl flex items-center">
            {/* Subtle Gradient Fade on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#fafaf9] to-transparent z-10 pointer-events-none hidden sm:block" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fafaf9] to-transparent z-10 pointer-events-none hidden sm:block" />

            {/* Continuous Marquee Track displaying MongoDB reviews */}
            <div className="animate-marquee-slow flex items-stretch gap-5 py-2">
              {marqueeItems.map((item, idx) => (
                <div
                  key={`db-rev-${item.id}-${idx}`}
                  className="w-[300px] sm:w-[340px] shrink-0 bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs hover:shadow-md hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Quotation Marks & Product Tag with Thumbnail */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <div className="text-3xl font-serif font-black text-rose-300/80 leading-none select-none">
                        ““
                      </div>
                      {item.productName && (
                        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full max-w-[170px]">
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-4 h-4 rounded-full object-cover shrink-0"
                            />
                          )}
                          <span className="text-[10px] text-[#ff2056] font-bold truncate">
                            {item.productName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Review Comment from MongoDB */}
                    <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed italic font-normal">
                      "{item.comment}"
                    </p>
                  </div>

                  {/* Reviewer User Profile (User Avatar / User Initials Circle) */}
                  <div className="flex items-center gap-3 pt-5 mt-4 border-t border-gray-100">
                    <UserAvatar
                      userAvatar={
                        item.userAvatar ||
                        (user && user.email && item.email && user.email.toLowerCase() === item.email.toLowerCase()
                          ? user.avatar || user.picture || user.image
                          : '')
                      }
                      name={item.name}
                      bgClass={item.avatarBg}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#ff2056] transition-colors truncate">
                          {item.name}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0 ml-1" />
                      </div>

                      {/* Rating Stars matching MongoDB rating */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < item.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
