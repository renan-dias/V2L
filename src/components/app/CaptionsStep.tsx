import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractSubtitlesFromYoutube, extractSubtitlesFromVideo, Subtitle, formatTime } from '@/services/subtitleService';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Save, X, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { extractVideoId, getVideoCaptions } from '@/services/youtubeService';
import { useAuth } from '@/components/auth/AuthProvider'; // Added import

interface CaptionsStepProps {
  videoFile: File | null;
  videoSource: string;
  onCaptionsReady: (subtitles: Subtitle[]) => void;
  onPrevious: () => void;
}

const CaptionsStep: React.FC<CaptionsStepProps> = ({ 
  videoFile, 
  videoSource,
  onCaptionsReady,
  onPrevious
}) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState<Subtitle | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { youtubeAccessToken, user } = useAuth(); // Added useAuth hook

  // Handle video playback
  useEffect(() => {
    if (!videoElement) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      
      // Find the active subtitle based on current time
      const currentSubtitle = subtitles.find(
        subtitle => videoElement.currentTime >= subtitle.startTime && videoElement.currentTime <= subtitle.endTime
      );
      
      if (currentSubtitle && (!activeSubtitle || currentSubtitle.id !== activeSubtitle.id)) {
        setActiveSubtitle(currentSubtitle);
      }
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [videoElement, subtitles, activeSubtitle]);
  
  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!videoElement) return;
    
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  };
  
  // Process video to extract subtitles
  const processVideo = async () => {
    if (!videoElement) return;
    
    try {
      setIsProcessing(true);
      
      if (videoSource.includes('youtube.com') || videoSource.includes('youtu.be')) {
        // Process YouTube video
        const videoId = extractVideoId(videoSource);
        if (!videoId) {
          // throw new Error('Invalid YouTube URL'); // Original error handling
          toast({
            title: "URL do YouTube Inválida",
            description: "Não foi possível extrair o ID do vídeo da URL fornecida.",
            variant: "destructive",
          });
          setIsProcessing(false); // Ensure processing state is reset
          return;
        }

        if (!user) { // Check if user is available from useAuth()
          toast({
            title: "Usuário não autenticado",
            description: "Por favor, faça login para extrair legendas de vídeos do YouTube.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }

        if (!youtubeAccessToken) {
          toast({
            title: "Token de Acesso do YouTube Ausente",
            description: "Não foi possível obter o token de acesso para o YouTube. Tente fazer login novamente.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        
        // Pass the token as the first argument
        const extractedSubtitles = await getVideoCaptions(youtubeAccessToken, videoId);
        setSubtitles(extractedSubtitles);
      } else {
        // Process local video
        // Aqui você pode implementar a extração de legendas de vídeos locais
        // usando uma biblioteca como whisper.js ou similar
        throw new Error('Local video caption extraction not implemented yet');
      }
      
      setIsProcessing(false);
      
      toast({
        title: "Legendas extraídas!",
        description: "As legendas foram extraídas com sucesso. Você pode editá-las se necessário.",
      });
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
      
      toast({
        title: "Erro ao processar vídeo",
        description: error instanceof Error ? error.message : "Não foi possível extrair as legendas do vídeo.",
        variant: "destructive",
      });
    }
  };
  
  // Handle subtitle edit
  const handleSubtitleEdit = (id: string, newText: string) => {
    setSubtitles(prevSubtitles => 
      prevSubtitles.map(subtitle => 
        subtitle.id === id ? { ...subtitle, text: newText } : subtitle
      )
    );
  };
  
  // Handle subtitle timing edit
  const handleTimingEdit = (id: string, startTime: number, endTime: number) => {
    setSubtitles(prevSubtitles => 
      prevSubtitles.map(subtitle => 
        subtitle.id === id ? { ...subtitle, startTime, endTime } : subtitle
      )
    );
  };
  
  // Handle continue
  const handleContinue = () => {
    if (subtitles.length === 0) {
      toast({
        title: "Nenhuma legenda",
        description: "Por favor, extraia as legendas antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
    onCaptionsReady(subtitles);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/5 bg-gray-100 rounded-lg overflow-hidden shadow-md">
          {videoSource && (
            <video 
              src={videoSource.startsWith('http') ? videoSource : undefined}
              ref={(el) => setVideoElement(el)}
              controls
              className="w-full aspect-video"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        
        <div className="w-full md:w-2/5 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Controles do Vídeo</h3>
            <Button 
              variant="outline" 
              size="icon"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="current-time">Tempo atual:</Label>
            <p className="text-xl font-mono">{formatTime(currentTime)}</p>
          </div>
          
          {activeSubtitle && (
            <motion.div 
              className="p-3 bg-primary/10 border border-primary/20 rounded-md mb-4"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-gray-500">Legenda Atual:</p>
              <p className="text-base font-medium">{activeSubtitle.text}</p>
            </motion.div>
          )}
          
          {!isProcessing && subtitles.length === 0 && (
            <div className="text-center py-4">
              <p className="mb-4 text-gray-700">
                Clique no botão abaixo para extrair as legendas do vídeo.
              </p>
              <Button 
                onClick={processVideo}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Extrair Legendas
              </Button>
            </div>
          )}
          
          {isProcessing && (
            <div className="text-center py-4">
              <h4 className="text-base font-medium mb-3">Processando vídeo...</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Isso pode levar alguns minutos</p>
            </div>
          )}
          
          {subtitles.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Legendas Extraídas:</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {subtitles.map(subtitle => (
                  <div 
                    key={subtitle.id}
                    className={`p-2 rounded-md ${
                      activeSubtitle?.id === subtitle.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">
                        {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (videoElement) {
                            videoElement.currentTime = subtitle.startTime;
                            videoElement.play();
                          }
                        }}
                      >
                        <Play size={12} />
                      </Button>
                    </div>
                    <p className="text-sm">{subtitle.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
        >
          Voltar
        </Button>
        
        {subtitles.length > 0 && (
          <Button 
            onClick={handleContinue}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Continuar
          </Button>
        )}
      </div>
    </div>
  );
};

export default CaptionsStep;
