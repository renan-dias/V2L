import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { createProject } from '@/services/projectService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isStorageConfigured } from '@/lib/firebase';

const ConverterPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setError(null);

    try {
      // Verificação adicional do arquivo antes de enviar
      if (!selectedFile.type.startsWith('video/')) {
        throw new Error('Por favor, selecione um arquivo de vídeo válido.');
      }

      // Verificar se o arquivo não está corrompido
      if (selectedFile.size === 0) {
        throw new Error('O arquivo de vídeo parece estar corrompido ou vazio.');
      }

      const project = await createProject(user.uid, title, selectedFile);
      
      toast({
        title: "Projeto criado com sucesso!",
        description: "Redirecionando para o fluxo de processamento.",
      });

      // Redirecionar para a página de processamento
      navigate(`/app/process/${project.id}`);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      // Mensagem de erro mais específica
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
        <h1 className="text-2xl font-bold mb-6">Converter Vídeo para Libras</h1>
        
        {!isStorageConfigured && (
          <Alert variant="warning" className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Modo de demonstração</AlertTitle>
            <AlertDescription>
              O aplicativo está rodando em modo de demonstração. O upload de vídeo pode não funcionar corretamente.
              Configure o Firebase para utilizar todas as funcionalidades.
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

              <div className="space-y-2">
                <Label htmlFor="video">Arquivo de Vídeo</Label>
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
                    required
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
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedFile || isUploading}
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