import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ImageIcon,
  Settings,
  BarChart3,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/business/dashboard",
  },
  {
    title: "Mídia",
    icon: ImageIcon,
    href: "/business/media",
  },
  {
    title: "Métricas",
    icon: BarChart3,
    href: "/business/metrics",
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/business/settings",
  },
];

export function BusinessMenu() {
  const location = useLocation();

  return (
    <nav className="grid items-start gap-2">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            location.pathname === item.href ? "bg-accent" : "transparent"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}