import React, { useState } from 'react';
import { Flame, Sparkles, AlertTriangle, CheckCircle2, Zap, RefreshCw, X, ArrowRight, Skull, Lightbulb, ShieldAlert } from 'lucide-react';

interface AIAdRoasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBrand: string;
  headline: string;
  description: string;
  mediaType: string;
  onApplyFix: (newHeadline: string, newBrand: string, newDesc: string) => void;
}

export const AIAdRoasterModal: React.FC<AIAdRoasterModalProps> = ({
  isOpen,
  onClose,
  targetBrand,
  headline,
  description,
  mediaType,
  onApplyFix
}) => {
  const [isRoasting, setIsRoasting] = useState(false);
  const [roastScore, setRoastScore] = useState(58);

  const [roasts, setRoasts] = useState([
    {
      title: 'Weak Scroll-Stopper Hook',
      roast: `"${headline || 'Your headline'}" sounds like a template written by a robot on zero caffeine. Nobody scrolling Instagram at 1 AM will stop for this.`,
      fixSuggestion: `Stop scrolling: The real reason ${targetBrand || 'brands'} double their ROAS in 14 days`,
      category: 'Hook Intensity'
    },
    {
      title: 'Generic Vague Brand Framing',
      roast: `You named the brand "${targetBrand || 'Brand'}" but haven't specified the key benefit. Why should a stranger care?`,
      fixSuggestion: `${targetBrand || 'Brand'} Premium Edition: Engineered for maximum performance`,
      category: 'Brand Value'
    },
    {
      title: 'Lacks Direct Conversion Urgency',
      roast: `Where is the urgency? Leaving an ad without a countdown or limited release angle is throwing ad budget into a black hole.`,
      fixSuggestion: `Claim Exclusive 30% Off Access • Only 15 Units Left Today`,
      category: 'CTA & Urgency'
    }
  ]);

  if (!isOpen) return null;

  const handleReRoast = () => {
    setIsRoasting(true);
    setTimeout(() => {
      setIsRoasting(false);
      setRoastScore(74);
      setRoasts([
        {
          title: 'Hyper-Targeted Emotional Trigger',
          roast: `Better, but we can make it punchier. Add a POV framing or a relatable frustration angle.`,
          fixSuggestion: `POV: You stopped wasting ad spend on boring copy`,
          category: 'Emotional Hook'
        },
        {
          title: 'High-Contrast Value Proposition',
          roast: `Ensure your brand offer shines above competitors.`,
          fixSuggestion: `${targetBrand || 'Brand'}: The #1 rated choice by over 25,000 creators`,
          category: 'Social Proof'
        }
      ]);
    }, 1200);
  };

  const handleApplyAllFixes = () => {
    const bestFix = roasts[0]?.fixSuggestion || `Why ${targetBrand} is taking over social feeds`;
    onApplyFix(bestFix, targetBrand, `AI Optimized Campaign Brief for ${targetBrand}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-3xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-rose-500 via-red-500 to-orange-500 text-white rounded-2xl shadow-lg">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Brutal AI Ad Roaster & Brand Auditor
                <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded-full">
                  Unfiltered Critique
                </span>
              </h3>
              <p className="text-xs text-[#8E918F]">
                Get raw, honest, conversion-focused roasts of your ad creative with 1-click instant fixes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Header */}
        <div className="px-6 py-4 bg-[#222222] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-1.5 bg-[#181818] rounded-2xl border border-white/5">
              <span className="text-[10px] text-[#8E918F] block uppercase font-bold">Creative Strength Score</span>
              <span className="text-2xl font-black text-rose-400">{roastScore}/100</span>
            </div>
            <div className="text-xs text-[#C4C7C5]">
              <span className="font-bold text-white block">Audit Status: Needs Conversion Polish</span>
              <span className="text-[11px] text-[#8E918F]">3 critical conversion weaknesses identified in current ad draft.</span>
            </div>
          </div>

          <button
            onClick={handleReRoast}
            disabled={isRoasting}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRoasting ? 'animate-spin' : ''}`} /> Re-Roast Draft
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {roasts.map((item, idx) => (
            <div key={idx} className="p-5 bg-[#222222] border border-white/5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Skull className="w-4 h-4 text-rose-500" /> {item.title}
                </span>
                <span className="px-2 py-0.5 bg-white/5 text-[10px] text-[#8E918F] rounded-full font-mono">
                  {item.category}
                </span>
              </div>

              {/* The Roast */}
              <p className="text-xs text-[#E2E2E2] italic bg-[#181818] p-3 rounded-xl border border-rose-500/20 leading-relaxed">
                "{item.roast}"
              </p>

              {/* The AI Fix Recommendation */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" /> High-Converting AI Prescription
                </span>
                <p className="text-xs text-emerald-200 font-semibold">{item.fixSuggestion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with 1-Click Fix */}
        <div className="p-5 bg-[#1E1E1E] border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-[#8E918F] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> Auto-Fix applies prescription copy directly to canvas
          </span>
          <button
            onClick={handleApplyAllFixes}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Apply AI Prescription Fixes (1-Click)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdRoasterModal;
