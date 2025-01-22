import { Home, History, User, BookMarked, HelpCircle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
        <SidebarGroup>
          <SidebarGroupLabel>Epic Momentos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    active={location.pathname === item.path}
                  >
                    <Link to={item.path}>
                      <item.icon />
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