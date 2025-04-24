import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, HelpCircle, FileText } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

export const FirebaseConfigHelp: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <HelpCircle className="h-4 w-4" />
          Ajuda com Configuração
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configuração do Firebase</DialogTitle>
          <DialogDescription>
            Instruções para configurar corretamente o Firebase e resolver problemas de permissão.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="warning" className="mb-4">
            <HelpCircle className="h-4 w-4" />
            <AlertTitle>Erro de permissão ao fazer upload</AlertTitle>
            <AlertDescription>
              Este erro ocorre quando o Firebase não está configurado corretamente ou quando as regras de segurança não permitem uploads.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">1. Configure o arquivo .env</h3>
            <p className="text-sm text-gray-500">
              Crie um arquivo .env na raiz do projeto com as credenciais do Firebase. Veja o arquivo firebase-config.example para um modelo.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">2. Configure as regras de segurança do Firebase</h3>
            <p className="text-sm text-gray-500">
              Adicione as seguintes regras no console do Firebase para permitir uploads:
            </p>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono">
              <p>// Regras para o Storage</p>
              <p>rules_version = '2';</p>
              <p>service firebase.storage {'{'}</p>
              <p className="pl-2">match /b/{'{bucket}'}/o {'{'}</p>
              <p className="pl-4">match /videos/{'{userId}'}/{'{projectId}'}/{'{fileName}'} {'{'}</p>
              <p className="pl-6">allow read, write: if request.auth != null && request.auth.uid == userId;</p>
              <p className="pl-4">{'}'}</p>
              <p className="pl-2">{'}'}</p>
              <p>{'}'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">3. Verifique a autenticação</h3>
            <p className="text-sm text-gray-500">
              Certifique-se de que você está autenticado antes de tentar fazer upload. O sistema só permite upload para usuários autenticados.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">4. Para desenvolvimento local</h3>
            <p className="text-sm text-gray-500">
              Use os emuladores do Firebase para desenvolvimento local sem restrições de permissão:
            </p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              VITE_USE_FIREBASE_EMULATORS=true
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => window.open('https://firebase.google.com/docs/rules', '_blank')}>
            <ExternalLink className="h-4 w-4" />
            Documentação do Firebase
          </Button>
          <Button variant="default">Entendi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FirebaseConfigHelp; 