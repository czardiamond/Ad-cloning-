import React, { useState } from 'react';
import { Search, Image as ImageIcon, Palette, Type, Plus, Check, Sparkles, FolderOpen, Tag, Trash2, ArrowUpRight, ShieldCheck, Wand2 } from 'lucide-react';

export interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'color' | 'font' | 'graphic';
  value: string; // URL for images, Hex for colors, Font family name for fonts
  category: string;
}

interface BrandAssetsPanelProps {
  onApplyColor?: (colorHex: string) => void;
  onApplyFont?: (fontName: string) => void;
  onApplyLogo?: (logoUrl: string) => void;
  onOpenGuardrail?: () => void;
  onOpenOneClickRefinement?: () => void;
}

const DEFAULT_ASSETS: BrandAsset[] = [
  { id: '1', name: 'Primary Tech Blue', type: 'color', value: '#A8C7FA', category: 'Palette' },
  { id: '2', name: 'Neon Cyber Purple', type: 'color', value: '#D0BCFF', category: 'Palette' },
  { id: '3', name: 'Dark Studio Canvas', type: 'color', value: '#121212', category: 'Palette' },
  { id: '4', name: 'Emerald High Converting Green', type: 'color', value: '#34D399', category: 'Palette' },
  { id: '5', name: 'Inter Bold Display', type: 'font', value: 'Inter, sans-serif', category: 'Typography' },
  { id: '6', name: 'Plus Jakarta Sans Display', type: 'font', value: "'Plus Jakarta Sans', sans-serif", category: 'Typography' },
  { id: '7', name: 'Playfair Luxury Serif', type: 'font', value: "'Playfair Display', serif", category: 'Typography' },
  { id: '8', name: 'Space Grotesk Modern Tech', type: 'font', value: "'Space Grotesk', sans-serif", category: 'Typography' },
  { id: '9', name: 'AdClone Vector Badge', type: 'logo', value: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80', category: 'Logos' },
  { id: '10', name: 'Verified Brand Seal', type: 'graphic', value: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=80', category: 'Badges' }
];

export const BrandAssetsPanel: React.FC<BrandAssetsPanelProps> = ({
  onApplyColor,
  onApplyFont,
  onApplyLogo,
  onOpenGuardrail,
  onOpenOneClickRefinement
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'color' | 'font' | 'logo' | 'graphic'>('all');
  const [assets, setAssets] = useState<BrandAsset[]>(DEFAULT_ASSETS);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  // New asset inputs
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetValue, setNewAssetValue] = useState('');
  const [newAssetType, setNewAssetType] = useState<'color' | 'font' | 'logo' | 'graphic'>('color');

  const filteredAssets = assets.filter(asset => {
    const matchesQuery = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || asset.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || asset.type === activeFilter;
    return matchesQuery && matchesFilter;
  });

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim() || !newAssetValue.trim()) return;

    const newAsset: BrandAsset = {
      id: `asset-${Date.now()}`,
      name: newAssetName.trim(),
      type: newAssetType,
      value: newAssetValue.trim(),
      category: 'Custom Upload'
    };

    setAssets(prev => [newAsset, ...prev]);
    setNewAssetName('');
    setNewAssetValue('');
  };

  const handleApply = (asset: BrandAsset) => {
    setAppliedId(asset.id);
    if (asset.type === 'color' && onApplyColor) onApplyColor(asset.value);
    if (asset.type === 'font' && onApplyFont) onApplyFont(asset.value);
    if ((asset.type === 'logo' || asset.type === 'graphic') && onApplyLogo) onApplyLogo(asset.value);

    setTimeout(() => setAppliedId(null), 1500);
  };

  return (
    <div className="space-y-4">
      {/* One-Click AI Asset Refinement Button */}
      {onOpenOneClickRefinement && (
        <button
          type="button"
          onClick={onOpenOneClickRefinement}
          className="w-full p-3 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 hover:from-indigo-600/40 hover:to-pink-600/40 border border-purple-500/40 hover:border-purple-400 rounded-2xl flex items-center justify-between text-xs font-bold text-white transition-all shadow-lg shadow-purple-500/10 group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span>One-Click AI Refinement</span>
                <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-300 font-normal">Denoise, boost color & compress size</p>
            </div>
          </div>
          <span className="text-[10px] bg-white/10 group-hover:bg-white/20 text-indigo-200 px-2.5 py-1 rounded-xl font-bold uppercase tracking-wider border border-white/10">
            Refine
          </span>
        </button>
      )}

      {/* Brand Guardrail Quick Action */}
      {onOpenGuardrail && (
        <button
          type="button"
          onClick={onOpenGuardrail}
          className="w-full p-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Brand Guardrail Inspector</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full uppercase">Check Ad</span>
        </button>
      )}

      {/* Search & Filter Header */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8E918F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logos, colors, fonts & graphics..."
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#E2E2E2] focus:ring-2 focus:ring-[#A8C7FA] focus:outline-none"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto no-scrollbar py-1 text-[11px]">
          {(['all', 'color', 'font', 'logo', 'graphic'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-full capitalize font-semibold transition-colors flex-shrink-0 ${
                activeFilter === filter
                  ? 'bg-[#A8C7FA] text-[#003355]'
                  : 'bg-white/5 text-[#8E918F] hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => handleApply(asset)}
            className="p-2.5 bg-[#222222] hover:bg-[#2A2A2A] border border-white/5 hover:border-white/15 rounded-xl cursor-pointer transition-all flex flex-col justify-between group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8E918F] uppercase font-bold tracking-wider">{asset.type}</span>
              {appliedId === asset.id ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8E918F] group-hover:text-white transition-colors" />
              )}
            </div>

            {asset.type === 'color' && (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: asset.value }} />
                <span className="text-xs font-mono font-bold text-white truncate">{asset.value}</span>
              </div>
            )}

            {asset.type === 'font' && (
              <div className="text-xs font-semibold text-white truncate" style={{ fontFamily: asset.value }}>
                {asset.name}
              </div>
            )}

            {(asset.type === 'logo' || asset.type === 'graphic') && (
              <div className="flex items-center gap-2">
                <img src={asset.value} alt={asset.name} className="w-6 h-6 rounded object-cover border border-white/10" />
                <span className="text-xs font-semibold text-white truncate">{asset.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Quick Asset Form */}
      <form onSubmit={handleAddAsset} className="p-3 bg-[#1E1E1E] border border-white/5 rounded-2xl space-y-2">
        <div className="text-[11px] font-bold text-[#A8C7FA] flex items-center justify-between">
          <span>+ Add Custom Brand Asset</span>
          <select
            value={newAssetType}
            onChange={(e) => setNewAssetType(e.target.value as any)}
            className="bg-[#2A2A2A] text-[10px] text-[#E2E2E2] px-2 py-0.5 rounded border border-white/10 focus:outline-none"
          >
            <option value="color">Color Hex</option>
            <option value="font">Font Family</option>
            <option value="logo">Logo URL</option>
            <option value="graphic">Graphic URL</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={newAssetName}
            onChange={(e) => setNewAssetName(e.target.value)}
            placeholder="Asset Name..."
            className="bg-[#141414] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
          />
          <input
            type="text"
            value={newAssetValue}
            onChange={(e) => setNewAssetValue(e.target.value)}
            placeholder={newAssetType === 'color' ? '#FF5733' : 'Value/URL'}
            className="bg-[#141414] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-1.5 bg-[#A8C7FA]/15 hover:bg-[#A8C7FA]/25 text-[#A8C7FA] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Save Asset to Library
        </button>
      </form>
    </div>
  );
};

export default BrandAssetsPanel;
