import { AdminLayout } from "@/components/layouts/AdminLayout";

const AdminMonitoring = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#000000]">Monitoramento</h1>
        <p className="text-[#333333]">
          Monitore o desempenho e a saúde da plataforma.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminMonitoring;