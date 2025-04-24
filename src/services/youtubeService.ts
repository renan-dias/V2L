
import { Subtitle } from '@/types/subtitle';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

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

export const getVideoCaptions = async (videoId: string): Promise<Subtitle[]> => {
  try {
    // Primeiro, obtemos a lista de legendas disponíveis
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
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
      `https://www.googleapis.com/youtube/v3/captions/${portugueseCaption.id}?key=${YOUTUBE_API_KEY}`,
      {
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`
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

// Função para obter o token de acesso (você precisará implementar a autenticação OAuth2)
const getAccessToken = async (): Promise<string> => {
  // Implemente a lógica para obter o token de acesso
  // Isso pode envolver o uso do Firebase Auth ou outro método de autenticação
  throw new Error('Not implemented');
};
