import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  QrCode,
  CreditCard,
  Video,
  View,
  BarChart3
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/business/dashboard",
  },
  {
    title: "Mídia",
    icon: Image,
    href: "/business/media",
  },
  {
    title: "Estampas",
    icon: Image,
    href: "/business/stamps",
  },
  {
    title: "Vídeos",
    icon: Video,
    href: "/business/videos",
  },
  {
    title: "QR Codes",
    icon: QrCode,
    href: "/business/qrcodes",
  },
  {
    title: "Planos",
    icon: CreditCard,
    href: "/business/plans",
  },
  {
    title: "Métricas",
    icon: BarChart3,
    href: "/business/metrics",
  },
  {
    title: "Visualizar AR",
    icon: View,
    href: "/business/ar",
  },
];

export function BusinessMenu() {
  const location = useLocation();

  return (
    <nav className="space-y-2 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              isActive ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}