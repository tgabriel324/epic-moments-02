import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";

export default function Landing() {
  const { stampId } = useParams();

  const { data: landingData, isLoading, error } = useQuery({
    queryKey: ["landing-page", stampId],
    queryFn: async () => {
      console.log("Buscando dados da landing page para estampa:", stampId);
      
      if (!stampId) throw new Error("ID da estampa não fornecido");

      // Buscar configurações do QR code e dados da estampa
      const { data: settings, error: settingsError } = await supabase
        .from("qr_code_settings")
        .select("*")
        .single();

      if (settingsError) {
        console.error("Erro ao buscar configurações:", settingsError);
        throw settingsError;
      }

      const { data: stamp, error: stampError } = await supabase
        .from("stamps")
        .select("*, business:profiles(company_name)")
        .eq("id", stampId)
        .single();

      if (stampError) {
        console.error("Erro ao buscar estampa:", stampError);
        throw stampError;
      }

      if (!stamp) throw new Error("Estampa não encontrada");

      console.log("Dados carregados com sucesso:", { settings, stamp });
      return {
        settings,
        stamp,
      };
    },
  });

  // Estado de loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-lg">Carregando experiência...</p>
      </div>
    );
  }

  // Estado de erro
  if (error || !landingData?.settings || !landingData.stamp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold">Ops! Algo deu errado</h1>
          <p className="text-gray-400">
            {error?.message || "Não foi possível carregar a experiência"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const { settings, stamp } = landingData;
  const primaryColor = settings.landing_page_primary_color || "#00BFFF";

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white"
      style={{ 
        "--primary-color": primaryColor,
        background: `radial-gradient(circle at center, ${primaryColor}10 0%, black 100%)` 
      } as React.CSSProperties}
    >
      {settings.landing_page_logo_url && (
        <img
          src={settings.landing_page_logo_url}
          alt="Logo"
          className="w-32 h-32 object-contain mb-8"
        />
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {settings.landing_page_title || "Experiência AR"}
      </h1>

      <p className="text-lg text-center text-gray-300 mb-8 max-w-md">
        {settings.landing_page_description || 
          "Aponte a câmera para a estampa para ver o conteúdo em realidade aumentada"}
      </p>

      <Button
        className="text-lg px-8 py-6 rounded-full bg-white text-black hover:bg-white/90 transition-all"
        onClick={() => window.location.href = `/ar/view/${stampId}`}
      >
        Iniciar Experiência
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>

      {stamp.business?.company_name && (
        <p className="mt-12 text-sm text-gray-400">
          Uma experiência de {stamp.business.company_name}
        </p>
      )}
    </div>
  );
}