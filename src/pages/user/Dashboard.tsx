import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Scan, Clock, Star } from "lucide-react";

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Meu Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe suas interações e experiências AR
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Interações
              </CardTitle>
              <Scan className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingInteractions ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  recentInteractions?.length || 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Última Interação
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingInteractions ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  recentInteractions?.[0]?.created_at
                    ? new Date(
                        recentInteractions[0].created_at
                      ).toLocaleDateString()
                    : "Nenhuma"
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estampas Favoritas
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Em breve</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Interações</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingInteractions ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : recentInteractions?.length ? (
              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {interaction.stamps?.name || "Estampa removida"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(interaction.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm">
                      Status: {interaction.status || "Concluído"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Nenhuma interação encontrada
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}