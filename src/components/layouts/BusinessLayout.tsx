
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BusinessMenu } from "@/components/business/BusinessMenu";
import { EditProfileDialog } from "@/components/business/profile/EditProfileDialog";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Loader2, UserCog, Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const BusinessLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useProfile();
  const { signOut } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <div 
            className={`fixed inset-0 z-40 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <div 
              className={`absolute left-0 top-0 h-full w-64 bg-white transform transition-transform duration-300 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="p-4 flex flex-col gap-4">
                {/* Logo */}
                <div className="flex justify-center mb-2">
                  <Logo className="w-16 h-16 transition-transform duration-300 hover:scale-110" />
                </div>

                {/* Profile Section */}
                {profile && (
                  <div className="flex items-center gap-3 px-2">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {profile.first_name?.[0] || profile.company_name?.[0] || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {profile.first_name
                          ? `${profile.first_name} ${profile.last_name || ''}`
                          : profile.company_name || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {profile.company_name || ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={signOut}
                    title="Sair"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Navigation Menu */}
              <BusinessMenu />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar className="w-64 bg-white border-r border-gray-100 shadow-sm">
            <div className="p-4 flex flex-col gap-4">
              {/* Logo */}
              <div className="flex justify-center mb-2">
                <Logo className="w-16 h-16 transition-transform duration-300 hover:scale-110" />
              </div>

              {/* Profile Section */}
              {profile && (
                <div className="flex items-center gap-3 px-2">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {profile.first_name?.[0] || profile.company_name?.[0] || '?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profile.first_name
                        ? `${profile.first_name} ${profile.last_name || ''}`
                        : profile.company_name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {profile.company_name || ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={signOut}
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <BusinessMenu />
          </Sidebar>
        )}

        {/* Edit Profile Dialog */}
        <EditProfileDialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
        />

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto ${isMobile ? 'pt-16' : ''}`}>
          <div className="container mx-auto p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
