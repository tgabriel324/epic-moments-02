import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const BusinessDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#000000]">
          Bem-vindo ao seu Dashboard
        </h1>
        <p className="text-[#333333]">
          Gerencie suas estampas, vídeos e vinculações de forma simples e intuitiva.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;