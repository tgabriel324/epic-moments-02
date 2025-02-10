
import { Star } from "lucide-react";
import { FC } from "react";

export const TestimonialsSection: FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">O que Dizem Nossos Clientes</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Nome do Cliente</h4>
                  <p className="text-gray-600 text-sm">Cargo, Empresa</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">
                "O Epic Momentos revolucionou a forma como apresentamos nossas coleções. 
                Os clientes adoram a experiência interativa!"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
