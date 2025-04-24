
# Video 2 Libras (V2L) - Conversor de Vídeo para Libras

![Video 2 Libras Logo](https://img.shields.io/badge/V2L-Video%202%20Libras-blue)
![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/licença-MIT-green)

## Sobre o Projeto

O Video 2 Libras (V2L) é uma aplicação web inovadora que converte vídeos para incluir um intérprete de Língua Brasileira de Sinais (Libras), tornando o conteúdo mais acessível para pessoas surdas ou com deficiência auditiva.

### Características Principais

- 🎥 Upload de vídeos MP4 ou diretamente via URL do YouTube
- 📝 Extração e edição de legendas
- 🔄 Conversão de legendas para interpretação em Libras
- 👨‍👩‍👧‍👦 Integração com VLibras para renderização do intérprete
- 💾 Exportação do vídeo final com interpretação em Libras

## Fluxo de Trabalho

O V2L possui um fluxo de trabalho de quatro etapas:

1. **Upload do Vídeo**: Carregue seu vídeo MP4 ou forneça uma URL do YouTube
2. **Extração de Legendas**: Obtenção automática ou manual das legendas do vídeo
3. **Interpretação para Libras**: Transformação do texto em interpretação em Libras
4. **Exportação**: Renderização e download do vídeo final com o intérprete de Libras

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Estado**: TanStack Query (React Query)
- **UI Components**: shadcn/ui
- **Backend/BaaS**: Firebase (Firestore, Storage, Authentication)
- **APIs**: Gemini AI, VLibras, YouTube Data API

## Configuração do Projeto

Para rodar o projeto localmente, siga estas etapas:

1. Clone o repositório
   ```bash
   git clone https://github.com/seu-usuario/video-2-libras.git
   cd video-2-libras
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (.env)
   ```
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=seu-api-key
   VITE_FIREBASE_AUTH_DOMAIN=seu-auth-domain
   VITE_FIREBASE_PROJECT_ID=seu-project-id
   VITE_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
   VITE_FIREBASE_APP_ID=seu-app-id

   # Google API Keys
   VITE_GOOGLE_API_KEY=seu-google-api-key

   # Gemini API Key
   VITE_GEMINI_API_KEY=seu-gemini-api-key
   ```

4. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   ```

5. Acesse a aplicação em [http://localhost:8080](http://localhost:8080)

## Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma Branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Contato

Sua Nome - [@seu_twitter](https://twitter.com/seu_twitter) - email@example.com

Link do Projeto: [https://github.com/seu-usuario/video-2-libras](https://github.com/seu-usuario/video-2-libras)

---

Desenvolvido com ❤️ para a comunidade surda brasileira.
