import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export default function Stamps() {
  const { data: stamps, isLoading } = useQuery({
    queryKey: ["stamps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stamps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Tables<"stamps">[];
    },
  });

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Estampas</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Estampa
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar estampas..."
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-lg bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : stamps?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Nenhuma estampa</h3>
            <p className="mt-2 text-sm text-gray-500">
              Comece adicionando sua primeira estampa
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Nova Estampa
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stamps?.map((stamp) => (
              <div
                key={stamp.id}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
              >
                <img
                  src={stamp.image_url}
                  alt={stamp.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {stamp.name}
                    </h3>
                    {stamp.description && (
                      <p className="mt-1 text-sm text-gray-200">
                        {stamp.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}