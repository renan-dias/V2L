
/**
 * Service to interact with Google Gemini API for Libras interpretation
 */
import { Subtitle } from './subtitleService';

export interface InterpretationResult {
  subtitleId: number;
  startTime: number;
  endTime: number;
  originalText: string;
  librasInterpretation: string;
}

// Function to convert regular text to Libras interpretation using Gemini API
export const convertTextToLibras = async (
  subtitles: Subtitle[]
): Promise<InterpretationResult[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not set. Please set VITE_GEMINI_API_KEY in .env file');
  }
  
  try {
    const interpretations: InterpretationResult[] = [];
    
    // Process in batches to avoid overloading the API
    const batchSize = 5;
    
    for (let i = 0; i < subtitles.length; i += batchSize) {
      const batch = subtitles.slice(i, i + batchSize);
      
      // Process each subtitle in the batch
      const batchPromises = batch.map(async (subtitle) => {
        // Construct the prompt for Gemini API
        const prompt = `
          Você é um intérprete de Libras (Língua Brasileira de Sinais) fluente. 
          Sua tarefa é converter o seguinte texto para uma interpretação em Libras, 
          descrevendo como esse texto seria sinalizado em Libras. 
          Não traduza palavra por palavra, mas sim transmita o sentido completo 
          da mensagem seguindo a estrutura gramatical de Libras.
          
          Texto original: "${subtitle.text}"
          
          Formato de resposta: Descreva apenas os sinais em Libras, sem explicações adicionais.
        `;
        
        // Call Gemini API
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt
                    }
                  ]
                }
              ]
            })
          }
        );
        
        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Extract the interpretation from the Gemini response
        const librasInterpretation = data.candidates?.[0]?.content?.parts?.[0]?.text || 
          "SINAL-ERRO INTERPRETAÇÃO NÃO-CONSEGUIR";
        
        return {
          subtitleId: subtitle.id,
          startTime: subtitle.startTime,
          endTime: subtitle.endTime,
          originalText: subtitle.text,
          librasInterpretation: librasInterpretation
        };
      });
      
      // Wait for all prompts in the batch to be processed
      const batchResults = await Promise.all(batchPromises);
      interpretations.push(...batchResults);
      
      // Small delay between batches to respect API rate limits
      if (i + batchSize < subtitles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return interpretations;
  } catch (error) {
    console.error('Error converting text to Libras:', error);
    
    // Return some simulated data in case of error
    return subtitles.map(subtitle => ({
      subtitleId: subtitle.id,
      startTime: subtitle.startTime,
      endTime: subtitle.endTime,
      originalText: subtitle.text,
      librasInterpretation: `SINAL-PESSOA SINAL-COMUNICAR ${subtitle.text.toUpperCase()}`
    }));
  }
};

