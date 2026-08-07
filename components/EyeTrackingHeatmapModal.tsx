import React, { useState } from 'react';
import { 
  Eye, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  X, 
  Sliders, 
  Layers, 
  Flame, 
  Info, 
  ShieldCheck, 
  TrendingUp,
  Activity
} from 'lucide-react';

interface EyeTrackingHeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  headline: string;
  targetBrand: string;
  mediaUrl: string;
}

export const EyeTrackingHeatmapModal: React.FC<EyeTrackingHeatmapModalProps> = ({
  isOpen,
  onClose,
  headline,
  targetBrand,
  mediaUrl
}) => {
  const [timeSlice, setTimeSlice] = useState<'0.5s' | '1.0s' | '2.0s'>('0.5s');
  const [heatmapOpacity, setHeatmapOpacity] = useState(70);
  const [showGazePath, setShowGazePath] = useState(true);

  if (!isOpen) return null;

  const currentMediaSrc = mediaUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1080&q=80';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-5xl rounded-[36px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-black rounded-2xl shadow-lg">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                AI Eye-Tracking Optical Heatmap & Attention Model
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                  2.0s Attention Scan
                </span>
              </h3>
              <p className="text-xs text-[#8E918F]">
                Predict exactly where viewer eyes focus during the initial 2 seconds of social feed exposure.
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
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 custom-scrollbar">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Time Slice Selection */}
            <div className="p-5 bg-[#222222] border border-white/5 rounded-3xl space-y-3">
              <label className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Optical Scan Exposure Window
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTimeSlice('0.5s')}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                    timeSlice === '0.5s'
                      ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-lg'
                      : 'bg-[#181818] text-[#8E918F] border-white/5 hover:text-white'
                  }`}
                >
                  0.5s Hook
                </button>
                <button
                  onClick={() => setTimeSlice('1.0s')}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                    timeSlice === '1.0s'
                      ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-lg'
                      : 'bg-[#181818] text-[#8E918F] border-white/5 hover:text-white'
                  }`}
                >
                  1.0s Scan
                </button>
                <button
                  onClick={() => setTimeSlice('2.0s')}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                    timeSlice === '2.0s'
                      ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-lg'
                      : 'bg-[#181818] text-[#8E918F] border-white/5 hover:text-white'
                  }`}
                >
                  2.0s CTA Fixation
                </button>
              </div>

              {/* Heatmap Opacity Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-[#8E918F]">
                  <span>Heatmap Density Overlay</span>
                  <span className="font-mono text-white font-bold">{heatmapOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={heatmapOpacity}
                  onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#8E918F]">Show Gaze Fixation Vector Path</span>
                <button
                  onClick={() => setShowGazePath(!showGazePath)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    showGazePath ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-white'
                  }`}
                >
                  {showGazePath ? 'Active Path' : 'Hidden'}
                </button>
              </div>
            </div>

            {/* AI Attention Metrics */}
            <div className="p-5 bg-[#222222] border border-white/5 rounded-3xl space-y-3">
              <h4 className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" /> Attention Clarity Diagnostic
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#181818] rounded-xl border border-white/5 flex items-center justify-between">
                  <span className="text-[#8E918F]">Product Focal Clarity</span>
                  <span className="text-emerald-400 font-bold">94% (Exceptional)</span>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-white/5 flex items-center justify-between">
                  <span className="text-[#8E918F]">Headline Text Readability</span>
                  <span className="text-amber-400 font-bold">82% (Good)</span>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-white/5 flex items-center justify-between">
                  <span className="text-[#8E918F]">Brand Logo Fixation</span>
                  <span className="text-sky-400 font-bold">88% (Secured in 1.2s)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Heatmap Preview Canvas */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <div className="relative w-[320px] h-[520px] bg-black rounded-[32px] overflow-hidden border-4 border-white/10 shadow-2xl">
              {/* Underneath Image */}
              <img
                src={currentMediaSrc}
                alt="Ad Creative Frame"
                className="w-full h-full object-cover"
              />

              {/* Heatmap Overlay Simulation */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{ opacity: heatmapOpacity / 100 }}
              >
                {/* Red Hotspot 1 (Primary Focal Point on Product) */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-radial from-red-500 via-yellow-500/60 to-transparent blur-2xl animate-pulse" />

                {/* Hotspot 2 (Headline Text Area) */}
                <div className="absolute bottom-1/4 left-10 w-36 h-28 rounded-full bg-gradient-radial from-yellow-400 via-emerald-500/50 to-transparent blur-xl" />

                {/* Hotspot 3 (Brand Logo Top Corner) */}
                <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-gradient-radial from-cyan-400 via-blue-500/40 to-transparent blur-lg" />
              </div>

              {/* Vector Gaze Path Lines */}
              {showGazePath && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                  <path
                    d="M 60 40 L 160 220 L 100 380"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    className="animate-dash"
                  />
                  {/* Point 1 */}
                  <circle cx="60" cy="40" r="8" fill="#00F0FF" />
                  <text x="75" y="44" fill="#00F0FF" fontSize="10" fontWeight="bold">1. Logo (0.2s)</text>

                  {/* Point 2 */}
                  <circle cx="160" cy="220" r="10" fill="#FF0055" />
                  <text x="175" y="224" fill="#FF0055" fontSize="10" fontWeight="bold">2. Product (0.6s)</text>

                  {/* Point 3 */}
                  <circle cx="100" cy="380" r="8" fill="#FFCC00" />
                  <text x="115" y="384" fill="#FFCC00" fontSize="10" fontWeight="bold">3. CTA (1.4s)</text>
                </svg>
              )}

              {/* Top Banner overlay */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                Heatmap Target: {timeSlice}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1E1E1E] border-t border-white/5 flex items-center justify-between text-xs text-[#8E918F]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Heatmap calibrated with 20,000+ consumer eye-tracking sessions
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
          >
            Close Heatmap
          </button>
        </div>
      </div>
    </div>
  );
};

export default EyeTrackingHeatmapModal;
