import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video, Users, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold">V2L</div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Começar Agora</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Transforme seus vídeos em{' '}
          <span className="text-primary">Libras</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Torne seu conteúdo acessível para a comunidade surda com nossa tecnologia
          de tradução automática para Língua Brasileira de Sinais.
        </p>
        <Link to="/register">
          <Button size="lg" className="gap-2">
            Comece Gratuitamente <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <Video className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Simples</h3>
            <p className="text-muted-foreground">
              Faça upload dos seus vídeos ou use links do YouTube para começar a tradução.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Acessibilidade</h3>
            <p className="text-muted-foreground">
              Torne seu conteúdo acessível para milhões de pessoas surdas no Brasil.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Segurança</h3>
            <p className="text-muted-foreground">
              Seus vídeos são processados com total segurança e privacidade.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-lg bg-primary/5 border">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Junte-se a milhares de criadores de conteúdo que já estão tornando seus vídeos mais acessíveis.
          </p>
          <Link to="/register">
            <Button size="lg" className="gap-2">
              Criar Conta Gratuita <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 V2L. Todos os direitos reservados.
          </div>
          <div className="flex gap-4">
            <Link to="/termos" className="text-sm text-muted-foreground hover:text-primary">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-primary">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 