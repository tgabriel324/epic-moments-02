import { AdminLayout } from "@/components/layouts/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#000000]">Dashboard Administrativo</h1>
        <p className="text-[#333333]">
          Bem-vindo ao painel administrativo do Epic Momentos.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;