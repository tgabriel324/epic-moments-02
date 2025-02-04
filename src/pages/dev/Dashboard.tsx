import { DevLayout } from "@/components/layouts/DevLayout";

export default function DevDashboard() {
  return (
    <DevLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#000000] to-[#00BFFF] bg-clip-text text-transparent">
            Dev Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Central de desenvolvimento para acesso rápido a todas as páginas do sistema
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Área Administrativa</h2>
            <p className="text-sm text-muted-foreground">
              Acesse todas as páginas da área administrativa do sistema
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Área de Negócios</h2>
            <p className="text-sm text-muted-foreground">
              Acesse todas as páginas da área de negócios do sistema
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Área do Usuário</h2>
            <p className="text-sm text-muted-foreground">
              Acesse todas as páginas da área do usuário final do sistema
            </p>
          </div>
        </div>
      </div>
    </DevLayout>
  );
}