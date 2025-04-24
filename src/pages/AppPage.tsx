import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { LayoutGrid, Video, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const AppPage: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Deslogado com sucesso!",
        description: "Você foi deslogado da sua conta.",
      });
    } catch (error) {
      console.error('Erro ao deslogar:', error);
      toast({
        title: "Erro ao deslogar",
        description: "Ocorreu um erro ao tentar deslogar.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path) ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">V2L</span>
              <span className="text-lg font-semibold">Video 2 Libras</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/app/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive('dashboard')}`}
            >
              <LayoutGrid size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/app/converter"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive('converter')}`}
            >
              <Video size={20} />
              <span>Converter Vídeo</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut size={20} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AppPage;
