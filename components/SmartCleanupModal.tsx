import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Check, X, Sliders, Image, Layers } from 'lucide-react';

interface SmartCleanupModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMediaUrl?: string;
  onApplyCleanup?: (cleanedUrl: string, settings: { denoise: number; textRemoval: boolean; objectRemoval: boolean }) => void;
}

const SmartCleanupModal: React.FC<SmartCleanupModalProps> = ({
  isOpen,
  onClose,
  activeMediaUrl,
  onApplyCleanup
}) => {
  const [denoiseLevel, setDenoiseLevel] = useState(65);
  const [removeBackgroundText, setRemoveBackgroundText] = useState(true);
  const [removeStaticObjects, setRemoveStaticObjects] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewApplied, setPreviewApplied] = useState(false);

  if (!isOpen) return null;

  const handleRunCleanup = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPreviewApplied(true);
    }, 1200);
  };

  const handleApply = () => {
    if (onApplyCleanup && activeMediaUrl) {
      onApplyCleanup(activeMediaUrl, {
        denoise: denoiseLevel,
        textRemoval: removeBackgroundText,
        objectRemoval: removeStaticObjects
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-2xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A8C7FA] text-[#003355] rounded-full">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#E2E2E2]">Smart Visual Cleanup</h3>
              <p className="text-xs text-[#8E918F]">Remove visual noise, background artifacts, and unwanted text from raw assets</p>
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
          {/* Media Before/After Preview */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 group flex items-center justify-center">
            {activeMediaUrl ? (
              <img
                src={activeMediaUrl}
                alt="Cleanup Preview"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  previewApplied ? 'brightness-105 contrast-105 saturate-105 blur-[0px]' : ''
                }`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#8E918F] gap-2">
                <Image className="w-12 h-12 opacity-30" />
                <span className="text-xs">No active asset selected</span>
              </div>
            )}

            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-[#A8C7FA] animate-spin" />
                <span className="text-xs font-bold text-[#E2E2E2]">Analyzing pixels & removing noise...</span>
              </div>
            )}

            {/* Badge */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#A8C7FA] border border-white/10">
              {previewApplied ? 'Enhanced Clean Preview' : 'Raw Input Asset'}
            </div>
          </div>

          {/* Sliders & Controls */}
          <div className="space-y-4 bg-[#222222] p-5 rounded-2xl border border-white/5">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#E2E2E2]">
                <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-[#A8C7FA]" /> Noise Suppression Level</span>
                <span className="text-[#A8C7FA] font-mono">{denoiseLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={denoiseLevel}
                onChange={(e) => setDenoiseLevel(Number(e.target.value))}
                className="w-full h-2 bg-[#2C2C2C] rounded-lg appearance-none cursor-pointer accent-[#A8C7FA]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center justify-between p-3 bg-[#2A2A2a] rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-xs font-medium text-[#E2E2E2]">Remove Static Text Artifacts</span>
                <input
                  type="checkbox"
                  checked={removeBackgroundText}
                  onChange={(e) => setRemoveBackgroundText(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 text-[#A8C7FA] focus:ring-0 bg-[#1E1E1E]"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#2A2A2a] rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-xs font-medium text-[#E2E2E2]">Denoise Background Glare</span>
                <input
                  type="checkbox"
                  checked={removeStaticObjects}
                  onChange={(e) => setRemoveStaticObjects(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 text-[#A8C7FA] focus:ring-0 bg-[#1E1E1E]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1E1E1E] flex items-center justify-between">
          <button
            onClick={handleRunCleanup}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-[#2C2C2C] hover:bg-white/10 text-[#E2E2E2] rounded-full text-xs font-semibold transition-colors flex items-center gap-2 border border-white/10"
          >
            <Sparkles className="w-4 h-4 text-[#A8C7FA]" /> Preview Clean Filter
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-[#8E918F] hover:text-white rounded-full text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg"
            >
              <Check className="w-4 h-4" /> Apply Smart Cleanup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCleanupModal;
