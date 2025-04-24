import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Bem-vindo!</h2>
          <p className="text-muted-foreground">
            Este é o seu painel de controle. Aqui você pode gerenciar seus vídeos e conversões.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Conversões Recentes</h2>
          <p className="text-muted-foreground">
            Você ainda não tem nenhuma conversão. Comece convertendo um vídeo agora!
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Estatísticas</h2>
          <p className="text-muted-foreground">
            Acompanhe suas estatísticas de uso e conversão aqui.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 