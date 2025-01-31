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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const sidebarContent = (
    <SidebarContent className="h-full">
      <div className={`p-6 ${isMobile ? 'pt-8' : ''}`}>
        <div className="flex justify-center mb-8">
          <Logo className="w-12 h-12 transition-transform duration-300 hover:scale-110" />
        </div>
      </div>
      <SidebarGroup>
        <SidebarGroupLabel className="px-6 text-sm font-medium text-gray-500">
          Epic Momentos
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  className={`px-6 py-3 w-full transition-colors hover:bg-muted ${
                    location.pathname === item.path 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.title}</span>
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
    <Sidebar className="border-r border-gray-100">
      {sidebarContent}
    </Sidebar>
  );
}