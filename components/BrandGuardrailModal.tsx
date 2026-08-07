import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Check, X, Palette, Type, AlertTriangle, Sparkles, Sliders, RefreshCw, Lock, Unlock } from 'lucide-react';

interface BrandGuardrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  currentFont: string;
  currentBgColor: string;
  currentTextColor: string;
  currentCtaColor: string;
  onApplyBrandFixes: (fixes: { font?: string; bgColor?: string; textColor?: string; ctaColor?: string }) => void;
  isGuardrailEnabled: boolean;
  onToggleGuardrail: (enabled: boolean) => void;
}

const AUTHORIZED_PALETTE = [
  { name: 'Primary Tech Blue', hex: '#A8C7FA' },
  { name: 'Deep Navy Studio', hex: '#003355' },
  { name: 'Neon Cyber Violet', hex: '#D0BCFF' },
  { name: 'Dark Studio Canvas', hex: '#121212' },
  { name: 'High-Converting Emerald', hex: '#34D399' },
  { name: 'Pure Contrast White', hex: '#FFFFFF' }
];

const AUTHORIZED_FONTS = [
  "Inter, sans-serif",
  "'Plus Jakarta Sans', sans-serif",
  "'Playfair Display', serif",
  "'Space Grotesk', sans-serif"
];

