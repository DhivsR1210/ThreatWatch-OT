import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Analytics from "./pages/Analytics";
import Assets from "./pages/Assets";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import MainLayout from "./layouts/MainLayout";

function ProtectedPage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path="/dashboard" element={<ProtectedPage><MainLayout><Dashboard /></MainLayout></ProtectedPage>} />
      <Route path="/assets" element={<ProtectedPage><MainLayout><Assets /></MainLayout></ProtectedPage>} />
      <Route path="/analytics" element={<ProtectedPage><MainLayout><Analytics /></MainLayout></ProtectedPage>} />
      <Route path="/reports" element={<ProtectedPage><MainLayout><Reports /></MainLayout></ProtectedPage>} />
      <Route path="/settings" element={<ProtectedPage><MainLayout><Settings /></MainLayout></ProtectedPage>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
