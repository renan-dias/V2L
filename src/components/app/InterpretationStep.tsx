
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Subtitle, formatTime } from '@/services/subtitleService';
import { convertTextToLibras, InterpretationResult } from '@/services/geminiService';
import { Pencil, Save, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface InterpretationStepProps {
  subtitles: Subtitle[];
  videoSource: string;
  onInterpretationReady: (interpretations: InterpretationResult[]) => void;
  onPrevious: () => void;
}

const InterpretationStep: React.FC<InterpretationStepProps> = ({ 
  subtitles,
  videoSource,
  onInterpretationReady,
  onPrevious
}) => {
  const [interpretations, setInterpretations] = useState<InterpretationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    const generateInterpretations = async () => {
      try {
        setIsLoading(true);
        
        // Simulate progress updates
        const totalSteps = subtitles.length;
        let currentStep = 0;
        
        const updateProgress = () => {
          currentStep += 1;
          const newProgress = (currentStep / totalSteps) * 100;
          setProgress(newProgress > 95 ? 95 : newProgress);
        };
        
        // Initial progress update
        setProgress(5);
        
        // Process in smaller batches to show progress
        const batchSize = 3;
        const results: InterpretationResult[] = [];
        
        for (let i = 0; i < subtitles.length; i += batchSize) {
          const batch = subtitles.slice(i, i + batchSize);
          
          // Process the batch
          const batchResults = await convertTextToLibras(batch);
          results.push(...batchResults);
          
          // Update progress for each batch
          updateProgress();
          
          // Artificial delay for UI
          if (i + batchSize < subtitles.length) {
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        }
        
        // Set final progress and update state
        setProgress(100);
        
        setTimeout(() => {
          setInterpretations(results);
          setIsLoading(false);
          
          toast({
            title: "Interpretação concluída!",
            description: `Foram geradas ${results.length} interpretações em Libras.`,
          });
        }, 1000);
        
      } catch (error) {
        console.error("Error generating interpretations:", error);
        setIsLoading(false);
        
        toast({
          title: "Erro na interpretação",
          description: "Não foi possível gerar as interpretações em Libras.",
          variant: "destructive",
        });
      }
    };
    
    generateInterpretations();
  }, [subtitles, toast]);
  
  const handleEdit = (interpretation: InterpretationResult) => {
    setEditingId(interpretation.subtitleId);
    setEditedText(interpretation.librasInterpretation);
  };
  
  const handleSaveEdit = () => {
    if (editingId !== null) {
      setInterpretations(prev => 
        prev.map(item => 
          item.subtitleId === editingId ? { ...item, librasInterpretation: editedText } : item
        )
      );
      setEditingId(null);
      setEditedText('');
      
      toast({
        title: "Interpretação atualizada",
        description: "A interpretação em Libras foi atualizada com sucesso.",
      });
    }
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedText('');
  };
  
  const handleContinue = () => {
    onInterpretationReady(interpretations);
  };
  
  return (
    <div className="space-y-6">
      {isLoading ? (
        <motion.div 
          className="p-8 rounded-lg bg-white shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4">Gerando interpretações em Libras...</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <motion.div 
              className="bg-primary h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-gray-600">
            Estamos utilizando IA para gerar interpretações em Libras para cada legenda.
            Isso pode levar alguns minutos.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Interpretações em Libras</h3>
              <p className="text-sm text-gray-500">{interpretations.length} interpretações geradas</p>
            </div>
            
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {interpretations.map((interpretation) => (
                <motion.div 
                  key={interpretation.subtitleId}
                  className="p-4 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-gray-500">
                      {formatTime(interpretation.startTime)} - {formatTime(interpretation.endTime)}
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(interpretation)}
                      disabled={editingId !== null}
                    >
                      <Pencil size={14} />
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Texto original:</p>
                    <p className="border-l-2 border-gray-300 pl-3 py-1 text-gray-700">
                      {interpretation.originalText}
                    </p>
                  </div>
                  
                  {editingId === interpretation.subtitleId ? (
                    <div className="mt-3 space-y-3">
                      <Textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="mr-1" /> Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveEdit}
                        >
                          <Save size={16} className="mr-1" /> Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-blue-500">
                        <ArrowRight size={16} />
                      </div>
                      <div className="bg-blue-50 border-l-2 border-blue-400 pl-3 py-2 rounded-r-md">
                        <p className="text-sm font-medium text-blue-700">Interpretação em Libras:</p>
                        <p className="text-gray-700">{interpretation.librasInterpretation}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={onPrevious}
            >
              Voltar
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={isLoading || interpretations.length === 0}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Continuar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default InterpretationStep;
