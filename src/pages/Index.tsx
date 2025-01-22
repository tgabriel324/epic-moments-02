import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <Logo className="w-32 h-32 mb-4 transition-transform duration-300 hover:scale-110" />
          <h1 className="text-4xl md:text-6xl font-bold text-black max-w-4xl">
            Transforme suas Estampas em{" "}
            <span className="text-[#00BFFF]">Experiências Interativas</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Conecte suas estampas a vídeos únicos através de realidade aumentada. 
            Sem necessidade de aplicativos, direto pelo navegador.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white px-8"
              onClick={handleGetStarted}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Upload Simples</h3>
              <p className="text-gray-600">
                Faça upload das suas estampas e vincule vídeos personalizados em poucos cliques
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. QR Code Seguro</h3>
              <p className="text-gray-600">
                Receba um QR Code único para cada estampa com branding personalizado
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Métricas Detalhadas</h3>
              <p className="text-gray-600">
                Acompanhe o engajamento dos seus clientes com relatórios completos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Por que escolher nossa plataforma?
            </h2>
            <div className="grid gap-6">
              <div className="p-6 rounded-lg bg-[#00BFFF]/5">
                <h3 className="font-semibold mb-2">Sem Aplicativo Necessário</h3>
                <p className="text-gray-600">
                  Seus clientes acessam o conteúdo direto pelo navegador do celular
                </p>
              </div>
              <div className="p-6 rounded-lg bg-[#00BFFF]/5">
                <h3 className="font-semibold mb-2">Personalização Completa</h3>
                <p className="text-gray-600">
                  Adapte a experiência com suas cores e logo para fortalecer sua marca
                </p>
              </div>
              <div className="p-6 rounded-lg bg-[#00BFFF]/5">
                <h3 className="font-semibold mb-2">Suporte Especializado</h3>
                <p className="text-gray-600">
                  Nossa equipe está sempre disponível para ajudar no que precisar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#00BFFF] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Revolucionar suas Estampas?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Comece gratuitamente e explore todo o potencial da realidade aumentada
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-[#00BFFF] hover:bg-white/90"
              onClick={handleGetStarted}
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;