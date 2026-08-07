import React from 'react';
import { Plus, Trash2, Sliders, ExternalLink, Tag, ShoppingBag, Eye, Zap, Touchpad, Radio } from 'lucide-react';
import { AdHotspot } from '../types';

interface HotspotManagerPanelProps {
  hotspots: AdHotspot[];
  selectedHotspotId: string | null;
  onSelectHotspot: (id: string | null) => void;
  onAddHotspot: () => void;
  onUpdateHotspot: (hotspot: AdHotspot) => void;
  onDeleteHotspot: (id: string) => void;
  videoDuration: number;
}

const HotspotManagerPanel: React.FC<HotspotManagerPanelProps> = ({
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
  onAddHotspot,
  onUpdateHotspot,
  onDeleteHotspot,
  videoDuration
}) => {
  const selectedHotspot = hotspots.find(h => h.id === selectedHotspotId);

  return (
    <div className="bg-[#2C2C2C] p-4 rounded-[24px] space-y-4 border border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#A8C7FA]/20 text-[#A8C7FA] rounded-full">
            <Touchpad className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#E2E2E2]">Interactive In-Ad Hotspots</h4>
            <p className="text-[10px] text-[#8E918F]">Place clickable CTAs & product tags on video</p>
          </div>
        </div>
        <button
          onClick={onAddHotspot}
          className="px-3 py-1.5 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-xs font-bold flex items-center gap-1 shadow-md transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Hotspot
        </button>
      </div>

      {/* List of existing hotspots */}
      {hotspots.length > 0 ? (
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
          {hotspots.map((h, idx) => {
            const isSelected = h.id === selectedHotspotId;
            return (
              <div
                key={h.id}
                onClick={() => onSelectHotspot(h.id)}
                className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#A8C7FA]/15 border-[#A8C7FA] text-[#A8C7FA] ring-1 ring-[#A8C7FA]'
                    : 'bg-[#1E1E1E] border-white/5 text-[#E2E2E2] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 bg-[#252525] rounded-full flex items-center justify-center font-mono text-[10px]">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <div className="font-semibold truncate">{h.label || 'Untitled Hotspot'}</div>
                    <div className="text-[10px] text-[#8E918F] capitalize">
                      {h.actionType} • {(h.startTime * videoDuration).toFixed(1)}s - {(h.endTime * videoDuration).toFixed(1)}s
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteHotspot(h.id);
                  }}
                  className="p-1.5 hover:bg-red-500/20 text-[#8E918F] hover:text-red-400 rounded-full transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center bg-[#1E1E1E] rounded-2xl border border-dashed border-white/10 text-xs text-[#8E918F]">
          No interactive hotspots configured yet. Click "Add Hotspot" to place clickable links or buy buttons.
        </div>
      )}

      {/* Selected Hotspot Detailed Editor */}
      {selectedHotspot && (
        <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-white/10 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-[#A8C7FA]">Edit Hotspot Parameters</span>
            <span className="text-[10px] font-mono text-[#8E918F]">ID: {selectedHotspot.id.slice(-4)}</span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#C4C7C5]">Button Label / Title</label>
            <input
              type="text"
              value={selectedHotspot.label}
              onChange={(e) => onUpdateHotspot({ ...selectedHotspot, label: e.target.value })}
              placeholder="e.g. Shop 20% Off Now"
              className="w-full bg-[#252525] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E2E2E2] focus:ring-1 focus:ring-[#A8C7FA] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-[#C4C7C5]">Action Type</label>
              <select
                value={selectedHotspot.actionType}
                onChange={(e) => onUpdateHotspot({ ...selectedHotspot, actionType: e.target.value as any })}
                className="w-full bg-[#252525] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-[#E2E2E2]"
              >
                <option value="url">External Link URL</option>
                <option value="coupon">Reveal Promo Coupon</option>
                <option value="add_to_cart">Instant Buy / Cart</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#C4C7C5]">Visual Style</label>
              <select
                value={selectedHotspot.style}
                onChange={(e) => onUpdateHotspot({ ...selectedHotspot, style: e.target.value as any })}
                className="w-full bg-[#252525] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-[#E2E2E2]"
              >
                <option value="accent">Google Material Accent</option>
                <option value="glass">Dark Glassmorphism</option>
                <option value="neon">Cyber Neon Glow</option>
              </select>
            </div>
          </div>

          {selectedHotspot.actionType === 'url' && (
            <div>
              <label className="text-[11px] font-medium text-[#C4C7C5]">Target URL</label>
              <input
                type="text"
                value={selectedHotspot.url || ''}
                onChange={(e) => onUpdateHotspot({ ...selectedHotspot, url: e.target.value })}
                placeholder="https://brand.com/special-offer"
                className="w-full bg-[#252525] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E2E2E2]"
              />
            </div>
          )}

          {selectedHotspot.actionType === 'coupon' && (
            <div>
              <label className="text-[11px] font-medium text-[#C4C7C5]">Coupon Code</label>
              <input
                type="text"
                value={selectedHotspot.couponCode || ''}
                onChange={(e) => onUpdateHotspot({ ...selectedHotspot, couponCode: e.target.value })}
                placeholder="e.g. ADCLONE20"
                className="w-full bg-[#252525] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E2E2E2] uppercase font-mono"
              />
            </div>
          )}

          {selectedHotspot.actionType === 'add_to_cart' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-[#C4C7C5]">Product Name</label>
                <input
                  type="text"
                  value={selectedHotspot.productName || ''}
                  onChange={(e) => onUpdateHotspot({ ...selectedHotspot, productName: e.target.value })}
                  placeholder="Pro Earbuds"
                  className="w-full bg-[#252525] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E2E2E2]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-[#C4C7C5]">Price</label>
                <input
                  type="text"
                  value={selectedHotspot.price || ''}
                  onChange={(e) => onUpdateHotspot({ ...selectedHotspot, price: e.target.value })}
                  placeholder="$49.99"
                  className="w-full bg-[#252525] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E2E2E2]"
                />
              </div>
            </div>
          )}

          {/* Timing Sliders */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-[#C4C7C5]">
              <span>Appearance Timing</span>
              <span className="font-mono text-[#A8C7FA]">
                {(selectedHotspot.startTime * videoDuration).toFixed(1)}s - {(selectedHotspot.endTime * videoDuration).toFixed(1)}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.05"
                value={selectedHotspot.startTime}
                onChange={(e) => onUpdateHotspot({ ...selectedHotspot, startTime: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-[#252525] rounded-full appearance-none cursor-pointer accent-[#A8C7FA]"
              />
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={selectedHotspot.endTime}
                onChange={(e) => onUpdateHotspot({ ...selectedHotspot, endTime: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-[#252525] rounded-full appearance-none cursor-pointer accent-[#D0BCFF]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedHotspot.pulse}
              onChange={(e) => onUpdateHotspot({ ...selectedHotspot, pulse: e.target.checked })}
              className="w-4 h-4 accent-[#A8C7FA] rounded"
            />
            <span className="text-xs text-[#C4C7C5]">Enable Attention Pulse Animation</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default HotspotManagerPanel;
