export type CategoryId = 'all' | 'construction' | 'hardware' | 'agriculture';

export type LanguageMode = 'bilingual' | 'hindi_first';

export interface ProductItem {
  id: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabelEn: string;
  categoryLabelHi: string;
  titleEn: string;
  titleHi: string;
  brands: string[];
  descriptionHi: string;
  descriptionEn: string;
  specs: string;
  unitLabel: string;
  imageUrl: string;
  alternateImages: { label: string; url: string }[];
  stockStatus: 'in_stock' | 'bulk_order';
  customNote?: string;
  whatsappText: string;
}

export interface BrandPartner {
  id: string;
  name: string;
  nameHi: string;
  group: 'Cement' | 'Steel / TMT' | 'Paints & Sanitary' | 'Electrical & Agri';
  groupHi: string;
  tagline: string;
  relatedProductIds: string[];
}

export interface CustomerReview {
  id: string;
  authorName: string;
  authorSubtitle: string;
  rating: number;
  reviewText: string;
  reviewTranslation?: string;
  dateLabel: string;
  verifiedTag: string;
}

export const BUSINESS_INFO = {
  nameEn: 'Shyam Building Material',
  nameFullEn: 'Shyam Building Material, Silwani',
  nameHi: 'श्याम बिल्डिंग मटेरियल, सिलवानी',
  proprietorEn: 'Pro. Shyam Sahu',
  proprietorHi: 'प्रो. श्याम साहू',
  taglineEn: 'Trusted by Builders Since 2000',
  taglineSecondaryEn: 'Everything You Need to Build, All in One Place!',
  taglineHi: 'सीमेंट, सरिया, हार्डवेयर, सेनेटरी वेयर और कृषि उपकरणों का सिलवानी में सबसे विश्वसनीय प्रतिष्ठान।',
  establishedYear: 2000,
  yearsExperience: '25+ Years',
  googleRating: '4.9',
  googleReviewsCount: '17+ Verified Google Reviews',
  googleReviewQuoteHi: 'अच्छी क्वालिटी का माल और बढ़िया सर्विस',
  primaryPhoneRaw: '919893962935',
  primaryPhoneDisplay: '+91 9893962935',
  primaryPhoneLocal: '098939 62935',
  secondaryPhoneRaw: '918458902255',
  secondaryPhoneDisplay: '+91 8458902255',
  secondaryPhoneLocal: '084589 02255',
  addressEn: 'Main Road, Silwani, District Raisen, Madhya Pradesh 464886',
  addressHi: 'मेन रोड, सिलवानी, जिला रायसेन, मध्य प्रदेश 464886',
  instagramHandle: '@shyam.materials',
  instagramUrl: 'https://instagram.com/shyam.materials',
  googleMapsUrl: 'https://maps.app.goo.gl/w93rpxSpdBcKWYvW7',
  defaultWhatsAppUrl:
    'https://wa.me/919893962935?text=Namaste%20Shyam%20Building%20Material,%20mujhe%20building%20material%20ke%20rate%20pata%20karne%20hain.',
  hours: [
    {
      daysEn: 'Thursday – Tuesday',
      daysHi: 'गुरुवार से मंगलवार',
      time: '9:00 AM – 9:00 PM',
      isHalfDay: false,
    },
    {
      daysEn: 'Wednesday',
      daysHi: 'बुधवार (साप्ताहिक समय)',
      time: '9:00 AM – 5:00 PM',
      isHalfDay: true,
    },
  ],
};

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${BUSINESS_INFO.primaryPhoneRaw}?text=${encodeURIComponent(message)}`;
}

export const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85';

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'cement-premium',
    category: 'construction',
    categoryLabelEn: 'Construction & Steel',
    categoryLabelHi: 'निर्माण एवं सीमेंट',
    titleEn: 'Premium Cement (UltraTech, Wonder, JK Super)',
    titleHi: 'प्रीमियम सीमेंट (अल्ट्राटेक, वंडर, जेके सुपर)',
    brands: ['UltraTech Cement', 'Wonder Cement', 'JK Super Cement'],
    descriptionHi: 'ताज़ा स्टॉक, थोक और फुटकर रेट पर उपलब्ध।',
    descriptionEn: 'Fresh factory-direct stock available at wholesale and retail rates for slab, column, and plastering work.',
    specs: '50 Kg Bags · OPC / PPC Grade · Moisture-Proof Packaging',
    unitLabel: 'Bags (बोरी)',
    imageUrl:
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80',
    alternateImages: [
      {
        label: 'Cement Warehouse Stack',
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80',
      },
      {
        label: 'Construction Concrete Pour',
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb18086f6?auto=format&fit=crop&w=900&q=80',
      },
    ],
    stockStatus: 'in_stock',
    customNote: 'देश का नंबर 1 सीमेंट · ताज़ा गोदाम स्टॉक',
    whatsappText:
      'नमस्ते श्याम बिल्डिंग मटेरियल सिलवानी, मुझे Premium Cement (UltraTech / Wonder / JK Super) के आज के थोक/फुटकर रेट (Today Rate) पता करने हैं।',
  },
  {
    id: 'tmt-steel-bars',
    category: 'construction',
    categoryLabelEn: 'Construction & Steel',
    categoryLabelHi: 'सरिया एवं स्टील',
    titleEn: 'TMT Steel Bars / सरिया (Kamdhenu NXT & Tiger Steel)',
    titleHi: 'टीएमटी सरिया (कामधेनु NXT एवं टाइगर स्टील)',
    brands: ['Kamdhenu NXT', 'Tiger Steel'],
    descriptionHi: 'सभी साइज (8mm से 25mm) में भूकंपरोधी मजबूत सरिया।',
    descriptionEn: 'High-ductility earthquake-resistant Fe-500D/550D TMT reinforcement bars in all structural diameters.',
    specs: 'Sizes: 8mm, 10mm, 12mm, 16mm, 20mm, 25mm · ISI Certified',
    unitLabel: 'Quintals (क्विंटल)',
    imageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    alternateImages: [
      {
        label: 'TMT Steel Rebar Bundles',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
      },
      {
        label: 'Heavy Reinforcement Rods',
        url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80',
      },
    ],
    stockStatus: 'in_stock',
    customNote: '8mm से 25mm सभी साइज उपलब्ध',
    whatsappText:
      'नमस्ते श्याम बिल्डिंग मटेरियल सिलवानी, मुझे TMT सरिया (Kamdhenu NXT / Tiger Steel - 8mm से 25mm) का आज का प्रति क्विंटल रेट पता करना है।',
  },
  {
    id: 'concrete-cover-blocks',
    category: 'construction',
    categoryLabelEn: 'Construction & Steel',
    categoryLabelHi: 'आरसीसी कवर ब्लॉक्स',
    titleEn: 'Concrete Cover Blocks (कवर ब्लॉक्स - ₹2 का कमाल)',
    titleHi: 'कंक्रीट कवर ब्लॉक्स (₹2 का कमाल - छत व कॉलम सुरक्षा)',
    brands: ['High-Strength RCC Blocks'],
    descriptionHi: 'सरिया को जंग से बचाने और छत ढलाई में सही गैप के लिए हाई-स्ट्रेंथ कवर ब्लॉक्स।',
    descriptionEn: '20mm/25mm high-strength blocks for perfect reinforcement gap in slabs, beams, and columns.',
    specs: 'Sizes: 20mm / 25mm · High Compressive Strength · Anti-Corrosion Gap',
    unitLabel: 'Packs (पैकेट)',
    imageUrl:
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=900&q=80',
    alternateImages: [
      {
        label: 'Concrete Blocks & Masonry',
        url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=900&q=80',
      },
    ],
    stockStatus: 'in_stock',
    customNote: '₹2 का कमाल · 20mm/25mm साइज',
    whatsappText:
      'नमस्ते श्याम बिल्डिंग मटेरियल सिलवानी, मुझे Concrete Cover Blocks (20mm/25mm कवर ब्लॉक्स) की उपलब्धता और रेट की जानकारी चाहिए।',
  },
  {
    id: 'sanitary-bath-fittings',
    category: 'hardware',
    categoryLabelEn: 'Hardware, Sanitary & Electrical',
    categoryLabelHi: 'सेनेटरी एवं बाथ फिटिंग्स',
    titleEn: 'Sanitary Ware & Bath Fittings (Sparsh Pearl)',
    titleHi: 'सेनेटरी वेयर एवं बाथ फिटिंग्स (स्पर्श पर्ल)',
    brands: ['Sparsh Pearl'],
    descriptionHi: 'मॉडर्न बाथरूम फिटिंग्स, नल, शावर, सीट्स और वाटर टैंक।',
    descriptionEn: 'Complete bathroom suites including designer taps, overhead showers, ceramic seats, washbasins, and multi-layer water tanks.',
    specs: 'Taps · Showers · Ceramic Seats · Washbasins · 500L–2000L Water Tanks',
    unitLabel: 'Sets (सेट)',
    imageUrl:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
    alternateImages: [
      {
        label: 'Modern Bath & Faucets',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
      },
      {
        label: 'Ceramic Washbasin Suite',
        url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80',
      },
    ],
    stockStatus: 'in_stock',
    customNote: 'Sparsh Pearl ऑथराइज्ड कलेक्शन',
    whatsappText:
      'नमस्ते श्याम बिल्डिंग मटेरियल सिलवानी, मुझे Sparsh Pearl Sanitary Ware, बाथरूम फिटिंग्स और वाटर टैंक के रेट पता करने हैं।',
  },
  {
    id: 'wires-and-pipes',
    category: 'hardware',
    categoryLabelEn: 'Hardware, Sanitary & Electrical',
    categoryLabelHi: 'इलेक्ट्रिकल केबल एवं पीवीसी पाइप',
    titleEn: '10-12 MM Aluminum & Copper Wires & Pipes',
    titleHi: '10-12 MM एल्युमीनियम व कॉपर वायर एवं PVC पाइप्स',
    brands: ['Havells', 'Heavy-Duty Cables & PVC'],
    descriptionHi: 'हेवी-ड्यूटी केबल्स, Havells वायरिंग और PVC फिटिंग्स।',
    descriptionEn: 'Flame-retardant house wiring, 10–12mm agricultural submersible service cables, and heavy-gauge PVC pipes & fittings.',
    specs: '10mm / 12mm Service Wire · Havells Copper Coils · Rigid PVC Conduits & Fittings',
    unitLabel: 'Coils / Bundles (बंडल)',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    alternateImages: [
      {
        label: 'Electrical Cables & Hardware',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
      },
      {
        label: 'Industrial Piping & Conduits',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
      },
    ],
    stockStatus: 'in_stock',
    customNote: 'Havells एवं हेवी-ड्यूटी केबल उपलब्ध',
    whatsappText:
      'नमस्ते श्याम बिल्डिंग मटेरियल सिलवानी, मुझे 10-12 MM Aluminum/Copper Wires, Havells वायरिंग और PVC पाइप्स के रेट पता करने हैं।',
  },
  {
    id: 'paints-and-putty',
    category: 'hardware',
    categoryLabelEn: 'Hardware, Sanitary & Electrical',
    categoryLabelHi: 'पेंट्स एवं वॉल पुट्टी',
    titleEn: 'Paints & Putty (Birla Opus & Wall Care)',
    titleHi: 'पेंट्स एवं वॉल केयर पुट्टी (बिरला ओपस पेंट्स)',
    brands: ['Birla Opus Paints', 'Wall Care Putty'],
    descriptionHi: 'घर को नया और प्रीमियम लुक देने के लिए सभी प्रकार के पेंट्स।',
    descriptionEn: 'Weather-proof exterior emulsions, silky interior wall paints, primers, and ultra-smooth white cement wall care putty.',
    specs: 'Interior & Exterior Emulsions · Wall Care Putty (20Kg/40Kg) · Primers & Brushes',
    unitLabel: 'Buckets / Bags (बाल्टी/बोरी)',
    imageUrl:
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80',
    alternateImages: [
      {
        label: 'Architectural Paints & Rollers',
        url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80',
      },
      {
        label: 'Color Palette & Wall Finish',
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80',
      },
    ],
    stockStatus: 'in_stock',
    customNote: 'Birla Opus प्रीमियम शेड्स उपलब्ध',
    whatsappText:
      'नमस्ते श्याम बिल्डिंग मटेरियल सिलवानी, मुझे Birla Opus Paints और Wall Care Putty के रेट की जानकारी चाहिए।',
  },
  {
    id: 'sardar-solar-jhatka',
    category: 'agriculture',
    categoryLabelEn: 'Agriculture & Machinery (कृषि उपकरण)',
    categoryLabelHi: 'कृषि सुरक्षा उपकरण',
    titleEn: 'Sardar Solar Jhatka Machine Set (सरदार 900 & 1200 सोलर झटका मशीन)',
    titleHi: 'सरदार 900 & 1200 सोलर झटका मशीन सेट (ISO Certified)',
    brands: ['Sardar Solar'],
    descriptionHi: 'हर वक़्त किसानों का हमसफ़र। अब फसल की सुरक्षा हुई और भी आसान (ISO Certified).',
    descriptionEn: 'Complete solar fence guard kit with energizer, solar panel, battery support, and automatic day/night modes for 24x7 crop protection.',
    specs: 'Models: Sardar 900 & Sardar 1200 · ISO Certified · Complete Solar Panel + Machine Kit',
    unitLabel: 'Complete Sets (सेट)',
    imageUrl:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
    alternateImages: [
      {
        label: 'Solar Farm Protection Unit',
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      },
      {
        label: 'Agricultural Field Solar Panel',
        url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=900&q=80',
      },
    ],
    stockStatus: 'in_stock',
    customNote: 'किसानों की पहली पसंद · सरदार 900 एवं 1200',
    whatsappText:
      'नमस्ते श्याम बिल्डिंग मटेरियल सिलवानी, मुझे Sardar Solar Jhatka Machine Set (सरदार 900 / 1200 सोलर झटका मशीन) का पूरा सेट रेट पता करना है।',
  },
  {
    id: 'tiger-power-sprayer',
    category: 'agriculture',
    categoryLabelEn: 'Agriculture & Machinery (कृषि उपकरण)',
    categoryLabelHi: 'कृषि स्प्रेयर मशीन',
    titleEn: 'Tiger Power Sprayer (7.5 HP टाइगर पावर स्प्रेयर)',
    titleHi: '7.5 HP टाइगर पावर स्प्रेयर (हाई-प्रेशर कृषि स्प्रे पंप)',
    brands: ['Tiger Agri Machinery'],
    descriptionHi: 'अब खेतों में दवा छिड़काव बने आसान! दमदार 7.5 HP की ताकत, स्प्रेयर एवं नोज़ल उचित दाम पर।',
    descriptionEn: 'Heavy-duty 7.5 HP engine sprayer delivering long-range high-pressure misting for large farm plots, complete with brass guns and hose.',
    specs: '7.5 HP High-Torque Engine · Brass Pump Manifold · Sprayer Hose & Nozzles Available',
    unitLabel: 'Units (मशीन)',
    imageUrl:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80',
    alternateImages: [
      {
        label: 'Agricultural Crop Spraying',
        url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80',
      },
      {
        label: 'Farm Machinery Equipment',
        url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80',
      },
    ],
    stockStatus: 'in_stock',
    customNote: 'दमदार 7.5 HP · स्प्रेयर एवं नोज़ल उपलब्ध',
    whatsappText:
      'नमस्ते श्याम बिल्डिंग मटेरियल सिलवानी, मुझे Tiger Power Sprayer (7.5 HP टाइगर पावर स्प्रेयर एवं नोज़ल) का आज का रेट पता करना है।',
  },
  {
    id: 'submersible-pumps-starters',
    category: 'agriculture',
    categoryLabelEn: 'Agriculture & Machinery (कृषि उपकरण)',
    categoryLabelHi: 'सबमर्सिबल पंप एवं स्टार्टर',
    titleEn: 'Hi-Tech & Taro Submersible Pumps (सबमर्सिबल पंप एवं Sonex स्टार्टर)',
    titleHi: 'हाई-टेक एवं टैरो सबमर्सिबल पंप व Sonex स्टार्टर',
    brands: ['Taro Pumps', 'Hi-Tech Submersible', 'Sonex Starters'],
    descriptionHi: '20-30% तक बिजली की बचत, बोरवेल और खेतों के लिए हाई-परफॉरमेंस मोटर पंप।',
    descriptionEn: 'High-discharge stainless steel borewell submersible pump sets and heavy-duty Sonex automatic motor starters engineered for voltage fluctuations.',
    specs: '20–30% Power Saving · Borewell & Openwell Models · Heavy-Duty Sonex Control Panels',
    unitLabel: 'Pump Sets (पंप सेट)',
    imageUrl:
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
    alternateImages: [
      {
        label: 'Industrial Motor & Pump Unit',
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
      },
      {
        label: 'Irrigation Water System',
        url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80',
      },
    ],
    stockStatus: 'in_stock',
    customNote: '20-30% बिजली की बचत · गारंटीशुदा सर्विस',
    whatsappText:
      'नमस्ते श्याम बिल्डिंग मटेरियल सिलवानी, मुझे Hi-Tech / Taro Submersible Pump और Sonex Starter के मॉडल और रेट की जानकारी चाहिए।',
  },
];

export const PARTNER_BRANDS: BrandPartner[] = [
  {
    id: 'ultratech',
    name: 'UltraTech Cement',
    nameHi: 'अल्ट्राटेक सीमेंट',
    group: 'Cement',
    groupHi: 'सीमेंट ब्रांड्स',
    tagline: 'देश का नंबर 1 सीमेंट · The Engineer’s Choice',
    relatedProductIds: ['cement-premium'],
  },
  {
    id: 'wonder',
    name: 'Wonder Cement',
    nameHi: 'वंडर सीमेंट',
    group: 'Cement',
    groupHi: 'सीमेंट ब्रांड्स',
    tagline: 'एक परफेक्ट शुरुआत · High Strength PPC/OPC',
    relatedProductIds: ['cement-premium'],
  },
  {
    id: 'jk-super',
    name: 'JK Super Cement',
    nameHi: 'जेके सुपर सीमेंट',
    group: 'Cement',
    groupHi: 'सीमेंट ब्रांड्स',
    tagline: 'Build Safe · Weather Shield Formula',
    relatedProductIds: ['cement-premium'],
  },
  {
    id: 'kamdhenu-nxt',
    name: 'Kamdhenu NXT',
    nameHi: 'कामधेनु NXT सरिया',
    group: 'Steel / TMT',
    groupHi: 'सरिया / टीएमटी स्टील',
    tagline: 'Next-Gen Interlock Ribbed TMT Bars',
    relatedProductIds: ['tmt-steel-bars'],
  },
  {
    id: 'tiger-steel',
    name: 'Tiger Steel TMT',
    nameHi: 'टाइगर स्टील सरिया',
    group: 'Steel / TMT',
    groupHi: 'सरिया / टीएमटी स्टील',
    tagline: 'Heavy-Duty Earthquake Resistant Re-bars',
    relatedProductIds: ['tmt-steel-bars', 'tiger-power-sprayer'],
  },
  {
    id: 'birla-opus',
    name: 'Birla Opus Paints',
    nameHi: 'बिरला ओपस पेंट्स',
    group: 'Paints & Sanitary',
    groupHi: 'पेंट्स एवं सेनेटरी',
    tagline: 'Premium Interior & Exterior Architectural Coatings',
    relatedProductIds: ['paints-and-putty'],
  },
  {
    id: 'sparsh-pearl',
    name: 'Sparsh Pearl',
    nameHi: 'स्पर्श पर्ल बाथ फिटिंग्स',
    group: 'Paints & Sanitary',
    groupHi: 'पेंट्स एवं सेनेटरी',
    tagline: 'Designer Bath Fittings & Sanitaryware',
    relatedProductIds: ['sanitary-bath-fittings'],
  },
  {
    id: 'havells',
    name: 'Havells Electricals',
    nameHi: 'हैवेल्स इलेक्ट्रिकल्स',
    group: 'Electrical & Agri',
    groupHi: 'इलेक्ट्रिकल एवं कृषि',
    tagline: 'Flame Retardant Wires & Heavy Cables',
    relatedProductIds: ['wires-and-pipes'],
  },
  {
    id: 'taro-hitech',
    name: 'Taro & Hi-Tech Pumps',
    nameHi: 'टैरो एवं हाई-टेक पंप',
    group: 'Electrical & Agri',
    groupHi: 'इलेक्ट्रिकल एवं कृषि',
    tagline: 'Energy Saving Borewell Submersible Motors',
    relatedProductIds: ['submersible-pumps-starters'],
  },
  {
    id: 'sonex-sardar',
    name: 'Sonex & Sardar Solar',
    nameHi: 'सोनेक्स स्टार्टर एवं सरदार सोलर',
    group: 'Electrical & Agri',
    groupHi: 'इलेक्ट्रिकल एवं कृषि',
    tagline: 'ISO Certified Solar Jhatka & Motor Starters',
    relatedProductIds: ['sardar-solar-jhatka', 'submersible-pumps-starters'],
  },
];

export const GOOGLE_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    authorName: 'शिवम् नामदेव (Shivam Namdev)',
    authorSubtitle: 'Verified Customer · Silwani, MP',
    rating: 5,
    reviewText: 'अच्छी क्वालिटी का माल और बढ़िया सर्विस - श्याम बिल्डिंग मटेरियल सिलवानी बेस्ट है।',
    reviewTranslation: 'Great quality material and excellent service — Shyam Building Material Silwani is the best.',
    dateLabel: 'Google Maps Review',
    verifiedTag: 'Verified Purchase · Cement & TMT Steel',
  },
  {
    id: 'rev-2',
    authorName: 'Rajesh Sahu',
    authorSubtitle: 'Homeowner & Local Buyer · Silwani',
    rating: 5,
    reviewText: 'Reasonable price & Good product. Behaviour is very polite.',
    reviewTranslation: 'उचित दाम और बढ़िया प्रोडक्ट। व्यवहार बहुत ही विनम्र और सहयोगी है।',
    dateLabel: 'Google Maps Review',
    verifiedTag: 'Verified Purchase · Hardware & Sanitary',
  },
  {
    id: 'rev-3',
    authorName: 'Local Contractor Review (स्थानीय ठेकेदार)',
    authorSubtitle: 'Civil Contractor · Raisen District',
    rating: 5,
    reviewText: 'सिलवानी में एक ही छत के नीचे सीमेंट, सरिया और हार्डवेयर का सारा सामान सही रेट पर मिल जाता है।',
    reviewTranslation: 'All cement, TMT steel, and hardware materials are available under one roof at genuine wholesale rates in Silwani.',
    dateLabel: 'Google Maps Review',
    verifiedTag: 'Bulk Site Supply Partner',
  },
];
