
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#001F33] to-[#00BFFF] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <Logo className="w-32 h-32 mb-4 transition-transform duration-300 hover:scale-110" />
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl">
            Transforme suas Estampas em{" "}
            <span className="text-[#00BFFF]">Experiências Interativas</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-gray-100">
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
              className="border-2 border-white bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </div>
      <ArrowDown className="absolute bottom-8 animate-bounce w-8 h-8 opacity-50 hover:opacity-100 transition-opacity" />
    </section>
  );
};
