import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { checkSessionApi } from "../api/session";

export default function ProtectedRoute({ children }) {
  const { isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: checkSessionApi,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/60">Checking session...</p>
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
