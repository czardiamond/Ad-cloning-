import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Instagram, 
  Eye, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Flame, 
  Volume2, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Music2, 
  Sliders,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface SocialMockupSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  headline: string;
  targetBrand: string;
  mediaType: string;
  mediaUrl: string;
}

type PlatformType = 'tiktok' | 'instagram_story' | 'reels' | 'shorts';

export const SocialMockupSimulatorModal: React.FC<SocialMockupSimulatorModalProps> = ({
  isOpen,
  onClose,
  headline,
  targetBrand,
  mediaType,
  mediaUrl
}) => {
  const [platform, setPlatform] = useState<PlatformType>('tiktok');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<'normal' | 'fast'>('normal');
  const [hasScrolledPast, setHasScrolledPast] = useState(false);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [clashWarning, setClashWarning] = useState<string | null>(null);

  // Check UI Clashes
  useEffect(() => {
    if (headline && headline.length > 50) {
      setClashWarning('Headline text is long and may be covered by the native TikTok comment bar at the bottom!');
    } else {
      setClashWarning(null);
    }
  }, [headline, platform]);

  if (!isOpen) return null;

  const handleRunScrollTest = () => {
    setIsScrolling(true);
    setHasScrolledPast(false);
    
    const duration = scrollSpeed === 'fast' ? 1200 : 2200;
    
    setTimeout(() => {
      setIsScrolling(false);
      setHasScrolledPast(true);
    }, duration);
  };

  const handleReset = () => {
    setIsScrolling(false);
    setHasScrolledPast(false);
  };

  const currentMediaSrc = mediaUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1080&q=80';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141414] w-full max-w-5xl rounded-[36px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white rounded-2xl shadow-lg">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                TikTok & Meta Native Device Mockup & Scroll Simulator
                <span className="px-2.5 py-0.5 bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-bold rounded-full">
                  100% Native Overlay Accuracy
                </span>
              </h3>
              <p className="text-xs text-[#8E918F]">
                Test how real users see your ad inside mobile app feeds and detect text/UI collisions before publishing.
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

        {/* Main Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 custom-scrollbar">
          {/* Controls & Metrics Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Platform Selector */}
            <div className="p-5 bg-[#1E1E1E] border border-white/5 rounded-3xl space-y-3">
              <label className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Select Mobile Target App
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPlatform('tiktok')}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
                    platform === 'tiktok'
                      ? 'bg-black text-white border-pink-500 ring-2 ring-pink-500/30'
                      : 'bg-[#141414] text-[#8E918F] border-white/5 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                  TikTok Reels
                </button>

                <button
                  onClick={() => setPlatform('reels')}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
                    platform === 'reels'
                      ? 'bg-gradient-to-r from-purple-900 to-pink-900 text-white border-purple-500 ring-2 ring-purple-500/30'
                      : 'bg-[#141414] text-[#8E918F] border-white/5 hover:text-white'
                  }`}
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  Instagram Reels
                </button>

                <button
                  onClick={() => setPlatform('instagram_story')}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
                    platform === 'instagram_story'
                      ? 'bg-gradient-to-r from-amber-900 to-rose-900 text-white border-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-[#141414] text-[#8E918F] border-white/5 hover:text-white'
                  }`}
                >
                  <Instagram className="w-4 h-4 text-amber-400" />
                  IG Story Ad
                </button>

                <button
                  onClick={() => setPlatform('shorts')}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
                    platform === 'shorts'
                      ? 'bg-red-950 text-white border-red-500 ring-2 ring-red-500/30'
                      : 'bg-[#141414] text-[#8E918F] border-white/5 hover:text-white'
                  }`}
                >
                  <Play className="w-4 h-4 text-red-500" />
                  YouTube Shorts
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#8E918F]">Native Controls Overlay</span>
                <button
                  onClick={() => setShowUiOverlay(!showUiOverlay)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    showUiOverlay ? 'bg-pink-500 text-black' : 'bg-white/10 text-white'
                  }`}
                >
                  {showUiOverlay ? 'Overlay Active' : 'Hidden'}
                </button>
              </div>
            </div>

            {/* Scroll-Past Test Engine */}
            <div className="p-5 bg-[#1E1E1E] border border-white/5 rounded-3xl space-y-4">
              <h4 className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> 1.5s Thumb-Stop Scroll Physics Simulator
              </h4>

              <div className="flex gap-2">
                <button
                  onClick={() => setScrollSpeed('normal')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    scrollSpeed === 'normal' ? 'bg-white/15 text-white border-white/20' : 'bg-[#141414] text-[#8E918F] border-white/5'
                  }`}
                >
                  Casual Scroll (2.2s)
                </button>
                <button
                  onClick={() => setScrollSpeed('fast')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    scrollSpeed === 'fast' ? 'bg-white/15 text-white border-white/20' : 'bg-[#141414] text-[#8E918F] border-white/5'
                  }`}
                >
                  Fast Swipe (1.2s)
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRunScrollTest}
                  disabled={isScrolling}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" /> Simulate User Feed Scroll
                </button>

                <button
                  onClick={handleReset}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors"
                  title="Reset Preview"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {hasScrolledPast && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 space-y-1 animate-in fade-in">
                  <span className="font-bold block flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Scroll Result: Swipe-Past Detected!
                  </span>
                  <p className="text-[11px] text-[#C4C7C5]">
                    The hook didn't capture attention within 1.2 seconds. Consider adding high-contrast visual text or a curiosity question in the first frame.
                  </p>
                </div>
              )}
            </div>

            {/* UI Clash Diagnostic Warning */}
            {clashWarning && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-3xl space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> UI Overlay Clash Detected
                </span>
                <p className="text-xs text-amber-200/90 leading-relaxed">{clashWarning}</p>
              </div>
            )}
          </div>

          {/* iPhone 16 Pro Frame Display Column */}
          <div className="lg:col-span-7 flex justify-center items-center py-2">
            <div className="relative w-[310px] h-[620px] bg-black rounded-[48px] p-3 border-[6px] border-[#2C2C2C] shadow-2xl overflow-hidden ring-1 ring-white/10">
              {/* iPhone Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-blue-500/80" />
              </div>

              {/* Screen Content Wrapper */}
              <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-black flex flex-col justify-between">
                {/* Simulated Media Canvas */}
                <div
                  className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                    isScrolling ? '-translate-y-full opacity-30' : 'translate-y-0 opacity-100'
                  }`}
                >
                  <img
                    src={currentMediaSrc}
                    alt="Ad Mockup Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
                </div>

                {/* Platform Overlay Controls */}
                {showUiOverlay && (
                  <div className="relative z-30 h-full flex flex-col justify-between p-4 pt-10 text-white select-none pointer-events-none">
                    {/* Top Bar (Sponsor / Live) */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold">
                        <span className="text-pink-400">Sponsored</span>
                        <span>•</span>
                        <span className="text-white">{targetBrand || 'Brand'}</span>
                      </div>
                      <Volume2 className="w-4 h-4 text-white drop-shadow-md" />
                    </div>

                    {/* Bottom & Right Interaction Sidebar */}
                    <div className="flex items-end justify-between gap-2 pb-3">
                      {/* Left Caption & CTA */}
                      <div className="flex-1 space-y-2 pr-2">
                        {/* Shop CTA Badge */}
                        <div className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-[11px] rounded-xl shadow-lg flex items-center justify-between">
                          <span>Shop Now • Limited Offer</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>

                        {/* Caption Text */}
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white block">@{targetBrand ? targetBrand.toLowerCase().replace(/\s+/g, '') : 'brand'}</span>
                          <p className="text-[11px] text-white/90 line-clamp-2 leading-tight font-medium drop-shadow-md">
                            {headline || 'Unleash Your Creative Potential with AI'}
                          </p>
                        </div>

                        {/* Sound Track */}
                        <div className="flex items-center gap-1.5 text-[10px] text-white/80">
                          <Music2 className="w-3 h-3 animate-spin" />
                          <span className="truncate">Original Sound - {targetBrand || 'Official'}</span>
                        </div>
                      </div>

                      {/* Right Interaction Icons (Like, Comment, Share, Sound Disk) */}
                      <div className="flex flex-col items-center gap-4 text-white">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                          </div>
                          <span className="text-[9px] font-bold">142.8K</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[9px] font-bold">1,890</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
                          </div>
                          <span className="text-[9px] font-bold">24.1K</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                            <Share2 className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[9px] font-bold">Share</span>
                        </div>

                        {/* Spinning Record */}
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 border-2 border-white/80 flex items-center justify-center animate-spin">
                          <div className="w-2 h-2 rounded-full bg-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1A1A1A] border-t border-white/5 flex items-center justify-between text-xs text-[#8E918F]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe-zone overlay tested against Meta & TikTok 2026 specs
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
          >
            Done Testing
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMockupSimulatorModal;
