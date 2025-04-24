import React from 'react';
import { YouTubeVideoInfo } from '../services/youtubeService';
import '../styles/YouTubeVideo.css';

interface YouTubeVideoProps {
  videoInfo: YouTubeVideoInfo;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoInfo }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoInfo.videoId}`;

  return (
    <div className="youtube-video-container">
      <iframe
        src={embedUrl}
        title={videoInfo.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}; 