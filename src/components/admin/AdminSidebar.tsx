import { LayoutDashboard, Users, Activity, CreditCard, BookOpen } from "lucide-react";
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

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    title: "Usuários",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Monitoramento",
    icon: Activity,
    path: "/admin/monitoring",
  },
  {
    title: "Planos",
    icon: CreditCard,
    path: "/admin/plans",
  },
  {
    title: "Manual",
    icon: BookOpen,
    path: "/admin/manual",
  },
];

export function AdminSidebar() {
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
        <SidebarGroupLabel>Administração</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
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