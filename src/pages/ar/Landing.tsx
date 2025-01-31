import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Configurações padrão caso não exista nenhuma
const DEFAULT_SETTINGS = {
  foreground_color: "#000000",
  background_color: "#FFFFFF",
  landing_page_primary_color: "#00BFFF",
  landing_page_title: "Experiência AR",
  landing_page_description: "Aponte a câmera para a estampa para ver o conteúdo em realidade aumentada",
  landing_page_logo_url: null
};

// Função para validar UUID
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export default function Landing() {
  const { stampId } = useParams();
  const navigate = useNavigate();

  const { data: landingData, isLoading, error } = useQuery({
    queryKey: ["landing-page", stampId],
    queryFn: async () => {
      console.log("Buscando dados da landing page para estampa:", stampId);
      
      if (!stampId || !isValidUUID(stampId)) {
        console.error("ID da estampa inválido:", stampId);
        throw new Error("ID da estampa inválido");
      }

      // Primeiro buscar a estampa para obter o business_id
      const { data: stamp, error: stampError } = await supabase
        .from("stamps")
        .select(`
          *,
          business:profiles(company_name)
        `)
        .eq("id", stampId)
        .maybeSingle();

      if (stampError) {
        console.error("Erro ao buscar estampa:", stampError);
        throw stampError;
      }

      if (!stamp) {
        console.error("Estampa não encontrada");
        throw new Error("Estampa não encontrada");
      }

      // Agora buscar as configurações específicas do negócio
      const { data: settings, error: settingsError } = await supabase
        .from("qr_code_settings")
        .select("*")
        .eq("business_id", stamp.business_id)
        .maybeSingle();

      if (settingsError && settingsError.code !== "PGRST116") {
        console.error("Erro ao buscar configurações:", settingsError);
        // Não vamos lançar o erro aqui, usaremos as configurações padrão
      }

      console.log("Dados carregados com sucesso:", {
        settings: settings || DEFAULT_SETTINGS,
        stamp
      });

      return {
        settings: settings || DEFAULT_SETTINGS,
        stamp,
      };
    },
    retry: false
  });

  // Estado de loading
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ 
          background: `radial-gradient(circle at center, ${DEFAULT_SETTINGS.landing_page_primary_color}10 0%, black 100%)` 
        }}
      >
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-white text-lg">Carregando experiência...</p>
      </div>
    );
  }

  // Estado de erro
  if (error || !landingData?.stamp) {
    const errorMessage = "Estampa não encontrada ou ID inválido";
    toast.error(errorMessage);
    
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white"
      >
        <div className="max-w-md w-full space-y-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold">Ops! Algo deu errado</h1>
          <p className="text-gray-400">
            {error?.message || errorMessage}
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
        onClick={() => navigate(`/ar/view/${stampId}`)}
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