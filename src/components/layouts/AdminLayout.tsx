import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Verifica se o usuário é admin
  if (!user || user.user_metadata?.user_type !== 'admin') {
    console.log("Usuário não autorizado tentando acessar área administrativa");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isMobile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex flex-col">
          <header className="border-b p-4 flex items-center justify-between">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <AdminSidebar />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">Epic Momentos Admin</h1>
          </header>
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}