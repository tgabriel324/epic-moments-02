import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Scan, History as HistoryIcon, BookMarked, Share2, QrCode, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentInteraction {
  id: string;
  stamp_id: string;
  created_at: string;
  stamp: {
    name: string;
    image_url: string;
  };
}

const UserDashboard = () => {
  const { profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  // Buscar interações recentes
  const { data: recentInteractions, isLoading: interactionsLoading } = useQuery({
    queryKey: ["recent-interactions"],
    queryFn: async () => {
      console.log("Buscando interações recentes...");
      const { data, error } = await supabase
        .from("ar_interactions")
        .select(`
          id,
          stamp_id,
          created_at,
          stamp:stamps (
            name,
            image_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Erro ao buscar interações:", error);
        throw error;
      }

      console.log("Interações encontradas:", data);
      return data as RecentInteraction[];
    },
  });

  // Buscar estatísticas do usuário
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      console.log("Buscando estatísticas do usuário...");
      const { data, error } = await supabase
        .from("ar_interactions")
        .select("*")
        .eq("status", "completed");

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        throw error;
      }

      console.log("Estatísticas encontradas:", data);
      return {
        totalInteractions: data.length,
        thisMonth: data.filter(
          (i) =>
            new Date(i.created_at).getMonth() === new Date().getMonth()
        ).length,
      };
    },
  });

  const handleScanClick = () => {
    console.log("Iniciando navegação para o scanner");
    navigate("/ar/scanner");
  };

  if (profileLoading || interactionsLoading || statsLoading) {
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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#00BFFF]">
            Olá, {profile?.first_name || "Visitante"}!
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Explore experiências únicas em realidade aumentada.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Scanner Card */}
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Escanear QR Code</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <QrCode className="w-4 h-4 text-[#00BFFF]" />
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

          {/* Statistics Cards */}
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total de Interações</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Eye className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalInteractions || 0}</p>
              <p className="text-sm text-gray-600">experiências visualizadas</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Clock className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.thisMonth || 0}</p>
              <p className="text-sm text-gray-600">interações no mês</p>
            </CardContent>
          </Card>

          {/* Collection Card */}
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Minha Coleção</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <BookMarked className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full mt-2 border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
                onClick={() => navigate("/user/collection")}
              >
                Ver Coleção
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Interactions */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Interações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInteractions && recentInteractions.length > 0 ? (
              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={interaction.stamp.image_url}
                        alt={interaction.stamp.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{interaction.stamp.name}</h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(interaction.created_at), "PPp", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#00BFFF]"
                      onClick={() => navigate(`/ar/view/${interaction.stamp_id}`)}
                    >
                      Ver Novamente
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <HistoryIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma interação recente encontrada.</p>
                <p className="text-sm mt-2">
                  Escaneie um QR Code para começar sua jornada!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;