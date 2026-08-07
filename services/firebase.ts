import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import config from '../firebase-applet-config.json';
import { SavedUserProject, UserProfile } from '../types';

// Initialize Firebase App
const app = initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
});

// Initialize Firestore with specific database ID if present, or default
export const db = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Cloud Firestore Collection References
const PROJECTS_COLLECTION = 'projects';
const USERS_COLLECTION = 'users';

/**
 * Sync user profile to Cloud Firestore
 */
export async function syncUserProfileToCloud(user: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.email.toLowerCase());
    await setDoc(userRef, {
      userId: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
      lastActive: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore user sync warning (falling back to local memory):', err);
  }
}

/**
 * Save or update a project in Cloud Firestore
 */
export async function saveProjectToCloud(project: SavedUserProject): Promise<void> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
    await setDoc(projectRef, {
      ...project,
      userEmail: project.userId.includes('@') ? project.userId : 'anyanwudiamond@gmail.com',
      cloudSyncedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore project save warning (saved to local fallback):', err);
  }
}

/**
 * Delete a project from Cloud Firestore
 */
export async function deleteProjectFromCloud(projectId: string): Promise<void> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(projectRef);
  } catch (err) {
    console.warn('Firestore project delete warning:', err);
  }
}

/**
 * Subscribe to real-time Cloud Firestore updates for a user's saved projects
 */
export function subscribeToUserCloudProjects(
  userEmail: string, 
  onUpdate: (projects: SavedUserProject[]) => void
): () => void {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('userEmail', '==', userEmail.toLowerCase())
    );

    return onSnapshot(q, (snapshot) => {
      const cloudProjects: SavedUserProject[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudProjects.push({
          id: docSnap.id,
          userId: data.userId || userEmail,
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

      if (cloudProjects.length > 0) {
        onUpdate(cloudProjects);
      }
    }, (error) => {
      console.warn('Firestore real-time listener notice:', error);
    });
  } catch (e) {
    console.warn('Firestore listener setup warning:', e);
    return () => {};
  }
}
