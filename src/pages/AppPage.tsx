
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VideoUploader from '@/components/app/VideoUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

// Define workflow steps
type WorkflowStep = 'upload' | 'captions' | 'interpretation' | 'export';

const AppPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleVideoUploaded = (file: File, source: string) => {
    setVideoFile(file);
    setVideoSource(source);
    toast({
      title: "Vídeo carregado com sucesso!",
      description: "Agora vamos extrair as legendas do seu vídeo.",
    });
    setCurrentStep('captions');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Video 2 Libras</h1>
            <p className="text-gray-600 mb-8">
              Converta seu vídeo para incluir um intérprete de Libras e torne seu conteúdo acessível.
            </p>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Fluxo de Trabalho</h2>
                <div className="text-sm text-gray-500">
                  Etapa {currentStep === 'upload' ? '1' : 
                        currentStep === 'captions' ? '2' : 
                        currentStep === 'interpretation' ? '3' : '4'} de 4
                </div>
              </div>
              
              <div className="relative mb-8">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-in-out"
                    style={{ 
                      width: currentStep === 'upload' ? '25%' : 
                            currentStep === 'captions' ? '50%' : 
                            currentStep === 'interpretation' ? '75%' : '100%' 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between">
                  <div className={`${currentStep === 'upload' ? 'text-primary font-semibold' : 'text-gray-600'}`}>Upload</div>
                  <div className={`${currentStep === 'captions' ? 'text-primary font-semibold' : 'text-gray-600'}`}>Legendas</div>
                  <div className={`${currentStep === 'interpretation' ? 'text-primary font-semibold' : 'text-gray-600'}`}>Intepretação</div>
                  <div className={`${currentStep === 'export' ? 'text-primary font-semibold' : 'text-gray-600'}`}>Exportar</div>
                </div>
              </div>
              
              {currentStep === 'upload' && (
                <Tabs defaultValue="file" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="file">Upload de Arquivo</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="file" className="mt-6">
                    <VideoUploader onVideoUploaded={handleVideoUploaded} type="file" />
                  </TabsContent>
                  <TabsContent value="youtube" className="mt-6">
                    <VideoUploader onVideoUploaded={handleVideoUploaded} type="youtube" />
                  </TabsContent>
                </Tabs>
              )}
              
              {currentStep === 'captions' && (
                <div className="text-center p-8">
                  <p className="text-lg">Função de extração de legendas será implementada aqui</p>
                </div>
              )}
              
              {currentStep === 'interpretation' && (
                <div className="text-center p-8">
                  <p className="text-lg">Função de interpretação em Libras será implementada aqui</p>
                </div>
              )}
              
              {currentStep === 'export' && (
                <div className="text-center p-8">
                  <p className="text-lg">Função de exportação será implementada aqui</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppPage;
