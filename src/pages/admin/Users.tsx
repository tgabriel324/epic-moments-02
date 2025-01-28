import { AdminLayout } from "@/components/layouts/AdminLayout";

const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#000000]">Gestão de Usuários</h1>
        <p className="text-[#333333]">
          Gerencie os usuários da plataforma Epic Momentos.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;