import React, { useState, useEffect } from 'react';
import { UserProfile, SavedUserProject, MediaType, AspectRatio, Resolution } from '../types';
import { User, LogOut, LogIn, FolderKanban, Save, Plus, Trash2, CheckCircle2, Clock, Sparkles, Shield, RefreshCw, X, ArrowRight, Laptop, Database, HardDriveDownload, Cloud } from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  savedProjects: SavedUserProject[];
  onLoadProject: (project: SavedUserProject) => void;
  onSaveCurrentProject: (title: string) => void;
  onDeleteProject: (projectId: string) => void;
  onLogOff: () => void | Promise<void>;
  /** Opens the Google sign-in popup (Firebase Auth). */
  onLogIn: () => Promise<void>;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  savedProjects,
  onLoadProject,
  onSaveCurrentProject,
  onDeleteProject,
  onLogOff,
  onLogIn
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'login'>('projects');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(currentUser.isLoggedIn ? 'projects' : 'login');
  }, [currentUser.isLoggedIn]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    onSaveCurrentProject(newProjectTitle.trim());
    setNewProjectTitle('');
    showToast(`Project "${newProjectTitle}" saved to user memory!`);
  };

  const handleGoogleSignIn = async () => {
    setSignInError(null);
    setIsSigningIn(true);
    try {
      await onLogIn();
      showToast('Signed in with Google. Your projects are loading.');
      setActiveTab('projects');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setSignInError(null);
      } else if (code === 'auth/popup-blocked') {
        setSignInError('Your browser blocked the sign-in popup. Allow popups for this site and try again.');
      } else if (code === 'auth/unauthorized-domain') {
        setSignInError('This website address is not yet authorized for sign-in. Add it under Firebase Console > Authentication > Settings > Authorized domains.');
      } else if (code === 'auth/operation-not-allowed') {
        setSignInError('Google sign-in is not enabled yet. Turn it on in Firebase Console > Authentication > Sign-in method.');
      } else {
        setSignInError(err?.message || 'Sign-in failed. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedProjects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AdClone_Memory_Backup_${currentUser.email}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported memory backup JSON file!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          imported.forEach((proj: SavedUserProject) => {
            if (proj.title && proj.id) {
              onSaveCurrentProject(proj.title, proj);
            }
          });
          showToast(`Successfully imported ${imported.length} projects from backup file!`);
        } else {
          showToast('Invalid backup file format.');
        }
      } catch (err) {
        showToast('Error reading backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-3xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-full shadow-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#E2E2E2] flex items-center gap-2">
                User Memory & Account Workspace
              </h3>
              <p className="text-xs text-[#8E918F]">
                {currentUser.isLoggedIn
                  ? `Active Session: ${currentUser.name} (${currentUser.email})`
                  : 'Signed Out • Log in to access your saved cloud & local project memory'}
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

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-[#1E1E1E] border-b border-white/5 flex gap-4 text-xs font-bold">
          {currentUser.isLoggedIn && (
            <>
              <button
                onClick={() => setActiveTab('projects')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'projects' ? 'border-[#A8C7FA] text-[#A8C7FA]' : 'border-transparent text-[#8E918F] hover:text-white'
                }`}
              >
                <FolderKanban className="w-4 h-4" /> My Saved Projects ({savedProjects.length})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'profile' ? 'border-[#D0BCFF] text-[#D0BCFF]' : 'border-transparent text-[#8E918F] hover:text-white'
                }`}
              >
                <User className="w-4 h-4" /> User Memory & Profile
              </button>
            </>
          )}
          {!currentUser.isLoggedIn && (
            <button
              onClick={() => setActiveTab('login')}
              className="pb-3 border-b-2 border-[#A8C7FA] text-[#A8C7FA] flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" /> {notification}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* TAB: MY SAVED PROJECTS */}
          {activeTab === 'projects' && currentUser.isLoggedIn && (
            <div className="space-y-6">
              {/* Save Current Session Bar */}
              <form onSubmit={handleSaveSubmit} className="p-4 bg-[#222222] border border-white/5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
                    <Save className="w-4 h-4" /> Save Current Active Canvas
                  </span>
                  <span className="text-[10px] text-[#8E918F]">Auto-syncs media, keyframes, comments & hotspots</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="e.g. Nike Summer Ad Campaign v2..."
                    className="flex-1 bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A8C7FA]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#A8C7FA] hover:bg-[#82A8F8] text-[#003355] font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Save Snapshot
                  </button>
                </div>
              </form>

              {/* Saved Projects List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#8E918F] uppercase tracking-wider flex items-center justify-between">
                  <span>Saved Memory Library</span>
                  <span className="text-[11px] font-mono text-[#A8C7FA]">{savedProjects.length} Projects stored</span>
                </h4>

                {savedProjects.length === 0 ? (
                  <div className="p-8 text-center bg-[#222222]/50 border border-dashed border-white/10 rounded-2xl space-y-2">
                    <Database className="w-8 h-8 text-[#8E918F] mx-auto opacity-50" />
                    <p className="text-xs text-[#8E918F]">No saved projects found for this account memory yet.</p>
                    <p className="text-[11px] text-[#6E716F]">Type a title above to save your current ad layout to memory.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 bg-[#222222] hover:bg-[#2A2A2A] border border-white/5 hover:border-white/15 rounded-2xl transition-all flex flex-col justify-between space-y-3 group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-[#A8C7FA] transition-colors">
                              {proj.title}
                            </h5>
                            <span className="text-[11px] text-[#8E918F] block font-medium">
                              Brand: <strong className="text-[#E2E2E2]">{proj.targetBrand}</strong>
                            </span>
                          </div>
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-mono text-[#D0BCFF] rounded-full uppercase">
                            {proj.mediaType} • {proj.aspectRatio}
                          </span>
                        </div>

                        <p className="text-xs text-[#C4C7C5] line-clamp-2 italic bg-[#181818] p-2 rounded-xl border border-white/5">
                          "{proj.headline || proj.description || 'No description'}"
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#8E918F]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {proj.updatedAt}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                onLoadProject(proj);
                                showToast(`Loaded project "${proj.title}"!`);
                                onClose();
                              }}
                              className="px-3 py-1 bg-[#A8C7FA]/15 hover:bg-[#A8C7FA]/30 text-[#A8C7FA] font-bold rounded-lg transition-colors flex items-center gap-1"
                            >
                              <ArrowRight className="w-3 h-3" /> Load
                            </button>
                            <button
                              onClick={() => {
                                onDeleteProject(proj.id);
                                showToast('Project removed from memory.');
                              }}
                              className="p-1 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: USER PROFILE & MEMORY STATS */}
          {activeTab === 'profile' && currentUser.isLoggedIn && (
            <div className="space-y-6">
              <div className="p-5 bg-[#222222] border border-white/5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {currentUser.name}
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-full">
                        {currentUser.tier}
                      </span>
                    </h4>
                    <p className="text-xs text-[#8E918F]">{currentUser.email}</p>
                    <p className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Session Memory Active & Auto-Saved
                    </p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await onLogOff();
                    showToast('Signed out.');
                    setActiveTab('login');
                  }}
                  className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Off Session
                </button>
              </div>

              {/* Memory Storage Info */}
              <div className="bg-[#222222] p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#A8C7FA] uppercase tracking-wider flex items-center gap-1.5">
                    <HardDriveDownload className="w-4 h-4" /> Persistent User Memory Status
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportBackup}
                      className="px-3 py-1 bg-[#A8C7FA]/15 hover:bg-[#A8C7FA]/30 border border-[#A8C7FA]/30 text-[#A8C7FA] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                      title="Download JSON backup of all saved projects"
                    >
                      <HardDriveDownload className="w-3.5 h-3.5" /> Export Backup
                    </button>
                    <label className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> Import Backup
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#181818] rounded-xl border border-white/5 space-y-1">
                    <span className="text-[#8E918F] text-[10px] uppercase font-bold">Saved Projects</span>
                    <div className="text-xl font-black text-white">{savedProjects.length}</div>
                  </div>
                  <div className="p-3 bg-[#181818] rounded-xl border border-white/5 space-y-1">
                    <span className="text-[#8E918F] text-[10px] uppercase font-bold">Memory Sync</span>
                    <div className="text-sm font-black text-emerald-400 flex items-center gap-1 mt-1">
                      <Cloud className="w-4 h-4 text-sky-400" />
                      Cloud Firestore & Local
                    </div>
                  </div>
                  <div className="p-3 bg-[#181818] rounded-xl border border-white/5 space-y-1">
                    <span className="text-[#8E918F] text-[10px] uppercase font-bold">Last Activity</span>
                    <div className="text-xs font-bold text-[#E2E2E2] mt-2">{currentUser.lastActive}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOGIN / LOG OFF RECOVERY */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              <div className="text-center space-y-2 py-2">
                <div className="w-12 h-12 bg-[#A8C7FA]/20 text-[#A8C7FA] rounded-full flex items-center justify-center mx-auto">
                  <User className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Sign in to AdClone AI</h4>
                <p className="text-xs text-[#8E918F] max-w-md mx-auto">
                  Sign in with your Google account to save your ad projects and pick up where you left off on any device.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-[#222222] p-6 border border-white/5 rounded-2xl space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 disabled:opacity-60 text-[#1F1F1F] font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSigningIn ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 38.2 44 33 44 24c0-1.3-.1-2.4-.4-3.5z"/>
                    </svg>
                  )}
                  {isSigningIn ? 'Opening Google…' : 'Continue with Google'}
                </button>
                {signInError && (
                  <p className="text-[11px] text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2">{signInError}</p>
                )}
                <p className="text-[10px] text-[#6E716F] text-center">
                  We only use your Google name, email and photo to keep your projects private to you.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#1E1E1E] border-t border-white/5 flex items-center justify-between text-xs text-[#8E918F]">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" /> Persistent User Memory Scoped & Secured
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

export default UserAccountModal;
