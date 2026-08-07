import React, { useState } from 'react';
import { Volume2, VolumeX, Sliders, Radio, Music, Mic, Zap, Check, X, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { AudioTrackLayer } from '../types';

interface SpatialAudioEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAudioEngine?: (layers: AudioTrackLayer[]) => void;
}

const INITIAL_TRACKS: AudioTrackLayer[] = [
  { id: 'tr-1', name: 'Primary Dialogue / AI Voiceover', category: 'dialogue', volume: 90, panX: 0, panY: 20, isMuted: false, isSolo: false, lufsMeter: -18 },
  { id: 'tr-[#2]', name: 'Hollywood Film Score (Atmos)', category: 'score', volume: 65, panX: -30, panY: -40, isMuted: false, isSolo: false, lufsMeter: -24 },
  { id: 'tr-3', name: 'Product Foley & Impact SFX', category: 'sfx', volume: 75, panX: 45, panY: 10, isMuted: false, isSolo: false, lufsMeter: -20 },
  { id: 'tr-4', name: '3D Cinematic Ambience', category: 'ambience', volume: 40, panX: 0, panY: -80, isMuted: false, isSolo: false, lufsMeter: -30 }
];

const SpatialAudioEngineModal: React.FC<SpatialAudioEngineModalProps> = ({
  isOpen,
  onClose,
  onApplyAudioEngine
}) => {
  const [tracks, setTracks] = useState<AudioTrackLayer[]>(INITIAL_TRACKS);
  const [loudnessStandard, setLoudnessStandard] = useState<'EBU_R128' | 'ATSC_A85' | 'STREAMING'>('EBU_R128');
  const [aiNoiseIsolation, setAiNoiseIsolation] = useState(true);
  const [deReverbLevel, setDeReverbLevel] = useState(80);
  const [activePanTrackId, setActivePanTrackId] = useState<string>('tr-1');

  if (!isOpen) return null;

  const handleVolumeChange = (id: string, vol: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, volume: vol } : t));
  };

  const handleToggleMute = (id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, isMuted: !t.isMuted } : t));
  };

  const activeTrack = tracks.find(t => t.id === activePanTrackId) || tracks[0];

  const handlePanMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 200 - 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * -200 + 100);
    setTracks(prev => prev.map(t => t.id === activeTrack.id ? { ...t, panX: x, panY: y } : t));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141414] w-full max-w-5xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-500 text-black rounded-full shadow-lg">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Dolby Atmos 3D Spatial Audio & Multi-Track Studio
              </h3>
              <p className="text-xs text-[#8E918F]">Spatial 360 Sound Stage Panning, EBU R128 Loudness Metering & AI Speech Isolation</p>
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
          {/* Top Controls: Broadcast Standard & AI Cleanup */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E1E1E] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider">Loudness Target:</span>
              <div className="flex bg-[#121212] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setLoudnessStandard('EBU_R128')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    loudnessStandard === 'EBU_R128' ? 'bg-[#A8C7FA] text-[#003355]' : 'text-[#8E918F] hover:text-white'
                  }`}
                >
                  EBU R128 (-24 LUFS Cinema)
                </button>
                <button
                  onClick={() => setLoudnessStandard('STREAMING')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    loudnessStandard === 'STREAMING' ? 'bg-[#A8C7FA] text-[#003355]' : 'text-[#8E918F] hover:text-white'
                  }`}
                >
                  Streaming (-14 LUFS)
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-emerald-400 cursor-pointer">
              <input
                type="checkbox"
                checked={aiNoiseIsolation}
                onChange={(e) => setAiNoiseIsolation(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 text-emerald-400 focus:ring-0 bg-black"
              />
              <Sparkles className="w-3.5 h-3.5" /> AI Neural Speech Isolation Active
            </label>
          </div>

          {/* Grid Layout: Tracks Mixer + 3D Spatial Panner Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tracks Column (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-[#E2E2E2] uppercase tracking-wider">Multi-Track Audio Console</h4>
              <div className="space-y-2.5">
                {tracks.map((track) => {
                  const isSelectedForPan = track.id === activePanTrackId;
                  return (
                    <div
                      key={track.id}
                      onClick={() => setActivePanTrackId(track.id)}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 cursor-pointer ${
                        isSelectedForPan ? 'bg-[#222222] border-cyan-400 ring-2 ring-cyan-400/20' : 'bg-[#1E1E1E] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleMute(track.id);
                            }}
                            className={`p-1.5 rounded-lg border text-xs font-bold ${
                              track.isMuted ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-black/40 border-white/10 text-[#8E918F] hover:text-white'
                            }`}
                          >
                            {track.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                          <span className="text-xs font-bold text-white">{track.name}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-cyan-400 font-mono font-bold">
                            Pan: [{track.panX}, {track.panY}]
                          </span>
                          <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {track.lufsMeter} LUFS
                          </span>
                        </div>
                      </div>

                      {/* Volume Slider & Peak Indicator */}
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={track.isMuted ? 0 : track.volume}
                          onChange={(e) => handleVolumeChange(track.id, Number(e.target.value))}
                          className="w-full accent-cyan-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-white w-8 text-right">
                          {track.isMuted ? '0' : track.volume}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3D Spatial Audio Stage Visualizer */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#E2E2E2] uppercase tracking-wider">Dolby Atmos 360° Spatial Stage</h4>
              <div className="bg-[#121212] p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="text-[10px] text-[#8E918F]">
                  Selected: <strong className="text-cyan-400">{activeTrack.name}</strong>. Click/drag inside the circle to position audio source in 3D space.
                </div>

                {/* 3D Circular Spatial Canvas */}
                <div
                  onClick={handlePanMove}
                  className="aspect-square w-full bg-[#0A0A0A] rounded-full border-2 border-dashed border-cyan-500/30 relative flex items-center justify-center cursor-crosshair overflow-hidden group shadow-inner"
                >
                  {/* Listener Position (Center Head) */}
                  <div className="w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300 z-10 shadow-lg">
                    YOU
                  </div>

                  {/* Grid Rings */}
                  <div className="absolute w-2/3 h-2/3 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute w-1/3 h-1/3 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-y-0 w-px bg-white/5 pointer-events-none" />
                  <div className="absolute inset-x-0 h-px bg-white/5 pointer-events-none" />

                  {/* Audio Track Object Dot */}
                  <div
                    className="absolute w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-black font-bold text-[9px] flex items-center justify-center shadow-lg -translate-x-1/2 -translate-y-1/2 transition-all duration-150 animate-pulse"
                    style={{
                      left: `${(activeTrack.panX + 100) / 2}%`,
                      top: `${(-activeTrack.panY + 100) / 2}%`
                    }}
                  >
                    3D
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-[#8E918F] font-mono pt-1">
                  <span>LEFT / RIGHT: {activeTrack.panX}</span>
                  <span>FRONT / REAR: {activeTrack.panY}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1A1A1A] flex items-center justify-between">
          <div className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Cinema Loudness Compliant (-24 LUFS)
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
                if (onApplyAudioEngine) onApplyAudioEngine(tracks);
                onClose();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-black rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Apply Dolby Atmos Spatial Mix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpatialAudioEngineModal;
