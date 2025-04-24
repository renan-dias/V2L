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
import { db, storage } from '@/lib/firebase';
import { Project } from '@/types/project';

export const projectsCollection = collection(db, 'projects');

export const createProject = async (
  userId: string,
  title: string,
  videoFile: File
): Promise<Project> => {
  try {
    // 1. Criar o documento do projeto
    const project: Omit<Project, 'id'> = {
      title,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
    };

    const docRef = await addDoc(projectsCollection, {
      ...project,
      createdAt: Timestamp.fromDate(project.createdAt),
      updatedAt: Timestamp.fromDate(project.updatedAt),
    });

    // 2. Upload do vídeo
    const videoRef = ref(storage, `videos/${userId}/${docRef.id}/${videoFile.name}`);
    await uploadBytes(videoRef, videoFile);
    const videoUrl = await getDownloadURL(videoRef);

    // 3. Atualizar o projeto com a URL do vídeo
    const metadata = {
      size: videoFile.size,
      format: videoFile.type,
    };

    await updateDoc(docRef, {
      videoUrl,
      metadata,
      status: 'processing',
    });

    return {
      ...project,
      id: docRef.id,
      videoUrl,
      metadata,
      status: 'processing',
    };
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
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