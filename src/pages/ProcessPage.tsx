import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { Project } from '@/types/project';
import { Subtitle } from '@/types/subtitle';
import { getProject } from '@/services/projectService';
import { Upload, FileText, MessageSquare, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Componente para o passo de Upload
const UploadStep: React.FC<{ project: Project; onNext: () => void }> = ({ project, onNext }) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Upload de Arquivo</h2>
            <p className="text-sm text-gray-500">Seu vídeo foi carregado com sucesso</p>
          </div>
        </div>
        
        {project.metadata && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Nome do arquivo</p>
              <p className="font-medium">{project.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tamanho</p>
              <p className="font-medium">{(project.metadata.size ? (project.metadata.size / (1024 * 1024)).toFixed(2) : '0')}MB</p>
            </div>
            {project.metadata.format && (
              <div>
                <p className="text-sm text-gray-500">Formato</p>
                <p className="font-medium">{project.metadata.format.split('/')[1].toUpperCase()}</p>
              </div>
            )}
            {project.metadata.duration && (
              <div>
                <p className="text-sm text-gray-500">Duração</p>
                <p className="font-medium">{Math.floor(project.metadata.duration / 60)}:{(project.metadata.duration % 60).toString().padStart(2, '0')}</p>
              </div>
            )}
          </div>
        )}
        
        <Button onClick={onNext} className="w-full">
          Continuar para Legendas
        </Button>
      </div>
    </Card>
  );
};

// Componente para o passo de Legendas
const SubtitlesStep: React.FC<{ project: Project; onNext: () => void }> = ({ project, onNext }) => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento de legendas
    const timer = setTimeout(() => {
      setSubtitles([
        { id: '1', startTime: 0, endTime: 3, text: 'Olá, este é um vídeo de demonstração.' },
        { id: '2', startTime: 4, endTime: 7, text: 'Aqui mostramos como funciona o processo de conversão.' },
        { id: '3', startTime: 8, endTime: 12, text: 'As legendas são geradas automaticamente com IA.' }
      ]);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Legendas</h2>
            <p className="text-sm text-gray-500">Revise e edite as legendas geradas automaticamente</p>
          </div>
        </div>
        
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Gerando legendas...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto border rounded-lg p-4">
              {subtitles.map(subtitle => (
                <div key={subtitle.id} className="mb-3 p-2 hover:bg-gray-50 rounded">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>
                      {Math.floor(subtitle.startTime / 60)}:{(subtitle.startTime % 60).toString().padStart(2, '0')} - 
                      {Math.floor(subtitle.endTime / 60)}:{(subtitle.endTime % 60).toString().padStart(2, '0')}
                    </span>
                    <button className="text-blue-500 hover:text-blue-700">Editar</button>
                  </div>
                  <p>{subtitle.text}</p>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                Baixar SRT
              </Button>
              <Button onClick={onNext} className="flex-1">
                Continuar para Interpretação
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Componente para o passo de Interpretação
const InterpretationStep: React.FC<{ project: Project; onNext: () => void }> = ({ project, onNext }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

  useEffect(() => {
    // Simulação de processamento
    setStatus('processing');
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setStatus('completed');
          return 100;
        }
        return newProgress;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Interpretação</h2>
            <p className="text-sm text-gray-500">Conversão para Libras em andamento</p>
          </div>
        </div>
        
        <div className="py-6">
          {status === 'processing' && (
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-gray-500">
                {progress}% concluído - Por favor, aguarde enquanto processamos seu vídeo
              </p>
            </div>
          )}
          
          {status === 'completed' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-medium">Interpretação concluída com sucesso!</p>
              <p className="text-sm text-gray-500">
                Seu vídeo com interpretação em Libras está pronto para exportação
              </p>
            </div>
          )}
        </div>
        
        <Button 
          onClick={onNext} 
          disabled={status !== 'completed'} 
          className="w-full"
        >
          Continuar para Exportação
        </Button>
      </div>
    </Card>
  );
};

// Componente para o passo de Exportação
const ExportStep: React.FC<{ project: Project; onFinish: () => void }> = ({ project, onFinish }) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Exportar</h2>
            <p className="text-sm text-gray-500">Baixe seu vídeo com interpretação em Libras</p>
          </div>
        </div>
        
        <div className="p-6 border rounded-lg bg-gray-50">
          <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
            {project.librasVideoUrl ? (
              <video 
                controls 
                className="w-full h-full rounded-lg"
                src={project.librasVideoUrl}
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
            ) : (
              <p className="text-white">Prévia não disponível</p>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome do projeto</p>
                <p className="font-medium">{project.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de criação</p>
                <p className="font-medium">
                  {new Intl.DateTimeFormat('pt-BR').format(project.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Baixar Vídeo
              </Button>
              <Button className="flex-1" onClick={onFinish}>
                Concluir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ProcessPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeStep, setActiveStep] = useState('upload');
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || !user) return;
      try {
        const projectData = await getProject(projectId);
        if (projectData.userId !== user.uid) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar este projeto.",
            variant: "destructive",
          });
          navigate('/app/dashboard');
          return;
        }
        setProject(projectData);
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o projeto.",
          variant: "destructive",
        });
        navigate('/app/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, user, toast, navigate]);

  const handleNext = (step: string) => {
    setActiveStep(step);
  };

  const handleFinish = () => {
    navigate('/app/dashboard');
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Projeto não encontrado</h2>
          <p className="text-gray-500 mb-4">O projeto solicitado não existe ou foi removido.</p>
          <Button onClick={() => navigate('/app/dashboard')}>
            Voltar para Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Fluxo de Trabalho</h1>
          <p className="text-gray-500">Etapa {
            activeStep === 'upload' ? '1' : 
            activeStep === 'subtitles' ? '2' : 
            activeStep === 'interpretation' ? '3' : '4'
          } de 4</p>
        </div>
        
        <div className="mb-6">
          <Progress value={
            activeStep === 'upload' ? 25 : 
            activeStep === 'subtitles' ? 50 : 
            activeStep === 'interpretation' ? 75 : 100
          } className="h-2" />
          
          <div className="grid grid-cols-4 mt-2 text-sm">
            <div className={`text-center ${activeStep === 'upload' ? 'text-primary font-medium' : ''}`}>
              Upload
            </div>
            <div className={`text-center ${activeStep === 'subtitles' ? 'text-primary font-medium' : ''}`}>
              Legendas
            </div>
            <div className={`text-center ${activeStep === 'interpretation' ? 'text-primary font-medium' : ''}`}>
              Interpretação
            </div>
            <div className={`text-center ${activeStep === 'export' ? 'text-primary font-medium' : ''}`}>
              Exportar
            </div>
          </div>
        </div>
        
        <Tabs value={activeStep} className="w-full">
          <TabsContent value="upload">
            <UploadStep 
              project={project} 
              onNext={() => handleNext('subtitles')} 
            />
          </TabsContent>
          
          <TabsContent value="subtitles">
            <SubtitlesStep 
              project={project}
              onNext={() => handleNext('interpretation')}
            />
          </TabsContent>
          
          <TabsContent value="interpretation">
            <InterpretationStep 
              project={project}
              onNext={() => handleNext('export')}
            />
          </TabsContent>
          
          <TabsContent value="export">
            <ExportStep 
              project={project}
              onFinish={handleFinish}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProcessPage; 