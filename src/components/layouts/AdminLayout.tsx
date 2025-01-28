import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      if (profile?.user_type !== 'admin') {
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Donos de Negócios",
      url: "/admin/business-owners",
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