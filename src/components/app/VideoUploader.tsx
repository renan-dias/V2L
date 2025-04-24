
import React, { useState, useRef } from 'react';
import { Upload, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface VideoUploaderProps {
  onVideoUploaded: (file: File, source: string) => void;
  type: 'file' | 'youtube';
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoUploaded, type }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    // Check if file is a video
    if (!file.type.includes('video/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione um arquivo de vídeo no formato MP4.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 100MB.",
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
    // Very simple validation for YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const handleUpload = async () => {
    setIsLoading(true);

    try {
      if (type === 'file' && videoFile) {
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));
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

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create a placeholder File object for YouTube videos
        const dummyFile = new File(["youtube"], "youtube-video.mp4", { type: "video/mp4" });
        onVideoUploaded(dummyFile, youtubeUrl);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Erro ao processar vídeo",
        description: "Ocorreu um erro ao processar o vídeo. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        >
          <input
            type="file"
            accept="video/mp4,video/x-m4v,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            {videoFile ? (
              <div>
                <p className="text-lg font-medium">{videoFile.name}</p>
                <p className="text-sm text-gray-500">{Math.round(videoFile.size / 1024 / 1024 * 10) / 10} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">Arraste seu vídeo aqui</p>
                <p className="text-sm text-gray-500">Ou clique para selecionar (MP4, máx. 100MB)</p>
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
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">Cole a URL de um vídeo do YouTube que você deseja converter</p>
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
          {isLoading ? 'Processando...' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
};

export default VideoUploader;
