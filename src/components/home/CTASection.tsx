
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FC } from "react";

export const CTASection: FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[#000000] to-[#00BFFF] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Pronto para Revolucionar suas Estampas?
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Comece gratuitamente e explore todo o potencial da realidade aumentada
        </p>
        <Button 
          size="lg"
          className="bg-white text-[#00BFFF] hover:bg-white/90"
          onClick={handleGetStarted}
        >
          Criar Conta Grátis
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};
