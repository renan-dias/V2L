import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/LoginButton';
import { useAuth } from '@/components/auth/AuthProvider';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 shadow-md backdrop-blur-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">V2L</span>
          <span className="hidden md:block text-lg font-semibold">Video 2 Libras</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection('home')} className="font-medium hover:text-primary transition-colors">Home</button>
          <button onClick={() => scrollToSection('sobre')} className="font-medium hover:text-primary transition-colors">Sobre</button>
          <button onClick={() => scrollToSection('como-funciona')} className="font-medium hover:text-primary transition-colors">Como Funciona</button>
          <button onClick={() => scrollToSection('converter')} className="font-medium hover:text-primary transition-colors">Converter</button>
          <Link to="/termos" className="font-medium hover:text-primary transition-colors">Termos</Link>
          <Link to="/privacidade" className="font-medium hover:text-primary transition-colors">Privacidade</Link>
          <Link to="/cookies" className="font-medium hover:text-primary transition-colors">Cookies</Link>
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
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button onClick={() => scrollToSection('home')} className="block w-full text-left font-medium hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollToSection('sobre')} className="block w-full text-left font-medium hover:text-primary transition-colors">Sobre</button>
            <button onClick={() => scrollToSection('como-funciona')} className="block w-full text-left font-medium hover:text-primary transition-colors">Como Funciona</button>
            <button onClick={() => scrollToSection('converter')} className="block w-full text-left font-medium hover:text-primary transition-colors">Converter</button>
            <Link to="/termos" className="block w-full text-left font-medium hover:text-primary transition-colors">Termos</Link>
            <Link to="/privacidade" className="block w-full text-left font-medium hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/cookies" className="block w-full text-left font-medium hover:text-primary transition-colors">Cookies</Link>
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
