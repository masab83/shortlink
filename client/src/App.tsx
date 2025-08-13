import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminEarnings from "@/pages/admin/earnings";
import AdminTraffic from "@/pages/admin/traffic";
import AdminAds from "@/pages/admin/ads";
import AdminWithdrawals from "@/pages/admin/withdrawals";
import AdminFraud from "@/pages/admin/fraud";
import UserOverview from "@/pages/user/overview";
import UserLinks from "@/pages/user/links";
import UserReports from "@/pages/user/reports";
import UserReferrals from "@/pages/user/referrals";
import UserWithdrawals from "@/pages/user/withdrawals";
import UserProfile from "@/pages/user/profile";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-royal-black flex items-center justify-center">
        <div className="glass-morphism rounded-xl p-8">
          <div className="animate-spin w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full mx-auto"></div>
          <p className="text-white mt-4">Loading ShrinkEarn...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/s/:shortCode" component={() => window.location.reload()} />
        </>
      ) : (
        <>
          {user?.role === 'admin' ? (
            <>
              <Route path="/" component={AdminDashboard} />
              <Route path="/admin/users" component={AdminUsers} />
              <Route path="/admin/earnings" component={AdminEarnings} />
              <Route path="/admin/traffic" component={AdminTraffic} />
              <Route path="/admin/ads" component={AdminAds} />
              <Route path="/admin/withdrawals" component={AdminWithdrawals} />
              <Route path="/admin/fraud" component={AdminFraud} />
            </>
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/overview" component={UserOverview} />
              <Route path="/links" component={UserLinks} />
              <Route path="/reports" component={UserReports} />
              <Route path="/referrals" component={UserReferrals} />
              <Route path="/withdrawals" component={UserWithdrawals} />
              <Route path="/profile" component={UserProfile} />
            </>
          )}
          <Route path="/s/:shortCode" component={() => window.location.reload()} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
