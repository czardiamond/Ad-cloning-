import React, { useState } from 'react';
import { Volume2, Music, Sparkles, Play, Plus, Trash2, Check, X, Disc, Sliders, Zap, RefreshCw, Radio } from 'lucide-react';

interface SfxSoundboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachSfxToTimeline?: (sfxName: string, category: string, timeMarkerSec: number) => void;
}

export interface SoundEffectItem {
  id: string;
  name: string;
  category: 'Impacts & Hits' | 'Whooshes & Risers' | 'Commercial & Cash' | 'Pop & Clicks' | 'Notification Alerts';
  durationSec: number;
  freqType: 'drop' | 'sweep' | 'chime' | 'pop' | 'bell';
  icon: string;
}

export const SFX_CATALOG: SoundEffectItem[] = [
  { id: 'cinematic-hit', name: 'Cinematic Sub-Bass Hit', category: 'Impacts & Hits', durationSec: 1.2, freqType: 'drop', icon: '💥' },
  { id: 'fast-whoosh', name: 'Fast Dynamic Whoosh', category: 'Whooshes & Risers', durationSec: 0.6, freqType: 'sweep', icon: '💨' },
  { id: 'cash-register', name: 'Ka-Ching Cash Register', category: 'Commercial & Cash', durationSec: 0.9, freqType: 'chime', icon: '💰' },
  { id: 'bubble-pop', name: 'Satisfying Bubble Pop', category: 'Pop & Clicks', durationSec: 0.3, freqType: 'pop', icon: '🫧' },
  { id: 'notification-ping', name: 'iPhone Success Ping', category: 'Notification Alerts', durationSec: 0.5, freqType: 'bell', icon: '🔔' },
  { id: 'glitch-riser', name: 'Cyber Glitch Pitch Riser', category: 'Whooshes & Risers', durationSec: 1.5, freqType: 'sweep', icon: '⚡' },
  { id: 'camera-shutter', name: 'Retro Camera Shutter', category: 'Pop & Clicks', durationSec: 0.4, freqType: 'pop', icon: '📸' },
  { id: 'record-scratch', name: 'Comedy Record Scratch', category: 'Pop & Clicks', durationSec: 0.8, freqType: 'drop', icon: '🎵' },
  { id: 'heavy-stomp', name: 'Thunder Heavy Stomp', category: 'Impacts & Hits', durationSec: 1.0, freqType: 'drop', icon: '🔨' },
  { id: 'coin-drop', name: 'Gold Coin Bounce', category: 'Commercial & Cash', durationSec: 0.7, freqType: 'chime', icon: '🪙' }
];

export const SfxSoundboardModal: React.FC<SfxSoundboardModalProps> = ({
  isOpen,
  onClose,
  onAttachSfxToTimeline
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timelineMarkerSec, setTimelineMarkerSec] = useState<number>(2.5);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [sfxLayerList, setSfxLayerList] = useState<{ id: string; name: string; timeMarker: number }[]>([
    { id: 's-1', name: 'Fast Dynamic Whoosh', timeMarker: 0.5 },
    { id: 's-2', name: 'Ka-Ching Cash Register', timeMarker: 3.2 }
  ]);

  if (!isOpen) return null;

  const categories = ['All', 'Impacts & Hits', 'Whooshes & Risers', 'Commercial & Cash', 'Pop & Clicks', 'Notification Alerts'];

  const filteredSfx = SFX_CATALOG.filter(sfx => selectedCategory === 'All' || sfx.category === selectedCategory);

  // Web Audio API Synthesizer for Immediate Audio Feedback
  const handlePlaySoundEffect = (sfx: SoundEffectItem) => {
    setActivePlayingId(sfx.id);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (sfx.freqType === 'drop') {
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + sfx.durationSec);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + sfx.durationSec);
      } else if (sfx.freqType === 'sweep') {
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + sfx.durationSec);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0.01, now + sfx.durationSec);
      } else if (sfx.freqType === 'chime' || sfx.freqType === 'bell') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + sfx.durationSec);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + sfx.durationSec);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + sfx.durationSec);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + sfx.durationSec);
      }

      osc.start(now);
      osc.stop(now + sfx.durationSec);

      setTimeout(() => setActivePlayingId(null), sfx.durationSec * 1000);
    } catch (e) {
      console.error(e);
      setActivePlayingId(null);
    }
  };

  const handleAddSfxToLayer = (sfx: SoundEffectItem) => {
    const newEntry = {
      id: `sfx-${Date.now()}`,
      name: sfx.name,
      timeMarker: timelineMarkerSec
    };
    setSfxLayerList(prev => [...prev, newEntry]);

    if (onAttachSfxToTimeline) {
      onAttachSfxToTimeline(sfx.name, sfx.category, timelineMarkerSec);
    }
  };

  const handleRemoveLayer = (id: string) => {
    setSfxLayerList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141414] w-full max-w-4xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white rounded-full shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Foley & Cinematic SFX Soundboard Studio
              </h3>
              <p className="text-xs text-[#8E918F]">Trigger risers, ka-ching chimes & bass drops synchronized with video time keyframes</p>
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
          {/* Timeline Marker Input */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1E1E1E] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">Target Timeline Marker:</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="60"
                value={timelineMarkerSec}
                onChange={(e) => setTimelineMarkerSec(Number(e.target.value))}
                className="w-20 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white text-center font-mono font-bold focus:outline-none focus:border-amber-400"
              />
              <span className="text-xs text-[#8E918F]">sec</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-black/30 border-white/5 text-[#8E918F] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Soundboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {filteredSfx.map(sfx => {
              const isPlaying = activePlayingId === sfx.id;
              return (
                <div
                  key={sfx.id}
                  className={`p-3.5 bg-[#1E1E1E] rounded-2xl border transition-all flex flex-col justify-between space-y-3 group ${
                    isPlaying ? 'border-amber-400 ring-2 ring-amber-400/30 bg-[#252018]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{sfx.icon}</span>
                    <button
                      onClick={() => handlePlaySoundEffect(sfx)}
                      className="p-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-full transition-colors"
                      title="Test Audio"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white leading-tight line-clamp-1">{sfx.name}</div>
                    <div className="text-[9px] text-[#8E918F] font-mono">{sfx.durationSec}s • {sfx.category}</div>
                  </div>

                  <button
                    onClick={() => handleAddSfxToLayer(sfx)}
                    className="w-full py-1.5 bg-black/40 hover:bg-amber-500/20 text-amber-300 border border-white/10 hover:border-amber-400/40 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add @ {timelineMarkerSec}s
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active SFX Timeline Layer Stack */}
          <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" /> Active Layered SFX Cue Markers ({sfxLayerList.length})
            </h4>

            {sfxLayerList.length === 0 ? (
              <div className="text-xs text-[#8E918F] italic py-3 text-center">No SFX cue markers added yet. Click "+ Add" on any sound card above.</div>
            ) : (
              <div className="space-y-2">
                {sfxLayerList.map(layer => (
                  <div key={layer.id} className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold font-mono">[{layer.timeMarker.toFixed(2)}s]</span>
                      <span className="text-white font-medium">{layer.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveLayer(layer.id)}
                      className="p-1 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1A1A1A] flex items-center justify-between">
          <div className="text-xs text-[#8E918F]">
            Total Layered SFX Cues: <span className="text-amber-300 font-bold">{sfxLayerList.length}</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-full text-xs shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SfxSoundboardModal;
