import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';
import { toast } from 'react-toastify';

// Default baseline configuration mirroring pristine UI
export const DEFAULT_SITE_SETTINGS = {
  storeName: 'StyleHub Fashion',
  supportEmail: 'support@stylehub.com.bd',
  supportPhone: '+880 1711-000000',
  storeAddress: 'House 12, Road 5, Dhanmondi, Dhaka-1205, Bangladesh',

  theme: {
    primaryColor: '#ff2056',
    secondaryColor: '#e01648',
    accentColor: '#f43f5e',
    fontFamily: 'Inter',
    preset: 'crimson',
    borderRadius: '0.75rem',
  },

  branding: {
    logoText: 'StyleHub',
    logoUrl: '',
    faviconUrl: '',
    tagline: 'Wear Your Style',
  },

  topNotice: {
    enabled: true,
    announcements: [
      'Free Delivery on orders over ৳1499',
      '30 Days Easy Returns & Exchange',
      'Cash on Delivery Available Nationwide',
      '100% Authentic Quality Guaranteed',
      '24/7 Dedicated Help & Support',
      'New Season Collections & Trending Outfits',
    ],
  },

  heroSlider: [
    {
      id: 'slide-1',
      badge: "NEW SEASON 2025 · MEN'S PREMIUM SHIRTS",
      titleStart: 'Style That Speaks',
      titleHighlight: 'CONFIDENCE.',
      subtitle: 'Premium quality cotton shirts, tailored casuals & everyday menswear essentials crafted for comfort, breathability and timeless style.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80',
      primaryBtnText: 'EXPLORE SHIRTS',
      primaryBtnLink: '/shop?category=Shirt',
      secondaryBtnText: "MEN'S COLLECTION",
      secondaryBtnLink: '/men',
      bgGradient: 'from-stone-100 via-rose-50/40 to-amber-50/30',
      active: true,
    },
    {
      id: 'slide-2',
      badge: 'FESTIVE COLLECTION',
      titleStart: 'ELEGANCE IN EVERY ',
      titleHighlight: 'THREAD',
      subtitle: 'Exclusive designer Panjabis & traditional wear for Jummah, Eid & celebrations.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80',
      primaryBtnText: 'Explore Panjabi',
      primaryBtnLink: '/shop?category=Panjabi',
      secondaryBtnText: 'View All',
      secondaryBtnLink: '/shop',
      bgGradient: 'from-amber-50/60 via-stone-100 to-rose-50/30',
      active: true,
    },
    {
      id: 'slide-3',
      badge: 'MODERN STREETWEAR',
      titleStart: 'COMFORT MEETS ',
      titleHighlight: 'TRENDS',
      subtitle: 'Oversized t-shirts, polo tops and denim crafted for modern urban lifestyle.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80',
      primaryBtnText: 'Shop Streetwear',
      primaryBtnLink: '/shop',
      secondaryBtnText: 'New Arrivals',
      secondaryBtnLink: '/new-arrivals',
      bgGradient: 'from-stone-100 via-gray-50 to-rose-50/50',
      active: true,
    },
  ],

  promoBanners: [
    {
      id: 'promo-1',
      badge: 'Summer Edit',
      title: 'Up to 40% Off',
      description: 'Light, breathable & fresh seasonal styles.',
      buttonText: 'Shop Now',
      link: '/shop?category=Women',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
      badgeColor: 'amber',
      active: true,
    },
    {
      id: 'promo-2',
      badge: 'Panjabi & Ethnic',
      title: 'New Arrivals',
      description: 'Exquisite designs for festive occasions.',
      buttonText: 'Explore',
      link: '/shop?category=Panjabi',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      badgeColor: 'emerald',
      active: true,
    },
    {
      id: 'promo-3',
      badge: 'Student Offer',
      title: 'Extra 10% Off',
      description: 'Verify your student ID & save instantly.',
      buttonText: 'Get Discount',
      link: '/shop',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
      badgeColor: 'rose',
      active: true,
    },
  ],

  pageContent: {
    aboutUs: {
      badge: 'About StyleHub',
      heroTitle: 'Modern fashion designed for uncompromising quality & comfort.',
      heroSubtitle:
        'StyleHub is an independent fashion brand founded on the belief that everyday clothing should look sharp, feel effortless, and stand the test of time.',
      heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
      storyHeading: 'Crafted with passion, worn with pride.',
      storyText1:
        'StyleHub began with a simple observation: modern fashion in Bangladesh often forces customers to choose between exorbitant international designer price tags or low-grade fast fashion that deteriorates after a couple of washes.',
      storyText2:
        'We bridged that divide. By establishing direct artisan and mill partnerships across Bangladesh, we curate and produce garments using authentic, durable textiles designed for South Asian climate and lifestyle.',
      values: [
        {
          num: '01',
          title: 'Pure Fabric Standards',
          desc: 'Every piece is crafted from 100% combed organic cotton, natural linen, or fine silk. Breathable, durable, and shrink-resistant.',
        },
        {
          num: '02',
          title: 'Ergonomic Modern Fitting',
          desc: 'Designed with precision tailored cuts crafted specifically for South Asian ergonomics, delivering a sharp and comfortable fit.',
        },
        {
          num: '03',
          title: 'Customer-Centric Promises',
          desc: 'Cash on delivery across all 64 districts with instant parcel inspection, 7-day doorstep exchange, and 24/7 support.',
        },
      ],
      stats: [
        { value: '50,000+', label: 'Happy Customers' },
        { value: '100%', label: 'Authentic Fabrics' },
        { value: '64', label: 'Districts Covered' },
        { value: '4.9 ★', label: 'Average Rating' },
      ],
    },
    faq: [
      {
        id: 'faq-1',
        category: 'Orders & Delivery',
        question: 'How long does delivery take across Bangladesh?',
        answer:
          'Delivery inside Dhaka city usually takes 24 to 48 hours. For areas outside Dhaka (sub-districts & all 64 districts), delivery typically takes 2 to 4 business days via our trusted courier partners (Steadfast, Pathao & RedX).',
      },
      {
        id: 'faq-2',
        category: 'Orders & Delivery',
        question: 'How can I track my active order?',
        answer:
          'Once your order is confirmed, you will receive real-time status updates in your StyleHub User Dashboard under "My Orders". You will also receive an SMS with the courier tracking ID once shipped.',
      },
      {
        id: 'faq-3',
        category: 'Payments & Security',
        question: 'What payment methods do you support? Is Cash on Delivery available?',
        answer:
          'Yes! We offer 100% Cash on Delivery (COD) all over Bangladesh. We also accept instant online payments via bKash, Nagad, Rocket, Visa, Mastercard, and Debit/Credit cards with bank-grade 256-bit encryption.',
      },
      {
        id: 'faq-4',
        category: 'Returns & Exchange',
        question: 'What is your return & exchange policy?',
        answer:
          'We offer an easy 7-day hassle-free return and exchange policy! If you receive a defective item, wrong size, or are unsatisfied with the fit, simply initiate a return from your dashboard or contact our WhatsApp helpline (+880 1700-000000).',
      },
      {
        id: 'faq-5',
        category: 'Product & Quality',
        question: 'Are the products 100% authentic and premium quality?',
        answer:
          'Absolutely. Every StyleHub garment is crafted from 100% combed organic cotton, authentic linen, or pure silk fabrics. All items undergo a strict 3-stage quality inspection before packaging.',
      },
    ],
    trustBadges: [
      { id: 'tb-1', icon: 'Headset', title: '24/7 Support', desc: "We're here to help" },
      { id: 'tb-2', icon: 'Truck', title: 'Free Shipping', desc: 'On orders over ৳1499' },
      { id: 'tb-3', icon: 'RotateCcw', title: '30 Days Returns', desc: 'Easy return & exchange' },
      { id: 'tb-4', icon: 'ShieldCheck', title: 'Secure Payment', desc: '100% secure checkout' },
      { id: 'tb-5', icon: 'Banknote', title: 'Cash on Delivery', desc: 'Pay at your doorstep' },
    ],
  },

  footer: {
    aboutText: 'Your one-stop destination for stylish, comfortable & premium quality clothing in Bangladesh.',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    tiktokUrl: 'https://tiktok.com',
    youtubeUrl: 'https://youtube.com',
    copyrightText: 'StyleHub Bangladesh. All Rights Reserved.',
  },

  currency: {
    code: 'BDT',
    symbol: '৳',
    name: 'Bangladeshi Taka',
  },

  shipping: {
    insideDhakaFee: 60,
    outsideDhakaFee: 120,
    freeShippingThreshold: 3000,
    estimatedDeliveryInside: '24-48 Hours',
    estimatedDeliveryOutside: '2-4 Days',
  },

  paymentMethods: [],
  orderNotifications: {
    emailAlerts: true,
    smsAlerts: true,
    notificationEmail: 'admin@stylehub.com',
  },
};

