import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Scan, History, BookMarked, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { profile, isLoading } = useProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
        </div>
      </UserLayout>
    );
  }

  const handleScanClick = () => {
    console.log("Iniciando navegação para o scanner");
    navigate("/ar/scanner");
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Olá, {profile?.first_name || "Visitante"}!
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Bem-vindo ao Epic Momentos. Explore experiências únicas em realidade aumentada.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          {/* Scanner Card */}
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
                onClick={handleScanClick}
              >
                Iniciar Scanner
              </Button>
            </CardContent>
          </Card>

          {/* History Card */}
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

          {/* Collection Card */}
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

          {/* Share Card */}
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
      </div>
    </UserLayout>
  );
};

export default UserDashboard;