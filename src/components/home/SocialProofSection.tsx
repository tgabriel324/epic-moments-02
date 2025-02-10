
import { FC } from "react";

export const SocialProofSection: FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-8">Marcas que Confiam</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="w-32 h-12 bg-white shadow-md rounded-lg flex items-center justify-center border border-gray-200"
              >
                <div className="w-24 h-8 bg-gray-400/20"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center mt-16">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-[#00BFFF] text-4xl font-bold mb-2">1000+</div>
            <p className="text-gray-600">Estampas Ativadas</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-[#00BFFF] text-4xl font-bold mb-2">98%</div>
            <p className="text-gray-600">Satisfação dos Clientes</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-[#00BFFF] text-4xl font-bold mb-2">50K+</div>
            <p className="text-gray-600">Interações Mensais</p>
          </div>
        </div>
      </div>
    </section>
  );
};
