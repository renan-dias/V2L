import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const CookiesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Política de Cookies</h1>
            
            <div className="prose prose-lg">
              <h2>1. O que são Cookies?</h2>
              <p>
                Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo
                quando você visita nosso site. Eles nos ajudam a melhorar sua experiência de
                navegação e a fornecer serviços personalizados.
              </p>

              <h2>2. Tipos de Cookies que Utilizamos</h2>
              <p>
                Utilizamos os seguintes tipos de cookies:
              </p>
              <ul>
                <li>
                  <strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site
                </li>
                <li>
                  <strong>Cookies de Autenticação:</strong> Mantêm você logado durante sua sessão
                </li>
                <li>
                  <strong>Cookies de Preferências:</strong> Lembram suas configurações e preferências
                </li>
                <li>
                  <strong>Cookies Analíticos:</strong> Nos ajudam a entender como você usa o site
                </li>
              </ul>

              <h2>3. Como Usamos os Cookies</h2>
              <p>
                Usamos cookies para:
              </p>
              <ul>
                <li>Manter você logado</li>
                <li>Lembrar suas preferências</li>
                <li>Melhorar a performance do site</li>
                <li>Analisar o uso do site</li>
                <li>Personalizar sua experiência</li>
              </ul>

              <h2>4. Cookies de Terceiros</h2>
              <p>
                Alguns cookies são colocados por serviços de terceiros que utilizamos:
              </p>
              <ul>
                <li>Google Analytics (análise de uso)</li>
                <li>Firebase (autenticação e armazenamento)</li>
                <li>VLibras (acessibilidade)</li>
              </ul>

              <h2>5. Controle de Cookies</h2>
              <p>
                Você pode controlar e gerenciar cookies através das configurações do seu navegador.
                No entanto, desabilitar certos cookies pode afetar a funcionalidade do site.
              </p>

              <h2>6. Atualizações</h2>
              <p>
                Podemos atualizar esta política periodicamente. Recomendamos que você a revise
                regularmente para se manter informado sobre como usamos cookies.
              </p>

              <h2>7. Contato</h2>
              <p>
                Para questões sobre cookies, entre em contato através do email:
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

export default CookiesPage; 