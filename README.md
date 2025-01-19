# Epic Momentos - Plataforma AR para Estampas

## Roadmap de Desenvolvimento

### Fase 1 - Autenticação e Funcionalidades Básicas
- [ ] Sistema de Autenticação
  - [ ] Login com email/senha
  - [ ] Cadastro de novos usuários
  - [ ] Recuperação de senha
  - [ ] Contexto de autenticação
  - [ ] Proteção de rotas

- [ ] Upload e Gerenciamento de Estampas
  - [ ] Interface de upload de imagens
  - [ ] Visualização de estampas cadastradas
  - [ ] Edição de informações da estampa
  - [ ] Exclusão de estampas

- [ ] Gerenciamento de Vídeos
  - [ ] Upload de vídeos
  - [ ] Vinculação vídeo-estampa
  - [ ] Preview dos vídeos
  - [ ] Gerenciamento de vídeos existentes

- [ ] Sistema de QR Codes
  - [ ] Geração automática
  - [ ] Visualização dos QR codes gerados
  - [ ] Download de QR codes
  - [ ] Página de destino do QR code

### Fase 2 - Experiência AR e Preview
- [ ] Visualização AR
  - [ ] Implementação do WebXR
  - [ ] Exibição de vídeos em AR
  - [ ] Calibração e tracking de imagens
  - [ ] Otimização de performance

- [ ] Sistema de Preview
  - [ ] Preview de vídeos para donos de negócio
  - [ ] Simulação da experiência AR
  - [ ] Ajustes de posicionamento

### Fase 3 - Monetização e Analytics
- [ ] Planos e Assinaturas
  - [ ] Implementação dos níveis de plano
  - [ ] Sistema de pagamentos
  - [ ] Limitações por plano
  - [ ] Upgrade/downgrade de planos

- [ ] Analytics e Relatórios
  - [ ] Métricas básicas de visualização
  - [ ] Dashboard para donos de negócio
  - [ ] Relatórios exportáveis
  - [ ] Insights de uso

## Tecnologias Utilizadas
- Frontend: React + Vite
- Estilização: Tailwind CSS + Shadcn/ui
- Gerenciamento de Estado: TanStack Query
- Backend: Supabase
- AR: WebXR

## Design System
### Cores
- Primárias: 
  - Preto (#000000)
  - Branco (#FFFFFF)
- Secundária: 
  - Azul Ciano (#00BFFF)
- Neutras:
  - Cinza Claro (#F5F5F5)
  - Cinza Médio (#C4C4C4)

### Tipografia
- Font Family: Poppins
- Hierarquia:
  - H1: 36px (Bold)
  - H2: 24px (Bold)
  - H3: 20px (Bold)
  - Texto: 16px (Regular)
  - Texto secundário: 14px (Regular)

## Como posso editar este código?

Existem várias maneiras de editar sua aplicação.

**Use Lovable**

Basta visitar o [Projeto Lovable](https://lovable.dev/projects/b965520a-d27f-41dc-8b8c-c1be7846b501) e começar a fazer prompts.

As alterações feitas via Lovable serão comprometidas automaticamente a este repositório.

**Use seu IDE preferido**

Se você quiser trabalhar localmente usando seu próprio IDE, você pode clonar este repositório e enviar alterações. As alterações enviadas também serão refletidas no Lovable.

A única exigência é ter o Node.js e npm instalados - [instale com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Siga estes passos:

```sh
# Passo 1: Clone o repositório usando a URL Git do projeto.
git clone <YOUR_GIT_URL>

# Passo 2: Navegue até o diretório do projeto.
cd <YOUR_PROJECT_NAME>

# Passo 3: Instale as dependências necessárias.
npm i

# Passo 4: Inicie o servidor de desenvolvimento com recarregamento automático e uma pré-visualização instantânea.
npm run dev
```

**Edite um arquivo diretamente no GitHub**

- Navegue até o(s) arquivo(s) desejado(s).
- Clique no botão "Editar" (ícone de lápis) no canto superior direito da visualização do arquivo.
- Faça suas alterações e comprometa as alterações.

**Use GitHub Codespaces**

- Navegue até a página principal do seu repositório.
- Clique no botão "Código" (botão verde) perto do canto superior direito.
- Selecione a aba "Codespaces".
- Clique em "Novo codespace" para lançar um novo ambiente Codespace.
- Edite arquivos diretamente dentro do Codespace e comprometa e envie suas alterações assim que terminar.
