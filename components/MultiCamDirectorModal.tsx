import React, { useState } from 'react';
import { Video, Camera, Sparkles, RefreshCw, Check, X, Play, Square, Layers } from 'lucide-react';
import { MultiCamAngle } from '../types';

interface MultiCamDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMediaUrl?: string;
  onApplySelectedAngle?: (angle: MultiCamAngle) => void;
}

const CAM_ANGLES: MultiCamAngle[] = [
  {
    id: 'cam-1',
    label: 'A-Cam Wide Cinema Angle',
    cameraName: 'ARRI Alexa LF (35mm Prime)',
    previewUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    focalLength: '35mm T1.8',
    isSelected: true
  },
  {
    id: 'cam-2',
    label: 'B-Cam Hero Medium Shot',
    cameraName: 'RED V-Raptor (50mm Anamorphic)',
    previewUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=400&q=80',
    focalLength: '50mm T1.5',
    isSelected: false
  },
  {
    id: 'cam-3',
    label: 'C-Cam Product Macro Close-Up',
    cameraName: 'Sony FX9 (85mm Macro)',
    previewUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    focalLength: '85mm T2.0',
    isSelected: false
  },
  {
    id: 'cam-4',
    label: 'D-Cam Dynamic Overhead Crane',
    cameraName: 'DJI Inspire 3 Cinema Drone',
    previewUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80',
    focalLength: '24mm Ultra-Wide',
    isSelected: false
  }
];

const MultiCamDirectorModal: React.FC<MultiCamDirectorModalProps> = ({
  isOpen,
  onClose,
  activeMediaUrl,
  onApplySelectedAngle
}) => {
  const [angles, setAngles] = useState<MultiCamAngle[]>(CAM_ANGLES);
  const [isAiWaveformSyncing, setIsAiWaveformSyncing] = useState(false);
  const [syncSuccessNotice, setSyncSuccessNotice] = useState(false);
  const [liveCutRecording, setLiveCutRecording] = useState(false);

  if (!isOpen) return null;

  const handleSelectAngle = (id: string) => {
    setAngles(prev => prev.map(a => ({ ...a, isSelected: a.id === id })));
  };

  const handleWaveformSync = () => {
    setIsAiWaveformSyncing(true);
    setTimeout(() => {
      setIsAiWaveformSyncing(false);
      setSyncSuccessNotice(true);
      setTimeout(() => setSyncSuccessNotice(false), 2500);
    }, 1200);
  };

  const selectedAngle = angles.find(a => a.isSelected) || angles[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141414] w-full max-w-5xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 text-black rounded-full shadow-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Multi-Camera Sync & AI Scene Director Switcher
              </h3>
              <p className="text-xs text-[#8E918F]">Multi-Angle Live Switching with AI Audio Waveform Synchronization</p>
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
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E1E1E] p-4 rounded-2xl border border-white/5">
            <button
              onClick={handleWaveformSync}
              disabled={isAiWaveformSyncing}
              className="px-4 py-2 bg-emerald-400 text-black rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:bg-emerald-300"
            >
              {isAiWaveformSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isAiWaveformSyncing ? 'Aligning Audio Waveforms...' : syncSuccessNotice ? 'Audio Tracks Aligned!' : 'Auto-Sync Multi-Cam Waveforms'}
            </button>

            <button
              onClick={() => setLiveCutRecording(!liveCutRecording)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
                liveCutRecording ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-[#282828] text-[#E2E2E2] border-white/10 hover:bg-white/10'
              }`}
            >
              {liveCutRecording ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {liveCutRecording ? 'REC: Live Switching Active' : 'Start Live Director Cut'}
            </button>
          </div>

          {/* Quad View Director Switcher Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {angles.map((cam) => {
              const isSelected = cam.isSelected;
              return (
                <div
                  key={cam.id}
                  onClick={() => handleSelectAngle(cam.id)}
                  className={`bg-[#1E1E1E] p-3 rounded-2xl border cursor-pointer transition-all space-y-2 relative overflow-hidden group ${
                    isSelected ? 'border-emerald-400 ring-2 ring-emerald-400/30 bg-[#252525]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-black">
                    <img src={cam.previewUrl} alt={cam.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-mono font-bold">
                      {cam.focalLength}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-black font-bold px-2 py-0.5 rounded text-[9px] uppercase shadow">
                        PROGRAM LIVE
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white truncate">{cam.label}</div>
                    <div className="text-[10px] text-[#8E918F] truncate mt-0.5">{cam.cameraName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1A1A1A] flex items-center justify-between">
          <div className="text-xs text-[#8E918F]">
            Selected Cut: <span className="text-emerald-400 font-bold">{selectedAngle.label}</span>
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
                if (onApplySelectedAngle) onApplySelectedAngle(selectedAngle);
                onClose();
              }}
              className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Switch to Camera Cut ({selectedAngle.focalLength})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiCamDirectorModal;
