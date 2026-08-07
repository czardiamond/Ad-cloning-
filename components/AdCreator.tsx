import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Image as ImageIcon, Film, Wand2, Play, Download, Settings, RefreshCw, AlertCircle, Type, Music, Scissors, FastForward, Sliders, Video, Crop, Plus, RotateCcw, RotateCw, Volume2, Search, Grid, Layout, ChevronLeft, ChevronRight, Activity, X, Lightbulb, Check, Trash2, Loader2, Mic, FileAudio, Zap, Save, BarChart3, Mic2, Info, Palette, FileText, CheckSquare, Square, DownloadCloud, Copy, SplitSquareHorizontal, Move, GitCompare, Beaker, Layers, ArrowRightLeft, MousePointer2, MessageSquarePlus, CopyPlus, PenTool, AudioLines, Wind, Eye, Quote, AlignCenter, AlignLeft, AlignRight, Maximize2, MoveHorizontal, CircleOff, Moon, Clock, Sun, Snowflake, PlayCircle, Speaker, ShieldCheck, Microscope, GitPullRequest, FolderOpen, PanelLeftClose, PanelLeftOpen, MonitorPlay, ChevronDown, ChevronUp, PanelRightClose, PanelRightOpen, ArrowRight, CheckCircle2, ListVideo, Trash, Filter, Tag, Radio, Camera, Target, Globe, History, Keyboard, ShoppingBag } from 'lucide-react';
import { MediaType, Resolution, AspectRatio, AdConfiguration, AudioTrack, BrandPalette, OverlayConfig, Keyframe, EditorPreset, AudioMix, PresetCategory, GridOverlayMode, ColorVisualizerMode, AdHotspot, TimelineComment, VersionSnapshot, BatchItem } from '../types';
import { analyzeAndSuggest, generateAdImage, generateAdVideo, editAdImageWithInstruction, getVideoEditorSuggestions, getImageEditSuggestions, getPromptSuggestions, getMusicRecommendation, generateSoundEffect, cloneVoice, generateMarketingCopy, getColorGradingSuggestions, analyzeBrandConsistency, getABTestSuggestions, compareVariations } from '../services/geminiService';
import VoiceInput from './VoiceInput';
import ExportSettingsModal from './ExportSettingsModal';
import GridOverlay from './GridOverlay';
import ColorHistogram from './ColorHistogram';
import AutoKeyframePanel from './AutoKeyframePanel';
import HotspotOverlay from './HotspotOverlay';
import HotspotManagerPanel from './HotspotManagerPanel';
import VoiceoverPanel from './VoiceoverPanel';
import TimelineCommentPanel from './TimelineCommentPanel';
import VersionHistoryPanel from './VersionHistoryPanel';
import BatchProcessingModal from './BatchProcessingModal';
import AccessibilityAuditModal from './AccessibilityAuditModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import CollaborativeSketchCanvas from './CollaborativeSketchCanvas';
import SentimentBrandDashboard from './SentimentBrandDashboard';
import SmartCleanupModal from './SmartCleanupModal';
import SmartFormatResizerModal from './SmartFormatResizerModal';
import MultilingualDubbingModal from './MultilingualDubbingModal';
import UgcAvatarModal from './UgcAvatarModal';
import MultiHookGeneratorModal from './MultiHookGeneratorModal';
import AdPublishAnalyticsModal from './AdPublishAnalyticsModal';
import ColorGradingLutsModal from './ColorGradingLutsModal';
import SpatialAudioEngineModal from './SpatialAudioEngineModal';
import VfxCompositeStudioModal from './VfxCompositeStudioModal';
import MultiCamDirectorModal from './MultiCamDirectorModal';
import MotionTrackingKeyframeModal from './MotionTrackingKeyframeModal';
import ElevenLabsVoiceStudioModal from './ElevenLabsVoiceStudioModal';
import LiveUgcTeleprompterModal from './LiveUgcTeleprompterModal';
import SfxSoundboardModal from './SfxSoundboardModal';
import BrandAssetsPanel from './BrandAssetsPanel';
import { BrandGuardrailModal } from './BrandGuardrailModal';
import { AssetRepurposerModal } from './AssetRepurposerModal';
import { AdSuccessScoreDashboardModal } from './AdSuccessScoreDashboardModal';
import { AiStoryboardModal } from './AiStoryboardModal';
import { OneClickRefinementModal } from './OneClickRefinementModal';
import { ProductCatalogBatchModal } from './ProductCatalogBatchModal';

const INITIAL_PRESETS: EditorPreset[] = [
  {
    id: 'preset-social-1',
    name: 'TikTok Punchy Zoom',
    category: 'Social Media',
    speed: 1.25,
    filter: 'brightness',
    stabilization: 0.2,
    crop: 1.2,
    transitionType: 'slide',
    transitionDuration: 0.5,
    keyframes: [
      { id: '1', time: 0, zoom: 1.0, x: 50, y: 50 },
      { id: '2', time: 0.3, zoom: 1.35, x: 40, y: 35 },
      { id: '3', time: 0.7, zoom: 1.15, x: 65, y: 60 },
      { id: '4', time: 1.0, zoom: 1.0, x: 50, y: 50 },
    ]
  },
  {
    id: 'preset-social-2',
    name: 'Instagram Reel Story',
    category: 'Social Media',
    speed: 1.0,
    filter: 'cool',
    stabilization: 0.5,
    crop: 1.0,
    transitionType: 'fade',
    transitionDuration: 1.0,
    keyframes: [
      { id: '1', time: 0, zoom: 1.0, x: 50, y: 50 },
      { id: '2', time: 1.0, zoom: 1.15, x: 50, y: 50 },
    ]
  },
  {
    id: 'preset-banner-1',
    name: 'Web Display Loop',
    category: 'Banners',
    speed: 1.0,
    filter: 'contrast',
    stabilization: 0.0,
    crop: 1.0,
    transitionType: 'wipe',
    transitionDuration: 0.5,
    keyframes: []
  },
  {
    id: 'preset-ecom-1',
    name: 'E-Commerce Spotlight',
    category: 'E-Commerce',
    speed: 1.1,
    filter: 'brightness',
    stabilization: 0.8,
    crop: 1.1,
    transitionType: 'fade',
    transitionDuration: 0.8,
    keyframes: [
      { id: '1', time: 0, zoom: 1.0, x: 50, y: 50 },
      { id: '2', time: 0.5, zoom: 1.25, x: 50, y: 40 },
      { id: '3', time: 1.0, zoom: 1.0, x: 50, y: 50 },
    ]
  },
  {
    id: 'preset-broadcast-1',
    name: 'TV Commercial Master',
    category: 'Broadcast',
    speed: 1.0,
    filter: 'none',
    stabilization: 0.9,
    crop: 1.0,
    transitionType: 'fade',
    transitionDuration: 1.0,
    outroTransitionType: 'fade',
    outroTransitionDuration: 1.0,
    keyframes: []
  },
  {
    id: 'preset-cinematic-1',
    name: 'Cinematic Noir',
    category: 'Cinematic',
    speed: 0.9,
    filter: 'grayscale',
    stabilization: 0.5,
    crop: 1.05,
    transitionType: 'fade',
    transitionDuration: 1.5,
    keyframes: [
      { id: '1', time: 0, zoom: 1.0, x: 45, y: 45 },
      { id: '2', time: 1.0, zoom: 1.2, x: 55, y: 55 },
    ]
  }
];

