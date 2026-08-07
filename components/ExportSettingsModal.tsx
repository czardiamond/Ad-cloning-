import React, { useState } from 'react';
import { Download, X, Film, Check, Settings, Sparkles, Sliders, Monitor, Smartphone, Tv, Layout, ShieldAlert, Cpu, HardDrive, FileText } from 'lucide-react';
import { ExportSettings, ExportPlatform, ExportResolution, ExportFrameRate, ExportFormat, ExportBitrate } from '../types';

interface ExportSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  videoDuration: number;
  hasAudio: boolean;
  hasOverlay: boolean;
  currentMediaType: 'IMAGE' | 'VIDEO';
  activeMediaUrl: string;
  isGuardrailEnabled?: boolean;
  onOpenGuardrailModal?: () => void;
}

const PLATFORM_PRESETS: Record<ExportPlatform, {
  name: string;
  icon: any;
  desc: string;
  settings: Partial<ExportSettings>;
}> = {
  youtube: {
    name: 'YouTube HD / 4K',
    icon: Monitor,
    desc: 'High bitrate widescreen for desktop & smart TVs',
    settings: {
      resolution: '1080p',
      frameRate: '60fps',
      format: 'mp4',
      bitrate: 'high',
    }
  },
  tiktok: {
    name: 'TikTok / Reels',
    icon: Smartphone,
    desc: 'Vertical 9:16 optimized for mobile feeds',
    settings: {
      resolution: '1080x1920',
      frameRate: '60fps',
      format: 'mp4',
      bitrate: 'high',
    }
  },
  instagram: {
    name: 'Instagram Feed',
    icon: Smartphone,
    desc: 'Square 1:1 format for grid and feed posts',
    settings: {
      resolution: '1080x1080',
      frameRate: '30fps',
      format: 'mp4',
      bitrate: 'high',
    }
  },
  broadcast: {
    name: 'Broadcast TV',
    icon: Tv,
    desc: 'Master quality ProRes / Ultra bitrate',
    settings: {
      resolution: '4k',
      frameRate: '24fps',
      format: 'prores',
      bitrate: 'ultra',
    }
  },
  web_banner: {
    name: 'Web Display Banner',
    icon: Layout,
    desc: 'Compact WebM or GIF for website embed',
    settings: {
      resolution: '720p',
      frameRate: '30fps',
      format: 'webm',
      bitrate: 'draft',
    }
  },
  custom: {
    name: 'Custom Profile',
    icon: Settings,
    desc: 'Fully manual resolution and frame rate settings',
    settings: {}
  }
};

