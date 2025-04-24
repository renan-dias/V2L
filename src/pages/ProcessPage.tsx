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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  DEFAULT_SYSTEM_PROMPT, 
  PROMPT_SUGGESTIONS, 
  InterpretationResult 
} from '@/services/geminiService';

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
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [interpretations, setInterpretations] = useState<InterpretationResult[]>([]);
  const [selectedInterpretation, setSelectedInterpretation] = useState<InterpretationResult | null>(null);
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const { toast } = useToast();

  // Carregar as legendas e gerar interpretações ao montar o componente
  useEffect(() => {
    const loadSubtitles = async () => {
      try {
        // Em um cenário real, carregaríamos as legendas do projeto
        // Por agora, usamos dados de exemplo
        const sampleSubtitles = [
          { id: '1', startTime: 0, endTime: 3, text: 'Olá, este é um vídeo de demonstração.' },
          { id: '2', startTime: 4, endTime: 7, text: 'Aqui mostramos como funciona o processo de conversão.' },
          { id: '3', startTime: 8, endTime: 12, text: 'As legendas são geradas automaticamente com IA.' }
        ];
        setSubtitles(sampleSubtitles);
        
        // Iniciar o processamento das interpretações
        setStatus('processing');
        
        // Simular o progresso de processamento
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev < 90) {
              return prev + 5;
            }
            return prev;
          });
        }, 300);

        // Gerar interpretações para cada legenda
        try {
          // Em um cenário real, chamaríamos a API do Gemini
          // Por agora, simulamos o resultado
          const results: InterpretationResult[] = sampleSubtitles.map(subtitle => ({
            subtitleId: subtitle.id,
            startTime: subtitle.startTime,
            endTime: subtitle.endTime,
            originalText: subtitle.text,
            librasInterpretation: simplifyText(subtitle.text),
            prompt: DEFAULT_SYSTEM_PROMPT
          }));
          
          setInterpretations(results);
          setProgress(100);
          setStatus('completed');
          clearInterval(interval);
        } catch (error) {
          console.error('Erro ao gerar interpretações:', error);
          toast({
            title: "Erro",
            description: "Não foi possível gerar as interpretações em Libras.",
            variant: "destructive",
          });
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Erro ao carregar legendas:', error);
      }
    };

    loadSubtitles();
  }, [toast]);

  // Função auxiliar para simplificar texto (simulando o que o Gemini faria)
  const simplifyText = (text: string): string => {
    // Remover artigos, preposições e simplificar a estrutura
    return text
      .replace(/\b(o|a|os|as|um|uma|uns|umas)\b/gi, '')
      .replace(/\b(de|da|do|das|dos|em|na|no|nas|nos|por|para|com)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleOpenPromptDialog = (interpretation: InterpretationResult) => {
    setSelectedInterpretation(interpretation);
    setCustomPrompt(interpretation.prompt || DEFAULT_SYSTEM_PROMPT);
    setIsPromptDialogOpen(true);
  };

  const handleApplyCustomPrompt = async () => {
    if (!selectedInterpretation || !customPrompt.trim()) return;
    
    setIsProcessingPrompt(true);
    
    try {
      // Em um cenário real, chamaríamos a API do Gemini com o prompt personalizado
      // Por agora, simulamos o resultado
      const updatedInterpretation: InterpretationResult = {
        ...selectedInterpretation,
        librasInterpretation: `[${customPrompt.length % 5 === 0 ? 'Muito simplificado' : 'Versão concisa'}]: ${simplifyText(selectedInterpretation.originalText)}`,
        prompt: customPrompt
      };
      
      // Atualizar a lista de interpretações
      setInterpretations(prev => 
        prev.map(item => 
          item.subtitleId === selectedInterpretation.subtitleId ? updatedInterpretation : item
        )
      );
      
      toast({
        title: "Prompt aplicado",
        description: "A interpretação foi atualizada com sucesso.",
      });
      
      setIsPromptDialogOpen(false);
    } catch (error) {
      console.error('Erro ao aplicar prompt personalizado:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a nova interpretação.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPrompt(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Interpretação</h2>
            <p className="text-sm text-gray-500">Conversão do texto para Libras</p>
          </div>
        </div>
        
        <div className="py-4">
          {status === 'processing' && (
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-gray-500">
                {progress}% concluído - Gerando interpretações em Libras
              </p>
            </div>
          )}
          
          {status === 'completed' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="border rounded-lg p-3 bg-gray-50">
                  <h3 className="text-sm font-medium mb-2">Instruções</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    Abaixo estão as interpretações em Libras geradas para cada legenda. 
                    Você pode ajustar qualquer interpretação clicando no botão "Ajustar".
                  </p>
                </div>
                
                {interpretations.map((interpretation) => {
                  const subtitle = subtitles.find(s => s.id === interpretation.subtitleId);
                  if (!subtitle) return null;
                  
                  return (
                    <div key={interpretation.subtitleId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="text-xs text-gray-500 mb-1">
                          {Math.floor(subtitle.startTime / 60)}:{(subtitle.startTime % 60).toString().padStart(2, '0')} - 
                          {Math.floor(subtitle.endTime / 60)}:{(subtitle.endTime % 60).toString().padStart(2, '0')}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenPromptDialog(interpretation)}
                        >
                          Ajustar
                        </Button>
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Texto original:</p>
                          <p className="text-sm">{interpretation.originalText}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500">Interpretação em Libras:</p>
                          <p className="text-sm font-medium">{interpretation.librasInterpretation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Button 
                onClick={onNext} 
                className="w-full"
              >
                Continuar para Exportação
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajustar Interpretação em Libras</DialogTitle>
            <DialogDescription>
              Personalize o prompt para gerar uma interpretação mais adequada para Libras.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Texto original:</h4>
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                {selectedInterpretation?.originalText || ''}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Interpretação atual:</h4>
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                {selectedInterpretation?.librasInterpretation || ''}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="prompt">Prompt personalizado:</Label>
                <Select 
                  onValueChange={(value) => {
                    const suggestion = PROMPT_SUGGESTIONS.find(s => s.name === value);
                    if (suggestion) {
                      setCustomPrompt(suggestion.prompt);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROMPT_SUGGESTIONS.map(suggestion => (
                      <SelectItem key={suggestion.name} value={suggestion.name}>
                        {suggestion.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Textarea
                id="prompt"
                placeholder="Digite instruções detalhadas de como a IA deve adaptar o texto para Libras..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-gray-500">
                Escreva instruções claras para a IA sobre como adaptar o texto para Libras.
                Seja específico sobre a estrutura, simplicidade e quais elementos manter ou remover.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromptDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApplyCustomPrompt} disabled={isProcessingPrompt}>
              {isProcessingPrompt ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                  Processando...
                </>
              ) : (
                'Aplicar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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