import React, { useState } from 'react';
import { Share2, Lock, Copy, CheckCircle2, MessageSquare, ShieldCheck, Eye, Sparkles, X, Globe, Link2, Send } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface PublicSharePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  targetBrand: string;
}

export const PublicSharePortalModal: React.FC<PublicSharePortalModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  targetBrand
}) => {
  const [passcode, setPasscode] = useState('2026');
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(
    `https://ai.studio/build/review/${encodeURIComponent(projectTitle || 'ad-campaign')}?ref=client_portal`
  );

  const [feedbackComments, setFeedbackComments] = useState([
    {
      id: 'comm-1',
      author: 'Client (Nike Brand Director)',
      time: '00:03.2s',
      text: 'Love the high-energy zoom! Can we make the logo 15% brighter on frame 4?',
      status: 'Approved with minor edit'
    },
    {
      id: 'comm-2',
      author: 'Lead Video Strategist',
      time: '00:08.5s',
      text: 'Audio hook transition is super crisp on mobile test.',
      status: 'Verified'
    }
  ]);

  const [newClientComment, setNewClientComment] = useState('');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientComment.trim()) return;

    const newCommentObj = {
      id: `comm-${Date.now()}`,
      author: 'Client Reviewer',
      time: '00:04.0s',
      text: newClientComment.trim(),
      status: 'Pending Review'
    };

    setFeedbackComments(prev => [newCommentObj, ...prev]);

    // Firestore Sync
    try {
      await addDoc(collection(db, 'client_annotations'), {
        projectTitle,
        targetBrand,
        ...newCommentObj,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore annotation sync info:', e);
    }

    setNewClientComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-3xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Public Client Review Portal & Live Feedback Link
                <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold rounded-full">
                  Zero Login Required for Clients
                </span>
              </h3>
              <p className="text-xs text-[#8E918F]">
                Generate an interactive review link for clients to annotate frames and give sign-off approvals.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#8E918F] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Share Link Box */}
          <div className="p-5 bg-[#222222] border border-white/5 rounded-2xl space-y-3">
            <label className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Shareable Review URL</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live & Protected
              </span>
            </label>

            <div className="flex gap-2">
              <div className="flex-1 bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-sky-300 font-mono truncate flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#8E918F] flex-shrink-0" />
                <span className="truncate">{shareUrl}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-[#A8C7FA] hover:bg-[#82A8F8] text-[#003355] font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="flex items-center gap-4 pt-1 text-xs text-[#8E918F]">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Passcode Pin: <strong className="text-white font-mono">{passcode}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-sky-400" /> Client Permissions: Frame Annotation & Approval Only
              </span>
            </div>
          </div>

          {/* Live Client Annotations & Sign-offs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#8E918F] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-sky-400" /> Client Feedback & Frame Annotations</span>
              <span className="text-[10px] font-mono text-sky-300">{feedbackComments.length} Feedback Notes</span>
            </h4>

            <form onSubmit={handleAddComment} className="p-3 bg-[#222222] border border-white/5 rounded-2xl flex gap-2">
              <input
                type="text"
                value={newClientComment}
                onChange={(e) => setNewClientComment(e.target.value)}
                placeholder="Simulate a client annotation on current frame..."
                className="flex-1 bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-black font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Post
              </button>
            </form>

            <div className="space-y-2">
              {feedbackComments.map((comm) => (
                <div key={comm.id} className="p-4 bg-[#222222] border border-white/5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      {comm.author}
                      <span className="px-2 py-0.5 bg-white/5 text-[10px] font-mono text-sky-400 rounded-full">
                        {comm.time}
                      </span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {comm.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#C4C7C5]">{comm.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1E1E1E] border-t border-white/5 flex items-center justify-between text-xs text-[#8E918F]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Client Sign-offs Sync directly to Cloud Firestore
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicSharePortalModal;
