
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractSubtitlesFromYoutube, extractSubtitlesFromVideo, Subtitle, formatTime } from '@/services/subtitleService';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Save, X, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editingSubtitle, setEditingSubtitle] = useState<number | null>(null);
  const [editedText, setEditedText] = useState('');
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { toast } = useToast();

  // Effect to extract captions when component mounts
  useEffect(() => {
    const extractCaptions = async () => {
      try {
        setIsExtracting(true);
        setIsLoading(true);
        
        // Simulate progress updates
        const interval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + Math.random() * 15;
            return newProgress > 95 ? 95 : newProgress;
          });
        }, 500);
        
        let extractedSubtitles: Subtitle[] = [];
        
        // Extract subtitles based on source type
        if (videoSource.includes('youtube') || videoSource.includes('youtu.be')) {
          extractedSubtitles = await extractSubtitlesFromYoutube(videoSource);
        } else if (videoFile) {
          extractedSubtitles = await extractSubtitlesFromVideo(videoFile);
        }
        
        clearInterval(interval);
        setProgress(100);
        
        setTimeout(() => {
          setSubtitles(extractedSubtitles);
          setIsExtracting(false);
          setIsLoading(false);
          
          toast({
            title: "Legendas extraídas com sucesso!",
            description: `Foram encontradas ${extractedSubtitles.length} legendas no vídeo.`,
          });
        }, 1000);
      } catch (error) {
        console.error("Error extracting captions:", error);
        setIsExtracting(false);
        setIsLoading(false);
        
        toast({
          title: "Erro ao extrair legendas",
          description: "Não foi possível extrair as legendas do vídeo.",
          variant: "destructive",
        });
      }
    };
    
    extractCaptions();
  }, [videoFile, videoSource, toast]);
  
  // Handle video playback
  useEffect(() => {
    if (videoElement) {
      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
      };
      
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [videoElement]);
  
  const handleEdit = (subtitle: Subtitle) => {
    setEditingSubtitle(subtitle.id);
    setEditedText(subtitle.text);
  };
  
  const handleSaveEdit = () => {
    if (editingSubtitle !== null) {
      setSubtitles(prev => 
        prev.map(sub => 
          sub.id === editingSubtitle ? { ...sub, text: editedText } : sub
        )
      );
      setEditingSubtitle(null);
      setEditedText('');
      
      toast({
        title: "Legenda atualizada",
        description: "A legenda foi atualizada com sucesso.",
      });
    }
  };
  
  const handleCancelEdit = () => {
    setEditingSubtitle(null);
    setEditedText('');
  };
  
  const handleContinue = () => {
    onCaptionsReady(subtitles);
  };
  
  const togglePlayPause = () => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const jumpToSubtitle = (startTime: number) => {
    if (videoElement) {
      videoElement.currentTime = startTime;
      if (!isPlaying) {
        videoElement.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Find the active subtitle based on current video time
  const activeSubtitle = subtitles.find(
    sub => currentTime >= sub.startTime && currentTime <= sub.endTime
  );
  
  return (
    <div className="space-y-6">
      {isExtracting ? (
        <motion.div 
          className="p-8 rounded-lg bg-white shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4">Extraindo legendas...</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <motion.div 
              className="bg-primary h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-gray-600">
            Estamos analisando seu vídeo e extraindo as legendas automaticamente.
            Isso pode levar alguns instantes.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/5 bg-gray-100 rounded-lg overflow-hidden shadow-md">
              {videoSource && (
                <video 
                  src={videoSource.startsWith('http') ? videoSource : undefined}
                  ref={(el) => setVideoElement(el)}
                  controls
                  className="w-full aspect-video"
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
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Legendas Extraídas</h3>
              <p className="text-sm text-gray-500">{subtitles.length} legendas encontradas</p>
            </div>
            
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {subtitles.map((subtitle) => (
                <motion.div 
                  key={subtitle.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    activeSubtitle?.id === subtitle.id ? 'bg-blue-50' : ''
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {editingSubtitle === subtitle.id ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="mr-1" /> Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveEdit}
                        >
                          <Save size={16} className="mr-1" /> Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="shrink-0 mt-1"
                        onClick={() => jumpToSubtitle(subtitle.startTime)}
                      >
                        <Play size={14} />
                      </Button>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-mono text-gray-500">
                            {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                          </span>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(subtitle)}
                          >
                            <Pencil size={14} />
                          </Button>
                        </div>
                        <p>{subtitle.text}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={onPrevious}
            >
              Voltar
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={isLoading || subtitles.length === 0}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Continuar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CaptionsStep;
