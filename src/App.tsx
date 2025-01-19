import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import BusinessDashboard from "./pages/business/Dashboard";
import Stamps from "./pages/business/Stamps";
import Videos from "./pages/business/Videos";

const queryClient = new QueryClient();

const App = () => {
  // Removendo temporariamente a lógica de autenticação
  console.log("App rodando em modo de desenvolvimento sem autenticação");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas temporárias sem proteção */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/business" element={<BusinessDashboard />} />
            <Route path="/business/stamps" element={<Stamps />} />
            <Route path="/business/videos" element={<Videos />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;