export const BrandGuardrailModal: React.FC<BrandGuardrailModalProps> = ({
  isOpen,
  onClose,
  brandName,
  currentFont,
  currentBgColor,
  currentTextColor,
  currentCtaColor,
  onApplyBrandFixes,
  isGuardrailEnabled,
  onToggleGuardrail
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'guidelines'>('audit');

  if (!isOpen) return null;

  // Audit logic
  const isFontAuthorized = AUTHORIZED_FONTS.some(f => f.toLowerCase().includes(currentFont.toLowerCase()) || currentFont.toLowerCase().includes(f.toLowerCase().split(',')[0].replace(/['"]/g, '')));
  const isBgAuthorized = AUTHORIZED_PALETTE.some(p => p.hex.toLowerCase() === currentBgColor.toLowerCase());
  const isTextAuthorized = AUTHORIZED_PALETTE.some(p => p.hex.toLowerCase() === currentTextColor.toLowerCase());
  const isCtaAuthorized = AUTHORIZED_PALETTE.some(p => p.hex.toLowerCase() === currentCtaColor.toLowerCase());

  const totalChecks = 4;
  const passedChecks = (isFontAuthorized ? 1 : 0) + (isBgAuthorized ? 1 : 0) + (isTextAuthorized ? 1 : 0) + (isCtaAuthorized ? 1 : 0);
  const complianceScore = Math.round((passedChecks / totalChecks) * 100);

  const handleAutoAlign = () => {
    onApplyBrandFixes({
      font: "'Plus Jakarta Sans', sans-serif",
      bgColor: "#121212",
      textColor: "#FFFFFF",
      ctaColor: "#A8C7FA"
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-2xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${isGuardrailEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#E2E2E2]">Brand Guardrails</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isGuardrailEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                }`}>
                  {isGuardrailEnabled ? 'Enforcement Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-[#8E918F]">Verify authorized brand palette & typography before exporting</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
                activeTab === 'audit'
                  ? 'border-[#A8C7FA] text-[#A8C7FA] bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Creative Audit & Compliance
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
                activeTab === 'guidelines'
                  ? 'border-[#A8C7FA] text-[#A8C7FA] bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Authorized Palette & Rules
            </button>
          </div>

          {/* Toggle Guardrail Enforcement Switch */}
          <button
            onClick={() => onToggleGuardrail(!isGuardrailEnabled)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
              isGuardrailEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {isGuardrailEnabled ? <Lock className="w-3.5 h-3.5 text-emerald-400" /> : <Unlock className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isGuardrailEnabled ? 'Guardrail ON' : 'Turn Guardrail ON'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {activeTab === 'audit' ? (
            <div className="space-y-6">
              {/* Compliance Score Header Box */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between ${
                complianceScore === 100
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : complianceScore >= 75
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border shadow-inner ${
                    complianceScore === 100 ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-amber-500 text-black border-amber-400'
                  }`}>
                    {complianceScore}%
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {complianceScore === 100 ? '100% Brand Compliant' : `${complianceScore}% Compliance - Action Recommended`}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {complianceScore === 100
                        ? `All fonts, background tones, and call-to-actions match ${brandName}'s design system.`
                        : `Some visual elements diverge from ${brandName}'s official brand guidelines.`}
                    </p>
                  </div>
                </div>

                {complianceScore < 100 && (
                  <button
                    onClick={handleAutoAlign}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-2 flex-shrink-0"
                  >
                    <Sparkles className="w-4 h-4" /> 1-Click Auto-Fix
                  </button>
                )}
              </div>

              {/* Individual Guardrail Checks */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guardrail Checklist Items</h5>

                {/* Font Check */}
                <div className="p-3.5 bg-[#222222] border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/15 text-purple-400 rounded-xl">
                      <Type className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Typography Font Family</span>
                        <span className="text-[11px] font-mono text-slate-400">({currentFont})</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isFontAuthorized ? 'Matches authorized typography guidelines' : 'Non-standard font detected'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isFontAuthorized ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isFontAuthorized ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {isFontAuthorized ? 'Passed' : 'Warning'}
                  </span>
                </div>

                {/* Background Color Check */}
                <div className="p-3.5 bg-[#222222] border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl border border-white/20 shadow-inner flex-shrink-0" style={{ backgroundColor: currentBgColor }} />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Background Color Palette</span>
                        <span className="text-[11px] font-mono text-slate-400">({currentBgColor})</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isBgAuthorized ? 'Authorized canvas background shade' : 'Color not in authorized brand palette'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isBgAuthorized ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isBgAuthorized ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {isBgAuthorized ? 'Passed' : 'Warning'}
                  </span>
                </div>

                {/* Text Color Check */}
                <div className="p-3.5 bg-[#222222] border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl border border-white/20 shadow-inner flex-shrink-0" style={{ backgroundColor: currentTextColor }} />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Headline & Body Color</span>
                        <span className="text-[11px] font-mono text-slate-400">({currentTextColor})</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isTextAuthorized ? 'Authorized high-contrast text color' : 'Custom unverified text color'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isTextAuthorized ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isTextAuthorized ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {isTextAuthorized ? 'Passed' : 'Warning'}
                  </span>
                </div>

                {/* CTA Color Check */}
                <div className="p-3.5 bg-[#222222] border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl border border-white/20 shadow-inner flex-shrink-0" style={{ backgroundColor: currentCtaColor }} />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>CTA Button Accent</span>
                        <span className="text-[11px] font-mono text-slate-400">({currentCtaColor})</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isCtaAuthorized ? 'Authorized call-to-action color' : 'Custom CTA color shade'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isCtaAuthorized ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isCtaAuthorized ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {isCtaAuthorized ? 'Passed' : 'Warning'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Authorized Palette Grid */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Authorized Brand Colors ({brandName})</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AUTHORIZED_PALETTE.map((color) => (
                    <div key={color.hex} className="p-3 bg-[#222222] border border-white/5 rounded-2xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl border border-white/20 shadow-inner" style={{ backgroundColor: color.hex }} />
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">{color.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{color.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authorized Typography */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Brand Fonts</h5>
                <div className="space-y-2">
                  {AUTHORIZED_FONTS.map((font) => (
                    <div key={font} className="p-3 bg-[#222222] border border-white/5 rounded-2xl flex items-center justify-between">
                      <span className="text-sm text-white font-medium" style={{ fontFamily: font }}>{font.split(',')[0].replace(/['"]/g, '')}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold uppercase">Approved</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/5 bg-[#1E1E1E] flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guardrail status is remembered across exports</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] font-bold text-xs rounded-xl transition-all shadow-md"
          >
            Done & Return to Studio
          </button>
        </div>

      </div>
    </div>
  );
};
