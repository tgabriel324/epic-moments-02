import { AdminLayout } from "@/components/layouts/AdminLayout";

const AdminPlans = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#000000]">Planos e Assinaturas</h1>
        <p className="text-[#333333]">
          Gerencie os planos e assinaturas disponíveis na plataforma.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminPlans;