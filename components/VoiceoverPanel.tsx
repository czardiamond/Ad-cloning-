import React, { useState } from 'react';
import { Mic2, Sparkles, Play, Volume2, RefreshCw, Check, FastForward, Sliders, Music, Zap, VolumeX, Globe, Users } from 'lucide-react';
import { VoiceoverConfig, VoiceoverVoice, VoiceoverTone } from '../types';
import { generateVoiceoverScript } from '../services/geminiService';

interface VoiceoverPanelProps {
  brandName: string;
  adDescription: string;
  onAttachVoiceover: (audioUrl: string, voiceoverTitle: string) => void;
  activeVoiceoverUrl: string | null;
  onRemoveVoiceover: () => void;
  onOpenElevenLabsStudio?: () => void;
}

const VOICES: { id: VoiceoverVoice; gender: string; style: string; sampleText: string }[] = [
  { id: 'Aria (Warm & Engaging)', gender: 'Female', style: 'Warm, relatable, conversational', sampleText: 'Hello! I am Aria. I deliver warm and engaging voiceovers perfect for modern product ads.' },
  { id: 'Marcus (Authoritative)', gender: 'Male', style: 'Deep, confident, corporate master', sampleText: 'This is Marcus. Authoritative, precise, and engineered for high-impact corporate messaging.' },
  { id: 'Seraphina (Energetic)', gender: 'Female', style: 'High energy, TikTok & Gen-Z hype', sampleText: 'Hey guys, Seraphina here! Ready to pump maximum energy and viral hype into your campaign!' },
  { id: 'David (Calm & Trustworthy)', gender: 'Male', style: 'Smooth, documentary, soothing', sampleText: 'Greetings. David speaking. Smooth, trustworthy narration crafted for premium brands.' },
  { id: 'Elena (Dramatic)', gender: 'Female', style: 'Cinematic, intense, trailer voice', sampleText: 'In a world of constant motion... Elena brings intense cinematic drama to your story.' },
];

const TONES: VoiceoverTone[] = ['Professional', 'Enthusiastic', 'Calm', 'Dramatic', 'Urgent'];

