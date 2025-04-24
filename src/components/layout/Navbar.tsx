import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/LoginButton';
import { useAuth } from '@/components/auth/AuthProvider';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Atualiza a seção ativa baseado no scroll
      const sections = ['home', 'sobre', 'como-funciona', 'converter'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const isActive = (sectionId: string) => {
    return activeSection === sectionId ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 shadow-md backdrop-blur-md py-2' : 'bg-transparent py-4'
      }`}
      role="navigation"
      aria-label="Menu principal"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2" aria-label="Página inicial">
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">V2L</span>
          <span className="hidden md:block text-lg font-semibold">Video 2 Libras</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('home')} 
            className={`font-medium transition-colors ${isActive('home')}`}
            aria-current={activeSection === 'home' ? 'page' : undefined}
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('sobre')} 
            className={`font-medium transition-colors ${isActive('sobre')}`}
            aria-current={activeSection === 'sobre' ? 'page' : undefined}
          >
            Sobre
          </button>
          <button 
            onClick={() => scrollToSection('como-funciona')} 
            className={`font-medium transition-colors ${isActive('como-funciona')}`}
            aria-current={activeSection === 'como-funciona' ? 'page' : undefined}
          >
            Como Funciona
          </button>
          <button 
            onClick={() => scrollToSection('converter')} 
            className={`font-medium transition-colors ${isActive('converter')}`}
            aria-current={activeSection === 'converter' ? 'page' : undefined}
          >
            Converter
          </button>
          <Link 
            to="/termos" 
            className={`font-medium transition-colors ${location.pathname === '/termos' ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}
            aria-current={location.pathname === '/termos' ? 'page' : undefined}
          >
            Termos
          </Link>
          <Link 
            to="/privacidade" 
            className={`font-medium transition-colors ${location.pathname === '/privacidade' ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}
            aria-current={location.pathname === '/privacidade' ? 'page' : undefined}
          >
            Privacidade
          </Link>
          <Link 
            to="/cookies" 
            className={`font-medium transition-colors ${location.pathname === '/cookies' ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}
            aria-current={location.pathname === '/cookies' ? 'page' : undefined}
          >
            Cookies
          </Link>
          {user ? (
            <Button asChild>
              <Link to="/app" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                Meus Projetos
              </Link>
            </Button>
          ) : (
            <LoginButton />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-primary transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden bg-white shadow-lg"
          role="menu"
          aria-label="Menu mobile"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('home')} 
              className={`block w-full text-left font-medium transition-colors ${isActive('home')}`}
              role="menuitem"
              aria-current={activeSection === 'home' ? 'page' : undefined}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('sobre')} 
              className={`block w-full text-left font-medium transition-colors ${isActive('sobre')}`}
              role="menuitem"
              aria-current={activeSection === 'sobre' ? 'page' : undefined}
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('como-funciona')} 
              className={`block w-full text-left font-medium transition-colors ${isActive('como-funciona')}`}
              role="menuitem"
              aria-current={activeSection === 'como-funciona' ? 'page' : undefined}
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection('converter')} 
              className={`block w-full text-left font-medium transition-colors ${isActive('converter')}`}
              role="menuitem"
              aria-current={activeSection === 'converter' ? 'page' : undefined}
            >
              Converter
            </button>
            <Link 
              to="/termos" 
              className={`block w-full text-left font-medium transition-colors ${location.pathname === '/termos' ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}
              role="menuitem"
              aria-current={location.pathname === '/termos' ? 'page' : undefined}
            >
              Termos
            </Link>
            <Link 
              to="/privacidade" 
              className={`block w-full text-left font-medium transition-colors ${location.pathname === '/privacidade' ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}
              role="menuitem"
              aria-current={location.pathname === '/privacidade' ? 'page' : undefined}
            >
              Privacidade
            </Link>
            <Link 
              to="/cookies" 
              className={`block w-full text-left font-medium transition-colors ${location.pathname === '/cookies' ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}
              role="menuitem"
              aria-current={location.pathname === '/cookies' ? 'page' : undefined}
            >
              Cookies
            </Link>
            {user ? (
              <Button asChild className="w-full">
                <Link to="/app" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  Meus Projetos
                </Link>
              </Button>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
