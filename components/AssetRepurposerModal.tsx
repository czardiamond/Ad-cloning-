import React, { useState } from 'react';
import { Layout, Download, X, Layers, Image as ImageIcon, Sparkles, Check, RefreshCw, Sliders, ExternalLink, Crop as AspectRatioIcon, FileArchive, Palette } from 'lucide-react';

interface AssetRepurposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  logoUrl?: string;
  heroImageUrl?: string;
  primaryColor: string;
  bgColor: string;
}

export interface IabFormatSpec {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  desc: string;
  category: 'Desktop' | 'Mobile' | 'Sidebar';
}

const IAB_FORMATS: IabFormatSpec[] = [
  { id: '300x250', name: 'Medium Rectangle', width: 300, height: 250, aspectRatio: '6:5', desc: 'Most popular IAB format for in-article & content feeds', category: 'Desktop' },
  { id: '728x90', name: 'Leaderboard', width: 728, height: 90, aspectRatio: '81:10', desc: 'Top & bottom banner placement for high visibility', category: 'Desktop' },
  { id: '160x600', name: 'Wide Skyscraper', width: 160, height: 600, aspectRatio: '4:15', desc: 'Persistent vertical sidebar display banner', category: 'Sidebar' },
  { id: '300x600', name: 'Half Page Filmstrip', width: 300, height: 600, aspectRatio: '1:2', desc: 'High-impact premium rich media display unit', category: 'Sidebar' },
  { id: '320x50', name: 'Mobile Leaderboard', width: 320, height: 50, aspectRatio: '32:5', desc: 'Standard mobile app & browser banner', category: 'Mobile' }
];

