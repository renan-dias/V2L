import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Subtitle } from '@/types/subtitle';
import { InterpretationResult } from '@/services/geminiService';

export interface VideoProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  videoUrl: string;
  videoType: 'youtube' | 'upload';
  subtitles: Subtitle[];
  interpretations: InterpretationResult[];
  createdAt: Date;
  updatedAt: Date;
}

export const createVideoProject = async (
  userId: string,
  projectData: Omit<VideoProject, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'videoProjects'), {
      ...projectData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating video project:', error);
    throw error;
  }
};

export const getUserProjects = async (userId: string): Promise<VideoProject[]> => {
  try {
    const q = query(
      collection(db, 'videoProjects'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as VideoProject[];
  } catch (error) {
    console.error('Error getting user projects:', error);
    throw error;
  }
};

export const updateVideoProject = async (
  projectId: string,
  updates: Partial<VideoProject>
): Promise<void> => {
  try {
    const projectRef = doc(db, 'videoProjects', projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating video project:', error);
    throw error;
  }
};

export const deleteVideoProject = async (projectId: string): Promise<void> => {
  try {
    const projectRef = doc(db, 'videoProjects', projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting video project:', error);
    throw error;
  }
};

export const uploadVideo = async (
  file: File,
  userId: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, `videos/${userId}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

export const deleteVideo = async (videoUrl: string): Promise<void> => {
  try {
    const videoRef = ref(storage, videoUrl);
    await deleteObject(videoRef);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
}; 