const SiteSettingsContext = createContext();

// Helper to load Google Fonts dynamically
const loadGoogleFont = (fontName) => {
  if (!fontName || typeof document === 'undefined') return;
  const formattedFont = fontName.trim().replace(/\s+/g, '+');
  const linkId = `google-font-${formattedFont}`;

  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }
};

// Helper to inject CSS theme variables
const applyThemeCss = (theme) => {
  if (!theme || typeof document === 'undefined') return;

  const root = document.documentElement;
  const primary = theme.primaryColor || '#ff2056';
  const secondary = theme.secondaryColor || '#e01648';
  const accent = theme.accentColor || '#f43f5e';
  const font = theme.fontFamily || 'Inter';

  root.style.setProperty('--brand-primary', primary);
  root.style.setProperty('--brand-secondary', secondary);
  root.style.setProperty('--brand-accent', accent);
  root.style.setProperty('--brand-font', `'${font}', sans-serif`);

  // Load font family
  loadGoogleFont(font);
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('stylehub_site_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          theme: { ...DEFAULT_SITE_SETTINGS.theme, ...(parsed.theme || {}) },
          branding: { ...DEFAULT_SITE_SETTINGS.branding, ...(parsed.branding || {}) },
          topNotice: { ...DEFAULT_SITE_SETTINGS.topNotice, ...(parsed.topNotice || {}) },
          pageContent: {
            ...DEFAULT_SITE_SETTINGS.pageContent,
            ...(parsed.pageContent || {}),
            aboutUs: { ...DEFAULT_SITE_SETTINGS.pageContent.aboutUs, ...(parsed.pageContent?.aboutUs || {}) },
          },
          footer: { ...DEFAULT_SITE_SETTINGS.footer, ...(parsed.footer || {}) },
        };
      }
    } catch (_) {}
    return DEFAULT_SITE_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Apply CSS theme variables whenever settings.theme changes
  useEffect(() => {
    if (settings?.theme) {
      applyThemeCss(settings.theme);
    }
  }, [settings?.theme]);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (!res.ok) throw new Error('Failed to load settings');
      const data = await res.json();

      if (data.success && data.settings) {
        const s = data.settings;
        const merged = {
          ...DEFAULT_SITE_SETTINGS,
          ...s,
          theme: { ...DEFAULT_SITE_SETTINGS.theme, ...(s.theme || {}) },
          branding: { ...DEFAULT_SITE_SETTINGS.branding, ...(s.branding || {}) },
          topNotice: { ...DEFAULT_SITE_SETTINGS.topNotice, ...(s.topNotice || {}) },
          heroSlider: Array.isArray(s.heroSlider) && s.heroSlider.length > 0 ? s.heroSlider : DEFAULT_SITE_SETTINGS.heroSlider,
          promoBanners: Array.isArray(s.promoBanners) && s.promoBanners.length > 0 ? s.promoBanners : DEFAULT_SITE_SETTINGS.promoBanners,
          pageContent: {
            ...DEFAULT_SITE_SETTINGS.pageContent,
            ...(s.pageContent || {}),
            aboutUs: {
              ...DEFAULT_SITE_SETTINGS.pageContent.aboutUs,
              ...(s.pageContent?.aboutUs || {}),
            },
            faq: Array.isArray(s.pageContent?.faq) && s.pageContent.faq.length > 0 ? s.pageContent.faq : DEFAULT_SITE_SETTINGS.pageContent.faq,
            trustBadges: Array.isArray(s.pageContent?.trustBadges) && s.pageContent.trustBadges.length > 0 ? s.pageContent.trustBadges : DEFAULT_SITE_SETTINGS.pageContent.trustBadges,
          },
          footer: { ...DEFAULT_SITE_SETTINGS.footer, ...(s.footer || {}) },
        };

        setSettings(merged);
        localStorage.setItem('stylehub_site_settings', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Using default or cached site settings:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update site settings (Admin)
  const updateSiteSettings = async (newPayload, token) => {
    try {
      const authToken =
        token ||
        localStorage.getItem('stylehub_token') ||
        localStorage.getItem('stylehub_auth_token');

      const headers = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(newPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update settings');
      }

      const s = data.settings || {};
      const updated = {
        ...DEFAULT_SITE_SETTINGS,
        ...s,
        theme: { ...DEFAULT_SITE_SETTINGS.theme, ...(s.theme || {}) },
        branding: { ...DEFAULT_SITE_SETTINGS.branding, ...(s.branding || {}) },
        topNotice: { ...DEFAULT_SITE_SETTINGS.topNotice, ...(s.topNotice || {}) },
        heroSlider: Array.isArray(s.heroSlider) && s.heroSlider.length > 0 ? s.heroSlider : (newPayload.heroSlider || DEFAULT_SITE_SETTINGS.heroSlider),
        promoBanners: Array.isArray(s.promoBanners) && s.promoBanners.length > 0 ? s.promoBanners : (newPayload.promoBanners || DEFAULT_SITE_SETTINGS.promoBanners),
        pageContent: {
          ...DEFAULT_SITE_SETTINGS.pageContent,
          ...(s.pageContent || {}),
          aboutUs: { ...DEFAULT_SITE_SETTINGS.pageContent?.aboutUs, ...(s.pageContent?.aboutUs || {}) },
          faq: Array.isArray(s.pageContent?.faq) && s.pageContent.faq.length > 0 ? s.pageContent.faq : (newPayload.pageContent?.faq || DEFAULT_SITE_SETTINGS.pageContent.faq),
          trustBadges: Array.isArray(s.pageContent?.trustBadges) && s.pageContent.trustBadges.length > 0 ? s.pageContent.trustBadges : (newPayload.pageContent?.trustBadges || DEFAULT_SITE_SETTINGS.pageContent.trustBadges),
        },
        footer: { ...DEFAULT_SITE_SETTINGS.footer, ...(s.footer || {}) },
        shipping: { ...DEFAULT_SITE_SETTINGS.shipping, ...(s.shipping || {}) },
        currency: { ...DEFAULT_SITE_SETTINGS.currency, ...(s.currency || {}) },
        orderNotifications: { ...DEFAULT_SITE_SETTINGS.orderNotifications, ...(s.orderNotifications || {}) },
        paymentMethods: Array.isArray(s.paymentMethods) ? s.paymentMethods : (newPayload.paymentMethods || DEFAULT_SITE_SETTINGS.paymentMethods),
      };

      setSettings(updated);
      localStorage.setItem('stylehub_site_settings', JSON.stringify(updated));
      if (updated.theme) {
        applyThemeCss(updated.theme);
      }

      toast.success('Site Customizations saved & applied live! ✨');
      return { success: true, settings: updated };
    } catch (err) {
      toast.error(err.message || 'Error saving settings');
      return { success: false, error: err.message };
    }
  };

  // Reset to default factory settings (Admin)
  const resetToFactoryDefaults = async (token) => {
    try {
      const authToken =
        token ||
        localStorage.getItem('stylehub_token') ||
        localStorage.getItem('stylehub_auth_token');

      const res = await fetch(`${API_BASE_URL}/settings/reset-defaults`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset settings');
      }

      setSettings(DEFAULT_SITE_SETTINGS);
      localStorage.setItem('stylehub_site_settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
      applyThemeCss(DEFAULT_SITE_SETTINGS.theme);

      toast.success('Site settings restored to pristine defaults! 🔄');
      return { success: true, settings: DEFAULT_SITE_SETTINGS };
    } catch (err) {
      toast.error(err.message || 'Error resetting settings');
      return { success: false, error: err.message };
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
        updateSiteSettings,
        resetToFactoryDefaults,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export default SiteSettingsContext;
