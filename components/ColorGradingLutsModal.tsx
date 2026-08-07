import React, { useState } from 'react';
import { Palette, Sliders, Eye, Sparkles, Check, X, RefreshCw, Activity, Sun, Moon, Flame } from 'lucide-react';
import { ColorLutPreset } from '../types';

interface ColorGradingLutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLut?: (lutName: string) => void;
}

const LUT_PRESETS: ColorLutPreset[] = [
  {
    id: 'lut-1',
    name: 'Technicolor 35mm Vintage',
    profile: 'ACEScc',
    description: 'Classic 1970s Technicolor richness with warm highlights and deep organic blacks.',
    thumbnailColor: 'from-amber-600 via-orange-500 to-amber-950',
    lift: { r: 5, g: 2, b: -4 },
    gamma: { r: 8, g: 3, b: -2 },
    gain: { r: 10, g: 6, b: -5 }
  },
  {
    id: 'lut-2',
    name: 'Kodak Vision3 500T',
    profile: 'Rec.709',
    description: 'Industry-standard motion picture film stock used in blockbuster feature films.',
    thumbnailColor: 'from-amber-500 via-yellow-600 to-stone-900',
    lift: { r: 2, g: 0, b: -2 },
    gamma: { r: 4, g: 2, b: -1 },
    gain: { r: 6, g: 4, b: -2 }
  },
  {
    id: 'lut-3',
    name: 'Teal & Orange Blockbuster',
    profile: 'ARRI LogC',
    description: 'High-contrast cinematic color separation for skin tones and background depth.',
    thumbnailColor: 'from-cyan-600 via-amber-500 to-slate-950',
    lift: { r: -8, g: -2, b: 8 },
    gamma: { r: 4, g: 0, b: -4 },
    gain: { r: 12, g: 6, b: -8 }
  },
  {
    id: 'lut-4',
    name: 'Matrix Sci-Fi Cyan',
    profile: 'RED IPP2',
    description: 'Futuristic green-cyan tinting with desaturated skin tones and high dynamic contrast.',
    thumbnailColor: 'from-[#00FF66] via-teal-700 to-black',
    lift: { r: -10, g: 8, b: 2 },
    gamma: { r: -6, g: 10, b: 0 },
    gain: { r: -2, g: 12, b: 4 }
  },
  {
    id: 'lut-5',
    name: 'Neo-Noir Gotham Monolith',
    profile: 'Sony S-Log3',
    description: 'Ultra-low key shadow compression with crisp silvery highlights.',
    thumbnailColor: 'from-slate-400 via-zinc-700 to-zinc-950',
    lift: { r: -15, g: -15, b: -12 },
    gamma: { r: -4, g: -4, b: -2 },
    gain: { r: 8, g: 8, b: 10 }
  }
];

