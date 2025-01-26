import { Home, History, User, BookMarked, HelpCircle } from "lucide-react";
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

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/user/dashboard",
  },
  {
    title: "Histórico",
    icon: History,
    path: "/user/history",
  },
  {
    title: "Perfil",
    icon: User,
    path: "/user/profile",
  },
  {
    title: "Coleção",
    icon: BookMarked,
    path: "/user/collection",
  },
  {
    title: "Ajuda",
    icon: HelpCircle,
    path: "/user/help",
  },
];

export function UserSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16 transition-transform duration-300 hover:scale-110" />
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Epic Momentos</SidebarGroupLabel>
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
    </Sidebar>
  );
}