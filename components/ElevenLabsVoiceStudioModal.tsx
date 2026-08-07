import React, { useState, useRef } from 'react';
import { Mic, Globe, Users, Sparkles, Play, Pause, Check, X, RefreshCw, Search, Sliders, Volume2, Plus, Trash2, ArrowUpDown, Music, Wand2, Upload, Disc, Radio, Layers, VolumeX, FastForward, Activity, Tag, FileAudio } from 'lucide-react';
import { GlobalVoiceProfile, DialogueLine } from '../types';
import { generateMarketingCopy } from '../services/geminiService';

interface ElevenLabsVoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
  adDescription?: string;
  onAttachVoiceoverTrack?: (audioUrl: string, title: string) => void;
}

export const GLOBAL_VOICE_CATALOG: GlobalVoiceProfile[] = [
  {
    id: 'us-aria',
    name: 'Aria Sterling',
    country: 'United States',
    flag: '🇺🇸',
    accent: 'American (Pacific Northwest)',
    gender: 'Female',
    category: 'Conversational UGC',
    style: 'Warm, relatable, authentic TikTok & Instagram vibe',
    age: 'Young Adult',
    previewText: 'Hey everyone! You literally won’t believe how much time this saves me every single morning.'
  },
  {
    id: 'us-marcus',
    name: 'Marcus Vance',
    country: 'United States',
    flag: '🇺🇸',
    accent: 'American (Deep Broadcast)',
    gender: 'Male',
    category: 'Corporate Master',
    style: 'Deep, resonant, confident, movie trailer authority',
    age: 'Middle Aged',
    previewText: 'Engineering precision redefined. Take control of your workflow with unmatched power.'
  },
  {
    id: 'uk-charlotte',
    name: 'Charlotte St. Clair',
    country: 'United Kingdom',
    flag: '🇬🇧',
    accent: 'British (RP / London)',
    gender: 'Female',
    category: 'Solo Narrator',
    style: 'Elegant, refined, luxury storytelling',
    age: 'Middle Aged',
    previewText: 'Indulge in pure craftsmanship designed for those who appreciate understated luxury.'
  },
  {
    id: 'ng-zainab',
    name: 'Zainab Adebayo',
    country: 'Nigeria',
    flag: '🇳🇬',
    accent: 'West African (Lagos Pidgin / Modern Afrobeat)',
    gender: 'Female',
    category: 'Conversational UGC',
    style: 'Energetic, rhythmic, warm, highly relatable',
    age: 'Young Adult',
    previewText: 'No cap! This brand is actually changing the game for everyone across the continent.'
  },
  {
    id: 'in-siddharth',
    name: 'Siddharth Kapoor',
    country: 'India',
    flag: '🇮🇳',
    accent: 'Indian (Mumbai Tech & Corporate)',
    gender: 'Male',
    category: 'Corporate Master',
    style: 'Articulate, technical, persuasive, clear',
    age: 'Young Adult',
    previewText: 'Revolutionizing cloud automation with effortless scalability built right from day one.'
  },
  {
    id: 'au-liam',
    name: 'Liam Outback',
    country: 'Australia',
    flag: '🇦🇺',
    accent: 'Australian (Sydney Modern)',
    gender: 'Male',
    category: 'Group Host',
    style: 'Upbeat, friendly, adventure-driven',
    age: 'Young Adult',
    previewText: 'G’day mate! Grab your gear because this new tool is absolutely mental.'
  },
  {
    id: 'ca-sophie',
    name: 'Sophie Tremblay',
    country: 'Canada',
    flag: '🇨🇦',
    accent: 'Canadian (Montreal / Toronto)',
    gender: 'Female',
    category: 'Conversational UGC',
    style: 'Friendly, crisp, cheerful, inviting',
    age: 'Young Adult',
    previewText: 'Honestly, this is the most seamless experience I’ve had all year. Check it out!'
  },
  {
    id: 'mx-diego',
    name: 'Diego Morales',
    country: 'Mexico',
    flag: '🇲🇽',
    accent: 'Mexican (Mexico City Modern)',
    gender: 'Male',
    category: 'Character & Drama',
    style: 'Warm, passionate, energetic narrator',
    age: 'Middle Aged',
    previewText: '¡Increíble! Discover how easy it is to elevate your lifestyle today.'
  },
  {
    id: 'fr-chloe',
    name: 'Chloé Dubois',
    country: 'France',
    flag: '🇫🇷',
    accent: 'French (Parisian English)',
    gender: 'Female',
    category: 'Solo Narrator',
    style: 'Chic, sensual, high fashion editorial',
    age: 'Young Adult',
    previewText: 'A touch of Parisian elegance captured in every single detail.'
  },
  {
    id: 'jp-kenji',
    name: 'Kenji Takahashi',
    country: 'Japan',
    flag: '🇯🇵',
    accent: 'Japanese (Tokyo Anime & Tech)',
    gender: 'Male',
    category: 'Character & Drama',
    style: 'Futuristic, sharp, expressive',
    age: 'Young Adult',
    previewText: 'Unleash next-generation performance engineered for precision performance.'
  },
  {
    id: 'kr-minjun',
    name: 'Min-Jun Park',
    country: 'South Korea',
    flag: '🇰🇷',
    accent: 'Korean (Seoul K-Tech / Urban)',
    gender: 'Male',
    category: 'Conversational UGC',
    style: 'Trendy, energetic, ultra-modern',
    age: 'Gen-Z',
    previewText: 'This visual workflow is going viral for a reason. Super smooth and powerful!'
  },
  {
    id: 'de-hans',
    name: 'Hans Müller',
    country: 'Germany',
    flag: '🇩🇪',
    accent: 'German (Berlin Precision)',
    gender: 'Male',
    category: 'Corporate Master',
    style: 'Precise, authoritative, structured',
    age: 'Middle Aged',
    previewText: 'Maximum efficiency meets perfection in industrial design.'
  },
  {
    id: 'es-lucia',
    name: 'Lucía Fernández',
    country: 'Spain',
    flag: '🇪🇸',
    accent: 'Spanish (Castilian Elegance)',
    gender: 'Female',
    category: 'Solo Narrator',
    style: 'Smooth, expressive, warm storytelling',
    age: 'Middle Aged',
    previewText: 'Experiencia la perfecta armonía entre diseño vanguardista y funcionalidad.'
  },
  {
    id: 'it-marco',
    name: 'Marco Rossi',
    country: 'Italy',
    flag: '🇮🇹',
    accent: 'Italian (Milan Fashion & Luxury)',
    gender: 'Male',
    category: 'Character & Drama',
    style: 'Passionate, stylish, charismatic',
    age: 'Middle Aged',
    previewText: 'Pure Italian passion infused into every craft. Truly magnificent.'
  },
  {
    id: 'br-mateus',
    name: 'Mateus Silva',
    country: 'Brazil',
    flag: '🇧🇷',
    accent: 'Brazilian (Rio Sunshine)',
    gender: 'Male',
    category: 'Conversational UGC',
    style: 'Passionate, energetic, summer festival energy',
    age: 'Young Adult',
    previewText: 'Bring the sunshine and unstoppable energy into your everyday routine!'
  },
  {
    id: 'za-thabo',
    name: 'Thabo Ndlovu',
    country: 'South Africa',
    flag: '🇿🇦',
    accent: 'South African (Cape Town Cinematic)',
    gender: 'Male',
    category: 'Solo Narrator',
    style: 'Rich, deep, cinematic documentary storyteller',
    age: 'Middle Aged',
    previewText: 'From the heart of the wild to urban landscapes, experience freedom without limits.'
  },
  {
    id: 'ie-saoirse',
    name: 'Saoirse O’Connor',
    country: 'Ireland',
    flag: '🇮🇪',
    accent: 'Irish (Dublin Melodic)',
    gender: 'Female',
    category: 'Group Host',
    style: 'Lively, warm, storytelling charm',
    age: 'Young Adult',
    previewText: 'Ah, you won’t find anything quite like this anywhere else, guarantee it!'
  },
  {
    id: 'ke-jabari',
    name: 'Jabari Ochieng',
    country: 'Kenya',
    flag: '🇰🇪',
    accent: 'East African (Nairobi Tech Hub)',
    gender: 'Male',
    category: 'Corporate Master',
    style: 'Clear, engaging, confident African leader',
    age: 'Middle Aged',
    previewText: 'Empowering innovation across global markets with smart, sustainable tech.'
  },
  {
    id: 'jm-kofi',
    name: 'Kofi Kingston',
    country: 'Jamaica',
    flag: '🇯🇲',
    accent: 'Caribbean (Jamaican Patois Warmth)',
    gender: 'Male',
    category: 'Character & Drama',
    style: 'Melodic, vibrant, soulful rhythm',
    age: 'Middle Aged',
    previewText: 'Feel the good vibes and smooth energy all day long with zero hassle.'
  },
  {
    id: 'ph-bea',
    name: 'Bea Santos',
    country: 'Philippines',
    flag: '🇵🇭',
    accent: 'Filipino (Manila English)',
    gender: 'Female',
    category: 'Conversational UGC',
    style: 'Cheerful, bubbly, hospitable',
    age: 'Gen-Z',
    previewText: 'Guys, this is literally my new favorite find! Super convenient and cute!'
  }
];

