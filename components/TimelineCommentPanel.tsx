import React, { useState } from 'react';
import { MessageSquarePlus, Check, Trash2, Send, CornerDownRight, Clock, User, Filter, MessageSquare } from 'lucide-react';
import { TimelineComment } from '../types';

interface TimelineCommentPanelProps {
  comments: TimelineComment[];
  currentTime: number; // in seconds
  duration: number; // in seconds
  onAddComment: (timestamp: number, text: string) => void;
  onResolveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onAddReply: (commentId: string, replyText: string) => void;
  onSeekToTimestamp: (timestamp: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const TimelineCommentPanel: React.FC<TimelineCommentPanelProps> = ({
  comments,
  currentTime,
  duration,
  onAddComment,
  onResolveComment,
  onDeleteComment,
  onAddReply,
  onSeekToTimestamp,
  isOpen,
  onClose
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'open' | 'resolved'>('all');

  if (!isOpen) return null;

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(currentTime, newCommentText.trim());
    setNewCommentText('');
  };

  const handleSendReply = (commentId: string) => {
    const text = replyInputs[commentId];
    if (!text || !text.trim()) return;
    onAddReply(commentId, text.trim());
    setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
  };

  const filteredComments = comments.filter(c => {
    if (filterMode === 'open') return !c.resolved;
    if (filterMode === 'resolved') return c.resolved;
    return true;
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#181818] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-[#1E1E1E] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#A8C7FA]/20 text-[#A8C7FA] rounded-full">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#E2E2E2]">Timeline Feedback & Pins</h3>
            <p className="text-xs text-[#8E918F]">{comments.length} reviewer notes on timeline</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 text-[#8E918F] hover:text-white rounded-full transition-colors text-lg font-bold"
        >
          ×
        </button>
      </div>

      {/* Timestamp Pin Quick-Add Bar */}
      <form onSubmit={handleCreateComment} className="p-4 bg-[#252525] border-b border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#A8C7FA]">
          <span className="flex items-center gap-1 font-mono font-bold">
            <Clock className="w-3.5 h-3.5" /> Pin at current time: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
          </span>
          <span className="text-[10px] text-[#8E918F]">Press Enter to submit</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={`Add feedback at ${currentTime.toFixed(1)}s...`}
            className="flex-1 bg-[#1E1E1E] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E2E2E2] focus:ring-2 focus:ring-[#A8C7FA] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-4 py-2 bg-[#A8C7FA] hover:bg-[#D0BCFF] disabled:opacity-40 text-[#003355] rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" /> Post Pin
          </button>
        </div>
      </form>

      {/* Filters Bar */}
      <div className="p-3 bg-[#1E1E1E] border-b border-white/5 flex items-center justify-between text-xs px-5">
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#8E918F]" />
          <span className="text-[#8E918F] font-medium">Filter:</span>
        </div>
        <div className="flex gap-1 bg-[#252525] p-0.5 rounded-full border border-white/5">
          {(['all', 'open', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterMode(f)}
              className={`px-3 py-1 rounded-full text-[10px] font-semibold capitalize transition-all ${
                filterMode === f ? 'bg-[#A8C7FA] text-[#003355]' : 'text-[#8E918F] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-2xl border transition-all ${
                comment.resolved
                  ? 'bg-[#1E1E1E]/50 border-white/5 opacity-60'
                  : 'bg-[#222222] border-white/10 hover:border-[#A8C7FA]/50 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {comment.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#E2E2E2]">{comment.author}</span>
                    <span className="text-[10px] text-[#8E918F] ml-2">{comment.createdAt}</span>
                  </div>
                </div>

                {/* Timestamp Jump Pill */}
                <button
                  onClick={() => onSeekToTimestamp(comment.timestamp)}
                  className="px-2.5 py-1 bg-[#A8C7FA]/15 hover:bg-[#A8C7FA]/30 text-[#A8C7FA] rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                >
                  <Clock className="w-3 h-3" /> {comment.timestamp.toFixed(1)}s
                </button>
              </div>

              <p className="text-xs text-[#C4C7C5] leading-relaxed mb-3 pl-1">{comment.text}</p>

              {/* Thread Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-2 border-l-2 border-[#A8C7FA]/30 pl-3 ml-2 my-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#D0BCFF]">{reply.author}</span>
                        <span className="text-[#8E918F]">{reply.createdAt}</span>
                      </div>
                      <p className="text-[#C4C7C5] text-[11px]">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box Input */}
              {!comment.resolved && (
                <div className="flex gap-1.5 mt-2 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyInputs[comment.id] || ''}
                    onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                    className="flex-1 bg-[#181818] border border-white/10 rounded-xl px-2.5 py-1 text-[11px] text-[#E2E2E2]"
                  />
                  <button
                    onClick={() => handleSendReply(comment.id)}
                    className="p-1.5 bg-[#252525] hover:bg-white/10 text-[#A8C7FA] rounded-xl"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-3">
                <button
                  onClick={() => onResolveComment(comment.id)}
                  className={`text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                    comment.resolved ? 'text-[#8E918F]' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  <Check className="w-3 h-3" /> {comment.resolved ? 'Resolved' : 'Mark Resolved'}
                </button>

                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-[10px] text-[#8E918F] hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 space-y-3">
            <MessageSquare className="w-8 h-8 text-[#8E918F] mx-auto opacity-40" />
            <p className="text-xs text-[#8E918F]">No timeline comments found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineCommentPanel;
