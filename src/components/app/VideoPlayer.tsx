import React, { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

interface VideoPlayerProps {
  videoSource: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSource,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isYouTube = videoSource.includes('youtube.com') || videoSource.includes('youtu.be');
  const videoId = isYouTube ? extractVideoId(videoSource) : null;

  useEffect(() => {
    if (!isYouTube && videoRef.current) {
      const videoElement = videoRef.current;

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

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnded);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [isYouTube, onTimeUpdate, onPlay, onPause, onEnded]);

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
    // Configurar o intervalo para atualizar o tempo
    setInterval(() => {
      onTimeUpdate?.(event.target.getCurrentTime());
    }, 1000);
  };

  if (isYouTube && videoId) {
    return (
      <div className={`aspect-video ${className}`}>
        <YouTube
          videoId={videoId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0
            }
          }}
          onStateChange={handleYouTubeStateChange}
          onReady={handleYouTubeReady}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={videoSource}
      controls
      className={`w-full aspect-video ${className}`}
      playsInline
    >
      Your browser does not support the video tag.
    </video>
  );
};

const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default VideoPlayer; 