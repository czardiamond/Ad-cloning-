import React from 'react';
import { History, RotateCcw, Plus, Trash2, Check, Clock, Layers, Sparkles, AlertCircle } from 'lucide-react';
import { VersionSnapshot } from '../types';

interface VersionHistoryPanelProps {
  snapshots: VersionSnapshot[];
  activeSnapshotId: string | null;
  onSaveCurrentSnapshot: (label?: string) => void;
  onRestoreSnapshot: (snapshot: VersionSnapshot) => void;
  onDeleteSnapshot: (id: string) => void;
}

const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  snapshots,
  activeSnapshotId,
  onSaveCurrentSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot
}) => {
  return (
    <div className="bg-[#2C2C2C] p-4 rounded-[24px] space-y-4 border border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#A8C7FA]/20 text-[#A8C7FA] rounded-full">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#E2E2E2]">Version History & Snapshots</h4>
            <p className="text-[10px] text-[#8E918F]">Restore previous ad configurations in 1 click</p>
          </div>
        </div>

        <button
          onClick={() => onSaveCurrentSnapshot()}
          className="px-3 py-1.5 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-xs font-bold flex items-center gap-1 shadow-md transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Save Snapshot
        </button>
      </div>

      {snapshots.length > 0 ? (
        <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
          {snapshots.map((snap, idx) => {
            const isActive = snap.id === activeSnapshotId;
            return (
              <div
                key={snap.id}
                className={`p-3 rounded-2xl border text-xs transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-[#A8C7FA]/15 border-[#A8C7FA] text-[#A8C7FA] ring-1 ring-[#A8C7FA]'
                    : 'bg-[#1E1E1E] border-white/5 text-[#E2E2E2] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#252525] border border-white/10 flex-shrink-0 overflow-hidden relative">
                    {snap.mediaUrl ? (
                      <img src={snap.mediaUrl} alt={snap.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#8E918F]">
                        v{snapshots.length - idx}
                      </div>
                    )}
                  </div>

                  <div className="truncate">
                    <div className="font-bold text-xs truncate text-[#E2E2E2]">{snap.label}</div>
                    <div className="text-[10px] text-[#8E918F] flex items-center gap-2 mt-0.5">
                      <span>{snap.timestamp}</span>
                      <span>• {snap.filter}</span>
                      <span>• {snap.hotspotsCount} Hotspots</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button
                    onClick={() => onRestoreSnapshot(snap)}
                    className="px-3 py-1.5 bg-[#A8C7FA] hover:bg-[#D0BCFF] text-[#003355] rounded-full text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm"
                  >
                    <RotateCcw className="w-3 h-3" /> Revert
                  </button>

                  <button
                    onClick={() => onDeleteSnapshot(snap.id)}
                    className="p-1.5 hover:bg-red-500/20 text-[#8E918F] hover:text-red-400 rounded-full transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center bg-[#1E1E1E] rounded-2xl border border-dashed border-white/10 text-xs text-[#8E918F]">
          No version snapshots saved yet. Auto-snapshots are captured on major edits.
        </div>
      )}
    </div>
  );
};

export default VersionHistoryPanel;
