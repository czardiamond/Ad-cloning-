import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Music, 
  Play, 
  CheckCircle2, 
  X, 
  Zap, 
  Share2, 
  TrendingUp, 
  Volume2, 
  Radio,
  ArrowRight
} from 'lucide-react';

interface TrendJackGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBrand: string;
  onApplyTrendScript: (headline: string, desc: string) => void;
}

export const TrendJackGeneratorModal: React.FC<TrendJackGeneratorModalProps> = ({
  isOpen,
  onClose,
  targetBrand,
  onApplyTrendScript
}) => {
  const [selectedTrend, setSelectedTrend] = useState<string>('trend-1');

  const [trends] = useState([
    {
      id: 'trend-1',
      title: 'POV: You Stopped Wasting Money on Standard Options',
      audioTitle: 'CapCut High-Velocity Transition Beats (2026 Viral)',
      usesCount: '1.4M Reels',
      viralScore: 98,
      suggestedHeadline: `POV: You Switched to ${targetBrand || 'Our Brand'} and Saved 10 Hours a Week`,
      scriptKeyframes: [
        '00:00 - FRUSTRATION: Person looking stressed at computer',
        '00:01 - BASS DROP: Zoom in fast on product screen',
        '00:02 - EUPHORIA: Instant smile & 1-click outcome'
      ]
    },
    {
      id: 'trend-2',
      title: 'Stop Scrolling: The Secret Top 1% Don\'t Tell You',
      audioTitle: 'Dramatic Suspense Audio - TikTok Trend',
      usesCount: '890K Videos',
      viralScore: 94,
      suggestedHeadline: `The #1 Industry Secret ${targetBrand || 'This Brand'} Uses to Scale 5x Faster`,
      scriptKeyframes: [
        '00:00 - HOOK: "If you buy anything this month, watch this first."',
        '00:01.5 - REVEAL: Unboxing product with macro camera focus',
        '00:03 - OFFER: Flash 25% discount code on screen'
      ]
    },
    {
      id: 'trend-3',
      title: 'Pedro Pedro Meme / High Energy Celebration Loop',
      audioTitle: 'Upbeat Techno Remix (Global #1)',
      usesCount: '3.2M TikToks',
      viralScore: 99,
      suggestedHeadline: `When ${targetBrand || 'Our Product'} Arrives in the Mail: Absolute Pure Joy`,
      scriptKeyframes: [
        '00:00 - DANCE: Mascot or creator dancing with product box',
        '00:02 - CUT: Fast montage of 5 happy customer reviews'
      ]
    }
  ]);

  if (!isOpen) return null;

  const activeTrendObj = trends.find(t => t.id === selectedTrend) || trends[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-4xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-rose-500 via-purple-500 to-indigo-500 text-white rounded-2xl shadow-lg">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Real-Time TikTok & Reels Trend-Jack Engine
                <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded-full">
                  Updated Hourly
                </span>
              </h3>
              <p className="text-xs text-[#8E918F]">
                Hijack viral audio clips & trending meme formats to give your brand instant viral reach.
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Trends List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {trends.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedTrend(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedTrend === item.id
                    ? 'bg-gradient-to-b from-rose-950/40 to-purple-950/20 border-rose-500/50 ring-2 ring-rose-500/30'
                    : 'bg-[#222222] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-bold text-[9px] rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Score {item.viralScore}
                  </span>
                  <span className="text-[10px] text-[#8E918F] font-mono">{item.usesCount}</span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-2">{item.title}</h4>
                <p className="text-[10px] text-[#A8C7FA] flex items-center gap-1">
                  <Music className="w-3 h-3" /> {item.audioTitle}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Trend Script Deconstruction */}
          <div className="p-5 bg-[#222222] border border-white/5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" /> AI Trend-Jacked Script for {targetBrand || 'Brand'}
              </span>
              <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Audio Beat Matched
              </span>
            </div>

            <div className="p-3 bg-[#181818] rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-[#8E918F] uppercase font-bold">Generated Viral Headline</span>
              <p className="text-sm font-black text-white">{activeTrendObj.suggestedHeadline}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#8E918F] uppercase font-bold block">Keyframe Beat Breakdown</span>
              {activeTrendObj.scriptKeyframes.map((kf, idx) => (
                <div key={idx} className="p-3 bg-[#181818] rounded-xl border border-white/5 text-xs text-[#E2E2E2] font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {kf}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                onApplyTrendScript(activeTrendObj.suggestedHeadline, `Trend-jacked script based on ${activeTrendObj.title}`);
                onClose();
              }}
              className="w-full py-3 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600 text-white font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Load Trend-Jack Script onto Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendJackGeneratorModal;
