import { useAuth } from "@getmocha/users-service/react";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const { exchangeCodeForSessionToken, user } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      exchangeCodeForSessionToken();
    }
  }, [exchangeCodeForSessionToken]);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <div className="animate-spin mb-4">
          <Loader2 className="w-12 h-12 text-white mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Completing sign in...</h2>
        <p className="text-blue-100">Please wait while we verify your credentials</p>
      </div>
    </div>
  );
}