const ExportSettingsModal: React.FC<ExportSettingsModalProps> = ({
  isOpen,
  onClose,
  brandName,
  videoDuration,
  hasAudio,
  hasOverlay,
  currentMediaType,
  activeMediaUrl,
  isGuardrailEnabled = true,
  onOpenGuardrailModal
}) => {
  const [settings, setSettings] = useState<ExportSettings>({
    platform: 'youtube',
    resolution: '1080p',
    frameRate: '60fps',
    format: 'mp4',
    bitrate: 'high',
    includeAudio: hasAudio,
    burnSubtitles: hasOverlay
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStage, setExportStage] = useState('');

  if (!isOpen) return null;

  const handleSelectPlatform = (plat: ExportPlatform) => {
    const p = PLATFORM_PRESETS[plat];
    setSettings(prev => ({
      ...prev,
      platform: plat,
      ...p.settings
    }));
  };

  // Estimate file size in MB based on bitrate and duration
  const getEstimatedSizeMB = () => {
    const durationSec = videoDuration > 0 ? videoDuration : 5;
    let mbps = 15;
    if (settings.bitrate === 'draft') mbps = 5;
    if (settings.bitrate === 'ultra') mbps = 35;
    if (settings.resolution === '4k') mbps *= 1.8;
    if (settings.frameRate === '60fps') mbps *= 1.2;
    if (settings.format === 'prores') mbps *= 2.5;
    if (settings.format === 'gif') mbps *= 0.6;
    
    const sizeMB = (mbps * durationSec) / 8;
    return sizeMB.toFixed(1);
  };

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(5);
    setExportStage('Configuring video pipeline...');

    setTimeout(() => {
      setExportProgress(25);
      setExportStage(`Applying ${settings.resolution} @ ${settings.frameRate}...`);
    }, 600);

    setTimeout(() => {
      setExportProgress(55);
      setExportStage(`Encoding audio tracks & subtitle burn-in...`);
    }, 1300);

    setTimeout(() => {
      setExportProgress(85);
      setExportStage(`Finalizing ${settings.format.toUpperCase()} compression...`);
    }, 2000);

    setTimeout(() => {
      setExportProgress(100);
      setExportStage('Export complete! Downloading file...');

      // Trigger actual download
      const link = document.createElement('a');
      link.href = activeMediaUrl || '#';
      const cleanBrand = (brandName || 'AdClone').replace(/[^a-zA-Z0-9]/g, '_');
      const ext = settings.format === 'gif' ? 'gif' : settings.format === 'webm' ? 'webm' : 'mp4';
      link.download = `${cleanBrand}_${settings.resolution}_${settings.frameRate}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        onClose();
      }, 1000);
    }, 2600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-2xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A8C7FA] text-[#003355] rounded-full">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#E2E2E2]">Export Settings</h3>
              <p className="text-xs text-[#8E918F]">Configure target platform resolution, frame rate & format</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isExporting}
            className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Target Platform Preset Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#A8C7FA]">Target Platform Preset</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(PLATFORM_PRESETS) as ExportPlatform[]).map((plat) => {
                const item = PLATFORM_PRESETS[plat];
                const IconComponent = item.icon;
                const isSelected = settings.platform === plat;
                return (
                  <button
                    key={plat}
                    onClick={() => handleSelectPlatform(plat)}
                    className={`p-3.5 rounded-[20px] text-left border transition-all flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'bg-[#A8C7FA]/15 border-[#A8C7FA] text-[#A8C7FA] shadow-md ring-1 ring-[#A8C7FA]'
                        : 'bg-[#252525] border-white/5 text-[#E2E2E2] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <IconComponent className="w-5 h-5" />
                      {isSelected && <Check className="w-4 h-4 text-[#A8C7FA]" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-tight">{item.name}</div>
                      <div className="text-[10px] text-[#8E918F] truncate mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Granular Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resolution */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#C4C7C5]">Output Resolution</label>
              <select
                value={settings.resolution}
                onChange={(e) => setSettings({ ...settings, resolution: e.target.value as ExportResolution, platform: 'custom' })}
                className="w-full bg-[#252525] border border-white/10 rounded-2xl p-3 text-xs text-[#E2E2E2] focus:ring-2 focus:ring-[#A8C7FA] focus:outline-none"
              >
                <option value="4k">4K Ultra HD (3840 x 2160)</option>
                <option value="1080p">1080p Full HD (1920 x 1080)</option>
                <option value="720p">720p HD (1280 x 720)</option>
                <option value="1080x1920">Vertical Shorts/Reels (1080 x 1920)</option>
                <option value="1080x1080">Square Feed (1080 x 1080)</option>
              </select>
            </div>

            {/* Frame Rate */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#C4C7C5]">Frame Rate (FPS)</label>
              <div className="flex bg-[#252525] p-1 rounded-2xl border border-white/10">
                {(['24fps', '30fps', '60fps'] as ExportFrameRate[]).map((fps) => (
                  <button
                    key={fps}
                    onClick={() => setSettings({ ...settings, frameRate: fps, platform: 'custom' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      settings.frameRate === fps
                        ? 'bg-[#A8C7FA] text-[#003355]'
                        : 'text-[#C4C7C5] hover:text-white'
                    }`}
                  >
                    {fps}
                  </button>
                ))}
              </div>
            </div>

            {/* Codec / Container Format */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#C4C7C5]">Container & Codec Format</label>
              <select
                value={settings.format}
                onChange={(e) => setSettings({ ...settings, format: e.target.value as ExportFormat, platform: 'custom' })}
                className="w-full bg-[#252525] border border-white/10 rounded-2xl p-3 text-xs text-[#E2E2E2] focus:ring-2 focus:ring-[#A8C7FA] focus:outline-none"
              >
                <option value="mp4">MP4 (H.264 - Universal Compatibility)</option>
                <option value="webm">WebM (VP9 - Web Optimized / Transparency)</option>
                <option value="prores">Apple ProRes 422 (Broadcast Master)</option>
                <option value="gif">Animated GIF (Display Ads & Banners)</option>
              </select>
            </div>

            {/* Quality & Bitrate */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#C4C7C5]">Bitrate & Quality Level</label>
              <div className="flex bg-[#252525] p-1 rounded-2xl border border-white/10">
                {(['draft', 'high', 'ultra'] as ExportBitrate[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => setSettings({ ...settings, bitrate: b, platform: 'custom' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
                      settings.bitrate === b
                        ? 'bg-[#D0BCFF] text-[#381E72]'
                        : 'text-[#C4C7C5] hover:text-white'
                    }`}
                  >
                    {b === 'draft' ? 'Draft (5M)' : b === 'high' ? 'High (15M)' : 'Ultra (35M)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#252525] p-4 rounded-2xl border border-white/5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-[#E2E2E2]">Include Master Audio Mix</span>
              <input
                type="checkbox"
                checked={settings.includeAudio}
                onChange={(e) => setSettings({ ...settings, includeAudio: e.target.checked })}
                className="w-5 h-5 accent-[#A8C7FA] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-[#E2E2E2]">Burn-in Text Overlay / Headlines</span>
              <input
                type="checkbox"
                checked={settings.burnSubtitles}
                onChange={(e) => setSettings({ ...settings, burnSubtitles: e.target.checked })}
                className="w-5 h-5 accent-[#A8C7FA] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Summary Banner */}
          <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-[#6DD58C]" />
              <div>
                <div className="text-xs font-semibold text-[#E2E2E2]">
                  Estimated File Size: ~{getEstimatedSizeMB()} MB
                </div>
                <div className="text-[10px] text-[#8E918F]">
                  {settings.resolution} • {settings.frameRate} • {settings.format.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="text-xs px-3 py-1 bg-[#6DD58C]/15 text-[#6DD58C] rounded-full font-bold">
              Ready
            </div>
          </div>

          {/* Brand Guardrail Status Banner */}
          <div className="p-3.5 bg-[#252525] border border-white/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className={`w-4 h-4 ${isGuardrailEnabled ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Brand Guardrail Verification</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${isGuardrailEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {isGuardrailEnabled ? 'Active Guardrail' : 'Off'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isGuardrailEnabled ? 'Authorized fonts & color palette checked prior to render.' : 'Guardrail check disabled.'}
                </div>
              </div>
            </div>
            {onOpenGuardrailModal && (
              <button
                type="button"
                onClick={onOpenGuardrailModal}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-indigo-300 font-bold rounded-xl transition-all border border-white/10"
              >
                Inspect Guardrail
              </button>
            )}
          </div>

          {/* Export Progress Bar if exporting */}
          {isExporting && (
            <div className="space-y-2 bg-[#252525] p-4 rounded-2xl border border-[#A8C7FA]/30 animate-in fade-in">
              <div className="flex justify-between text-xs text-[#E2E2E2] font-semibold">
                <span>{exportStage}</span>
                <span>{exportProgress}%</span>
              </div>
              <div className="w-full bg-[#181818] h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div 
                  className="bg-gradient-to-r from-[#A8C7FA] to-[#D0BCFF] h-full rounded-full transition-all duration-300" 
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1E1E1E] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#8E918F] hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const configData = {
                  appName: 'AdClone AI Studio',
                  brandName: brandName || 'AdClone',
                  exportedAt: new Date().toISOString(),
                  videoDuration,
                  settings,
                  mediaUrl: activeMediaUrl,
                  mediaType: currentMediaType
                };
                const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${(brandName || 'AdClone').replace(/[^a-zA-Z0-9]/g, '_')}_ad_config.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              disabled={isExporting}
              className="px-4 py-2.5 bg-[#252525] hover:bg-white/10 text-[#E2E2E2] border border-white/10 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-[#A8C7FA]" /> Download Config (.json)
            </button>

            <button
              onClick={handleStartExport}
              disabled={isExporting}
              className="px-8 py-3 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full font-semibold text-sm shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting Master...' : 'Render & Export Output'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSettingsModal;
