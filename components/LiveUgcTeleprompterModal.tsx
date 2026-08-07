import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, Play, Pause, RefreshCw, X, Check, Wand2, Sliders, Volume2, Eye, EyeOff, RotateCcw, Monitor, Sparkles, Download, Circle, Maximize2 } from 'lucide-react';
import { generateMarketingCopy } from '../services/geminiService';

interface LiveUgcTeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
  adDescription?: string;
  onAttachRecordedVideo?: (videoUrl: string, title: string) => void;
}

export const LiveUgcTeleprompterModal: React.FC<LiveUgcTeleprompterModalProps> = ({
  isOpen,
  onClose,
  brandName = 'AdClone AI',
  adDescription = 'high converting product',
  onAttachRecordedVideo
}) => {
  const [scriptText, setScriptText] = useState(
    `Hey guys! Stop scrolling for a second.\n\nIf you're still creating video ads the old expensive way, you are missing out.\n\nThis AI tool generates high-converting UGC ads in under 30 seconds. Try it out now!`
  );

  // Teleprompter Settings
  const [scrollSpeed, setScrollSpeed] = useState<number>(3); // 1 - 10
  const [fontSize, setFontSize] = useState<number>(24); // px
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [filterMode, setFilterMode] = useState<'none' | 'beauty' | 'studio' | 'noir'>('beauty');

  // Camera & Recording
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [isAiScriptLoading, setIsAiScriptLoading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scriptContainerRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const scrollIntervalRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Initialize Camera
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
    } catch (err) {
      console.warn('Camera access error or permission denied:', err);
      setHasCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    clearInterval(scrollIntervalRef.current);
    clearInterval(timerIntervalRef.current);
  };

  // Handle Teleprompter Scrolling
  useEffect(() => {
    if (isScrolling) {
      scrollIntervalRef.current = setInterval(() => {
        if (scriptContainerRef.current) {
          scriptContainerRef.current.scrollTop += scrollSpeed * 0.8;
        }
      }, 30);
    } else {
      clearInterval(scrollIntervalRef.current);
    }

    return () => clearInterval(scrollIntervalRef.current);
  }, [isScrolling, scrollSpeed]);

  const handleStartCountdownAndRecord = () => {
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countInterval);
          startRecording();
          setIsScrolling(true);
          return null;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);
  };

  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    const stream = videoRef.current.srcObject as MediaStream;

    try {
      videoChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) videoChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (e) {
      console.error('Recording start error', e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsScrolling(false);
    clearInterval(timerIntervalRef.current);
  };

  const handleGenerateAiTeleprompterScript = async () => {
    setIsAiScriptLoading(true);
    try {
      const copy = await generateMarketingCopy(brandName, adDescription, 'Urgent & Viral');
      setScriptText(copy);
      if (scriptContainerRef.current) {
        scriptContainerRef.current.scrollTop = 0;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiScriptLoading(false);
    }
  };

  const handleSaveToTimeline = () => {
    const finalUrl = recordedVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-woman-recording-a-vlog-with-her-phone-41131-large.mp4';
    if (onAttachRecordedVideo) {
      onAttachRecordedVideo(finalUrl, `Live UGC Recording (${recordingSeconds}s)`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141414] w-full max-w-5xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-red-500 via-pink-500 to-purple-500 text-white rounded-full shadow-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Live AI Teleprompter & UGC Webcam Recording Studio
              </h3>
              <p className="text-xs text-[#8E918F]">Record real UGC selfie ads with eye-level AI script scrolling & studio video filters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Camera & Teleprompter Canvas (7 Cols) */}
          <div className="md:col-span-7 bg-black relative flex items-center justify-center overflow-hidden border-r border-white/5 p-4">
            {/* Aspect Ratio Framing Box */}
            <div
              className={`relative rounded-3xl overflow-hidden shadow-2xl bg-[#1A1A1A] flex items-center justify-center transition-all ${
                aspectRatio === '9:16' ? 'w-[280px] h-[490px]' : aspectRatio === '1:1' ? 'w-[380px] h-[380px]' : 'w-[520px] h-[300px]'
              }`}
            >
              {/* Webcam Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-all ${isMirrored ? 'scale-x-[-1]' : ''} ${
                  filterMode === 'beauty' ? 'brightness-105 contrast-95 saturate-110 blur-[0.3px]' :
                  filterMode === 'studio' ? 'brightness-110 contrast-110' :
                  filterMode === 'noir' ? 'grayscale contrast-125' : ''
                }`}
              />

              {!hasCameraPermission && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center p-6 space-y-3">
                  <Video className="w-10 h-10 text-red-400 animate-pulse" />
                  <div className="text-xs font-bold text-white">Camera Preview Unavailable or Blocked</div>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-full text-xs font-bold shadow"
                  >
                    Enable Webcam
                  </button>
                </div>
              )}

              {/* Eye-level Teleprompter Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 p-6 flex flex-col justify-between pointer-events-none">
                {/* Eye Level Line */}
                <div className="w-full border-b border-dashed border-red-500/40 relative">
                  <span className="absolute left-2 -top-2.5 text-[9px] font-mono text-red-400 bg-black/60 px-1 rounded">
                    EYE LINE
                  </span>
                </div>

                {/* Scrolling Script Container */}
                <div
                  ref={scriptContainerRef}
                  className="overflow-y-auto max-h-[65%] custom-scrollbar my-auto space-y-4 text-center px-2 transition-all"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <p className="font-bold text-white leading-relaxed drop-shadow-md whitespace-pre-line tracking-wide">
                    {scriptText}
                  </p>
                </div>

                {/* Recording Status & Timer */}
                <div className="flex items-center justify-between text-xs font-mono text-white">
                  {isRecording ? (
                    <div className="flex items-center gap-2 bg-red-500/90 text-white px-3 py-1 rounded-full font-bold animate-pulse shadow-lg">
                      <Circle className="w-3 h-3 fill-current" /> RECORDING {recordingSeconds}s
                    </div>
                  ) : (
                    <div className="bg-black/60 text-[#8E918F] px-2.5 py-1 rounded-full text-[10px]">
                      READY
                    </div>
                  )}

                  <span className="bg-black/60 text-white px-2 py-1 rounded-lg text-[10px]">
                    {aspectRatio}
                  </span>
                </div>
              </div>

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                  <span className="text-8xl font-black text-white animate-ping">{countdown}</span>
                </div>
              )}
            </div>
          </div>

          {/* Teleprompter Controls & Script Editor (5 Cols) */}
          <div className="md:col-span-5 bg-[#1A1A1A] p-6 flex flex-col justify-between space-y-5 overflow-y-auto custom-scrollbar">
            {/* Script Generator & Text Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-pink-400" /> AI UGC Teleprompter Script
                </label>
                <button
                  onClick={handleGenerateAiTeleprompterScript}
                  disabled={isAiScriptLoading}
                  className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow"
                >
                  {isAiScriptLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate Hook Script
                </button>
              </div>

              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                rows={7}
                className="w-full bg-[#121212] border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-pink-400 leading-relaxed resize-none font-medium"
              />
            </div>

            {/* Speed & Font Controls */}
            <div className="bg-[#222] p-4 rounded-2xl border border-white/5 space-y-3 text-xs">
              <div className="flex justify-between text-[#C4C7C5]">
                <span>Scroll Speed: {scrollSpeed}x</span>
                <span className="font-mono text-pink-300">Font Size: {fontSize}px</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(Number(e.target.value))}
                  className="w-full accent-pink-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                />
                <input
                  type="range"
                  min={16}
                  max={38}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                />
              </div>

              {/* Toggles & Filters */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => setIsMirrored(!isMirrored)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
                    isMirrored ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-black/40 border-white/10 text-[#8E918F]'
                  }`}
                >
                  Mirror Cam
                </button>

                <select
                  value={aspectRatio}
                  onChange={(e: any) => setAspectRatio(e.target.value)}
                  className="bg-black/40 text-white border border-white/10 rounded-xl px-2 py-1.5 text-[10px] font-bold"
                >
                  <option value="9:16">9:16 TikTok</option>
                  <option value="16:9">16:9 Landscape</option>
                  <option value="1:1">1:1 Square</option>
                </select>

                <select
                  value={filterMode}
                  onChange={(e: any) => setFilterMode(e.target.value)}
                  className="bg-black/40 text-white border border-white/10 rounded-xl px-2 py-1.5 text-[10px] font-bold"
                >
                  <option value="beauty">Beauty Filter</option>
                  <option value="studio">Studio Light</option>
                  <option value="noir">Noir Contrast</option>
                  <option value="none">Normal</option>
                </select>
              </div>
            </div>

            {/* Record / Play Control Bar */}
            <div className="space-y-2">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="w-full py-3.5 bg-red-500 hover:bg-red-400 text-white rounded-2xl text-xs font-bold shadow-xl flex items-center justify-center gap-2 animate-pulse"
                >
                  <Pause className="w-4 h-4 fill-current" /> Stop Live Recording ({recordingSeconds}s)
                </button>
              ) : (
                <button
                  onClick={handleStartCountdownAndRecord}
                  className="w-full py-3.5 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:brightness-110 text-white rounded-2xl text-xs font-bold shadow-xl flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" /> Start Teleprompter & Live Recording
                </button>
              )}

              {recordedVideoUrl && (
                <button
                  onClick={handleSaveToTimeline}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Attach UGC Video Clip to Timeline
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveUgcTeleprompterModal;
