import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Image,
  Video,
  QrCode,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function BusinessMenu() {
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    {
      href: "/business/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/business/stamps",
      label: "Estampas",
      icon: Image,
    },
    {
      href: "/business/videos",
      label: "Vídeos",
      icon: Video,
    },
    {
      href: "/business/qrcodes",
      label: "QR Codes",
      icon: QrCode,
    },
    {
      href: "/business/settings",
      label: "Configurações",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start")}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}