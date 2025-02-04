import { LayoutDashboard, Users, Activity, CreditCard, Image, Video, QrCode, BarChart3, Eye, User, History, BookMarked, HelpCircle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = {
  admin: [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Usuários", icon: Users, path: "/admin/users" },
    { title: "Monitoramento", icon: Activity, path: "/admin/monitoring" },
    { title: "Planos", icon: CreditCard, path: "/admin/plans" },
    { title: "Manual", icon: BookMarked, path: "/admin/manual" },
  ],
  business: [
    { title: "Dashboard", icon: LayoutDashboard, path: "/business/dashboard" },
    { title: "Mídia", icon: Image, path: "/business/media" },
    { title: "Estampas", icon: Image, path: "/business/stamps" },
    { title: "Vídeos", icon: Video, path: "/business/videos" },
    { title: "QR Codes", icon: QrCode, path: "/business/qrcodes" },
    { title: "Planos", icon: CreditCard, path: "/business/plans" },
    { title: "Métricas", icon: BarChart3, path: "/business/metrics" },
    { title: "Visualizar AR", icon: Eye, path: "/business/ar" },
  ],
  user: [
    { title: "Dashboard", icon: LayoutDashboard, path: "/user/dashboard" },
    { title: "Histórico", icon: History, path: "/user/history" },
    { title: "Perfil", icon: User, path: "/user/profile" },
    { title: "Coleção", icon: BookMarked, path: "/user/collection" },
    { title: "Ajuda", icon: HelpCircle, path: "/user/help" },
  ],
};

export function DevSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();

  const sidebarContent = (
    <SidebarContent className="h-full">
      <div className={`p-4 ${isMobile ? 'pt-8' : ''}`}>
        <div className="flex justify-center mb-6">
          <Logo className="w-12 h-12 transition-transform duration-300 hover:scale-110" />
        </div>
      </div>

      <SidebarGroup>
        <SidebarGroupLabel>Admin</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.admin.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  className={location.pathname === item.path ? "bg-[#00BFFF]/10 text-[#00BFFF]" : ""}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Business</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.business.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  className={location.pathname === item.path ? "bg-[#00BFFF]/10 text-[#00BFFF]" : ""}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>User</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.user.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  className={location.pathname === item.path ? "bg-[#00BFFF]/10 text-[#00BFFF]" : ""}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );

  if (isMobile) {
    return sidebarContent;
  }

  return (
    <Sidebar>
      {sidebarContent}
    </Sidebar>
  );
}