export const AssetRepurposerModal: React.FC<AssetRepurposerModalProps> = ({
  isOpen,
  onClose,
  brandName,
  headline: initialHeadline,
  subheadline: initialSubheadline,
  ctaText: initialCtaText,
  logoUrl,
  heroImageUrl,
  primaryColor,
  bgColor
}) => {
  const [headline, setHeadline] = useState(initialHeadline || `Discover ${brandName}`);
  const [subheadline, setSubheadline] = useState(initialSubheadline || 'Next generation performance & design.');
  const [ctaText, setCtaText] = useState(initialCtaText || 'Shop Now');
  const [layoutStyle, setLayoutStyle] = useState<'card' | 'minimal' | 'bold'>('card');
  const [selectedFormat, setSelectedFormat] = useState<string>('300x250');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadAll = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-5xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A8C7FA] text-[#003355] rounded-full">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#E2E2E2]">IAB Display Asset Repurposer</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider border border-indigo-500/30">
                  Auto-Formatted
                </span>
              </div>
              <p className="text-xs text-[#8E918F]">Extracts creative assets & resizes into standard 300x250, 728x90, 160x600 IAB ad units</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadAll}
              disabled={isDownloading}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Packaging IAB ZIP...
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" /> Downloaded Batch Package!
                </>
              ) : (
                <>
                  <FileArchive className="w-4 h-4" /> Download All IAB Ad Formats (.zip)
                </>
              )}
            </button>

            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* Left Sidebar - Controls */}
          <div className="w-80 bg-[#1A1A1A] border-r border-white/5 p-5 overflow-y-auto space-y-5 flex-shrink-0 custom-scrollbar">
            
            {/* Format Selector Pills */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">IAB Standard Dimensions</label>
              <div className="space-y-1.5">
                {IAB_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedFormat === fmt.id
                        ? 'bg-indigo-500/20 border-indigo-400 text-white ring-1 ring-indigo-400/30'
                        : 'bg-[#222222] border-white/5 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{fmt.name}</span>
                        <span className="font-mono text-[10px] text-indigo-300">({fmt.id})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{fmt.desc}</div>
                    </div>
                    {selectedFormat === fmt.id && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Layout Style Preset */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Banner Layout Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', name: 'Product Card' },
                  { id: 'minimal', name: 'Clean Minimal' },
                  { id: 'bold', name: 'High Impact' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setLayoutStyle(st.id as any)}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all ${
                      layoutStyle === st.id
                        ? 'bg-[#A8C7FA] text-[#003355] border-[#A8C7FA]'
                        : 'bg-[#222222] text-slate-300 border-white/5 hover:bg-white/5'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Text Copy Controls */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Repurposed Copy</label>
              
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Headline Text</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-[#222222] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Subheadline / Pitch</label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full bg-[#222222] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">CTA Button Copy</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-[#222222] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

          </div>

          {/* Right Main Stage - Canvas Previews */}
          <div className="flex-1 bg-[#121212] p-6 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center relative">
            
            {/* Format Info Top Bar */}
            {(() => {
              const activeSpec = IAB_FORMATS.find(f => f.id === selectedFormat) || IAB_FORMATS[0];
              return (
                <div className="w-full max-w-2xl mb-6 flex items-center justify-between bg-[#1E1E1E]/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold rounded-lg border border-indigo-500/30">
                      {activeSpec.width} x {activeSpec.height} px
                    </span>
                    <span className="text-xs font-bold text-white">{activeSpec.name}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-time HTML Canvas Scale</span>
                  </div>
                </div>
              );
            })()}

            {/* Interactive Preview Canvas Box */}
            <div className="w-full flex-1 flex items-center justify-center p-4">
              {/* Render Selected IAB Unit */}
              {selectedFormat === '300x250' && (
                <div
                  style={{ width: 300, height: 250, backgroundColor: bgColor || '#121212' }}
                  className="rounded-2xl border border-white/20 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:scale-105 transition-transform"
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-xs font-black tracking-wider uppercase" style={{ color: primaryColor || '#A8C7FA' }}>
                      {brandName}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                      Ad
                    </div>
                  </div>

                  <div className="my-auto z-10 space-y-1">
                    <h4 className="text-sm font-bold text-white leading-tight">{headline}</h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{subheadline}</p>
                  </div>

                  <button
                    className="w-full py-2 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95 z-10"
                    style={{ backgroundColor: primaryColor || '#A8C7FA', color: '#003355' }}
                  >
                    {ctaText}
                  </button>
                </div>
              )}

              {selectedFormat === '728x90' && (
                <div
                  style={{ width: 728, height: 90, backgroundColor: bgColor || '#121212' }}
                  className="rounded-2xl border border-white/20 shadow-2xl px-6 py-2 flex items-center justify-between relative overflow-hidden group hover:scale-105 transition-transform"
                >
                  <div className="flex items-center gap-4 z-10">
                    <span className="text-sm font-black tracking-wider uppercase" style={{ color: primaryColor || '#A8C7FA' }}>
                      {brandName}
                    </span>
                    <div className="h-8 w-px bg-white/20" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{headline}</h4>
                      <p className="text-[10px] text-slate-300 truncate max-w-sm">{subheadline}</p>
                    </div>
                  </div>

                  <button
                    className="px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95 z-10 flex-shrink-0"
                    style={{ backgroundColor: primaryColor || '#A8C7FA', color: '#003355' }}
                  >
                    {ctaText}
                  </button>
                </div>
              )}

              {selectedFormat === '160x600' && (
                <div
                  style={{ width: 160, height: 500, backgroundColor: bgColor || '#121212' }}
                  className="rounded-2xl border border-white/20 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:scale-105 transition-transform"
                >
                  <div className="text-center z-10 space-y-2">
                    <div className="w-8 h-8 mx-auto rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                      Ad
                    </div>
                    <span className="text-xs font-black tracking-wider uppercase block" style={{ color: primaryColor || '#A8C7FA' }}>
                      {brandName}
                    </span>
                  </div>

                  <div className="text-center my-auto z-10 space-y-2">
                    <h4 className="text-xs font-bold text-white leading-tight">{headline}</h4>
                    <p className="text-[10px] text-slate-300 line-clamp-3">{subheadline}</p>
                  </div>

                  <button
                    className="w-full py-2.5 rounded-xl font-bold text-xs shadow-md z-10"
                    style={{ backgroundColor: primaryColor || '#A8C7FA', color: '#003355' }}
                  >
                    {ctaText}
                  </button>
                </div>
              )}

              {selectedFormat === '300x600' && (
                <div
                  style={{ width: 280, height: 500, backgroundColor: bgColor || '#121212' }}
                  className="rounded-2xl border border-white/20 shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-105 transition-transform"
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-sm font-black tracking-wider uppercase" style={{ color: primaryColor || '#A8C7FA' }}>
                      {brandName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white">Rich Media</span>
                  </div>

                  <div className="my-auto z-10 space-y-3">
                    <div className="w-full h-32 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-3 text-center">
                      <p className="text-xs text-slate-300 italic">"Hero Product Graphic Extracted & Auto-Centered"</p>
                    </div>
                    <h4 className="text-base font-bold text-white leading-snug">{headline}</h4>
                    <p className="text-xs text-slate-300">{subheadline}</p>
                  </div>

                  <button
                    className="w-full py-3 rounded-xl font-bold text-xs shadow-lg z-10"
                    style={{ backgroundColor: primaryColor || '#A8C7FA', color: '#003355' }}
                  >
                    {ctaText}
                  </button>
                </div>
              )}

              {selectedFormat === '320x50' && (
                <div
                  style={{ width: 320, height: 50, backgroundColor: bgColor || '#121212' }}
                  className="rounded-xl border border-white/20 shadow-2xl px-4 py-1.5 flex items-center justify-between relative overflow-hidden group hover:scale-105 transition-transform"
                >
                  <div className="flex items-center gap-2 z-10">
                    <span className="text-xs font-black tracking-wider uppercase" style={{ color: primaryColor || '#A8C7FA' }}>
                      {brandName}
                    </span>
                    <h4 className="text-[11px] font-bold text-white truncate max-w-[120px]">{headline}</h4>
                  </div>

                  <button
                    className="px-3 py-1 rounded-lg font-bold text-[10px] shadow-sm z-10"
                    style={{ backgroundColor: primaryColor || '#A8C7FA', color: '#003355' }}
                  >
                    {ctaText}
                  </button>
                </div>
              )}
            </div>

            {/* Grid of All Repurposed IAB Banner Cards */}
            <div className="w-full mt-4 pt-4 border-t border-white/5">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">All Generated Units in Package</h5>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {IAB_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold flex-shrink-0 transition-all ${
                      selectedFormat === fmt.id ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400' : 'bg-[#1E1E1E] text-slate-300 border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <AspectRatioIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{fmt.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">({fmt.id})</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
