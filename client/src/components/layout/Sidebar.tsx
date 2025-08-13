import { Link, useLocation } from "wouter";
import { BarChart3, Link as LinkIcon, TrendingUp, Users, CreditCard, Settings, Crown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { path: "/overview", icon: BarChart3, label: "Overview" },
  { path: "/links", icon: LinkIcon, label: "My Links" },
  { path: "/reports", icon: TrendingUp, label: "Reports" },
  { path: "/referrals", icon: Users, label: "Referrals" },
  { path: "/withdrawals", icon: CreditCard, label: "Withdrawals" },
  { path: "/profile", icon: Settings, label: "Profile Settings" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-royal-gray border-r border-white border-opacity-10 min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-white border-opacity-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 royal-gradient rounded-lg flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Royal Dashboard</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-royal-gold font-semibold">Balance: ${user?.totalEarnings || "0.00"}</span>
          <div className="w-8 h-8 bg-royal-purple rounded-full flex items-center justify-center">
            {user?.firstName?.[0] || user?.email?.[0] || "U"}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (location === "/" && item.path === "/overview");
          
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-all",
                  isActive
                    ? "bg-royal-purple text-white"
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
