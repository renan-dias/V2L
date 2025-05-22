/**
 * Serviço para manipular URLs do YouTube
 */

import { Subtitle } from '@/types/subtitle';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Regex para validar URLs do YouTube em diferentes formatos
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
const YOUTUBE_ID_REGEX = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

export interface YouTubeVideoInfo {
  videoId: string;
  title?: string;
  thumbnailUrl?: string;
  duration?: string;
}

export function validateYouTubeUrl(url: string): string | null {
  const patterns = [
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export async function getVideoInfo(videoId: string): Promise<YouTubeVideoInfo> {
  // Note: Esta é uma implementação básica.
  // Para uma implementação completa, você precisaria usar a API do YouTube
  // com uma chave de API válida.
  
  return {
    videoId,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  };
}

export const getVideoDetails = async (videoId: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    return data.items[0];
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

export const getVideoCaptions = async (token: string, videoId: string): Promise<Subtitle[]> => {
  try {
    // Primeiro, obtemos a lista de legendas disponíveis
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No captions found for this video');
    }
    
    // Procuramos por legendas em português
    const portugueseCaption = data.items.find(
      (item: any) => item.snippet.language === 'pt' || item.snippet.language === 'pt-BR'
    );
    
    if (!portugueseCaption) {
      throw new Error('No Portuguese captions found for this video');
    }
    
    // Agora obtemos o conteúdo das legendas
    const captionResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${portugueseCaption.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const captionData = await captionResponse.text();
    
    // Parse the caption data (formato SRT)
    return parseSRT(captionData);
  } catch (error) {
    console.error('Error fetching video captions:', error);
    throw error;
  }
};

const parseSRT = (srtContent: string): Subtitle[] => {
  const subtitles: Subtitle[] = [];
  const blocks = srtContent.trim().split('\n\n');
  
  blocks.forEach((block, index) => {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const timeLine = lines[1];
      const text = lines.slice(2).join(' ');
      
      const [startTime, endTime] = timeLine.split(' --> ').map(time => {
        const [hours, minutes, seconds] = time.split(':');
        return (
          parseInt(hours) * 3600 +
          parseInt(minutes) * 60 +
          parseFloat(seconds.replace(',', '.'))
        );
      });
      
      subtitles.push({
        id: (index + 1).toString(),
        startTime,
        endTime,
        text
      });
    }
  });
  
  return subtitles;
};

// getAccessToken function removed as per requirements
