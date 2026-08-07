import React, { useState } from 'react';
import { ABBattleVariant } from '../types';
import { Swords, Trophy, Flame, TrendingUp, Sparkles, CheckCircle2, RefreshCw, X, ArrowRight, Target, Zap, ShieldAlert } from 'lucide-react';

interface ABBattleArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHeadline: string;
  currentBrand: string;
  onApplyWinner: (winningHeadline: string) => void;
}

export const ABBattleArenaModal: React.FC<ABBattleArenaModalProps> = ({
  isOpen,
  onClose,
  currentHeadline,
  currentBrand,
  onApplyWinner
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>('variant-a');

  const [variantA, setVariantA] = useState<ABBattleVariant>({
    id: 'variant-a',
    name: 'Variant A (Control - Current)',
    headline: currentHeadline || 'Unleash Your Creative Potential',
    hookStyle: 'Direct Problem/Solution',
    ctaText: 'Shop Now • 20% Off',
    predictedCTR: 3.42,
    thumbStopRate: 64.5,
    conversionLift: '+18%',
    viralScore: 78,
    winningReason: 'High baseline clarity and established brand pattern.'
  });

  const [variantB, setVariantB] = useState<ABBattleVariant>({
    id: 'variant-[#2]',
    name: 'Variant B (AI Viral Hook Variant)',
    headline: `Stop Scrolling: Why ${currentBrand || 'Top Brands'} Are Switching to This Strategy`,
    hookStyle: 'Curiosity Loop & FOMO',
    ctaText: 'Claim Free Trial Today',
    predictedCTR: 5.89,
    thumbStopRate: 84.2,
    conversionLift: '+42%',
    viralScore: 94,
    winningReason: 'Strong emotional trigger in first 1.5 seconds increases thumb-stop rate by 31% on Meta & TikTok Reels.'
  });

  if (!isOpen) return null;

  const handleRunSim = () => {
    setIsSimulating(true);
    setWinnerId(null);
    setTimeout(() => {
      setIsSimulating(false);
      setWinnerId('variant-b');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-4xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-red-500 text-white rounded-2xl shadow-lg">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                A/B Variant Battle Arena & AI Simulator
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full">
                  Predictive Predictive Engine
                </span>
              </h3>
              <p className="text-xs text-[#8E918F]">
                Simulate audience thumb-stop rates, CTR, and conversion lift before launching ad budget.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Action Simulation Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#222222] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2 text-xs text-[#C4C7C5]">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Simulated Target Platform: <strong className="text-white font-bold">Meta Ads, TikTok & YouTube Shorts</strong></span>
            </div>
            <button
              onClick={handleRunSim}
              disabled={isSimulating}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Simulated 100,000 Impressions...
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" /> Run AI Battle Simulation
                </>
              )}
            </button>
          </div>

          {/* Arena Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* VARIANT A */}
            <div
              className={`p-5 rounded-3xl border transition-all space-y-4 relative ${
                winnerId === 'variant-a'
                  ? 'bg-emerald-950/20 border-emerald-500/50 ring-2 ring-emerald-500/30'
                  : 'bg-[#222222] border-white/5'
              }`}
            >
              {winnerId === 'variant-a' && (
                <span className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-black font-extrabold text-[10px] rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5" /> Simulation Winner
                </span>
              )}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono">A</span>
                  {variantA.name}
                </h4>
                <span className="text-[10px] font-mono text-[#8E918F]">{variantA.hookStyle}</span>
              </div>

              <div className="p-3 bg-[#181818] rounded-2xl border border-white/5 space-y-2">
                <span className="text-[10px] text-[#8E918F] font-bold uppercase">Headline Copy</span>
                <input
                  type="text"
                  value={variantA.headline}
                  onChange={(e) => setVariantA({ ...variantA, headline: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-[#181818] rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8E918F] block">Predicted CTR</span>
                  <span className="text-lg font-black text-amber-400">{variantA.predictedCTR}%</span>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8E918F] block">Thumb-Stop</span>
                  <span className="text-lg font-black text-sky-400">{variantA.thumbStopRate}%</span>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8E918F] block">Viral Score</span>
                  <span className="text-lg font-black text-purple-400">{variantA.viralScore}/100</span>
                </div>
              </div>

              {winnerId === 'variant-a' && (
                <button
                  onClick={() => {
                    onApplyWinner(variantA.headline);
                    onClose();
                  }}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Apply Variant A to Active Canvas
                </button>
              )}
            </div>

            {/* VARIANT B */}
            <div
              className={`p-5 rounded-3xl border transition-all space-y-4 relative ${
                winnerId === 'variant-b'
                  ? 'bg-emerald-950/20 border-emerald-500/50 ring-2 ring-emerald-500/30'
                  : 'bg-[#222222] border-white/5'
              }`}
            >
              {winnerId === 'variant-b' && (
                <span className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-black font-extrabold text-[10px] rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5" /> Simulation Winner (+72% Lift)
                </span>
              )}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xs font-mono font-bold text-white">B</span>
                  {variantB.name}
                </h4>
                <span className="text-[10px] font-mono text-amber-400 font-bold">{variantB.hookStyle}</span>
              </div>

              <div className="p-3 bg-[#181818] rounded-2xl border border-white/5 space-y-2">
                <span className="text-[10px] text-[#8E918F] font-bold uppercase">Headline Copy</span>
                <input
                  type="text"
                  value={variantB.headline}
                  onChange={(e) => setVariantB({ ...variantB, headline: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-[#181818] rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8E918F] block">Predicted CTR</span>
                  <span className="text-lg font-black text-amber-400">{variantB.predictedCTR}%</span>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8E918F] block">Thumb-Stop</span>
                  <span className="text-lg font-black text-sky-400">{variantB.thumbStopRate}%</span>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8E918F] block">Viral Score</span>
                  <span className="text-lg font-black text-purple-400">{variantB.viralScore}/100</span>
                </div>
              </div>

              {winnerId === 'variant-b' && (
                <button
                  onClick={() => {
                    onApplyWinner(variantB.headline);
                    onClose();
                  }}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Apply Variant B to Active Canvas
                </button>
              )}
            </div>
          </div>

          {/* AI Verdict Explanation */}
          <div className="p-5 bg-[#222222] border border-white/5 rounded-2xl space-y-2">
            <h5 className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Predictive Analytics Intelligence Report
            </h5>
            <p className="text-xs text-[#C4C7C5] leading-relaxed">
              Variant B outperforms Control by triggering curiosity within the initial 1.5 seconds. Its high-contrast hook phrasing increases predicted Meta & TikTok conversion efficiency by <strong className="text-emerald-400 font-bold">+42%</strong> while lowering customer acquisition cost (CAC).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABBattleArenaModal;