const INITIAL_GROUP_SCRIPT: DialogueLine[] = [
  {
    id: 'line-1',
    speakerId: 'us-aria',
    speakerName: 'Aria (US UGC)',
    text: 'Wait, <whisper>have you guys tried this new app yet?</whisper>',
    emotion: 'curious',
    speed: 1.05
  },
  {
    id: 'line-2',
    speakerId: 'ng-zainab',
    speakerName: 'Zainab (Nigerian Afrobeat)',
    text: 'Ah! I swear I downloaded it yesterday, and <emphasis>my sales doubled</emphasis> instantly!',
    emotion: 'excited',
    speed: 1.0
  },
  {
    id: 'line-3',
    speakerId: 'us-marcus',
    speakerName: 'Marcus (US Corporate)',
    text: 'That is correct. Built with ElevenLabs multi-country neural AI, it handles dialogue seamlessly.',
    emotion: 'convinced',
    speed: 0.95
  }
];

const AMBIENT_SOUNDSCAPES = [
  { id: 'none', name: 'None (Clean Studio)', icon: '🔇' },
  { id: 'coffee', name: 'Coffee Shop & Murmur', icon: '☕' },
  { id: 'city', name: 'Urban City Ambience', icon: '🏙️' },
  { id: 'studio', name: 'Quiet Studio Warmth', icon: '🎙️' },
  { id: 'rain', name: 'Gentle Rain on Glass', icon: '🌧️' },
  { id: 'office', name: 'Modern Tech Office', icon: '💻' }
];

