import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Play, Pause, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const HeroVideoSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[560px] max-h-[820px] overflow-hidden bg-[#0a0807] select-none">
      {/* 1. Full-Width Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=80"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
      >
        <source
          src="https://xawznadbsqhbnpgopptr.supabase.co/storage/v1/object/public/static/hero.mp4"
          type="video/mp4"
        />
      </video>

      {/* 2. Luxury Dark Gradient Overlays for Readability (Glam & Grace Style) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30 z-[2] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-[2] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#ff2056]/15 via-transparent to-transparent z-[2] pointer-events-none" />

      {/* 3. Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-2xl text-left animate-fade-in">

          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#ff2056] inline-block" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-bold text-rose-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2056]" />
              New Season 2025 · Luxury Apparel
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-serif">
            Style That Speaks <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-[#ff2056]">
              CONFIDENCE.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-gray-200/90 leading-relaxed font-normal max-w-xl">
            Premium quality outfits, relaxed modern tailoring & everyday clothing essentials designed for your unique expression.
            <span className="block mt-1.5 text-xs sm:text-sm text-gray-400 font-light">
              Handpicked fabrics and timeless collections for Men, Women & Kids nationwide.
            </span>
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-[#ff2056] hover:bg-[#e01648] text-white text-xs sm:text-sm uppercase tracking-wider font-bold rounded-lg shadow-xl shadow-rose-950/40 transition-all hover:scale-105 active:scale-95 group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm uppercase tracking-wider font-semibold rounded-lg border border-white/30 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              New Arrivals
            </Link>
          </div>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-white/15 text-[11px] sm:text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff2056]" />
              <span>100% Authentic Quality</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff2056]" />
              <span>Fast Nationwide Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff2056]" />
              <span>Cash on Delivery Available</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Floating Video Player Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2.5">
        <button
          onClick={togglePlay}
          className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 shadow-lg"
          title={isPlaying ? 'Pause Video' : 'Play Video'}
          aria-label="Toggle Video Playback"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
        </button>

        <button
          onClick={toggleMute}
          className="px-3.5 py-2 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 shadow-lg flex items-center gap-1.5 text-xs font-semibold"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label="Toggle Audio"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline text-[11px]">Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#ff2056]" />
              <span className="hidden sm:inline text-[11px] text-[#ff2056]">Sound On</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default HeroVideoSection;
