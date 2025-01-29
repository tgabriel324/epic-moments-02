import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Filter } from "lucide-react";

const AdminUsers = () => {
  const users = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@empresa.com",
      type: "business_owner",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      type: "end_user",
      status: "active",
      createdAt: "2024-02-01",
    },
    {
      id: 3,
      name: "Carlos Oliveira",
      email: "carlos@admin.com",
      type: "admin",
      status: "active",
      createdAt: "2023-12-10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#000000]">Gestão de Usuários</h1>
          <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários da Plataforma</CardTitle>
            <div className="flex gap-4 mt-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Buscar usuários..."
                  className="max-w-sm"
                />
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome/Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.type === 'admin' ? 'destructive' : user.type === 'business_owner' ? 'default' : 'secondary'}>
                          {user.type === 'admin' ? 'Admin' : user.type === 'business_owner' ? 'Empresa' : 'Usuário'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="ghost" className="text-[#00BFFF] hover:text-[#00BFFF]/90">
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;