export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export enum Resolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K',
  RES_720P = '720p',
  RES_1080P = '1080p'
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  STANDARD = '4:3',
  VERTICAL_STANDARD = '3:4',
  ULTRAWIDE = '21:9',
  VERTICAL_ULTRAWIDE = '9:21'
}

export interface BrandPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface AdConfiguration {
  targetBrand: string;
  brandPalette: BrandPalette;
  originalDescription: string;
  modifications: string;
  customPrompt?: string;
  mediaType: MediaType;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  referenceImageBase64?: string;
  referenceImageMimeType?: string;
}

export interface OverlayConfig {
  text: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  font: 'sans' | 'serif' | 'mono';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'bottom-center';
  alignment: 'left' | 'center' | 'right';
  animation: 'none' | 'fade' | 'slide' | 'typewriter' | 'bounce';
}

export interface Keyframe {
  id: string;
  time: number; // 0.0 to 1.0 (percentage of video duration)
  zoom: number;
  x: number;
  y: number;
}

export interface AudioMix {
  musicVolume: number;
  voiceVolume: number;
  sfxVolume: number;
}

export type PresetCategory = 'All' | 'Social Media' | 'Banners' | 'Broadcast' | 'Cinematic' | 'E-Commerce' | 'Custom';

export interface EditorPreset {
  id: string;
  name: string;
  category: PresetCategory;
  speed: number;
  filter: string;
  stabilization: number;
  crop: number;
  transitionType: string;
  transitionDuration: number;
  outroTransitionType?: string;
  outroTransitionDuration?: number;
  keyframes: Keyframe[];
  audioMix?: AudioMix;
  trimStart?: number;
  trimEnd?: number;
}

export type ExportPlatform = 'youtube' | 'tiktok' | 'instagram' | 'broadcast' | 'web_banner' | 'custom';
export type ExportResolution = '720p' | '1080p' | '4k' | '1080x1920' | '1080x1080';
export type ExportFrameRate = '24fps' | '30fps' | '60fps';
export type ExportFormat = 'mp4' | 'webm' | 'gif' | 'prores';
export type ExportBitrate = 'draft' | 'high' | 'ultra';

export interface ExportSettings {
  platform: ExportPlatform;
  resolution: ExportResolution;
  frameRate: ExportFrameRate;
  format: ExportFormat;
  bitrate: ExportBitrate;
  includeAudio: boolean;
  burnSubtitles: boolean;
}

export type GridOverlayMode = 'none' | 'rule-of-thirds' | 'golden-ratio' | 'center-cross';
export type ColorVisualizerMode = 'none' | 'histogram' | 'heatmap';

export interface AudioTrack {
  id: string;
  name: string;
  url: string;
}

export interface AdHotspot {
  id: string;
  label: string;
  actionType: 'url' | 'coupon' | 'product_card' | 'add_to_cart';
  url?: string;
  couponCode?: string;
  productName?: string;
  price?: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage 5-50
  height: number; // Percentage 5-50
  startTime: number; // 0.0 - 1.0
  endTime: number; // 0.0 - 1.0
  pulse: boolean;
  style: 'glass' | 'accent' | 'neon' | 'minimal';
}

export type VoiceoverVoice = 'Aria (Warm & Engaging)' | 'Marcus (Authoritative)' | 'Seraphina (Energetic)' | 'David (Calm & Trustworthy)' | 'Elena (Dramatic)';
export type VoiceoverTone = 'Professional' | 'Enthusiastic' | 'Calm' | 'Dramatic' | 'Urgent';

export interface VoiceoverConfig {
  script: string;
  voice: VoiceoverVoice;
  tone: VoiceoverTone;
  speed: number;
  emotion: 'neutral' | 'excited' | 'empathetic' | 'confident';
  autoSync: boolean;
}

export interface TimelineComment {
  id: string;
  timestamp: number; // seconds
  normalizedTime: number; // 0.0 - 1.0
  author: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  resolved: boolean;
  replies?: { id: string; author: string; text: string; createdAt: string }[];
}

export interface VersionSnapshot {
  id: string;
  timestamp: string;
  label: string;
  mediaUrl: string;
  filter: string;
  speed: number;
  targetBrand: string;
  overlayText: string;
  hotspotsCount: number;
}

export interface BatchItem {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: MediaType;
  previewUrl: string;
  targetBrand: string;
  presetId: string;
  presetName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  errorMessage?: string;
}

export interface AccessibilityAuditResult {
  score: number;
  contrastRatio: string;
  contrastPass: boolean;
  readingSpeedWpm: number;
  readingSpeedPass: boolean;
  motionSensitivityScore: 'Safe' | 'Moderate Warning' | 'High Flicker Risk';
  warnings: string[];
  passedRules: string[];
}

export interface SketchStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  size: number;
  timestamp: number;
  author: string;
}

export interface SentimentBrandAnalysis {
  overallScore: number;
  sentimentTone: string;
  brandAlignment: number;
  toneSafety: 'Pass - Brand Safe' | 'Needs Mild Review' | 'Flagged Content';
  suggestions: string[];
  detectedKeywords: string[];
}

