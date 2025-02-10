
import { CheckCircle2, Globe2, MessageSquare, Clock } from "lucide-react";
import { FC } from "react";

export const BenefitsSection: FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Benefícios</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-[#00BFFF] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Engajamento</h3>
            <p className="text-gray-600">Aumente a interação com seus produtos</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Globe2 className="w-8 h-8 text-[#00BFFF] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sem Aplicativo</h3>
            <p className="text-gray-600">Funciona direto no navegador</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <MessageSquare className="w-8 h-8 text-[#00BFFF] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Suporte 24/7</h3>
            <p className="text-gray-600">Assistência técnica especializada</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Clock className="w-8 h-8 text-[#00BFFF] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Setup Rápido</h3>
            <p className="text-gray-600">Configure em minutos</p>
          </div>
        </div>
      </div>
    </section>
  );
};
