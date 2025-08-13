import { useQuery } from "@tanstack/react-query";
import { Users, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatCard from "@/components/stats/StatCard";
import EarningsChart from "@/components/charts/EarningsChart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: systemStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: pendingWithdrawals } = useQuery({
    queryKey: ["/api/admin/withdrawals"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Mock system analytics data
  const systemAnalytics = [
    { date: "2024-01-01", earnings: 520.50 },
    { date: "2024-01-02", earnings: 675.75 },
    { date: "2024-01-03", earnings: 842.20 },
    { date: "2024-01-04", earnings: 731.80 },
    { date: "2024-01-05", earnings: 968.40 },
    { date: "2024-01-06", earnings: 1245.60 },
    { date: "2024-01-07", earnings: 1523.30 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-royal-black flex items-center justify-center">
        <div className="glass-morphism rounded-xl p-8">
          <div className="animate-spin w-8 h-8 border-2 border-royal-crimson border-t-transparent rounded-full mx-auto"></div>
          <p className="text-white mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">System overview and management controls.</p>
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active Users"
            value={systemStats?.users?.activeUsers || 8432}
            change="12.5%"
            changeType="positive"
            icon={Users}
            color="emerald"
          />
          <StatCard
            title="Pending Withdrawals"
            value={`$${systemStats?.withdrawals?.pendingWithdrawals || "52,100"}`}
            change="8.2%"
            changeType="positive"
            icon={DollarSign}
            color="gold"
          />
          <StatCard
            title="Flagged Accounts"
            value="23"
            change="5"
            changeType="negative"
            icon={AlertTriangle}
            color="crimson"
          />
        </div>

        {/* System Analytics Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>System Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <EarningsChart data={systemAnalytics} height={300} />
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 bg-gradient-to-r from-royal-emerald to-royal-blue opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">User growth analytics</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "user", message: "New user registered: user@example.com", time: "2 minutes ago", color: "text-royal-emerald" },
                { type: "withdrawal", message: "Withdrawal request: $250.00", time: "5 minutes ago", color: "text-royal-gold" },
                { type: "fraud", message: "Suspicious activity detected: IP 192.168.1.1", time: "10 minutes ago", color: "text-royal-crimson" },
                { type: "link", message: "High-traffic link created: 50K+ views", time: "15 minutes ago", color: "text-royal-blue" },
                { type: "system", message: "System backup completed successfully", time: "1 hour ago", color: "text-royal-purple" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${activity.color.replace('text-', 'bg-')}`}></div>
                    <span className="text-sm">{activity.message}</span>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
