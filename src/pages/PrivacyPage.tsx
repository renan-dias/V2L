import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
            
            <div className="prose prose-lg">
              <h2>1. Coleta de Informações</h2>
              <p>
                Coletamos as seguintes informações quando você usa o Video 2 Libras:
              </p>
              <ul>
                <li>Informações da sua conta Google (nome, email, foto de perfil)</li>
                <li>Vídeos que você faz upload</li>
                <li>Legendas e interpretações geradas</li>
                <li>Dados de uso do serviço</li>
              </ul>

              <h2>2. Uso das Informações</h2>
              <p>
                Usamos suas informações para:
              </p>
              <ul>
                <li>Fornecer e melhorar o serviço</li>
                <li>Processar seus vídeos e gerar interpretações em Libras</li>
                <li>Comunicar-se com você sobre o serviço</li>
                <li>Proteger contra uso indevido</li>
              </ul>

              <h2>3. Armazenamento de Dados</h2>
              <p>
                Seus dados são armazenados de forma segura no Firebase, seguindo as melhores
                práticas de segurança. Mantemos seus dados apenas pelo tempo necessário para
                fornecer o serviço.
              </p>

              <h2>4. Compartilhamento de Dados</h2>
              <p>
                Não compartilhamos suas informações pessoais com terceiros, exceto quando:
              </p>
              <ul>
                <li>Necessário para fornecer o serviço (ex: VLibras, Gemini API)</li>
                <li>Exigido por lei</li>
                <li>Com seu consentimento explícito</li>
              </ul>

              <h2>5. Seus Direitos</h2>
              <p>
                Você tem o direito de:
              </p>
              <ul>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações imprecisas</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Exportar seus dados</li>
              </ul>

              <h2>6. Cookies</h2>
              <p>
                Usamos cookies para melhorar sua experiência no site. Para mais detalhes,
                consulte nossa Política de Cookies.
              </p>

              <h2>7. Segurança</h2>
              <p>
                Implementamos medidas de segurança para proteger suas informações, incluindo:
              </p>
              <ul>
                <li>Criptografia de dados</li>
                <li>Autenticação segura</li>
                <li>Monitoramento de segurança</li>
                <li>Backups regulares</li>
              </ul>

              <h2>8. Alterações na Política</h2>
              <p>
                Podemos atualizar esta política periodicamente. Notificaremos você sobre
                alterações significativas por email ou através do site.
              </p>

              <h2>9. Contato</h2>
              <p>
                Para questões sobre privacidade, entre em contato através do email:
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

export default PrivacyPage; 