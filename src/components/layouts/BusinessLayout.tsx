import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BusinessMenu } from "@/components/business/BusinessMenu";

export const BusinessLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar className="w-64 bg-white border-r border-gray-100 shadow-sm">
          <BusinessMenu />
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};