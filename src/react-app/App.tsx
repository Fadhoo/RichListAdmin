import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import LoginPage from "@/react-app/pages/Login";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import DashboardPage from "@/react-app/pages/Dashboard";
import VenuesPage from "@/react-app/pages/Venues";
import EventsPage from "@/react-app/pages/Events";
import StoriesPage from "@/react-app/pages/Stories";
import BookingsPage from "@/react-app/pages/Bookings";
import ConciergePage from "@/react-app/pages/Concierge";
import UsersPage from "@/react-app/pages/Users";
// import ProtectedRoute from "@/react-app/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Global retry count for all queries
      retryOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});


// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = localStorage.getItem("tkn");
  if (auth === null) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/venues" element={<ProtectedRoute><VenuesPage /></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
            <Route path="/admin/stories" element={<ProtectedRoute><StoriesPage /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
            <Route path="/admin/concierge" element={<ProtectedRoute><ConciergePage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
