import React, { useState } from 'react';
import { Globe, Volume2, Sparkles, Play, Pause, Check, X, RefreshCw, Languages, Music } from 'lucide-react';
import { DubbingLanguage } from '../types';

interface MultilingualDubbingModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalScript: string;
  onApplyDubbingTrack?: (langCode: string, translatedText: string) => void;
}

const LANGUAGES: DubbingLanguage[] = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', sampleScript: 'Descubre el futuro de la creación de anuncios inteligentes.' },
  { code: 'de', name: 'German', flag: '🇩🇪', sampleScript: 'Entdecken Sie die Zukunft intelligenter Werbeerstellung.' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', sampleScript: 'スマート広告作成の未来を体験してください。' },
  { code: 'fr', name: 'French', flag: '🇫🇷', sampleScript: 'Découvrez l\'avenir de la création publicitaire intelligente.' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', sampleScript: 'Descubra o futuro da criação de anúncios inteligentes.' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', sampleScript: 'Scopri il futuro della creazione pubblicitaria intelligente.' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳', sampleScript: '体验智能广告制作的未来。' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', sampleScript: '스마트 광고 제작의 미래를 경험해보세요.' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', sampleScript: 'اكتشف مستقبل إنشاء الإعلانات الذكية.' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', sampleScript: 'स्मार्ट विज्ञापन निर्माण के भविष्य का अनुभव करें।' }
];

const MultilingualDubbingModal: React.FC<MultilingualDubbingModalProps> = ({
  isOpen,
  onClose,
  originalScript,
  onApplyDubbingTrack
}) => {
  const [selectedLang, setSelectedLang] = useState<DubbingLanguage>(LANGUAGES[0]);
  const [preserveTimbre, setPreserveTimbre] = useState(true);
  const [dubbingSpeed, setDubbingSpeed] = useState(1.0);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState(selectedLang.sampleScript || '');

  if (!isOpen) return null;

  const handleSelectLang = (lang: DubbingLanguage) => {
    setSelectedLang(lang);
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
      setTranslatedText(lang.sampleScript || originalScript);
    }, 600);
  };

  const handleTogglePlay = () => {
    setIsPlayingSample(!isPlayingSample);
    if (!isPlayingSample) {
      setTimeout(() => setIsPlayingSample(false), 3000);
    }
  };

  const handleApply = () => {
    if (onApplyDubbingTrack) {
      onApplyDubbingTrack(selectedLang.code, translatedText);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-3xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D0BCFF] text-[#381E72] rounded-full">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#E2E2E2]">Multilingual AI Dubbing & Voice Cloning</h3>
              <p className="text-xs text-[#8E918F]">Localize ads into 30+ languages while preserving narrator voice timbre and pace</p>
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
          {/* Language Selector Grid */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-4 h-4" /> Select Target Localization Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLang(lang)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#D0BCFF]/15 border-[#D0BCFF] text-white ring-2 ring-[#D0BCFF]/30'
                        : 'bg-[#222222] border-white/5 text-[#C4C7C5] hover:border-white/15'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-xs font-bold truncate">{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Cloning & Speech Controls */}
          <div className="bg-[#222222] p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[#E2E2E2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveTimbre}
                  onChange={(e) => setPreserveTimbre(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 text-[#D0BCFF] focus:ring-0 bg-[#1E1E1E]"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D0BCFF]" /> Preserve Narrator Voice Timbre & Pitch
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8E918F]">Dubbing Pace:</span>
                <span className="text-xs font-mono font-bold text-[#D0BCFF]">{dubbingSpeed.toFixed(1)}x</span>
              </div>
            </div>

            {/* Translation Script Preview */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-[#8E918F] font-semibold">
                <span>AI Translated Script ({selectedLang.name}):</span>
                {isTranslating && <span className="text-[#D0BCFF] flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Translating...</span>}
              </div>
              <textarea
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                rows={3}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-[#E2E2E2] focus:outline-none focus:border-[#D0BCFF] resize-none"
              />
            </div>

            {/* Sample Voice Player */}
            <div className="p-3 bg-[#1E1E1E] rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="p-2 bg-[#D0BCFF] text-[#381E72] rounded-full hover:scale-105 transition-transform"
                >
                  {isPlayingSample ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-[#E2E2E2]">
                    {selectedLang.flag} {selectedLang.name} Cloned Audio Preview
                  </div>
                  <div className="text-[10px] text-[#8E918F]">
                    {isPlayingSample ? 'Synthesizing voice sample...' : 'Click to preview translated audio sample'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div className={`w-1 h-4 rounded-full ${isPlayingSample ? 'bg-[#D0BCFF] animate-bounce' : 'bg-white/20'}`} />
                <div className={`w-1 h-6 rounded-full ${isPlayingSample ? 'bg-[#D0BCFF] animate-bounce delay-75' : 'bg-white/20'}`} />
                <div className={`w-1 h-3 rounded-full ${isPlayingSample ? 'bg-[#D0BCFF] animate-bounce delay-150' : 'bg-white/20'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1E1E1E] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[#8E918F] hover:text-white rounded-full text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 bg-[#D0BCFF] hover:bg-[#A8C7FA] text-[#381E72] rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg"
          >
            <Check className="w-4 h-4" /> Apply Dubbed Audio Track ({selectedLang.name})
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultilingualDubbingModal;
