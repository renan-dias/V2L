
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Subtitle } from './subtitleService';

export const extractVideoId = (youtubeUrl: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = youtubeUrl.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const getVideoCaptions = async (videoId: string): Promise<Subtitle[]> => {
  try {
    // In a real implementation, this would call YouTube API to get captions
    // using YOUTUBE_API_KEY from environment variables
    // For now, we're returning mock data
    const mockSubtitles: Subtitle[] = [
      { id: uuidv4(), startTime: 0, endTime: 5, text: "Olá, bem-vindo ao vídeo." },
      { id: uuidv4(), startTime: 5, endTime: 10, text: "Hoje vamos falar sobre acessibilidade." },
      { id: uuidv4(), startTime: 10, endTime: 15, text: "A Língua Brasileira de Sinais é muito importante." },
      { id: uuidv4(), startTime: 15, endTime: 20, text: "Vamos aprender como tornar vídeos acessíveis." },
      { id: uuidv4(), startTime: 20, endTime: 25, text: "Utilizando ferramentas como o Video 2 Libras." },
      { id: uuidv4(), startTime: 25, endTime: 30, text: "Obrigado por assistir este vídeo." },
    ];
    
    return mockSubtitles;
  } catch (error) {
    console.error('Error getting video captions from YouTube:', error);
    throw error;
  }
};

export const getVideoDetails = async (videoId: string) => {
  try {
    // In a real implementation, this would call YouTube API to get video details
    // For now, we're returning mock data
    return {
      title: "Vídeo de demonstração",
      description: "Este é um vídeo de demonstração para o Video 2 Libras",
      thumbnailUrl: "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg",
    };
  } catch (error) {
    console.error('Error getting video details:', error);
    throw error;
  }
};
