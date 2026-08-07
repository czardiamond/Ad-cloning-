import React, { useState } from 'react';
import { Film, Sparkles, Video, Camera, Clock, Play, Download, X, RefreshCw, Check, Image as ImageIcon, Volume2, Type, Sliders, ArrowUpRight } from 'lucide-react';
import { generateAiStoryboard, StoryboardScene } from '../services/geminiService';

interface AiStoryboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  initialScript?: string;
  onApplySceneToCanvas?: (scene: StoryboardScene) => void;
}

export const AiStoryboardModal: React.FC<AiStoryboardModalProps> = ({
  isOpen,
  onClose,
  brandName,
  initialScript,
  onApplySceneToCanvas
}) => {
  const [scriptInput, setScriptInput] = useState(
    initialScript || `Create an energetic 10-second video ad for ${brandName} highlighting revolutionary speed, sleek modern aesthetics, and a bold call to action.`
  );
  const [sceneCount, setSceneCount] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingFrameIndex, setGeneratingFrameIndex] = useState<number | null>(null);
  const [renderedFrameUrls, setRenderedFrameUrls] = useState<Record<number, string>>({});

  const [scenes, setScenes] = useState<StoryboardScene[]>([
    {
      sceneNumber: 1,
      title: "The Problem Hook",
      timeframe: "0.0s - 2.5s",
      visualDescription: "Frustrated professional struggling with slow outdated tools under dim moody lighting.",
      cameraAngle: "Low Angle Close-up Push-In",
      lightingMood: "Dramatic High Contrast Shadows",
      voiceoverScript: `Are you tired of sluggish workflows holding back ${brandName}?`,
      onScreenText: "Stop Wasting Hours",
      visualPrompt: `Close-up shot of professional at workstation, dramatic tech lighting, high quality render`
    },
    {
      sceneNumber: 2,
      title: "The Hero Reveal",
      timeframe: "2.5s - 5.0s",
      visualDescription: `Sleek hero product for ${brandName} emerges with futuristic neon glow and fluid motion graphics.`,
      cameraAngle: "360-Degree Orbital Product Zoom",
      lightingMood: "Futuristic Studio Neon Glow",
      voiceoverScript: `Meet the next generation tool designed for effortless speed.`,
      onScreenText: `Introducing ${brandName}`,
      visualPrompt: `Hero product shot of ${brandName} device on glossy dark stage, vivid purple and blue studio highlights`
    },
    {
      sceneNumber: 3,
      title: "Fluid Feature Action",
      timeframe: "5.0s - 7.5s",
      visualDescription: "Fast-paced action montage of high-speed performance with crisp UI overlays.",
      cameraAngle: "Medium Over-the-Shoulder Tracking Shot",
      lightingMood: "Bright Modern Daylight Studio",
      voiceoverScript: `Instant automation, 10x faster productivity, and beautiful output in clicks.`,
      onScreenText: "10x Productivity Boost",
      visualPrompt: `Sleek UI dashboard glowing on ultra-thin display, modern studio setting, ultra detailed`
    },
    {
      sceneNumber: 4,
      title: "Bold Call To Action",
      timeframe: "7.5s - 10.0s",
      visualDescription: "High impact brand logo finish with glowing interactive call-to-action button.",
      cameraAngle: "Static Frontal Hero Center Shot",
      lightingMood: "Clean Minimalist Studio Spotlights",
      voiceoverScript: `Transform your workflow today. Get started free!`,
      onScreenText: "Try It Free Now",
      visualPrompt: `Minimalist brand logo and CTA banner for ${brandName}, high contrast design`
    }
  ]);

  if (!isOpen) return null;

  const handleGenerateStoryboard = async () => {
    if (!scriptInput.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateAiStoryboard(scriptInput, brandName, sceneCount);
      setScenes(generated);
    } catch (e) {
      console.error("Storyboard generation failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulateRenderFrame = (index: number) => {
    setGeneratingFrameIndex(index);
    setTimeout(() => {
      const sampleImages = [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80'
      ];
      const img = sampleImages[index % sampleImages.length];
      setRenderedFrameUrls(prev => ({ ...prev, [index]: img }));
      setGeneratingFrameIndex(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-5xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-lg">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#E2E2E2]">AI Script-to-Storyboard Generator</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider border border-indigo-500/30">
                  Multi-Scene Director
                </span>
              </div>
              <p className="text-xs text-[#8E918F]">Converts ad scripts into multi-scene visual storyboards with suggested camera angles</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Control Bar: Script Input & Scene Count */}
        <div className="p-5 bg-[#1A1A1A] border-b border-white/5 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                rows={2}
                value={scriptInput}
                onChange={(e) => setScriptInput(e.target.value)}
                placeholder="Enter your ad script, voiceover transcript, or concept breakdown..."
                className="w-full bg-[#222222] border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 custom-scrollbar resize-none"
              />
            </div>

            <div className="flex flex-col justify-between gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 bg-[#222222] p-1.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 px-1">Scenes:</span>
                {[3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSceneCount(num)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      sceneCount === num ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateStoryboard}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Directing Storyboard...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate AI Storyboard
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Storyboard Grid */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 bg-[#121212]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenes.map((scene, idx) => {
              const renderedFrame = renderedFrameUrls[idx];
              const isRenderingThis = generatingFrameIndex === idx;

              return (
                <div key={scene.sceneNumber || idx} className="bg-[#1A1A1A] border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                  
                  {/* Scene Frame Header */}
                  <div className="p-4 bg-[#222222] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-500/30">
                        #{scene.sceneNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white">{scene.title}</h4>
                    </div>

                    <span className="px-2.5 py-1 bg-white/5 text-slate-300 font-mono text-[10px] font-bold rounded-full border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {scene.timeframe}
                    </span>
                  </div>

                  {/* Frame Visual Display / Preview Area */}
                  <div className="h-44 bg-black relative flex items-center justify-center overflow-hidden border-b border-white/5 group-hover:brightness-105 transition-all">
                    {renderedFrame ? (
                      <img src={renderedFrame} alt={scene.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="p-4 text-center space-y-2">
                        <Camera className="w-8 h-8 text-indigo-400/60 mx-auto" />
                        <p className="text-[11px] text-slate-400 max-w-xs italic line-clamp-2">
                          "{scene.visualDescription}"
                        </p>
                        <button
                          onClick={() => handleSimulateRenderFrame(idx)}
                          disabled={isRenderingThis}
                          className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold rounded-xl text-[11px] border border-indigo-500/30 transition-all inline-flex items-center gap-1.5"
                        >
                          {isRenderingThis ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" /> Rendering Frame...
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-3 h-3" /> Generate AI Scene Frame
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Camera Angle Badge Overlay */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-indigo-300 flex items-center gap-1.5 shadow-lg">
                      <Video className="w-3 h-3 text-indigo-400" />
                      <span>{scene.cameraAngle}</span>
                    </div>
                  </div>

                  {/* Scene Script & Direction Breakdown */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    
                    <div className="space-y-2">
                      {/* Voiceover Script */}
                      <div className="p-2.5 bg-[#222222] rounded-xl border border-white/5 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                          <Volume2 className="w-3 h-3" /> Voiceover Script
                        </div>
                        <p className="text-xs text-white italic">"{scene.voiceoverScript}"</p>
                      </div>

                      {/* On-Screen Text & Lighting */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-[#222222] rounded-xl border border-white/5">
                          <div className="text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1">
                            <Type className="w-3 h-3" /> On-Screen Text
                          </div>
                          <div className="text-slate-200 font-bold truncate mt-0.5">{scene.onScreenText}</div>
                        </div>

                        <div className="p-2 bg-[#222222] rounded-xl border border-white/5">
                          <div className="text-[10px] font-bold uppercase text-sky-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Lighting & Mood
                          </div>
                          <div className="text-slate-200 truncate mt-0.5">{scene.lightingMood}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {onApplySceneToCanvas && (
                      <button
                        onClick={() => onApplySceneToCanvas(scene)}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 text-indigo-400" /> Apply Scene Prompt to Canvas
                      </button>
                    )}

                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/5 bg-[#1E1E1E] flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-400" />
            <span>AI Storyboards help visualize shot lists before video production</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            Done & Close Storyboard
          </button>
        </div>

      </div>
    </div>
  );
};
