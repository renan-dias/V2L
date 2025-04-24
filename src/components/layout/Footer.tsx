import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4" aria-label="Página inicial">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">V2L</span>
              <span className="text-lg font-semibold">Video 2 Libras</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Tornando seu conteúdo mais acessível através da Língua Brasileira de Sinais (Libras).
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/renan-dias" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-primary transition-colors" 
                aria-label="Visitar nosso GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://edustrial.tech" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-primary transition-colors" 
                aria-label="Visitar nosso site"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2" role="list">
              <li>
                <Link 
                  to="/termos" 
                  className="text-gray-600 hover:text-primary transition-colors"
                  aria-label="Termos de Uso"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacidade" 
                  className="text-gray-600 hover:text-primary transition-colors"
                  aria-label="Política de Privacidade"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="text-gray-600 hover:text-primary transition-colors"
                  aria-label="Política de Cookies"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-2" role="list">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <a 
                  href="mailto:renan.barbono@educacao.mg.gov.br" 
                  className="text-gray-600 hover:text-primary transition-colors"
                  aria-label="Enviar email para renan.barbono@educacao.mg.gov.br"
                >
                  renan.barbono@educacao.mg.gov.br
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <a 
                  href="tel:+5531999999999" 
                  className="text-gray-600 hover:text-primary transition-colors"
                  aria-label="Ligar para (31) 99999-9999"
                >
                  (31) 99999-9999
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-600">
                  Belo Horizonte, MG
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Receba novidades e atualizações sobre o V2L.
            </p>
            <form className="space-y-2" role="form" aria-label="Formulário de newsletter">
              <input
                type="email"
                placeholder="Seu email"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Email para newsletter"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
                aria-label="Inscrever-se na newsletter"
              >
                Inscrever-se
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Video 2 Libras. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
