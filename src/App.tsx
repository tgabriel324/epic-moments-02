import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/business/Dashboard";
import Media from "@/pages/business/Media";
import Stamps from "@/pages/business/Stamps";
import Videos from "@/pages/business/Videos";
import QRCodes from "@/pages/business/QRCodes";
import Plans from "@/pages/business/Plans";
import View from "@/pages/ar/View";
import Landing from "@/pages/ar/Landing";
import Scanner from "@/pages/ar/Scanner"; // Nova importação
import AR from "@/pages/business/AR";
import Metrics from "@/pages/business/Metrics";
import UserDashboard from "@/pages/user/Dashboard";
import History from "@/pages/user/History";
import Profile from "@/pages/user/Profile";
import Collection from "@/pages/user/Collection";
import Help from "@/pages/user/Help";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminMonitoring from "@/pages/admin/Monitoring";
import AdminPlans from "@/pages/admin/Plans";
import Manual from "@/pages/admin/Manual";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Business Routes */}
            <Route path="/business/dashboard" element={<Dashboard />} />
            <Route path="/business/media" element={<Media />} />
            <Route path="/business/stamps" element={<Stamps />} />
            <Route path="/business/videos" element={<Videos />} />
            <Route path="/business/qrcodes" element={<QRCodes />} />
            <Route path="/business/plans" element={<Plans />} />
            <Route path="/business/metrics" element={<Metrics />} />
            <Route path="/business/ar" element={<AR />} />
            
            {/* User Routes */}
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/history" element={<History />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/collection" element={<Collection />} />
            <Route path="/user/help" element={<Help />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/monitoring" element={<AdminMonitoring />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/manual" element={<Manual />} />
            
            {/* AR Routes */}
            <Route path="/ar/landing/:stampId" element={<Landing />} />
            <Route path="/ar/view/:stampId" element={<View />} />
            <Route path="/ar/scanner" element={<Scanner />} /> {/* Nova rota */}
          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;