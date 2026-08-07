import React, { useState } from 'react';
import { ExternalLink, Tag, ShoppingBag, ArrowRight, Sparkles, Check } from 'lucide-react';
import { AdHotspot } from '../types';

interface HotspotOverlayProps {
  hotspots: AdHotspot[];
  currentTime: number; // 0.0 to 1.0 percentage or seconds
  duration: number; // in seconds
  isEditing: boolean;
  selectedHotspotId: string | null;
  onSelectHotspot: (id: string) => void;
  onUpdateHotspotPos?: (id: string, x: number, y: number) => void;
}

const HotspotOverlay: React.FC<HotspotOverlayProps> = ({
  hotspots,
  currentTime,
  duration,
  isEditing,
  selectedHotspotId,
  onSelectHotspot,
  onUpdateHotspotPos
}) => {
  const [activeInteractiveModal, setActiveInteractiveModal] = useState<AdHotspot | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Filter hotspots active at the current normalized timestamp (0.0 to 1.0)
  const visibleHotspots = hotspots.filter(h => {
    if (isEditing) return true; // Show all in edit mode
    return currentTime >= h.startTime && currentTime <= h.endTime;
  });

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (!isEditing) return;
    e.stopPropagation();
    setDraggingId(id);
    onSelectHotspot(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !onUpdateHotspotPos) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.min(90, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.min(90, Math.max(5, ((e.clientY - rect.top) / rect.height) * 100));
    onUpdateHotspotPos(draggingId, parseFloat(xPct.toFixed(1)), parseFloat(yPct.toFixed(1)));
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  const handleHotspotClick = (h: AdHotspot) => {
    if (isEditing) {
      onSelectHotspot(h.id);
      return;
    }
    // Interactive action when viewer clicks hotspot during ad playback
    if (h.actionType === 'url' && h.url) {
      window.open(h.url.startsWith('http') ? h.url : `https://${h.url}`, '_blank');
    } else {
      setActiveInteractiveModal(h);
    }
  };

  return (
    <div 
      className="absolute inset-0 z-30 pointer-events-auto select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {visibleHotspots.map((h) => {
        const isSelected = selectedHotspotId === h.id;
        
        // Custom styling classes based on style selection
        let styleClasses = "bg-white/20 backdrop-blur-md border-white/40 text-white shadow-xl";
        if (h.style === 'glass') styleClasses = "bg-black/40 backdrop-blur-xl border-white/20 text-[#E2E2E2]";
        if (h.style === 'accent') styleClasses = "bg-[#A8C7FA] border-[#A8C7FA] text-[#003355] font-bold";
        if (h.style === 'neon') styleClasses = "bg-indigo-600/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.5)]";

        return (
          <div
            key={h.id}
            onPointerDown={(e) => handlePointerDown(e, h.id)}
            onClick={() => handleHotspotClick(h)}
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              width: `${h.width}%`,
              height: `${h.height}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute rounded-2xl border p-2 flex items-center justify-between cursor-pointer transition-all duration-150 group ${styleClasses} ${
              isSelected ? 'ring-2 ring-yellow-400 scale-105 z-40' : 'hover:scale-105'
            } ${h.pulse ? 'animate-pulse' : ''}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-1.5 rounded-xl bg-white/20 flex-shrink-0">
                {h.actionType === 'add_to_cart' ? (
                  <ShoppingBag className="w-3.5 h-3.5" />
                ) : h.actionType === 'coupon' ? (
                  <Tag className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold leading-none truncate">{h.label || 'Clickable Hotspot'}</div>
                {h.price && <div className="text-[9px] opacity-80 mt-0.5">{h.price}</div>}
              </div>
            </div>

            <div className="p-1 bg-white/20 rounded-full flex-shrink-0 ml-1">
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Time Indicator Badge in Edit Mode */}
            {isEditing && (
              <span className="absolute -top-5 left-0 bg-black/80 text-[9px] px-1.5 py-0.5 rounded text-[#A8C7FA] font-mono border border-white/10 whitespace-nowrap">
                {(h.startTime * duration).toFixed(1)}s - {(h.endTime * duration).toFixed(1)}s
              </span>
            )}
          </div>
        );
      })}

      {/* Interactive In-Ad Action Modal Popup */}
      {activeInteractiveModal && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-[28px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setActiveInteractiveModal(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white"
            >
              ×
            </button>

            <div className="w-12 h-12 bg-[#A8C7FA]/20 text-[#A8C7FA] rounded-full mx-auto flex items-center justify-center">
              {activeInteractiveModal.actionType === 'coupon' ? <Tag className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#E2E2E2]">{activeInteractiveModal.label}</h4>
              {activeInteractiveModal.productName && (
                <p className="text-xs text-[#8E918F] mt-1">{activeInteractiveModal.productName}</p>
              )}
            </div>

            {activeInteractiveModal.actionType === 'coupon' && activeInteractiveModal.couponCode && (
              <div className="p-3 bg-[#252525] rounded-2xl border border-dashed border-[#A8C7FA]/40 flex items-center justify-between font-mono text-sm">
                <span className="text-[#A8C7FA] font-bold">{activeInteractiveModal.couponCode}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(activeInteractiveModal.couponCode || '')}
                  className="px-3 py-1 bg-[#A8C7FA] text-[#003355] rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Check className="w-3 h-3"/> Copy
                </button>
              </div>
            )}

            {activeInteractiveModal.actionType === 'add_to_cart' && (
              <div className="space-y-2">
                <div className="text-2xl font-black text-[#A8C7FA]">{activeInteractiveModal.price || '$29.99'}</div>
                <button 
                  onClick={() => {
                    alert(`Added ${activeInteractiveModal.label} to cart!`);
                    setActiveInteractiveModal(null);
                  }}
                  className="w-full py-3 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4"/> Confirm Instant Purchase
                </button>
              </div>
            )}

            {activeInteractiveModal.url && (
              <a
                href={activeInteractiveModal.url.startsWith('http') ? activeInteractiveModal.url : `https://${activeInteractiveModal.url}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#A8C7FA] hover:underline pt-2"
              >
                Visit Offer Page <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotspotOverlay;
