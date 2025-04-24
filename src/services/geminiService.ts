
/**
 * Service to interact with Google Gemini API for Libras interpretation
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Subtitle } from './subtitleService';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

export interface InterpretationResult {
  subtitleId: string;
  startTime: number;
  endTime: number;
  librasInterpretation: string;
}

const SYSTEM_PROMPT = `Você é um especialista em Língua Brasileira de Sinais (Libras).
Sua tarefa é converter o texto em português para uma interpretação em Libras.
Considere:
1. A gramática específica da Libras
2. Os sinais mais apropriados para cada conceito
3. A estrutura espacial da Libras
4. Os classificadores quando necessário
5. A expressão facial e corporal adequada

Forneça a interpretação em um formato que possa ser usado pelo VLibras.`;

export const convertTextToLibras = async (subtitles: Subtitle[]): Promise<InterpretationResult[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const results: InterpretationResult[] = [];
    
    for (const subtitle of subtitles) {
      const prompt = `${SYSTEM_PROMPT}\n\nTexto: "${subtitle.text}"\n\nInterpretação em Libras:`;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      results.push({
        subtitleId: subtitle.id,
        startTime: subtitle.startTime,
        endTime: subtitle.endTime,
        librasInterpretation: text.trim()
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error converting text to Libras:', error);
    throw error;
  }
};