const DEFAULT_AUDIO_TRACKS: AudioTrack[] = [
    { id: 'none', name: 'No Music', url: '' },
    { id: 'corporate', name: 'Upbeat Corporate', url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_1a4913f019.mp3?filename=uplifting-corporate-105155.mp3' },
    { id: 'cinematic', name: 'Cinematic Epic', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-epic-111532.mp3' },
    { id: 'lofi', name: 'Chill Lo-Fi', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3' },
    { id: 'promo', name: 'Dynamic Promo', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_5b32f14421.mp3?filename=powerful-beat-124696.mp3' }
];

const FILTER_OPTIONS = [
  { id: 'none', name: 'Normal', filter: 'none', Icon: CircleOff },
  { id: 'grayscale', name: 'B&W', filter: 'grayscale(100%)', Icon: Moon },
  { id: 'sepia', name: 'Vintage', filter: 'sepia(80%)', Icon: Clock },
  { id: 'contrast', name: 'Dramatic', filter: 'contrast(150%) brightness(90%)', Icon: Zap },
  { id: 'brightness', name: 'Vivid', filter: 'brightness(110%) saturate(140%)', Icon: Sun },
  { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(80%)', Icon: Snowflake },
];

const TRANSITION_OPTIONS = [
    { id: 'none', name: 'None' },
    { id: 'fade', name: 'Fade' },
    { id: 'slide', name: 'Slide' },
    { id: 'wipe', name: 'Wipe' },
];

const SFX_MOODS = [
  { id: 'modern', name: 'Modern Tech', desc: 'Swooshes, clean beeps' },
  { id: 'cinematic', name: 'Cinematic', desc: 'Deep brass, swells' },
  { id: 'pop', name: 'Pop Burst', desc: 'Bubbles, pop' },
  { id: 'industrial', name: 'Industrial', desc: 'Clanks, metallic' },
  { id: 'nature', name: 'Nature', desc: 'Wind, water, birds' }
];

// Material You style collapsible panel
const CollapsiblePanel: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="mb-2 bg-[#1E1E1E] rounded-[24px] overflow-hidden transition-all duration-300 border border-white/5">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 font-medium text-sm text-[#E2E2E2]">
                    <div className="p-2 bg-[#2C2C2C] rounded-full text-[#A8C7FA]">{icon}</div> 
                    <span>{title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-[#8E918F]"/> : <ChevronDown className="w-4 h-4 text-[#8E918F]"/>}
            </button>
            {isOpen && <div className="p-4 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">{children}</div>}
        </div>
    );
};

import { UserProfile, SavedUserProject } from '../types';

interface AdCreatorProps {
  currentUser?: UserProfile;
  savedProjects?: SavedUserProject[];
  onOpenUserModal?: () => void;
  onSaveProject?: (title: string, snapshotData?: any) => void;
  loadedProject?: SavedUserProject | null;
}

export const AdCreator: React.FC<AdCreatorProps> = ({
  currentUser,
  savedProjects = [],
  onOpenUserModal,
  onSaveProject,
  loadedProject
}) => {
  // Config State
  const [targetBrand, setTargetBrand] = useState('Coca Cola');
  const [description, setDescription] = useState('');
  const [modifications, setModifications] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [resolution, setResolution] = useState<Resolution>(Resolution.RES_1K);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [brandPalette, setBrandPalette] = useState<BrandPalette>({ primary: '#fe001a', secondary: '#ffffff', accent: '#000000' });
  
  // Reference Media
  const [referenceMedia, setReferenceMedia] = useState<string | null>(null);
  const [referenceMimeType, setReferenceMimeType] = useState<string | null>(null);
  const refFileInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const customAudioInputRef = useRef<HTMLInputElement>(null);

  // Marketing Copy State
  const [headline, setHeadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  
  // Prompt Ideas State
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [isGettingPromptSuggestions, setIsGettingPromptSuggestions] = useState(false);

  // Overlay State
  const [overlay, setOverlay] = useState<OverlayConfig>({
    text: '', color: '#ffffff', size: 'medium', font: 'sans', position: 'bottom-center', alignment: 'center', animation: 'none'
  });

  // Generated Content State
  const [generatedVariations, setGeneratedVariations] = useState<string[]>([]);
  const [currentVariationIdx, setCurrentVariationIdx] = useState(0);
  
  // AI Insights
  const [editSuggestions, setEditSuggestions] = useState<string[]>([]);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<number[]>([]);
  
  // Brand Audit
  const [brandAuditResult, setBrandAuditResult] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  
  // Editor State
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [stabilization, setStabilization] = useState(0); // 0 to 1
  const [crop, setCrop] = useState(1); // 1 to 3 zoom
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [introTransitionType, setIntroTransitionType] = useState('none');
  const [introTransitionDuration, setIntroTransitionDuration] = useState(1);
  const [outroTransitionType, setOutroTransitionType] = useState('none');
  const [outroTransitionDuration, setOutroTransitionDuration] = useState(1);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  
  // Advanced Keyframing
  const [isKeyframingEnabled, setIsKeyframingEnabled] = useState(false);
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
      { id: 'start', time: 0, zoom: 1, x: 50, y: 50 },
      { id: 'end', time: 1, zoom: 1, x: 50, y: 50 }
  ]);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);

  // Sequence Playback
  const [isSequenceMode, setIsSequenceMode] = useState(false);
  const [sequenceTransition, setSequenceTransition] = useState('fade');
  const [sequenceTransitionDuration, setSequenceTransitionDuration] = useState(1.0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Audio Mixer State
  const [audioMix, setAudioMix] = useState<AudioMix>({ musicVolume: 0.5, voiceVolume: 1.0, sfxVolume: 0.8 });
  const [selectedAudioId, setSelectedAudioId] = useState('none');
  const [customTracks, setCustomTracks] = useState<AudioTrack[]>([]);

  // AI SFX & Voice State
  const [sfxMood, setSfxMood] = useState('modern');
  const [customSfxPrompt, setCustomSfxPrompt] = useState('');
  const [isGeneratingSfx, setIsGeneratingSfx] = useState(false);
  const [generatedSfx, setGeneratedSfx] = useState<string | null>(null);
  const [voiceSample, setVoiceSample] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [clonedAudioUrl, setClonedAudioUrl] = useState<string | null>(null);

  // Presets
  const [presets, setPresets] = useState<EditorPreset[]>(INITIAL_PRESETS);
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<PresetCategory>('All');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetCategory, setNewPresetCategory] = useState<PresetCategory>('Social Media');
  const [selectedPresetId, setSelectedPresetId] = useState('');

  // Export Settings Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Stage Viewport Grid Overlay & Color Visualizers
  const [gridOverlayMode, setGridOverlayMode] = useState<GridOverlayMode>('none');
  const [colorVisualizerMode, setColorVisualizerMode] = useState<ColorVisualizerMode>('none');

  // Hotspots
  const [hotspots, setHotspots] = useState<AdHotspot[]>([
    {
      id: 'hotspot-1',
      label: 'Shop 20% Off Launch Deal',
      actionType: 'coupon',
      couponCode: 'ADCLONE20',
      x: 75,
      y: 30,
      width: 26,
      height: 12,
      startTime: 0.1,
      endTime: 0.9,
      pulse: true,
      style: 'accent'
    }
  ]);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>('hotspot-1');

  // AI Voiceover
  const [activeVoiceoverUrl, setActiveVoiceoverUrl] = useState<string | null>(null);
  const [voiceoverTitle, setVoiceoverTitle] = useState<string | null>(null);
  const [voiceoverScript, setVoiceoverScript] = useState<string>('');

  // Timeline Comments
  const [comments, setComments] = useState<TimelineComment[]>([
    {
      id: 'comment-1',
      timestamp: 2.5,
      normalizedTime: 0.25,
      author: 'Sarah Jenkins (Creative Lead)',
      authorAvatar: 'SJ',
      text: 'Great opening hook! Can we verify color contrast here?',
      createdAt: '10m ago',
      resolved: false,
      replies: [
        { id: 'rep-1', author: 'Alex (Video Editor)', text: 'On it! Adjusted font & filter.', createdAt: '5m ago' }
      ]
    }
  ]);
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);

  // Version Snapshots
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>([
    {
      id: 'snap-initial',
      timestamp: 'Initial Import',
      label: 'v1.0 Base Setup',
      mediaUrl: '',
      filter: 'none',
      speed: 1.0,
      targetBrand: 'Brand Master',
      overlayText: '',
      hotspotsCount: 1
    }
  ]);
  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>('snap-initial');

  // Modals & Floating Tool States
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);
  const [isSketchCanvasOpen, setIsSketchCanvasOpen] = useState(false);
  const [isSentimentModalOpen, setIsSentimentModalOpen] = useState(false);
  const [isSmartCleanupModalOpen, setIsSmartCleanupModalOpen] = useState(false);

  // Top Tier AI Suite Tool States
  const [isSmartFormatModalOpen, setIsSmartFormatModalOpen] = useState(false);
  const [isDubbingModalOpen, setIsDubbingModalOpen] = useState(false);
  const [isUgcAvatarModalOpen, setIsUgcAvatarModalOpen] = useState(false);
  const [isMultiHookModalOpen, setIsMultiHookModalOpen] = useState(false);
  const [isAdPublishModalOpen, setIsAdPublishModalOpen] = useState(false);

  // Hollywood Studio Production Suite Tool States
  const [isColorLutsModalOpen, setIsColorLutsModalOpen] = useState(false);
  const [isSpatialAudioModalOpen, setIsSpatialAudioModalOpen] = useState(false);
  const [isVfxModalOpen, setIsVfxModalOpen] = useState(false);
  const [isMultiCamModalOpen, setIsMultiCamModalOpen] = useState(false);
  const [isMotionTrackModalOpen, setIsMotionTrackModalOpen] = useState(false);
  const [isElevenLabsModalOpen, setIsElevenLabsModalOpen] = useState(false);
  const [isTeleprompterModalOpen, setIsTeleprompterModalOpen] = useState(false);
  const [isSfxModalOpen, setIsSfxModalOpen] = useState(false);
  const [isVersionHistoryModalOpen, setIsVersionHistoryModalOpen] = useState(false);

  // Brand Guardrail, Asset Repurposer, Ad Success Score & Storyboard Generator States
  const [isGuardrailModalOpen, setIsGuardrailModalOpen] = useState(false);
  const [isGuardrailEnabled, setIsGuardrailEnabled] = useState(true);
  const [isAssetRepurposerOpen, setIsAssetRepurposerOpen] = useState(false);
  const [isAdSuccessScoreOpen, setIsAdSuccessScoreOpen] = useState(false);
  const [isStoryboardOpen, setIsStoryboardOpen] = useState(false);
  const [isOneClickRefinementOpen, setIsOneClickRefinementOpen] = useState(false);
  const [isCatalogBatchOpen, setIsCatalogBatchOpen] = useState(false);

  // Theme Mode State ('dark' | 'light')
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // Auto-Save & Session Persistence State
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [showAutoSaveToast, setShowAutoSaveToast] = useState<boolean>(false);

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'edit' | 'audio'>('edit');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isStudioToolsOpen, setIsStudioToolsOpen] = useState(false);
  const studioToolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (studioToolsRef.current && !studioToolsRef.current.contains(e.target as Node)) {
        setIsStudioToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const voiceSampleRef = useRef<HTMLInputElement>(null);

  // Playback & Mute State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // --- Global Keyboard Shortcuts listener ---
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in text inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Space: Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
      // Left Arrow: Step backward 0.1s
      else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setPlaybackProgress(prev => Math.max(0, prev - 0.05));
      }
      // Right Arrow: Step forward 0.1s
      else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setPlaybackProgress(prev => Math.min(1, prev + 0.05));
      }
      // M: Mute/Unmute
      else if (e.code === 'KeyM') {
        e.preventDefault();
        setIsMuted(prev => !prev);
      }
      // C: Comments drawer
      else if (e.code === 'KeyC') {
        e.preventDefault();
        setIsCommentPanelOpen(prev => !prev);
      }
      // Z (Cmd/Ctrl + Z): Restore last snapshot (Undo)
      else if ((e.metaKey || e.ctrlKey) && e.code === 'KeyZ') {
        e.preventDefault();
        if (snapshots.length > 0) {
          handleRestoreSnapshot(snapshots[snapshots.length - 1]);
        }
      }
      // ? (Shift + /): Toggle keyboard shortcuts modal
      else if (e.key === '?') {
        e.preventDefault();
        setIsKeyboardModalOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [snapshots]);

  // --- Effects ---

  // Auto-save changes to local session storage
  useEffect(() => {
    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        const sessionData = {
          targetBrand,
          description,
          headline,
          bodyText,
          mediaType,
          mediaUrl: generatedVariations[currentVariationIdx] || '',
          selectedFilter,
          aspectRatio,
          resolution,
          audioMix,
          hotspotsCount: hotspots.length,
          savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        localStorage.setItem('adclone_auto_saved_session', JSON.stringify(sessionData));
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setAutoSaveStatus('saved');
        setLastSavedTime(timeStr);
        setShowAutoSaveToast(true);
        const toastTimer = setTimeout(() => setShowAutoSaveToast(false), 2500);
        return () => clearTimeout(toastTimer);
      } catch (err) {
        console.error('Auto-save error:', err);
        setAutoSaveStatus('unsaved');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [targetBrand, description, headline, bodyText, mediaType, currentVariationIdx, selectedFilter, aspectRatio, resolution, audioMix, hotspots.length]);

  // Rehydrate project state when loaded from User Memory
  useEffect(() => {
    if (loadedProject) {
      if (loadedProject.targetBrand) setTargetBrand(loadedProject.targetBrand);
      if (loadedProject.description) setDescription(loadedProject.description);
      if (loadedProject.headline) setHeadline(loadedProject.headline);
      if (loadedProject.bodyText) setBodyText(loadedProject.bodyText);
      if (loadedProject.mediaType) setMediaType(loadedProject.mediaType);
      if (loadedProject.aspectRatio) setAspectRatio(loadedProject.aspectRatio);
      if (loadedProject.resolution) setResolution(loadedProject.resolution);
      if (loadedProject.selectedFilter) setSelectedFilter(loadedProject.selectedFilter);
      if (loadedProject.mediaUrl) setGeneratedVariations([loadedProject.mediaUrl]);
    }
  }, [loadedProject]);

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (videoRef.current && videoDuration > 0) {
        if (trimEnd === 0) setTrimEnd(videoDuration);
        
        // Sequence mode logic handled in onEnded, but loop logic here for single clip
        if (!isSequenceMode) {
            if (currentTime < trimStart) videoRef.current.currentTime = trimStart;
            if (currentTime > trimEnd) {
                videoRef.current.currentTime = trimStart;
                videoRef.current.play();
            }
        }
    }
  }, [currentTime, trimStart, trimEnd, videoDuration, isSequenceMode]);

  // --- Handlers ---

  const handleAddHotspot = () => {
    const newH: AdHotspot = {
      id: `hotspot-${Date.now()}`,
      label: 'Interactive CTA Link',
      actionType: 'url',
      url: 'https://brand.com',
      x: 50,
      y: 50,
      width: 26,
      height: 12,
      startTime: 0.0,
      endTime: 1.0,
      pulse: true,
      style: 'accent'
    };
    setHotspots(prev => [...prev, newH]);
    setSelectedHotspotId(newH.id);
  };

  const handleUpdateHotspot = (updated: AdHotspot) => {
    setHotspots(prev => prev.map(h => h.id === updated.id ? updated : h));
  };

  const handleDeleteHotspot = (id: string) => {
    setHotspots(prev => prev.filter(h => h.id !== id));
    if (selectedHotspotId === id) setSelectedHotspotId(null);
  };

  const handleUpdateHotspotPos = (id: string, x: number, y: number) => {
    setHotspots(prev => prev.map(h => h.id === id ? { ...h, x, y } : h));
  };

  const handleAddComment = (timestamp: number, text: string) => {
    const newC: TimelineComment = {
      id: `comment-${Date.now()}`,
      timestamp,
      normalizedTime: videoDuration > 0 ? timestamp / videoDuration : 0,
      author: 'You (Editor)',
      authorAvatar: 'ME',
      text,
      createdAt: 'Just now',
      resolved: false
    };
    setComments(prev => [newC, ...prev]);
  };

  const handleResolveComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));
  };

  const handleDeleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCommentReply = (commentId: string, text: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const replies = c.replies || [];
        return {
          ...c,
          replies: [...replies, { id: `rep-${Date.now()}`, author: 'You (Editor)', text, createdAt: 'Just now' }]
        };
      }
      return c;
    }));
  };

  const handleSaveSnapshot = (customLabel?: string) => {
    const label = customLabel || `v${snapshots.length + 1}.0 (${selectedFilter || 'Normal'})`;
    const newSnap: VersionSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label,
      mediaUrl: generatedVariations[currentVariationIdx] || '',
      filter: selectedFilter,
      speed: playbackSpeed,
      targetBrand: targetBrand || 'Brand Master',
      overlayText: overlay.text,
      hotspotsCount: hotspots.length
    };
    setSnapshots(prev => [newSnap, ...prev]);
    setActiveSnapshotId(newSnap.id);
  };

  const handleRestoreSnapshot = (snap: VersionSnapshot) => {
    setSelectedFilter(snap.filter);
    setPlaybackSpeed(snap.speed);
    if (snap.targetBrand) setTargetBrand(snap.targetBrand);
    setActiveSnapshotId(snap.id);
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceMedia(reader.result as string);
        setReferenceMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const isVideo = file.type.startsWith('video');
        setMediaType(isVideo ? MediaType.VIDEO : MediaType.IMAGE);
        setGeneratedVariations(prev => {
            const newState = [...prev, result];
            setTimeout(() => setCurrentVariationIdx(newState.length - 1), 50);
            return newState;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          const newTrack: AudioTrack = {
              id: `custom-${Date.now()}`,
              name: file.name,
              url: url
          };
          setCustomTracks(prev => [...prev, newTrack]);
          setSelectedAudioId(newTrack.id);
      }
  };

  const handleBatchGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedVariations([]);
    const variations = ["High Energy Dynamic", "Emotional Storytelling", "Minimalist Premium"];
    try {
      const results: string[] = [];
      for (let i = 0; i < 3; i++) {
        const config: AdConfiguration = {
          targetBrand, brandPalette, originalDescription: description,
          modifications: `${modifications}. Concept Variation ${i+1}: ${variations[i]}`,
          customPrompt, mediaType, resolution, aspectRatio,
          referenceImageBase64: referenceMedia || undefined,
          referenceImageMimeType: referenceMimeType || undefined
        };
        const url = mediaType === MediaType.IMAGE ? await generateAdImage(config) : await generateAdVideo(config);
        results.push(url);
        setGeneratedVariations([...results]);
      }
    } catch (err: any) { setError(err.message); }
    setIsGenerating(false);
  };

  const handleUnlockPotential = () => setOverlay({...overlay, text: "Unlock Your Potential", color: brandPalette.primary});
  
  const handleGetSuggestions = async () => {
    if (generatedVariations.length === 0) {
        setError("Please generate content first.");
        return;
    }
    
    setIsGettingSuggestions(true);
    setEditSuggestions([]); // Clear previous
    
    try {
        if (mediaType === MediaType.IMAGE) {
            const currentUrl = generatedVariations[currentVariationIdx];
            let data = '';
            let mime = 'image/png';
            
            if (currentUrl.startsWith('data:')) {
                 const parts = currentUrl.split(',');
                 mime = parts[0].match(/:(.*?);/)?.[1] || mime;
                 data = parts[1];
            } else {
                 try {
                    const res = await fetch(currentUrl);
                    const blob = await res.blob();
                    mime = blob.type;
                    const reader = new FileReader();
                    data = await new Promise<string>((resolve) => {
                         reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                         reader.readAsDataURL(blob);
                    });
                 } catch(e) {
                     throw new Error("Could not access image data for analysis.");
                 }
            }
            const suggestions = await getImageEditSuggestions(data, mime);
            setEditSuggestions(suggestions);
        } else {
            const suggestions = await getVideoEditorSuggestions(
                targetBrand, description, videoDuration, playbackSpeed, selectedFilter
            );
            setEditSuggestions(suggestions);
        }
    } catch (e: any) { setError("Analysis failed: " + e.message); }
    setIsGettingSuggestions(false);
  };
  
  const handleCompareSelect = (idx: number) => {
    if (compareSelection.includes(idx)) {
      setCompareSelection(compareSelection.filter(i => i !== idx));
    } else {
      if (compareSelection.length < 2) {
        setCompareSelection([...compareSelection, idx]);
      } else {
        setCompareSelection([compareSelection[1], idx]); // Keep only latest 2
      }
    }
  };

  const handleRunComparison = async () => {
    if (compareSelection.length !== 2) return;
    setIsComparing(true);
    setComparisonResult(null);
    try {
      const m1 = generatedVariations[compareSelection[0]];
      const m2 = generatedVariations[compareSelection[1]];
      const d1 = m1.split(',')[1] || m1;
      const d2 = m2.split(',')[1] || m2;
      const result = await compareVariations(d1, d2, mediaType === MediaType.IMAGE ? 'image/png' : 'video/mp4', targetBrand);
      setComparisonResult(result);
    } catch (e: any) { setError("Comparison failed: " + e.message); }
    setIsComparing(false);
  };

  const handleAnalyzeConsistency = async () => {
    if (generatedVariations.length === 0) return;
    setIsAuditing(true);
    setBrandAuditResult(null);
    try {
        const currentUrl = generatedVariations[currentVariationIdx];
        let data = '';
        let mime = mediaType === MediaType.VIDEO ? 'video/mp4' : 'image/png';

        if (currentUrl.startsWith('data:')) {
            const parts = currentUrl.split(',');
            mime = parts[0].match(/:(.*?);/)?.[1] || mime;
            data = parts[1];
        } else {
            const res = await fetch(currentUrl);
            const blob = await res.blob();
            mime = blob.type;
            const reader = new FileReader();
            data = await new Promise((resolve) => {
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(blob);
            });
        }
        
        const result = await analyzeBrandConsistency(data, mime, targetBrand, brandPalette.primary);
        setBrandAuditResult(result);
    } catch (e: any) { setError("Audit failed: " + e.message); }
    setIsAuditing(false);
  };

  const handleGenerateSfxAction = async () => {
    setIsGeneratingSfx(true);
    try {
      const mood = customSfxPrompt || sfxMood;
      const b64 = await generateSoundEffect(mood);
      setGeneratedSfx(`data:audio/mp3;base64,${b64}`);
    } catch (e) { setError("SFX generation failed."); }
    setIsGeneratingSfx(false);
  };

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVoiceSample((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    }
  };

  const handleCloneNarration = async () => {
    if (!voiceSample || !bodyText) {
        setError("Please provide both a voice sample and text for narration.");
        return;
    }
    setIsCloning(true);
    try {
      const b64 = await cloneVoice(voiceSample, 'audio/mpeg', bodyText);
      setClonedAudioUrl(`data:audio/mpeg;base64,${b64}`);
    } catch (e) { setError("Voice cloning failed."); }
    setIsCloning(false);
  };

  const handleSavePreset = () => {
    if (!newPresetName) return;
    const preset: EditorPreset = {
      id: Date.now().toString(),
      name: newPresetName,
      category: newPresetCategory,
      speed: playbackSpeed, filter: selectedFilter,
      stabilization, crop,
      transitionType: introTransitionType, transitionDuration: introTransitionDuration,
      outroTransitionType, outroTransitionDuration,
      keyframes,
      audioMix, trimStart, trimEnd
    };
    setPresets([...presets, preset]);
    setNewPresetName('');
    setSelectedPresetId(preset.id);
  };

  const handleApplyPreset = (preset: EditorPreset) => {
    setPlaybackSpeed(preset.speed);
    setSelectedFilter(preset.filter);
    if (preset.stabilization !== undefined) setStabilization(preset.stabilization);
    if (preset.crop !== undefined) setCrop(preset.crop);
    setIntroTransitionType(preset.transitionType);
    setIntroTransitionDuration(preset.transitionDuration);
    if(preset.outroTransitionType) setOutroTransitionType(preset.outroTransitionType);
    if(preset.outroTransitionDuration) setOutroTransitionDuration(preset.outroTransitionDuration);
    setKeyframes(preset.keyframes || []);
    setIsKeyframingEnabled(true);
    if(preset.audioMix) setAudioMix(preset.audioMix);
    if(preset.trimStart !== undefined) setTrimStart(preset.trimStart);
    if(preset.trimEnd !== undefined) setTrimEnd(preset.trimEnd);
    setSelectedPresetId(preset.id);
  };

  const handleGenerateCopy = async () => {
    setIsGeneratingCopy(true);
    try {
      const copy = await generateMarketingCopy(targetBrand, description, modifications);
      setHeadline(copy.headline);
      setBodyText(copy.body);
      setOverlay(prev => ({ ...prev, text: copy.headline }));
    } catch (e) { setError("Failed to generate copy."); }
    setIsGeneratingCopy(false);
  };

  const handleGetPromptSuggestions = async () => {
      if (!description) {
          setError("Please enter a description first.");
          return;
      }
      setIsGettingPromptSuggestions(true);
      try {
          const suggestions = await getPromptSuggestions(targetBrand, description, modifications);
          setPromptSuggestions(suggestions);
      } catch (e: any) { setError("Failed to get suggestions"); }
      setIsGettingPromptSuggestions(false);
  };

  // --- Keyframe Logic ---
  const handleAddKeyframe = () => {
      const time = videoDuration > 0 ? currentTime / videoDuration : 0.5;
      const newKeyframe: Keyframe = {
          id: Date.now().toString(),
          time,
          zoom: 1.0,
          x: 50,
          y: 50
      };
      const newKeyframes = [...keyframes, newKeyframe].sort((a, b) => a.time - b.time);
      setKeyframes(newKeyframes);
      setSelectedKeyframeId(newKeyframe.id);
      setIsKeyframingEnabled(true);
  };

  const handleDeleteKeyframe = () => {
      if (!selectedKeyframeId) return;
      const newKeyframes = keyframes.filter(k => k.id !== selectedKeyframeId);
      // Ensure we always have start/end or at least 2 points for valid interpolation if enabled
      if (newKeyframes.length < 2) {
          // Reset to default
          setKeyframes([
              { id: 'start', time: 0, zoom: 1, x: 50, y: 50 },
              { id: 'end', time: 1, zoom: 1, x: 50, y: 50 }
          ]);
      } else {
          setKeyframes(newKeyframes);
      }
      setSelectedKeyframeId(null);
  };

  const updateSelectedKeyframe = (updates: Partial<Keyframe>) => {
      if (!selectedKeyframeId) return;
      setKeyframes(prev => prev.map(k => k.id === selectedKeyframeId ? { ...k, ...updates } : k).sort((a, b) => a.time - b.time));
  };

  // --- Style Logic ---
  const getInterpolatedStyle = () => {
    let transform = '';
    
    if (isKeyframingEnabled && keyframes.length >= 2) {
        const progress = videoDuration > 0 ? currentTime / videoDuration : 0;
        
        // Find surrounding keyframes
        let prev = keyframes[0];
        let next = keyframes[keyframes.length - 1];
        
        for (let i = 0; i < keyframes.length - 1; i++) {
            if (progress >= keyframes[i].time && progress <= keyframes[i+1].time) {
                prev = keyframes[i];
                next = keyframes[i+1];
                break;
            }
        }
        
        const segmentDuration = next.time - prev.time;
        const segmentProgress = segmentDuration > 0 ? (progress - prev.time) / segmentDuration : 0;
        
        const z = prev.zoom + (next.zoom - prev.zoom) * segmentProgress;
        const x = prev.x + (next.x - prev.x) * segmentProgress;
        const y = prev.y + (next.y - prev.y) * segmentProgress;
        
        transform = `scale(${z}) translate(${x - 50}%, ${y - 50}%)`;
    } else {
        const totalScale = crop * (1 + stabilization * 0.1); 
        transform = `scale(${totalScale})`;
    }

    return { transform, transition: 'none' };
  };

  const getTransitionStyle = () => {
    // Handling Sequence Mode Transitions
    if (isSequenceMode && isTransitioning) {
        // Transition effect applied globally via overlay
        return { opacity: 1 };
    }

    // Single Clip Intro/Outro
    const relativeTime = Math.max(0, currentTime - trimStart);
    if (introTransitionType !== 'none' && relativeTime < introTransitionDuration) {
        const p = relativeTime / introTransitionDuration;
        if (introTransitionType === 'fade') return { opacity: p };
        if (introTransitionType === 'slide') return { transform: `translateX(${(1 - p) * -100}%)` };
        if (introTransitionType === 'wipe') return { clipPath: `inset(0 ${100 - (p * 100)}% 0 0)` };
    }
    const timeRemaining = trimEnd - currentTime;
    if (outroTransitionType !== 'none' && timeRemaining < outroTransitionDuration && timeRemaining > 0) {
        const p = timeRemaining / outroTransitionDuration; 
        if (outroTransitionType === 'fade') return { opacity: p };
        if (outroTransitionType === 'slide') return { transform: `translateX(${(1 - p) * 100}%)` };
        if (outroTransitionType === 'wipe') return { clipPath: `inset(0 0 0 ${100 - (p * 100)}%)` };
    }
    return { opacity: 1, transform: 'none', clipPath: 'none' };
  };

  const handleVideoEnded = () => {
      if (isSequenceMode && generatedVariations.length > 1) {
          const nextIdx = (currentVariationIdx + 1) % generatedVariations.length;
          setIsTransitioning(true);
          
          const halfDuration = (sequenceTransitionDuration * 1000) / 2;

          // Wait for transition halfway point to swap source
          setTimeout(() => {
              setCurrentVariationIdx(nextIdx);
              // Wait for transition end to resume normal state
              setTimeout(() => {
                  setIsTransitioning(false);
              }, halfDuration);
          }, halfDuration);
      } else if (!isSequenceMode) {
          // Loop
          if (videoRef.current) {
              videoRef.current.currentTime = trimStart;
              videoRef.current.play();
          }
      }
  };

  const allAudioTracks = [...DEFAULT_AUDIO_TRACKS, ...customTracks];
  const activeAudioTrack = allAudioTracks.find(t => t.id === selectedAudioId);
  const activeKeyframe = keyframes.find(k => k.id === selectedKeyframeId);

  // Reusable UI Components for Material You Look
  const Slider = ({ value, min, max, step, onChange, accentColor = "bg-[#A8C7FA]" }: any) => (
    <input 
      type="range" min={min} max={max} step={step} value={value} onChange={onChange} 
      className={`w-full h-2 bg-[#2C2C2C] rounded-full appearance-none cursor-pointer accent-[#A8C7FA] hover:accent-[#D0BCFF] transition-all`}
    />
  );

  const PillButton = ({ onClick, disabled, active, children, color = "bg-[#2C2C2C]", activeColor = "bg-[#A8C7FA] text-[#003355]" }: any) => (
      <button 
        onClick={onClick} disabled={disabled}
        className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border border-white/5 ${active ? activeColor : `${color} text-[#E2E2E2] hover:bg-white/10`} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
          {children}
      </button>
  );

  const FilledInput = (props: any) => (
      <input {...props} className={`w-full bg-[#2C2C2C] border-none rounded-2xl px-4 py-3 text-sm text-[#E2E2E2] placeholder-[#8E918F] focus:ring-2 focus:ring-[#A8C7FA] focus:outline-none transition-all ${props.className}`} />
  );

  return (
    <div className={`flex flex-1 h-full min-h-0 gap-3 transition-colors duration-300 overflow-hidden ${
      themeMode === 'light' ? 'bg-[#F4F5F7] text-[#1E1E1E]' : 'bg-transparent text-[#E2E2E2]'
    }`}>
      <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes typing { from { width: 0 } to { width: 100% } }
          
          .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
          .animate-slide-in { animation: slideIn 0.8s ease-out forwards; }
          .animate-bounce-in { animation: bounceIn 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards; }
          .animate-typewriter { animation: typing 2s steps(40, end); }

          .transition-overlay { pointer-events: none; opacity: 0; transition-property: all; transition-timing-function: ease-in-out; position: absolute; inset: 0; background: black; z-index: 50; }
          .transition-active-fade { opacity: 1; }
          .transition-active-slide { opacity: 1; transform: translateX(0); background: black; animation-name: slideOver; animation-timing-function: ease-in-out; }
          @keyframes slideOver { 0% { transform: translateX(100%); } 50% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
          .transition-active-wipe { opacity: 1; clip-path: inset(0 0 0 0); animation-name: wipeOver; animation-timing-function: ease-in-out; }
          @keyframes wipeOver { 0% { clip-path: inset(0 100% 0 0); } 50% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 0 0 100%); } }
      `}</style>
      
      {/* --- LEFT FLOATING ISLAND: Generator --- */}
      <div className={`${isLeftPanelOpen ? 'w-[360px]' : 'w-0'} flex-shrink-0 bg-[#121212] rounded-[32px] transition-all duration-500 overflow-hidden flex flex-col border border-white/5 shadow-2xl relative`}>
          <div className="p-6 pb-2 flex justify-between items-center z-10">
              <span className="text-xl font-medium text-[#E2E2E2] flex items-center gap-3">
                  <div className="p-2 bg-[#A8C7FA] rounded-full text-[#003355]"><Sparkles className="w-5 h-5"/></div> Generator
              </span>
              <button onClick={() => setIsLeftPanelOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><PanelLeftClose className="w-5 h-5 text-[#8E918F]"/></button>
          </div>
          
          <div className="overflow-y-auto custom-scrollbar flex-1 p-4 space-y-2">
             <CollapsiblePanel title="Creative Brief" icon={<FileText className="w-4 h-4"/>} defaultOpen={true}>
                <div className="space-y-4 pt-2">
                    <FilledInput placeholder="Target Brand" value={targetBrand} onChange={(e: any) => setTargetBrand(e.target.value)} />
                    <div className="flex gap-2 items-center bg-[#2C2C2C] rounded-2xl p-2 px-4">
                        <span className="text-xs text-[#E2E2E2] font-medium flex-1">Brand Color</span>
                        <input type="color" className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-none" value={brandPalette.primary} onChange={e => setBrandPalette({...brandPalette, primary: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => refFileInputRef.current?.click()} className="aspect-square bg-[#2C2C2C] rounded-[24px] flex flex-col items-center justify-center text-[#A8C7FA] hover:bg-[#A8C7FA]/10 transition-colors border border-dashed border-[#A8C7FA]/30">
                             <Upload className="w-6 h-6 mb-2"/> <span className="text-xs font-medium">Ref Media</span>
                             <input type="file" ref={refFileInputRef} onChange={handleReferenceUpload} className="hidden" />
                        </button>
                        <button onClick={() => uploadInputRef.current?.click()} className="aspect-square bg-[#2C2C2C] rounded-[24px] flex flex-col items-center justify-center text-[#D0BCFF] hover:bg-[#D0BCFF]/10 transition-colors border border-dashed border-[#D0BCFF]/30">
                             <FolderOpen className="w-6 h-6 mb-2"/> <span className="text-xs font-medium">Import</span>
                             <input type="file" ref={uploadInputRef} onChange={handleUploadContent} className="hidden" />
                        </button>
                    </div>

                    <textarea className="w-full bg-[#2C2C2C] border-none rounded-[24px] p-4 text-sm text-[#E2E2E2] h-32 resize-none placeholder-[#8E918F] focus:ring-2 focus:ring-[#A8C7FA] focus:outline-none" placeholder="Describe your ad concept..." value={description} onChange={e => setDescription(e.target.value)} />
                    
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <FilledInput placeholder="Custom AI Prompt (Optional)" value={customPrompt} onChange={(e: any) => setCustomPrompt(e.target.value)} />
                            <button onClick={handleGetPromptSuggestions} disabled={isGettingPromptSuggestions || !description} className="p-3 bg-[#2C2C2C] rounded-2xl text-[#D0BCFF] hover:bg-white/10 flex-shrink-0">
                                {isGettingPromptSuggestions ? <Loader2 className="w-5 h-5 animate-spin"/> : <Sparkles className="w-5 h-5"/>}
                            </button>
                        </div>
                        {promptSuggestions.length > 0 && (
                            <div className="bg-[#2C2C2C] rounded-2xl p-2 space-y-1 animate-in slide-in-from-top-2">
                                <div className="flex justify-between px-2 pb-1 border-b border-white/5">
                                    <span className="text-[10px] uppercase text-[#8E918F] font-bold">Ideas</span>
                                    <button onClick={() => setPromptSuggestions([])}><X className="w-3 h-3 text-[#8E918F]"/></button>
                                </div>
                                {promptSuggestions.map((s, i) => (
                                    <button key={i} onClick={() => { setCustomPrompt(s); setPromptSuggestions([]); }} className="w-full text-left text-xs text-[#E2E2E2] p-2 hover:bg-white/5 rounded-lg truncate transition-colors">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={handleBatchGenerate} disabled={isGenerating || !description} className="w-full h-14 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#A8C7FA]/20">
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin"/> : <Zap className="w-5 h-5 fill-current"/>} Generate Variations
                    </button>
                    {error && <div className="text-[#FFB4AB] text-xs text-center bg-[#93000A]/30 p-2 rounded-xl">{error}</div>}
                </div>
             </CollapsiblePanel>

             <CollapsiblePanel title="Marketing Copy" icon={<MessageSquarePlus className="w-4 h-4"/>}>
                <div className="space-y-4 pt-2">
                    <button onClick={handleGenerateCopy} disabled={isGeneratingCopy || !description} className="w-full py-3 bg-[#D0BCFF] text-[#381E72] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                        {isGeneratingCopy ? <Loader2 className="w-4 h-4 animate-spin"/> : <PenTool className="w-4 h-4"/>} Generate Copy
                    </button>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#C4C7C5] ml-2">Headline</label>
                        <textarea className="w-full bg-[#2C2C2C] border-none rounded-2xl p-3 text-sm text-[#E2E2E2] resize-none focus:ring-2 focus:ring-[#D0BCFF] focus:outline-none" rows={2} value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Ad headline..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#C4C7C5] ml-2">Body Text</label>
                        <textarea className="w-full bg-[#2C2C2C] border-none rounded-2xl p-3 text-sm text-[#E2E2E2] resize-none focus:ring-2 focus:ring-[#D0BCFF] focus:outline-none" rows={4} value={bodyText} onChange={e => setBodyText(e.target.value)} placeholder="Ad body copy..." />
                    </div>
                </div>
             </CollapsiblePanel>

             <CollapsiblePanel title="AI Tools" icon={<Beaker className="w-4 h-4"/>}>
                <div className="space-y-3 pt-2">
                    <button onClick={handleUnlockPotential} className="w-full py-3 bg-[#2C2C2C] rounded-2xl text-xs font-medium text-[#E2E2E2] hover:bg-white/10 flex items-center justify-center gap-2"><PenTool className="w-4 h-4"/> Apply Headline</button>
                    <button onClick={handleGetSuggestions} className="w-full py-3 bg-[#2C2C2C] rounded-2xl text-xs font-medium text-[#E2E2E2] hover:bg-white/10 flex items-center justify-center gap-2">
                         {isGettingSuggestions ? <Loader2 className="w-4 h-4 animate-spin"/> : <Lightbulb className="w-4 h-4"/>} Get Suggestions
                    </button>
                    <button onClick={handleAnalyzeConsistency} disabled={isAuditing || generatedVariations.length === 0} className="w-full py-3 bg-[#2C2C2C] rounded-2xl text-xs font-medium text-[#E2E2E2] hover:bg-white/10 flex items-center justify-center gap-2">
                        {isAuditing ? <Loader2 className="w-4 h-4 animate-spin"/> : <ShieldCheck className="w-4 h-4"/>} 
                        Audit Brand Consistency
                    </button>
                </div>
             </CollapsiblePanel>

             <CollapsiblePanel title="Brand Assets & Guardrails" icon={<Tag className="w-4 h-4"/>}>
                <div className="pt-2">
                  <BrandAssetsPanel
                    onApplyColor={(hex) => setBrandPalette(prev => ({ ...prev, primary: hex }))}
                    onApplyFont={(font) => setOverlay(prev => ({ ...prev, fontFamily: font }))}
                    onApplyLogo={(logoUrl) => setReferenceMedia(logoUrl)}
                    onOpenGuardrail={() => setIsGuardrailModalOpen(true)}
                    onOpenOneClickRefinement={() => setIsOneClickRefinementOpen(true)}
                  />
                </div>
             </CollapsiblePanel>
          </div>
      </div>

      {!isLeftPanelOpen && (
          <div className="absolute left-4 top-24 z-20">
              <button onClick={() => setIsLeftPanelOpen(true)} className="w-12 h-12 bg-[#1E1E1E] rounded-full shadow-xl border border-white/5 flex items-center justify-center text-[#A8C7FA] hover:scale-110 transition-transform">
                  <PanelLeftOpen className="w-6 h-6"/>
              </button>
          </div>
      )}

      {/* --- CENTER FLOATING ISLAND: Preview & Timeline --- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full gap-3">
          
          {/* Main Stage */}
          <div className="flex-1 min-h-0 bg-[#121212] rounded-[32px] border border-white/5 shadow-2xl flex flex-col overflow-hidden relative">
              {/* Top Control Bar */}
              <div className="h-16 px-6 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent absolute top-0 left-0 right-0 z-20 pointer-events-none">
                  <div className="flex gap-2 pointer-events-auto">
                    {/* Variation Pills */}
                      <div className="bg-[#1E1E1E]/80 backdrop-blur-md p-1 rounded-full flex gap-1 border border-white/10">
                        {generatedVariations.map((v, i) => (
                            <button 
                                key={i} 
                                onClick={() => isComparisonMode ? handleCompareSelect(i) : setCurrentVariationIdx(i)}
                                className={`w-8 h-8 rounded-full overflow-hidden border transition-all relative ${
                                isComparisonMode && compareSelection.includes(i) 
                                    ? 'border-[#D0BCFF] ring-2 ring-[#D0BCFF]/50' 
                                    : currentVariationIdx === i && !isComparisonMode
                                    ? 'border-[#A8C7FA] scale-110' 
                                    : 'border-transparent opacity-60'
                                }`}
                            >
                                {mediaType === MediaType.VIDEO ? <video src={v} className="w-full h-full object-cover"/> : <img src={v} className="w-full h-full object-cover"/>}
                            </button>
                        ))}
                      </div>
                  </div>
                  <div className="flex gap-2 items-center pointer-events-auto py-1">
                      {/* Timeline Feedback Pins Button */}
                      <button
                        onClick={() => setIsCommentPanelOpen(true)}
                        className="h-9 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-full text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 border border-emerald-500/30 flex-shrink-0"
                        title="Open Timeline Pins & Comment Threads (Press C)"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-400" /> 
                        <span className="hidden sm:inline">Comments ({comments.length})</span>
                      </button>

                      {/* Studio Utilities Dropdown */}
                      <div className="relative" ref={studioToolsRef}>
                        <button
                          onClick={() => setIsStudioToolsOpen(!isStudioToolsOpen)}
                          className={`h-9 px-3 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 border flex-shrink-0 ${
                            isStudioToolsOpen 
                              ? 'bg-purple-500/30 text-purple-200 border-purple-400 ring-2 ring-purple-500/20' 
                              : 'bg-[#1E1E1E]/80 hover:bg-[#2A2A2A] text-slate-300 border-white/10'
                          }`}
                          title="Studio Analytics & Canvas Utilities"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Studio Tools</span>
                          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isStudioToolsOpen ? 'rotate-180 text-purple-400' : 'text-slate-400'}`} />
                        </button>

                        {/* Dropdown Popover */}
                        {isStudioToolsOpen && (
                          <div className="absolute top-full right-0 mt-2 w-64 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 space-y-1">
                            <div className="px-3 py-1 border-b border-white/5 mb-1 text-[10px] font-bold text-purple-400 uppercase tracking-wider">Studio Analytics & Tools</div>

                             <button
                              onClick={() => { setIsCatalogBatchOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <ShoppingBag className="w-4 h-4 text-amber-400" />
                              <span>Dynamic Product Catalog Batch Generator</span>
                            </button>

                            <button
                              onClick={() => { setIsGuardrailModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>Brand Guardrail Settings</span>
                            </button>

                            <button
                              onClick={() => { setIsOneClickRefinementOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Wand2 className="w-4 h-4 text-pink-400" />
                              <span>One-Click AI Asset Refinement</span>
                            </button>

                            <button
                              onClick={() => { setIsAssetRepurposerOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Layers className="w-4 h-4 text-indigo-400" />
                              <span>IAB Display Asset Repurposer</span>
                            </button>

                            <button
                              onClick={() => { setIsAdSuccessScoreOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <BarChart3 className="w-4 h-4 text-purple-400" />
                              <span>Ad Success Score Dashboard</span>
                            </button>

                            <button
                              onClick={() => { setIsStoryboardOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Film className="w-4 h-4 text-indigo-400" />
                              <span>AI Script Storyboard Generator</span>
                            </button>

                            <button
                              onClick={() => { setIsSentimentModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <BarChart3 className="w-4 h-4 text-purple-400" />
                              <span>Predictive CTR Analytics</span>
                            </button>

                            <button
                              onClick={() => { setIsElevenLabsModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Globe className="w-4 h-4 text-indigo-400" />
                              <span>ElevenLabs Voice Studio</span>
                            </button>

                            <button
                              onClick={() => { setIsTeleprompterModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Video className="w-4 h-4 text-rose-400" />
                              <span>UGC Cam & Teleprompter</span>
                            </button>

                            <button
                              onClick={() => { setIsSfxModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Zap className="w-4 h-4 text-amber-400" />
                              <span>Foley & SFX Soundboard</span>
                            </button>

                            <button
                              onClick={() => { setIsColorLutsModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Palette className="w-4 h-4 text-amber-400" />
                              <span>3D LUTs & Color Grading</span>
                            </button>

                            <button
                              onClick={() => { setIsSpatialAudioModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Radio className="w-4 h-4 text-cyan-400" />
                              <span>3D Spatial Audio Engine</span>
                            </button>

                            <button
                              onClick={() => { setIsVfxModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              <span>VFX Composite & Keyer</span>
                            </button>

                            <button
                              onClick={() => { setIsMultiCamModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Camera className="w-4 h-4 text-emerald-400" />
                              <span>Multi-Cam Sync & AI Director</span>
                            </button>

                            <button
                              onClick={() => { setIsMotionTrackModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Target className="w-4 h-4 text-yellow-400" />
                              <span>Optical Motion Tracking</span>
                            </button>

                            <button
                              onClick={() => { setIsSmartCleanupModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Wand2 className="w-4 h-4 text-sky-400" />
                              <span>Smart Visual Cleanup</span>
                            </button>

                            <button
                              onClick={() => { setIsAccessibilityModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>WCAG Accessibility Audit</span>
                            </button>

                            <button
                              onClick={() => { setIsSketchCanvasOpen(!isSketchCanvasOpen); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <PenTool className="w-4 h-4 text-amber-300" />
                              <span>{isSketchCanvasOpen ? 'Close Sketch Overlay' : 'Sketch Overlay Canvas'}</span>
                            </button>

                            <button
                              onClick={() => { setIsBatchModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Layers className="w-4 h-4 text-indigo-400" />
                              <span>Batch Processing Queue</span>
                            </button>

                            <button
                              onClick={() => { setIsKeyboardModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <Keyboard className="w-4 h-4 text-slate-400" />
                              <span>Keyboard Shortcuts (?)</span>
                            </button>

                            <button
                              onClick={() => { setIsVersionHistoryModalOpen(true); setIsStudioToolsOpen(false); }}
                              className="w-full p-2 rounded-xl hover:bg-white/5 text-left flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                            >
                              <History className="w-4 h-4 text-sky-400" />
                              <span>Version History ({snapshots.length})</span>
                            </button>

                            <button
                              onClick={() => { setIsComparisonMode(!isComparisonMode); setCompareSelection([]); setComparisonResult(null); setIsStudioToolsOpen(false); }}
                              className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 text-xs transition-colors ${
                                isComparisonMode ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'hover:bg-white/5 text-slate-200'
                              }`}
                            >
                              <GitCompare className="w-4 h-4 text-indigo-400" />
                              <span>{isComparisonMode ? 'Exit Compare Mode' : 'Side-by-Side Compare Mode'}</span>
                            </button>

                            <button
                              onClick={() => { setIsSequenceMode(!isSequenceMode); setIsStudioToolsOpen(false); }}
                              className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 text-xs transition-colors ${
                                isSequenceMode ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:bg-white/5 text-slate-200'
                              }`}
                            >
                              <ListVideo className="w-4 h-4 text-emerald-400" />
                              <span>{isSequenceMode ? 'Sequence Mode Enabled' : 'Enable Sequence Mode'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Theme Mode Switcher Icon */}
                      <button
                        onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
                        className={`h-9 w-9 rounded-full shadow-sm transition-all flex items-center justify-center border flex-shrink-0 ${
                          themeMode === 'light'
                            ? 'bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/25'
                            : 'bg-[#1E1E1E]/80 text-indigo-300 border-white/10 hover:bg-white/10'
                        }`}
                        title={themeMode === 'light' ? 'Switch to Dark Studio' : 'Switch to Light Creative'}
                      >
                        {themeMode === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                      </button>

                      {/* Auto-Save Indicator */}
                      <div className="h-9 px-3 bg-[#1E1E1E]/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5 text-xs font-semibold text-[#E2E2E2] shadow-sm flex-shrink-0">
                        {autoSaveStatus === 'saving' ? (
                          <>
                            <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                            <span className="text-amber-300 text-[10px]">Saving...</span>
                          </>
                        ) : autoSaveStatus === 'saved' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300 text-[10px]">Saved</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            <span className="text-rose-300 text-[10px]">Unsaved</span>
                          </>
                        )}
                      </div>

                      {/* Direct Export Button */}
                      <button
                        onClick={() => setIsExportModalOpen(true)}
                        className="h-9 px-4 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
                        title="Export and download ad file"
                      >
                        <Download className="w-3.5 h-3.5" /> <span>Export</span>
                      </button>
                  </div>
              </div>


              {/* Grid & Color FX Overlay Floating Toolbar */}
              <div className="absolute top-16 right-6 z-30 flex items-center gap-2 bg-[#1E1E1E]/90 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-lg pointer-events-auto">
                {/* Grid Mode Selector */}
                <div className="flex items-center gap-1 bg-[#2C2C2C] p-1 rounded-full text-[10px]">
                  <span className="text-[#8E918F] px-1 font-bold flex items-center gap-1"><Grid className="w-3 h-3"/> Grid</span>
                  {(['none', 'rule-of-thirds', 'golden-ratio', 'center-cross'] as GridOverlayMode[]).map(g => (
                    <button
                      key={g}
                      onClick={() => setGridOverlayMode(g)}
                      className={`px-2 py-0.5 rounded-full font-medium transition-all ${gridOverlayMode === g ? 'bg-[#A8C7FA] text-[#003355]' : 'text-[#C4C7C5] hover:text-white'}`}
                    >
                      {g === 'none' ? 'Off' : g === 'rule-of-thirds' ? '3x3' : g === 'golden-ratio' ? 'Phi' : 'Cross'}
                    </button>
                  ))}
                </div>

                <div className="w-px h-4 bg-white/10" />

                {/* Color FX Visualizer Mode Selector */}
                <div className="flex items-center gap-1 bg-[#2C2C2C] p-1 rounded-full text-[10px]">
                  <span className="text-[#8E918F] px-1 font-bold flex items-center gap-1"><BarChart3 className="w-3 h-3"/> Color FX</span>
                  {(['none', 'histogram', 'heatmap'] as ColorVisualizerMode[]).map(c => (
                    <button
                      key={c}
                      onClick={() => setColorVisualizerMode(c)}
                      className={`px-2 py-0.5 rounded-full font-medium transition-all capitalize ${colorVisualizerMode === c ? 'bg-[#D0BCFF] text-[#381E72]' : 'text-[#C4C7C5] hover:text-white'}`}
                    >
                      {c === 'none' ? 'Off' : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport */}
              <div className="flex-1 relative flex items-center justify-center bg-[#000000] p-8">
                 <div className="relative shadow-2xl rounded-[24px] overflow-hidden max-h-full max-w-full aspect-video border border-white/10 group bg-[#1E1E1E]" style={{ aspectRatio: aspectRatio === AspectRatio.PORTRAIT ? '9/16' : '16/9' }}>
                     {/* Viewport Grid & Heatmap Overlays */}
                     <GridOverlay gridMode={gridOverlayMode} visualizerMode={colorVisualizerMode} filterId={selectedFilter} />
                     
                     {/* Real-time Histogram Popup */}
                     <ColorHistogram filterId={selectedFilter} isVisible={colorVisualizerMode === 'histogram'} onClose={() => setColorVisualizerMode('none')} />

                     {/* Transition Overlay */}
                     <div 
                        className={`transition-overlay ${isTransitioning ? (sequenceTransition === 'slide' ? 'transition-active-slide' : sequenceTransition === 'wipe' ? 'transition-active-wipe' : 'transition-active-fade') : ''}`}
                        style={{ 
                            transitionDuration: `${sequenceTransitionDuration / 2}s`,
                            animationDuration: `${sequenceTransitionDuration}s` 
                        }}
                     ></div>

                     {generatedVariations.length > 0 ? (
                        <div className="w-full h-full relative" style={getTransitionStyle()}>
                            {/* Audio Layers */}
                            {activeAudioTrack && activeAudioTrack.id !== 'none' && (
                                 <audio ref={r => { if(r) r.volume = audioMix.musicVolume }} src={activeAudioTrack.url} autoPlay loop />
                            )}
                            {clonedAudioUrl && (
                                 <audio ref={r => { if(r) r.volume = audioMix.voiceVolume }} src={clonedAudioUrl} autoPlay />
                            )}
                            {generatedSfx && (
                                 <audio ref={r => { if(r) r.volume = audioMix.sfxVolume }} src={generatedSfx} />
                            )}

                            {mediaType === MediaType.VIDEO ? (
                                <video 
                                    ref={videoRef}
                                    src={generatedVariations[currentVariationIdx]}
                                    className="w-full h-full object-cover"
                                    style={{
                                        ...getInterpolatedStyle(),
                                        filter: FILTER_OPTIONS.find(f => f.id === selectedFilter)?.filter
                                    }}
                                    onLoadedMetadata={() => {
                                        if(videoRef.current) {
                                            setVideoDuration(videoRef.current.duration);
                                            setTrimEnd(videoRef.current.duration);
                                        }
                                    }}
                                    onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                                    onEnded={handleVideoEnded}
                                    autoPlay muted
                                />
                            ) : (
                                <img 
                                    src={generatedVariations[currentVariationIdx]} 
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: FILTER_OPTIONS.find(f => f.id === selectedFilter)?.filter
                                    }}
                                />
                            )}
                            
                            {overlay.text && (
                                <div className={`absolute w-full h-full pointer-events-none top-0 left-0 flex p-8 ${
                                    overlay.position.includes('top') ? 'items-start' : overlay.position.includes('bottom') ? 'items-end' : 'items-center'
                                } ${
                                    overlay.position.includes('left') ? 'justify-start' : overlay.position.includes('right') ? 'justify-end' : 'justify-center'
                                }`}>
                                    <h2 
                                        key={`${overlay.text}-${overlay.animation}-${currentVariationIdx}`}
                                        style={{ color: overlay.color }} 
                                        className={`font-bold drop-shadow-xl ${overlay.size === 'small' ? 'text-2xl' : overlay.size === 'large' ? 'text-6xl' : 'text-4xl'} ${overlay.font === 'serif' ? 'font-serif' : overlay.font === 'mono' ? 'font-mono' : 'font-sans'} text-${overlay.alignment} 
                                        ${overlay.animation === 'fade' ? 'animate-fade-in' : ''}
                                        ${overlay.animation === 'slide' ? 'animate-slide-in' : ''}
                                        ${overlay.animation === 'bounce' ? 'animate-bounce-in' : ''}
                                        ${overlay.animation === 'typewriter' ? 'animate-typewriter overflow-hidden whitespace-nowrap border-r-4 border-current pr-1' : ''}
                                        `}
                                    >
                                        {overlay.text}
                                    </h2>
                                </div>
                            )}

                            {/* Interactive In-Ad Hotspots Layer */}
                            <HotspotOverlay
                              hotspots={hotspots}
                              currentTime={videoDuration > 0 ? currentTime / videoDuration : 0}
                              duration={videoDuration || 10}
                              isEditing={true}
                              selectedHotspotId={selectedHotspotId}
                              onSelectHotspot={setSelectedHotspotId}
                              onUpdateHotspotPos={handleUpdateHotspotPos}
                            />

                            {/* Collaborative Sketch Drawing Canvas */}
                            <CollaborativeSketchCanvas
                              isOpen={isSketchCanvasOpen}
                              onClose={() => setIsSketchCanvasOpen(false)}
                              currentTime={currentTime}
                              videoDuration={videoDuration || 10}
                              onSaveSketchNote={(timestamp, sketchDataUrl) => {
                                handleAddComment(timestamp, 'Sketch annotation note');
                              }}
                            />
                        </div>
                     ) : (

                         <div className="flex flex-col items-center justify-center h-full text-[#444746] gap-4">
                             <MonitorPlay className="w-24 h-24 opacity-20"/>
                             <p className="text-lg font-medium">No active composition</p>
                         </div>
                     )}
                     
                     {/* One UI Style Comparison Overlay */}
                     {comparisonResult && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl p-8 z-50 flex flex-col justify-center animate-in fade-in zoom-in-95">
                             <div className="bg-[#1E1E1E] rounded-[32px] p-8 shadow-2xl border border-white/10 max-h-full overflow-y-auto">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-semibold text-[#D0BCFF] flex items-center gap-3"><GitCompare className="w-8 h-8"/> Analysis Report</h3>
                                    <button onClick={() => setComparisonResult(null)} className="p-2 bg-[#2C2C2C] rounded-full hover:bg-white/10"><X className="w-6 h-6 text-[#E2E2E2]"/></button>
                                </div>
                                <div className="prose prose-invert prose-lg text-[#C4C7C5] leading-relaxed whitespace-pre-line">
                                    {comparisonResult}
                                </div>
                             </div>
                        </div>
                     )}

                     {/* Brand Audit Overlay */}
                     {brandAuditResult && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl p-8 z-50 flex flex-col justify-center animate-in fade-in zoom-in-95">
                                <div className="bg-[#1E1E1E] rounded-[32px] p-8 shadow-2xl border border-white/10 max-h-full overflow-y-auto">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-semibold text-[#6DD58C] flex items-center gap-3"><ShieldCheck className="w-8 h-8"/> Brand Audit</h3>
                                    <button onClick={() => setBrandAuditResult(null)} className="p-2 bg-[#2C2C2C] rounded-full hover:bg-white/10"><X className="w-6 h-6 text-[#E2E2E2]"/></button>
                                </div>
                                <div className="prose prose-invert prose-lg text-[#C4C7C5] leading-relaxed whitespace-pre-line">
                                    {brandAuditResult}
                                </div>
                                </div>
                        </div>
                     )}

                     {/* Creative Suggestions Overlay */}
                     {editSuggestions.length > 0 && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl p-8 z-50 flex flex-col justify-center animate-in fade-in zoom-in-95">
                                <div className="bg-[#1E1E1E] rounded-[32px] p-8 shadow-2xl border border-white/10 max-h-full overflow-y-auto w-full max-w-2xl mx-auto">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-semibold text-[#FDD663] flex items-center gap-3"><Lightbulb className="w-8 h-8"/> Creative Suggestions</h3>
                                    <button onClick={() => setEditSuggestions([])} className="p-2 bg-[#2C2C2C] rounded-full hover:bg-white/10"><X className="w-6 h-6 text-[#E2E2E2]"/></button>
                                </div>
                                <div className="space-y-4">
                                    {editSuggestions.map((suggestion, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-[#2C2C2C] rounded-2xl border border-white/5 items-start">
                                            <div className="bg-[#FDD663]/20 text-[#FDD663] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                                                {idx + 1}
                                            </div>
                                            <p className="text-[#E2E2E2] text-lg leading-relaxed">{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button onClick={() => setEditSuggestions([])} className="px-6 py-2 bg-[#FDD663] text-[#2C1C00] rounded-full font-bold text-sm hover:bg-[#FDE293] transition-colors">
                                        Got it
                                    </button>
                                </div>
                                </div>
                        </div>
                     )}
                 </div>
              </div>
          </div>

          {/* Bottom Floating Timeline */}
          {mediaType === MediaType.VIDEO && (
            <div className="h-20 flex-shrink-0 bg-[#121212] rounded-[32px] border border-white/5 shadow-xl flex flex-col justify-center px-6 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="text-xs font-mono text-[#8E918F] w-12">{currentTime.toFixed(1)}s</div>
                    <div className="flex-1 h-12 bg-[#000000] rounded-[16px] relative group cursor-pointer overflow-visible border border-white/10"
                        onClick={(e) => {
                            if (!videoRef.current) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pos = (e.clientX - rect.left) / rect.width;
                            videoRef.current.currentTime = pos * videoDuration;
                        }}
                    >
                        {/* Progress */}
                        <div className="absolute top-0 left-0 h-full bg-[#A8C7FA]/20 w-full rounded-[16px]"></div>
                        <div className="absolute top-0 left-0 h-full bg-[#A8C7FA] rounded-[16px]" style={{ width: `${(currentTime / videoDuration) * 100}%` }}></div>
                        
                        {/* Advanced Keyframes Visualizer */}
                        {isKeyframingEnabled && keyframes.map(kf => (
                            <div 
                                key={kf.id}
                                className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all hover:scale-125 z-30 ${selectedKeyframeId === kf.id ? 'bg-[#FFB4AB] border-white scale-125' : 'bg-[#2C2C2C] border-[#FFB4AB]'}`}
                                style={{ left: `${kf.time * 100}%` }}
                                onClick={(e) => { e.stopPropagation(); setSelectedKeyframeId(kf.id); if(videoRef.current) videoRef.current.currentTime = kf.time * videoDuration; }}
                                title={`Keyframe at ${Math.round(kf.time * 100)}%`}
                            ></div>
                        ))}
                        
                        {/* Trimming Handles */}
                        <div className="absolute top-0 bottom-0 w-4 bg-[#E2E2E2] z-20 cursor-ew-resize rounded-full shadow-lg transform -translate-x-1/2 flex items-center justify-center" style={{ left: `${(trimStart / videoDuration) * 100}%` }}>
                            <div className="w-1 h-6 bg-black/50 rounded-full"></div>
                        </div>
                        <div className="absolute top-0 bottom-0 w-4 bg-[#E2E2E2] z-20 cursor-ew-resize rounded-full shadow-lg transform -translate-x-1/2 flex items-center justify-center" style={{ left: `${(trimEnd / videoDuration) * 100}%` }}>
                            <div className="w-1 h-6 bg-black/50 rounded-full"></div>
                        </div>
                        
                        {/* Timeline Comment Pins */}
                        {comments.map(c => (
                            <div
                                key={c.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (videoRef.current) videoRef.current.currentTime = c.timestamp;
                                    setIsCommentPanelOpen(true);
                                }}
                                className={`absolute top-0 bottom-0 w-1 z-30 cursor-pointer group ${c.resolved ? 'bg-emerald-400/80' : 'bg-[#D0BCFF]'}`}
                                style={{ left: `${(c.timestamp / (videoDuration || 1)) * 100}%` }}
                                title={`Pin at ${c.timestamp.toFixed(1)}s: ${c.text}`}
                            >
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#D0BCFF] text-[#381E72] rounded-full text-[9px] font-bold flex items-center justify-center border border-black shadow-md group-hover:scale-125 transition-transform">
                                    <MessageSquarePlus className="w-3 h-3" />
                                </div>
                            </div>
                        ))}

                        {/* Transition Viz */}
                        <div className="absolute top-0 bottom-0 bg-[#D0BCFF]/30 pointer-events-none rounded-l-[16px]" style={{ left: 0, width: `${(introTransitionDuration / videoDuration) * 100}%` }}></div>
                        <div className="absolute top-0 bottom-0 bg-[#D0BCFF]/30 pointer-events-none rounded-r-[16px]" style={{ right: 0, width: `${(outroTransitionDuration / videoDuration) * 100}%` }}></div>

                    </div>
                    <div className="text-xs font-mono text-[#8E918F] w-12 text-right">{videoDuration.toFixed(1)}s</div>
                </div>
            </div>
          )}
      </div>

      {/* --- RIGHT FLOATING ISLAND: Inspector --- */}
      <div className={`${isRightPanelOpen ? 'w-[360px]' : 'w-0'} flex-shrink-0 bg-[#121212] rounded-[32px] transition-all duration-500 overflow-hidden flex flex-col border border-white/5 shadow-2xl relative`}>
          <div className="p-6 pb-2 flex justify-between items-center z-10">
              <span className="text-xl font-medium text-[#E2E2E2] flex items-center gap-3">
                  <div className="p-2 bg-[#D0BCFF] rounded-full text-[#381E72]"><Sliders className="w-5 h-5"/></div> Inspector
              </span>
              <button onClick={() => setIsRightPanelOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><PanelRightClose className="w-5 h-5 text-[#8E918F]"/></button>
          </div>
          
          <div className="overflow-y-auto custom-scrollbar flex-1 p-4 space-y-2">
             
             {/* Material 3 Segmented Button Tabs */}
             <div className="flex bg-[#2C2C2C] rounded-full p-1 mb-4">
                <button onClick={() => setActiveRightTab('edit')} className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${activeRightTab === 'edit' ? 'bg-[#4F378B] text-[#EADDFF] shadow-md' : 'text-[#C4C7C5] hover:text-[#E2E2E2]'}`}>Visuals</button>
                <button onClick={() => setActiveRightTab('audio')} className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${activeRightTab === 'audio' ? 'bg-[#4F378B] text-[#EADDFF] shadow-md' : 'text-[#C4C7C5] hover:text-[#E2E2E2]'}`}>Audio & Text</button>
             </div>

             {activeRightTab === 'edit' && (
               <>
               <CollapsiblePanel title="Visual FX" icon={<Eye className="w-4 h-4"/>} defaultOpen={true}>
                   <div className="space-y-4 pt-2">
                       <div className="grid grid-cols-3 gap-2">
                          {FILTER_OPTIONS.map(f => (
                              <button key={f.id} onClick={() => setSelectedFilter(f.id)} className={`p-3 rounded-[20px] flex flex-col items-center gap-2 text-[10px] transition-all ${selectedFilter === f.id ? 'bg-[#A8C7FA] text-[#003355]' : 'bg-[#2C2C2C] text-[#C4C7C5] hover:bg-white/10'}`}>
                                  <f.Icon className="w-5 h-5"/> {f.name}
                              </button>
                          ))}
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-medium text-[#C4C7C5] uppercase tracking-wide ml-2">Playback Speed</label>
                          <Slider min="0.5" max="2" step="0.1" value={playbackSpeed} onChange={(e: any) => setPlaybackSpeed(parseFloat(e.target.value))} />
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-xs font-medium text-[#C4C7C5] uppercase tracking-wide ml-2">Stabilization</label>
                          <Slider min="0" max="1" step="0.1" value={stabilization} onChange={(e: any) => setStabilization(parseFloat(e.target.value))} />
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-medium text-[#C4C7C5] uppercase tracking-wide ml-2">Smart Crop (Zoom)</label>
                          <Slider min="1" max="2" step="0.1" value={crop} onChange={(e: any) => setCrop(parseFloat(e.target.value))} />
                       </div>
                   </div>
               </CollapsiblePanel>

               <CollapsiblePanel title="Motion & Keyframes" icon={<MoveHorizontal className="w-4 h-4"/>} defaultOpen={true}>
                   <div className="space-y-4 pt-2">
                       <div className="flex items-center justify-between bg-[#2C2C2C] p-3 rounded-2xl">
                           <label className="text-xs font-medium text-[#E2E2E2]">Ken Burns Effect</label>
                           <input type="checkbox" checked={isKeyframingEnabled} onChange={e => setIsKeyframingEnabled(e.target.checked)} className="w-5 h-5 accent-[#A8C7FA] bg-transparent rounded cursor-pointer"/>
                       </div>
                       
                       <div className="flex gap-2">
                           <button onClick={handleAddKeyframe} disabled={!isKeyframingEnabled} className="flex-1 py-2 bg-[#2C2C2C] hover:bg-white/10 text-[#E2E2E2] rounded-full text-xs font-medium flex items-center justify-center gap-2">
                               <Plus className="w-4 h-4"/> Add Keyframe
                           </button>
                           <button onClick={handleDeleteKeyframe} disabled={!isKeyframingEnabled || !selectedKeyframeId} className="px-4 py-2 bg-[#93000A] text-[#FFB4AB] rounded-full text-xs font-medium disabled:opacity-50">
                               <Trash className="w-4 h-4"/>
                           </button>
                       </div>

                       {activeKeyframe ? (
                           <div className="bg-[#2C2C2C] p-4 rounded-[24px] space-y-4 border border-white/5 animate-in fade-in slide-in-from-right-4">
                               <div className="text-xs font-bold text-[#FFB4AB] mb-2">Editing Keyframe at {Math.round(activeKeyframe.time * 100)}%</div>
                               <div className="space-y-2">
                                   <span className="text-xs text-[#C4C7C5] ml-2">Zoom Level ({activeKeyframe.zoom.toFixed(1)}x)</span>
                                   <Slider min="1" max="3" step="0.1" value={activeKeyframe.zoom} onChange={(e: any) => updateSelectedKeyframe({ zoom: parseFloat(e.target.value) })} accentColor="bg-[#FFB4AB]"/>
                               </div>
                               <div className="space-y-2">
                                   <span className="text-xs text-[#C4C7C5] ml-2">Pan X ({activeKeyframe.x}%)</span>
                                   <Slider min="0" max="100" step="1" value={activeKeyframe.x} onChange={(e: any) => updateSelectedKeyframe({ x: parseFloat(e.target.value) })} accentColor="bg-[#FFB4AB]"/>
                               </div>
                               <div className="space-y-2">
                                   <span className="text-xs text-[#C4C7C5] ml-2">Pan Y ({activeKeyframe.y}%)</span>
                                   <Slider min="0" max="100" step="1" value={activeKeyframe.y} onChange={(e: any) => updateSelectedKeyframe({ y: parseFloat(e.target.value) })} accentColor="bg-[#FFB4AB]"/>
                               </div>
                           </div>
                       ) : (
                           <div className="text-center text-xs text-[#8E918F] p-4 bg-[#2C2C2C]/50 rounded-2xl border border-dashed border-white/10">
                               Select a keyframe on the timeline to edit its properties.
                           </div>
                       )}
                   </div>
               </CollapsiblePanel>
               
               <CollapsiblePanel title="Clip Transitions" icon={<ArrowRightLeft className="w-4 h-4"/>}>
                   <div className="space-y-4 pt-2">
                       {/* Sequence Mode Transition Settings */}
                       <div className="space-y-2">
                           <div className="flex items-center justify-between">
                               <label className="text-xs font-medium text-[#C4C7C5] ml-2">Between Clips</label>
                               {isSequenceMode && <span className="text-[10px] bg-[#6DD58C] text-[#00391D] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                           </div>
                           <div className="flex flex-wrap gap-2">
                               {TRANSITION_OPTIONS.map(t => (
                                   <PillButton key={t.id} onClick={() => setSequenceTransition(t.id)} active={sequenceTransition === t.id} activeColor="bg-[#6DD58C] text-[#00391D]">{t.name}</PillButton>
                               ))}
                           </div>
                           <div className="mt-2">
                               <Slider min="0.5" max="3" step="0.5" value={sequenceTransitionDuration} onChange={(e: any) => setSequenceTransitionDuration(parseFloat(e.target.value))} accentColor="bg-[#6DD58C]"/>
                               <p className="text-[10px] text-[#8E918F] ml-2 mt-1">Duration: {sequenceTransitionDuration}s. Applies when playing in Sequence Mode.</p>
                           </div>
                       </div>

                       <div className="h-px bg-white/10 w-full"></div>

                       {/* Intro / Outro Settings */}
                       <div className="space-y-2">
                           <label className="text-xs font-medium text-[#C4C7C5] ml-2">Intro Style</label>
                           <div className="flex flex-wrap gap-2">
                               {TRANSITION_OPTIONS.map(t => (
                                   <PillButton key={t.id} onClick={() => setIntroTransitionType(t.id)} active={introTransitionType === t.id} activeColor="bg-[#D0BCFF] text-[#381E72]">{t.name}</PillButton>
                               ))}
                           </div>
                           <Slider min="0.5" max="3" step="0.5" value={introTransitionDuration} onChange={(e: any) => setIntroTransitionDuration(parseFloat(e.target.value))} accentColor="bg-[#D0BCFF]"/>
                       </div>
                       
                       <div className="space-y-2">
                           <label className="text-xs font-medium text-[#C4C7C5] ml-2">Outro Style</label>
                           <div className="flex flex-wrap gap-2">
                               {TRANSITION_OPTIONS.map(t => (
                                   <PillButton key={t.id} onClick={() => setOutroTransitionType(t.id)} active={outroTransitionType === t.id} activeColor="bg-[#D0BCFF] text-[#381E72]">{t.name}</PillButton>
                               ))}
                           </div>
                           <Slider min="0.5" max="3" step="0.5" value={outroTransitionDuration} onChange={(e: any) => setOutroTransitionDuration(parseFloat(e.target.value))} accentColor="bg-[#D0BCFF]"/>
                       </div>
                   </div>
               </CollapsiblePanel>
               </>
             )}

             {activeRightTab === 'audio' && (
               <>
               <CollapsiblePanel title="Mixer" icon={<AudioLines className="w-4 h-4"/>} defaultOpen={true}>
                   <div className="space-y-6 pt-2">
                        {/* Music */}
                        <div className="space-y-2 bg-[#2C2C2C] p-4 rounded-[24px]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-[#A8C7FA] flex items-center gap-2">
                                    <Music className="w-4 h-4"/> Music
                                </span>
                                <button 
                                    onClick={() => customAudioInputRef.current?.click()} 
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1E1E] hover:bg-[#A8C7FA]/10 text-[#A8C7FA] rounded-full text-[10px] font-bold transition-colors border border-[#A8C7FA]/20"
                                >
                                    <Upload className="w-3 h-3"/> Upload Custom
                                </button>
                                <input type="file" ref={customAudioInputRef} accept="audio/*" className="hidden" onChange={handleCustomAudioUpload} />
                            </div>
                            <select className="w-full bg-[#1E1E1E] border-none rounded-xl p-2 text-xs text-[#E2E2E2] mb-3" value={selectedAudioId} onChange={e => setSelectedAudioId(e.target.value)}>
                                {allAudioTracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <Slider min="0" max="1" step="0.1" value={audioMix.musicVolume} onChange={(e: any) => setAudioMix({...audioMix, musicVolume: parseFloat(e.target.value)})} accentColor="bg-[#A8C7FA]"/>
                        </div>

                        {/* Voice */}
                        <div className="space-y-2 bg-[#2C2C2C] p-4 rounded-[24px]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-[#D0BCFF]">Voice AI</span>
                                <Mic2 className="w-4 h-4 text-[#D0BCFF]"/>
                            </div>
                            <div className="flex gap-2 mb-3">
                                <button onClick={() => voiceSampleRef.current?.click()} className="flex-1 py-2 bg-[#1E1E1E] rounded-xl text-[10px] text-[#E2E2E2] border border-white/5 hover:bg-white/5 truncate">
                                    {voiceSample ? 'Sample Ready' : 'Upload Sample'}
                                </button>
                                <button onClick={handleCloneNarration} disabled={isCloning} className="flex-1 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl text-[10px] font-bold">
                                    {isCloning ? <Loader2 className="w-3 h-3 animate-spin mx-auto"/> : 'Clone'}
                                </button>
                            </div>
                            <input type="file" ref={voiceSampleRef} className="hidden" accept="audio/*" onChange={handleVoiceUpload} />
                            <Slider min="0" max="1" step="0.1" value={audioMix.voiceVolume} onChange={(e: any) => setAudioMix({...audioMix, voiceVolume: parseFloat(e.target.value)})} accentColor="bg-[#D0BCFF]"/>
                        </div>

                        {/* SFX */}
                        <div className="space-y-2 bg-[#2C2C2C] p-4 rounded-[24px]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-[#6DD58C]">SFX AI</span>
                                <Wand2 className="w-4 h-4 text-[#6DD58C]"/>
                            </div>
                            <div className="flex gap-2 mb-3">
                                <select value={sfxMood} onChange={e => setSfxMood(e.target.value)} className="w-1/2 bg-[#1E1E1E] border-none rounded-xl p-2 text-[10px] text-[#E2E2E2]">
                                    {SFX_MOODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <button onClick={handleGenerateSfxAction} disabled={isGeneratingSfx} className="flex-1 bg-[#6DD58C] text-[#00391D] rounded-xl text-[10px] font-bold">
                                    {isGeneratingSfx ? <Loader2 className="w-3 h-3 animate-spin mx-auto"/> : 'Gen'}
                                </button>
                            </div>
                            <Slider min="0" max="1" step="0.1" value={audioMix.sfxVolume} onChange={(e: any) => setAudioMix({...audioMix, sfxVolume: parseFloat(e.target.value)})} accentColor="bg-[#6DD58C]"/>
                        </div>
                   </div>
               </CollapsiblePanel>

               <CollapsiblePanel title="Voiceover & Global Voices" icon={<Mic2 className="w-4 h-4 text-[#D0BCFF]"/>} defaultOpen={true}>
                   <div className="pt-2">
                       <VoiceoverPanel
                         brandName={targetBrand}
                         adDescription={description}
                         activeVoiceoverUrl={activeVoiceoverUrl}
                         onAttachVoiceover={(audioUrl) => setActiveVoiceoverUrl(audioUrl)}
                         onRemoveVoiceover={() => setActiveVoiceoverUrl(null)}
                         onOpenElevenLabsStudio={() => setIsElevenLabsModalOpen(true)}
                       />
                   </div>
               </CollapsiblePanel>

               <CollapsiblePanel title="Text Overlay" icon={<Type className="w-4 h-4"/>}>
                   <div className="space-y-4 pt-2">
                       <FilledInput placeholder="Enter overlay text..." value={overlay.text} onChange={(e: any) => setOverlay({...overlay, text: e.target.value})} />
                       <div className="flex gap-2 items-center bg-[#2C2C2C] rounded-2xl p-2 px-4">
                            <span className="text-xs text-[#E2E2E2] font-medium flex-1">Text Color</span>
                            <button 
                                onClick={() => setOverlay({...overlay, color: brandPalette.primary})}
                                className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
                                style={{ backgroundColor: brandPalette.primary }}
                                title="Use Brand Color"
                            />
                           <input type="color" className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-none" value={overlay.color} onChange={e => setOverlay({...overlay, color: e.target.value})} />
                       </div>
                       
                       <div className="flex gap-2">
                            <select 
                                className="flex-1 bg-[#2C2C2C] border-none rounded-2xl p-3 text-xs text-[#E2E2E2]" 
                                value={overlay.size} 
                                onChange={e => setOverlay({...overlay, size: e.target.value as any})}
                            >
                                <option value="small">Size: Small</option>
                                <option value="medium">Size: Medium</option>
                                <option value="large">Size: Large</option>
                            </select>
                            <select 
                                className="flex-1 bg-[#2C2C2C] border-none rounded-2xl p-3 text-xs text-[#E2E2E2]" 
                                value={overlay.alignment} 
                                onChange={e => setOverlay({...overlay, alignment: e.target.value as any})}
                            >
                                <option value="left">Align: Left</option>
                                <option value="center">Align: Center</option>
                                <option value="right">Align: Right</option>
                            </select>
                       </div>

                       <select className="w-full bg-[#2C2C2C] border-none rounded-2xl p-3 text-xs text-[#E2E2E2]" value={overlay.font} onChange={e => setOverlay({...overlay, font: e.target.value as any})}>
                           <option value="sans">Sans Serif</option>
                           <option value="serif">Serif</option>
                           <option value="mono">Monospace</option>
                       </select>
                       <select className="w-full bg-[#2C2C2C] border-none rounded-2xl p-3 text-xs text-[#E2E2E2]" value={overlay.position} onChange={e => setOverlay({...overlay, position: e.target.value as any})}>
                           <option value="center">Position: Center</option>
                           <option value="bottom-center">Position: Bottom</option>
                           <option value="top-left">Position: Top Left</option>
                           <option value="top-right">Position: Top Right</option>
                       </select>
                       <select 
                            className="w-full bg-[#2C2C2C] border-none rounded-2xl p-3 text-xs text-[#E2E2E2]" 
                            value={overlay.animation} 
                            onChange={e => setOverlay({...overlay, animation: e.target.value as any})}
                        >
                           <option value="none">Animation: None</option>
                           <option value="fade">Animation: Fade In</option>
                           <option value="slide">Animation: Slide In</option>
                           <option value="typewriter">Animation: Typewriter</option>
                           <option value="bounce">Animation: Bounce</option>
                        </select>
                   </div>
               </CollapsiblePanel>

               <CollapsiblePanel title="Version History & Snapshots" icon={<History className="w-4 h-4 text-[#A8C7FA]"/>}>
                   <div className="pt-2">
                     <VersionHistoryPanel
                       snapshots={snapshots}
                       activeSnapshotId={activeSnapshotId}
                       onSaveCurrentSnapshot={handleSaveSnapshot}
                       onRestoreSnapshot={handleRestoreSnapshot}
                       onDeleteSnapshot={(id) => setSnapshots(prev => prev.filter(s => s.id !== id))}
                     />
                   </div>
               </CollapsiblePanel>
               </>
             )}

             {/* Presets Bar */}
             <div className="p-4 pt-6 mt-auto bg-[#1E1E1E] border-t border-white/5">
                <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Save className="w-4 h-4 text-[#8E918F]"/> <span className="text-xs font-bold text-[#8E918F] uppercase tracking-wider">Presets & Styles</span>
                     </div>
                </div>

                {/* Preset Category Filter Chips */}
                <div className="flex gap-1 overflow-x-auto pb-2 mb-3 no-scrollbar">
                    {(['All', 'Social Media', 'Banners', 'Broadcast', 'Cinematic', 'E-Commerce', 'Custom'] as PresetCategory[]).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedPresetCategory(cat)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${selectedPresetCategory === cat ? 'bg-[#A8C7FA] text-[#003355]' : 'bg-[#2C2C2C] text-[#8E918F] hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                {/* Save New Preset */}
                <div className="space-y-2 mb-4">
                    <div className="flex gap-2">
                        <FilledInput placeholder="New Preset Name..." value={newPresetName} onChange={(e: any) => setNewPresetName(e.target.value)} className="!py-2 !text-xs flex-1" />
                        <button onClick={handleSavePreset} disabled={!newPresetName} className="px-4 bg-[#A8C7FA] text-[#003355] rounded-2xl text-xs font-bold hover:bg-[#D0BCFF] disabled:opacity-40 transition-colors">Save</button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#8E918F] px-1">
                        <span>Save Category:</span>
                        <select
                            value={newPresetCategory}
                            onChange={(e) => setNewPresetCategory(e.target.value as PresetCategory)}
                            className="bg-[#2C2C2C] text-[#E2E2E2] px-2 py-0.5 rounded-lg border border-white/10 text-[10px]"
                        >
                            {(['Social Media', 'Banners', 'Broadcast', 'Cinematic', 'E-Commerce', 'Custom'] as PresetCategory[]).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Load Preset Dropdown */}
                <div className="relative">
                    <select 
                        value={selectedPresetId} 
                        onChange={(e) => {
                            const p = presets.find(pre => pre.id === e.target.value);
                            if (p) handleApplyPreset(p);
                        }}
                        className="w-full bg-[#2C2C2C] border-none rounded-2xl px-4 py-3 text-sm text-[#E2E2E2] appearance-none focus:ring-2 focus:ring-[#A8C7FA] focus:outline-none cursor-pointer"
                    >
                        <option value="" disabled>Load Saved Preset...</option>
                        {(selectedPresetCategory === 'All' ? presets : presets.filter(p => p.category === selectedPresetCategory)).map(p => (
                            <option key={p.id} value={p.id}>
                                [{p.category || 'Custom'}] {p.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8E918F] pointer-events-none"/>
                </div>
             </div>

          </div>
      </div>

      {!isRightPanelOpen && (
          <div className="absolute right-4 top-24 z-20">
              <button onClick={() => setIsRightPanelOpen(true)} className="w-12 h-12 bg-[#1E1E1E] rounded-full shadow-xl border border-white/5 flex items-center justify-center text-[#A8C7FA] hover:scale-110 transition-transform">
                  <PanelRightOpen className="w-6 h-6"/>
              </button>
          </div>
      )}

      {/* Export Settings Modal */}
      <ExportSettingsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        brandName={targetBrand}
        videoDuration={videoDuration}
        hasAudio={selectedAudioId !== 'none'}
        hasOverlay={!!overlay.text}
        currentMediaType={mediaType}
        activeMediaUrl={generatedVariations[currentVariationIdx] || ''}
        isGuardrailEnabled={isGuardrailEnabled}
        onOpenGuardrailModal={() => {
          setIsExportModalOpen(false);
          setIsGuardrailModalOpen(true);
        }}
      />

      {/* Brand Guardrail Compliance Modal */}
      <BrandGuardrailModal
        isOpen={isGuardrailModalOpen}
        onClose={() => setIsGuardrailModalOpen(false)}
        brandName={targetBrand}
        currentFont={overlay.fontFamily || "Inter, sans-serif"}
        currentBgColor={brandPalette.accent || "#121212"}
        currentTextColor={overlay.color || "#FFFFFF"}
        currentCtaColor={brandPalette.primary || "#A8C7FA"}
        isGuardrailEnabled={isGuardrailEnabled}
        onToggleGuardrail={(enabled) => setIsGuardrailEnabled(enabled)}
        onApplyBrandFixes={(fixes) => {
          if (fixes.font) setOverlay(prev => ({ ...prev, fontFamily: fixes.font }));
          if (fixes.textColor) setOverlay(prev => ({ ...prev, color: fixes.textColor }));
          if (fixes.bgColor || fixes.ctaColor) {
            setBrandPalette(prev => ({
              ...prev,
              primary: fixes.ctaColor || prev.primary,
              accent: fixes.bgColor || prev.accent
            }));
          }
        }}
      />

      {/* Asset Repurposer Modal (IAB Standard Ads) */}
      <AssetRepurposerModal
        isOpen={isAssetRepurposerOpen}
        onClose={() => setIsAssetRepurposerOpen(false)}
        brandName={targetBrand}
        headline={headline || overlay.text || `Discover ${targetBrand}`}
        subheadline={bodyText || description || "Next-generation design and performance."}
        ctaText="Shop Now"
        logoUrl={referenceMedia || undefined}
        heroImageUrl={generatedVariations[currentVariationIdx] || undefined}
        primaryColor={brandPalette.primary}
        bgColor={brandPalette.accent}
      />

      {/* Real-Time Ad Success Score Dashboard Modal */}
      <AdSuccessScoreDashboardModal
        isOpen={isAdSuccessScoreOpen}
        onClose={() => setIsAdSuccessScoreOpen(false)}
        brandName={targetBrand}
        headline={headline || overlay.text || "Unmatched Quality"}
        conceptDescription={description}
        onApplyOptimization={(title) => {
          if (title.includes("Contrast") || title.includes("CTA")) {
            setBrandPalette(prev => ({ ...prev, primary: '#34D399' }));
          }
        }}
      />

      {/* AI Storyboard Generator Modal */}
      <AiStoryboardModal
        isOpen={isStoryboardOpen}
        onClose={() => setIsStoryboardOpen(false)}
        brandName={targetBrand}
        initialScript={description || headline}
        onApplySceneToCanvas={(scene) => {
          setCustomPrompt(scene.visualPrompt);
          setOverlay(prev => ({ ...prev, text: scene.onScreenText }));
          setIsStoryboardOpen(false);
        }}
      />

      {/* Product Catalog Batch Ad Generator Modal */}
      <ProductCatalogBatchModal
        isOpen={isCatalogBatchOpen}
        onClose={() => setIsCatalogBatchOpen(false)}
        onApplyToStudio={(mediaUrl, title) => {
          setReferenceMedia(mediaUrl);
          setOverlay(prev => ({ ...prev, text: title }));
        }}
      />

      {/* One-Click AI Asset Refinement Modal */}
      <OneClickRefinementModal
        isOpen={isOneClickRefinementOpen}
        onClose={() => setIsOneClickRefinementOpen(false)}
        activeMediaUrl={generatedVariations[currentVariationIdx] || referenceMedia || undefined}
        mediaType={mediaType}
        onApplyRefinedMedia={(newUrl) => {
          if (newUrl && generatedVariations.length > 0) {
            setGeneratedVariations(prev => {
              const copy = [...prev];
              copy[currentVariationIdx] = newUrl;
              return copy;
            });
          }
        }}
      />

      {/* Timeline Comments Side Panel */}
      <TimelineCommentPanel
        isOpen={isCommentPanelOpen}
        onClose={() => setIsCommentPanelOpen(false)}
        comments={comments}
        currentTime={currentTime}
        videoDuration={videoDuration || 10}
        onAddComment={handleAddComment}
        onResolveComment={handleResolveComment}
        onDeleteComment={handleDeleteComment}
        onSeekToTimestamp={(time) => {
          if (videoRef.current) videoRef.current.currentTime = time;
        }}
      />

      {/* Batch Processing Queue Modal */}
      <BatchProcessingModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        presets={presets}
        onBatchProcessComplete={(completedItems) => {
          console.log("Batch processing complete for items:", completedItems);
        }}
      />

      {/* WCAG Accessibility Audit Modal */}
      <AccessibilityAuditModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        overlay={overlay}
        videoDuration={videoDuration || 10}
        playbackSpeed={playbackSpeed}
        selectedFilter={selectedFilter}
        onAutoFixContrast={() => {
          setOverlay(prev => ({ ...prev, color: '#FFFFFF', size: 'medium' }));
          setIsAccessibilityModalOpen(false);
        }}
      />

      {/* Keyboard Shortcuts Overlay Modal */}
      <KeyboardShortcutsModal
        isOpen={isKeyboardModalOpen}
        onClose={() => setIsKeyboardModalOpen(false)}
      />

      {/* Real-time Sentiment & Brand Identity Dashboard */}
      <SentimentBrandDashboard
        isOpen={isSentimentModalOpen}
        onClose={() => setIsSentimentModalOpen(false)}
        config={{
          targetBrand,
          brandPalette,
          originalDescription: description,
          modifications,
          mediaType,
          resolution,
          aspectRatio
        }}
        overlayText={overlay.text}
      />

      {/* Smart Cleanup AI Tool Modal */}
      <SmartCleanupModal
        isOpen={isSmartCleanupModalOpen}
        onClose={() => setIsSmartCleanupModalOpen(false)}
        activeMediaUrl={generatedVariations[currentVariationIdx] || ''}
        onApplyCleanup={(cleanedUrl, settings) => {
          console.log("Applied smart cleanup settings:", settings);
        }}
      />

      {/* AI Smart Format Auto-Resizing Engine Modal */}
      <SmartFormatResizerModal
        isOpen={isSmartFormatModalOpen}
        onClose={() => setIsSmartFormatModalOpen(false)}
        activeMediaUrl={generatedVariations[currentVariationIdx] || ''}
        onApplyRatio={(ratio) => {
          if (ratio === '9:16') setAspectRatio(AspectRatio.PORTRAIT);
          else if (ratio === '1:1') setAspectRatio(AspectRatio.SQUARE);
          else if (ratio === '4:5') setAspectRatio(AspectRatio.VERTICAL_STANDARD);
          else if (ratio === '16:9') setAspectRatio(AspectRatio.LANDSCAPE);
        }}
      />

      {/* Multilingual AI Dubbing Modal */}
      <MultilingualDubbingModal
        isOpen={isDubbingModalOpen}
        onClose={() => setIsDubbingModalOpen(false)}
        originalScript={voiceoverScript || "Create high converting video ads in seconds with Google Gemini."}
        onApplyDubbingTrack={(langCode, translatedText) => {
          setVoiceoverScript(translatedText);
        }}
      />

      {/* AI UGC Presenters & Virtual Avatars Modal */}
      <UgcAvatarModal
        isOpen={isUgcAvatarModalOpen}
        onClose={() => setIsUgcAvatarModalOpen(false)}
        onSelectAvatar={(avatar, layoutStyle) => {
          console.log("Selected UGC Avatar:", avatar, layoutStyle);
        }}
      />

      {/* Automated Multi-Hook A/B Testing Generator Modal */}
      <MultiHookGeneratorModal
        isOpen={isMultiHookModalOpen}
        onClose={() => setIsMultiHookModalOpen(false)}
        brandName={targetBrand}
        onApplyHookVariation={(variation) => {
          setOverlay(prev => ({ ...prev, text: variation.headlineText }));
        }}
      />

      {/* Direct Ad Manager Publishing & Analytics Modal */}
      <AdPublishAnalyticsModal
        isOpen={isAdPublishModalOpen}
        onClose={() => setIsAdPublishModalOpen(false)}
        brandName={targetBrand}
      />

      {/* Hollywood 3D Color Grading & ACES Pipeline Modal */}
      <ColorGradingLutsModal
        isOpen={isColorLutsModalOpen}
        onClose={() => setIsColorLutsModalOpen(false)}
        onApplyLut={(lutName) => {
          setSelectedFilter(lutName.toLowerCase());
        }}
      />

      {/* Dolby Atmos 3D Spatial Audio Engine Modal */}
      <SpatialAudioEngineModal
        isOpen={isSpatialAudioModalOpen}
        onClose={() => setIsSpatialAudioModalOpen(false)}
      />

      {/* Hollywood VFX Composite & AI Chroma Keyer Modal */}
      <VfxCompositeStudioModal
        isOpen={isVfxModalOpen}
        onClose={() => setIsVfxModalOpen(false)}
      />

      {/* Multi-Camera Sync & AI Scene Director Modal */}
      <MultiCamDirectorModal
        isOpen={isMultiCamModalOpen}
        onClose={() => setIsMultiCamModalOpen(false)}
        activeMediaUrl={generatedVariations[currentVariationIdx] || ''}
      />

      {/* Optical Motion Tracking & Keyframe Curves Modal */}
      <MotionTrackingKeyframeModal
        isOpen={isMotionTrackModalOpen}
        onClose={() => setIsMotionTrackModalOpen(false)}
        activeMediaUrl={generatedVariations[currentVariationIdx] || ''}
      />

      {/* ElevenLabs Global Voice & Multi-Speaker Group Studio Modal */}
      <ElevenLabsVoiceStudioModal
        isOpen={isElevenLabsModalOpen}
        onClose={() => setIsElevenLabsModalOpen(false)}
        brandName={targetBrand}
        adDescription={description}
        onAttachVoiceoverTrack={(audioUrl, title) => {
          setActiveVoiceoverUrl(audioUrl);
        }}
      />

      {/* Live AI Teleprompter & UGC Webcam Recording Studio Modal */}
      <LiveUgcTeleprompterModal
        isOpen={isTeleprompterModalOpen}
        onClose={() => setIsTeleprompterModalOpen(false)}
        brandName={targetBrand}
        adDescription={description}
        onAttachRecordedVideo={(videoUrl, title) => {
          setGeneratedVariations(prev => [videoUrl, ...prev]);
        }}
      />

      {/* Foley & Cinematic SFX Soundboard Studio Modal */}
      <SfxSoundboardModal
        isOpen={isSfxModalOpen}
        onClose={() => setIsSfxModalOpen(false)}
        onAttachSfxToTimeline={(sfxName, category, timeMarkerSec) => {
          setComments(prev => [
            ...prev,
            {
              id: `sfx-comment-${Date.now()}`,
              timestamp: timeMarkerSec,
              normalizedTime: timeMarkerSec / 10,
              author: 'Audio Foley Engine',
              authorAvatar: 'SFX',
              text: `🎵 Audio Cue Added: ${sfxName} (${category}) @ ${timeMarkerSec}s`,
              createdAt: 'Just now',
              resolved: false
            }
          ]);
        }}
      />

      {/* Version History Modal */}
      {isVersionHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#181818] w-full max-w-2xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-2xl border border-sky-500/30">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#E2E2E2]">Version History & Creative Iterations</h3>
                  <p className="text-xs text-[#8E918F]">Revert changes, compare snapshots, or track iteration history</p>
                </div>
              </div>
              <button
                onClick={() => setIsVersionHistoryModalOpen(false)}
                className="p-2 hover:bg-white/10 text-[#8E918F] hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[65vh]">
              <VersionHistoryPanel
                snapshots={snapshots}
                activeSnapshotId={activeSnapshotId}
                onSaveCurrentSnapshot={handleSaveSnapshot}
                onRestoreSnapshot={(snap) => {
                  handleRestoreSnapshot(snap);
                  setIsVersionHistoryModalOpen(false);
                }}
                onDeleteSnapshot={(id) => setSnapshots(prev => prev.filter(s => s.id !== id))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Auto-Save Toast Notification */}
      {showAutoSaveToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#1E1E1E]/95 backdrop-blur-md text-emerald-300 border border-emerald-500/30 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
          <span>Draft auto-saved to local session ({lastSavedTime})</span>
        </div>
      )}

    </div>
  );
};

export default AdCreator;