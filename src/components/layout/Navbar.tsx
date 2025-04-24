
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Link to="/" className="font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/sobre" className="font-medium hover:text-primary transition-colors">Sobre</Link>
          <Link to="/como-funciona" className="font-medium hover:text-primary transition-colors">Como Funciona</Link>
          <Link to="/converter" className="font-medium hover:text-primary transition-colors">Converter</Link>
          <Button asChild>
            <Link to="/app" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              Começar
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 slide-down">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="font-medium py-2 px-4 hover:bg-muted rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/sobre" className="font-medium py-2 px-4 hover:bg-muted rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Sobre</Link>
            <Link to="/como-funciona" className="font-medium py-2 px-4 hover:bg-muted rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Como Funciona</Link>
            <Link to="/converter" className="font-medium py-2 px-4 hover:bg-muted rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Converter</Link>
            <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Link to="/app" onClick={() => setIsMenuOpen(false)}>Começar</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
