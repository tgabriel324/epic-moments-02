import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  Image,
  Video,
  QrCode,
  Settings,
  LogOut,
  Wand2,
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
      href: "/business/ar",
      label: "Realidade Aumentada",
      icon: Wand2,
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
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="text-xl font-semibold text-[#00BFFF]">Epic Moments</span>
        </div>
      </div>
      
      <div className="flex-1 px-3 py-2">
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

      <div className="px-3 py-2 mt-auto">
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