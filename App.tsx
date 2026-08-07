import React, { useState, useEffect, useRef } from 'react';
import AdCreator from './components/AdCreator';
import UserAccountModal from './components/UserAccountModal';
import ABBattleArenaModal from './components/ABBattleArenaModal';
import AIAdRoasterModal from './components/AIAdRoasterModal';
import CommunityFeedbackBoardModal from './components/CommunityFeedbackBoardModal';
import PublicSharePortalModal from './components/PublicSharePortalModal';
import SocialMockupSimulatorModal from './components/SocialMockupSimulatorModal';
import CompetitorAdSpyModal from './components/CompetitorAdSpyModal';
import EyeTrackingHeatmapModal from './components/EyeTrackingHeatmapModal';
import TrendJackGeneratorModal from './components/TrendJackGeneratorModal';
import { 
  Layers, 
  Sparkles, 
  FolderKanban, 
  User, 
  CheckCircle2, 
  Swords, 
  Flame, 
  MessageSquare, 
  Share2, 
  Smartphone, 
  Search, 
  Eye, 
  Radio, 
  ChevronDown, 
  Users, 
  Wand2 
} from 'lucide-react';
import { UserProfile, SavedUserProject, MediaType, AspectRatio, Resolution } from './types';
import { 
  syncUserProfileToCloud, 
  saveProjectToCloud, 
  deleteProjectFromCloud, 
  subscribeToUserCloudProjects 
} from './services/firebase';

const INITIAL_USER: UserProfile = {
  id: 'user-diamond',
  name: 'Diamond Anyanwu',
  email: 'anyanwudiamond@gmail.com',
  isLoggedIn: true,
  lastActive: 'Active now',
  tier: 'Pro Workspace'
};

const DEFAULT_SAMPLE_PROJECTS: SavedUserProject[] = [
  {
    id: 'proj-1',
    userId: 'user-diamond',
    title: 'Nike Air Max Cyberpunk Reel',
    targetBrand: 'Nike',
    description: 'High energy futuristic sneaker commercial with dynamic camera zoom',
    headline: 'Elevate Every Step with Air Max 2026',
    bodyText: 'Designed for the bold, engineered for performance.',
    mediaType: MediaType.VIDEO,
    mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    aspectRatio: AspectRatio.PORTRAIT,
    resolution: Resolution.RES_1080P,
    selectedFilter: 'brightness',
    updatedAt: '2 hours ago',
    hotspotsCount: 2,
    commentsCount: 3
  },
  {
    id: 'proj-2',
    userId: 'user-diamond',
    title: 'Coca-Cola Zero Sugar Summer Refresh',
    targetBrand: 'Coca-Cola',
    description: 'Crisp summer aesthetic banner with icy cold condensation effect',
    headline: 'Real Magic in Every Chill',
    bodyText: 'Zero Sugar. Unlimited Energy.',
    mediaType: MediaType.IMAGE,
    mediaUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
    aspectRatio: AspectRatio.SQUARE,
    resolution: Resolution.RES_4K,
    selectedFilter: 'cool',
    updatedAt: 'Yesterday',
    hotspotsCount: 1,
    commentsCount: 1
  }
];

