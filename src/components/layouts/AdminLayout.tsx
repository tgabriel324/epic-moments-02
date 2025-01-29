import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider 
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Activity, Package, Shield } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useProfile } from "@/hooks/useProfile";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log("Verificando sessão do usuário...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Usuário não está autenticado");
          toast.error("Você precisa estar logado para acessar esta área");
          navigate('/login');
          return;
        }

        console.log("Verificando perfil do usuário...");
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          toast.error("Erro ao verificar permissões");
          navigate('/');
          return;
        }

        if (profile?.user_type !== 'admin') {
          console.log("Usuário não é admin:", profile?.user_type);
          toast.error("Você não tem permissão para acessar esta área");
          navigate('/');
          return;
        }

        console.log("Usuário admin verificado com sucesso");
      } catch (error) {
        console.error("Erro na verificação de admin:", error);
        toast.error("Erro ao verificar permissões");
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Usuários",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Monitoramento",
      url: "/admin/monitoring",
      icon: Activity,
    },
    {
      title: "Planos",
      url: "/admin/plans",
      icon: Package,
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#F5F5F5]">
        <Sidebar className="w-64 bg-white border-r border-gray-100">
          <SidebarContent>
            {/* Logo */}
            <div className="p-4 flex justify-center">
              <Logo className="w-16 h-16 transition-transform duration-300 hover:scale-110" />
            </div>

            {/* Admin Profile */}
            {profile && (
              <div className="px-4 py-3 mb-4 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#00BFFF]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#00BFFF]" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.first_name
                        ? `${profile.first_name} ${profile.last_name || ''}`
                        : 'Administrador'}
                    </p>
                    <p className="text-xs text-[#00BFFF] flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Admin
                    </p>
                  </div>
                </div>
              </div>
            )}

            <SidebarGroup>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a 
                          href={item.url}
                          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#00BFFF]/10 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};