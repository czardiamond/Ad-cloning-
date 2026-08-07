import React, { useState, useEffect } from 'react';
import { CommunityFeedback, UserProfile } from '../types';
import { 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Filter, 
  X, 
  Send, 
  Award, 
  Share2, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

interface CommunityFeedbackBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

const DEFAULT_SAMPLE_POSTS: CommunityFeedback[] = [
  {
    id: 'post-1',
    userEmail: 'alex.creator@gmail.com',
    userName: 'Alex Rivers',
    type: 'Feature Request',
    title: 'Direct TikTok Shop Product Tagging Integration',
    content: 'It would be amazing to auto-sync products from TikTok Shop directly into ad keyframes with instant price badges.',
    upvotes: 42,
    status: 'Planned',
    createdAt: '2 hours ago',
    upvotedBy: []
  },
  {
    id: 'post-2',
    userEmail: 'sarah.growth@agency.io',
    userName: 'Sarah Jenkins',
    type: 'Ad Result Showcase',
    title: 'Scaled ROAS to 4.8x using the A/B Battle Arena hook!',
    content: 'We used the AI Viral Hook Variant on Meta Reels for a luxury skincare campaign. Thumb-stop rate jumped from 41% to 79%!',
    upvotes: 89,
    status: 'Shipped',
    createdAt: 'Yesterday',
    upvotedBy: []
  },
  {
    id: 'post-3',
    userEmail: 'diamond@gmail.com',
    userName: 'Diamond Anyanwu',
    type: 'Feature Request',
    title: 'Auto-Generate Multi-Speaker UGC Dialogues in ElevenLabs',
    content: 'Add an option to generate 2-person UGC conversations automatically with dual voiceover pitch syncing.',
    upvotes: 31,
    status: 'Building',
    createdAt: '3 days ago',
    upvotedBy: []
  }
];

export const CommunityFeedbackBoardModal: React.FC<CommunityFeedbackBoardModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [posts, setPosts] = useState<CommunityFeedback[]>(DEFAULT_SAMPLE_POSTS);
  const [filterType, setFilterType] = useState<string>('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'Feature Request' | 'Bug Report' | 'Ad Result Showcase' | 'General Review'>('Feature Request');
  const [notification, setNotification] = useState<string | null>(null);

  // Realtime subscription to Cloud Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'community_feedback'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cloudPosts: CommunityFeedback[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudPosts.push({
            id: docSnap.id,
            userEmail: data.userEmail || 'anonymous@user.com',
            userName: data.userName || 'Creator',
            type: data.type || 'Feature Request',
            title: data.title || 'Untitled Suggestion',
            content: data.content || '',
            upvotes: data.upvotes || 0,
            status: data.status || 'In Review',
            createdAt: data.createdAt || 'Recently',
            upvotedBy: data.upvotedBy || []
          });
        });
        if (cloudPosts.length > 0) {
          setPosts(cloudPosts);
        }
      }, (err) => {
        console.warn('Firestore feedback listener info:', err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore feedback setup info:', e);
    }
  }, []);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    const newPostItem: Omit<CommunityFeedback, 'id'> = {
      userEmail: currentUser.email || 'user@example.com',
      userName: currentUser.name || 'Creative User',
      type: newType,
      title: newTitle.trim(),
      content: newContent.trim(),
      upvotes: 1,
      status: 'In Review',
      createdAt: 'Just now',
      upvotedBy: [currentUser.email]
    };

    try {
      await addDoc(collection(db, 'community_feedback'), newPostItem);
      showToast('Feedback submitted directly to Cloud Firestore!');
    } catch (err) {
      // Local fallback
      setPosts(prev => [{ id: `post-${Date.now()}`, ...newPostItem }, ...prev]);
      showToast('Feedback saved locally!');
    }

    setNewTitle('');
    setNewContent('');
    setIsSubmitting(false);
  };

  const handleUpvote = async (post: CommunityFeedback) => {
    const hasUpvoted = post.upvotedBy?.includes(currentUser.email);
    const updatedUpvotes = hasUpvoted ? post.upvotes - 1 : post.upvotes + 1;
    const updatedUpvotedBy = hasUpvoted
      ? (post.upvotedBy || []).filter(e => e !== currentUser.email)
      : [...(post.upvotedBy || []), currentUser.email];

    // Local UI update
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, upvotes: updatedUpvotes, upvotedBy: updatedUpvotedBy } : p));

    // Firestore Sync
    try {
      const postRef = doc(db, 'community_feedback', post.id);
      await updateDoc(postRef, {
        upvotes: updatedUpvotes,
        upvotedBy: updatedUpvotedBy
      });
    } catch (e) {
      console.warn('Firestore upvote sync info:', e);
    }
  };

  const filteredPosts = posts.filter(p => filterType === 'All' || p.type === filterType);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-4xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Real User Alpha Community & Feedback Hub
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-full">
                  Live Cloud Firestore Sync
                </span>
              </h3>
              <p className="text-xs text-[#8E918F]">
                Vote on upcoming features, request integrations, and showcase campaign results directly with our dev team.
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

        {/* Notification Toast */}
        {notification && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" /> {notification}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Create Post Form */}
          <form onSubmit={handleCreatePost} className="p-5 bg-[#222222] border border-white/5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Post Feature Request or Campaign Result
              </span>
              <div className="flex gap-2">
                {(['Feature Request', 'Ad Result Showcase', 'Bug Report', 'General Review'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewType(t)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      newType === t ? 'bg-[#A8C7FA] text-black shadow-md' : 'bg-white/5 text-[#8E918F] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Add 1-Click Multi-Language Dubbing for TikTok Ads..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A8C7FA]"
            />

            <textarea
              required
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Describe why this feature will help your brand or share your ROAS numbers..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A8C7FA]"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit to Cloud Community
              </button>
            </div>
          </form>

          {/* Filter Bar */}
          <div className="flex items-center justify-between pt-2">
            <h4 className="text-xs font-bold text-[#8E918F] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#A8C7FA]" /> Community Submissions ({filteredPosts.length})
            </h4>
            <div className="flex gap-2 text-xs">
              {['All', 'Feature Request', 'Ad Result Showcase', 'Bug Report'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterType === f ? 'bg-white/15 text-white' : 'text-[#8E918F] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const isUpvoted = post.upvotedBy?.includes(currentUser.email);
              return (
                <div
                  key={post.id}
                  className="p-4 bg-[#222222] hover:bg-[#282828] border border-white/5 rounded-2xl transition-all flex items-start gap-4 group"
                >
                  {/* Upvote Box */}
                  <button
                    onClick={() => handleUpvote(post)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isUpvoted
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-[#181818] border border-white/10 text-[#8E918F] hover:text-white hover:border-white/30'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs font-black mt-1">{post.upvotes}</span>
                  </button>

                  {/* Post Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-[#A8C7FA] transition-colors">
                          {post.title}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-mono text-[#D0BCFF] rounded-full uppercase">
                          {post.type}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          post.status === 'Shipped'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : post.status === 'Building'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : post.status === 'Planned'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-white/10 text-[#8E918F]'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#C4C7C5] leading-relaxed">{post.content}</p>

                    <div className="flex items-center gap-3 pt-2 text-[10px] text-[#8E918F]">
                      <span>Posted by <strong className="text-[#E2E2E2]">{post.userName}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.createdAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1E1E1E] border-t border-white/5 flex items-center justify-between text-xs text-[#8E918F]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Community votes directly inform product roadmap
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

export default CommunityFeedbackBoardModal;
