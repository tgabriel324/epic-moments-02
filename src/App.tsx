import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import BusinessDashboard from "@/pages/business/Dashboard";
import BusinessStamps from "@/pages/business/Stamps";
import BusinessVideos from "@/pages/business/Videos";
import AdminDashboard from "@/pages/admin/Dashboard";
import ARView from "@/pages/ar/View";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/business">
            <Route path="dashboard" element={<BusinessDashboard />} />
            <Route path="stamps" element={<BusinessStamps />} />
            <Route path="videos" element={<BusinessVideos />} />
          </Route>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/ar/:stampId" element={<ARView />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;