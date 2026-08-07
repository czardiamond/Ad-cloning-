import React, { useState } from 'react';
import { Target, Zap, Activity, Sliders, Check, X, Sparkles } from 'lucide-react';
import { MotionTrackPoint } from '../types';

interface MotionTrackingKeyframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMediaUrl?: string;
  onApplyMotionTracking?: (points: MotionTrackPoint[]) => void;
}

const DEFAULT_POINTS: MotionTrackPoint[] = [
  { id: 'pt-1', label: 'Primary Subject Head / Eye Lock', targetX: 50, targetY: 35, easingCurve: 'bezier_smooth', motionBlur: true },
  { id: 'pt-2', label: 'Product Logo Anchor Point', targetX: 72, targetY: 60, easingCurve: 'ease_out_cubic', motionBlur: true },
  { id: 'pt-3', label: 'Floating 3D Callout Badge', targetX: 25, targetY: 45, easingCurve: 'spring_bounce', motionBlur: false }
];

const MotionTrackingKeyframeModal: React.FC<MotionTrackingKeyframeModalProps> = ({
  isOpen,
  onClose,
  activeMediaUrl,
  onApplyMotionTracking
}) => {
  const [points, setPoints] = useState<MotionTrackPoint[]>(DEFAULT_POINTS);
  const [activePointId, setActivePointId] = useState<string>('pt-1');
  const [opticalFlowQuality, setOpticalFlowQuality] = useState<'Standard' | 'Ultra High Precision'>('Ultra High Precision');

  if (!isOpen) return null;

  const activePoint = points.find(p => p.id === activePointId) || points[0];

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPoints(prev => prev.map(p => p.id === activePoint.id ? { ...p, targetX: x, targetY: y } : p));
  };

  const handleCurveChange = (curve: MotionTrackPoint['easingCurve']) => {
    setPoints(prev => prev.map(p => p.id === activePoint.id ? { ...p, easingCurve: curve } : p));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141414] w-full max-w-5xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-400 to-yellow-500 text-black rounded-full shadow-lg">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Hollywood 2D/3D Optical Motion Tracking & Easing Curves
              </h3>
              <p className="text-xs text-[#8E918F]">Sub-Pixel Point Tracking with Cubic-Bezier Easing & Optical Flow Motion Blur</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Optical Tracker Viewport */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[#E2E2E2] uppercase tracking-wider">Optical Tracking Viewport</h4>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Quality: {opticalFlowQuality}
                </span>
              </div>

              {/* Viewport Canvas */}
              <div
                onClick={handleCanvasClick}
                className="aspect-video w-full bg-black rounded-2xl overflow-hidden relative border border-white/10 cursor-crosshair group shadow-2xl"
              >
                {activeMediaUrl ? (
                  <img src={activeMediaUrl} alt="Motion Track" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#8E918F]">No Media Loaded</div>
                )}

                {/* Track Points Overlays */}
                {points.map((pt) => {
                  const isSelected = pt.id === activePoint.id;
                  return (
                    <div
                      key={pt.id}
                      className={`absolute w-8 h-8 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-bold text-[9px] shadow-lg transition-transform ${
                        isSelected ? 'border-amber-400 bg-amber-400/30 text-amber-300 scale-125 z-20 animate-pulse' : 'border-white/40 bg-black/50 text-white z-10'
                      }`}
                      style={{ left: `${pt.targetX}%`, top: `${pt.targetY}%` }}
                    >
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] text-[#8E918F] italic">
                Click anywhere on the image frame above to position the active motion anchor point.
              </div>
            </div>

            {/* Right Column: Tracking Point Settings & Easing Curves */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#E2E2E2] uppercase tracking-wider">Tracking Points Catalog</h4>
              <div className="space-y-2">
                {points.map((pt) => {
                  const isSelected = pt.id === activePoint.id;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => setActivePointId(pt.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                        isSelected ? 'bg-[#222222] border-amber-400 ring-2 ring-amber-400/20' : 'bg-[#1E1E1E] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{pt.label}</div>
                      <div className="text-[10px] text-[#8E918F] font-mono">
                        Target Pos: [{pt.targetX}%, {pt.targetY}%]
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Curve Selector */}
              <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-white/5 space-y-3">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">Bezier Easing Curve</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleCurveChange('bezier_smooth')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      activePoint.easingCurve === 'bezier_smooth' ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold' : 'bg-[#121212] border-white/5 text-[#8E918F]'
                    }`}
                  >
                    Cubic Bezier
                  </button>
                  <button
                    onClick={() => handleCurveChange('spring_bounce')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      activePoint.easingCurve === 'spring_bounce' ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold' : 'bg-[#121212] border-white/5 text-[#8E918F]'
                    }`}
                  >
                    Spring Bounce
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1A1A1A] flex items-center justify-between">
          <div className="text-xs text-amber-400 font-mono">
            Anchor Point Positioned: [{activePoint.targetX}%, {activePoint.targetY}%]
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
                if (onApplyMotionTracking) onApplyMotionTracking(points);
                onClose();
              }}
              className="px-6 py-2.5 bg-amber-400 hover:bg-yellow-300 text-black rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Apply Motion Track Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionTrackingKeyframeModal;
