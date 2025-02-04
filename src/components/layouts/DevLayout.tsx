import { SidebarProvider } from "@/components/ui/sidebar";
import { DevSidebar } from "@/components/dev/DevSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface DevLayoutProps {
  children: React.ReactNode;
}

export function DevLayout({ children }: DevLayoutProps) {
  const isMobile = useIsMobile();

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
                <DevSidebar />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">Epic Momentos Dev</h1>
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
        <DevSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}