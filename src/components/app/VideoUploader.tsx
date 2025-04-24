import React, { useState, useRef } from 'react';
import { Upload, Youtube, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface VideoUploaderProps {
  onVideoUploaded: (file: File, source: string) => void;
  type: 'file' | 'youtube';
  maxFileSize?: number; // em MB
  allowedFileTypes?: string[];
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ 
  onVideoUploaded, 
  type,
  maxFileSize = 100,
  allowedFileTypes = ['video/mp4', 'video/x-m4v', 'video/*']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (type !== 'file') return;

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      validateAndSetVideoFile(files[0]);
    }
  };

  const validateAndSetVideoFile = (file: File) => {
    // Verifica se o arquivo é um vídeo
    if (!file.type.includes('video/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: `Por favor, selecione um arquivo de vídeo nos formatos: ${allowedFileTypes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Verifica o tamanho do arquivo
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: `O tamanho máximo permitido é ${maxFileSize}MB.`,
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetVideoFile(e.target.files[0]);
    }
  };

  const validateYoutubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setUploadProgress(0);

    try {
      if (type === 'file' && videoFile) {
        // Simula o progresso do upload
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 150);

        // Simula o processamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        clearInterval(interval);
        setUploadProgress(100);
        onVideoUploaded(videoFile, 'file');
      } else if (type === 'youtube' && youtubeUrl) {
        if (!validateYoutubeUrl(youtubeUrl)) {
          toast({
            title: "URL inválida",
            description: "Por favor, insira uma URL válida do YouTube.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Simula o progresso do processamento
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 150);

        // Simula o processamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        clearInterval(interval);
        setUploadProgress(100);
        
        // Cria um arquivo dummy para vídeos do YouTube
        const dummyFile = new File(["youtube"], "youtube-video.mp4", { type: "video/mp4" });
        onVideoUploaded(dummyFile, youtubeUrl);
      }
    } catch (error) {
      console.error("Erro ao processar vídeo:", error);
      toast({
        title: "Erro ao processar vídeo",
        description: "Ocorreu um erro ao processar o vídeo. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeVideoFile = () => {
    setVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {type === 'file' && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Área de upload de vídeo"
        >
          <input
            type="file"
            accept={allowedFileTypes.join(',')}
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            aria-label="Selecionar arquivo de vídeo"
          />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            {videoFile ? (
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-lg font-medium">{videoFile.name}</p>
                    <p className="text-sm text-gray-500">{Math.round(videoFile.size / 1024 / 1024 * 10) / 10} MB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeVideoFile();
                    }}
                    aria-label="Remover arquivo"
                  >
                    <X size={20} />
                  </Button>
                </div>
                {isLoading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-500 text-center">Processando... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">Arraste seu vídeo aqui</p>
                <p className="text-sm text-gray-500">Ou clique para selecionar (MP4, máx. {maxFileSize}MB)</p>
              </div>
            )}
          </div>
        </div>
      )}

      {type === 'youtube' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="youtube-url">URL do YouTube</Label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Youtube className="h-5 w-5 text-gray-500" />
                </div>
                <Input 
                  id="youtube-url" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  className="pl-10"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  aria-label="URL do vídeo do YouTube"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">Cole a URL de um vídeo do YouTube que você deseja converter</p>
            {isLoading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-500 text-center">Processando... {uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleUpload} 
          disabled={
            isLoading || 
            (type === 'file' && !videoFile) || 
            (type === 'youtube' && !youtubeUrl)
          }
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoUploader;
