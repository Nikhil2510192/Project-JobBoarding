import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireOnboarding from "@/components/RequireOnboarding";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";

// Auth Pages
import Welcome from "./pages/Welcome";
import Signup from "./pages/Signup";
import UserSignup from "./pages/UserSignup";
import CompanySignup from "./pages/CompanySignup";
import Login from "./pages/Login";

// User Pages
import { UserLayout } from "./components/layouts/UserLayout";
import UserDashboardProfile from "./pages/user/UserDashboardProfile";
import UserDashboardResume from "./pages/user/UserDashboardResume";
import UserHome from "./pages/user/UserHome";
import UserInsights from "./pages/user/UserInsights";
import UserMessages from "./pages/user/UserMessages";
import UserDiscover from "./pages/user/UserDiscover";

// Company Pages
import { CompanyLayout } from "./components/layouts/CompanyLayout";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyJobDetails from "./pages/company/CompanyJobDetails";
import CompanyJobs from "./pages/company/CompanyJobs";
import CompanyCandidates from "./pages/company/CompanyCandidates";
import CompanySettings from "./pages/company/CompanySettings";

import NotFound from "./pages/NotFound";
import { useAuth } from "@/context/AuthContext";

const queryClient = new QueryClient();

const PublicHome = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/user/home" replace /> : <Welcome />;
};

const UserGate = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <UserLayout /> : <Navigate to="/" replace />;
};

const CompanyGate = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <CompanyLayout /> : <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/user" element={<UserSignup />} />
          <Route path="/signup/company" element={<CompanySignup />} />
          <Route path="/login" element={<Login />} />

          {/* Onboarding Routes (Top bar with only Logout, no sidebar) */}
          <Route element={<OnboardingLayout />}>
            <Route path="/user/dashboard/profile" element={<UserDashboardProfile />} />
            <Route path="/user/dashboard/resume" element={<UserDashboardResume />} />
          </Route>

          {/* User Protected Routes */}
          <Route path="/user" element={<UserGate />}>
            <Route
              path="home"
              element={
                <RequireOnboarding>
                  <UserHome />
                </RequireOnboarding>
              }
            />
            <Route
              path="insights"
              element={
                <RequireOnboarding>
                  <UserInsights />
                </RequireOnboarding>
              }
            />
            <Route
              path="messages"
              element={
                <RequireOnboarding>
                  <UserMessages />
                </RequireOnboarding>
              }
            />
            <Route
              path="discover"
              element={
                <RequireOnboarding>
                  <UserDiscover />
                </RequireOnboarding>
              }
            />
          </Route>

          {/* Company Routes */}
          <Route path="/company" element={<CompanyGate />}>
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="job/:id" element={<CompanyJobDetails />} />
            <Route path="jobs" element={<CompanyJobs />} />
            <Route path="candidates" element={<CompanyCandidates />} />
            <Route path="settings" element={<CompanySettings />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
