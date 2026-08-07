import React, { useEffect } from 'react';
import { Keyboard, X, Play, SkipBack, SkipForward, Volume2, MessageSquarePlus, Layers, ShieldCheck, PenTool, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    category: 'Playback Controls',
    items: [
      { key: 'Space', description: 'Play / Pause video preview' },
      { key: '← / →', description: 'Step backward / forward 0.1s' },
      { key: 'J / K / L', description: 'Rewind / Pause / Fast forward (2x)' },
      { key: 'M', description: 'Toggle Mute / Unmute' }
    ]
  },
  {
    category: 'Timeline & Composition',
    items: [
      { key: 'Home / End', description: 'Jump to start / end of timeline' },
      { key: 'I / O', description: 'Set trim start (In) / trim end (Out)' },
      { key: 'K', description: 'Add Keyframe at playhead position' },
      { key: 'Shift + Scroll', description: 'Zoom timeline' }
    ]
  },
  {
    category: 'Tools & Review Features',
    items: [
      { key: 'C', description: 'Open Pins & Comment Panel' },
      { key: 'H', description: 'Toggle Interactive Hotspots' },
      { key: 'S', description: 'Toggle Sketch Canvas Review Mode' },
      { key: 'B', description: 'Open Batch Processing Queue' },
      { key: 'A', description: 'Run WCAG Accessibility Audit' },
      { key: '?', description: 'Toggle Keyboard Shortcuts' }
    ]
  }
];

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-2xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D0BCFF] text-[#381E72] rounded-full">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#E2E2E2]">Keyboard Shortcuts</h3>
              <p className="text-xs text-[#8E918F]">Speed up your ad creation and timeline review workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar bg-[#181818]">
          {SHORTCUT_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-3">
              <h4 className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider">{group.category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {group.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between p-3 bg-[#222222] border border-white/5 rounded-2xl hover:border-white/15 transition-colors"
                  >
                    <span className="text-xs text-[#C4C7C5] font-medium">{item.description}</span>
                    <kbd className="px-2.5 py-1 bg-[#2C2C2C] text-[#E2E2E2] border border-white/10 rounded-lg text-xs font-mono font-bold shadow-inner">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 bg-[#1E1E1E] flex items-center justify-between">
          <div className="text-xs text-[#8E918F]">
            Press <kbd className="px-1.5 py-0.5 bg-[#2C2C2C] text-white rounded text-[10px] font-mono">?</kbd> anywhere to open or close this overlay
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-xs font-bold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
