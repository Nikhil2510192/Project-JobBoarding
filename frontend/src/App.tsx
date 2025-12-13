import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/user" element={<UserSignup />} />
          <Route path="/signup/company" element={<CompanySignup />} />
          <Route path="/login" element={<Login />} />

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard/profile" element={<UserDashboardProfile />} />
            <Route path="dashboard/resume" element={<UserDashboardResume />} />
            <Route path="home" element={<UserHome />} />
            <Route path="insights" element={<UserInsights />} />
            <Route path="messages" element={<UserMessages />} />
            <Route path="discover" element={<UserDiscover />} />
          </Route>

          {/* Company Routes */}
          <Route path="/company" element={<CompanyLayout />}>
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
  </QueryClientProvider>
);

export default App;
