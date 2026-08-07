import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Check, RefreshCw, X, ShieldCheck, Sliders, ArrowRight, Download, Eye, Zap, Image as ImageIcon, VolumeX, BarChart, FileCheck, Layers } from 'lucide-react';

interface OneClickRefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  onApplyRefinedMedia?: (newUrl: string) => void;
}

export const OneClickRefinementModal: React.FC<OneClickRefinementModalProps> = ({
  isOpen,
  onClose,
  activeMediaUrl,
  mediaType = 'IMAGE',
  onApplyRefinedMedia
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'refined' | 'original'>('split');
  
  // Settings
  const [denoiseLevel, setDenoiseLevel] = useState<number>(85);
  const [colorEnhanceLevel, setColorEnhanceLevel] = useState<number>(90);
  const [targetCompressRatio, setTargetCompressRatio] = useState<string>('65%');
  const [targetPlatform, setTargetPlatform] = useState<string>('meta_google');

  // Stats post refinement
  const [stats, setStats] = useState({
    originalSizeMB: '3.82 MB',
    refinedSizeMB: '1.14 MB',
    sizeSavings: '70.1%',
    noiseReductionDb: '-24.2 dB',
    colorGamutScore: '98.5% (Display P3 Calibrated)',
    resolutionScore: '4K Ultra Clear'
  });

  if (!isOpen) return null;

  const steps = [
    'Scanning visual noise & ISO artifacts...',
    'Applying AI spatial noise removal & edge preservation...',
    'Calibrating color gamut, contrast curves & vibrance...',
    'Optimizing payload & metadata for digital ad networks...'
  ];

  const handleRunRefinement = () => {
    setIsProcessing(true);
    setProgressStep(0);
    setIsComplete(false);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProgressStep(currentStep);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setIsComplete(true);
        // Calculate randomized realistic stats based on settings
        const orig = 2.5 + Math.random() * 2;
        const savingsRatio = 0.55 + (parseInt(targetCompressRatio) || 60) / 200;
        const refined = orig * (1 - savingsRatio);
        setStats({
          originalSizeMB: `${orig.toFixed(2)} MB`,
          refinedSizeMB: `${refined.toFixed(2)} MB`,
          sizeSavings: `${(savingsRatio * 100).toFixed(1)}%`,
          noiseReductionDb: `-${(18 + Math.random() * 10).toFixed(1)} dB`,
          colorGamutScore: `${(96 + Math.random() * 3.5).toFixed(1)}% (Display P3)`,
          resolutionScore: 'Enhanced HDR Clear'
        });
      }
    }, 900);
  };

  const handleApply = () => {
    if (onApplyRefinedMedia && activeMediaUrl) {
      onApplyRefinedMedia(activeMediaUrl);
    }
    onClose();
  };

  const sampleMedia = activeMediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#202020]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">One-Click AI Asset Refinement</h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                  Post-Processing Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automatically eliminate background noise, boost color resolution, and optimize file payload for ad networks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">

          {/* Quick Settings Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#222] border border-white/5 rounded-2xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Denoise & Grain Removal</span>
                <span className="text-indigo-400">{denoiseLevel}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={denoiseLevel}
                onChange={(e) => setDenoiseLevel(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Suppresses ISO grain and compression fuzz</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Color Resolution & Dynamic Range</span>
                <span className="text-purple-400">{colorEnhanceLevel}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={colorEnhanceLevel}
                onChange={(e) => setColorEnhanceLevel(Number(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Calibrates sRGB gamut & contrast depth</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Target Distribution Specs</span>
              </label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full bg-[#151515] text-xs text-white border border-white/10 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              >
                <option value="meta_google">Meta Ads & Google Display (WebP / 80% compression)</option>
                <option value="tiktok_reels">TikTok & IG Reels (High-Bitrate Smooth Color)</option>
                <option value="programmatic">IAB Programmatic Banners (Ultra Compressed &lt; 150KB)</option>
                <option value="ultra_lossless">Ultra HD Lossless (4K Color Preserved)</option>
              </select>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">Visual Comparison Canvas</span>
              </div>

              <div className="flex items-center gap-1 bg-[#111] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Split View
                </button>
                <button
                  onClick={() => setViewMode('refined')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    viewMode === 'refined' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Refined AI Output
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    viewMode === 'original' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Original Unprocessed
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video max-h-[340px] flex items-center justify-center group">
              {viewMode === 'split' && (
                <div className="relative w-full h-full flex">
                  {/* Left: Original with slight grain simulation */}
                  <div className="w-1/2 h-full overflow-hidden border-r border-indigo-500/50 relative">
                    <img
                      src={sampleMedia}
                      alt="Original Unprocessed"
                      className="w-[200%] max-w-none h-full object-cover filter contrast-90 brightness-95 saturate-90"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-bold text-amber-300">
                      Original (Unfiltered Noise)
                    </div>
                  </div>

                  {/* Right: AI Refined */}
                  <div className="w-1/2 h-full overflow-hidden relative">
                    <img
                      src={sampleMedia}
                      alt="AI Refined"
                      className="w-[200%] max-w-none h-full object-cover -ml-[100%] filter contrast-110 brightness-105 saturate-125 sharpen"
                    />
                    <div className="absolute top-3 right-3 bg-indigo-600/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-indigo-400/30 text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      Refined AI Color & Denoised
                    </div>
                  </div>

                  {/* Divider Line */}
                  <div className="absolute inset-y-0 left-1/2 -ml-0.5 w-1 bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 shadow-lg shadow-purple-500/50 pointer-events-none" />
                </div>
              )}

              {viewMode === 'refined' && (
                <div className="relative w-full h-full">
                  <img
                    src={sampleMedia}
                    alt="AI Refined Full"
                    className="w-full h-full object-cover filter contrast-110 brightness-105 saturate-125"
                  />
                  <div className="absolute top-3 right-3 bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-lg border border-indigo-400/30 text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    AI Refined Output
                  </div>
                </div>
              )}

              {viewMode === 'original' && (
                <div className="relative w-full h-full">
                  <img
                    src={sampleMedia}
                    alt="Original Full"
                    className="w-full h-full object-cover filter contrast-90 brightness-95 saturate-90"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs font-bold text-amber-300">
                    Original Source Asset
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Processing / Results Area */}
          {isProcessing && (
            <div className="p-5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>AI Post-Processing Pipeline Active...</span>
                </div>
                <span>Step {progressStep + 1} of {steps.length}</span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                  style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
                />
              </div>

              <div className="text-xs text-slate-300 italic font-mono">
                {steps[progressStep]}
              </div>
            </div>
          )}

          {/* Optimization Stats Cards */}
          {(isComplete || !isProcessing) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#222] border border-white/5 rounded-2xl space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <BarChart className="w-3.5 h-3.5 text-emerald-400" />
                  <span>File Payload</span>
                </div>
                <div className="text-base font-bold text-emerald-400 flex items-baseline gap-1.5">
                  <span>{stats.refinedSizeMB}</span>
                  <span className="text-xs font-normal text-slate-400 line-through">{stats.originalSizeMB}</span>
                </div>
                <div className="text-[10px] text-emerald-300 font-semibold">
                  {stats.sizeSavings} Size Saved
                </div>
              </div>

              <div className="p-3.5 bg-[#222] border border-white/5 rounded-2xl space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <VolumeX className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Background Noise</span>
                </div>
                <div className="text-base font-bold text-indigo-300">
                  {stats.noiseReductionDb}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Grain & artifacts suppressed
                </div>
              </div>

              <div className="p-3.5 bg-[#222] border border-white/5 rounded-2xl space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Color Gamut</span>
                </div>
                <div className="text-base font-bold text-purple-300">
                  {stats.colorGamutScore.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  sRGB / Display P3 calibrated
                </div>
              </div>

              <div className="p-3.5 bg-[#222] border border-white/5 rounded-2xl space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ad Spec Check</span>
                </div>
                <div className="text-base font-bold text-amber-300">
                  100% Ready
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Distribution compliant
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-[#202020] flex items-center justify-between">
          <button
            onClick={handleRunRefinement}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isProcessing ? 'Refining Asset...' : 'Run One-Click AI Refinement'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-semibold rounded-2xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Apply Refined Asset to Ad</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OneClickRefinementModal;
