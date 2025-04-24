
import React from 'react';
import { Upload, MessageSquare, Edit, Video, Download } from 'lucide-react';

const steps = [
  {
    icon: <Upload className="h-10 w-10 text-white" />,
    title: "Upload de Vídeo",
    description: "Carregue seu vídeo MP4 ou informe a URL do YouTube",
    color: "bg-primary"
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-white" />,
    title: "Extração de Legendas",
    description: "Legendas são extraídas automaticamente do vídeo",
    color: "bg-secondary"
  },
  {
    icon: <Edit className="h-10 w-10 text-white" />,
    title: "Edição e Revisão",
    description: "Edite as legendas conforme necessário para maior precisão",
    color: "bg-accent"
  },
  {
    icon: <Video className="h-10 w-10 text-white" />,
    title: "Geração de Libras",
    description: "Tradução automática das legendas para Língua Brasileira de Sinais",
    color: "bg-primary"
  },
  {
    icon: <Download className="h-10 w-10 text-white" />,
    title: "Finalização",
    description: "Exporte seu vídeo com intérprete de Libras incorporado",
    color: "bg-secondary"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50" id="como-funciona">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nosso processo em 5 etapas simples para transformar seus vídeos em conteúdo acessível em Libras
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row mb-8 md:mb-16 items-center">
              <div className={`order-1 md:order-${index % 2 === 0 ? '1' : '3'} w-full md:w-1/2 px-4 mb-6 md:mb-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              <div className="order-2 z-10 flex justify-center">
                <div className={`${step.color} rounded-full p-4 shadow-lg`}>
                  {step.icon}
                </div>
              </div>
              
              <div className={`order-3 md:order-${index % 2 === 0 ? '3' : '1'} w-full md:w-1/2 px-4 mt-6 md:mt-0 md:invisible`}>
                {/* Placeholder for layout balance */}
                <h3 className="text-2xl font-semibold mb-2 opacity-0">{step.title}</h3>
                <p className="text-gray-600 opacity-0">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
