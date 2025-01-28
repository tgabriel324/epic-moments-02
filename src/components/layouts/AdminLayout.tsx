import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider 
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Activity, Package, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Usuários",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Monitoramento",
    icon: Activity,
    href: "/admin/monitoring",
  },
  {
    title: "Planos",
    icon: Package,
    href: "/admin/plans",
  },
];

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#F5F5F5]">
        <Sidebar>
          <SidebarContent>
            {/* Logo Section */}
            <div className="p-4">
              <div className="flex justify-center mb-6">
                <Logo className="w-16 h-16 transition-transform duration-300 hover:scale-110" />
              </div>
            </div>

            {/* Menu Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#00BFFF]/10 text-[#333333] ${
                            location.pathname === item.href ? "bg-[#00BFFF]/10 text-[#00BFFF]" : ""
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Logout Button */}
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};