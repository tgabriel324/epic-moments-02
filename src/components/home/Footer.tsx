
import { Logo } from "@/components/Logo";
import { FC } from "react";

export const Footer: FC = () => {
  return (
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
  );
};
