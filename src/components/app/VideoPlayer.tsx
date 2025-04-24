import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoSource: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
  initialVolume?: number;
  showControls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSource,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  className = '',
  initialVolume = 1,
  showControls = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const isYouTube = videoSource.includes('youtube.com') || videoSource.includes('youtu.be');
  const videoId = isYouTube ? extractVideoId(videoSource) : null;

  useEffect(() => {
    if (!isYouTube && videoRef.current) {
      const videoElement = videoRef.current;
      videoElement.volume = volume;
      videoElement.muted = isMuted;

      const handleTimeUpdate = () => {
        onTimeUpdate?.(videoElement.currentTime);
      };

      const handlePlay = () => {
        onPlay?.();
      };

      const handlePause = () => {
        onPause?.();
      };

      const handleEnded = () => {
        onEnded?.();
      };

      const handleFullscreenChange = () => {
        setIsFullscreen(document.fullscreenElement !== null);
      };

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnded);
      document.addEventListener('fullscreenchange', handleFullscreenChange);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnded);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }
  }, [isYouTube, onTimeUpdate, onPlay, onPause, onEnded, volume, isMuted]);

  const handleYouTubeStateChange = (event: any) => {
    switch (event.data) {
      case YouTube.PlayerState.PLAYING:
        onPlay?.();
        break;
      case YouTube.PlayerState.PAUSED:
        onPause?.();
        break;
      case YouTube.PlayerState.ENDED:
        onEnded?.();
        break;
    }
  };

  const handleYouTubeReady = (event: any) => {
    event.target.setVolume(volume * 100);
    event.target.mute(isMuted);
    
    // Configurar o intervalo para atualizar o tempo
    setInterval(() => {
      onTimeUpdate?.(event.target.getCurrentTime());
    }, 1000);
  };

  const toggleMute = () => {
    if (!isYouTube && videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (!isYouTube && videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!isYouTube && videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const renderCustomControls = () => {
    if (!showControls) return null;

    return (
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-white hover:text-white/80"
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
            aria-label="Controle de volume"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="text-white hover:text-white/80"
          aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </Button>
      </div>
    );
  };

  if (isYouTube && videoId) {
    return (
      <div className={`relative aspect-video ${className}`}>
        <YouTube
          videoId={videoId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0,
              controls: showControls ? 1 : 0
            }
          }}
          onStateChange={handleYouTubeStateChange}
          onReady={handleYouTubeReady}
          className="w-full h-full"
        />
        {!showControls && renderCustomControls()}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={videoSource}
        controls={showControls}
        className="w-full aspect-video"
        playsInline
        aria-label="Reprodutor de vídeo"
      >
        Your browser does not support the video tag.
      </video>
      {!showControls && renderCustomControls()}
    </div>
  );
};

const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default VideoPlayer; 