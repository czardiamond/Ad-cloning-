import React, { useState } from 'react';
import { UserCheck, Sparkles, Check, X, Video, Sliders, Mic, Play } from 'lucide-react';
import { UgcAvatar } from '../types';

interface UgcAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatar?: (avatar: UgcAvatar, style: 'pip' | 'split' | 'fullscreen') => void;
}

const AVATARS: UgcAvatar[] = [
  {
    id: 'avatar-1',
    name: 'Maya',
    archetype: 'Tech & Unboxing Creator',
    gender: 'Female',
    voiceStyle: 'Enthusiastic & Clear',
    niche: 'Gadgets & SaaS Products',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'avatar-2',
    name: 'Alex',
    archetype: 'Gen-Z Lifestyle Creator',
    gender: 'Male',
    voiceStyle: 'Casual & Upbeat',
    niche: 'Fashion & E-Commerce',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'avatar-3',
    name: 'Sophia',
    archetype: 'Beauty & Wellness Specialist',
    gender: 'Female',
    voiceStyle: 'Warm & Authentic',
    niche: 'Skincare & Cosmetics',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'avatar-4',
    name: 'Marcus',
    archetype: 'Fitness & Health Coach',
    gender: 'Male',
    voiceStyle: 'Energetic & Motivational',
    niche: 'Supplements & Sportswear',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  }
];

const UgcAvatarModal: React.FC<UgcAvatarModalProps> = ({
  isOpen,
  onClose,
  onSelectAvatar
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<UgcAvatar>(AVATARS[0]);
  const [layoutStyle, setLayoutStyle] = useState<'pip' | 'split' | 'fullscreen'>('pip');
  const [scriptText, setScriptText] = useState("Hey guys! You won't believe how much time this new product saved me today. Check it out!");

  if (!isOpen) return null;

  const handleApply = () => {
    if (onSelectAvatar) {
      onSelectAvatar(selectedAvatar, layoutStyle);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-3xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A8C7FA] text-[#003355] rounded-full">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#E2E2E2]">AI UGC Presenters & Virtual Avatars</h3>
              <p className="text-xs text-[#8E918F]">Photorealistic UGC creators with script lip-sync for high-converting social ads</p>
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
          {/* Avatar Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AVATARS.map((avatar) => {
              const isSelected = selectedAvatar.id === avatar.id;
              return (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`bg-[#222222] p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                    isSelected ? 'border-[#A8C7FA] ring-2 ring-[#A8C7FA]/30 bg-[#282828]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="aspect-square w-full rounded-xl overflow-hidden relative">
                    <img src={avatar.avatarUrl} alt={avatar.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-bold">
                      {avatar.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#E2E2E2] truncate">{avatar.archetype}</div>
                    <div className="text-[10px] text-[#8E918F] truncate mt-0.5">{avatar.niche}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layout Mode Selection */}
          <div className="bg-[#222222] p-4 rounded-2xl border border-white/5 space-y-3">
            <label className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-4 h-4" /> Presenter Video Overlay Mode
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setLayoutStyle('pip')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  layoutStyle === 'pip' ? 'bg-[#A8C7FA]/20 border-[#A8C7FA] text-[#A8C7FA] font-bold' : 'bg-[#1E1E1E] border-white/5 text-[#8E918F]'
                }`}
              >
                Corner PIP Circle
              </button>
              <button
                onClick={() => setLayoutStyle('split')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  layoutStyle === 'split' ? 'bg-[#A8C7FA]/20 border-[#A8C7FA] text-[#A8C7FA] font-bold' : 'bg-[#1E1E1E] border-white/5 text-[#8E918F]'
                }`}
              >
                Split Screen 50/50
              </button>
              <button
                onClick={() => setLayoutStyle('fullscreen')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  layoutStyle === 'fullscreen' ? 'bg-[#A8C7FA]/20 border-[#A8C7FA] text-[#A8C7FA] font-bold' : 'bg-[#1E1E1E] border-white/5 text-[#8E918F]'
                }`}
              >
                Full Screen Creator
              </button>
            </div>
          </div>

          {/* UGC Script Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C4C7C5] flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-[#D0BCFF]" /> Presenter Custom Script
            </label>
            <textarea
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-[#E2E2E2] focus:outline-none focus:border-[#A8C7FA] resize-none"
            />
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
            className="px-6 py-2.5 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg"
          >
            <Check className="w-4 h-4" /> Add Creator Presenter ({selectedAvatar.name})
          </button>
        </div>
      </div>
    </div>
  );
};

export default UgcAvatarModal;
