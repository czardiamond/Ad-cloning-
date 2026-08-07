import React, { useState } from 'react';
import { Zap, Sparkles, TrendingUp, Layers, Check, X, RefreshCw, BarChart2 } from 'lucide-react';
import { HookVariation } from '../types';

interface MultiHookGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  onApplyHookVariation?: (variation: HookVariation) => void;
}

const DEFAULT_HOOKS: HookVariation[] = [
  {
    id: 'hook-1',
    hookType: 'Pattern Interrupt',
    headlineText: 'Stop Scrolling! This Changes Everything.',
    first3SecScript: 'Wait—before you buy another generic tool, look at how this AI workflow cuts 4 hours off your ad setup.',
    colorGradeFilter: 'High Contrast Neon Punch',
    audioDropStyle: 'Fast Sub-Bass Drop',
    predictedCtr: 4.8,
    predictedCpa: '$11.20'
  },
  {
    id: 'hook-2',
    hookType: 'Pain Point Question',
    headlineText: 'Tired of High Facebook Ad Costs?',
    first3SecScript: 'Are your Meta ad campaign ROAS dropping every single week? Here is the exact creative strategy top brands use.',
    colorGradeFilter: 'Cinematic Warm Gold',
    audioDropStyle: 'Dramatic Risers & Beat',
    predictedCtr: 4.2,
    predictedCpa: '$12.80'
  },
  {
    id: 'hook-3',
    hookType: 'Unboxing Curiosity',
    headlineText: 'Unboxing What 100k Brands Keep Secret...',
    first3SecScript: 'I finally received this package in the mail today and tested it live for 30 days. Here are the results.',
    colorGradeFilter: 'Clean Studio Neutral',
    audioDropStyle: 'Lo-Fi Chill Beat',
    predictedCtr: 3.9,
    predictedCpa: '$14.10'
  },
  {
    id: 'hook-4',
    hookType: 'Bold Social Proof',
    headlineText: 'Over 50,000 Ads Generated This Month',
    first3SecScript: 'Why are 50,000 agency marketers switching to automated AI video variations? Let us break down the ROI numbers.',
    colorGradeFilter: 'Cool Cyan Tech Grade',
    audioDropStyle: 'Energetic Electro Synth',
    predictedCtr: 4.5,
    predictedCpa: '$11.90'
  },
  {
    id: 'hook-5',
    hookType: 'FOMO Urgency',
    headlineText: 'Last Chance: 70% Off Annual Pass',
    first3SecScript: 'The promotional campaign ends at midnight tonight. Claim your lifetime AI ad creative workspace now.',
    colorGradeFilter: 'Vivid Red Highlight',
    audioDropStyle: 'Ticker Timer Beat',
    predictedCtr: 5.1,
    predictedCpa: '$9.80'
  }
];

const MultiHookGeneratorModal: React.FC<MultiHookGeneratorModalProps> = ({
  isOpen,
  onClose,
  brandName,
  onApplyHookVariation
}) => {
  const [selectedHook, setSelectedHook] = useState<HookVariation>(DEFAULT_HOOKS[0]);
  const [isGeneratingMatrix, setIsGeneratingMatrix] = useState(false);
  const [matrixGeneratedNotice, setMatrixGeneratedNotice] = useState(false);

  if (!isOpen) return null;

  const handleGenerateMatrix = () => {
    setIsGeneratingMatrix(true);
    setTimeout(() => {
      setIsGeneratingMatrix(false);
      setMatrixGeneratedNotice(true);
      setTimeout(() => setMatrixGeneratedNotice(false), 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-4xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D0BCFF] text-[#381E72] rounded-full">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#E2E2E2]">Automated Multi-Hook A/B Test Generator</h3>
              <p className="text-xs text-[#8E918F]">Generate 5 psychological hook variations with predictive CTR/CPA performance scores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-[#222222] p-4 rounded-2xl border border-white/5">
            <div className="text-xs text-[#C4C7C5]">
              Target Brand: <span className="font-bold text-[#D0BCFF]">{brandName || 'Master Campaign'}</span>
            </div>
            <button
              onClick={handleGenerateMatrix}
              disabled={isGeneratingMatrix}
              className="px-4 py-2 bg-[#D0BCFF] text-[#381E72] rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:bg-[#A8C7FA]"
            >
              {isGeneratingMatrix ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isGeneratingMatrix ? 'Generating 5 Variations...' : matrixGeneratedNotice ? 'Matrix Ready!' : 'Re-Generate AI Variations'}
            </button>
          </div>

          {/* Hook Matrix List */}
          <div className="space-y-3">
            {DEFAULT_HOOKS.map((hook) => {
              const isSelected = selectedHook.id === hook.id;
              return (
                <div
                  key={hook.id}
                  onClick={() => setSelectedHook(hook)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative ${
                    isSelected
                      ? 'bg-[#282828] border-[#D0BCFF] ring-2 ring-[#D0BCFF]/30'
                      : 'bg-[#222222] border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#381E72] text-[#D0BCFF] font-bold rounded-md text-[10px] uppercase tracking-wider">
                        {hook.hookType}
                      </span>
                      <span className="text-sm font-bold text-[#E2E2E2]">{hook.headlineText}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Est. CTR: {hook.predictedCtr}%
                      </span>
                      <span className="text-[#A8C7FA] font-bold">
                        Target CPA: {hook.predictedCpa}
                      </span>
                    </div>
                  </div>

                  {/* First 3 Seconds Script */}
                  <div className="text-xs text-[#C4C7C5] italic bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                    "{hook.first3SecScript}"
                  </div>

                  {/* Audio & Visual Specs */}
                  <div className="flex items-center justify-between text-[10px] text-[#8E918F] pt-1">
                    <span>Color Grade: <strong className="text-[#E2E2E2]">{hook.colorGradeFilter}</strong></span>
                    <span>Audio Drop: <strong className="text-[#E2E2E2]">{hook.audioDropStyle}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1E1E1E] flex items-center justify-between">
          <div className="text-xs text-[#8E918F]">
            Select hook variation to load into timeline
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-[#8E918F] hover:text-white rounded-full text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onApplyHookVariation) onApplyHookVariation(selectedHook);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#D0BCFF] hover:bg-[#A8C7FA] text-[#381E72] rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg"
            >
              <Check className="w-4 h-4" /> Apply Hook ({selectedHook.hookType})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiHookGeneratorModal;