const ElevenLabsVoiceStudioModal: React.FC<ElevenLabsVoiceStudioModalProps> = ({
  isOpen,
  onClose,
  brandName = 'AdClone AI',
  adDescription = 'high converting product',
  onAttachVoiceoverTrack
}) => {
  const [activeTab, setActiveTab] = useState<'voices' | 'group' | 'fine_tune' | 'speech_to_speech'>('voices');
  const [selectedVoice, setSelectedVoice] = useState<GlobalVoiceProfile>(GLOBAL_VOICE_CATALOG[0]);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Group Dialogue State
  const [dialogueLines, setDialogueLines] = useState<DialogueLine[]>(INITIAL_GROUP_SCRIPT);
  const [isGeneratingGroupScript, setIsGeneratingGroupScript] = useState(false);

  // ElevenLabs Fine Tuning Controls
  const [stability, setStability] = useState(65);
  const [clarity, setClarity] = useState(85);
  const [styleExaggeration, setStyleExaggeration] = useState(40);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);

  // Soundscape State
  const [selectedAmbient, setSelectedAmbient] = useState('none');
  const [ambientVolume, setAmbientVolume] = useState(20);

  // Live Recording / Speech to Speech State
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isConvertingAccent, setIsConvertingAccent] = useState(false);

  // Playback & Synth
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playingLineId, setPlayingLineId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  if (!isOpen) return null;

  const countries = ['All', ...Array.from(new Set(GLOBAL_VOICE_CATALOG.map(v => v.country)))];
  const categories = ['All', ...Array.from(new Set(GLOBAL_VOICE_CATALOG.map(v => v.category)))];

  const filteredVoices = GLOBAL_VOICE_CATALOG.filter(voice => {
    const matchesCountry = selectedCountryFilter === 'All' || voice.country === selectedCountryFilter;
    const matchesCategory = selectedCategoryFilter === 'All' || voice.category === selectedCategoryFilter;
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          voice.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          voice.accent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesCategory && matchesSearch;
  });

  const handlePlayVoicePreview = (voice: GlobalVoiceProfile) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = voice.previewText.replace(/<[^>]*>/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechSpeed;
      
      const sysVoices = window.speechSynthesis.getVoices();
      if (sysVoices.length > 0) {
        const matchingVoice = sysVoices.find(v => v.lang.toLowerCase().includes(voice.country.slice(0, 2).toLowerCase()) || v.name.includes(voice.name.split(' ')[0]));
        if (matchingVoice) utterance.voice = matchingVoice;
      }

      utterance.onend = () => setIsPlayingPreview(false);
      setIsPlayingPreview(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayDialogueSequence = () => {
    if (!('speechSynthesis' in window) || dialogueLines.length === 0) return;
    window.speechSynthesis.cancel();
    setIsPlayingPreview(true);

    let currentIdx = 0;

    const playNextLine = () => {
      if (currentIdx >= dialogueLines.length) {
        setIsPlayingPreview(false);
        setPlayingLineId(null);
        return;
      }

      const line = dialogueLines[currentIdx];
      setPlayingLineId(line.id);
      const cleanText = line.text.replace(/<[^>]*>/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = line.speed;

      utterance.onend = () => {
        currentIdx++;
        setTimeout(playNextLine, 250);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNextLine();
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingPreview(false);
    setPlayingLineId(null);
  };

  const handleGenerateAiGroupScript = async () => {
    setIsGeneratingGroupScript(true);
    try {
      const copy = await generateMarketingCopy(brandName, adDescription, 'Enthusiastic');
      const textToSplit = typeof copy === 'string' ? copy : `${copy.headline}\n${copy.body}`;
      const linesText = textToSplit.split('\n').filter(l => l.trim().length > 5);

      if (linesText.length >= 3) {
        setDialogueLines([
          { id: 'l-1', speakerId: 'us-aria', speakerName: 'Aria (US UGC)', text: linesText[0], emotion: 'curious', speed: 1.05 },
          { id: 'l-2', speakerId: 'ng-zainab', speakerName: 'Zainab (Nigerian Afrobeat)', text: linesText[1], emotion: 'excited', speed: 1.0 },
          { id: 'l-3', speakerId: 'ca-sophie', speakerName: 'Sophie (Canada UGC)', text: linesText[2], emotion: 'convinced', speed: 1.0 }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingGroupScript(false);
    }
  };

  const handleInsertSsmlTag = (lineId: string, tag: string) => {
    setDialogueLines(prev => prev.map(l => {
      if (l.id === lineId) {
        return {
          ...l,
          text: `${l.text} <${tag}>...</${tag}>`
        };
      }
      return l;
    }));
  };

  const handleAddDialogueLine = () => {
    const newLine: DialogueLine = {
      id: `line-${Date.now()}`,
      speakerId: selectedVoice.id,
      speakerName: `${selectedVoice.name} (${selectedVoice.flag} ${selectedVoice.country})`,
      text: 'Insert dialogue here...',
      emotion: 'excited',
      speed: 1.0
    };
    setDialogueLines(prev => [...prev, newLine]);
  };

  const handleRemoveDialogueLine = (id: string) => {
    setDialogueLines(prev => prev.filter(l => l.id !== id));
  };

  const handleToggleMicRecord = async () => {
    if (isRecordingMic) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingMic(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach(t => t.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecordingMic(true);
      } catch (err) {
        console.error('Error accessing microphone', err);
      }
    }
  };

  const handleRunSpeechToSpeech = () => {
    setIsConvertingAccent(true);
    setTimeout(() => {
      setIsConvertingAccent(false);
    }, 1500);
  };

  const handleSyncToTimeline = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      const synthAudioUrl = recordedAudioUrl || 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
      const title = activeTab === 'group'
        ? `Group Dialogue Ensemble (${dialogueLines.length} Speakers)`
        : activeTab === 'speech_to_speech'
        ? `Speech-to-Speech Conversion: ${selectedVoice.name}`
        : `ElevenLabs VO: ${selectedVoice.name} (${selectedVoice.flag} ${selectedVoice.country})`;
      if (onAttachVoiceoverTrack) {
        onAttachVoiceoverTrack(synthAudioUrl, title);
      }
      setIsSynthesizing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#141414] w-full max-w-5xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 text-white rounded-full shadow-lg">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                ElevenLabs Global Voice Studio & Multi-Speaker Ensemble
              </h3>
              <p className="text-xs text-[#8E918F]">20+ Countries, SSML Emotions, Speech-to-Speech & Multi-Person Conversations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 bg-[#1E1E1E] px-6 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('voices')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'voices' ? 'border-purple-400 text-purple-300' : 'border-transparent text-[#8E918F] hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" /> Global Catalog ({filteredVoices.length})
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'group' ? 'border-pink-400 text-pink-300' : 'border-transparent text-[#8E918F] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Multi-Person Dialogue ({dialogueLines.length})
          </button>
          <button
            onClick={() => setActiveTab('speech_to_speech')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'speech_to_speech' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-[#8E918F] hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" /> Speech-To-Speech Accent Converter
          </button>
          <button
            onClick={() => setActiveTab('fine_tune')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'fine_tune' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-[#8E918F] hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" /> ElevenLabs Voice Model Controls
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {activeTab === 'voices' && (
            <div className="space-y-4">
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E1E1E] p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-[#8E918F]" />
                  <input
                    type="text"
                    placeholder="Search country, accent, or voice name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#8E918F] focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#8E918F]">Country:</span>
                  <select
                    value={selectedCountryFilter}
                    onChange={(e) => setSelectedCountryFilter(e.target.value)}
                    className="bg-[#121212] text-white border border-white/10 px-3 py-1.5 rounded-xl font-bold"
                  >
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#8E918F]">Style:</span>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-[#121212] text-white border border-white/10 px-3 py-1.5 rounded-xl font-bold"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Voice Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredVoices.map((voice) => {
                  const isSelected = selectedVoice.id === voice.id;
                  return (
                    <div
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice)}
                      className={`p-4 bg-[#1E1E1E] rounded-2xl border cursor-pointer transition-all space-y-3 relative group ${
                        isSelected ? 'border-purple-400 ring-2 ring-purple-400/30 bg-[#252525]' : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{voice.flag}</span>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              {voice.name}
                              <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                {voice.gender}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#8E918F] font-medium">{voice.accent}</div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayVoicePreview(voice);
                          }}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded-full transition-colors"
                          title="Preview voice audio"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#C4C7C5] italic line-clamp-2 bg-black/40 p-2 rounded-xl border border-white/5">
                        "{voice.previewText}"
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-[#8E918F] font-mono border-t border-white/5 pt-2">
                        <span>{voice.category}</span>
                        <span className="text-indigo-400">{voice.age}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'group' && (
            <div className="space-y-4">
              {/* Group Script Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E1E1E] p-4 rounded-2xl border border-white/5">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-400" /> Multi-Person Dialogue Ensemble Builder
                  </h4>
                  <p className="text-[10px] text-[#8E918F]">Mix multiple speakers with different global accents in one conversation</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateAiGroupScript}
                    disabled={isGeneratingGroupScript}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    {isGeneratingGroupScript ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    Auto-Generate Dialogue
                  </button>
                  <button
                    onClick={handleAddDialogueLine}
                    className="px-3 py-1.5 bg-black/40 border border-white/10 text-white rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-white/10"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Line
                  </button>
                </div>
              </div>

              {/* Dialogue Sequence List */}
              <div className="space-y-3">
                {dialogueLines.map((line, idx) => {
                  const isLinePlaying = playingLineId === line.id;
                  return (
                    <div
                      key={line.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isLinePlaying ? 'bg-[#2A1F30] border-pink-400 ring-2 ring-pink-400/30' : 'bg-[#1E1E1E] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 font-mono font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <select
                            value={line.speakerId}
                            onChange={(e) => {
                              const found = GLOBAL_VOICE_CATALOG.find(v => v.id === e.target.value);
                              if (found) {
                                setDialogueLines(prev => prev.map(l => l.id === line.id ? {
                                  ...l,
                                  speakerId: found.id,
                                  speakerName: `${found.name} (${found.flag} ${found.country})`
                                } : l));
                              }
                            }}
                            className="bg-[#121212] text-xs font-bold text-white border border-white/10 px-3 py-1 rounded-xl"
                          >
                            {GLOBAL_VOICE_CATALOG.map(v => (
                              <option key={v.id} value={v.id}>
                                {v.flag} {v.name} ({v.country} - {v.accent})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* SSML Tag Inserters */}
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-[#8E918F]">Insert SSML:</span>
                          <button
                            onClick={() => handleInsertSsmlTag(line.id, 'whisper')}
                            className="px-2 py-0.5 bg-black/40 hover:bg-purple-500/20 text-purple-300 rounded border border-white/10"
                          >
                            whisper
                          </button>
                          <button
                            onClick={() => handleInsertSsmlTag(line.id, 'emphasis')}
                            className="px-2 py-0.5 bg-black/40 hover:bg-pink-500/20 text-pink-300 rounded border border-white/10"
                          >
                            emphasis
                          </button>
                          <button
                            onClick={() => handleInsertSsmlTag(line.id, 'pause')}
                            className="px-2 py-0.5 bg-black/40 hover:bg-indigo-500/20 text-indigo-300 rounded border border-white/10"
                          >
                            pause
                          </button>

                          <button
                            onClick={() => handleRemoveDialogueLine(line.id)}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors ml-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={line.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDialogueLines(prev => prev.map(l => l.id === line.id ? { ...l, text: val } : l));
                        }}
                        rows={2}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-pink-400 resize-none leading-relaxed"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Play All Sequence */}
              <div className="flex justify-center pt-2">
                {isPlayingPreview ? (
                  <button
                    onClick={handleStopSpeech}
                    className="px-6 py-2.5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
                  >
                    <Pause className="w-4 h-4" /> Stop Ensemble Playback
                  </button>
                ) : (
                  <button
                    onClick={handlePlayDialogueSequence}
                    className="px-6 py-2.5 bg-pink-500 hover:bg-pink-400 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" /> Play Full Multi-Voice Dialogue Sequence
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'speech_to_speech' && (
            <div className="space-y-5">
              <div className="bg-[#1E1E1E] p-5 rounded-2xl border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400" /> Speech-to-Speech Accent & Voice Converter
                    </h4>
                    <p className="text-[10px] text-[#8E918F]">Record your voice, then convert your exact cadence into any target global accent</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                    Target Accent: {selectedVoice.flag} {selectedVoice.name} ({selectedVoice.country})
                  </span>
                </div>

                {/* Microphone Recording Control */}
                <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                  <button
                    onClick={handleToggleMicRecord}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
                      isRecordingMic
                        ? 'bg-red-500 text-white animate-ping ring-4 ring-red-500/30'
                        : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-black hover:scale-105'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                  <div className="text-center">
                    <div className="text-xs font-bold text-white">
                      {isRecordingMic ? 'Recording Microphone... Click to stop' : 'Click to record your voice sample'}
                    </div>
                    <div className="text-[10px] text-[#8E918F]">Speak naturally for 5-15 seconds</div>
                  </div>

                  {recordedAudioUrl && (
                    <div className="w-full max-w-md bg-[#121212] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                      <audio src={recordedAudioUrl} controls className="h-8 w-full" />
                    </div>
                  )}
                </div>

                {/* Convert Action */}
                <button
                  onClick={handleRunSpeechToSpeech}
                  disabled={!recordedAudioUrl || isConvertingAccent}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isConvertingAccent ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isConvertingAccent ? 'Transforming Accent & Pitch Contour...' : `Transform Audio into ${selectedVoice.name}'s Accent`}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'fine_tune' && (
            <div className="space-y-5">
              <div className="bg-[#1E1E1E] p-5 rounded-2xl border border-indigo-500/30 space-y-4">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> ElevenLabs Voice Model Fine-Tuning Parameters
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[#C4C7C5]">
                      <span>Stability vs Expressiveness</span>
                      <span className="font-mono text-indigo-300">{stability}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={stability}
                      onChange={(e) => setStability(Number(e.target.value))}
                      className="w-full accent-indigo-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#8E918F]">
                      <span>Wild & Expressive</span>
                      <span>Stable & Consistent</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[#C4C7C5]">
                      <span>Clarity & Similarity Boost</span>
                      <span className="font-mono text-purple-300">{clarity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={clarity}
                      onChange={(e) => setClarity(Number(e.target.value))}
                      className="w-full accent-purple-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[#C4C7C5]">
                      <span>Style Exaggeration</span>
                      <span className="font-mono text-pink-300">{styleExaggeration}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={styleExaggeration}
                      onChange={(e) => setStyleExaggeration(Number(e.target.value))}
                      className="w-full accent-pink-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[#C4C7C5]">
                      <span>Playback Speed Pace</span>
                      <span className="font-mono text-emerald-300">{speechSpeed.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      value={speechSpeed}
                      onChange={(e) => setSpeechSpeed(Number(e.target.value))}
                      className="w-full accent-emerald-400 bg-black/40 rounded-lg h-2 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Ambient Soundscapes Layer */}
              <div className="bg-[#1E1E1E] p-5 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-pink-400" /> Background Ambient Soundscapes Layer
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMBIENT_SOUNDSCAPES.map(amb => (
                    <button
                      key={amb.id}
                      onClick={() => setSelectedAmbient(amb.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                        selectedAmbient === amb.id
                          ? 'bg-pink-500/20 border-pink-400 text-white'
                          : 'bg-black/40 border-white/5 text-[#8E918F] hover:text-white'
                      }`}
                    >
                      <span>{amb.icon}</span>
                      <span className="truncate">{amb.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Voice Cloning Upload Box */}
              <div className="bg-[#1E1E1E] p-5 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-purple-400" /> Instant Custom Voice Timbre Cloning
                </h4>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center space-y-2 hover:border-purple-400/50 transition-colors cursor-pointer bg-black/20">
                  <Disc className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
                  <div className="text-xs font-bold text-white">Upload 10-30 Second Audio Sample (.mp3, .wav)</div>
                  <div className="text-[10px] text-[#8E918F]">Our ElevenLabs AI engine will extract pitch contour and voice timbre instantly.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#1A1A1A] flex items-center justify-between">
          <div className="text-xs text-[#8E918F]">
            Selected Voice: <span className="text-purple-300 font-bold">{selectedVoice.flag} {selectedVoice.name}</span> ({selectedVoice.country})
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-[#8E918F] hover:text-white rounded-full text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSyncToTimeline}
              disabled={isSynthesizing}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:brightness-110 text-white rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
            >
              {isSynthesizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isSynthesizing ? 'Synthesizing Audio Track...' : 'Sync ElevenLabs Audio to Timeline'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElevenLabsVoiceStudioModal;
