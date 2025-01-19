import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <Logo className="w-32 h-32 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            Transforme suas Roupas em Experiências Interativas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Conecte suas estampas a vídeos únicos através de realidade aumentada. 
            Sem necessidade de aplicativos, direto pelo navegador.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white px-8"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
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
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">1. Upload</h3>
              <p className="text-gray-600">
                Faça upload das suas estampas e vincule vídeos personalizados
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">2. QR Code</h3>
              <p className="text-gray-600">
                Receba um QR Code único para cada estampa automaticamente
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">3. Experiência AR</h3>
              <p className="text-gray-600">
                Seus clientes acessam os vídeos em realidade aumentada direto pelo navegador
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para Revolucionar suas Estampas?
          </h2>
          <Button 
            className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white px-8"
          >
            Criar Conta Grátis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;