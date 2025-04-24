export interface Project {
  id?: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  videoUrl?: string;
  transcriptionUrl?: string;
  librasVideoUrl?: string;
  metadata?: {
    duration?: number;
    size?: number;
    format?: string;
  };
}

export interface Conversion {
  id?: string;
  projectId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  progress?: number;
} 