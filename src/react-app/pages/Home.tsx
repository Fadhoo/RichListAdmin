import { useAuth } from "@getmocha/users-service/react";
import { Navigate } from "react-router";
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin">
          <Loader2 className="w-10 h-10 text-white" />
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/login" replace />;
}
