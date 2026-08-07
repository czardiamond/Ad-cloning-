import React, { useState } from 'react';
import { Layers, Sparkles, Wand2, Sun, Flame, Camera, Check, X, Sliders, Eye } from 'lucide-react';
import { VfxLayerEffect } from '../types';

interface VfxCompositeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVfx?: (vfxLayers: VfxLayerEffect[]) => void;
}

const INITIAL_VFX: VfxLayerEffect[] = [
  { id: 'vfx-1', name: 'AI Green Screen / Chroma Key Matte', category: 'chroma_key', enabled: true, intensity: 85, blendMode: 'normal' },
  { id: 'vfx-2', name: 'Anamorphic Lens Flare (Blue Streak)', category: 'lens_flare', enabled: true, intensity: 60, blendMode: 'screen' },
  { id: 'vfx-[#3]', name: '35mm Kodak Grain Texture', category: 'film_grain', enabled: true, intensity: 30, blendMode: 'soft_light' },
  { id: 'vfx-4', name: 'Handheld Cinematic Camera Shake', category: 'camera_shake', enabled: false, intensity: 20, blendMode: 'normal' },
  { id: 'vfx-5', name: 'Volumetric Optical Bloom', category: 'glow', enabled: true, intensity: 45, blendMode: 'color_dodge' }
];

const VfxCompositeStudioModal: React.FC<VfxCompositeStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyVfx
}) => {
  const [vfxList, setVfxList] = useState<VfxLayerEffect[]>(INITIAL_VFX);
  const [chromaKeyColor, setChromaKeyColor] = useState<'#00FF00' | '#0000FF'>('#00FF00');
  const [spillSuppression, setSpillSuppression] = useState(75);
  const [edgeSoftness, setEdgeSoftness] = useState(40);

  if (!isOpen) return null;

  const handleToggleVfx = (id: string) => {
    setVfxList(prev => prev.map(v => v.id === id ? { ...v, enabled: !v.enabled } : v));
  };

  const handleIntensityChange = (id: string, intensity: number) => {
    setVfxList(prev => prev.map(v => v.id === id ? { ...v, intensity } : v));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141414] w-full max-w-5xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-full shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Hollywood VFX Composite Studio & AI Chroma Keyer
              </h3>
              <p className="text-xs text-[#8E918F]">Green/Blue Screen Background Matting, Anamorphic Lens Flares & 35mm Grain Compositing</p>
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
          {/* AI Chroma Keyer Panel */}
          <div className="bg-[#1E1E1E] p-5 rounded-2xl border border-purple-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> AI Green/Blue Screen Chroma Key Engine
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8E918F]">Key Color:</span>
                <button
                  onClick={() => setChromaKeyColor('#00FF00')}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    chromaKeyColor === '#00FF00' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-black/40 border-white/10 text-[#8E918F]'
                  }`}
                >
                  Green Screen
                </button>
                <button
                  onClick={() => setChromaKeyColor('#0000FF')}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    chromaKeyColor === '#0000FF' ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-black/40 border-white/10 text-[#8E918F]'
                  }`}
                >
                  Blue Screen
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#C4C7C5]">
                  <span>Spill Suppression</span>
                  <span className="font-mono text-purple-300">{spillSuppression}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={spillSuppression}
                  onChange={(e) => setSpillSuppression(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#C4C7C5]">
                  <span>Matte Edge Softness</span>
                  <span className="font-mono text-pink-300">{edgeSoftness}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={edgeSoftness}
                  onChange={(e) => setEdgeSoftness(Number(e.target.value))}
                  className="w-full accent-pink-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* VFX Layers List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#E2E2E2] uppercase tracking-wider">Cinematic VFX Compositing Stack</h4>
            <div className="space-y-2.5">
              {vfxList.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    layer.enabled ? 'bg-[#222222] border-purple-400/50' : 'bg-[#181818] border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleVfx(layer.id)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                          layer.enabled ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-black/40 border-white/10 text-[#8E918F]'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="text-xs font-bold text-white">{layer.name}</div>
                        <div className="text-[10px] text-[#8E918F] uppercase font-mono">
                          Blend Mode: <span className="text-purple-300">{layer.blendMode}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-purple-300">
                      Intensity: {layer.intensity}%
                    </span>
                  </div>

                  {layer.enabled && (
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={layer.intensity}
                      onChange={(e) => handleIntensityChange(layer.id, Number(e.target.value))}
                      className="w-full accent-purple-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1A1A1A] flex items-center justify-between">
          <div className="text-xs text-purple-300 font-mono">
            VFX Composite Engine Ready (5 Layers Active)
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
                if (onApplyVfx) onApplyVfx(vfxList);
                onClose();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Apply VFX Compositing Stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VfxCompositeStudioModal;
