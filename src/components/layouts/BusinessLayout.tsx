import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Video, 
  QrCode, 
  Eye, 
  BarChart3, 
  CreditCard, 
  Settings,
  LogOut
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";

export const BusinessLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar className="w-64 bg-white border-r">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Epic Momentos</h1>
          </div>
          <div className="px-3 py-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1"
              onClick={() => navigate('/business')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1"
              onClick={() => navigate('/business/stamps')}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Estampas
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1"
              onClick={() => navigate('/business/videos')}
            >
              <Video className="mr-2 h-4 w-4" />
              Vídeos
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1"
              onClick={() => navigate('/business/qrcodes')}
            >
              <QrCode className="mr-2 h-4 w-4" />
              QR Codes
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1"
              onClick={() => navigate('/business/preview')}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview AR
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1"
              onClick={() => navigate('/business/metrics')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Métricas
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1"
              onClick={() => navigate('/business/subscription')}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Assinatura
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1"
              onClick={() => navigate('/business/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};