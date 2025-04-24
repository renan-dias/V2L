import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserProjects } from '@/services/projectService';
import { Project } from '@/types/project';

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return;
      try {
        const userProjects = await getUserProjects(user.uid);
        setProjects(userProjects);
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'processing':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'processing':
        return <Clock className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/app/converter">
            <Video className="h-4 w-4 mr-2" />
            Novo Projeto
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Total de Projetos</h2>
          <p className="text-3xl font-bold">{projects.length}</p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Em Processamento</h2>
          <p className="text-3xl font-bold">
            {projects.filter(p => p.status === 'processing').length}
          </p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Concluídos</h2>
          <p className="text-3xl font-bold">
            {projects.filter(p => p.status === 'completed').length}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Projetos Recentes</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando projetos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Você ainda não tem nenhum projeto.</p>
            <Button asChild className="mt-4">
              <Link to="/app/converter">Criar Primeiro Projeto</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {projects.map((project) => (
              <div key={project.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-500">
                      Criado em {formatDate(project.createdAt)}
                    </p>
                  </div>
                  <div className={`flex items-center ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span className="ml-2 text-sm capitalize">{project.status}</span>
                  </div>
                </div>
                
                {project.metadata && (
                  <div className="mt-2 text-sm text-gray-500">
                    <span>
                      Tamanho: {(project.metadata.size / (1024 * 1024)).toFixed(2)}MB
                    </span>
                    {project.metadata.format && (
                      <span className="ml-4">
                        Formato: {project.metadata.format.split('/')[1].toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage; 