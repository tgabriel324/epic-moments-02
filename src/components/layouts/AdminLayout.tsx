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
import { LayoutDashboard, Users, Activity, Package } from "lucide-react";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

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
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a 
                          href={item.url}
                          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#00BFFF]/10 text-[#333333]"
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