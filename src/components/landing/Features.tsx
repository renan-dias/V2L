
import React from 'react';
import { Upload, Youtube, Edit, MessageSquare, Video, Download } from 'lucide-react';

const features = [
  {
    icon: <Upload className="h-8 w-8 text-primary" />,
    title: "Carregue seus vídeos",
    description: "Faça upload de arquivos MP4 ou adicione vídeos diretamente do YouTube para começar."
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Extração de legendas",
    description: "Obtenha legendas automaticamente ou edite-as conforme necessário para maior precisão."
  },
  {
    icon: <Edit className="h-8 w-8 text-primary" />,
    title: "Edição inteligente",
    description: "Revise e edite as legendas e traduções para Libras antes de finalizar."
  },
  {
    icon: <Youtube className="h-8 w-8 text-primary" />,
    title: "Integração com YouTube",
    description: "Obtenha vídeos e legendas diretamente do YouTube sem complicações."
  },
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: "Interpretação em Libras",
    description: "Transforme o conteúdo automaticamente para Língua Brasileira de Sinais com VLibras."
  },
  {
    icon: <Download className="h-8 w-8 text-primary" />,
    title: "Exporte facilmente",
    description: "Baixe seu vídeo finalizado com o intérprete de Libras incorporado e pronto para compartilhar."
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-20" id="recursos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos Poderosos e Intuitivos</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Torne seus vídeos acessíveis em Libras com nosso fluxo de trabalho simplificado e recursos avançados
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-blue-50 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
