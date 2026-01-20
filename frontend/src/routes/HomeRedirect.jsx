import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { checkSessionApi } from "../api/session";

export default function HomeRedirect() {
  const { isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: checkSessionApi,
    retry: false,
  });

  if (isLoading) return null; // or a loader

  if (isError) return <Navigate to="/login" replace />;

  return <Navigate to="/dashboard" replace />;
}