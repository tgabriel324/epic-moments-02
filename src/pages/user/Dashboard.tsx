import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Scan, Clock, Star, Eye, MousePointer, Activity } from "lucide-react";

export default function Dashboard() {
  const { data: recentInteractions, isLoading: loadingInteractions } = useQuery({
    queryKey: ["user-interactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ar_interactions")
        .select(`*, stamps (*)`)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <UserLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[#00BFFF]">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Acompanhe suas interações e experiências AR
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Interações
              </CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Activity className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loadingInteractions ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  recentInteractions?.length || 0
                )}
              </div>
              <div className="flex items-center mt-1 text-xs text-[#00BFFF]">
                <Activity className="w-3 h-3 mr-1" />
                <span>Total de interações</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Última Interação
              </CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Clock className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loadingInteractions ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  recentInteractions?.[0]?.created_at
                    ? new Date(recentInteractions[0].created_at).toLocaleDateString()
                    : "Nenhuma"
                )}
              </div>
              <div className="flex items-center mt-1 text-xs text-[#00BFFF]">
                <Clock className="w-3 h-3 mr-1" />
                <span>Data da última interação</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Estampas Favoritas
              </CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Star className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">Em breve</div>
              <div className="flex items-center mt-1 text-xs text-[#00BFFF]">
                <Star className="w-3 h-3 mr-1" />
                <span>Suas estampas favoritas</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-100 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Últimas Interações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingInteractions ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-[#00BFFF]" />
              </div>
            ) : recentInteractions?.length ? (
              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {interaction.stamps?.name || "Estampa removida"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(interaction.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm text-[#00BFFF] font-medium">
                      {interaction.status === 'completed' ? 'Concluído' : 'Em andamento'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Nenhuma interação encontrada
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}