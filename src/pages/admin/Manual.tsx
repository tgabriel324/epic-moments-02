import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Manual() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual do Administrador</h1>
          <p className="text-muted-foreground">
            Guia completo para gerenciamento da plataforma Epic Momentos
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-250px)]">
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre a Plataforma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">O que é o Epic Momentos?</h3>
                  <p>
                    O Epic Momentos é uma plataforma SaaS inovadora que utiliza realidade aumentada (AR) 
                    para conectar empresas de roupas aos seus clientes finais. A solução permite que os 
                    Donos de Negócios vinculem vídeos a estampas de seus produtos de forma simples e 
                    totalmente acessível via navegador.
                  </p>

                  <h3 className="text-lg font-semibold mt-6">Papel do Administrador</h3>
                  <p>
                    Como administrador, você é responsável por:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Gerenciar usuários e suas permissões</li>
                    <li>Monitorar a saúde e performance do sistema</li>
                    <li>Configurar e gerenciar planos de assinatura</li>
                    <li>Analisar métricas e relatórios</li>
                    <li>Resolver problemas técnicos quando necessário</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Administrativo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Métricas Principais</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Total de Usuários:</span> Número total de usuários 
                      registrados na plataforma, divididos por tipo (negócio/final)
                    </li>
                    <li>
                      <span className="font-medium">Interações AR:</span> Total de experiências AR 
                      iniciadas e completadas
                    </li>
                    <li>
                      <span className="font-medium">Estampas Ativas:</span> Quantidade de estampas 
                      cadastradas e ativas no sistema
                    </li>
                    <li>
                      <span className="font-medium">Assinaturas:</span> Distribuição de usuários por 
                      plano de assinatura
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Usuários</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Tipos de Usuário</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Administradores:</span> Acesso completo ao sistema
                    </li>
                    <li>
                      <span className="font-medium">Donos de Negócio:</span> Gerenciam suas próprias 
                      estampas e vídeos
                    </li>
                    <li>
                      <span className="font-medium">Usuários Finais:</span> Interagem com as 
                      experiências AR
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-6">Ações Comuns</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Visualizar detalhes do usuário</li>
                    <li>Ativar/desativar contas</li>
                    <li>Alterar tipo de usuário</li>
                    <li>Resetar senha</li>
                    <li>Verificar histórico de atividades</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Monitoramento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Logs do Sistema</h3>
                  <p>
                    Os logs são categorizados por nível de severidade:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium text-red-500">ERROR:</span> Problemas críticos que 
                      precisam de atenção imediata
                    </li>
                    <li>
                      <span className="font-medium text-yellow-500">WARN:</span> Situações suspeitas 
                      ou potencialmente problemáticas
                    </li>
                    <li>
                      <span className="font-medium text-blue-500">INFO:</span> Informações sobre 
                      operações normais do sistema
                    </li>
                    <li>
                      <span className="font-medium text-green-500">SUCCESS:</span> Operações 
                      concluídas com sucesso
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-6">Métricas de Performance</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Tempo de resposta da API</li>
                    <li>Uso de recursos do servidor</li>
                    <li>Taxa de sucesso das experiências AR</li>
                    <li>Performance do CDN</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plans" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Planos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Planos Disponíveis</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Free:</span> Até 5 estampas, métricas básicas
                    </li>
                    <li>
                      <span className="font-medium">Pro:</span> 50 estampas, métricas detalhadas, 
                      branding personalizado
                    </li>
                    <li>
                      <span className="font-medium">Enterprise:</span> Upload ilimitado, suporte 
                      prioritário, relatórios avançados
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-6">Gerenciamento</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Configurar limites e recursos por plano</li>
                    <li>Ajustar preços</li>
                    <li>Gerenciar promoções</li>
                    <li>Monitorar uso por plano</li>
                    <li>Análise de conversão entre planos</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </AdminLayout>
  );
}