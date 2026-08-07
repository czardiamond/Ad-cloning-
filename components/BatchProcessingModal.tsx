import React, { useState } from 'react';
import { Layers, X, Upload, Play, CheckCircle2, Loader2, AlertCircle, Download, Film, Sparkles, FolderOpen, ArrowRight, Trash2 } from 'lucide-react';
import { BatchItem, EditorPreset, MediaType, PresetCategory } from '../types';

interface BatchProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: EditorPreset[];
  onApplyBatchResults?: (items: BatchItem[]) => void;
}

const BatchProcessingModal: React.FC<BatchProcessingModalProps> = ({
  isOpen,
  onClose,
  presets,
  onApplyBatchResults
}) => {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([
    {
      id: 'batch-1',
      fileName: 'Summer_Sneakers_Promo_Raw.mp4',
      fileSize: '14.2 MB',
      fileType: MediaType.VIDEO,
      previewUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      targetBrand: 'Nike Sportswear',
      presetId: 'preset-social-1',
      presetName: 'TikTok Punchy Zoom',
      status: 'pending',
      progress: 0
    },
    {
      id: 'batch-2',
      fileName: 'Luxury_Watch_Commercial_4K.mp4',
      fileSize: '32.8 MB',
      fileType: MediaType.VIDEO,
      previewUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      targetBrand: 'Rolex Luxe',
      presetId: 'preset-cinematic-1',
      presetName: 'Cinematic Noir',
      status: 'pending',
      progress: 0
    }
  ]);

  const [selectedBatchCategory, setSelectedBatchCategory] = useState<PresetCategory>('Social Media');
  const [selectedGlobalPresetId, setSelectedGlobalPresetId] = useState<string>(presets[0]?.id || 'preset-social-1');
  const [globalBrand, setGlobalBrand] = useState<string>('AdClone Global');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newItems: BatchItem[] = files.map((fileObj, idx) => {
      const f = fileObj as File;
      const isVid = f.type.includes('video');
      const chosenPreset = presets.find(p => p.id === selectedGlobalPresetId) || presets[0];
      return {
        id: `batch-user-${Date.now()}-${idx}`,
        fileName: f.name,
        fileSize: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: isVid ? MediaType.VIDEO : MediaType.IMAGE,
        previewUrl: URL.createObjectURL(f),
        targetBrand: globalBrand,
        presetId: chosenPreset.id,
        presetName: chosenPreset.name,
        status: 'pending',
        progress: 0
      };
    });
    setBatchItems(prev => [...prev, ...newItems]);
  };

  const handleApplyPresetToAll = (presetId: string) => {
    const p = presets.find(pr => pr.id === presetId);
    if (!p) return;
    setSelectedGlobalPresetId(presetId);
    setBatchItems(prev => prev.map(item => ({
      ...item,
      presetId: p.id,
      presetName: p.name
    })));
  };

  const handleStartBatchProcessing = async () => {
    setIsProcessing(true);

    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      if (item.status === 'completed') continue;

      // Set current item status to processing
      setBatchItems(prev => prev.map(b => b.id === item.id ? { ...b, status: 'processing', progress: 10 } : b));

      // Simulate sequential progress ticks
      await new Promise(r => setTimeout(r, 600));
      setBatchItems(prev => prev.map(b => b.id === item.id ? { ...b, progress: 45 } : b));

      await new Promise(r => setTimeout(r, 700));
      setBatchItems(prev => prev.map(b => b.id === item.id ? { ...b, progress: 80 } : b));

      await new Promise(r => setTimeout(r, 600));
      setBatchItems(prev => prev.map(b => b.id === item.id ? { 
        ...b, 
        status: 'completed', 
        progress: 100, 
        resultUrl: b.previewUrl 
      } : b));
    }

    setIsProcessing(false);
  };

  const handleRemoveBatchItem = (id: string) => {
    setBatchItems(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-3xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A8C7FA] text-[#003355] rounded-full">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#E2E2E2]">Batch Asset Processing Queue</h3>
              <p className="text-xs text-[#8E918F]">Apply category-specific presets to multiple raw video/image assets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Configuration Controls */}
        <div className="p-6 pb-4 bg-[#222222] border-b border-white/5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#C4C7C5]">Global Target Brand Name</label>
              <input
                type="text"
                value={globalBrand}
                onChange={(e) => setGlobalBrand(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E2E2E2]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#C4C7C5]">Apply Category Preset To All</label>
              <select
                value={selectedGlobalPresetId}
                onChange={(e) => handleApplyPresetToAll(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E2E2E2]"
              >
                {presets.map(p => (
                  <option key={p.id} value={p.id}>[{p.category}] {p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload Drop Zone */}
          <div className="relative border-2 border-dashed border-white/10 hover:border-[#A8C7FA]/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#181818]/60">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center gap-2 text-xs text-[#A8C7FA]">
              <Upload className="w-4 h-4" />
              <span className="font-semibold">Drag & Drop or Click to Upload Raw Assets</span>
            </div>
          </div>
        </div>

        {/* Queue Items List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {batchItems.length > 0 ? (
            batchItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-[#252525] p-4 rounded-2xl border border-white/5 space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 bg-[#181818] rounded-xl overflow-hidden border border-white/10 flex-shrink-0 relative">
                      {item.previewUrl ? (
                        <img src={item.previewUrl} alt={item.fileName} className="w-full h-full object-cover" />
                      ) : (
                        <Film className="w-5 h-5 text-[#8E918F] m-auto" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="text-xs font-bold text-[#E2E2E2] truncate">{item.fileName}</div>
                      <div className="text-[10px] text-[#8E918F] flex items-center gap-2 mt-0.5">
                        <span>{item.fileSize}</span>
                        <span>• Preset: <strong className="text-[#A8C7FA]">{item.presetName}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Status Badge */}
                    {item.status === 'pending' && (
                      <span className="px-3 py-1 bg-white/10 text-[#8E918F] rounded-full text-[10px] font-bold uppercase">
                        Pending
                      </span>
                    )}
                    {item.status === 'processing' && (
                      <span className="px-3 py-1 bg-[#A8C7FA]/20 text-[#A8C7FA] rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> {item.progress}%
                      </span>
                    )}
                    {item.status === 'completed' && (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    )}

                    <button
                      onClick={() => handleRemoveBatchItem(item.id)}
                      disabled={isProcessing}
                      className="p-1.5 hover:bg-white/10 text-[#8E918F] hover:text-red-400 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {item.status === 'processing' && (
                  <div className="w-full bg-[#181818] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#A8C7FA] h-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-2 text-[#8E918F]">
              <FolderOpen className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">No assets in the batch queue. Upload files above to get started.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1E1E1E] flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#8E918F] hover:bg-white/10 transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleStartBatchProcessing}
            disabled={isProcessing || batchItems.length === 0}
            className="px-8 py-3 bg-[#A8C7FA] hover:bg-[#D0BCFF] disabled:opacity-40 text-[#003355] rounded-full font-bold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-current" />}
            {isProcessing ? 'Processing Queue...' : `Process All Assets (${batchItems.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessingModal;
