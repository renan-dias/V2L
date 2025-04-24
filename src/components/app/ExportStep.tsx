import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { InterpretationResult } from '@/services/geminiService';
import { processVideoExport } from '@/services/exportService';
import { loadVLibrasScript, interpretTextWithVLibras, positionVLibrasWidget } from '@/services/vLibrasService';
import { Download, Share2, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExportStepProps {
  videoSource: string;
  interpretations: InterpretationResult[];
  onPrevious: () => void;
}

const ExportStep: React.FC<ExportStepProps> = ({ 
  videoSource,
  interpretations,
  onPrevious
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVLibrasLoaded, setIsVLibrasLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [currentInterpretation, setCurrentInterpretation] = useState<InterpretationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const vLibrasContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Load VLibras when component mounts
  useEffect(() => {
    const initializeVLibras = async () => {
      try {
        setIsLoading(true);
        await loadVLibrasScript();
        setIsVLibrasLoaded(true);
        
        // Position the widget
        setTimeout(() => {
          positionVLibrasWidget('bottomRight');
        }, 1000);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading VLibras:', error);
        setIsLoading(false);
        
        toast({
          title: "Erro ao carregar VLibras",
          description: "Não foi possível carregar o interpretador de Libras.",
          variant: "destructive",
        });
      }
    };
    
    initializeVLibras();
  }, [toast]);
  
  // Handle video playback and interpretation timing
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement || interpretations.length === 0) {
      return;
    }
    
    const handleTimeUpdate = () => {
      const currentVideoTime = videoElement.currentTime;
      setCurrentTime(currentVideoTime);
      
      // Find the current interpretation based on video time
      const currentInterp = interpretations.find(
        interp => currentVideoTime >= interp.startTime && currentVideoTime <= interp.endTime
      );
      
      // If we found a new interpretation or moved out of the previous one
      if (currentInterp && (!currentInterpretation || currentInterp.subtitleId !== currentInterpretation.subtitleId)) {
        setCurrentInterpretation(currentInterp);
        
        // Send the interpretation to VLibras
        if (isVLibrasLoaded) {
          interpretTextWithVLibras(currentInterp.librasInterpretation);
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
  }, [interpretations, currentInterpretation, isVLibrasLoaded]);
  
  const handleExport = async () => {
    if (!videoRef.current || !vLibrasContainerRef.current) return;
    
    try {
      setIsExporting(true);
      
      // Process the export with progress updates
      const result = await processVideoExport(
        {
          videoElement: videoRef.current,
          vLibrasElement: document.querySelector('.vw-plugin-wrapper') as HTMLElement,
          fileName: 'video-with-libras'
        },
        (progress) => {
          setExportProgress(progress);
        }
      );
      
      setExportedVideoUrl(result.url);
      setIsExporting(false);
      
      toast({
        title: "Exportação concluída!",
        description: "Seu vídeo com interpretação em Libras está pronto para download.",
      });
    } catch (error) {
      console.error('Error exporting video:', error);
      setIsExporting(false);
      
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o vídeo.",
        variant: "destructive",
      });
    }
  };
  
  const handleCopyLink = () => {
    if (exportedVideoUrl) {
      navigator.clipboard.writeText(exportedVideoUrl);
      setIsLinkCopied(true);
      
      setTimeout(() => {
        setIsLinkCopied(false);
      }, 3000);
      
      toast({
        title: "Link copiado!",
        description: "O link do vídeo foi copiado para a área de transferência.",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {isLoading ? (
        <motion.div 
          className="p-8 rounded-lg bg-white shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4">Carregando VLibras...</h3>
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <p className="text-gray-600">
            Estamos inicializando o interpretador de Libras.
            Isso pode levar alguns instantes.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="text-lg font-semibold">Pré-visualização com Interpretação em Libras</h3>
              <p className="text-sm text-gray-500">
                Assista ao vídeo com a interpretação em Libras antes de exportar
              </p>
            </div>
            
            <div className="relative">
              <video 
                ref={videoRef}
                src={videoSource}
                controls
                className="w-full aspect-video"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
              
              <div 
                ref={vLibrasContainerRef} 
                className="absolute bottom-0 right-0 z-10"
              >
                {/* VLibras widget will be inserted here by the script */}
              </div>
            </div>
            
            <div className="p-4 border-t">
              {currentInterpretation ? (
                <div className="animate-fadeIn">
                  <p className="text-sm font-medium text-blue-800">Interpretação atual:</p>
                  <p className="text-gray-700">{currentInterpretation.librasInterpretation}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  A interpretação será exibida conforme o vídeo é reproduzido...
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Exportar Vídeo com Libras</h3>
            
            {isExporting ? (
              <motion.div 
                className="text-center py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h4 className="text-base font-medium mb-3">Processando exportação...</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Isso pode levar alguns minutos</p>
              </motion.div>
            ) : exportedVideoUrl ? (
              <motion.div 
                className="py-4 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-center">
                  <div className="bg-green-100 text-green-800 p-3 rounded-full">
                    <Check size={24} />
                  </div>
                </div>
                <h4 className="text-center text-lg font-medium">Vídeo exportado com sucesso!</h4>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="gap-2">
                    <a href={exportedVideoUrl} download="video-with-libras.mp4">
                      <Download size={18} /> Baixar Vídeo
                    </a>
                  </Button>
                  <Button variant="outline" onClick={handleCopyLink} className="gap-2">
                    {isLinkCopied ? (
                      <>
                        <Check size={18} /> Link Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={18} /> Copiar Link
                      </>
                    )}
                  </Button>
                  <Button variant="secondary" className="gap-2">
                    <Share2 size={18} /> Compartilhar
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-4">
                <p className="mb-6 text-gray-700">
                  Ao exportar, o vídeo será salvo com o interpretador de Libras
                  posicionado no canto da tela.
                </p>
                <Button 
                  onClick={handleExport} 
                  disabled={!isVLibrasLoaded}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Exportar Vídeo com Libras
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={onPrevious}
            >
              Voltar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportStep;
