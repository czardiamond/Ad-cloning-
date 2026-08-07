import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Zap, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Flame, 
  RefreshCw, 
  ShieldAlert, 
  Eye, 
  Swords, 
  Compass,
  TrendingUp
} from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface CompetitorAdSpyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBrand: string;
  onApplyCounterCampaign: (headline: string, desc: string, targetBrand: string) => void;
}

export const CompetitorAdSpyModal: React.FC<CompetitorAdSpyModalProps> = ({
  isOpen,
  onClose,
  userBrand,
  onApplyCounterCampaign
}) => {
  const [competitorUrl, setCompetitorUrl] = useState('gymshark.com');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    competitorName: string;
    topHook: string;
    hookType: string;
    weakness: string;
    counterHeadline: string;
    counterAngle: string;
    colorPalette: string[];
    viralEstRoas: string;
  } | null>({
    competitorName: 'Gymshark',
    topHook: '"Don\'t stop when you\'re tired, stop when you\'re done."',
    hookType: 'Motivational High-Pace UGC',
    weakness: 'Overused generic fitness quotes; lacks direct benefit offer.',
    counterHeadline: `Why Fitness Creators Are Ditching Gymshark for ${userBrand || 'Your Brand'}`,
    counterAngle: 'Direct Comparison & High-Tech Fabric Upgrade',
    colorPalette: ['#111111', '#00F0FF', '#FF0055', '#FFFFFF'],
    viralEstRoas: '3.8x - 4.4x'
  });

  if (!isOpen) return null;

  const handleRunSpyAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorUrl) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const cleanBrand = competitorUrl.replace(/(https?:\/\/)?(www\.)?/, '').split('.')[0];
      const capitalized = cleanBrand.charAt(0).toUpperCase() + cleanBrand.slice(1);

      setAnalysisResult({
        competitorName: capitalized,
        topHook: `"The secret weapon ${capitalized} doesn't want you to know about."`,
        hookType: 'Curiosity Gap & Social Proof',
        weakness: `High production cost with slow hook delivery in first 1.8s.`,
        counterHeadline: `Stop Overpaying for ${capitalized}: Get Better Results for Half the Price with ${userBrand || 'Our Brand'}`,
        counterAngle: 'Value Proposition & Disruption Angle',
        colorPalette: ['#0F172A', '#38BDF8', '#F43F5E', '#10B981'],
        viralEstRoas: '4.2x - 5.1x'
      });

      // Save spy audit to Firestore
      try {
        addDoc(collection(db, 'competitor_spy_audits'), {
          competitor: capitalized,
          userBrand: userBrand || 'User Brand',
          createdAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Firestore spy audit save info:', e);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-4xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Live Competitor Ad Spy & Counter-Campaign Remix
                <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold rounded-full">
                  1-Click Counter Attack
                </span>
              </h3>
              <p className="text-xs text-[#8E918F]">
                Deconstruct any brand's top ad campaign and turn their weaknesses into your winning ad creative.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Competitor Search Input */}
          <form onSubmit={handleRunSpyAnalysis} className="p-5 bg-[#222222] border border-white/5 rounded-2xl space-y-3">
            <label className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Enter Competitor URL or Social Handle
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="e.g. gymshark.com, glossier, or nike.com"
                className="flex-1 bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {isAnalyzing ? 'Spying Ad Creative...' : 'Deconstruct & Spy'}
              </button>
            </div>
          </form>

          {/* Analysis Breakdown */}
          {analysisResult && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Competitor Deconstruction */}
                <div className="p-5 bg-[#222222] border border-rose-500/20 rounded-3xl space-y-3">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Competitor Weakness</span>
                    <span className="text-[10px] font-mono text-[#8E918F]">{analysisResult.competitorName}</span>
                  </span>

                  <div className="p-3 bg-[#181818] rounded-2xl space-y-1">
                    <span className="text-[10px] text-[#8E918F] uppercase font-bold">Top Hook Phrasing</span>
                    <p className="text-xs text-white italic">{analysisResult.topHook}</p>
                  </div>

                  <div className="p-3 bg-[#181818] rounded-2xl space-y-1">
                    <span className="text-[10px] text-rose-400 uppercase font-bold">Identified Vulnerability</span>
                    <p className="text-xs text-[#E2E2E2]">{analysisResult.weakness}</p>
                  </div>
                </div>

                {/* AI Counter-Campaign Prescription */}
                <div className="p-5 bg-gradient-to-b from-cyan-950/40 to-blue-950/20 border border-cyan-500/30 rounded-3xl space-y-3">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1"><Swords className="w-4 h-4 text-cyan-400" /> Counter-Campaign Remix</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Est. ROAS {analysisResult.viralEstRoas}
                    </span>
                  </span>

                  <div className="p-3 bg-[#181818] rounded-2xl space-y-1 border border-cyan-500/20">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold">AI Counter Headline Copy</span>
                    <p className="text-xs text-white font-bold">{analysisResult.counterHeadline}</p>
                  </div>

                  <div className="p-3 bg-[#181818] rounded-2xl space-y-1">
                    <span className="text-[10px] text-[#8E918F] uppercase font-bold">Recommended Creative Strategy</span>
                    <p className="text-xs text-cyan-200">{analysisResult.counterAngle}</p>
                  </div>
                </div>
              </div>

              {/* Apply Counter Attack */}
              <button
                onClick={() => {
                  onApplyCounterCampaign(
                    analysisResult.counterHeadline,
                    `Counter-campaign strategy targeting ${analysisResult.competitorName}`,
                    userBrand || 'Our Brand'
                  );
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-500 hover:to-indigo-600 text-black font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Load Counter-Campaign Copy onto Canvas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitorAdSpyModal;