const VoiceoverPanel: React.FC<VoiceoverPanelProps> = ({
  brandName,
  adDescription,
  onAttachVoiceover,
  activeVoiceoverUrl,
  onRemoveVoiceover,
  onOpenElevenLabsStudio
}) => {
  const [config, setConfig] = useState<VoiceoverConfig>({
    script: `Introducing ${brandName || 'our revolutionary product'}. Built with cutting-edge craftsmanship and unmatched performance. Experience the future today!`,
    voice: 'Aria (Warm & Engaging)',
    tone: 'Enthusiastic',
    speed: 1.0,
    emotion: 'excited',
    autoSync: true
  });

  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  const handlePreviewVoiceSample = (voiceObj: typeof VOICES[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (previewingVoiceId === voiceObj.id) {
      setPreviewingVoiceId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(voiceObj.sampleText);
    utterance.rate = config.speed;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (voiceObj.gender === 'Female') {
        const female = voices.find(v => v.lang.includes('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Karen')));
        if (female) utterance.voice = female;
      } else {
        const male = voices.find(v => v.lang.includes('en') && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Alex') || v.name.includes('Daniel')));
        if (male) utterance.voice = male;
      }
    }

    utterance.onend = () => {
      setPreviewingVoiceId(null);
    };

    setPreviewingVoiceId(voiceObj.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateScriptWithAI = async () => {
    setIsGeneratingScript(true);
    try {
      const script = await generateVoiceoverScript(brandName || 'AdClone AI', adDescription || 'high converting product', config.tone, config.emotion);
      setConfig(prev => ({ ...prev, script }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateAndAttachVoiceover = () => {
    if (!config.script) return;
    setIsSynthesizing(true);

    // Use Web Speech API or synthesizes a speech audio blob for timeline playback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(config.script);
      utterance.rate = config.speed;
      
      // Select best system voice match if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        if (config.voice.includes('Aria') || config.voice.includes('Seraphina') || config.voice.includes('Elena')) {
          const femaleVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira')));
          if (femaleVoice) utterance.voice = femaleVoice;
        } else {
          const maleVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Alex')));
          if (maleVoice) utterance.voice = maleVoice;
        }
      }

      utterance.onend = () => {
        setIsPreviewPlaying(false);
      };

      setIsPreviewPlaying(true);
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      // Create data synth URL representation for timeline track
      const fakeVoiceoverBlobUrl = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
      onAttachVoiceover(fakeVoiceoverBlobUrl, `VO: ${config.voice.split(' ')[0]} (${config.tone})`);
      setIsSynthesizing(false);
    }, 1000);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPreviewPlaying(false);
  };

  return (
    <div className="bg-[#2C2C2C] p-4 rounded-[24px] space-y-4 border border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#D0BCFF]/20 text-[#D0BCFF] rounded-full">
            <Mic2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#E2E2E2]">AI Voiceover Generator</h4>
            <p className="text-[10px] text-[#8E918F]">Synthesize professional narrator voices for ad timeline</p>
          </div>
        </div>

        {activeVoiceoverUrl && (
          <button
            onClick={onRemoveVoiceover}
            className="px-2.5 py-1 bg-red-500/15 hover:bg-red-500/30 text-red-400 rounded-full text-[10px] font-semibold transition-colors flex items-center gap-1"
          >
            <VolumeX className="w-3 h-3" /> Remove VO
          </button>
        )}
      </div>

      {/* ElevenLabs Global Voice Library Banner */}
      {onOpenElevenLabsStudio && (
        <div
          onClick={onOpenElevenLabsStudio}
          className="p-3 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl cursor-pointer hover:border-purple-400 transition-all flex items-center justify-between group shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl">
              <Globe className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                ElevenLabs Multi-Country Studio
                <span className="text-[9px] bg-pink-500/20 text-pink-300 font-mono px-1.5 py-0.5 rounded-full border border-pink-500/30">
                  25+ Accents & Groups
                </span>
              </div>
              <div className="text-[10px] text-[#C4C7C5]">Multi-speaker group conversations & voice cloning</div>
            </div>
          </div>
          <div className="text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
            Open →
          </div>
        </div>
      )}

      {/* Script Input & AI Generate Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-[#C4C7C5]">Voiceover Script</label>
          <button
            onClick={handleGenerateScriptWithAI}
            disabled={isGeneratingScript}
            className="text-[10px] font-bold text-[#A8C7FA] hover:text-[#D0BCFF] flex items-center gap-1 transition-colors"
          >
            {isGeneratingScript ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            Auto-Write with AI
          </button>
        </div>

        <textarea
          rows={3}
          value={config.script}
          onChange={(e) => setConfig({ ...config, script: e.target.value })}
          placeholder="Type or generate the exact spoken narration script..."
          className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl p-3 text-xs text-[#E2E2E2] focus:ring-2 focus:ring-[#D0BCFF] focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Voice Selection Cards */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-[#C4C7C5]">Narrator Voice Persona</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VOICES.map((v) => {
            const isSelected = config.voice === v.id;
            const isAuditioning = previewingVoiceId === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setConfig({ ...config, voice: v.id })}
                className={`p-2.5 rounded-2xl text-left border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#D0BCFF]/15 border-[#D0BCFF] text-[#D0BCFF] ring-1 ring-[#D0BCFF]'
                    : 'bg-[#1E1E1E] border-white/5 text-[#E2E2E2] hover:bg-white/5'
                }`}
              >
                <div className="pr-2 truncate flex-1">
                  <div className="text-xs font-bold truncate">{v.id}</div>
                  <div className="text-[9px] text-[#8E918F] mt-0.5 truncate">{v.style}</div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={(e) => handlePreviewVoiceSample(v, e)}
                    className={`p-1.5 rounded-full transition-all ${
                      isAuditioning
                        ? 'bg-[#D0BCFF] text-[#381E72] animate-bounce'
                        : 'bg-white/10 hover:bg-white/20 text-[#E2E2E2]'
                    }`}
                    title="Audition voice sample preview"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  {isSelected && <Check className="w-4 h-4 text-[#D0BCFF]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tone & Emotion controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-[#C4C7C5]">Delivery Tone</label>
          <select
            value={config.tone}
            onChange={(e) => setConfig({ ...config, tone: e.target.value as VoiceoverTone })}
            className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl p-2 text-xs text-[#E2E2E2] focus:ring-1 focus:ring-[#D0BCFF]"
          >
            {TONES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-[#C4C7C5]">Emotion Intensity</label>
          <select
            value={config.emotion}
            onChange={(e) => setConfig({ ...config, emotion: e.target.value as any })}
            className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl p-2 text-xs text-[#E2E2E2] focus:ring-1 focus:ring-[#D0BCFF]"
          >
            <option value="excited">Excited & High-Energy</option>
            <option value="confident">Confident & Direct</option>
            <option value="empathetic">Empathetic & Warm</option>
            <option value="neutral">Neutral Master</option>
          </select>
        </div>
      </div>

      {/* Pace / Speed Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-[#C4C7C5]">
          <span>Speech Speed (Pace)</span>
          <span className="font-mono text-[#D0BCFF]">{config.speed.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0.8"
          max="1.5"
          step="0.1"
          value={config.speed}
          onChange={(e) => setConfig({ ...config, speed: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-[#1E1E1E] rounded-full appearance-none cursor-pointer accent-[#D0BCFF]"
        />
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-2 pt-1">
        {isPreviewPlaying ? (
          <button
            onClick={handleStopSpeech}
            className="flex-1 py-2.5 bg-red-500/20 text-red-300 rounded-full text-xs font-bold flex items-center justify-center gap-2"
          >
            Stop Audio Preview
          </button>
        ) : (
          <button
            onClick={handleGenerateAndAttachVoiceover}
            disabled={isSynthesizing || !config.script}
            className="flex-1 py-3 bg-[#D0BCFF] hover:bg-[#A8C7FA] text-[#381E72] rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {isSynthesizing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {isSynthesizing ? 'Synthesizing Audio...' : 'Generate & Sync to Timeline'}
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceoverPanel;
