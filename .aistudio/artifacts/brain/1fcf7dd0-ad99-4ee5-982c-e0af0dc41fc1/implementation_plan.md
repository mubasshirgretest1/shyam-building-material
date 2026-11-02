# Shyam Building Material, Silwani — Digital Storefront & Rate Inquiry Platform

A modern, high-converting, mobile-first business storefront and bulk rate inquiry platform for **Shyam Building Material (श्याम बिल्डिंग मटेरियल सिलवानी)**, serving contractors, homeowners, and farmers across Silwani, District Raisen, Madhya Pradesh since 2000.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and experience choices have been confirmed from your clarifications and incorporated into this architectural blueprint:

- **Confirmed Decision 1 — Dual-Mode Material Estimator & Rate Inquiry**: Customers can switch seamlessly between a **Manual Item & Quantity Picker** (choosing specific cement bags, TMT steel bars by size/weight, sanitary ware, and agri machinery) and a **Sq. Ft. House Area Calculator** that automatically estimates required Cement Bags, TMT Steel Quintals, and Cover Blocks based on plot size and construction stage, formatting the entire list into a ready-to-send WhatsApp inquiry to `+91 9893962935`.
- **Confirmed Decision 2 — Bilingual Side-by-Side with Hindi-First Toggle**: All key headlines, product titles, and trust markers are presented in a clear English + Hindi (Devanagari) pairing by default, accompanied by a quick **English / हिंदी-प्रथम (Hindi-First)** toggle in the workspace toolbar so local farmers and contractors can prioritize their preferred language script.
- **Confirmed Decision 3 — Owner Photo Swap & Stock Status Manager**: Includes a dedicated **"Store Owner Mode (प्रो. श्याम साहू एडिट मोड)"** drawer where the proprietor can easily paste/upload replacement image URLs for any product, toggle stock status (`In Stock / ताज़ा स्टॉक` vs `Bulk Order Only / ऑर्डर पर उपलब्ध`), or update promotional rate notes with changes persisted locally.

---

## 1. Overview & Core Concept

- **What It Does**: Showcases Shyam Building Material's complete inventory across Construction & Steel, Hardware/Sanitary/Electrical, and Agriculture & Machinery, while turning product browsing and construction calculations directly into structured WhatsApp rate inquiries and instant phone calls.
- **Target Audience / Persona**:
  - **Civil Contractors & Builders** in Silwani and Raisen looking for genuine UltraTech/Wonder/JK Super Cement, Kamdhenu NXT/Tiger Steel TMT bars, and fast site delivery.
  - **Homeowners** building or renovating homes who need Sparsh Pearl sanitary ware, Birla Opus paints, Havells electrical cables, and material estimates.
  - **Local Farmers (किसान भाई)** shopping for Sardar Solar Jhatka Machines, 7.5 HP Tiger Power Sprayers, and Hi-Tech/Taro Submersible Pumps.
