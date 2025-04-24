import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

const ConverterPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // TODO: Implementar lógica de upload e conversão
      console.log('Arquivo selecionado:', selectedFile);
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Redirecionar para página de status após upload
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Converter Vídeo</h1>
      
      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Projeto</Label>
            <Input
              id="title"
              placeholder="Digite um título para seu projeto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Arquivo de Vídeo</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                <span className="animate-spin mr-2">⏳</span>
                Enviando...
              </>
            ) : (
              'Iniciar Conversão'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ConverterPage; 