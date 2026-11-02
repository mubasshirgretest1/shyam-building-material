import React, { useState } from 'react';
import { X, Image as ImageIcon, RotateCcw, Check, Sparkles } from 'lucide-react';
import { ProductItem } from '../data/storeData';

interface OwnerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onUpdateProduct: (
    productId: string,
    updates: Partial<Pick<ProductItem, 'imageUrl' | 'stockStatus' | 'customNote'>>
  ) => void;
  onResetAll: () => void;
  forceIllustration: boolean;
  setForceIllustration: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OwnerManagerModal: React.FC<OwnerManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  onResetAll,
  forceIllustration,
  setForceIllustration,
}) => {
  const [selectedId, setSelectedId] = useState<string>(products[0]?.id || 'cement-premium');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedId) || products[0];

  const triggerSaved = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/75 backdrop-blur-xs">
      <div className="w-full max-w-xl h-full bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Owner Photo Swap & Stock Manager (प्रो. श्याम साहू एडिट मोड)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Easily swap product photos, toggle stock status, or update highlights anytime
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Owner Manager"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Global Visual Mode Switch */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900">
                Catalog Visual Style · फोटो या इलस्ट्रेशन मोड
              </div>
              <div className="text-xs text-slate-500">
                Switch between High-Res Unsplash Photos and Studio Technical Graphics
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForceIllustration((prev) => !prev)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                forceIllustration
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{forceIllustration ? 'Using Technical SVG' : 'Using High-Res Photos'}</span>
            </button>
          </div>

          {/* Product Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Select Product to Customize (सामान चुनें)
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
            >
              {products.map((item, idx) => (
                <option key={item.id} value={item.id}>
                  {idx + 1}. {item.titleEn}
                </option>
              ))}
            </select>
          </div>

          {currentProduct && (
            <div className="space-y-5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {currentProduct.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">{currentProduct.titleHi}</p>
                </div>
                {savedNotice && (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Saved
                  </span>
                )}
              </div>

              {/* Stock Availability Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Stock Status (स्टॉक की स्थिति)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProduct(currentProduct.id, { stockStatus: 'in_stock' });
                      triggerSaved();
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      currentProduct.stockStatus === 'in_stock'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    In Stock · ताज़ा स्टॉक उपलब्ध
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProduct(currentProduct.id, { stockStatus: 'bulk_order' });
                      triggerSaved();
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      currentProduct.stockStatus === 'bulk_order'
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    Order Basis · ऑर्डर पर उपलब्ध
                  </button>
                </div>
              </div>

              {/* Custom Image URL Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Product Image URL (नया फोटो लिंक पेस्ट करें)
                </label>
                <input
                  type="url"
                  value={currentProduct.imageUrl}
                  onChange={(e) => {
                    onUpdateProduct(currentProduct.id, { imageUrl: e.target.value });
                    triggerSaved();
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono-num text-slate-800 focus:outline-none focus:border-amber-500"
                />
                {currentProduct.alternateImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentProduct.alternateImages.map((altImg) => (
                      <button
                        key={altImg.label}
                        type="button"
                        onClick={() => {
                          onUpdateProduct(currentProduct.id, { imageUrl: altImg.url });
                          triggerSaved();
                        }}
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-amber-500 text-[11px] font-medium text-slate-700"
                      >
                        Use Preset: {altImg.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Highlight Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Special Highlight Line (विशेष नोट / ऑफर)
                </label>
                <input
                  type="text"
                  value={currentProduct.customNote || ''}
                  onChange={(e) => {
                    onUpdateProduct(currentProduct.id, { customNote: e.target.value });
                    triggerSaved();
                  }}
                  placeholder="e.g. ताज़ा गोदाम स्टॉक उपलब्ध"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onResetAll();
              triggerSaved();
            }}
            className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Default</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
          >
            Done & Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
