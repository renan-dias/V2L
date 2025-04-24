
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Subtitle } from '@/types/subtitle';
import { convertTextToLibras, InterpretationResult } from '@/services/geminiService';
import { Pencil, Save, X, ArrowRight, Play, Pause, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { loadVLibrasScript, interpretTextWithVLibras, positionVLibrasWidget } from '@/services/vLibrasService';
import { createVideoProject, updateVideoProject } from '@/services/firebaseService';
import { getCurrentUser } from '@/services/authService';

interface InterpretationStepProps {
  subtitles: Subtitle[];
  videoSource: string;
  onInterpretationReady: (interpretations: InterpretationResult[]) => void;
  onPrevious: () => void;
}

const InterpretationStep: React.FC<InterpretationStepProps> = ({ 
  subtitles,
  videoSource,
  onInterpretationReady,
  onPrevious
}) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState<Subtitle | null>(null);
  const [isVLibrasLoaded, setIsVLibrasLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [interpretations, setInterpretations] = useState<InterpretationResult[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  
  const vLibrasContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Load VLibras when component mounts
  useEffect(() => {
    const initializeVLibras = async () => {
      try {
        await loadVLibrasScript();
        setIsVLibrasLoaded(true);
        
        // Position the widget
        setTimeout(() => {
          positionVLibrasWidget('bottomRight');
        }, 1000);
      } catch (error) {
        console.error('Error loading VLibras:', error);
        
        toast({
          title: "Erro ao carregar VLibras",
          description: "Não foi possível carregar o interpretador de Libras.",
          variant: "destructive",
        });
      }
    };
    
    initializeVLibras();
  }, [toast]);
  
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
        
        // Find the corresponding interpretation
        const currentInterpretation = interpretations.find(
          interp => interp.subtitleId === currentSubtitle.id
        );
        
        // Send the interpretation to VLibras
        if (currentInterpretation && isVLibrasLoaded) {
          interpretTextWithVLibras(currentInterpretation.librasInterpretation);
        }
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
  }, [videoElement, subtitles, activeSubtitle, interpretations, isVLibrasLoaded]);
  
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
  
  // Process subtitles to generate interpretations
  const processSubtitles = async () => {
    try {
      setIsProcessing(true);
      
      // Get current user
      const user = getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create or update project in Firebase
      if (!projectId) {
        const newProjectId = await createVideoProject(user.uid, {
          userId: user.uid, // Add userId to fix the TypeScript error
          title: 'Novo Projeto',
          description: 'Projeto criado em ' + new Date().toLocaleDateString(),
          videoUrl: videoSource,
          videoType: videoSource.includes('youtube.com') || videoSource.includes('youtu.be') ? 'youtube' : 'upload',
          subtitles: subtitles,
          interpretations: []
        });
        setProjectId(newProjectId);
      }
      
      // Generate interpretations using Gemini
      const results = await convertTextToLibras(subtitles);
      setInterpretations(results);
      
      // Update project in Firebase
      if (projectId) {
        await updateVideoProject(projectId, {
          interpretations: results
        });
      }
      
      setIsProcessing(false);
      // Set progress to 100% when done
      setProgress(100);
      
      toast({
        title: "Interpretações geradas!",
        description: "As interpretações em Libras foram geradas com sucesso.",
      });
    } catch (error) {
      console.error('Error processing subtitles:', error);
      setIsProcessing(false);
      
      toast({
        title: "Erro ao gerar interpretações",
        description: error instanceof Error ? error.message : "Não foi possível gerar as interpretações em Libras.",
        variant: "destructive",
      });
    }
  };
  
  const handleEdit = (interpretation: InterpretationResult) => {
    setEditingId(interpretation.subtitleId);
    setEditedText(interpretation.librasInterpretation);
  };
  
  const handleSaveEdit = () => {
    if (editingId !== null) {
      setInterpretations(prev => 
        prev.map(item => 
          item.subtitleId === editingId ? { ...item, librasInterpretation: editedText } : item
        )
      );
      setEditingId(null);
      setEditedText('');
      
      toast({
        title: "Interpretação atualizada",
        description: "A interpretação em Libras foi atualizada com sucesso.",
      });
    }
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedText('');
  };
  
  // Handle continue
  const handleContinue = () => {
    if (interpretations.length === 0) {
      toast({
        title: "Nenhuma interpretação",
        description: "Por favor, gere as interpretações antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
    onInterpretationReady(interpretations);
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
          
          <div 
            ref={vLibrasContainerRef} 
            className="absolute bottom-0 right-0 z-10"
          >
            {/* VLibras widget will be inserted here by the script */}
          </div>
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
            <p className="text-sm text-gray-500">Tempo atual:</p>
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
              
              {interpretations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-primary/20">
                  <p className="text-sm text-gray-500">Interpretação em Libras:</p>
                  <p className="text-base font-medium">
                    {interpretations.find(interp => interp.subtitleId === activeSubtitle.id)?.librasInterpretation}
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {!isProcessing && interpretations.length === 0 && (
            <div className="text-center py-4">
              <p className="mb-4 text-gray-700">
                Clique no botão abaixo para gerar as interpretações em Libras.
              </p>
              <Button 
                onClick={processSubtitles}
                disabled={!isVLibrasLoaded}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Gerar Interpretações
              </Button>
            </div>
          )}
          
          {isProcessing && (
            <div className="text-center py-4">
              <h4 className="text-base font-medium mb-3">Gerando interpretações...</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Isso pode levar alguns minutos</p>
            </div>
          )}
          
          {interpretations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Interpretações Geradas:</h4>
                <div className="flex items-center text-green-600">
                  <Check size={16} className="mr-1" />
                  <span className="text-sm">{interpretations.length} interpretações</span>
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {interpretations.map(interpretation => (
                  <div 
                    key={interpretation.subtitleId}
                    className={`p-2 rounded-md ${
                      activeSubtitle?.id === interpretation.subtitleId 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">
                        {formatTime(interpretation.startTime)} - {formatTime(interpretation.endTime)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (videoElement) {
                            videoElement.currentTime = interpretation.startTime;
                            videoElement.play();
                          }
                        }}
                      >
                        <Play size={12} />
                      </Button>
                    </div>
                    <p className="text-sm">{interpretation.librasInterpretation}</p>
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
        
        {interpretations.length > 0 && (
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

export default InterpretationStep;
