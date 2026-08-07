import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Sparkles,
  ShoppingBag,
  FileSpreadsheet,
  Layers,
  Download,
  Check,
  RefreshCw,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Sliders,
  Grid,
  List,
  ArrowRight,
  Filter,
  CheckCircle2,
  Play,
  Film,
  Image as ImageIcon,
  ExternalLink,
  Sparkle,
  Copy,
  Zap,
  DollarSign,
  Box
} from 'lucide-react';
import { generateMarketingCopy } from '../services/geminiService';

export interface CatalogProduct {
  id: string;
  sku: string;
  title: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  discountTag: string;
  imageUrl: string;
  tagline?: string;
  brandName?: string;
}

export interface GeneratedBatchAd {
  productId: string;
  productTitle: string;
  sku: string;
  format: '1080x1080' | '1080x1920' | '1200x628' | '300x250';
  mediaType: 'IMAGE' | 'VIDEO';
  previewUrl: string;
  ctaText: string;
  headline: string;
  salePriceFormatted: string;
  discountTag: string;
  brandColor: string;
  accentColor: string;
}

interface ProductCatalogBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToStudio?: (mediaUrl: string, title: string) => void;
}

const DEFAULT_SAMPLE_CATALOG: CatalogProduct[] = [
  {
    id: 'prod-1',
    sku: 'AUDIO-ANC-01',
    title: 'AuraStudio Noise-Canceling Wireless Headphones',
    category: 'Electronics',
    originalPrice: 299.99,
    salePrice: 199.99,
    discountTag: '33% OFF - FLASH SALE',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    tagline: 'Immersive sound with active noise suppression for all-day focus.',
    brandName: 'AuraStudio'
  },
  {
    id: 'prod-2',
    sku: 'SMART-WATCH-X',
    title: 'PulseFit Pro Fitness & Heart Rate Smartwatch',
    category: 'Wearables',
    originalPrice: 189.00,
    salePrice: 129.00,
    discountTag: '$60 SAVINGS',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    tagline: 'Track 50+ workout modes with 14-day battery life.',
    brandName: 'PulseFit'
  },
  {
    id: 'prod-3',
    sku: 'SERUM-GLOW-05',
    title: 'Lumina Botanical Hydrating Vitamin C Serum',
    category: 'Beauty & Skincare',
    originalPrice: 65.00,
    salePrice: 48.00,
    discountTag: 'BEST SELLER',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    tagline: 'Radiant skin glow enriched with organic antioxidants.',
    brandName: 'Lumina Organics'
  },
  {
    id: 'prod-4',
    sku: 'FOOTWEAR-RUN-99',
    title: 'AeroStride Cloud-cushioned Trail Running Shoes',
    category: 'Footwear',
    originalPrice: 160.00,
    salePrice: 119.95,
    discountTag: 'LIMITED EDITION',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    tagline: 'Ultralight carbon plate response for high-mileage runs.',
    brandName: 'AeroStride'
  },
  {
    id: 'prod-5',
    sku: 'HOME-ESPRESSO-02',
    title: 'BaristaTouch Compact Italian Espresso Maker',
    category: 'Home & Kitchen',
    originalPrice: 449.00,
    salePrice: 349.00,
    discountTag: 'SAVE $100 TODAY',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebd02f2a888?w=800&q=80',
    tagline: 'Café-quality silky crema at the touch of a button.',
    brandName: 'BaristaTouch'
  }
];

