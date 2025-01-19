# Epic Momentos - Plataforma AR para Estampas

## Fases de Desenvolvimento

### Fase 1 - Autenticação e Estrutura Base
- [ ] Sistema de Autenticação
  - [x] Login com email/senha
  - [x] Cadastro de novos usuários
  - [ ] Recuperação de senha
  - [x] Contexto de autenticação
  - [x] Proteção de rotas
  - [x] Diferenciação de tipos de usuário (admin/business/end_user)

- [ ] Perfis de Usuário
  - [x] Tabela de perfis no banco
  - [ ] Edição de informações do perfil
  - [ ] Upload de avatar
  - [ ] Configurações da conta

### Fase 2 - Gestão de Conteúdo
- [ ] Gestão de Estampas
  - [ ] Interface de upload de imagens
  - [ ] Visualização em grid das estampas
  - [ ] Edição de informações da estampa
  - [ ] Exclusão de estampas
  - [ ] Preview da estampa

- [ ] Gestão de Vídeos
  - [ ] Upload de vídeos
  - [ ] Vinculação vídeo-estampa
  - [ ] Player de preview
  - [ ] Edição de metadados
  - [ ] Exclusão de vídeos

- [ ] Sistema de QR Codes
  - [ ] Geração automática
  - [ ] Visualização em lista
  - [ ] Download individual/em lote
  - [ ] Página de destino personalizada

### Fase 3 - Experiência AR
- [ ] Visualização AR
  - [ ] Implementação do WebXR
  - [ ] Detecção de marcadores
  - [ ] Renderização de vídeos
  - [ ] Controles de playback
  - [ ] Ajustes de escala/posição

- [ ] Preview e Testes
  - [ ] Simulador AR web
  - [ ] Testes em diferentes dispositivos
  - [ ] Feedback visual de tracking
  - [ ] Otimização de performance

### Fase 4 - Planos e Monetização
- [x] Sistema de Planos
  - [x] Definição de planos (Free/Pro/Enterprise)
  - [x] Tabela de features por plano
  - [x] Preços e limites
  - [ ] Interface de upgrade

- [ ] Gestão de Assinaturas
  - [x] Tabela de assinaturas
  - [ ] Processo de checkout
  - [ ] Gestão de pagamentos
  - [ ] Renovações automáticas
  - [ ] Cancelamentos

### Fase 5 - Analytics e Relatórios
- [x] Estrutura de Métricas
  - [x] Tabela de métricas de uso
  - [ ] Coleta automática de dados
  - [ ] Processamento em background

- [ ] Dashboard de Analytics
  - [ ] Visualizações por QR code
  - [ ] Tempo médio de interação
  - [ ] Métricas por período
  - [ ] Exportação de relatórios

### Fase 6 - Otimização e Escalabilidade
- [ ] Performance
  - [ ] Otimização de assets
  - [ ] Lazy loading
  - [ ] Caching estratégico
  - [ ] CDN para mídia

- [ ] Infraestrutura
  - [ ] Monitoramento
  - [ ] Logs centralizados
  - [ ] Backups automáticos
  - [ ] Escalabilidade horizontal

## Stack Tecnológica
- ✅ Frontend: React + Vite
- ✅ Estilização: Tailwind CSS + Shadcn/ui
- ✅ Gerenciamento de Estado: TanStack Query
- ✅ Backend: Supabase
  - ✅ Autenticação
  - ✅ Banco de Dados
  - [ ] Storage
  - [ ] Edge Functions
- [ ] AR: WebXR + Image Tracking

## Design System
### Cores
- ✅ Primárias: 
  - Preto (#000000)
  - Branco (#FFFFFF)
- ✅ Secundária: 
  - Azul Ciano (#00BFFF)
- ✅ Neutras:
  - Cinza Claro (#F5F5F5)
  - Cinza Médio (#C4C4C4)

### Tipografia
- ✅ Font Family: Poppins
- ✅ Hierarquia:
  - H1: 36px (Bold)
  - H2: 24px (Bold)
  - H3: 20px (Bold)
  - Texto: 16px (Regular)
  - Texto secundário: 14px (Regular)

## Próximos Passos Prioritários
1. Implementar recuperação de senha
2. Desenvolver interface de upload e gestão de estampas
3. Implementar sistema de storage para mídia
4. Criar sistema de geração de QR codes
5. Desenvolver visualizador AR básico