import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, isStorageConfigured, checkFirebasePermissions } from '@/lib/firebase';
import { Project } from '@/types/project';
import { YouTubeVideoInfo } from './youtubeService';

export const projectsCollection = collection(db, 'projects');

export const createProject = async (
  userId: string,
  title: string,
  videoFile: File | null,
  youtubeInfo?: YouTubeVideoInfo
): Promise<Project> => {
  try {
    // Verificar se o Firebase está configurado corretamente
    if (!isStorageConfigured) {
      throw new Error('O Firebase Storage não está configurado corretamente. Verifique o arquivo .env com suas credenciais.');
    }

    // Verificar permissões do Firebase antes de continuar
    const hasPermissions = await checkFirebasePermissions();
    if (!hasPermissions) {
      throw new Error('Permissões do Firebase insuficientes. Verifique a configuração das regras de segurança ou use emuladores em ambiente de desenvolvimento.');
    }

    let videoUrl = '';

    // Se temos um arquivo de vídeo, fazer upload
    if (videoFile) {
      const storageRef = ref(storage, `videos/${userId}/${Date.now()}-${videoFile.name}`);
      await uploadBytes(storageRef, videoFile);
      videoUrl = await getDownloadURL(storageRef);
    }

    const projectData = {
      userId,
      title,
      status: 'pending',
      createdAt: new Date(),
      ...(videoUrl ? { videoUrl } : {}),
      ...(youtubeInfo ? { youtubeInfo } : {})
    };

    const docRef = await addDoc(projectsCollection, projectData);
    
    return {
      id: docRef.id,
      ...projectData
    } as Project;
  } catch (error: any) {
    console.error('Erro ao criar projeto:', error);
    
    // Verificar se é um erro de permissão
    if (error.code === 'permission-denied' || 
        error.code === 'storage/unauthorized' || 
        error.message?.includes('permission') || 
        error.message?.includes('permissions') ||
        error.message?.includes('unauthorized') ||
        error.message?.includes('Missing or insufficient permissions')) {
      
      throw new Error('Erro de permissão: Não foi possível criar ou atualizar o projeto. Verifique se você está autenticado e tem as permissões necessárias.');
    }
    
    throw error;
  }
};

export const getUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    const q = query(
      projectsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Project[];
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    throw error;
  }
};

export const getProject = async (projectId: string): Promise<Project | null> => {
  try {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Project;
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    throw error;
  }
};

export const updateProject = async (
  projectId: string,
  updates: Partial<Project>
): Promise<void> => {
  try {
    const docRef = doc(db, 'projects', projectId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: string, userId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'projects', projectId);
    const project = await getProject(projectId);

    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    if (project.userId !== userId) {
      throw new Error('Permissão negada');
    }

    // Deletar arquivos do Storage
    if (project.videoUrl) {
      const videoRef = ref(storage, project.videoUrl);
      await deleteObject(videoRef);
    }
    if (project.transcriptionUrl) {
      const transcriptionRef = ref(storage, project.transcriptionUrl);
      await deleteObject(transcriptionRef);
    }
    if (project.librasVideoUrl) {
      const librasVideoRef = ref(storage, project.librasVideoUrl);
      await deleteObject(librasVideoRef);
    }

    // Deletar documento do Firestore
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    throw error;
  }
}; 