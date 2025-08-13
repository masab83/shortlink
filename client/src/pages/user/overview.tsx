import { useQuery } from "@tanstack/react-query";
import { Eye, DollarSign, Globe, UserPlus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import StatCard from "@/components/stats/StatCard";
import EarningsChart from "@/components/charts/EarningsChart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function UserOverview() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: referrals } = useQuery({
    queryKey: ["/api/referrals"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Mock earnings data for chart
  const earningsData = [
    { date: "2024-01-01", earnings: 12.50 },
    { date: "2024-01-02", earnings: 18.75 },
    { date: "2024-01-03", earnings: 24.20 },
    { date: "2024-01-04", earnings: 31.80 },
    { date: "2024-01-05", earnings: 28.40 },
    { date: "2024-01-06", earnings: 45.60 },
    { date: "2024-01-07", earnings: 52.30 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-royal-black flex items-center justify-center">
        <div className="glass-morphism rounded-xl p-8">
          <div className="animate-spin w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full mx-auto"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's your earning summary.</p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={analytics?.totalViews || 0}
            change="12.3%"
            changeType="positive"
            icon={Eye}
            color="emerald"
          />
          <StatCard
            title="Total Earnings"
            value={`$${user?.totalEarnings || "0.00"}`}
            change="8.7%"
            changeType="positive"
            icon={DollarSign}
            color="gold"
          />
          <StatCard
            title="Top Countries"
            value="🇺🇸 🇬🇧 🇩🇪"
            change="15.2%"
            changeType="positive"
            icon={Globe}
            color="blue"
          />
          <StatCard
            title="Referral Earnings"
            value={`$${referrals?.reduce((sum: number, ref: any) => sum + parseFloat(ref.totalEarnings || 0), 0).toFixed(2) || "0.00"}`}
            change="5.4%"
            changeType="positive"
            icon={UserPlus}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Earnings Trend</h3>
            <EarningsChart data={earningsData} height={250} />
          </div>
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
            <div className="h-64 bg-gradient-to-r from-royal-emerald to-royal-gold opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Traffic analytics coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
