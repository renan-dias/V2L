import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, AlertCircle, Info, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { createProject } from '@/services/projectService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isStorageConfigured } from '@/lib/firebase';
import FirebaseConfigHelp from '@/components/FirebaseConfigHelp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { validateYouTubeUrl, getVideoInfo } from '@/services/youtubeService';

const ConverterPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'youtube'>('upload');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar o tipo e tamanho do arquivo
      if (!file.type.startsWith('video/')) {
        setError('Por favor, selecione um arquivo de vídeo válido.');
        return;
      }
      
      // Limite de 100MB
      const maxSize = 100 * 1024 * 1024; // 100MB em bytes
      if (file.size > maxSize) {
        setError('O arquivo é muito grande. O tamanho máximo permitido é 100MB.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Sugerir um título baseado no nome do arquivo
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleYoutubeUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setYoutubeUrl(url);
    setError(null);

    if (url && !validateYouTubeUrl(url)) {
      setError('Por favor, insira uma URL válida do YouTube');
      return;
    }

    // Se a URL for válida e não houver título definido, tente usar o ID do vídeo como título
    if (url && !title) {
      const videoInfo = getVideoInfo(url);
      if (videoInfo) {
        setTitle(`YouTube-${videoInfo.id}`);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    // Validar se temos um arquivo ou URL do YouTube
    if (activeTab === 'upload' && !selectedFile) {
      setError('Por favor, selecione um arquivo de vídeo');
      return;
    }

    if (activeTab === 'youtube' && !youtubeUrl) {
      setError('Por favor, insira uma URL do YouTube');
      return;
    }

    if (activeTab === 'youtube' && !validateYouTubeUrl(youtubeUrl)) {
      setError('Por favor, insira uma URL válida do YouTube');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let project;

      if (activeTab === 'upload') {
        // Lógica existente para upload de arquivo
        if (!selectedFile) return;
        
        if (!selectedFile.type.startsWith('video/')) {
          throw new Error('Por favor, selecione um arquivo de vídeo válido.');
        }

        if (selectedFile.size === 0) {
          throw new Error('O arquivo de vídeo parece estar corrompido ou vazio.');
        }

        if (!isStorageConfigured) {
          throw new Error('O Firebase Storage não está configurado corretamente.');
        }

        project = await createProject(user.uid, title, selectedFile);
      } else {
        // Lógica para URL do YouTube
        const videoInfo = getVideoInfo(youtubeUrl);
        if (!videoInfo) {
          throw new Error('URL do YouTube inválida');
        }

        project = await createProject(user.uid, title, null, videoInfo);
      }

      toast({
        title: "Projeto criado com sucesso!",
        description: "Redirecionando para o fluxo de processamento.",
      });

      navigate(`/app/process/${project.id}`);
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      
      // Tratamento específico para erros de permissão
      if (error.code === 'permission-denied' || 
          error.code === 'storage/unauthorized' || 
          error.message?.includes('permission') || 
          error.message?.includes('permissions') ||
          error.message?.includes('unauthorized') ||
          error.message?.includes('Missing or insufficient permissions')) {
        
        const permissionError = 'Erro de permissão: Você não tem permissão para fazer upload de vídeos. Verifique se você está autenticado e se o Firebase está configurado corretamente.';
        setError(permissionError);
        
        toast({
          title: "Erro de permissão",
          description: permissionError,
          variant: "destructive",
        });
        
        // Log detalhado para ajudar no debugging
        console.error('Detalhes do erro de permissão:', {
          errorCode: error.code,
          errorMessage: error.message,
          userAuth: !!user,
          userId: user?.uid,
          fileName: selectedFile?.name,
          fileSize: selectedFile?.size,
        });
        
        setIsUploading(false);
        return;
      }
      
      // Mensagem de erro mais específica para outros tipos de erro
      const errorMessage = error.message?.includes('Firebase') 
        ? 'Erro de conexão com o servidor. Verifique sua conexão com a internet e tente novamente.'
        : error.message || 'Ocorreu um erro ao fazer upload do vídeo. Por favor, tente novamente.';
      
      setError(errorMessage);
      toast({
        title: "Erro ao criar projeto",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Função para lidar com arquivos arrastados
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Validar o tipo e tamanho do arquivo
      if (!file.type.startsWith('video/')) {
        setError('Por favor, selecione um arquivo de vídeo válido.');
        return;
      }
      
      // Limite de 100MB
      const maxSize = 100 * 1024 * 1024; // 100MB em bytes
      if (file.size > maxSize) {
        setError('O arquivo é muito grande. O tamanho máximo permitido é 100MB.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Sugerir um título baseado no nome do arquivo
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Converter Vídeo para Libras</h1>
          {(!isStorageConfigured || error) && <FirebaseConfigHelp />}
        </div>
        
        {!isStorageConfigured && (
          <Alert variant="warning" className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Modo de demonstração</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>O aplicativo está rodando em modo de demonstração. O upload de vídeo pode não funcionar corretamente.
              Configure o Firebase para utilizar todas as funcionalidades.</p>
              <p className="text-xs">Consulte o arquivo <span className="font-mono">firebase-config.example</span> para instruções detalhadas.</p>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Como funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">1</span>
                </div>
                <h3 className="font-medium mb-2">Upload do Vídeo</h3>
                <p className="text-sm text-gray-600">
                  Faça upload do seu vídeo (máx. 100MB)
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">2</span>
                </div>
                <h3 className="font-medium mb-2">Processamento</h3>
                <p className="text-sm text-gray-600">
                  Nosso sistema processa e converte o conteúdo
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">3</span>
                </div>
                <h3 className="font-medium mb-2">Resultado</h3>
                <p className="text-sm text-gray-600">
                  Receba seu vídeo com interpretação em Libras
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Título do Projeto</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite um título para seu projeto"
                  required
                />
              </div>

              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'youtube')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload de Arquivo</TabsTrigger>
                  <TabsTrigger value="youtube">URL do YouTube</TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="video"
                      className="hidden"
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="video"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {selectedFile
                          ? `Arquivo selecionado: ${selectedFile.name}`
                          : 'Clique para selecionar ou arraste um arquivo de vídeo'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Formatos suportados: MP4, AVI, MOV, WMV (máx. 100MB)
                      </span>
                    </label>
                  </div>
                </TabsContent>

                <TabsContent value="youtube">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                      <Input
                        type="url"
                        placeholder="Cole a URL do vídeo do YouTube aqui"
                        value={youtubeUrl}
                        onChange={handleYoutubeUrlChange}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Exemplo: https://www.youtube.com/watch?v=exemplo
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                type="submit"
                className="w-full"
                disabled={isUploading || (activeTab === 'upload' ? !selectedFile : !youtubeUrl)}
              >
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                    Enviando...
                  </>
                ) : (
                  'Iniciar Conversão'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConverterPage; 