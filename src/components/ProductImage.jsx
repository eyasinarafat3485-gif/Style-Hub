import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

const ProductImage = ({
  src,
  alt = 'StyleHub Product',
  className = '',
  containerClassName = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imgSrc = hasError || !src ? fallbackSrc : src;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-100 ${containerClassName}`}>
      {/* Sleek Skeleton Pulse Shimmer while image is loading */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 via-rose-50/40 to-slate-200/70 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-white/80 shadow-2xs flex items-center justify-center text-slate-300">
            <ShoppingBag className="w-4 h-4 text-rose-300/80 animate-pulse" />
          </div>
        </div>
      )}

      {/* Main Image with smooth fade-in and zoom */}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover object-top transition-all duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default ProductImage;
