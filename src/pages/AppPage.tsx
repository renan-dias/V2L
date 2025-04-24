
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VideoUploader from '@/components/app/VideoUploader';
import CaptionsStep from '@/components/app/CaptionsStep';
import InterpretationStep from '@/components/app/InterpretationStep';
import ExportStep from '@/components/app/ExportStep';
import { Subtitle } from '@/services/subtitleService';
import { InterpretationResult } from '@/services/geminiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Define workflow steps
type WorkflowStep = 'upload' | 'captions' | 'interpretation' | 'export';

const AppPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [interpretations, setInterpretations] = useState<InterpretationResult[]>([]);
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

  const handleCaptionsReady = (extractedSubtitles: Subtitle[]) => {
    setSubtitles(extractedSubtitles);
    toast({
      title: "Legendas verificadas!",
      description: "Agora vamos gerar a interpretação em Libras.",
    });
    setCurrentStep('interpretation');
  };

  const handleInterpretationReady = (results: InterpretationResult[]) => {
    setInterpretations(results);
    toast({
      title: "Interpretação em Libras concluída!",
      description: "Agora você pode exportar seu vídeo com interpretação em Libras.",
    });
    setCurrentStep('export');
  };

  const getStepNumber = (step: WorkflowStep): number => {
    const steps: WorkflowStep[] = ['upload', 'captions', 'interpretation', 'export'];
    return steps.indexOf(step) + 1;
  };

  const getProgressPercentage = (): number => {
    return (getStepNumber(currentStep) / 4) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Video 2 Libras</h1>
            <p className="text-gray-600 mb-8">
              Converta seu vídeo para incluir um intérprete de Libras e torne seu conteúdo acessível.
            </p>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Fluxo de Trabalho</h2>
                <div className="text-sm text-gray-500">
                  Etapa {getStepNumber(currentStep)} de 4
                </div>
              </div>
              
              <div className="relative mb-8">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                  <motion.div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: '0%' }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
                <div className="flex justify-between">
                  <div className={`${currentStep === 'upload' ? 'text-primary font-semibold' : 'text-gray-600'}`}>Upload</div>
                  <div className={`${currentStep === 'captions' ? 'text-primary font-semibold' : 'text-gray-600'}`}>Legendas</div>
                  <div className={`${currentStep === 'interpretation' ? 'text-primary font-semibold' : 'text-gray-600'}`}>Interpretação</div>
                  <div className={`${currentStep === 'export' ? 'text-primary font-semibold' : 'text-gray-600'}`}>Exportar</div>
                </div>
              </div>
              
              {currentStep === 'upload' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
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
                </motion.div>
              )}
              
              {currentStep === 'captions' && videoSource && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CaptionsStep 
                    videoFile={videoFile}
                    videoSource={videoSource}
                    onCaptionsReady={handleCaptionsReady}
                    onPrevious={() => setCurrentStep('upload')}
                  />
                </motion.div>
              )}
              
              {currentStep === 'interpretation' && videoSource && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <InterpretationStep 
                    subtitles={subtitles}
                    videoSource={videoSource}
                    onInterpretationReady={handleInterpretationReady}
                    onPrevious={() => setCurrentStep('captions')}
                  />
                </motion.div>
              )}
              
              {currentStep === 'export' && videoSource && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ExportStep 
                    videoSource={videoSource}
                    interpretations={interpretations}
                    onPrevious={() => setCurrentStep('interpretation')}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppPage;
