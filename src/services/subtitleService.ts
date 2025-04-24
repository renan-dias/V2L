
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const extractVideoId = (youtubeUrl: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = youtubeUrl.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const extractSubtitlesFromYoutube = async (videoId: string): Promise<Subtitle[]> => {
  try {
    // In a real implementation, this would call YouTube API to get captions
    // For now, we're returning mock data
    const mockSubtitles: Subtitle[] = [
      { id: uuidv4(), startTime: 0, endTime: 5, text: "Olá, bem-vindo ao vídeo." },
      { id: uuidv4(), startTime: 5, endTime: 10, text: "Hoje vamos falar sobre acessibilidade." },
      { id: uuidv4(), startTime: 10, endTime: 15, text: "A Língua Brasileira de Sinais é muito importante." },
      // Add more mock subtitles as needed
    ];
    
    return mockSubtitles;
  } catch (error) {
    console.error('Error extracting subtitles from YouTube:', error);
    throw error;
  }
};

export const extractSubtitlesFromVideo = async (videoFile: File): Promise<Subtitle[]> => {
  try {
    // In a real implementation, this would use a speech-to-text service
    // For now, we're returning mock data
    const mockSubtitles: Subtitle[] = [
      { id: uuidv4(), startTime: 0, endTime: 5, text: "Olá, bem-vindo ao vídeo." },
      { id: uuidv4(), startTime: 5, endTime: 10, text: "Hoje vamos falar sobre acessibilidade." },
      { id: uuidv4(), startTime: 10, endTime: 15, text: "A Língua Brasileira de Sinais é muito importante." },
      // Add more mock subtitles as needed
    ];
    
    return mockSubtitles;
  } catch (error) {
    console.error('Error extracting subtitles from video:', error);
    throw error;
  }
};
