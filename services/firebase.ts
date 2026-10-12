import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import config from '../firebase-applet-config.json';
import { SavedUserProject, UserProfile, UserTier } from '../types';

// Initialize Firebase App (these web config values are public identifiers, not secrets;
// access is controlled by Firebase Auth + firestore.rules).
const app = initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
});

export const auth = getAuth(app);

// Initialize Firestore with specific database ID if present, or default
export const db = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

const PROJECTS_COLLECTION = 'projects';
const USERS_COLLECTION = 'users';

export const DEFAULT_TIER: UserTier = 'Free';

/* ----------------------------------------------------------------------------
 * Auth
 * --------------------------------------------------------------------------*/

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await signInWithPopup(auth, provider);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/** Returns a fresh Firebase ID token for the signed-in user, or null when signed out. */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export function onAuthChange(cb: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, cb);
}

/**
 * Ensures users/{uid} exists and returns the stored tier.
 * New users are created on the 'Free' tier. The tier can only be changed later
 * by a trusted server (payments), never by the browser (see firestore.rules).
 */
export async function ensureUserProfile(user: FirebaseUser): Promise<UserTier> {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  try {
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        photoURL: user.photoURL || '',
        tier: DEFAULT_TIER,
        createdAt: serverTimestamp(),
        lastActive: now,
        updatedAt: now
      });
      return DEFAULT_TIER;
    }
    await setDoc(userRef, {
      email: user.email || '',
      name: user.displayName || '',
      photoURL: user.photoURL || '',
      lastActive: now,
      updatedAt: now
    }, { merge: true });
    const tier = snap.data()?.tier;
    return (tier as UserTier) || DEFAULT_TIER;
  } catch (err) {
    console.warn('Firestore user profile sync warning:', err);
    return DEFAULT_TIER;
  }
}

export function toUserProfile(user: FirebaseUser, tier: UserTier): UserProfile {
  return {
    id: user.uid,
    name: user.displayName || (user.email ? user.email.split('@')[0] : 'Creator'),
    email: user.email || '',
    avatarUrl: user.photoURL || undefined,
    isLoggedIn: true,
    lastActive: 'Active now',
    tier
  };
}

/* ----------------------------------------------------------------------------
 * Projects (each doc stores ownerUid; rules only let the owner read/write it)
 * --------------------------------------------------------------------------*/

/** A new, unique Firestore document id for a project. */
export function newProjectId(): string {
  return doc(collection(db, PROJECTS_COLLECTION)).id;
}

export async function saveProjectToCloud(project: SavedUserProject): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.warn('Not signed in; project not saved to cloud.');
    return;
  }
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
    await setDoc(projectRef, {
      ...project,
      userId: uid,
      ownerUid: uid,
      cloudSyncedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore project save warning:', err);
  }
}

export async function deleteProjectFromCloud(projectId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (err) {
    console.warn('Firestore project delete warning:', err);
  }
}

/** Live list of the signed-in user's projects. */
export function subscribeToUserCloudProjects(
  uid: string,
  onUpdate: (projects: SavedUserProject[]) => void
): () => void {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), where('ownerUid', '==', uid));

    return onSnapshot(q, (snapshot) => {
      const cloudProjects: SavedUserProject[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudProjects.push({
          id: docSnap.id,
          userId: data.ownerUid || uid,
          title: data.title || 'Untitled Campaign',
          targetBrand: data.targetBrand || 'Brand',
          description: data.description || '',
          headline: data.headline || '',
          bodyText: data.bodyText || '',
          mediaType: data.mediaType || 'IMAGE',
          mediaUrl: data.mediaUrl || '',
          aspectRatio: data.aspectRatio || '9:16',
          resolution: data.resolution || '1080p',
          selectedFilter: data.selectedFilter || 'none',
          updatedAt: data.updatedAt || 'Just now',
          hotspotsCount: data.hotspotsCount || 0,
          commentsCount: data.commentsCount || 0,
          thumbnailUrl: data.thumbnailUrl || ''
        });
      });
      // Newest first (cloudSyncedAt is ISO, so string compare works)
      const order = new Map<string, string>();
      snapshot.forEach((d) => order.set(d.id, String(d.data().cloudSyncedAt || '')));
      cloudProjects.sort((a, b) => (order.get(b.id) || '').localeCompare(order.get(a.id) || ''));
      onUpdate(cloudProjects);
    }, (error) => {
      console.warn('Firestore real-time listener notice:', error);
    });
  } catch (e) {
    console.warn('Firestore listener setup warning:', e);
    return () => {};
  }
}
