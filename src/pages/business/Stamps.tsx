import { useState } from "react";
import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StampsGrid = () => {
  const { data: stamps, isLoading } = useQuery({
    queryKey: ['stamps'],
    queryFn: async () => {
      console.log('Fetching stamps...');
      const { data, error } = await supabase
        .from('stamps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stamps:', error);
        throw error;
      }

      console.log('Stamps fetched:', data);
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  if (!stamps?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <ImageIcon className="h-16 w-16 mb-4 text-gray-400" />
        <p className="text-lg font-medium">Nenhuma estampa encontrada</p>
        <p className="text-sm">Comece fazendo upload da sua primeira estampa</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stamps.map((stamp) => (
        <Card 
          key={stamp.id} 
          className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        >
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <img
              src={stamp.image_url}
              alt={stamp.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" className="hover:scale-105 transition-transform">
                Editar
              </Button>
              <Button size="sm" variant="secondary" className="hover:scale-105 transition-transform">
                Visualizar
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1 truncate">{stamp.name}</h3>
            <p className="text-sm text-gray-500 truncate">{stamp.description || 'Sem descrição'}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const StampsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BusinessLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
            Estampas
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie suas estampas e vincule vídeos para criar experiências em AR
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar estampas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button className="flex-1 sm:flex-none bg-[#00BFFF] hover:bg-[#00A6E6] text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button className="flex-1 sm:flex-none bg-[#0080FF] hover:bg-[#0066CC] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Estampa
            </Button>
          </div>
        </div>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Suas Estampas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <StampsGrid />
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
};

export default StampsPage;