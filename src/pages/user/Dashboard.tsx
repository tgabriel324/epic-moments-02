import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Scan, History, BookMarked, Share2 } from "lucide-react";

const UserDashboard = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Olá, {profile?.first_name || "Visitante"}!
          </h1>
          <p className="mt-2 text-gray-600">
            Bem-vindo ao Epic Momentos. Explore experiências únicas em realidade aumentada.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Escanear QR Code</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Scan className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full mt-2 bg-[#00BFFF] hover:bg-[#00BFFF]/90"
                onClick={() => {/* Implementar scanner */}}
              >
                Iniciar Scanner
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Histórico</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <History className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Experiências visualizadas</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Coleção</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <BookMarked className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Itens salvos</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Compartilhar</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Share2 className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full mt-2 border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
                onClick={() => {/* Implementar compartilhamento */}}
              >
                Convidar Amigos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border border-gray-100 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <History className="w-12 h-12 mb-4 text-gray-300" />
              <p>Nenhuma atividade recente</p>
              <p className="text-sm">Suas experiências em AR aparecerão aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;