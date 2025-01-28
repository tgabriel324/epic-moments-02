import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { Loader2, Camera } from "lucide-react";

export default function Profile() {
  const { profile, isLoading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
  });

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
        </div>
      </UserLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync(formData);
    setIsEditing(false);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-[#00BFFF] text-white">
                    {profile?.first_name?.[0]}
                    {profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>Alterar foto</span>
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      disabled={!isEditing}
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sobrenome</label>
                    <Input
                      disabled={!isEditing}
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Input
                    disabled={!isEditing}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-[#00BFFF]">
                        Salvar
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      className="bg-[#00BFFF]"
                      onClick={() => setIsEditing(true)}
                    >
                      Editar
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}