
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left fade-in">
            <div className="inline-block bg-blue-100 text-primary px-4 py-1.5 rounded-full font-medium text-sm mb-6">
              Acessibilidade em Libras
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transforme seus vídeos em conteúdo 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> acessível em Libras</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl md:mx-0 mx-auto">
              O Video 2 Libras (V2L) converte qualquer vídeo adicionando um intérprete de Língua Brasileira de Sinais automaticamente, tornando seu conteúdo mais inclusivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="text-md font-medium bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Link to="/app" className="flex items-center gap-2">
                  Começar Agora <ArrowRight size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-md font-medium">
                <Link to="/como-funciona" className="flex items-center gap-2">
                  Como Funciona <Video size={18} />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 relative pulse">
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-secondary/10 rounded-bl-3xl z-0"></div>
              <img 
                src="https://img.freepik.com/free-vector/video-conference-remote-working-flat-illustration-screen-laptop-with-group-colleagues-people-connection-remote-working_88138-548.jpg" 
                alt="Video 2 Libras interface demonstration" 
                className="w-full h-auto relative z-10 rounded-lg"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>
            <div className="absolute -top-5 -left-5 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