const ColorGradingLutsModal: React.FC<ColorGradingLutsModalProps> = ({
  isOpen,
  onClose,
  onApplyLut
}) => {
  const [selectedLut, setSelectedLut] = useState<ColorLutPreset>(LUT_PRESETS[2]);
  const [colorProfile, setColorProfile] = useState<'ACEScc' | 'Rec.709' | 'ARRI LogC'>('ACEScc');
  const [temperature, setTemperature] = useState(5600); // Kelvin
  const [tint, setTint] = useState(0);
  const [contrast, setContrast] = useState(110);
  const [saturation, setSaturation] = useState(105);
  const [filmGrain, setFilmGrain] = useState(25);
  const [scopeMode, setScopeMode] = useState<'rgb_parade' | 'vectorscope' | 'histogram'>('rgb_parade');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141414] w-full max-w-5xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-400 text-black rounded-full shadow-lg">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Hollywood 3D LUT Color Grading & ACES Pipeline
              </h3>
              <p className="text-xs text-[#8E918F]">3D Color Lookup Tables, Color Wheels, ACEScc Workflow & Real-Time Scopes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Top Bar: Pipeline Selector & Scopes Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E1E1E] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider">Color Science Space:</span>
              <div className="flex bg-[#121212] p-1 rounded-xl border border-white/10 text-xs">
                {(['ACEScc', 'Rec.709', 'ARRI LogC'] as const).map((prof) => (
                  <button
                    key={prof}
                    onClick={() => setColorProfile(prof)}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      colorProfile === prof ? 'bg-[#A8C7FA] text-[#003355]' : 'text-[#8E918F] hover:text-white'
                    }`}
                  >
                    {prof}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope Visualizer Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8E918F] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Scopes:
              </span>
              <div className="flex bg-[#121212] p-1 rounded-xl border border-white/10 text-xs">
                {(['rgb_parade', 'vectorscope', 'histogram'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setScopeMode(mode)}
                    className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition-colors ${
                      scopeMode === mode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-[#8E918F] hover:text-white'
                    }`}
                  >
                    {mode.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scope Monitor Display Box */}
          <div className="bg-black p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 aspect-video bg-[#0A0A0A] rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-tr ${selectedLut.thumbnailColor} opacity-40 mix-blend-overlay`} />
              <div className="text-center p-4 z-10">
                <span className="text-xs font-mono text-[#A8C7FA] uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  {selectedLut.name} [{colorProfile}]
                </span>
                <p className="text-[11px] text-white/80 mt-2 max-w-xs">{selectedLut.description}</p>
              </div>
            </div>

            {/* Simulated Live Scope Meter */}
            <div className="w-full md:w-1/2 aspect-video bg-[#05080A] rounded-xl border border-emerald-500/20 p-3 flex flex-col justify-between font-mono text-[10px] text-emerald-400">
              <div className="flex justify-between border-b border-emerald-900/50 pb-1">
                <span>SCOPE: {scopeMode.toUpperCase()}</span>
                <span>IRE: 0 - 100</span>
              </div>
              <div className="flex-1 flex items-end justify-between gap-1 py-2">
                {Array.from({ length: 32 }).map((_, i) => {
                  const height = Math.floor(Math.sin(i * 0.4) * 30 + 50 + Math.random() * 15);
                  return (
                    <div
                      key={i}
                      className="w-full bg-emerald-500/60 rounded-t transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between border-t border-emerald-900/50 pt-1 text-[9px] text-emerald-600">
                <span>BLACKS (0 IRE)</span>
                <span>MIDTONES (50 IRE)</span>
                <span>HIGHLIGHTS (100 IRE)</span>
              </div>
            </div>
          </div>

          {/* LUT Presets Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#E2E2E2] uppercase tracking-wider">3D Hollywood LUT Master Catalog</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {LUT_PRESETS.map((lut) => {
                const isSelected = selectedLut.id === lut.id;
                return (
                  <div
                    key={lut.id}
                    onClick={() => setSelectedLut(lut)}
                    className={`p-3 bg-[#1E1E1E] rounded-2xl border cursor-pointer transition-all space-y-2 group ${
                      isSelected ? 'border-amber-400 ring-2 ring-amber-400/30 bg-[#252525]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`aspect-video w-full rounded-xl bg-gradient-to-tr ${lut.thumbnailColor} border border-white/10 flex items-center justify-center`}>
                      <Flame className="w-5 h-5 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate">{lut.name}</div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">{lut.profile}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Wheel / Primary Sliders */}
          <div className="bg-[#1E1E1E] p-5 rounded-2xl border border-white/5 space-y-4">
            <h4 className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Primary Color Controls & White Balance
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#C4C7C5]">
                  <span>Temperature</span>
                  <span className="font-mono text-amber-400">{temperature}K</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={10000}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#C4C7C5]">
                  <span>Tint (G/M)</span>
                  <span className="font-mono text-emerald-400">{tint}</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={tint}
                  onChange={(e) => setTint(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#C4C7C5]">
                  <span>Contrast</span>
                  <span className="font-mono text-[#A8C7FA]">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={200}
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-[#A8C7FA] bg-black/40 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#C4C7C5]">
                  <span>35mm Film Grain</span>
                  <span className="font-mono text-purple-400">{filmGrain}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={filmGrain}
                  onChange={(e) => setFilmGrain(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1A1A1A] flex items-center justify-between">
          <div className="text-xs text-[#8E918F]">
            Selected: <span className="text-amber-400 font-bold">{selectedLut.name}</span> ({colorProfile})
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
                if (onApplyLut) onApplyLut(selectedLut.name);
                onClose();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 hover:brightness-110 text-black rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Apply 3D Grade to Composition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorGradingLutsModal;
