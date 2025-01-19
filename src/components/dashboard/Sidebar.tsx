import { Link, useLocation } from "react-router-dom";
import { Sparkles, ImageIcon, Video, Link as LinkIcon, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const menuItems = [
    {
      name: "Estampas",
      icon: ImageIcon,
      path: "/business-dashboard/stamps"
    },
    {
      name: "Vídeos",
      icon: Video,
      path: "/business-dashboard/videos"
    },
    {
      name: "Vinculações",
      icon: LinkIcon,
      path: "/business-dashboard/links"
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-[#C4C4C4] p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="w-8 h-8 text-[#00BFFF]" />
        <span className="text-xl font-bold text-[#000000]">Epic Moments</span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-[#00BFFF] text-white"
                    : "text-[#333333] hover:bg-[#F5F5F5]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 text-[#333333] hover:bg-[#F5F5F5] rounded-lg transition-colors mt-auto"
      >
        <LogOut className="w-5 h-5" />
        Sair
      </button>
    </div>
  );
};