export const ProductCatalogBatchModal: React.FC<ProductCatalogBatchModalProps> = ({
  isOpen,
  onClose,
  onApplyToStudio
}) => {
  const [products, setProducts] = useState<CatalogProduct[]>(DEFAULT_SAMPLE_CATALOG);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    DEFAULT_SAMPLE_CATALOG.map(p => p.id)
  );
  
  // Filtering & view mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'catalog' | 'template' | 'results'>('catalog');

  // Ad Batch Template Settings
  const [adFormat, setAdFormat] = useState<'1080x1080' | '1080x1920' | '1200x628' | '300x250'>('1080x1080');
  const [mediaOutputType, setMediaOutputType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [templateStyle, setTemplateStyle] = useState<'flash_sale' | 'minimal_luxury' | 'ugc_spotlight' | 'split_specs'>('flash_sale');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [primaryBrandColor, setPrimaryBrandColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#f43f5e');
  const [showDiscountBadge, setShowDiscountBadge] = useState(true);
  const [showPriceStrike, setShowPriceStrike] = useState(true);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGeneratingSku, setCurrentGeneratingSku] = useState('');
  const [generatedAds, setGeneratedAds] = useState<GeneratedBatchAd[]>([]);

  // CSV Feed Import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvRawText, setCsvRawText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // New SKU manual entry modal
  const [isAddSkuOpen, setIsAddSkuOpen] = useState(false);
  const [newSkuData, setNewSkuData] = useState<Partial<CatalogProduct>>({
    title: '',
    sku: '',
    category: 'General',
    originalPrice: 99,
    salePrice: 79,
    discountTag: '20% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
    brandName: 'My Brand'
  });

  if (!isOpen) return null;

  // Categories list
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brandName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(i => i !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvData(text);
    };
    reader.readAsText(file);
  };

  const parseCsvData = (text: string) => {
    try {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return;

      const newProducts: CatalogProduct[] = [];
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 3) {
          const title = cols[0] || `Product SKU-${i}`;
          const orig = parseFloat(cols[1]) || 99.99;
          const sale = parseFloat(cols[2]) || orig * 0.8;
          const discount = cols[3] || 'SPECIAL OFFER';
          const img = cols[4] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
          const cat = cols[5] || 'Imported Feed';

          newProducts.push({
            id: `csv-${Date.now()}-${i}`,
            sku: `SKU-IMP-${100 + i}`,
            title,
            originalPrice: orig,
            salePrice: sale,
            discountTag: discount,
            imageUrl: img,
            category: cat,
            brandName: 'Catalog Import'
          });
        }
      }

      if (newProducts.length > 0) {
        setProducts(prev => [...newProducts, ...prev]);
        setSelectedProductIds(prev => [...newProducts.map(p => p.id), ...prev]);
        setIsImportModalOpen(false);
      }
    } catch (err) {
      console.error('Error parsing CSV', err);
    }
  };

  const handleAddSku = () => {
    if (!newSkuData.title) return;
    const created: CatalogProduct = {
      id: `custom-${Date.now()}`,
      sku: newSkuData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newSkuData.title,
      category: newSkuData.category || 'General',
      originalPrice: Number(newSkuData.originalPrice) || 99,
      salePrice: Number(newSkuData.salePrice) || 79,
      discountTag: newSkuData.discountTag || 'OFFER',
      imageUrl: newSkuData.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
      brandName: newSkuData.brandName || 'Brand'
    };

    setProducts([created, ...products]);
    setSelectedProductIds([created.id, ...selectedProductIds]);
    setIsAddSkuOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setSelectedProductIds(selectedProductIds.filter(i => i !== id));
  };

  // Run Batch Generation
  const handleStartBatchGeneration = async () => {
    const selectedItems = products.filter(p => selectedProductIds.includes(p.id));
    if (selectedItems.length === 0) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedAds([]);
    setActiveTab('results');

    const results: GeneratedBatchAd[] = [];

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      setCurrentGeneratingSku(item.title);

      // Simulate step progress & batch AI layout render
      await new Promise(res => setTimeout(res, 600));

      const generatedHeadline = `${item.discountTag} • ${item.title.split(' ')[0]} ${item.title.split(' ')[1] || ''}`;

      results.push({
        productId: item.id,
        productTitle: item.title,
        sku: item.sku,
        format: adFormat,
        mediaType: mediaOutputType,
        previewUrl: item.imageUrl,
        ctaText: ctaText,
        headline: generatedHeadline,
        salePriceFormatted: `$${item.salePrice.toFixed(2)}`,
        discountTag: item.discountTag,
        brandColor: primaryBrandColor,
        accentColor: accentColor
      });

      setGenerationProgress(Math.round(((i + 1) / selectedItems.length) * 100));
    }

    setGeneratedAds(results);
    setIsGenerating(false);
  };

  const handleDownloadAllZip = () => {
    // Simulate ZIP packaging download
    const blob = new Blob([
      `Product Catalog Batch Ad Export Manifest\nTotal Ads: ${generatedAds.length}\nDate: ${new Date().toISOString()}\n\n` +
      generatedAds.map((a, idx) => `[Ad ${idx + 1}] SKU: ${a.sku} | Headline: ${a.headline} | Price: ${a.salePriceFormatted} | CTA: ${a.ctaText} | Image: ${a.previewUrl}`).join('\n')
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalog_batch_ads_${adFormat}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#161618] border border-white/10 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#1f1f22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Dynamic Product Catalog Batch Ad Generator</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                  Multi-SKU Automation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Import product feed CSVs and auto-generate customized banners & short video clips for hundreds of products in seconds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Nav Tabs */}
            <div className="flex items-center bg-[#111] p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'catalog' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>1. Catalog Feed ({products.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('template')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'template' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>2. Template & Styling</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                disabled={generatedAds.length === 0 && !isGenerating}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-40 ${
                  activeTab === 'results' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Batch Results ({generatedAds.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: CATALOG FEED */}
        {activeTab === 'catalog' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
            
            {/* Top Bar Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#202023] p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search SKU, product title, or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#121214] text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#121214] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>Category: {c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-xs text-white font-bold rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Import CSV Feed</span>
                </button>

                <button
                  onClick={() => setIsAddSkuOpen(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom SKU</span>
                </button>
              </div>
            </div>

            {/* Selection Bar */}
            <div className="flex items-center justify-between text-xs text-slate-300 px-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded accent-amber-500 cursor-pointer w-4 h-4"
                />
                <label htmlFor="selectAll" className="font-bold cursor-pointer">
                  Select All ({selectedProductIds.length} / {filteredProducts.length} Selected)
                </label>
              </div>

              <div className="text-slate-400">
                Ready for batch generation
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => toggleSelectProduct(product.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex gap-3.5 ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-500/5'
                        : 'bg-[#202024] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="absolute top-3 right-3 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectProduct(product.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded accent-amber-500 cursor-pointer w-4 h-4"
                      />
                    </div>

                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0 relative">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-amber-300 border border-amber-500/30">
                        {product.discountTag}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                        {product.sku} • {product.category}
                      </div>
                      <h3 className="text-xs font-bold text-white truncate" title={product.title}>
                        {product.title}
                      </h3>
                      
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-bold text-emerald-400">
                          ${product.salePrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 truncate">
                          {product.brandName}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove SKU"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: TEMPLATE & STYLING */}
        {activeTab === 'template' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Layout & Styling Rules */}
              <div className="space-y-5 bg-[#202024] p-5 rounded-2xl border border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Ad Format & Output Types</span>
                </h3>

                {/* Format Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Target Display Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: '1080x1080', label: '1:1 Square (1080x1080)', desc: 'Instagram & Facebook Feed' },
                      { id: '1080x1920', label: '9:16 Story/Reels (1080x1920)', desc: 'TikTok, IG Reels, Shorts' },
                      { id: '1200x628', label: '1.91:1 Landscape (1200x628)', desc: 'Google Display & LinkedIn' },
                      { id: '300x250', label: 'IAB Medium Rectangle (300x250)', desc: 'Programmatic Display Banner' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setAdFormat(f.id as any)}
                        className={`p-3 text-left rounded-xl border text-xs transition-all ${
                          adFormat === f.id
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-[#141416] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-white font-bold">{f.label}</div>
                        <div className="text-[10px] text-slate-400">{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Media Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Media Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaOutputType('IMAGE')}
                      className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        mediaOutputType === 'IMAGE'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-[#141416] border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Dynamic Image Banner</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaOutputType('VIDEO')}
                      className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        mediaOutputType === 'VIDEO'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-[#141416] border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      <span>Short Motion Video Clip</span>
                    </button>
                  </div>
                </div>

                {/* Template Preset Style */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Template Layout Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'flash_sale', name: 'Flash Sale High Urgency', tag: 'High Conversion' },
                      { id: 'minimal_luxury', name: 'Minimalist Luxury Lookbook', tag: 'Clean & Sleek' },
                      { id: 'ugc_spotlight', name: 'UGC TikTok Spotlight', tag: 'Viral Organic' },
                      { id: 'split_specs', name: 'Split Feature Matrix', tag: 'Tech & Hard Goods' }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setTemplateStyle(st.id as any)}
                        className={`p-3 text-left rounded-xl border transition-all ${
                          templateStyle === st.id
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-[#141416] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs text-white font-bold">{st.name}</div>
                        <span className="text-[9px] text-amber-300 font-medium">{st.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Colors & CTA Controls */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Primary Brand Color</label>
                    <div className="flex items-center gap-2 bg-[#141416] p-2 rounded-xl border border-white/10">
                      <input
                        type="color"
                        value={primaryBrandColor}
                        onChange={(e) => setPrimaryBrandColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-white">{primaryBrandColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Accent Tag Color</label>
                    <div className="flex items-center gap-2 bg-[#141416] p-2 rounded-xl border border-white/10">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-white">{accentColor}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-[#141416] text-xs text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

              </div>

              {/* Right Column: Live SKU Template Canvas Mockup */}
              <div className="space-y-3 flex flex-col justify-center items-center">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Live Template Preview (Sample SKU)</span>
                </div>

                {/* Mock Canvas Container */}
                <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-slate-900 to-black rounded-3xl border border-amber-500/30 overflow-hidden relative shadow-2xl p-5 flex flex-col justify-between">
                  {/* Top Brand Bar */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-xs font-black uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {products[0]?.brandName || 'Brand'}
                    </span>
                    <span
                      style={{ backgroundColor: accentColor }}
                      className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider"
                    >
                      {products[0]?.discountTag || 'FLASH SALE'}
                    </span>
                  </div>

                  {/* Middle Product Image Spotlight */}
                  <div className="relative my-auto flex items-center justify-center">
                    <img
                      src={products[0]?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                      alt="Preview"
                      className="w-48 h-48 object-contain drop-shadow-2xl hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Bottom Price & Title Banner */}
                  <div className="z-10 space-y-2 bg-black/70 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10">
                    <h4 className="text-xs font-bold text-white truncate">
                      {products[0]?.title}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-emerald-400">
                          ${products[0]?.salePrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ${products[0]?.originalPrice.toFixed(2)}
                        </span>
                      </div>

                      <button
                        style={{ backgroundColor: primaryBrandColor }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1"
                      >
                        <span>{ctaText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 text-center max-w-xs">
                  This template ruleset will be applied across all <span className="text-amber-300 font-bold">{selectedProductIds.length} selected SKUs</span> automatically.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: BATCH GENERATION RESULTS */}
        {activeTab === 'results' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
            
            {/* Progress / Status banner */}
            {isGenerating ? (
              <div className="p-6 bg-amber-950/30 border border-amber-500/30 rounded-2xl space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                  <span>Batch Rendering In Progress...</span>
                </div>
                
                <p className="text-xs text-slate-300">
                  Currently rendering SKU: <span className="font-bold text-white">{currentGeneratingSku}</span>
                </p>

                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden max-w-xl mx-auto">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>

                <div className="text-xs text-amber-400 font-mono">
                  {generationProgress}% Complete
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#202024] p-4 rounded-2xl border border-white/5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Batch Generation Complete ({generatedAds.length} Ads Ready)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generated custom {adFormat} {mediaOutputType} banners for selected catalog items.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadAllZip}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All Ads (ZIP Bundle)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Rendered Ads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedAds.map((ad, idx) => (
                <div
                  key={idx}
                  className="bg-[#202024] border border-white/10 rounded-2xl p-4 space-y-3 relative group hover:border-amber-500/50 transition-all"
                >
                  <div className="aspect-square bg-black rounded-xl overflow-hidden relative border border-white/10 flex items-center justify-center">
                    <img
                      src={ad.previewUrl}
                      alt={ad.productTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay Badge */}
                    <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {ad.discountTag}
                    </span>

                    <span className="absolute bottom-2 left-2 bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold">
                      {ad.salePriceFormatted}
                    </span>

                    {/* Action on hover */}
                    {onApplyToStudio && (
                      <button
                        onClick={() => {
                          onApplyToStudio(ad.previewUrl, ad.productTitle);
                          onClose();
                        }}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs"
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Send to Studio Canvas</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-amber-400">{ad.sku}</div>
                    <h4 className="text-xs font-bold text-white truncate">{ad.productTitle}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{ad.headline}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-white/10 bg-[#1f1f22] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Selected: <span className="text-amber-300 font-bold">{selectedProductIds.length} SKUs</span>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'catalog' && (
              <button
                onClick={() => setActiveTab('template')}
                disabled={selectedProductIds.length === 0}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <span>Configure Style & Format</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {activeTab === 'template' && (
              <button
                onClick={handleStartBatchGeneration}
                disabled={selectedProductIds.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 text-xs font-extrabold rounded-2xl transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Generate Batch Ads ({selectedProductIds.length} SKUs)</span>
              </button>
            )}

            {activeTab === 'results' && (
              <button
                onClick={() => setActiveTab('catalog')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl transition-all"
              >
                Back to Catalog
              </button>
            )}
          </div>
        </div>

      </div>

      {/* CSV Import Dialog Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#1f1f22] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Import Product Catalog CSV</span>
            </h3>

            <p className="text-xs text-slate-400">
              CSV columns: <code className="text-amber-300 font-mono">Title, OriginalPrice, SalePrice, DiscountTag, ImageURL, Category</code>
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.txt"
              onChange={handleCsvFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-white/20 hover:border-amber-400 rounded-xl cursor-pointer text-center space-y-2 transition-colors"
            >
              <Upload className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs font-bold text-white">Click to upload product feed CSV</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-white/10 text-xs text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom SKU Modal */}
      {isAddSkuOpen && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#1f1f22] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Add Custom Product SKU</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-300 font-bold">Product Title</label>
                <input
                  type="text"
                  value={newSkuData.title}
                  onChange={(e) => setNewSkuData({ ...newSkuData, title: e.target.value })}
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  className="w-full bg-[#121214] text-white p-2 rounded-xl border border-white/10 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold">Original Price ($)</label>
                  <input
                    type="number"
                    value={newSkuData.originalPrice}
                    onChange={(e) => setNewSkuData({ ...newSkuData, originalPrice: parseFloat(e.target.value) })}
                    className="w-full bg-[#121214] text-white p-2 rounded-xl border border-white/10 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold">Sale Price ($)</label>
                  <input
                    type="number"
                    value={newSkuData.salePrice}
                    onChange={(e) => setNewSkuData({ ...newSkuData, salePrice: parseFloat(e.target.value) })}
                    className="w-full bg-[#121214] text-white p-2 rounded-xl border border-white/10 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold">Discount Tag</label>
                <input
                  type="text"
                  value={newSkuData.discountTag}
                  onChange={(e) => setNewSkuData({ ...newSkuData, discountTag: e.target.value })}
                  placeholder="e.g. 25% OFF"
                  className="w-full bg-[#121214] text-white p-2 rounded-xl border border-white/10 mt-1"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold">Image URL</label>
                <input
                  type="text"
                  value={newSkuData.imageUrl}
                  onChange={(e) => setNewSkuData({ ...newSkuData, imageUrl: e.target.value })}
                  className="w-full bg-[#121214] text-white p-2 rounded-xl border border-white/10 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setIsAddSkuOpen(false)}
                className="px-4 py-2 bg-white/10 text-xs text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSku}
                className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
              >
                Add SKU
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductCatalogBatchModal;
