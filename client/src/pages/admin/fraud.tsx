import { useState } from "react";
import { AlertTriangle, Shield, Ban, Eye, Search, Filter } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatCard from "@/components/stats/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminFraud() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  // Mock fraud detection data
  const fraudAlerts = [
    {
      id: 1,
      type: "Rapid Clicking",
      user: "user123@example.com",
      ip: "192.168.1.100",
      country: "🇺🇸",
      severity: "high",
      description: "User clicked 50+ links in 2 minutes",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: "active",
      actions: 15,
    },
    {
      id: 2,
      type: "Bot Traffic",
      user: "bot_user@email.com",
      ip: "10.0.0.45",
      country: "🇬🇧",
      severity: "high",
      description: "Automated behavior patterns detected",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: "investigated",
      actions: 8,
    },
    {
      id: 3,
      type: "VPN/Proxy",
      user: "anonymous@temp.com",
      ip: "172.16.0.234",
      country: "🇩🇪",
      severity: "medium",
      description: "Traffic from known VPN service",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      status: "active",
      actions: 3,
    },
    {
      id: 4,
      type: "Multiple Accounts",
      user: "multi1@email.com",
      ip: "203.0.113.12",
      country: "🇯🇵",
      severity: "medium",
      description: "Same device registered 5+ accounts",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      status: "resolved",
      actions: 12,
    },
    {
      id: 5,
      type: "Suspicious Earnings",
      user: "highearner@mail.com",
      ip: "198.51.100.5",
      country: "🇦🇺",
      severity: "low",
      description: "Unusually high earnings rate",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      status: "active",
      actions: 2,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-royal-crimson bg-royal-crimson bg-opacity-20";
      case "medium": return "text-royal-gold bg-royal-gold bg-opacity-20";
      case "low": return "text-gray-400 bg-gray-400 bg-opacity-20";
      default: return "text-gray-400 bg-gray-400 bg-opacity-20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-royal-crimson bg-royal-crimson bg-opacity-20";
      case "investigated": return "text-royal-gold bg-royal-gold bg-opacity-20";
      case "resolved": return "text-royal-emerald bg-royal-emerald bg-opacity-20";
      default: return "text-gray-400 bg-gray-400 bg-opacity-20";
    }
  };

  const filteredAlerts = fraudAlerts.filter(alert => {
    const matchesSearch = alert.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.ip.includes(searchTerm) ||
                         alert.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fraud Detection</h1>
          <p className="text-gray-400">Monitor and investigate suspicious activities.</p>
        </div>

        {/* Fraud Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Alerts"
            value={fraudAlerts.filter(a => a.status === "active").length}
            change="5"
            changeType="negative"
            icon={AlertTriangle}
            color="crimson"
          />
          <StatCard
            title="Blocked IPs"
            value="1,247"
            change="23"
            changeType="positive"
            icon={Ban}
            color="gold"
          />
          <StatCard
            title="Protected Revenue"
            value="$18,240"
            change="12.5%"
            changeType="positive"
            icon={Shield}
            color="emerald"
          />
          <StatCard
            title="Detection Rate"
            value="94.2%"
            change="2.1%"
            changeType="positive"
            icon={Eye}
            color="blue"
          />
        </div>

        {/* Search and Filters */}
        <Card className="glass-morphism border-white border-opacity-10 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by user, IP, or alert type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white bg-opacity-5 border-white border-opacity-20"
                />
              </div>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-48 bg-white bg-opacity-5 border-white border-opacity-20">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent className="bg-royal-gray border-white border-opacity-20">
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="royal-gradient">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fraud Detection Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>Active Detection Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rule: "Rapid Click Detection", threshold: "10 clicks/minute", status: "active" },
                  { rule: "Bot Pattern Analysis", threshold: "ML confidence > 85%", status: "active" },
                  { rule: "VPN/Proxy Detection", threshold: "Known IP ranges", status: "active" },
                  { rule: "Multiple Account Detection", threshold: "Same device/IP", status: "active" },
                  { rule: "Earnings Anomaly", threshold: "3x average CPM", status: "paused" },
                ].map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                    <div>
                      <div className="font-medium">{rule.rule}</div>
                      <div className="text-sm text-gray-400">Threshold: {rule.threshold}</div>
                    </div>
                    <Badge className={rule.status === "active" ? "bg-royal-emerald" : "bg-gray-500"}>
                      {rule.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>Recent Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Banned IP", target: "192.168.1.50", time: "5 minutes ago", type: "ban" },
                  { action: "User Suspended", target: "fraud@user.com", time: "15 minutes ago", type: "suspend" },
                  { action: "Earnings Withheld", target: "$245.30", time: "30 minutes ago", type: "withhold" },
                  { action: "Account Flagged", target: "suspicious@email.com", time: "1 hour ago", type: "flag" },
                  { action: "IP Whitelisted", target: "203.0.113.1", time: "2 hours ago", type: "whitelist" },
                ].map((action, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white bg-opacity-5 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      action.type === "ban" ? "bg-royal-crimson" :
                      action.type === "suspend" ? "bg-royal-gold" :
                      action.type === "withhold" ? "bg-royal-purple" :
                      action.type === "flag" ? "bg-royal-blue" : "bg-royal-emerald"
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{action.action}</div>
                      <div className="text-xs text-gray-400">{action.target}</div>
                    </div>
                    <div className="text-xs text-gray-400">{action.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fraud Alerts Table */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle>
              Fraud Alerts ({filteredAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white border-opacity-10">
                    <th className="text-left py-3 text-gray-400">Type</th>
                    <th className="text-left py-3 text-gray-400">User</th>
                    <th className="text-left py-3 text-gray-400">IP / Location</th>
                    <th className="text-left py-3 text-gray-400">Severity</th>
                    <th className="text-left py-3 text-gray-400">Status</th>
                    <th className="text-left py-3 text-gray-400">Detected</th>
                    <th className="text-right py-3 text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5">
                      <td className="py-4">
                        <div>
                          <div className="font-medium">{alert.type}</div>
                          <div className="text-sm text-gray-400 max-w-48 truncate">
                            {alert.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-mono text-sm">{alert.user}</div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <span>{alert.country}</span>
                          <span className="font-mono text-sm">{alert.ip}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-gray-400">
                        <div>{alert.timestamp.toLocaleDateString()}</div>
                        <div className="text-xs">{alert.timestamp.toLocaleTimeString()}</div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white border-opacity-20"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {alert.status === "active" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-royal-gold hover:bg-royal-gold/80"
                              >
                                Investigate
                              </Button>
                              <Button
                                size="sm"
                                className="bg-royal-crimson hover:bg-royal-crimson/80"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
