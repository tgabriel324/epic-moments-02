import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/business/Dashboard";
import Media from "@/pages/business/Media";
import View from "@/pages/ar/View";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business/dashboard" element={<Dashboard />} />
        <Route path="/business/media" element={<Media />} />
        <Route path="/ar/view/:stampId" element={<View />} />
      </Routes>
    </Router>
  );
}

export default App;