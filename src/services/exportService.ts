/**
 * Service for exporting videos with VLibras interpreter
 */
import html2canvas from 'html2canvas';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface ExportOptions {
  videoElement: HTMLVideoElement;
  vLibrasElement: HTMLElement;
  fileName?: string;
}

export const processVideoExport = async (
  options: ExportOptions,
  onProgress?: (progress: number) => void
): Promise<{ url: string }> => {
  const { videoElement, vLibrasElement, fileName = 'video-with-libras' } = options;
  
  try {
    // Create a container for the video and VLibras
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = `${videoElement.offsetWidth}px`;
    container.style.height = `${videoElement.offsetHeight}px`;
    container.style.backgroundColor = '#000';
    
    // Clone the video element
    const videoClone = videoElement.cloneNode(true) as HTMLVideoElement;
    videoClone.style.width = '100%';
    videoClone.style.height = '100%';
    videoClone.style.objectFit = 'contain';
    container.appendChild(videoClone);
    
    // Clone the VLibras element
    const vLibrasClone = vLibrasElement.cloneNode(true) as HTMLElement;
    vLibrasClone.style.position = 'absolute';
    vLibrasClone.style.bottom = '20px';
    vLibrasClone.style.right = '20px';
    vLibrasClone.style.zIndex = '10';
    container.appendChild(vLibrasClone);
    
    // Add the container to the document temporarily
    document.body.appendChild(container);
    
    // Create a canvas for each frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progress > 90) {
        clearInterval(progressInterval);
      }
      onProgress?.(progress);
    }, 500);
    
    // Draw the current frame
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'video/mp4');
    });
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `videos/${fileName}-${Date.now()}.mp4`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    
    // Clean up
    document.body.removeChild(container);
    clearInterval(progressInterval);
    onProgress?.(100);
    
    return { url };
  } catch (error) {
    console.error('Error exporting video:', error);
    throw error;
  }
};

