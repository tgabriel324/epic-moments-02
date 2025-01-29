import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, Clock, Database, Server } from "lucide-react";
import { MetricsChart } from "@/components/business/metrics/MetricsChart";

const AdminMonitoring = () => {
  const services = [
    { name: "API", status: "operational", latency: "45ms" },
    { name: "Database", status: "operational", latency: "120ms" },
    { name: "Storage", status: "operational", latency: "85ms" },
    { name: "CDN", status: "operational", latency: "35ms" },
  ];

  const recentLogs = [
    { id: 1, type: "error", message: "Failed to process video upload", timestamp: "2024-03-10 14:30" },
    { id: 2, type: "warning", message: "High CPU usage detected", timestamp: "2024-03-10 14:25" },
    { id: 3, type: "info", message: "New business subscription activated", timestamp: "2024-03-10 14:20" },
    { id: 4, type: "success", message: "Database backup completed", timestamp: "2024-03-10 14:15" },
  ];

  const performanceData = [
    { month: "Jan", views: 2400, interactions: 1800 },
    { month: "Fev", views: 3200, interactions: 2400 },
    { month: "Mar", views: 4100, interactions: 3100 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#000000]">Monitoramento do Sistema</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {service.name}
                </CardTitle>
                {service.name === "API" && <Server className="h-4 w-4 text-muted-foreground" />}
                {service.name === "Database" && <Database className="h-4 w-4 text-muted-foreground" />}
                {service.name === "Storage" && <Database className="h-4 w-4 text-muted-foreground" />}
                {service.name === "CDN" && <Activity className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="success">
                    {service.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.latency}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {log.type === "error" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    {log.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    {log.type === "info" && <Activity className="h-5 w-5 text-blue-500" />}
                    {log.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Performance do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricsChart
                data={performanceData}
                title="Métricas de Performance"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMonitoring;