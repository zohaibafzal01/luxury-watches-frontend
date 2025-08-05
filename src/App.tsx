import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
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
import { selectUserInfo } from "./redux/selectors/userSelectors";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const checkAuthFromStorage = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const user = localStorage.getItem("user");
  return {
    isAuthenticated,
    user: user ? JSON.parse(user) : null,
  };
};

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles }) => {
  const userInfo = useSelector(selectUserInfo);
  const [authState, setAuthState] = useState(checkAuthFromStorage());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storageAuth = checkAuthFromStorage();
    setAuthState(storageAuth);
    setIsLoading(false);
  }, [userInfo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-shimmer p-8 rounded-lg">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const currentUser = userInfo || authState?.user;
  const isAuthenticated = Boolean(userInfo) || authState?.isAuthenticated;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && currentUser && !roles.includes(currentUser.role)) {
    switch (currentUser?.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "dealer":
        return <Navigate to="/dealer/dashboard" replace />;
      case "wholesaler":
        return <Navigate to="/wholesaler/dashboard" replace />;
      case "consumer":
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo }) => {
  const userInfo = useSelector(selectUserInfo);
  const [authState, setAuthState] = useState(checkAuthFromStorage());

  useEffect(() => {
    const storageAuth = checkAuthFromStorage();
    setAuthState(storageAuth);
  }, [userInfo]);

  const currentUser = userInfo || authState?.user;
  const isAuthenticated = Boolean(userInfo) || authState?.isAuthenticated;

  if (isAuthenticated && currentUser) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Default role-based redirection
    switch (currentUser.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "dealer":
        return <Navigate to="/dealer/dashboard" replace />;
      case "wholesaler":
        return <Navigate to="/wholesaler/dashboard" replace />;
      case "consumer":
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />

      {/* Authentication Routes - redirect if already logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/admin/login"
        element={
          <PublicRoute redirectTo="/admin/dashboard">
            <AdminLogin />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["consumer"]}>
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

      {/* Dealer Routes */}
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

      {/* Wholesaler Routes */}
      <Route
        path="/wholesaler/dashboard"
        element={
          <ProtectedRoute roles={["wholesaler"]}>
            <WholesalerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Admin />
          </ProtectedRoute>
        }
      />

      {/* General Protected Routes */}
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

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      {" "}
      {/* Add Redux Provider here */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;
