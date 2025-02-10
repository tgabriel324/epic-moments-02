
import { Zap, Shield, BarChart3 } from "lucide-react";
import { FC } from "react";

export const HowItWorksSection: FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#00BFFF]" />
            </div>
            <h3 className="text-xl font-semibold mb-4">1. Upload Simples</h3>
            <p className="text-gray-600">
              Faça upload das suas estampas e vincule vídeos personalizados em poucos cliques
            </p>
          </div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#00BFFF]" />
            </div>
            <h3 className="text-xl font-semibold mb-4">2. QR Code Seguro</h3>
            <p className="text-gray-600">
              Receba um QR Code único para cada estampa com branding personalizado
            </p>
          </div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-[#00BFFF]" />
            </div>
            <h3 className="text-xl font-semibold mb-4">3. Métricas Detalhadas</h3>
            <p className="text-gray-600">
              Acompanhe o engajamento dos seus clientes com relatórios completos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
