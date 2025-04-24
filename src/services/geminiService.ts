/**
 * Service to interact with Google Gemini API for Libras interpretation
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Subtitle } from '@/types/subtitle';

// Use import.meta.env instead of process.env for Vite
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface InterpretationResult {
  subtitleId: string;
  startTime: number;
  endTime: number;
  originalText: string;
  librasInterpretation: string;
  prompt?: string; // Prompt utilizado para gerar a interpretação
}

const DEFAULT_SYSTEM_PROMPT = `Você é um especialista em Língua Brasileira de Sinais (Libras).
Sua tarefa é converter o texto em português para uma interpretação concisa em Libras, preservando o significado principal.
Considere:
1. A gramática específica da Libras, que é diferente do português
2. Use uma estrutura mais direta e objetiva (sujeito-verbo-objeto)
3. Elimine artigos, preposições e outras palavras que não são essenciais em Libras
4. Reduza o texto ao essencial sem perder o significado principal
5. Mantenha conceitos e terminologias técnicas importantes
6. Forneça uma versão mais curta e simplificada que possa ser interpretada em Libras

Forneça apenas o texto da interpretação em Libras, sem explicações ou comentários adicionais.`;

export const generateLibrasInterpretation = async (
  subtitle: Subtitle, 
  customPrompt?: string
): Promise<InterpretationResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const systemPrompt = customPrompt || DEFAULT_SYSTEM_PROMPT;
    const prompt = `${systemPrompt}\n\nTexto original: "${subtitle.text}"\n\nInterpretação concisa em Libras:`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const interpretationText = response.text().trim();
    
    return {
      subtitleId: subtitle.id,
      startTime: subtitle.startTime,
      endTime: subtitle.endTime,
      originalText: subtitle.text,
      librasInterpretation: interpretationText,
      prompt: systemPrompt
    };
  } catch (error) {
    console.error('Erro ao gerar interpretação em Libras:', error);
    throw error;
  }
};

export const convertTextToLibras = async (
  subtitles: Subtitle[], 
  customPrompt?: string
): Promise<InterpretationResult[]> => {
  try {
    const results: InterpretationResult[] = [];
    
    for (const subtitle of subtitles) {
      const result = await generateLibrasInterpretation(subtitle, customPrompt);
      results.push(result);
    }
    
    return results;
  } catch (error) {
    console.error('Erro ao converter texto para Libras:', error);
    throw error;
  }
};

// Sugestões de prompts para o usuário
export const PROMPT_SUGGESTIONS = [
  {
    name: "Padrão",
    description: "Cria uma versão mais concisa preservando o significado principal.",
    prompt: DEFAULT_SYSTEM_PROMPT
  },
  {
    name: "Simplificado", 
    description: "Versão extremamente simplificada para frases curtas.",
    prompt: `Simplifique ao máximo esta frase para Libras, mantendo apenas as palavras-chave essenciais para transmitir o significado básico. Elimine todas as palavras não essenciais como artigos, preposições e conjunções. Use a estrutura básica de Libras (sujeito-verbo-objeto) e forneça apenas o resultado final sem comentários adicionais.`
  },
  {
    name: "Técnico",
    description: "Mantém termos técnicos importantes com explicações simples.",
    prompt: `Converta o texto para Libras, mantendo os termos técnicos importantes, mas simplifique as explicações em torno desses termos. Preserve a precisão técnica enquanto torna a estrutura mais adequada para Libras. Elimine palavras não essenciais e forneça apenas o resultado final sem comentários adicionais.`
  },
  {
    name: "Educacional",
    description: "Otimizado para conteúdo educacional, mantendo conceitos-chave.",
    prompt: `Adapte este texto educacional para Libras, mantendo os conceitos-chave e terminologia educacional importante. Simplifique a estrutura para seguir a gramática de Libras, mas preserve os termos e conceitos essenciais para a aprendizagem. Forneça apenas o resultado final sem comentários adicionais.`
  }
];
