import React, { useState } from 'react';

interface ProductVisualProps {
  productId: string;
  imageUrl: string;
  alt: string;
  className?: string;
  forceIllustration?: boolean;
}

/**
 * Renders a resilient high-resolution product image with an automatic or selectable
 * custom industrial SVG illustration so zero broken images ever appear.
 */
export const ProductVisual: React.FC<ProductVisualProps> = ({
  productId,
  imageUrl,
  alt,
  className = 'w-full h-full object-cover',
  forceIllustration = false,
}) => {
  const [imgError, setImgError] = useState(false);

  if (!forceIllustration && imageUrl && !imgError) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-slate-900">
        <img
          src={imageUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          className={`${className} transition-transform duration-300 group-hover:scale-[1.03]`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
      </div>
    );
  }

  return <IndustrialSvgIllustration productId={productId} title={alt} />;
};

const IndustrialSvgIllustration: React.FC<{ productId: string; title: string }> = ({
  productId,
  title,
}) => {
  switch (productId) {
    case 'cement-premium':
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-5 relative overflow-hidden"
        >
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-48">
            <defs>
              <linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect x="40" y="182" width="240" height="12" rx="2" fill="#78350F" />
            <rect x="52" y="138" width="104" height="44" rx="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            <rect x="164" y="138" width="104" height="44" rx="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
            <rect x="58" y="92" width="100" height="44" rx="8" fill="url(#bagGrad)" stroke="#FDE68A" strokeWidth="1.5" />
            <rect x="162" y="92" width="100" height="44" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
            <rect x="90" y="32" width="140" height="58" rx="10" fill="url(#bagGrad)" stroke="#FEF3C7" strokeWidth="2" />
            <text x="160" y="58" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="800">
              ULTRATECH · WONDER
            </text>
            <text x="160" y="76" textAnchor="middle" fill="#1E293B" fontSize="10" fontWeight="700" fontFamily="monospace">
              50 KG PORTLAND CEMENT
            </text>
            <text x="108" y="118" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="800">
              JK SUPER
            </text>
            <text x="212" y="118" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="800">
              WONDER 50KG
            </text>
          </svg>
        </div>
      );

    case 'tmt-steel-bars':
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 flex items-center justify-center p-5 relative overflow-hidden"
        >
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-48">
            {[42, 74, 106, 138, 170].map((y, idx) => (
              <g key={y}>
                <rect
                  x="28"
                  y={y}
                  width="264"
                  height="18"
                  rx="9"
                  fill={idx % 2 === 0 ? '#64748B' : '#475569'}
                  stroke="#94A3B8"
                  strokeWidth="1"
                />
                {[50, 75, 100, 125, 150, 175, 200, 225, 250, 270].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1={y + 2}
                    x2={x - 6}
                    y2={y + 16}
                    stroke="#CBD5E1"
                    strokeWidth="2.5"
                  />
                ))}
                <circle cx="28" cy={y + 9} r="8" fill="#F59E0B" />
              </g>
            ))}
            <rect x="80" y="84" width="160" height="46" rx="6" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
            <text x="160" y="105" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="800">
              KAMDHENU NXT · TIGER
            </text>
            <text x="160" y="121" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="monospace">
              8MM TO 25MM FE-500D TMT
            </text>
          </svg>
        </div>
      );

    case 'concrete-cover-blocks':
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-5"
        >
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-48">
            <polygon points="65,80 145,48 225,80 145,112" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            <polygon points="65,80 145,112 145,168 65,136" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
            <polygon points="225,80 145,112 145,168 225,136" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
            <text x="145" y="86" textAnchor="middle" fill="#0F172A" fontSize="13" fontWeight="800">
              20MM / 25MM
            </text>
            <rect x="192" y="126" width="102" height="58" rx="8" fill="#F59E0B" />
            <text x="243" y="152" textAnchor="middle" fill="#0F172A" fontSize="13" fontWeight="800">
              ₹2 का कमाल
            </text>
            <text x="243" y="170" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="700">
              RCC COVER BLOCK
            </text>
          </svg>
        </div>
      );

    case 'sanitary-bath-fittings':
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950 flex items-center justify-center p-5"
        >
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-48">
            {/* Water Tank */}
            <rect x="44" y="48" width="88" height="128" rx="14" fill="#0284C7" stroke="#7DD3FC" strokeWidth="2" />
            <line x1="44" y1="80" x2="132" y2="80" stroke="#38BDF8" strokeWidth="2" />
            <line x1="44" y1="115" x2="132" y2="115" stroke="#38BDF8" strokeWidth="2" />
            <line x1="44" y1="148" x2="132" y2="148" stroke="#38BDF8" strokeWidth="2" />
            <text x="88" y="102" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="800">
              1000L TANK
            </text>
            {/* Chrome Faucet & Shower */}
            <path d="M180 165 L180 70 Q180 42 215 42 L245 42 L245 62" fill="none" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />
            <ellipse cx="245" cy="68" rx="26" ry="8" fill="#94A3B8" stroke="#F8FAFC" strokeWidth="2" />
            <line x1="232" y1="80" x2="228" y2="115" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="245" y1="80" x2="245" y2="120" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="258" y1="80" x2="262" y2="115" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" />
            {/* Washbasin */}
            <path d="M162 152 L276 152 Q270 188 219 188 Q168 188 162 152 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <text x="219" y="174" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="800">
              SPARSH PEARL
            </text>
          </svg>
        </div>
      );

    case 'wires-and-pipes':
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/50 flex items-center justify-center p-5"
        >
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-48">
            {/* PVC Pipes */}
            <rect x="34" y="54" width="140" height="22" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
            <rect x="34" y="84" width="155" height="22" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
            <rect x="34" y="114" width="130" height="22" rx="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
            {/* Copper Wire Coil */}
            <circle cx="228" cy="115" r="54" fill="none" stroke="#EA580C" strokeWidth="16" />
            <circle cx="228" cy="115" r="38" fill="none" stroke="#F59E0B" strokeWidth="10" />
            <rect x="184" y="102" width="88" height="26" rx="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="228" y="119" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="800">
              HAVELLS 10-12MM
            </text>
          </svg>
        </div>
      );

    case 'paints-and-putty':
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center p-5"
        >
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-48">
            {/* Paint Bucket */}
            <rect x="52" y="56" width="102" height="122" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <path d="M52 76 Q103 102 154 76" fill="none" stroke="#F59E0B" strokeWidth="8" />
            <rect x="64" y="96" width="78" height="44" rx="6" fill="#EA580C" />
            <text x="103" y="116" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
              BIRLA OPUS
            </text>
            <text x="103" y="131" textAnchor="middle" fill="#FEF3C7" fontSize="9" fontWeight="700">
              20L EMULSION
            </text>
            {/* Putty Bag */}
            <rect x="174" y="72" width="96" height="106" rx="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            <text x="222" y="116" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="800">
              WALL CARE
            </text>
            <text x="222" y="134" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="700">
              WHITE PUTTY 40KG
            </text>
          </svg>
        </div>
      );

    case 'sardar-solar-jhatka':
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 flex items-center justify-center p-5"
        >
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-48">
            {/* Solar Panel */}
            <polygon points="36,56 146,40 162,146 52,162" fill="#0284C7" stroke="#E2E8F0" strokeWidth="3" />
            <line x1="91" y1="48" x2="107" y2="154" stroke="#7DD3FC" strokeWidth="1.5" />
            <line x1="42" y1="92" x2="152" y2="76" stroke="#7DD3FC" strokeWidth="1.5" />
            <line x1="47" y1="126" x2="157" y2="110" stroke="#7DD3FC" strokeWidth="1.5" />
            {/* Energizer Box */}
            <rect x="180" y="58" width="104" height="114" rx="8" fill="#DC2626" stroke="#FCA5A5" strokeWidth="2" />
            <rect x="192" y="72" width="80" height="32" rx="4" fill="#0F172A" />
            <text x="232" y="92" textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="800">
              SARDAR 1200
            </text>
            <text x="232" y="128" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">
              SOLAR JHATKA
            </text>
            <text x="232" y="146" textAnchor="middle" fill="#FEF08A" fontSize="9" fontWeight="700">
              ISO CERTIFIED
            </text>
          </svg>
        </div>
      );

    case 'tiger-power-sprayer':
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-950 via-amber-950/60 to-slate-900 flex items-center justify-center p-5"
        >
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-48">
            {/* Frame */}
            <rect x="48" y="156" width="224" height="14" rx="4" fill="#F59E0B" />
            {/* Engine Block */}
            <rect x="64" y="76" width="96" height="80" rx="8" fill="#DC2626" stroke="#F8FAFC" strokeWidth="2" />
            <text x="112" y="114" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800">
              TIGER 7.5 HP
            </text>
            <text x="112" y="132" textAnchor="middle" fill="#FEF08A" fontSize="9" fontWeight="700">
              POWER SPRAYER
            </text>
            {/* Brass Pump & Hose Reel */}
            <circle cx="222" cy="112" r="42" fill="none" stroke="#FACC15" strokeWidth="14" />
            <circle cx="222" cy="112" r="18" fill="#475569" stroke="#F8FAFC" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'submersible-pumps-starters':
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 flex items-center justify-center p-5"
        >
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-48">
            {/* Submersible Cylinder */}
            <rect x="68" y="28" width="52" height="164" rx="12" fill="#CBD5E1" stroke="#F8FAFC" strokeWidth="2" />
            <rect x="68" y="64" width="52" height="24" fill="#0284C7" />
            <rect x="68" y="116" width="52" height="16" fill="#475569" />
            <text x="94" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800">
              HI-TECH/TARO
            </text>
            {/* Sonex Starter Box */}
            <rect x="158" y="52" width="110" height="124" rx="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="192" cy="90" r="14" fill="#F8FAFC" stroke="#475569" strokeWidth="2" />
            <circle cx="234" cy="90" r="14" fill="#F8FAFC" stroke="#475569" strokeWidth="2" />
            <circle cx="196" cy="138" r="10" fill="#16A34A" />
            <circle cx="230" cy="138" r="10" fill="#DC2626" />
            <text x="213" y="164" textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="800">
              SONEX STARTER
            </text>
          </svg>
        </div>
      );

    default:
      return (
        <div
          role="img"
          aria-label={title}
          className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="w-16 h-16 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3">
            <span className="text-amber-400 font-display font-bold text-xl">SBM</span>
          </div>
          <p className="text-slate-100 font-semibold text-sm line-clamp-2 max-w-[220px]">{title}</p>
          <span className="text-amber-400 text-xs mt-1 font-mono-num">Shyam Building Material</span>
        </div>
      );
  }
};
