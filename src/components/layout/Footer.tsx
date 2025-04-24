
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">V2L</span>
              <span className="text-lg font-semibold">Video 2 Libras</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Tornando seu conteúdo mais acessível através da Língua Brasileira de Sinais (Libras).
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Youtube">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Github">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/sobre" className="text-gray-600 hover:text-primary transition-colors">Sobre</Link></li>
              <li><Link to="/como-funciona" className="text-gray-600 hover:text-primary transition-colors">Como Funciona</Link></li>
              <li><Link to="/converter" className="text-gray-600 hover:text-primary transition-colors">Converter</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/termos" className="text-gray-600 hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="text-gray-600 hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-primary transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <p className="text-gray-600 mb-2">contato@video2libras.com.br</p>
            <p className="text-gray-600">+55 (11) 9999-9999</p>
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
