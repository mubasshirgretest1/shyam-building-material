import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Check,
  ClipboardCopy,
  Layers,
  MessageSquare,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  User,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { BUSINESS_INFO, buildWhatsAppLink, LanguageMode } from '../data/storeData';

export interface EstimateDraft {
  cementBrand: string;
  cementBags: number;
  steelBrand: string;
  steelSize: string;
  steelQuintals: number;
  coverBlocksPacks: number;
  sanitarySelection: string;
  sanitaryQty: number;
  wiresSelection: string;
  wiresQty: number;
  paintSelection: string;
  paintQty: number;
  agriSelection: string;
  agriQty: number;
  customerName: string;
  villageOrArea: string;
  customerPhone: string;
  customNotes: string;
}

interface MaterialEstimatorProps {
  draft: EstimateDraft;
  setDraft: React.Dispatch<React.SetStateAction<EstimateDraft>>;
  languageMode: LanguageMode;
}

type CalculatorMode = 'manual' | 'sqft';
type ConstructionStage = 'full' | 'slab' | 'foundation';

export const MaterialEstimator: React.FC<MaterialEstimatorProps> = ({
  draft,
  setDraft,
  languageMode,
}) => {
  const [mode, setMode] = useState<CalculatorMode>('manual');
  const [sqftArea, setSqftArea] = useState<number>(1200);
  const [stage, setStage] = useState<ConstructionStage>('full');
  const [appliedToast, setAppliedToast] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const isHindiFirst = languageMode === 'hindi_first';

  // Civil engineering thumb-rule estimator for Silwani residential construction
  const calculatedSqftEstimate = useMemo(() => {
    const safeArea = Math.max(100, Math.min(25000, sqftArea || 0));
    if (stage === 'full') {
      // Full grey structure: ~0.4 bags/sq.ft, ~3.5 kg (0.035 quintal) steel/sq.ft
      return {
        cementBags: Math.round(safeArea * 0.4),
        steelQuintals: Number((safeArea * 0.035).toFixed(1)),
        coverBlocksPacks: Math.max(2, Math.ceil(safeArea / 250)),
        wiresCoils: Math.max(2, Math.ceil(safeArea / 300)),
        sanitarySets: Math.max(1, Math.round(safeArea / 600)),
        stageLabelEn: 'Full House Grey Structure (पूरा मकान निर्माण)',
      };
    }
    if (stage === 'slab') {
      // RCC Roof Slab: ~0.12 bags/sq.ft, ~1.2 kg (0.012 quintal) steel/sq.ft
      return {
        cementBags: Math.round(safeArea * 0.12),
        steelQuintals: Number((safeArea * 0.012).toFixed(1)),
        coverBlocksPacks: Math.max(2, Math.ceil(safeArea / 200)),
        wiresCoils: Math.max(1, Math.ceil(safeArea / 500)),
        sanitarySets: 0,
        stageLabelEn: 'RCC Roof Slab / छत ढलाई',
      };
    }
    // Foundation & Plinth: ~0.15 bags/sq.ft, ~1.0 kg (0.010 quintal) steel/sq.ft
    return {
      cementBags: Math.round(safeArea * 0.15),
      steelQuintals: Number((safeArea * 0.01).toFixed(1)),
      coverBlocksPacks: Math.max(1, Math.ceil(safeArea / 300)),
      wiresCoils: 0,
      sanitarySets: 0,
      stageLabelEn: 'Foundation & Plinth (नींव और कुर्सी)',
    };
  }, [sqftArea, stage]);

  const applySqftToDraft = () => {
    setDraft((prev) => ({
      ...prev,
      cementBags: calculatedSqftEstimate.cementBags,
      steelQuintals: calculatedSqftEstimate.steelQuintals,
      coverBlocksPacks: calculatedSqftEstimate.coverBlocksPacks,
      wiresQty: calculatedSqftEstimate.wiresCoils,
      sanitaryQty: calculatedSqftEstimate.sanitarySets,
      customNotes: `Plot Area: ${sqftArea} Sq.Ft. (${calculatedSqftEstimate.stageLabelEn})`,
    }));
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2600);
    setMode('manual');
  };

  const resetDraft = () => {
    setDraft({
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
  };

  // Format structured WhatsApp message
  const formattedWhatsAppMessage = useMemo(() => {
    const lines: string[] = [
      'नमस्ते *श्याम बिल्डिंग मटेरियल, सिलवानी* (Pro. Shyam Sahu),',
      'मुझे नीचे दिए गए सामान के *आज के बेस्ट रेट (Quotation)* बताएं:',
      '',
    ];

    let itemIndex = 1;
    if (draft.cementBags > 0) {
      lines.push(
        `${itemIndex++}. *सीमेंट (Cement):* ${draft.cementBags} Bags — (${draft.cementBrand})`
      );
    }
    if (draft.steelQuintals > 0) {
      lines.push(
        `${itemIndex++}. *सरिया (TMT Steel):* ${draft.steelQuintals} Quintal — (${draft.steelBrand}, Size: ${draft.steelSize})`
      );
    }
    if (draft.coverBlocksPacks > 0) {
      lines.push(
        `${itemIndex++}. *कवर ब्लॉक्स (20mm/25mm Cover Blocks):* ${draft.coverBlocksPacks} Packs`
      );
    }
    if (draft.sanitaryQty > 0) {
      lines.push(
        `${itemIndex++}. *सेनेटरी एवं टैंक:* ${draft.sanitaryQty} Set — (${draft.sanitarySelection})`
      );
    }
    if (draft.wiresQty > 0) {
      lines.push(
        `${itemIndex++}. *इलेक्ट्रिकल एवं पाइप्स:* ${draft.wiresQty} Bundle/Coil — (${draft.wiresSelection})`
      );
    }
    if (draft.paintQty > 0) {
      lines.push(
        `${itemIndex++}. *पेंट्स एवं पुट्टी:* ${draft.paintQty} Units — (${draft.paintSelection})`
      );
    }
    if (draft.agriQty > 0) {
      lines.push(
        `${itemIndex++}. *कृषि उपकरण (Agri Machine):* ${draft.agriQty} Unit — (${draft.agriSelection})`
      );
    }

    if (itemIndex === 1) {
      lines.push('• कृपया सीमेंट, सरिया और हार्डवेयर के आज के रेट साझा करें।');
    }

    if (draft.customNotes.trim()) {
      lines.push('', `*अतिरिक्त विवरण:* ${draft.customNotes.trim()}`);
    }

    lines.push('');
    lines.push(
      `*ग्राहक का नाम:* ${draft.customerName.trim() || 'ग्राहक (Silwani)'}`
    );
    lines.push(
      `*गाँव / वार्ड (स्थान):* ${draft.villageOrArea.trim() || 'सिलवानी (Silwani)'}`
    );
    if (draft.customerPhone.trim()) {
      lines.push(`*मोबाइल नंबर:* ${draft.customerPhone.trim()}`);
    }

    return lines.join('\n');
  }, [draft]);

  const handleCopyEstimate = async () => {
    try {
      await navigator.clipboard.writeText(formattedWhatsAppMessage);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2200);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const activeItemsCount = [
    draft.cementBags > 0,
    draft.steelQuintals > 0,
    draft.coverBlocksPacks > 0,
    draft.sanitaryQty > 0,
    draft.wiresQty > 0,
    draft.paintQty > 0,
    draft.agriQty > 0,
  ].filter(Boolean).length;

  return (
    <section
      id="calculator"
      className="py-16 lg:py-24 bg-[#0F172A] text-white border-y border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-wider text-amber-400 uppercase mb-2">
              03. Interactive Rate & Quantity Estimator · सामान और रेट कैलकुलेटर
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white balance-text">
              {isHindiFirst
                ? 'तुरंत सामान की लिस्ट बनाएं और WhatsApp पर आज का रेट पाएं'
                : 'Quick Construction Estimate & Bulk WhatsApp Rate Inquiry'}
            </h2>
            <p className="text-slate-300 mt-2 text-sm sm:text-base max-w-2xl">
              {isHindiFirst
                ? 'अपने मकान के स्क्वायर फीट (Sq. Ft.) से सीमेंट-सरिया का अंदाजा लगाएं या सीधे सामान चुनकर प्रो. श्याम साहू को WhatsApp भेजें।'
                : 'Calculate material requirements by house square footage or select exact quantities to receive today’s best wholesale quote directly on WhatsApp.'}
            </p>
          </div>

          {/* Mode Segmented Switch */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start">
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                mode === 'manual'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Manual Item Picker (लिस्ट बनाएं)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('sqft')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                mode === 'sqft'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Sq. Ft. House Calculator (मकान कैलकुलेटर)</span>
            </button>
          </div>
        </div>

        {/* Main 12-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Interactive Selector or Sq.Ft Calculator */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7">
            {mode === 'sqft' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      House Area Thumb-Rule Estimator · मकान क्षेत्रफल से गणना
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enter your plot or slab area in Square Feet to estimate required materials
                    </p>
                  </div>
                  <span className="text-xs text-amber-400 font-mono-num">
                    {sqftArea} Sq. Ft.
                  </span>
                </div>

                {/* Plot Area Input + Presets */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    1. Enter Construction Area in Sq. Ft. (मकान या छत का क्षेत्रफल - वर्ग फीट)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      min={100}
                      max={25000}
                      value={sqftArea}
                      onChange={(e) => setSqftArea(Number(e.target.value))}
                      className="w-40 px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono-num text-base font-bold focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex flex-wrap gap-2">
                      {[600, 1000, 1200, 1500, 2000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setSqftArea(preset)}
                          className={`px-3 py-2 rounded-lg text-xs font-mono-num font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                            sqftArea === preset
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {preset} Sq.Ft
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stage Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    2. Select Construction Stage (निर्माण का चरण चुनें)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'full' as ConstructionStage,
                        title: 'Full House Structure',
                        sub: 'पूरा मकान निर्माण',
                      },
                      {
                        id: 'slab' as ConstructionStage,
                        title: 'RCC Roof Slab Only',
                        sub: 'केवल छत ढलाई (लेंटर)',
                      },
                      {
                        id: 'foundation' as ConstructionStage,
                        title: 'Foundation & Plinth',
                        sub: 'नींव और कुर्सी कार्य',
                      },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStage(st.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          stage === st.id
                            ? 'bg-amber-500/15 border-amber-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-sm font-bold">{st.title}</div>
                        <div className="text-xs text-amber-400 mt-0.5">{st.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Computed Output Grid */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-semibold text-slate-400 mb-3">
                    Estimated Material Requirement for {sqftArea} Sq. Ft. ({calculatedSqftEstimate.stageLabelEn}):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-xs text-slate-400">Cement (सीमेंट)</div>
                      <div className="text-xl font-bold text-amber-400 font-mono-num mt-1">
                        {calculatedSqftEstimate.cementBags} Bags
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">50 Kg Standard</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-xs text-slate-400">TMT Steel (सरिया)</div>
                      <div className="text-xl font-bold text-amber-400 font-mono-num mt-1">
                        {calculatedSqftEstimate.steelQuintals} Qtl
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        ~{Math.round(calculatedSqftEstimate.steelQuintals * 100)} Kg
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-xs text-slate-400">Cover Blocks</div>
                      <div className="text-xl font-bold text-white font-mono-num mt-1">
                        {calculatedSqftEstimate.coverBlocksPacks} Packs
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">20mm / 25mm</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-xs text-slate-400">Wiring & Conduits</div>
                      <div className="text-xl font-bold text-white font-mono-num mt-1">
                        {calculatedSqftEstimate.wiresCoils} Coils
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Havells / PVC</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={applySqftToDraft}
                    className="mt-5 w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Calculated Quantities to My Inquiry List (लिस्ट में जोड़ें)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Select Materials & Quantities · सामान और मात्रा चुनें
                    </h3>
                    <p className="text-xs text-slate-400">
                      Adjust quantities below — your WhatsApp message updates automatically
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetDraft}
                    className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                {appliedToast && (
                  <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Sq. Ft. calculated quantities have been applied to your inquiry list!
                    </span>
                  </div>
                )}

                {/* 1. Cement Row */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="text-sm font-bold text-white">
                      1. Cement Bags (सीमेंट की बोरी - 50 Kg)
                    </div>
                    <select
                      aria-label="Select Cement Brand"
                      value={draft.cementBrand}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, cementBrand: e.target.value }))
                      }
                      className="w-full sm:w-64 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="UltraTech Cement">UltraTech Cement (अल्ट्राटेक)</option>
                      <option value="Wonder Cement">Wonder Cement (वंडर सीमेंट)</option>
                      <option value="JK Super Cement">JK Super Cement (जेके सुपर)</option>
                      <option value="Any Best Rate Brand">Compare All Cement Brands</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      aria-label="Decrease Cement Bags"
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          cementBags: Math.max(0, p.cementBags - 10),
                        }))
                      }
                      className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 flex items-center justify-center text-slate-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      aria-label="Cement Bags Quantity"
                      min={0}
                      value={draft.cementBags}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          cementBags: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      className="w-20 text-center py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-mono-num font-bold text-sm"
                    />
                    <button
                      type="button"
                      aria-label="Increase Cement Bags"
                      onClick={() =>
                        setDraft((p) => ({ ...p, cementBags: p.cementBags + 10 }))
                      }
                      className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 flex items-center justify-center text-slate-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-400 w-12">Bags</span>
                  </div>
                </div>

                {/* 2. TMT Steel Row */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="text-sm font-bold text-white">
                      2. TMT Steel Bars / सरिया (Quintals / क्विंटल)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select
                        aria-label="Select TMT Steel Brand"
                        value={draft.steelBrand}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, steelBrand: e.target.value }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Kamdhenu NXT">Kamdhenu NXT (कामधेनु NXT)</option>
                        <option value="Tiger Steel TMT">Tiger Steel (टाइगर स्टील)</option>
                      </select>
                      <select
                        aria-label="Select TMT Steel Size"
                        value={draft.steelSize}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, steelSize: e.target.value }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="10mm & 12mm Mix">10mm & 12mm Mix</option>
                        <option value="8mm Ring Rod">8mm Only</option>
                        <option value="10mm Slab Rod">10mm Only</option>
                        <option value="12mm Column/Beam">12mm Only</option>
                        <option value="16mm Heavy Beam">16mm Only</option>
                        <option value="20mm / 25mm Heavy">20mm / 25mm</option>
                        <option value="All Sizes (8mm to 25mm)">All Sizes (8mm–25mm)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      aria-label="Decrease Steel Quintals"
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          steelQuintals: Math.max(0, Number((p.steelQuintals - 1).toFixed(1))),
                        }))
                      }
                      className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 flex items-center justify-center text-slate-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      aria-label="Steel Quintals Quantity"
                      min={0}
                      step="0.5"
                      value={draft.steelQuintals}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          steelQuintals: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      className="w-20 text-center py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-mono-num font-bold text-sm"
                    />
                    <button
                      type="button"
                      aria-label="Increase Steel Quintals"
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          steelQuintals: Number((p.steelQuintals + 1).toFixed(1)),
                        }))
                      }
                      className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 flex items-center justify-center text-slate-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-400 w-12">Qtl</span>
                  </div>
                </div>

                {/* 3. Concrete Cover Blocks Row */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-white">
                      3. Concrete Cover Blocks (20mm/25mm कवर ब्लॉक्स - ₹2 का कमाल)
                    </div>
                    <div className="text-xs text-slate-400">
                      High-strength spacer blocks for slab & column reinforcement
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          coverBlocksPacks: Math.max(0, p.coverBlocksPacks - 1),
                        }))
                      }
                      className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 flex items-center justify-center text-slate-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={draft.coverBlocksPacks}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          coverBlocksPacks: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      className="w-20 text-center py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-mono-num font-bold text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          coverBlocksPacks: p.coverBlocksPacks + 1,
                        }))
                      }
                      className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 flex items-center justify-center text-slate-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-400 w-12">Packs</span>
                  </div>
                </div>

                {/* 4. Sanitary / Electrical / Paint Quick Steppers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sanitaryware */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
                    <div className="text-xs font-bold text-white">
                      4. Sanitary & Water Tank (Sparsh Pearl)
                    </div>
                    <select
                      aria-label="Sanitaryware Option"
                      value={draft.sanitarySelection}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, sanitarySelection: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                    >
                      <option value="Sparsh Pearl Bath Fittings & Tank">
                        Sparsh Pearl Complete Bath Set
                      </option>
                      <option value="Water Storage Tank (500L / 1000L)">
                        Water Tank (500L / 1000L)
                      </option>
                      <option value="Ceramic Seat, Washbasin & Taps">
                        Ceramic Seat, Basin & Taps
                      </option>
                    </select>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">Quantity (Sets):</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((p) => ({
                              ...p,
                              sanitaryQty: Math.max(0, p.sanitaryQty - 1),
                            }))
                          }
                          className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-num text-sm font-bold text-amber-400 w-6 text-center">
                          {draft.sanitaryQty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((p) => ({ ...p, sanitaryQty: p.sanitaryQty + 1 }))
                          }
                          className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Agri Equipment */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
                    <div className="text-xs font-bold text-white">
                      5. Agri Machinery (कृषि उपकरण एवं पंप)
                    </div>
                    <select
                      aria-label="Agriculture Machinery Option"
                      value={draft.agriSelection}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, agriSelection: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                    >
                      <option value="Sardar Solar Jhatka Machine Set (1200)">
                        Sardar Solar Jhatka Machine (900/1200)
                      </option>
                      <option value="7.5 HP Tiger Power Sprayer">
                        7.5 HP Tiger Power Sprayer
                      </option>
                      <option value="Hi-Tech / Taro Submersible Pump + Sonex Starter">
                        Hi-Tech/Taro Submersible + Sonex Starter
                      </option>
                    </select>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">Quantity (Units):</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((p) => ({
                              ...p,
                              agriQty: Math.max(0, p.agriQty - 1),
                            }))
                          }
                          className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-num text-sm font-bold text-amber-400 w-6 text-center">
                          {draft.agriQty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((p) => ({ ...p, agriQty: p.agriQty + 1 }))
                          }
                          className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wires & Paints Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">
                        6. Havells Wires & PVC Pipes
                      </div>
                      <div className="text-[11px] text-slate-400">10-12mm Cable / Conduits</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((p) => ({
                            ...p,
                            wiresQty: Math.max(0, p.wiresQty - 1),
                          }))
                        }
                        className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono-num text-sm font-bold text-amber-400 w-6 text-center">
                        {draft.wiresQty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((p) => ({ ...p, wiresQty: p.wiresQty + 1 }))
                        }
                        className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">
                        7. Birla Opus Paints & Putty
                      </div>
                      <div className="text-[11px] text-slate-400">Buckets / 40Kg Putty Bags</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((p) => ({
                            ...p,
                            paintQty: Math.max(0, p.paintQty - 1),
                          }))
                        }
                        className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono-num text-sm font-bold text-amber-400 w-6 text-center">
                        {draft.paintQty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((p) => ({ ...p, paintQty: p.paintQty + 1 }))
                        }
                        className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right 5 Columns: Customer Details & Live WhatsApp Dispatch */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Your Details & WhatsApp Quote · विवरण भरें
                </h3>
                <p className="text-xs text-slate-400">
                  Sent directly to {BUSINESS_INFO.proprietorEn} ({BUSINESS_INFO.primaryPhoneDisplay})
                </p>
              </div>
              <span className="text-xs font-mono-num text-amber-400">
                {activeItemsCount} {activeItemsCount === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Name (आपका शुभ नाम) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. राजेश साहू / Rajesh"
                    value={draft.customerName}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, customerName: e.target.value }))
                    }
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Village / Area in Silwani (गाँव / मोहल्ला) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. मेन रोड सिलवानी / बम्होरी"
                    value={draft.villageOrArea}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, villageOrArea: e.target.value }))
                    }
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number (मोबाइल नंबर - वैकल्पिक)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={draft.customerPhone}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, customerPhone: e.target.value }))
                    }
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono-num placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Site Delivery / Notes (अन्य कोई सामान)
                </label>
                <input
                  type="text"
                  placeholder="e.g. साइट डिलीवरी चाहिए"
                  value={draft.customNotes}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, customNotes: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Live WhatsApp Message Preview */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>WhatsApp Message Preview (संदेश का प्रारूप):</span>
                <button
                  type="button"
                  onClick={handleCopyEstimate}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  {copiedToast ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-3.5 h-3.5" />
                      <span>Copy List</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                {formattedWhatsAppMessage}
              </pre>
            </div>

            {/* Primary WhatsApp Dispatch Action */}
            <a
              href={buildWhatsAppLink(formattedWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition-colors whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Send Estimate List on WhatsApp (रेट पता करें)</span>
            </a>

            <p className="text-[11px] text-slate-400 text-center">
              Direct WhatsApp to <span className="font-mono-num text-slate-300">+91 9893962935</span> · Fast response during store hours (9 AM – 9 PM)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
