import React from 'react';
import HeroVideoSection from '../components/HeroVideoSection';
import TrustBadges from '../components/TrustBadges';
import CategoryCircles from '../components/CategoryCircles';
import PromoBanners from '../components/PromoBanners';
import TrendingProducts from '../components/TrendingProducts';
import BrandLogos from '../components/BrandLogos';
import WhyChooseUs from '../components/WhyChooseUs';
import StyleInspiration from '../components/StyleInspiration';
import Newsletter from '../components/Newsletter';

const HomePage = () => {
  return (
    <>
      {/* 1. Ultra-Luxury Video Hero Section (GlamNGrace Style) */}
      <HeroVideoSection />

      {/* 2. Horizontal Trust Badges */}
      <TrustBadges />

      {/* 3. Circular Category Grid */}
      <CategoryCircles />

      {/* 4. Three Promo Banners */}
      <PromoBanners />

      {/* 5. Trending Products Grid */}
      <TrendingProducts />

      {/* 6. Partner Brand Logos Banner */}
      <BrandLogos />

      {/* 7. Why Choose StyleHub Section */}
      <WhyChooseUs />

      {/* 8. Style Inspiration Instagram Grid */}
      <StyleInspiration />

      {/* 9. Newsletter Subscription Banner */}
      <Newsletter />
    </>
  );
};

export default HomePage;
