import React, { useState } from 'react';
import { Send, BarChart3, DollarSign, Target, TrendingUp, CheckCircle2, RefreshCw, X, ArrowUpRight, Play, Pause } from 'lucide-react';
import { AdPublishCampaign } from '../types';

interface AdPublishAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
}

const CAMPAIGNS: AdPublishCampaign[] = [
  {
    id: 'camp-1',
    platform: 'meta',
    campaignName: 'Meta Feed - Q3 Product Launch',
    dailyBudget: 250,
    status: 'Active',
    roas: 4.85,
    ctr: 3.82,
    cpa: '$12.40',
    impressions: 148200,
    clicks: 5661,
    spend: '$1,240.00'
  },
  {
    id: 'camp-2',
    platform: 'tiktok',
    campaignName: 'TikTok Spark Ads - Gen-Z Hook',
    dailyBudget: 180,
    status: 'Active',
    roas: 5.12,
    ctr: 4.15,
    cpa: '$9.90',
    impressions: 210500,
    clicks: 8735,
    spend: '$980.00'
  },
  {
    id: 'camp-3',
    platform: 'youtube',
    campaignName: 'YouTube Shorts - High Intent Retargeting',
    dailyBudget: 300,
    status: 'Optimizing',
    roas: 3.90,
    ctr: 2.95,
    cpa: '$15.60',
    impressions: 92400,
    clicks: 2725,
    spend: '$850.00'
  }
];

const AdPublishAnalyticsModal: React.FC<AdPublishAnalyticsModalProps> = ({
  isOpen,
  onClose,
  brandName
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'meta' | 'tiktok' | 'youtube'>('meta');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [dailyBudgetInput, setDailyBudgetInput] = useState(200);

  if (!isOpen) return null;

  const handleLaunchCampaign = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-4xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A8C7FA] text-[#003355] rounded-full">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#E2E2E2]">Direct Ad Manager Publishing & Analytics</h3>
              <p className="text-xs text-[#8E918F]">Deploy creatives directly to Meta, TikTok & YouTube Ads with live campaign performance metrics</p>
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
          {/* Live Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#222222] p-4 rounded-2xl border border-white/5 space-y-1">
              <div className="text-[10px] text-[#8E918F] font-bold uppercase tracking-wider">Average ROAS</div>
              <div className="text-2xl font-black text-emerald-400">4.62x</div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +18.4% vs last week
              </div>
            </div>

            <div className="bg-[#222222] p-4 rounded-2xl border border-white/5 space-y-1">
              <div className="text-[10px] text-[#8E918F] font-bold uppercase tracking-wider">Average CTR</div>
              <div className="text-2xl font-black text-[#A8C7FA]">3.64%</div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Top 5% Industry Benchmark
              </div>
            </div>

            <div className="bg-[#222222] p-4 rounded-2xl border border-white/5 space-y-1">
              <div className="text-[10px] text-[#8E918F] font-bold uppercase tracking-wider">Total Impressions</div>
              <div className="text-2xl font-black text-[#D0BCFF]">451,100</div>
              <div className="text-[10px] text-[#8E918F]">Across active platforms</div>
            </div>

            <div className="bg-[#222222] p-4 rounded-2xl border border-white/5 space-y-1">
              <div className="text-[10px] text-[#8E918F] font-bold uppercase tracking-wider">Total Ad Spend</div>
              <div className="text-2xl font-black text-[#E2E2E2]">$3,070</div>
              <div className="text-[10px] text-emerald-400">3 Campaigns Running</div>
            </div>
          </div>

          {/* Platform Publishing Controls */}
          <div className="bg-[#222222] p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider">One-Click Platform Deployment</h4>
              {publishSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Campaign Published & Live!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedPlatform('meta')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  selectedPlatform === 'meta'
                    ? 'bg-[#1877F2]/20 border-[#1877F2] text-white ring-2 ring-[#1877F2]/30'
                    : 'bg-[#1E1E1E] border-white/5 text-[#8E918F]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs">
                  f
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Meta Ads Manager</div>
                  <div className="text-[10px] text-[#8E918F]">FB & IG Placements</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedPlatform('tiktok')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  selectedPlatform === 'tiktok'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white ring-2 ring-cyan-400/30'
                    : 'bg-[#1E1E1E] border-white/5 text-[#8E918F]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-xs">
                  TT
                </div>
                <div>
                  <div className="text-xs font-bold text-white">TikTok Ads API</div>
                  <div className="text-[10px] text-[#8E918F]">In-Feed & Spark Ads</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedPlatform('youtube')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  selectedPlatform === 'youtube'
                    ? 'bg-red-500/20 border-red-500 text-white ring-2 ring-red-500/30'
                    : 'bg-[#1E1E1E] border-white/5 text-[#8E918F]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  YT
                </div>
                <div>
                  <div className="text-xs font-bold text-white">YouTube Shorts</div>
                  <div className="text-[10px] text-[#8E918F]">Shorts Feed & TrueView</div>
                </div>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8E918F]">Daily Campaign Budget:</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8E918F]">$</span>
                  <input
                    type="number"
                    value={dailyBudgetInput}
                    onChange={(e) => setDailyBudgetInput(Number(e.target.value))}
                    className="w-28 bg-[#181818] border border-white/10 rounded-xl py-1.5 pl-6 pr-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#A8C7FA]"
                  />
                </div>
              </div>

              <button
                onClick={handleLaunchCampaign}
                disabled={isPublishing}
                className="px-6 py-2.5 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
              >
                {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isPublishing ? 'Publishing Creative...' : `Publish to ${selectedPlatform.toUpperCase()} Now`}
              </button>
            </div>
          </div>

          {/* Active Campaigns Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#E2E2E2] uppercase tracking-wider">Active Ad Campaigns</h4>
            <div className="space-y-2">
              {CAMPAIGNS.map((c) => (
                <div key={c.id} className="p-3.5 bg-[#222222] border border-white/5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#E2E2E2]">{c.campaignName}</div>
                    <div className="text-[10px] text-[#8E918F]">Spend: {c.spend} • Budget: ${c.dailyBudget}/day</div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <div className="text-[10px] text-[#8E918F] uppercase">ROAS</div>
                      <div className="font-bold text-emerald-400">{c.roas}x</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[#8E918F] uppercase">CTR</div>
                      <div className="font-bold text-[#A8C7FA]">{c.ctr}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[#8E918F] uppercase">CPA</div>
                      <div className="font-bold text-[#D0BCFF]">{c.cpa}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-sans font-bold text-[10px] rounded-full">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1E1E1E] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdPublishAnalyticsModal;