- **Key Value**: Bridges offline trust ("Trusted Since 2000", 4.9★ Google Rating) with instant WhatsApp rate discovery, eliminating friction between checking daily commodity prices (Cement/Steel) and placing an order with Pro. Shyam Sahu.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Instant Brand & Trust Verification**: Visitors land on a high-impact industrial hero showcasing 25+ years of legacy in Silwani, verified 4.9★ Google rating, proprietor attribution (Pro. Shyam Sahu), and immediate WhatsApp/Catalog actions.
  2. **Category-Filtered Product Discovery & 1-Tap Rate Check**: Users filter the 9 signature products across *All*, *Construction & Steel*, *Hardware, Sanitary & Electrical*, and *Agriculture & Machinery (कृषि उपकरण)*. Clicking **"Check Today's Rate on WhatsApp"** opens WhatsApp pre-populated with that exact item's English + Hindi name and brand specs. Users can also add items directly to their inquiry list from any card.
  3. **Interactive Construction Calculator & Bulk Inquiry**: Users either enter their house construction area (e.g., `1200 Sq. Ft.`) to auto-calculate estimated cement bags and steel tonnage, or manually adjust quantities across categories, enter their Name and Village/Ward in Silwani, and send a formatted bulk quotation request on WhatsApp.
  4. **Owner Catalog Customization**: Clicking the subtle **"Owner Edit Mode"** button in the catalog toolbar lets Pro. Shyam Sahu customize product images, reset to default visuals, or toggle live availability tags.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Caterpillar-inspired Industrial Construction & Precision Hardware Store aesthetic—authoritative, rugged, high-contrast, and ultra-legible outdoors on mobile screens.
  - *Color Palette & Mood*:遵循 60-30-10 color discipline:
    - **60% Neutral Canvas**: Crisp Architectural Off-White (`#F8FAFC`) for main catalog and estimator workspaces, alternating with Deep Charcoal (`#111827`) and Industrial Obsidian (`#0F172A`) for hero, brand showcase, and contact sections.
    - **30% Structural Surfaces**: Pure White (`#FFFFFF`) and Slate surfaces (`#1E293B`) with crisp `1px solid` hairline borders (`#E2E8F0` on light, `#334155` on dark).
    - **10% Accent Budget**: Construction Safety Amber (`#F59E0B`) and High-Visibility Orange (`#EA580C`) for primary CTAs and calculator highlights, paired with WhatsApp Action Green (`#16A34A`) strictly for direct WhatsApp triggers.
  - *Typography & Hierarchy*:
    - **Display / Headings**: `Outfit` / `Archivo` (Bold/ExtraBold, tight tracking, balanced headline wrapping) for strong industrial authority alongside clean Devanagari rendering (`Noto Sans Devanagari`).
    - **Body Copy**: `Plus Jakarta Sans` (Regular/Medium, 15px–16px, generous line height) for effortless bilingual reading.
    - **Metrics, Quantities & Phone Numbers**: `JetBrains Mono` with `tabular-nums` for phone numbers, ratings (`4.9 ★`), years (`2000`), and material calculator outputs.
  - *Component Styling & Layout*:
    - Full 1440px desktop layout container (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`) with mobile-first touch targets ($\ge 44\text{px}$).
    - Clean 3-zone top navigation bar with slim announcement strip above and single-level card elevation across the product grid.
    - Unboxed metadata with subtle `·` separators and clean segmented filter controls.

- **Interactive Feedback & Motion**:
  - Fast, responsive $\le 180\text{ms}$ transitions on category switching, estimator tab changes, and hover states (`translateY(-2px)` on product cards).
  - Live preview of the generated WhatsApp message inside the Quick Material Estimator so customers see the exact text before launching WhatsApp.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Custom-Generated Industrial Visuals + Instant Image Swap Capability**
  - *Chosen Approach*: Generate bespoke, studio-grade high-resolution product visuals for cement, TMT steel bars, sanitary ware, electrical cables, solar fence machines, power sprayers, and submersible pumps, paired with a Zero-Broken-Image fallback and an interactive **Owner Image URL Swap** modal stored in `localStorage`.
  - *Why*: Ensures every product card loads with authentic, zero-fail construction and agricultural imagery right out of the box while giving the business owner full freedom to paste custom product or shop photos anytime.
  - *Alternatives Considered*: Hardcoding static links alone without an owner editor (passed over because local shop owners frequently update seasonal machinery or brand packaging).

- **Decision 2 — Combined Sq. Ft. Thumb-Rule Calculator + Itemized Bulk Builder**
  - *Chosen Approach*: Provide both an engineering thumb-rule estimator (calculating cement bags, steel TMT tonnage, cover blocks, and wiring needs per sq. ft. based on construction stage: *Foundation / Plinth*, *Slab / RCC*, or *Full Grey Structure*) and a manual item stepper list that syncs into a single WhatsApp dispatch payload.
  - *Why*: Homeowners often know their plot square footage (`1000 sq ft`) rather than exact bag counts, whereas experienced contractors know exact bag and quintal numbers. Supporting both maximizes lead conversion.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                   SHYAM BUILDING MATERIAL APPLICATION                      │
│          (Bilingual State • Catalog Store • Inquiry Builder State)         │
└───────────────┬────────────────────────────────────────┬───────────────────┘
                │                                        │
                ▼                                        ▼
┌───────────────────────────────────────┐  ┌─────────────────────────────────┐
│     TOP ANNOUNCEMENT & NAVIGATION     │  │   PERSISTENT OWNER CUSTOMIZER   │
│ • Slim Silwani Info Strip (Dismiss)   │  │ • LocalStorage Image URL Overrides│
│ • 3-Zone Header (Brand, Nav, WA CTA)  │  │ • Stock Availability Toggle     │
└───────────────┬───────────────────────┘  └─────────────┬───────────────────┘
                │                                        │
                ▼                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        CORE STOREFRONT SECTIONS                            │
├─────────────────────────┬──────────────────────────┬───────────────────────┤
│   HERO & TRUST STRIP    │   AUTHORIZED BRANDS      │   PRODUCT CATALOG     │
│ • 25+ Yrs Legacy Pitch  │ • Cement (UltraTech,     │ • 4 Category Filter   │
│ • Bilingual Display     │   Wonder, JK Super)      │   Segmented Tabs      │
│   Mode Switch           │ • Steel (Kamdhenu,Tiger) │ • 9 Exact Bilingual   │
│ • Dual CTAs (WA / Grid) │ • Sanitary & Electrical  │   Product Cards       │
│ • 4-Metric Trust Bar    │ • Agri & Solar Partners  │ • Item-Specific WA    │
│   (25+ Yrs, 4.9★, etc.) │   Interactive Filter     │   Rate Inquiry Links  │
└─────────────────────────┴──────────────────────────┴───────────┬───────────┘
                                                                 │
                                                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│             QUICK MATERIAL ESTIMATOR & BULK INQUIRY ENGINE                 │
├───────────────────────────────────────┬────────────────────────────────────┤
│   MODE A: SQ. FT. HOUSE CALCULATOR    │   MODE B: MANUAL BULK PICKER       │
│ • Plot Area (Sq. Ft.) + Stage Select  │ • Cement Bags, Steel Quintals,     │
│ • Auto-Computes Cement, TMT & Blocks  │   Cover Blocks, Sanitary, Agri     │
│ • 1-Click "Apply to Inquiry List"     │ • Customer Name & Silwani Village  │
├───────────────────────────────────────┴────────────────────────────────────┤
│   LIVE WHATSAPP PAYLOAD FORMATTER → Opens wa.me/919893962935 with Summary  │
└───────────────┬────────────────────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│          SOCIAL PROOF (4.9★ GOOGLE) • STORE HOURS & SILWANI MAP            │
│ • Verified Reviews (Shivam Namdev, Rajesh Sahu, Local Contractor)          │
│ • Live Store Status Indicator (Thu–Tue 9AM–9PM, Wed 9AM–5PM IST)           │
│ • Direct Call (9893962935 / 8458902255), Maps & Instagram (@shyam.materials)│
│ • Compact Mobile Floating Quick-Action Bar (Call & WhatsApp)               │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - `ProductItem`: `{ id, category, titleEn, titleHi, brand, subtitleHi, specsEn, highlightTag, defaultImage, customImage?, stockStatus: 'in_stock' | 'bulk_order', whatsappPrompt }`
  - `BrandPartner`: `{ id, name, nameHi, category, tagline, featuredProductIds }`
  - `EstimateState`: `{ mode: 'manual' | 'sqft', sqftArea: number, constructionStage: 'foundation' | 'slab' | 'full', cementBrand: string, cementBags: number, steelBrand: string, steelSize: string, steelQuintals: number, coverBlocksPacks: number, sanitaryPackage: string, agriMachine: string, customNotes: string, customerName: string, villageOrArea: string, customerPhone: string }`
  - `LanguagePreference`: `'bilingual'` (default English + Hindi side-by-side) or `'hindi_first'` (promotes Hindi headings and labels first).

- **Interactive Component & State Mapping**:
  - **Category & Brand Filtering**: Clicking any of the 4 category tabs or clicking a partner brand card filters/highlights matching products in the catalog with instant count updates and a clear-filter action.
  - **1-Tap Product Rate Check & Add-to-Estimate**: Every product card features both a direct `"Check Today's Rate on WhatsApp"` button (encoding a product-specific Hindi/English inquiry to `919893962935`) and an `"+ Add to Estimate"` button that increments the item in the Quick Material Estimator and scrolls smoothly to the calculator if desired.
  - **Live Store Open/Closed Status**: Computes against Silwani local time (IST) and displays the exact weekly schedule (Thursday–Tuesday 9:00 AM – 9:00 PM, Wednesday 9:00 AM – 5:00 PM) alongside 1-tap `tel:` and Google Maps actions.
  - **Owner Image & Stock Customizer**: A slide-over modal allowing the owner to paste a new image URL for any of the 9 products, preview it live, toggle stock status, or reset defaults with `localStorage` persistence.
