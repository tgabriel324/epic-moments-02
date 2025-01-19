import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  Video,
  QrCode,
  Eye,
  BarChart3,
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export const BusinessMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <Logo className="w-8 h-8" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
          Epic Momentos
        </h1>
      </div>
      
      <div className="px-3 py-2 flex-1">
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 text-gray-700 hover:text-[#00BFFF] hover:bg-blue-50"
          onClick={() => navigate('/business')}
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 text-gray-700 hover:text-[#00BFFF] hover:bg-blue-50"
          onClick={() => navigate('/business/stamps')}
        >
          <Image className="mr-3 h-5 w-5" />
          Estampas
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 text-gray-700 hover:text-[#00BFFF] hover:bg-blue-50"
          onClick={() => navigate('/business/videos')}
        >
          <Video className="mr-3 h-5 w-5" />
          Vídeos
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 text-gray-700 hover:text-[#00BFFF] hover:bg-blue-50"
          onClick={() => navigate('/business/qrcodes')}
        >
          <QrCode className="mr-3 h-5 w-5" />
          QR Codes
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 text-gray-700 hover:text-[#00BFFF] hover:bg-blue-50"
          onClick={() => navigate('/business/preview')}
        >
          <Eye className="mr-3 h-5 w-5" />
          Preview AR
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 text-gray-700 hover:text-[#00BFFF] hover:bg-blue-50"
          onClick={() => navigate('/business/metrics')}
        >
          <BarChart3 className="mr-3 h-5 w-5" />
          Métricas
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 text-gray-700 hover:text-[#00BFFF] hover:bg-blue-50"
          onClick={() => navigate('/business/subscription')}
        >
          <CreditCard className="mr-3 h-5 w-5" />
          Assinatura
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 text-gray-700 hover:text-[#00BFFF] hover:bg-blue-50"
          onClick={() => navigate('/business/settings')}
        >
          <Settings className="mr-3 h-5 w-5" />
          Configurações
        </Button>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => navigate('/login')}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};