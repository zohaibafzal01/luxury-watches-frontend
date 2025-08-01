import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ServiceRequest from "./pages/ServiceRequest";
import DealerDashboard from "./pages/DealerDashboard";
import MyRequests from "./pages/MyRequests";
import Inventory from "./pages/Inventory";
import Admin from "./pages/Admin";
import Messages from "./pages/Messages";
import BidListing from "./pages/BidListing";
import NotFound from "./pages/NotFound";
import WholesalerDashboard from "./pages/WholesalerDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import { AdminLogin } from "./components/auth/AdminLogin";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-shimmer p-8 rounded-lg">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/admin/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AdminLogin />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-settings"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-request"
        element={
          <ProtectedRoute roles={["consumer"]}>
            <ServiceRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute roles={["consumer"]}>
            <MyRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/dashboard"
        element={
          <ProtectedRoute roles={["dealer"]}>
            <DealerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/inventory"
        element={
          <ProtectedRoute roles={["dealer"]}>
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wholesaler/dashboard"
        element={
          <ProtectedRoute roles={["wholesaler"]}>
            <WholesalerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bid-listing"
        element={
          <ProtectedRoute>
            <BidListing />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
