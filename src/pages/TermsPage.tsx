import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o V2L, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
            </p>

            <h2>2. Descrição do Serviço</h2>
            <p>
              O V2L é uma plataforma que oferece serviços de tradução automática de vídeos para Língua Brasileira de Sinais (Libras).
            </p>

            <h2>3. Uso do Serviço</h2>
            <p>
              Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.
              Você é responsável por todo o conteúdo que enviar através da plataforma.
            </p>

            <h2>4. Propriedade Intelectual</h2>
            <p>
              Você mantém todos os direitos sobre o conteúdo que enviar à plataforma.
              Ao usar nosso serviço, você nos concede uma licença limitada para processar seu conteúdo.
            </p>

            <h2>5. Privacidade</h2>
            <p>
              O uso de suas informações pessoais é governado por nossa{' '}
              <Link to="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>

            <h2>6. Limitação de Responsabilidade</h2>
            <p>
              O V2L não garante a precisão absoluta das traduções automáticas.
              Usuários são aconselhados a revisar o conteúdo traduzido antes do uso.
            </p>

            <h2>7. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento.
              Alterações significativas serão notificadas aos usuários.
            </p>

            <h2>8. Contato</h2>
            <p>
              Para questões relacionadas a estes termos, entre em contato através de nossos canais de suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 