import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Flame,
  Info,
  CheckCircle2,
  XCircle,
  ScanLine,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { useScanStore } from '../../store/useScanStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { GradeBadge } from '../../components/ui/GradeBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { Product } from '../../types';

type ExploreCategory = 'all' | 'pads' | 'noodles' | 'chocolates' | 'biscuits' | 'snacks' | 'beverages';
type GradeFilter = 'all' | 'clean' | 'caution';

interface CategoryInsight {
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  goldenRule: { en: string; hi: string };
  redFlags: { en: string; hi: string };
}

const CATEGORY_INSIGHTS: Record<ExploreCategory, CategoryInsight | null> = {
  all: {
    title: {
      en: 'FSSAI & BIS Certified Laboratory Benchmarks',
      hi: 'FSSAI एवं BIS प्रमाणित प्रयोगशाला मानक',
    },
    description: {
      en: 'Explore India\'s packaged foods and intimate care essentials evaluated by verified health and ingredient safety standards.',
      hi: 'सत्यापित स्वास्थ्य और सामग्री सुरक्षा मानकों के आधार पर भारत के पैकेज्ड खाद्य एवं स्वच्छता उत्पादों की जांच करें।',
    },
    goldenRule: {
      en: 'Always inspect the 1st three ingredients on the label and look for unannounced palm oil or high free sugars.',
      hi: 'लेबल पर पहले 3 तत्वों को हमेशा जांचें और छिपे हुए पाम ऑयल या अत्यधिक चीनी से सावधान रहें।',
    },
    redFlags: {
      en: 'Refined Palm Olein, INS 635 / 621 flavor enhancers, synthetic perfumes in pads, and added sugars exceeding 10g/100g.',
      hi: 'रिफाइंड पामोलिन, INS 635 / 621 स्वाद बढ़ाने वाले रसायन, सैनिटरी पैड्स में कृत्रिम इत्र और 10g/100g से अधिक अतिरिक्त चीनी।',
    },
  },
  pads: {
    title: {
      en: 'Sanitary Pads: Organic Cotton vs Synthetic Plastic & Chlorine',
      hi: 'सैनिटरी पैड्स: ऑर्गेनिक कॉटन बनाम प्लास्टिक एवं क्लोरीन ब्लीच',
    },
    description: {
      en: 'Vaginal and vulvar mucosa absorb chemicals rapidly. Traditional commercial pads use elemental chlorine-bleached fluff (dioxin risk) and synthetic plastic netting that induces contact dermatitis and heat rash.',
      hi: 'योनि की त्वचा रसायनों को बहुत तेजी से सोखती है। सामान्य पैड्स में क्लोरीन ब्लीचिंग और प्लास्टिक जाली होती है जिससे जलन, रैशेज और संक्रमण का खतरा रहता है।',
    },
    goldenRule: {
      en: 'Choose 100% GOTS Organic Cotton topsheets with TCF (Totally Chlorine Free) certification and zero fragrance (IS 5405:2019).',
      hi: '100% GOTS ऑर्गेनिक कॉटन, TCF (पूर्ण क्लोरीन मुक्त) और 100% केमिकल इत्र-मुक्त पैड्स चुनें।',
    },
    redFlags: {
      en: 'Synthetic floral fragrance / perfume, plastic mesh top layers, and elemental chlorine bleached wood pulp.',
      hi: 'कृत्रिम सुगंध/इत्र, प्लास्टिक की ऊपरी जाली, और क्लोरीन ब्लीच किया हुआ पल्प।',
    },
  },
  noodles: {
    title: {
      en: 'Instant Noodles: Hot-Air Baked vs Palm Oil Flash-Fried',
      hi: 'इंस्टेंट नूडल्स: हॉट-एयर बेक्ड बनाम पाम ऑयल में तले हुए',
    },
    description: {
      en: 'Most instant noodle cakes are pre-fried in industrial palm oil at 160°C to dehydrate them rapidly. One single packet can exhaust 50% of your daily sodium allowance and deliver 7g+ of atherogenic saturated fat.',
      hi: 'अधिकांश इंस्टेंट नूडल्स को पाम ऑयल में डीप-फ्राई किया जाता है। एक पैकेट में ही दिनभर की 50% सोडियम सीमा और 7 ग्राम संतृप्त वसा होती है।',
    },
    goldenRule: {
      en: 'Look for air-dried or baked whole grain / millet noodles with sodium under 650mg and zero palm oil.',
      hi: 'हॉट-एयर बेक्ड या धूप में सुखाए गए मिलेट/आटा नूडल्स चुनें जिनमें पाम ऑयल न हो और सोडियम कम हो।',
    },
    redFlags: {
      en: 'Refined wheat flour (maida) flash-fried in palm oil, sodium > 1,000mg/100g, and ribonucleotide flavor enhancers (INS 635).',
      hi: 'पाम ऑयल में तले हुए मैदा नूडल्स, 1000mg से अधिक सोडियम और INS 635 एडिटिव्स।',
    },
  },
  chocolates: {
    title: {
      en: 'Chocolates: Pure Cocoa Butter vs Sugar & Fractionated Vegetable Fat',
      hi: 'चॉकलेट्स: शुद्ध कोको बटर बनाम चीनी और वनस्पति तेल',
    },
    description: {
      en: 'Commercial milk chocolates frequently contain up to 57% refined sugar (11+ teaspoons per bar) with cocoa butter substituted by fractionated palm fat. Authentic dark chocolate uses cocoa butter rich in stearic acid and flavonoids.',
      hi: 'बाजार की मिल्क चॉकलेट में 57% तक चीनी होती है और महंगे कोको बटर की जगह पाम फैट मिलाया जाता है। शुद्ध डार्क चॉकलेट में प्राकृतिक एंटीऑक्सीडेंट होते हैं।',
    },
    goldenRule: {
      en: 'Opt for 70%+ Dark Chocolate with 100% pure cocoa butter and sugar content under 25g per 100g.',
      hi: '70% या अधिक कोको वाली डार्क चॉकलेट चुनें जिसमें 100% कोको बटर हो और चीनी 25g से कम हो।',
    },
    redFlags: {
      en: 'Sugar listed as ingredient #1, hydrogenated vegetable fat / palm oil substitution, and liquid glucose syrups.',
      hi: 'सामग्री सूची में चीनी पहले नंबर पर होना, पाम ऑयल/वनस्पति घी और लिक्विड ग्लूकोज सिरप।',
    },
  },
  biscuits: {
    title: {
      en: 'Biscuits & Cookies: Refined Palm Shortening & High Sugar',
      hi: 'बिस्कुट एवं कुकीज़: रिफाइंड पाम ऑयल एवं अत्यधिक चीनी',
    },
    description: {
      en: 'Commercial cookies (such as Hide & Seek, Dark Fantasy, and Bourbon) rely on refined palm oil for crumb structure and pack 30g to 38g of sugar per 100g. Even marketed "digestive" biscuits often conceal palm oil.',
      hi: 'कमर्शियल कुकीज़ (जैसे हाइड एंड सीक, डार्क फैंटेसी) में कुरकुरेपन के लिए पाम ऑयल और 30g से 38g तक चीनी होती है। यहां तक कि कई "डायजेस्टिव" बिस्कुट में भी पाम ऑयल छुपा होता है।',
    },
    goldenRule: {
      en: 'Choose whole grain cookies sweetened with jaggery or dates, baked in cold-pressed oils or butter with zero palm olein.',
      hi: 'बिना पाम ऑयल वाले, साबुत अनाज और सीमित मिठास वाले बेक्ड कुकीज़ चुनें।',
    },
    redFlags: {
      en: 'Refined Palm Oil / Palmolein, Invert Sugar Syrup, high saturated fat (>8g/100g), and artificial vanillin cake flavors.',
      hi: 'रिफाइंड पाम ऑयल, इनवर्ट शुगर सिरप, अत्यधिक संतृप्त वसा (>8g/100g) और कृत्रिम सुगंध।',
    },
  },
  snacks: {
    title: {
      en: 'Savory Snacks & Chips: Foxnuts (Makhana) vs Palmolein Deep-Frying',
      hi: 'नमकीन एवं चिप्स: भुने मखाने बनाम पामोलिन में तली भुजिया व चिप्स',
    },
    description: {
      en: 'Deep-fried potato chips and bhujia contain up to 35% oil weight from palmolein, absorbing high levels of saturated fat and sodium. Roasted foxnuts (makhana) roasted in A2 ghee or cold-pressed mustard oil are naturally low GI.',
      hi: 'तले हुए आलू चिप्स और भुजिया में 35% तक पामोलिन तेल होता है। इसके विपरीत A2 घी या कम तेल में भुने हुए मखाने प्राकृतिक रूप से कम ग्लाइसेमिक और पौष्टिक होते हैं।',
    },
    goldenRule: {
      en: 'Choose dry-roasted whole seeds (makhana, pumpkin, chana) seasoned with rock salt and cold-pressed lipids.',
      hi: 'सेंधा नमक और कम तेल में भुने हुए मखाने, भुने चने और प्राकृतिक बीज चुनें।',
    },
    redFlags: {
      en: 'Palmolein / cotton-seed oil, sodium exceeding 800mg/100g, and artificial synthetic colorants like Sunset Yellow (E110).',
      hi: 'पामोलिन/कपासिया तेल, 800mg से अधिक सोडियम और कृत्रिम रासायनिक रंग।',
    },
  },
  beverages: {
    title: {
      en: 'Beverages: 100% Pure Coconut Water vs Added Sugar Juices',
      hi: 'पेय एवं जूस: 100% शुद्ध नारियल पानी बनाम चीनी युक्त जूस',
    },
    description: {
      en: 'Packaged fruit "drinks" often contain only 10-20% fruit pulp and up to 14g of added refined sugar per 100ml. Pure tender coconut water provides natural isotonic electrolytes (potassium, magnesium) with zero added sugar.',
      hi: 'पैकेज्ड फ्रूट ड्रिंक्स में केवल 10-20% फल का गूदा और 14g तक अतिरिक्त चीनी होती है। इसके मुकाबले 100% नारियल पानी बिना किसी चीनी के प्राकृतिक इलेक्ट्रोलाइट्स देता है।',
    },
    goldenRule: {
      en: 'Select 100% pure tender coconut water or cold-pressed whole juices without preservatives or added sucrose.',
      hi: 'बिना प्रिजर्वेटिव और बिना अतिरिक्त चीनी वाला 100% शुद्ध नारियल पानी या कोल्ड-प्रेस्ड जूस चुनें।',
    },
    redFlags: {
      en: 'High added sugar (>10g/100ml), sodium benzoate (INS 211) preservatives, and reconstituted juice powders.',
      hi: 'अतिरिक्त चीनी (>10g/100ml), सोडियम बेंजोएट (INS 211) प्रिजर्वेटिव्स और कृत्रिम फ्लेवर्स।',
    },
  },
};

