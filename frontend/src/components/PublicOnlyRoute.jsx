import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function PublicOnlyRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-slate-300">Loading…</div>;
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default PublicOnlyRoute;
