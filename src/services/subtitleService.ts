
/**
 * Service to extract subtitles from videos (YouTube or uploaded files)
 */
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Subtitle {
  id: number;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
}

// Extract subtitles from a YouTube video
export const extractSubtitlesFromYoutube = async (youtubeUrl: string): Promise<Subtitle[]> => {
  try {
    // Extract the YouTube video ID from the URL
    const videoId = extractYoutubeVideoId(youtubeUrl);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    // For demo purposes, we'll use a simulated API call
    // In a real application, you would call an actual YouTube API
    const response = await fetch(`https://yt-subtitle-api-simulator.vercel.app/api/subtitles?videoId=${videoId}`);
    
    // If the API doesn't exist, simulate some subtitles based on the video length
    if (!response.ok) {
      console.log('Simulating subtitles as API call failed');
      return generateSimulatedSubtitles();
    }
    
    const data = await response.json();
    return data.subtitles;
  } catch (error) {
    console.error('Error extracting subtitles from YouTube:', error);
    // If there's an error, generate simulated subtitles
    return generateSimulatedSubtitles();
  }
};

// Extract subtitles from an uploaded video file
export const extractSubtitlesFromVideo = async (videoFile: File): Promise<Subtitle[]> => {
  try {
    // In a real application, you would use a speech-to-text API
    // For demo purposes, we'll simulate processing the video
    
    // First, upload the video to Firebase Storage to simulate processing
    const storageRef = ref(storage, `temp-videos/${Date.now()}-${videoFile.name}`);
    await uploadBytes(storageRef, videoFile);
    const videoUrl = await getDownloadURL(storageRef);
    
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate simulated subtitles
    return generateSimulatedSubtitles();
  } catch (error) {
    console.error('Error extracting subtitles from video file:', error);
    return [];
  }
};

// Helper function to extract YouTube video ID from URL
export const extractYoutubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to generate simulated subtitles
export const generateSimulatedSubtitles = (): Subtitle[] => {
  const sampleTexts = [
    "Olá, seja bem-vindo ao nosso vídeo.",
    "Hoje vamos falar sobre acessibilidade na web.",
    "A Língua Brasileira de Sinais, ou Libras, é muito importante.",
    "É um direito das pessoas surdas terem acesso a conteúdos em sua língua.",
    "Este aplicativo ajuda a tornar vídeos mais acessíveis.",
    "Convertendo o conteúdo para incluir um intérprete de Libras.",
    "A tecnologia pode quebrar barreiras de comunicação.",
    "Esperamos que esta ferramenta seja útil para você.",
    "Obrigado por utilizar o Video 2 Libras!",
    "Não se esqueça de compartilhar com quem precisar."
  ];
  
  const subtitles: Subtitle[] = [];
  
  for (let i = 0; i < sampleTexts.length; i++) {
    subtitles.push({
      id: i + 1,
      startTime: i * 5, // Start every 5 seconds
      endTime: (i + 1) * 5, // End 5 seconds later
      text: sampleTexts[i]
    });
  }
  
  return subtitles;
};

// Format time in seconds to HH:MM:SS format
export const formatTime = (timeInSeconds: number): string => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
};

