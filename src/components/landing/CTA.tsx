
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-primary to-secondary text-white">
              <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
              <p className="text-white/90 mb-6">
                Experimente agora mesmo o Video 2 Libras e torne seus vídeos acessíveis para milhões de pessoas que utilizam a Língua Brasileira de Sinais.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="h-5 w-5 rounded-full bg-white/20 mr-3 flex items-center justify-center text-white">✓</span>
                  Fácil de usar
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 rounded-full bg-white/20 mr-3 flex items-center justify-center text-white">✓</span>
                  Tradução precisa
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 rounded-full bg-white/20 mr-3 flex items-center justify-center text-white">✓</span>
                  Exporte em alta qualidade
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold mb-4">Comece a converter agora</h3>
              <p className="text-gray-600 mb-6">
                Não é necessário criar uma conta para começar. Experimente nossa ferramenta gratuitamente e veja como é fácil tornar seu conteúdo mais inclusivo.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Link to="/app" className="flex items-center justify-center gap-2 text-lg">
                  Converter Vídeo <ArrowRight size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
