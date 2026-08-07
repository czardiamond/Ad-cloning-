import React, { useState } from 'react';
import { Maximize2, Crop, Check, X, Sparkles, Smartphone, Monitor, Square, ShieldAlert, ArrowRight, Layers, Eye } from 'lucide-react';
import { SmartFormatRatio, SmartFormatPreview } from '../types';

interface SmartFormatResizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMediaUrl?: string;
  onApplyRatio?: (ratio: SmartFormatRatio) => void;
}

const FORMAT_PREVIEWS: SmartFormatPreview[] = [
  {
    formatRatio: '9:16',
    label: 'Vertical Story & Reels',
    platform: 'TikTok, IG Reels, YouTube Shorts',
    subjectCenterX: 50,
    subjectCenterY: 45,
    safeZoneOk: true
  },
  {
    formatRatio: '1:1',
    label: 'Square Feed',
    platform: 'Instagram Feed, Facebook Post',
    subjectCenterX: 50,
    subjectCenterY: 50,
    safeZoneOk: true
  },
  {
    formatRatio: '4:5',
    label: 'Portrait Feed',
    platform: 'Facebook Mobile, Meta Feed',
    subjectCenterX: 50,
    subjectCenterY: 48,
    safeZoneOk: true
  },
  {
    formatRatio: '16:9',
    label: 'Landscape Master',
    platform: 'YouTube Desktop, Connected TV',
    subjectCenterX: 50,
    subjectCenterY: 50,
    safeZoneOk: true
  }
];

const SmartFormatResizerModal: React.FC<SmartFormatResizerModalProps> = ({
  isOpen,
  onClose,
  activeMediaUrl,
  onApplyRatio
}) => {
  const [selectedRatio, setSelectedRatio] = useState<SmartFormatRatio>('9:16');
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleBatchExport = () => {
    setIsExportingAll(true);
    setTimeout(() => {
      setIsExportingAll(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-4xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A8C7FA] text-[#003355] rounded-full">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#E2E2E2]">AI Smart Format Auto-Resizer</h3>
              <p className="text-xs text-[#8E918F]">Auto-framing with subject tracking & social safe-zone overlays across all ad formats</p>
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
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#222222] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A8C7FA]" /> AI Subject Focal Tracking:
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                Active Auto-Center
              </span>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-[#C4C7C5] cursor-pointer">
              <input
                type="checkbox"
                checked={showSafeZones}
                onChange={(e) => setShowSafeZones(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 text-[#A8C7FA] focus:ring-0 bg-[#1E1E1E]"
              />
              Show Platform Safe-Zone Overlays
            </label>
          </div>

          {/* Ratio Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FORMAT_PREVIEWS.map((item) => {
              const isSelected = selectedRatio === item.formatRatio;
              return (
                <div
                  key={item.formatRatio}
                  onClick={() => setSelectedRatio(item.formatRatio)}
                  className={`bg-[#222222] p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                    isSelected ? 'border-[#A8C7FA] ring-2 ring-[#A8C7FA]/30 bg-[#282828]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Format Label */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#E2E2E2]">{item.label}</span>
                      <span className="px-2 py-0.5 bg-[#2C2C2C] text-[#A8C7FA] rounded text-[10px] font-mono font-bold">
                        {item.formatRatio}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8E918F] truncate mt-0.5">{item.platform}</div>
                  </div>

                  {/* Frame Preview Container */}
                  <div className="relative aspect-[3/4] w-full bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                    {activeMediaUrl ? (
                      <img
                        src={activeMediaUrl}
                        alt={item.label}
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: `${item.subjectCenterX}% ${item.subjectCenterY}%`
                        }}
                      />
                    ) : (
                      <div className="text-xs text-[#8E918F]">No Media</div>
                    )}

                    {/* AI Focal Point Crosshair */}
                    <div
                      className="absolute w-6 h-6 border-2 border-[#A8C7FA] rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-lg animate-pulse"
                      style={{ left: `${item.subjectCenterX}%`, top: `${item.subjectCenterY}%` }}
                    >
                      <div className="w-1.5 h-1.5 bg-[#A8C7FA] rounded-full" />
                    </div>

                    {/* Safe Zone Boundary */}
                    {showSafeZones && item.formatRatio === '9:16' && (
                      <div className="absolute inset-x-2 top-8 bottom-12 border-2 border-dashed border-amber-400/60 rounded-lg pointer-events-none flex items-start justify-center pt-1">
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                          TikTok UI Safe Area
                        </span>
                      </div>
                    )}

                    {showSafeZones && item.formatRatio === '1:1' && (
                      <div className="absolute inset-2 border-2 border-dashed border-emerald-400/60 rounded-lg pointer-events-none flex items-start justify-center pt-1">
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                          IG Feed Bounds
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer Status */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Auto-Centered
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 bg-[#A8C7FA] text-[#003355] rounded-full font-bold text-[10px]">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1E1E1E] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleBatchExport}
            disabled={isExportingAll}
            className="px-5 py-2.5 bg-[#2C2C2C] hover:bg-white/10 text-[#E2E2E2] rounded-full text-xs font-semibold transition-colors flex items-center gap-2 border border-white/10"
          >
            <Layers className="w-4 h-4 text-[#A8C7FA]" />
            {isExportingAll ? 'Resizing Matrix...' : exportSuccess ? 'Batch Formats Exported!' : 'Export All 4 Formats Simultaneously'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-[#8E918F] hover:text-white rounded-full text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onApplyRatio) onApplyRatio(selectedRatio);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg"
            >
              Apply Selected Ratio ({selectedRatio})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFormatResizerModal;