export const ExploreScreen: React.FC = () => {
  const { products, setCurrentProduct } = useProductStore();
  const { recordProductActivity, openScanner } = useScanStore();
  const { language, t } = useLanguageStore();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<ExploreCategory>('all');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Category filter tabs
  const categoryTabs: Array<{ id: ExploreCategory; label: string; icon: string }> = [
    { id: 'all', label: t('allCurated'), icon: '🌟' },
    { id: 'pads', label: t('sanitaryPadsTab'), icon: '🌸' },
    { id: 'noodles', label: t('noodlesTab'), icon: '🍜' },
    { id: 'chocolates', label: t('chocolatesTab'), icon: '🍫' },
    { id: 'biscuits', label: t('biscuitsTab'), icon: '🍪' },
    { id: 'snacks', label: t('snacksTab'), icon: '🥔' },
    { id: 'beverages', label: t('beveragesTab'), icon: '🥥' },
  ];

  // Map products to categories
  const categoryProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.barcode && p.barcode.includes(q)) ||
          p.summary.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // 2. Category matching
      if (activeCategory === 'pads') {
        return p.category === 'women-hygiene' || /pad|sanitary|whisper|stayfree|carmesi|plush|nua/i.test(p.name);
      }
      if (activeCategory === 'noodles') {
        return /noodle|ramen|maggi|yippee|pasta/i.test(p.name) || /noodle/i.test(p.categoryLabel);
      }
      if (activeCategory === 'chocolates') {
        return /choc|cadbury|amul|silk|kitkat|ferrero|5 star/i.test(p.name) || /chocolate/i.test(p.categoryLabel);
      }
      if (activeCategory === 'biscuits') {
        return /biscuit|cookie|hide & seek|hide and seek|parle|nutrichoice|dark fantasy|bourbon/i.test(p.name) || /biscuit|cookie/i.test(p.categoryLabel);
      }
      if (activeCategory === 'snacks') {
        return /makhana|crisps|lays|kurkure|bhujia|chips/i.test(p.name) || (/food/i.test(p.category) && !/noodle|chocolate|biscuit|drink|juice/i.test(p.categoryLabel));
      }
      if (activeCategory === 'beverages') {
        return /coconut|juice|aamras|drink|beverage/i.test(p.name) || /beverage|juice/i.test(p.categoryLabel);
      }

      return true;
    });
  }, [products, activeCategory, searchTerm]);

  // Filter by grade sub-filter
  const filteredProducts = useMemo(() => {
    if (gradeFilter === 'clean') {
      return categoryProducts.filter((p) => p.grade === 'A' || p.grade === 'B');
    }
    if (gradeFilter === 'caution') {
      return categoryProducts.filter((p) => p.grade === 'D' || p.grade === 'E');
    }
    return categoryProducts;
  }, [categoryProducts, gradeFilter]);

  const currentInsight = CATEGORY_INSIGHTS[activeCategory] || CATEGORY_INSIGHTS.all;

  const handleProductClick = (product: Product) => {
    setCurrentProduct(product);
    // Cache the inspected item in History cache!
    recordProductActivity(product, 'search');

    if (product.category === 'women-hygiene') {
      navigate(`/women-hygiene/${product.id}`);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-5xl mx-auto text-[#111F15] dark:text-[#E4F5E5]">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#005128] text-[#D7FF63] shadow-sm">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
              {t('exploreCuratedTitle')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#69766D] dark:text-[#9BAA9E] mt-1 max-w-2xl">
            {t('exploreCuratedSub')}
          </p>
        </div>

        <Button
          onClick={() => openScanner('barcode')}
          variant="primary"
          size="sm"
          className="gap-2 shadow-sm shrink-0"
        >
          <ScanLine className="w-4 h-4" />
          <span>{t('scanBarcode')}</span>
        </Button>
      </div>

      {/* In-Explore Instant Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#69766D]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            language === 'hi'
              ? 'श्रेणी में खोजें (उदा. Hide & Seek, Carmesi, Maggi, Amul...)'
              : 'Search in curated database (e.g. Hide & Seek, Carmesi, Maggi, Amul)...'
          }
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1A261D] border-2 border-[#111F15]/10 dark:border-[#2D3E33] text-sm font-semibold focus:outline-none focus:border-[#005128] dark:focus:border-[#D7FF63] shadow-sm transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[#69766D]"
          >
            {language === 'hi' ? 'हटाएं' : 'Clear'}
          </button>
        )}
      </div>

      {/* Main Category Tabs */}
      <div className="flex items-center gap-2 pb-2 overflow-x-auto no-scrollbar border-b border-[#E3EAE1] dark:border-[#2D3E33]">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveCategory(tab.id);
              setGradeFilter('all');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-[#005128] text-[#D7FF63] shadow-md scale-102'
                : 'bg-white/80 dark:bg-white/5 text-[#404940] dark:text-[#9BAA9E] hover:bg-white dark:hover:bg-white/10 border border-[#E3EAE1] dark:border-[#2D3E33]'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Clinical Lab Insight Card for Selected Category */}
      {currentInsight && (
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-[#0C2417] to-teal-950 text-white border-2 border-[#D7FF63]/25 shadow-lg relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-white/10 text-[#D7FF63]">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-black font-['Plus_Jakarta_Sans'] text-[#D7FF63]">
                {currentInsight.title[language]}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-white/90">
              Lab Brief
            </span>
          </div>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-4">
            {currentInsight.description[language]}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/15 text-xs">
            <div className="flex items-start gap-2 bg-emerald-900/40 p-3 rounded-2xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-[#D7FF63] shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-[#D7FF63] block mb-0.5">
                  {language === 'hi' ? 'सर्वोत्तम चयन नियम:' : 'Clean Selection Rule:'}
                </span>
                <span className="text-white/85">{currentInsight.goldenRule[language]}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-rose-950/40 p-3 rounded-2xl border border-rose-500/20">
              <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-rose-300 block mb-0.5">
                  {language === 'hi' ? 'सावधानी / रेड फ्लैग्स:' : 'Watch Out Flags:'}
                </span>
                <span className="text-white/85">{currentInsight.redFlags[language]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade Filters & Results Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGradeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              gradeFilter === 'all'
                ? 'bg-[#111F15] dark:bg-white text-white dark:text-[#111F15]'
                : 'bg-black/5 dark:bg-white/5 text-[#69766D] hover:text-[#111F15]'
            }`}
          >
            {t('allItems')} ({categoryProducts.length})
          </button>
          <button
            onClick={() => setGradeFilter('clean')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              gradeFilter === 'clean'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span>✓ {t('bestPicks')} (A / B)</span>
            <span className="text-[11px] opacity-80">
              ({categoryProducts.filter((p) => p.grade === 'A' || p.grade === 'B').length})
            </span>
          </button>
          <button
            onClick={() => setGradeFilter('caution')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              gradeFilter === 'caution'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            <span>⚠ {t('watchOutPicks')} (D / E)</span>
            <span className="text-[11px] opacity-80">
              ({categoryProducts.filter((p) => p.grade === 'D' || p.grade === 'E').length})
            </span>
          </button>
        </div>

        <span className="text-xs font-bold text-[#69766D] dark:text-[#9BAA9E]">
          {filteredProducts.length} {language === 'hi' ? 'उत्पाद सूचीबद्ध' : 'products listed'}
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white/40 dark:bg-white/5 rounded-3xl border border-[#E3EAE1] dark:border-[#2D3E33] p-8">
          <Compass className="w-12 h-12 text-[#69766D] mx-auto mb-3 opacity-30" />
          <h3 className="text-base font-bold text-[#111F15] dark:text-[#E4F5E5]">
            {t('noMatchingProducts')}
          </h3>
          <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-1 mb-4">
            {language === 'hi' ? 'फ़िल्टर बदलें या दूसरा शब्द खोजें।' : 'Try resetting your search query or switching filters.'}
          </p>
          <Button onClick={() => { setSearchTerm(''); setGradeFilter('all'); }} variant="secondary">
            {language === 'hi' ? 'सभी देखें' : 'View All'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="p-4 sm:p-5 flex flex-col justify-between gap-3.5 hover:border-[#005128]/50 hover:shadow-md transition-all group cursor-pointer bg-white/90 dark:bg-[#141F17]/90"
              onClick={() => handleProductClick(product)}
            >
              <div>
                {/* Top Row: Brand, Category, Grade */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black tracking-wider text-[#005128] dark:text-[#D7FF63] uppercase">
                      {product.brand}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[#404940] dark:text-[#9BAA9E]">
                      {product.categoryLabel}
                    </span>
                    {product.packSize && (
                      <span className="text-[10px] font-semibold text-[#69766D] dark:text-[#9BAA9E]">
                        • {product.packSize}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    <GradeBadge grade={product.grade} size="md" />
                  </div>
                </div>

                {/* Main Product Info & Thumbnail */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-white shrink-0 border border-black/5 dark:border-white/10 shadow-sm"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-black text-[#111F15] dark:text-[#E4F5E5] line-clamp-2 font-['Plus_Jakarta_Sans'] group-hover:text-[#005128] dark:group-hover:text-[#D7FF63] transition-colors">
                      {product.name}
                    </h3>

                    {product.barcode && (
                      <span className="text-[10px] font-mono text-[#69766D] dark:text-[#9BAA9E] block mt-0.5">
                        #{product.barcode}
                      </span>
                    )}

                    <p className="text-xs text-[#404940] dark:text-[#9BAA9E] line-clamp-2 mt-1 leading-snug">
                      {product.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Specs & Action */}
              <div className="pt-3 border-t border-[#E3EAE1] dark:border-[#2D3E33] flex items-center justify-between gap-2">
                {/* Specific flags */}
                <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                  {product.category === 'women-hygiene' && product.hygieneMetrics?.bleachingProcess && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      product.hygieneMetrics.bleachingProcess.includes('TCF')
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                    }`}>
                      {product.hygieneMetrics.bleachingProcess}
                    </span>
                  )}

                  {product.ingredients.some((i) => /palm/i.test(i.name)) ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                      ⚠ Palm Oil
                    </span>
                  ) : product.category === 'food' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      ✓ Zero Palm Oil
                    </span>
                  ) : null}

                  {product.nutritionFacts?.some((n) => n.nutrient === 'Sugars' && parseFloat(n.amountPer100g) > 25) && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      High Sugar
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs font-black text-[#005128] dark:text-[#D7FF63] group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>{t('inspectDetails')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