export type SmartFormatRatio = '9:16' | '1:1' | '4:5' | '16:9';

export interface SmartFormatPreview {
  formatRatio: SmartFormatRatio;
  label: string;
  platform: string;
  subjectCenterX: number; // 0-100 percentage
  subjectCenterY: number; // 0-100 percentage
  safeZoneOk: boolean;
}

export interface DubbingLanguage {
  code: string;
  name: string;
  flag: string;
  sampleScript?: string;
}

export interface UgcAvatar {
  id: string;
  name: string;
  avatarUrl: string;
  archetype: string; // e.g., 'Tech Reviewer', 'Fashion Creator', 'Fitness Coach'
  gender: string;
  voiceStyle: string;
  niche: string;
}

export interface HookVariation {
  id: string;
  hookType: 'Pattern Interrupt' | 'Pain Point Question' | 'Unboxing Curiosity' | 'Bold Social Proof' | 'FOMO Urgency';
  headlineText: string;
  first3SecScript: string;
  colorGradeFilter: string;
  audioDropStyle: string;
  predictedCtr: number; // e.g. 4.2%
  predictedCpa: string; // e.g. $12.40
}

export interface AdPublishCampaign {
  id: string;
  platform: 'meta' | 'tiktok' | 'youtube' | 'google';
  campaignName: string;
  dailyBudget: number;
  status: 'Active' | 'Optimizing' | 'Paused' | 'Draft';
  roas: number;
  ctr: number;
  cpa: string;
  impressions: number;
  clicks: number;
  spend: string;
}

export interface ColorLutPreset {
  id: string;
  name: string;
  profile: 'ACEScc' | 'Rec.709' | 'ARRI LogC' | 'RED IPP2' | 'Sony S-Log3';
  description: string;
  thumbnailColor: string;
  lift: { r: number; g: number; b: number };
  gamma: { r: number; g: number; b: number };
  gain: { r: number; g: number; b: number };
}

export interface AudioTrackLayer {
  id: string;
  name: string;
  category: 'dialogue' | 'score' | 'sfx' | 'ambience';
  volume: number; // 0-100
  panX: number; // -100 to 100
  panY: number; // -100 to 100
  isMuted: boolean;
  isSolo: boolean;
  lufsMeter: number; // e.g. -24 LUFS
}

export interface VfxLayerEffect {
  id: string;
  name: string;
  category: 'chroma_key' | 'lens_flare' | 'film_grain' | 'camera_shake' | 'glow';
  enabled: boolean;
  intensity: number; // 0-100
  blendMode: 'normal' | 'screen' | 'multiply' | 'color_dodge' | 'soft_light';
}

export interface MultiCamAngle {
  id: string;
  label: string;
  cameraName: string;
  previewUrl: string;
  focalLength: string;
  isSelected: boolean;
}

export interface MotionTrackPoint {
  id: string;
  label: string;
  targetX: number; // percentage
  targetY: number; // percentage
  easingCurve: 'linear' | 'bezier_smooth' | 'ease_out_cubic' | 'spring_bounce';
  motionBlur: boolean;
}

export interface GlobalVoiceProfile {
  id: string;
  name: string;
  country: string;
  flag: string;
  accent: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  category: 'Solo Narrator' | 'Conversational UGC' | 'Corporate Master' | 'Character & Drama' | 'Group Host';
  style: string;
  age: 'Young Adult' | 'Middle Aged' | 'Senior' | 'Gen-Z';
  previewText: string;
}

export interface DialogueLine {
  id: string;
  speakerId: string; // matches GlobalVoiceProfile.id
  speakerName: string;
  text: string;
  emotion: 'excited' | 'curious' | 'skeptical' | 'convinced' | 'urgent';
  speed: number;
}


export interface GenerationResult {
  url: string;
  type: MediaType;
  description: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/** Subscription tier. Everyone starts on 'Free'; paid tiers will be set server-side once payments exist. */
export type UserTier = 'Free' | 'Pro' | 'Enterprise';

export interface UserProfile {
  /** Firebase Auth uid (empty string when signed out). */
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
  lastActive: string;
  tier: UserTier;
}

export interface SavedUserProject {
  id: string;
  userId: string;
  title: string;
  targetBrand: string;
  description: string;
  headline: string;
  bodyText: string;
  mediaType: MediaType;
  mediaUrl: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  selectedFilter: string;
  updatedAt: string;
  hotspotsCount: number;
  commentsCount: number;
  thumbnailUrl?: string;
}

export interface CommunityFeedback {
  id: string;
  userEmail: string;
  userName: string;
  type: 'Feature Request' | 'Bug Report' | 'Ad Result Showcase' | 'General Review';
  title: string;
  content: string;
  upvotes: number;
  status: 'In Review' | 'Planned' | 'Building' | 'Shipped';
  createdAt: string;
  upvotedBy: string[];
}

export interface ABBattleVariant {
  id: string;
  name: string;
  headline: string;
  hookStyle: string;
  ctaText: string;
  predictedCTR: number;
  thumbStopRate: number;
  conversionLift: string;
  viralScore: number;
  winningReason?: string;
}

export interface BrandAudit {
  points: string[];
  score: number;
}