function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('adclone_user_session');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch (e) {
      return INITIAL_USER;
    }
  });

  const [savedProjects, setSavedProjects] = useState<SavedUserProject[]>(() => {
    try {
      const key = `adclone_user_projects_${currentUser.email}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_PROJECTS;
    } catch (e) {
      return DEFAULT_SAMPLE_PROJECTS;
    }
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [loadedProject, setLoadedProject] = useState<SavedUserProject | null>(null);

  // Modals & Navigation State
  const [isViralSuiteOpen, setIsViralSuiteOpen] = useState(false);
  const [isCollabSuiteOpen, setIsCollabSuiteOpen] = useState(false);
  const [isABBattleOpen, setIsABBattleOpen] = useState(false);
  const [isRoasterOpen, setIsRoasterOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSocialMockupOpen, setIsSocialMockupOpen] = useState(false);
  const [isCompetitorSpyOpen, setIsCompetitorSpyOpen] = useState(false);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [isTrendJackOpen, setIsTrendJackOpen] = useState(false);

  const viralMenuRef = useRef<HTMLDivElement>(null);
  const collabMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (viralMenuRef.current && !viralMenuRef.current.contains(e.target as Node)) {
        setIsViralSuiteOpen(false);
      }
      if (collabMenuRef.current && !collabMenuRef.current.contains(e.target as Node)) {
        setIsCollabSuiteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync session state to local memory & Cloud Firestore
  useEffect(() => {
    try {
      localStorage.setItem('adclone_user_session', JSON.stringify(currentUser));
      if (currentUser.isLoggedIn && currentUser.email) {
        syncUserProfileToCloud(currentUser);
      }
    } catch (e) {
      console.error('Error saving user session:', e);
    }
  }, [currentUser]);

  // Sync projects state to local memory & listen for Cloud Firestore live updates
  useEffect(() => {
    if (currentUser.email) {
      try {
        const key = `adclone_user_projects_${currentUser.email}`;
        localStorage.setItem(key, JSON.stringify(savedProjects));
      } catch (e) {
        console.error('Error saving projects memory:', e);
      }

      // Realtime listener from Cloud Firestore
      const unsubscribe = subscribeToUserCloudProjects(currentUser.email, (cloudProjects) => {
        setSavedProjects(prev => {
          // Merge cloud projects into existing projects avoiding duplicates
          const merged = [...cloudProjects];
          prev.forEach(p => {
            if (!merged.some(cp => cp.id === p.id)) {
              merged.push(p);
            }
          });
          return merged;
        });
      });

      return () => unsubscribe();
    }
  }, [currentUser.email]);

  const handleLogOff = () => {
    setCurrentUser(prev => ({ ...prev, isLoggedIn: false, lastActive: 'Logged Off' }));
  };

  const handleLogIn = (email: string, name: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name || 'Creative Director',
      email: email,
      isLoggedIn: true,
      lastActive: 'Active now',
      tier: 'Pro Workspace'
    };
    setCurrentUser(newUser);

    // Sync to Cloud
    syncUserProfileToCloud(newUser);

    // Load projects for this email from local cache first
    try {
      const key = `adclone_user_projects_${email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setSavedProjects(JSON.parse(saved));
      } else {
        setSavedProjects(DEFAULT_SAMPLE_PROJECTS);
      }
    } catch (e) {
      setSavedProjects(DEFAULT_SAMPLE_PROJECTS);
    }
  };

  const handleSaveCurrentProject = (title: string, currentSnapshotData?: Partial<SavedUserProject>) => {
    const newProj: SavedUserProject = {
      id: `proj-${Date.now()}`,
      userId: currentUser.email || currentUser.id,
      title: title,
      targetBrand: currentSnapshotData?.targetBrand || 'Brand Campaign',
      description: currentSnapshotData?.description || 'Ad campaign layout',
      headline: currentSnapshotData?.headline || 'Headline',
      bodyText: currentSnapshotData?.bodyText || '',
      mediaType: currentSnapshotData?.mediaType || MediaType.IMAGE,
      mediaUrl: currentSnapshotData?.mediaUrl || '',
      aspectRatio: currentSnapshotData?.aspectRatio || AspectRatio.LANDSCAPE,
      resolution: currentSnapshotData?.resolution || Resolution.RES_1080P,
      selectedFilter: currentSnapshotData?.selectedFilter || 'none',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hotspotsCount: currentSnapshotData?.hotspotsCount || 0,
      commentsCount: currentSnapshotData?.commentsCount || 0
    };

    setSavedProjects(prev => [newProj, ...prev]);

    // Save to Cloud Firestore
    saveProjectToCloud(newProj);
  };

  const handleDeleteProject = (projectId: string) => {
    setSavedProjects(prev => prev.filter(p => p.id !== projectId));
    deleteProjectFromCloud(projectId);
  };

  return (
    <div className="h-screen w-screen bg-black text-slate-200 flex flex-col font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* One UI / Material You Header - Floating & Blurred */}
      <header className="fixed top-3 left-0 right-0 z-50 px-4">
        <div className="max-w-[98%] mx-auto bg-[#1E1E1E]/80 backdrop-blur-xl border border-white/5 rounded-full px-6 h-14 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#A8C7FA] rounded-full flex items-center justify-center shadow-inner">
              <Layers className="w-5 h-5 text-[#003355]" />
            </div>
            <span className="text-xl font-medium tracking-tight text-[#E2E2E2]">
              AdClone <span className="font-light opacity-70">AI</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
             {/* 1. Viral AI Suite Categorized Dropdown */}
             <div className="relative" ref={viralMenuRef}>
               <button
                onClick={() => {
                  setIsViralSuiteOpen(!isViralSuiteOpen);
                  setIsCollabSuiteOpen(false);
                }}
                className={`px-3.5 py-1.5 rounded-full border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-md ${
                  isViralSuiteOpen
                    ? 'bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 border-purple-400 text-white ring-2 ring-purple-500/30'
                    : 'bg-[#2A2A2A] hover:bg-[#333333] border-white/10 text-slate-200'
                }`}
                title="Viral Growth & Ad Intelligence Suite"
               >
                <Wand2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Viral Growth Suite</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isViralSuiteOpen ? 'rotate-180 text-purple-400' : 'text-slate-400'}`} />
               </button>

               {/* Dropdown Popover */}
               {isViralSuiteOpen && (
                 <div className="absolute top-full left-0 mt-2 w-72 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 space-y-1">
                   <div className="px-3 py-1.5 border-b border-white/5 mb-1 flex justify-between items-center">
                     <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">AI Growth & Spy Tools</span>
                     <span className="text-[10px] text-slate-500">6 Utilities</span>
                   </div>

                   <button
                    onClick={() => { setIsCompetitorSpyOpen(true); setIsViralSuiteOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 group transition-colors"
                   >
                     <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                       <Search className="w-4 h-4" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-white group-hover:text-cyan-300">Competitor Ad Spy</div>
                       <div className="text-[10px] text-slate-400">Deconstruct & counter-attack competitor ads</div>
                     </div>
                   </button>

                   <button
                    onClick={() => { setIsHeatmapOpen(true); setIsViralSuiteOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 group transition-colors"
                   >
                     <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                       <Eye className="w-4 h-4" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-white group-hover:text-emerald-300">AI Eye-Tracking Heatmap</div>
                       <div className="text-[10px] text-slate-400">Predict 2.0s optical fixation & logo attention</div>
                     </div>
                   </button>

                   <button
                    onClick={() => { setIsTrendJackOpen(true); setIsViralSuiteOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 group transition-colors"
                   >
                     <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
                       <Radio className="w-4 h-4" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-white group-hover:text-rose-300">TikTok Trend-Jack Engine</div>
                       <div className="text-[10px] text-slate-400">Hijack viral TikTok audio beats & script formats</div>
                     </div>
                   </button>

                   <button
                    onClick={() => { setIsSocialMockupOpen(true); setIsViralSuiteOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 group transition-colors"
                   >
                     <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:scale-105 transition-transform">
                       <Smartphone className="w-4 h-4" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-white group-hover:text-pink-300">TikTok & Meta Device Mockup</div>
                       <div className="text-[10px] text-slate-400">Native feed physics & UI collision simulator</div>
                     </div>
                   </button>

                   <button
                    onClick={() => { setIsABBattleOpen(true); setIsViralSuiteOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 group transition-colors"
                   >
                     <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                       <Swords className="w-4 h-4" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-white group-hover:text-amber-300">A/B Battle Arena</div>
                       <div className="text-[10px] text-slate-400">Simulate head-to-head headline performance</div>
                     </div>
                   </button>

                   <button
                    onClick={() => { setIsRoasterOpen(true); setIsViralSuiteOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 group transition-colors"
                   >
                     <div className="p-2 rounded-lg bg-red-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
                       <Flame className="w-4 h-4" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-white group-hover:text-rose-300">Brutal AI Ad Roaster</div>
                       <div className="text-[10px] text-slate-400">Get roasted & auto-fix weak ad copy</div>
                     </div>
                   </button>
                 </div>
               )}
             </div>

             {/* 2. Collaboration & Sharing Dropdown */}
             <div className="relative" ref={collabMenuRef}>
               <button
                onClick={() => {
                  setIsCollabSuiteOpen(!isCollabSuiteOpen);
                  setIsViralSuiteOpen(false);
                }}
                className={`px-3.5 py-1.5 rounded-full border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-md ${
                  isCollabSuiteOpen
                    ? 'bg-gradient-to-r from-indigo-500/30 to-sky-500/30 border-indigo-400 text-white ring-2 ring-indigo-500/30'
                    : 'bg-[#2A2A2A] hover:bg-[#333333] border-white/10 text-slate-200'
                }`}
                title="Community & Client Collaboration Hub"
               >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Community & Review</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollabSuiteOpen ? 'rotate-180 text-indigo-400' : 'text-slate-400'}`} />
               </button>

               {/* Dropdown Popover */}
               {isCollabSuiteOpen && (
                 <div className="absolute top-full left-0 mt-2 w-64 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 space-y-1">
                   <div className="px-3 py-1.5 border-b border-white/5 mb-1 flex justify-between items-center">
                     <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Collaboration Hub</span>
                   </div>

                   <button
                    onClick={() => { setIsCommunityOpen(true); setIsCollabSuiteOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 group transition-colors"
                   >
                     <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                       <MessageSquare className="w-4 h-4" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-white group-hover:text-indigo-300">Alpha Community Board</div>
                       <div className="text-[10px] text-slate-400">Vote on features & request ad models</div>
                     </div>
                   </button>

                   <button
                    onClick={() => { setIsShareOpen(true); setIsCollabSuiteOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 group transition-colors"
                   >
                     <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-105 transition-transform">
                       <Share2 className="w-4 h-4" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-white group-hover:text-sky-300">Client Review Portal</div>
                       <div className="text-[10px] text-slate-400">Generate clean review links for stakeholders</div>
                     </div>
                   </button>
                 </div>
               )}
             </div>

             {/* User Memory & Projects Header Control */}
             <button
              onClick={() => setIsUserModalOpen(true)}
              className="px-3 py-1.5 bg-[#2A2A2A] hover:bg-[#333333] border border-white/10 rounded-full flex items-center gap-2 text-xs font-semibold text-[#E2E2E2] transition-colors cursor-pointer"
              title="Open User Memory & Saved Projects"
             >
              <FolderKanban className="w-4 h-4 text-[#A8C7FA]" />
              <span className="hidden sm:inline">Projects ({savedProjects.length})</span>
             </button>

             {/* User Account / Login Button */}
             <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30 rounded-full text-xs transition-all cursor-pointer"
             >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-black">
                  {currentUser.isLoggedIn ? currentUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="hidden 2xl:flex flex-col text-left text-[11px] leading-tight pr-1">
                  <span className="font-bold text-white truncate max-w-[110px]">
                    {currentUser.isLoggedIn ? currentUser.name : 'Logged Off'}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {currentUser.isLoggedIn ? 'Memory Active' : 'Sign In'}
                  </span>
                </div>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content - Fitted to screen */}
      <main className="flex-1 w-full pt-20 pb-3 px-3 min-h-0 flex flex-col box-border overflow-hidden">
         <AdCreator
            currentUser={currentUser}
            savedProjects={savedProjects}
            onOpenUserModal={() => setIsUserModalOpen(true)}
            onSaveProject={(title, snapshotData) => handleSaveCurrentProject(title, snapshotData)}
            loadedProject={loadedProject}
         />
      </main>

      {/* User Account & Persistent Projects Modal */}
      <UserAccountModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={setCurrentUser}
        savedProjects={savedProjects}
        onLoadProject={(proj) => {
          setLoadedProject(proj);
          setIsUserModalOpen(false);
        }}
        onSaveCurrentProject={(title) => handleSaveCurrentProject(title)}
        onDeleteProject={handleDeleteProject}
        onLogOff={handleLogOff}
        onLogIn={handleLogIn}
      />

      {/* A/B Battle Arena Modal */}
      <ABBattleArenaModal
        isOpen={isABBattleOpen}
        onClose={() => setIsABBattleOpen(false)}
        currentHeadline={loadedProject?.headline || 'Elevate Every Step with Air Max 2026'}
        currentBrand={loadedProject?.targetBrand || 'Nike'}
        onApplyWinner={(winningHeadline) => {
          setLoadedProject(prev => prev ? { ...prev, headline: winningHeadline } : null);
        }}
      />

      {/* Brutal AI Ad Roaster Modal */}
      <AIAdRoasterModal
        isOpen={isRoasterOpen}
        onClose={() => setIsRoasterOpen(false)}
        targetBrand={loadedProject?.targetBrand || 'Coca Cola'}
        headline={loadedProject?.headline || 'Unleash Your Creative Potential'}
        description={loadedProject?.description || 'Ad campaign draft'}
        mediaType={loadedProject?.mediaType || 'IMAGE'}
        onApplyFix={(newHeadline, newBrand, newDesc) => {
          setLoadedProject(prev => prev ? {
            ...prev,
            headline: newHeadline,
            targetBrand: newBrand,
            description: newDesc
          } : null);
        }}
      />

      {/* Real Community Feedback Board Modal */}
      <CommunityFeedbackBoardModal
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
        currentUser={currentUser}
      />

      {/* Public Share Portal Modal */}
      <PublicSharePortalModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectTitle={loadedProject?.title || 'Nike Summer Ad Campaign'}
        targetBrand={loadedProject?.targetBrand || 'Nike'}
      />

      {/* Social Mockup & Scroll Simulator Modal */}
      <SocialMockupSimulatorModal
        isOpen={isSocialMockupOpen}
        onClose={() => setIsSocialMockupOpen(false)}
        headline={loadedProject?.headline || 'Elevate Every Step with Air Max 2026'}
        targetBrand={loadedProject?.targetBrand || 'Nike'}
        mediaType={loadedProject?.mediaType || 'IMAGE'}
        mediaUrl={loadedProject?.mediaUrl || ''}
      />

      {/* Competitor Ad Spy Modal */}
      <CompetitorAdSpyModal
        isOpen={isCompetitorSpyOpen}
        onClose={() => setIsCompetitorSpyOpen(false)}
        userBrand={loadedProject?.targetBrand || 'Nike'}
        onApplyCounterCampaign={(headline, desc, targetBrand) => {
          setLoadedProject(prev => prev ? {
            ...prev,
            headline,
            description: desc,
            targetBrand
          } : null);
        }}
      />

      {/* AI Eye-Tracking Heatmap Modal */}
      <EyeTrackingHeatmapModal
        isOpen={isHeatmapOpen}
        onClose={() => setIsHeatmapOpen(false)}
        headline={loadedProject?.headline || 'Elevate Every Step with Air Max 2026'}
        targetBrand={loadedProject?.targetBrand || 'Nike'}
        mediaUrl={loadedProject?.mediaUrl || ''}
      />

      {/* Trend-Jack Generator Modal */}
      <TrendJackGeneratorModal
        isOpen={isTrendJackOpen}
        onClose={() => setIsTrendJackOpen(false)}
        targetBrand={loadedProject?.targetBrand || 'Nike'}
        onApplyTrendScript={(headline, desc) => {
          setLoadedProject(prev => prev ? {
            ...prev,
            headline,
            description: desc
          } : null);
        }}
      />
    </div>
  );
}

export default App;
