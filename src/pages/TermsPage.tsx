import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
            
            <div className="prose prose-lg">
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o Video 2 Libras (V2L), você concorda em cumprir estes termos de uso.
                Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
              </p>

              <h2>2. Descrição do Serviço</h2>
              <p>
                O V2L é uma plataforma que permite converter vídeos em conteúdo acessível através da
                Língua Brasileira de Sinais (Libras), utilizando tecnologias de inteligência artificial
                e o serviço VLibras.
              </p>

              <h2>3. Conta de Usuário</h2>
              <p>
                Para usar o serviço, você precisa criar uma conta usando sua conta Google.
                Você é responsável por manter a confidencialidade de sua conta e por todas as
                atividades que ocorrem sob sua conta.
              </p>

              <h2>4. Uso do Serviço</h2>
              <p>
                Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.
                Você não deve:
              </p>
              <ul>
                <li>Usar o serviço para qualquer propósito ilegal</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Interferir no funcionamento do serviço</li>
                <li>Tentar acessar áreas restritas do serviço</li>
              </ul>

              <h2>5. Conteúdo do Usuário</h2>
              <p>
                Ao fazer upload de vídeos, você mantém seus direitos sobre o conteúdo, mas concede ao
                V2L uma licença para processar e armazenar o conteúdo para fornecer o serviço.
              </p>

              <h2>6. Limitações do Serviço</h2>
              <p>
                O V2L não garante que o serviço será ininterrupto ou livre de erros. A qualidade da
                interpretação em Libras pode variar dependendo do conteúdo do vídeo.
              </p>

              <h2>7. Privacidade</h2>
              <p>
                O uso do V2L está sujeito à nossa Política de Privacidade, que descreve como
                coletamos, usamos e protegemos suas informações.
              </p>

              <h2>8. Modificações</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações
                entrarão em vigor imediatamente após a publicação dos termos atualizados.
              </p>

              <h2>9. Contato</h2>
              <p>
                Para questões sobre estes termos, entre em contato através do email:
                renan.barbono@educacao.mg.gov.br
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage; 