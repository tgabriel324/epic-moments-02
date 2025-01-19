import { Home, Image, Video, QrCode, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: Home,
    path: "/business",
  },
  {
    name: "Estampas",
    icon: Image,
    path: "/business/stamps",
  },
  {
    name: "Vídeos",
    icon: Video,
    path: "/business/videos",
  },
  {
    name: "QR Codes",
    icon: QrCode,
    path: "/business/qrcodes",
  },
  {
    name: "Métricas",
    icon: BarChart3,
    path: "/business/metrics",
  },
];

export const BusinessMenu = () => {
  const location = useLocation();

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
                ${
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              `}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};