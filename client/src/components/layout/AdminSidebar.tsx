import { Link, useLocation } from "wouter";
import { Users, DollarSign, Activity, Target, CreditCard, AlertTriangle, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const adminMenuItems = [
  { path: "/", icon: Users, label: "User Management" },
  { path: "/admin/earnings", icon: DollarSign, label: "Earnings Control" },
  { path: "/admin/traffic", icon: Activity, label: "Traffic & Logs" },
  { path: "/admin/ads", icon: Target, label: "Ads Management" },
  { path: "/admin/withdrawals", icon: CreditCard, label: "Withdrawals" },
  { path: "/admin/fraud", icon: AlertTriangle, label: "Fraud Detection" },
];

export default function AdminSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-royal-gray border-r border-white border-opacity-10 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-royal-crimson to-royal-purple border-b border-white border-opacity-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-royal-crimson rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Admin Control Center</span>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-royal-gold font-semibold">System Status: Optimal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-all",
                  isActive
                    ? "bg-royal-crimson text-white"
                    : "text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => window.location.href = "/api/logout"}
          className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5 rounded-lg transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
