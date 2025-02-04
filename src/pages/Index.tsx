import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown, CheckCircle2, Zap, Shield, BarChart3, Globe2, MessageSquare, Clock, Star } from "lucide-react";
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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-[#000000] to-[#00BFFF] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
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
                className="border-white text-white hover:bg-white/10"
              >
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
        <ArrowDown className="absolute bottom-8 animate-bounce w-8 h-8" />
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Marcas que Confiam</h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-50">
              {/* Placeholder para logos */}
              <div className="w-32 h-12 bg-gray-200 rounded"></div>
              <div className="w-32 h-12 bg-gray-200 rounded"></div>
              <div className="w-32 h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-[#00BFFF] text-4xl font-bold mb-2">1000+</div>
              <p className="text-gray-600">Estampas Ativadas</p>
            </div>
            <div className="p-6">
              <div className="text-[#00BFFF] text-4xl font-bold mb-2">98%</div>
              <p className="text-gray-600">Satisfação dos Clientes</p>
            </div>
            <div className="p-6">
              <div className="text-[#00BFFF] text-4xl font-bold mb-2">50K+</div>
              <p className="text-gray-600">Interações Mensais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
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

      {/* Benefícios */}
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

      {/* Depoimentos */}
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

      {/* CTA Final */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo className="w-24 h-24 mb-4" />
              <p className="text-gray-400">
                Transformando estampas em experiências interativas através da realidade aumentada.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Funcionalidades</li>
                <li>Preços</li>
                <li>Cases</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacidade</li>
                <li>Termos</li>
                <li>LGPD</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Epic Momentos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;