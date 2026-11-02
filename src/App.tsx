import React, { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Star,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Plus,
  Check,
  ArrowUpRight,
  Calculator,
  Languages,
  X,
  Instagram,
  Navigation,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  HERO_IMAGE_URL,
  INITIAL_PRODUCTS,
  PARTNER_BRANDS,
  GOOGLE_REVIEWS,
  CategoryId,
  LanguageMode,
  ProductItem,
  buildWhatsAppLink,
} from './data/storeData';
import { ProductVisual } from './components/ProductVisual';
import { MaterialEstimator, EstimateDraft } from './components/MaterialEstimator';
import { OwnerManagerModal } from './components/OwnerManagerModal';

const STORAGE_KEY_PRODUCTS = 'shyam_bm_silwani_products_v1';

export default function App() {
  // Language mode: 'bilingual' (default side-by-side) or 'hindi_first'
  const [languageMode, setLanguageMode] = useState<LanguageMode>('bilingual');

  // Products state with localStorage persistence for Owner Photo Swap & Stock Manager
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === INITIAL_PRODUCTS.length) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch {
      // Ignore storage errors
    }
  }, [products]);

  // Catalog filter state
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [forceIllustration, setForceIllustration] = useState<boolean>(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState<boolean>(false);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);
  const [addedProductToast, setAddedProductToast] = useState<string | null>(null);

  // Quick Material Estimator state
  const [estimateDraft, setEstimateDraft] = useState<EstimateDraft>({
    cementBrand: 'UltraTech Cement',
    cementBags: 50,
    steelBrand: 'Kamdhenu NXT',
    steelSize: '10mm & 12mm Mix',
    steelQuintals: 10,
    coverBlocksPacks: 5,
    sanitarySelection: 'Sparsh Pearl Bath Fittings & Tank',
    sanitaryQty: 0,
    wiresSelection: 'Havells House Wiring & PVC Pipes',
    wiresQty: 0,
    paintSelection: 'Birla Opus Paint & Wall Care Putty',
    paintQty: 0,
    agriSelection: 'Sardar Solar Jhatka Machine Set (1200)',
    agriQty: 0,
    customerName: '',
    villageOrArea: '',
    customerPhone: '',
    customNotes: '',
  });

  const isHindiFirst = languageMode === 'hindi_first';

  // Handler to update individual product from Owner Manager
  const handleUpdateProduct = (
    productId: string,
    updates: Partial<Pick<ProductItem, 'imageUrl' | 'stockStatus' | 'customNote'>>
  ) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, ...updates } : item))
    );
  };

  const handleResetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    } catch {
      // Ignore
    }
  };

  // Add product directly from catalog card into Estimate Calculator
  const handleAddProductToEstimate = (product: ProductItem) => {
    setEstimateDraft((prev) => {
      const next = { ...prev };
      switch (product.id) {
        case 'cement-premium':
          next.cementBags = prev.cementBags + 25;
          break;
        case 'tmt-steel-bars':
          next.steelQuintals = Number((prev.steelQuintals + 5).toFixed(1));
          break;
        case 'concrete-cover-blocks':
          next.coverBlocksPacks = prev.coverBlocksPacks + 5;
          break;
        case 'sanitary-bath-fittings':
          next.sanitaryQty = prev.sanitaryQty + 1;
          break;
        case 'wires-and-pipes':
          next.wiresQty = prev.wiresQty + 2;
          break;
        case 'paints-and-putty':
          next.paintQty = prev.paintQty + 2;
          break;
        case 'sardar-solar-jhatka':
          next.agriSelection = 'Sardar Solar Jhatka Machine Set (1200)';
          next.agriQty = prev.agriQty + 1;
          break;
        case 'tiger-power-sprayer':
          next.agriSelection = '7.5 HP Tiger Power Sprayer';
          next.agriQty = prev.agriQty + 1;
          break;
        case 'submersible-pumps-starters':
          next.agriSelection = 'Hi-Tech / Taro Submersible Pump + Sonex Starter';
          next.agriQty = prev.agriQty + 1;
          break;
      }
      return next;
    });

    setAddedProductToast(isHindiFirst ? product.titleHi : product.titleEn);
    setTimeout(() => setAddedProductToast(null), 3200);
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;

      const matchesBrand =
        !selectedBrandFilter ||
        item.brands.some((b) =>
          b.toLowerCase().includes(selectedBrandFilter.toLowerCase())
        ) ||
        PARTNER_BRANDS.find((pb) => pb.name === selectedBrandFilter)?.relatedProductIds.includes(
          item.id
        );

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.titleEn.toLowerCase().includes(q) ||
        item.titleHi.toLowerCase().includes(q) ||
        item.descriptionHi.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q) ||
        item.brands.some((b) => b.toLowerCase().includes(q)) ||
        item.specs.toLowerCase().includes(q);

      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [products, activeCategory, selectedBrandFilter, searchQuery]);

  // Compute Silwani IST store status
  const storeStatus = useMemo(() => {
    try {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDate = new Date(utcMs + 5.5 * 3600000);
      const day = istDate.getDay(); // 0 = Sun, 3 = Wed
      const hour = istDate.getHours() + istDate.getMinutes() / 60;
      const isWednesday = day === 3;
      const closeHour = isWednesday ? 17 : 21;
      const isOpen = hour >= 9 && hour < closeHour;
      return {
        isOpen,
        label: isOpen
          ? isWednesday
            ? 'Open Now in Silwani · Closes 5:00 PM Today (Wednesday)'
            : 'Open Now in Silwani · Open Until 9:00 PM Today'
          : 'Currently Closed · Opens 9:00 AM Tomorrow · WhatsApp Inquiries Active 24x7',
      };
    } catch {
      return {
        isOpen: true,
        label: 'Open Daily 9:00 AM – 9:00 PM (Wednesday 9:00 AM – 5:00 PM)',
      };
    }
  }, []);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Slim Top Announcement Bar */}
      <div className="bg-[#0F172A] text-slate-200 border-b border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-300">
            <span className="font-medium text-white">Silwani, MP (464886)</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Trusted Since 2000</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400 font-mono-num font-semibold">
              4.9/5 ★ Google Rated
            </span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
            <a
              href={`tel:+${BUSINESS_INFO.primaryPhoneRaw}`}
              className="hidden sm:inline font-mono-num text-white hover:text-amber-400 transition-colors"
            >
              Call: 9893962935
            </a>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() =>
                setLanguageMode((prev) =>
                  prev === 'bilingual' ? 'hindi_first' : 'bilingual'
                )
              }
              className="text-xs text-slate-300 hover:text-amber-400 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {languageMode === 'bilingual'
                  ? 'Mode: EN + हिंदी'
                  : 'मोड: हिंदी-प्रथम (Switch to EN)'}
              </span>
            </button>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => setIsOwnerModalOpen(true)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Owner Photo Swap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Top Navbar — Strictly Following 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#111827]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-base sm:text-lg font-extrabold tracking-tight text-white font-display whitespace-nowrap shrink-0"
          >
            SHYAM BUILDING MATERIAL
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a
              href="#products"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Products
            </a>
            <a
              href="#brands"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Brands
            </a>
            <a
              href="#calculator"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Calculator
            </a>
            <a
              href="#reviews"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <a
              href={BUSINESS_INFO.defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Order</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* B. High-Impact Hero Section */}
        <section className="relative bg-[#0F172A] text-white overflow-hidden border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left 7 Columns: Proposition & CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                {/* Unboxed Regional & Legacy Kicker */}
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 tracking-wide">
                  <span>Trusted by Builders & Farmers Since 2000 (25+ वर्षों का भरोसा)</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-200">
                    {BUSINESS_INFO.proprietorHi} ({BUSINESS_INFO.proprietorEn}) • सिलवानी
                  </span>
                </div>

                {/* Main Display Headline */}
                <h1
                  className="font-display font-extrabold tracking-tight text-white balance-text leading-[1.12]"
                  style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.5rem)' }}
                >
                  {isHindiFirst
                    ? 'श्याम बिल्डिंग मटेरियल, सिलवानी — मजबूत निर्माण के लिए सारा सामान एक ही छत के नीचे।'
                    : 'Building Stronger Foundations in Silwani — Everything You Need to Build, Under One Roof.'}
                </h1>

                {/* Hindi / Bilingual Sub-headline */}
                <div className="space-y-2 max-w-2xl">
                  <p className="text-base sm:text-lg font-medium text-amber-300/95 leading-relaxed">
                    सीमेंट, सरिया, हार्डवेयर, सेनेटरी वेयर और कृषि उपकरणों का सिलवानी में सबसे विश्वसनीय प्रतिष्ठान।
                  </p>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Authorized wholesale & retail supplier of UltraTech, Wonder & JK Super Cement, Kamdhenu NXT & Tiger Steel TMT Re-bars, Sparsh Pearl Sanitaryware, Havells Wires, and Sardar Solar & Tiger Agricultural Machinery at Main Road, Silwani.
                  </p>
                </div>

                {/* Dual CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={BUSINESS_INFO.defaultWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm sm:text-base transition-colors flex items-center gap-2.5 shadow-lg whitespace-nowrap shrink-0"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Get Best Rate on WhatsApp (आज का रेट जानें)</span>
                  </a>

                  <a
                    href="#products"
                    className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0"
                  >
                    Explore Products (सामान देखें)
                  </a>
                </div>

                {/* Direct Contact Line */}
                <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-300">
                  <a
                    href={`tel:+${BUSINESS_INFO.primaryPhoneRaw}`}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-mono-num"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>+91 9893962935</span>
                  </a>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <a
                    href={`tel:+${BUSINESS_INFO.secondaryPhoneRaw}`}
                    className="hover:text-amber-400 transition-colors font-mono-num"
                  >
                    +91 8458902255
                  </a>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">Main Road, Silwani (Dist. Raisen)</span>
                </div>
              </div>

              {/* Right 5 Columns: Industrial Showcase Visual */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex-1 min-h-[290px] lg:h-full">
                  {!heroImgFailed && !forceIllustration ? (
                    <img
                      src={HERO_IMAGE_URL}
                      alt="Shyam Building Material Silwani — Cement, TMT Steel, Hardware & Agri Equipment"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProductVisual
                      productId="tmt-steel-bars"
                      imageUrl=""
                      alt="Shyam Building Material Silwani"
                      forceIllustration={true}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-col justify-end">
                    <div className="text-xs font-semibold text-amber-400">
                      श्याम बिल्डिंग मटेरियल, सिलवानी · Pro. Shyam Sahu
                    </div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      “अच्छी क्वालिटी का माल और बढ़िया सर्विस”
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-2">
                      <span className="text-amber-400 font-mono-num font-bold">
                        4.9 ★ Google Rating
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>17+ Verified Reviews</span>
                      <span aria-hidden="true">·</span>
                      <span>Wholesale & Retail</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Trust Stats Bar Below Hero Split */}
            <div className="mt-10 pt-8 border-t border-slate-800/90 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono-num">
                  25+ Years
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Experience (Since 2000)
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  सिलवानी में 25+ वर्षों का अटूट विश्वास
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono-num">
                  4.9 ★
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Google Maps Rating
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  17+ Verified Customer Reviews
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono-num">
                  100%
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Genuine Brands
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  UltraTech, Kamdhenu NXT, Havells, Taro
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">
                  Fast
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Site Delivery (त्वरित डिलीवरी)
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Direct dispatch across Silwani & nearby villages
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* C. Authorized & Partner Brands Grid */}
        <section id="brands" className="py-14 lg:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold tracking-wider text-amber-600 uppercase mb-1.5">
                  01. Authorized & Partner Brands · प्रमुख ब्रांड्स
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {isHindiFirst
                    ? 'देश के नंबर 1 सीमेंट, सरिया, सेनेटरी और कृषि ब्रांड्स'
                    : 'Top-Tier Construction, Sanitary & Agricultural Brands Under One Roof'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                Click any brand card below to filter matching products in the catalog.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {PARTNER_BRANDS.map((brand) => {
                const isSelected = selectedBrandFilter === brand.name;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrandFilter((prev) =>
                        prev === brand.name ? null : brand.name
                      );
                      const el = document.getElementById('products');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-[#F8FAFC] hover:bg-white text-slate-900 border-slate-200 hover:border-amber-500'
                    }`}
                  >
                    <div>
                      <div
                        className={`text-[11px] font-semibold ${
                          isSelected ? 'text-amber-400' : 'text-amber-700'
                        }`}
                      >
                        {brand.group} · {brand.groupHi}
                      </div>
                      <div className="text-base font-bold mt-1">{brand.name}</div>
                      <div
                        className={`text-xs font-medium mt-0.5 ${
                          isSelected ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {brand.nameHi}
                      </div>
                    </div>
                    <div
                      className={`text-[11px] mt-3 pt-2.5 border-t ${
                        isSelected
                          ? 'border-slate-800 text-slate-300'
                          : 'border-slate-200/80 text-slate-500'
                      }`}
                    >
                      {brand.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* D. Interactive Product Catalog (With Category Filter Tabs) */}
        <section id="products" className="py-16 lg:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-xs font-bold tracking-wider text-amber-600 uppercase mb-1.5">
                  02. Complete Product Catalog · उपलब्ध सामग्री एवं उपकरण
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 balance-text">
                  {isHindiFirst
                    ? 'सीमेंट, सरिया, हार्डवेयर, सेनेटरी और कृषि मशीनरी — आज का रेट पाएं'
                    : 'Explore Construction Materials, Sanitaryware & Agricultural Machinery'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                  Check today’s live wholesale & retail prices directly on WhatsApp or add items to your construction estimate list.
                </p>
              </div>

              {/* Search & Owner Customize Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cement, 12mm steel, solar..."
                    className="w-64 sm:w-72 pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsOwnerModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-900 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                  <span>Swap Photos / Stock</span>
                </button>
              </div>
            </div>

            {/* Category Filter Tabs (4 Segmented Functional Buttons) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-xl">
                {(
                  [
                    { id: 'all', label: 'All (सभी सामान)', count: products.length },
                    {
                      id: 'construction',
                      label: 'Construction & Steel (सीमेंट एवं सरिया)',
                      count: products.filter((p) => p.category === 'construction').length,
                    },
                    {
                      id: 'hardware',
                      label: 'Hardware, Sanitary & Electrical',
                      count: products.filter((p) => p.category === 'hardware').length,
                    },
                    {
                      id: 'agriculture',
                      label: 'Agriculture & Machinery (कृषि उपकरण)',
                      count: products.filter((p) => p.category === 'agriculture').length,
                    },
                  ] as { id: CategoryId; label: string; count: number }[]
                ).map((tab) => {
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  );
                })}
              </div>

              {selectedBrandFilter && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg">
                  <span>Filtered by Brand: {selectedBrandFilter}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedBrandFilter(null)}
                    className="text-slate-900 hover:text-red-600 font-bold"
                  >
                    Clear ×
                  </button>
                </div>
              )}
            </div>

            {/* Toast Notification When Item Added to Estimate */}
            {addedProductToast && (
              <div className="mb-6 p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Added <strong>{addedProductToast}</strong> to your Quick Construction Estimate List!
                  </span>
                </div>
                <a
                  href="#calculator"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 underline whitespace-nowrap shrink-0"
                >
                  View Estimate Calculator →
                </a>
              </div>
            )}

            {/* Product Grid (3 Columns Desktop, 2 Tablet, 1 Mobile) */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                <p className="text-base font-bold text-slate-900">
                  No matching products found for your current filter.
                </p>
                <p className="text-xs text-slate-500">
                  Try clearing your search or switching back to "All" categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSelectedBrandFilter(null);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
                >
                  Show All 9 Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:border-slate-300"
                  >
                    <div>
                      {/* Product Image Slot (4:3 Aspect Ratio) */}
                      <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-900">
                        <ProductVisual
                          productId={product.id}
                          imageUrl={product.imageUrl}
                          alt={product.titleEn}
                          forceIllustration={forceIllustration}
                        />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95 font-medium">
                          <span>{product.categoryLabelHi}</span>
                          <span className="font-mono-num text-amber-300">
                            {product.stockStatus === 'in_stock'
                              ? 'In Stock · ताज़ा स्टॉक'
                              : 'Order Basis · ऑर्डर पर'}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6 space-y-3">
                        {/* Clean Unboxed Metadata Line */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <span>{product.categoryLabelEn}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 font-semibold">
                            {product.brands.join(', ')}
                          </span>
                        </div>

                        {/* Bilingual Title */}
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 leading-snug">
                            {isHindiFirst ? product.titleHi : product.titleEn}
                          </h3>
                          <p className="text-xs font-semibold text-slate-600 mt-1">
                            {isHindiFirst ? product.titleEn : product.titleHi}
                          </p>
                        </div>

                        {/* Hindi & English Descriptions */}
                        <p className="text-sm font-medium text-slate-800 leading-relaxed">
                          {product.descriptionHi}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {product.descriptionEn}
                        </p>

                        {/* Technical Specs & Custom Note */}
                        <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                          <div className="font-medium text-slate-700">{product.specs}</div>
                          {product.customNote && (
                            <div className="text-amber-700 font-semibold">
                              {product.customNote}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 flex flex-col gap-2.5">
                      <a
                        href={buildWhatsAppLink(product.whatsappText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Check Today's Rate on WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleAddProductToEstimate(product)}
                        className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Estimate List (कैलकुलेटर में जोड़ें)</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* E. Interactive Quick Material Estimator / Bulk Inquiry Tool */}
        <MaterialEstimator
          draft={estimateDraft}
          setDraft={setEstimateDraft}
          languageMode={languageMode}
        />

        {/* F. Customer Reviews & Social Proof Section (4.9★ on Google) */}
        <section id="reviews" className="py-16 lg:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-xs font-bold tracking-wider text-amber-600 uppercase mb-1.5">
                  04. Verified Customer Proof · ग्राहकों का भरोसा
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                  {isHindiFirst
                    ? 'गूगल मैप्स पर 4.9 ★ रेटिंग — सिलवानी के ग्राहकों और ठेकेदारों की राय'
                    : 'Rated 4.9 Out of 5 Stars on Google Maps in Silwani'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                  “अच्छी क्वालिटी का माल और बढ़िया सर्विस” — Trusted by homeowners, civil contractors, and farmers across Raisen District since 2000.
                </p>
              </div>

              {/* Google Rating Summary Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-5 self-start">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono-num">
                    4.9 ★
                  </div>
                  <div className="text-xs text-amber-600 font-bold mt-0.5">
                    Out of 5.0 Stars
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    17+ Verified Google Reviews
                  </div>
                  <a
                    href={BUSINESS_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>View on Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 3 Verified Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {GOOGLE_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span>{rev.dateLabel}</span>
                    </div>

                    <blockquote className="text-base font-bold text-slate-900 leading-relaxed">
                      “{rev.reviewText}”
                    </blockquote>

                    {rev.reviewTranslation && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rev.reviewTranslation}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200/80">
                    <div className="text-sm font-bold text-slate-900">{rev.authorName}</div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <span>{rev.authorSubtitle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700 font-medium">{rev.verifiedTag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* G. Store Timing, Location & Contact Section */}
        <section id="contact" className="py-16 lg:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-xs font-bold tracking-wider text-amber-600 uppercase mb-1.5">
                05. Store Timing, Location & Direct Contact · संपर्क एवं दुकान का समय
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                {isHindiFirst
                  ? 'मेन रोड, सिलवानी में पधारें या सीधे फोन/WhatsApp पर ऑर्डर करें'
                  : 'Visit Shyam Building Material on Main Road, Silwani'}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left 6 Columns: Contact Details, Hours & Direct Action Buttons */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  {/* Proprietor & Address */}
                  <div className="border-b border-slate-200 pb-5">
                    <div className="text-xs font-semibold text-amber-700">
                      Proprietor: {BUSINESS_INFO.proprietorEn} ({BUSINESS_INFO.proprietorHi})
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {BUSINESS_INFO.nameFullEn} ({BUSINESS_INFO.nameHi})
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-1" />
                      <span>
                        {BUSINESS_INFO.addressEn}
                        <br />
                        <span className="text-slate-500">{BUSINESS_INFO.addressHi}</span>
                      </span>
                    </p>
                  </div>

                  {/* Business Hours Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Store Opening Hours (दुकान खुलने का समय)</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700">
                        {storeStatus.isOpen ? 'Open Today' : 'Open 9:00 AM'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">{storeStatus.label}</p>

                    <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 divide-y divide-slate-200">
                      {BUSINESS_INFO.hours.map((schedule) => (
                        <div
                          key={schedule.daysEn}
                          className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{schedule.daysEn}</span>
                            <span className="text-slate-500 ml-2">({schedule.daysHi})</span>
                          </div>
                          <span className="font-mono-num font-bold text-slate-900">
                            {schedule.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5 Direct Clickable Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={`tel:+${BUSINESS_INFO.primaryPhoneRaw}`}
                      className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Phone className="w-4 h-4 text-amber-400" />
                      <span className="font-mono-num">Call Primary: 098939 62935</span>
                    </a>

                    <a
                      href={`tel:+${BUSINESS_INFO.secondaryPhoneRaw}`}
                      className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Phone className="w-4 h-4 text-slate-700" />
                      <span className="font-mono-num">Call Secondary: 084589 02255</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href={BUSINESS_INFO.defaultWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Direct</span>
                    </a>

                    <a
                      href={BUSINESS_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Open Google Maps</span>
                    </a>

                    <a
                      href={BUSINESS_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span>{BUSINESS_INFO.instagramHandle}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right 6 Columns: Styled Interactive Visual Map Card for Silwani, MP (464886) */}
              <div className="lg:col-span-6 bg-[#0F172A] text-white rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                {/* Visual Vector Map Canvas of Main Road Silwani */}
                <div className="relative flex-1 min-h-[280px] bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
                  {/* Architectural Map Grid SVG */}
                  <svg
                    viewBox="0 0 600 320"
                    className="absolute inset-0 w-full h-full object-cover opacity-85"
                    aria-hidden="true"
                  >
                    <rect width="600" height="320" fill="#0F172A" />
                    {/* Subtle Sector Grid */}
                    {[60, 120, 180, 240, 300, 360, 420, 480, 540].map((x) => (
                      <line
                        key={x}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={320}
                        stroke="#1E293B"
                        strokeWidth="1"
                      />
                    ))}
                    {[50, 100, 150, 200, 250].map((y) => (
                      <line
                        key={y}
                        x1={0}
                        y1={y}
                        x2={600}
                        y2={y}
                        stroke="#1E293B"
                        strokeWidth="1"
                      />
                    ))}
                    {/* Secondary Roads */}
                    <path
                      d="M 120 0 L 180 320 M 440 0 L 390 320"
                      stroke="#334155"
                      strokeWidth="10"
                      fill="none"
                    />
                    {/* Main Road Silwani (SH-15 / Main Highway Corridor) */}
                    <path
                      d="M 0 190 Q 280 155 600 135"
                      stroke="#475569"
                      strokeWidth="26"
                      fill="none"
                    />
                    <path
                      d="M 0 190 Q 280 155 600 135"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeDasharray="10 8"
                      fill="none"
                    />
                    <text
                      x="110"
                      y="165"
                      fill="#94A3B8"
                      fontSize="11"
                      fontWeight="700"
                      transform="rotate(-6, 110, 165)"
                    >
                      MAIN ROAD, SILWANI (मेन रोड सिलवानी)
                    </text>

                    {/* Pin Marker at Center */}
                    <circle cx="310" cy="158" r="28" fill="#F59E0B" fillOpacity="0.2" />
                    <circle
                      cx="310"
                      cy="158"
                      r="12"
                      fill="#F59E0B"
                      stroke="#0F172A"
                      strokeWidth="3"
                    />
                    <rect
                      x="200"
                      y="82"
                      width="220"
                      height="52"
                      rx="10"
                      fill="#111827"
                      stroke="#F59E0B"
                      strokeWidth="2"
                    />
                    <text
                      x="310"
                      y="104"
                      textAnchor="middle"
                      fill="#F59E0B"
                      fontSize="12"
                      fontWeight="800"
                    >
                      SHYAM BUILDING MATERIAL
                    </text>
                    <text
                      x="310"
                      y="122"
                      textAnchor="middle"
                      fill="#F8FAFC"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      Main Road, Silwani · 464886
                    </text>
                  </svg>

                  {/* Top Map Header Overlay */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-slate-200 font-medium">
                      Silwani, District Raisen, MP (PIN: 464886)
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono-num text-amber-400 font-bold">
                      4.9 ★ Google Location
                    </span>
                  </div>

                  {/* Bottom Map Overlay */}
                  <div className="relative z-10 mt-auto pt-36">
                    <div className="p-4 rounded-xl bg-slate-900/95 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-white">
                          श्याम बिल्डिंग मटेरियल, मेन रोड सिलवानी
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Easy tractor, pickup & truck loading right on Main Road, Silwani
                        </div>
                      </div>
                      <a
                        href={BUSINESS_INFO.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get Directions</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Delivery Coverage Footer inside Map Card */}
                <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                  <span>
                    Site Delivery: Silwani Town, Bamhori, Pratapgarh, Chunhetia & all nearby Raisen villages
                  </span>
                  <a
                    href="#calculator"
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Calculate Bulk Load</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Industrial Footer */}
      <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 py-12 pb-24 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
            <div className="md:col-span-5 space-y-2">
              <div className="text-lg font-extrabold text-white font-display tracking-tight">
                SHYAM BUILDING MATERIAL, SILWANI
              </div>
              <div className="text-sm font-semibold text-amber-400">
                श्याम बिल्डिंग मटेरियल, सिलवानी • प्रो. श्याम साहू (Pro. Shyam Sahu)
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed pt-1">
                Trusted by builders, contractors, and farmers since 2000. Everything you need to build—cement, TMT steel bars, sanitaryware, electricals, and agricultural equipment under one roof.
              </p>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs">
              <div className="text-white font-bold uppercase tracking-wider">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a href="#top" className="hover:text-white transition-colors">
                  Home (होम)
                </a>
                <a href="#products" className="hover:text-white transition-colors">
                  Products (सामान)
                </a>
                <a href="#brands" className="hover:text-white transition-colors">
                  Partner Brands
                </a>
                <a href="#calculator" className="hover:text-white transition-colors">
                  Rate Calculator
                </a>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Google Reviews (4.9★)
                </a>
                <a href="#contact" className="hover:text-white transition-colors">
                  Store Hours & Map
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <div className="text-white font-bold uppercase tracking-wider">
                Direct Contact
              </div>
              <p className="font-mono-num text-slate-300">
                Primary: +91 9893962935
              </p>
              <p className="font-mono-num text-slate-300">
                Secondary: +91 8458902255
              </p>
              <p className="text-slate-400">
                Main Road, Silwani, Dist. Raisen, MP 464886
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © {new Date().getFullYear()} Shyam Building Material, Silwani (प्रो. श्याम साहू). All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                Instagram: {BUSINESS_INFO.instagramHandle}
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                Google Maps
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* H. Floating Quick-Action Buttons (Compact & Mobile-First) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5">
        <a
          href={`tel:+${BUSINESS_INFO.primaryPhoneRaw}`}
          aria-label="Call Pro. Shyam Sahu Now"
          className="px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-transform hover:scale-105 whitespace-nowrap shrink-0"
        >
          <Phone className="w-4 h-4 text-amber-400" />
          <span>Call Now</span>
        </a>

        <a
          href={BUSINESS_INFO.defaultWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Pro. Shyam Sahu"
          className="px-4 py-3 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-transform hover:scale-105 whitespace-nowrap shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Owner Photo Swap & Stock Manager Modal */}
      <OwnerManagerModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onResetAll={handleResetProducts}
        forceIllustration={forceIllustration}
        setForceIllustration={setForceIllustration}
      />
    </div>
  );
}
