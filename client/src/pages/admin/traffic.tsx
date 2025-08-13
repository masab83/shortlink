import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Globe, Eye, AlertTriangle } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatCard from "@/components/stats/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EarningsChart from "@/components/charts/EarningsChart";

export default function AdminTraffic() {
  const [dateRange, setDateRange] = useState("7d");

  // Mock traffic data
  const trafficData = [
    { date: "2024-01-01", earnings: 15420 },
    { date: "2024-01-02", earnings: 18675 },
    { date: "2024-01-03", earnings: 22340 },
    { date: "2024-01-04", earnings: 19880 },
    { date: "2024-01-05", earnings: 25640 },
    { date: "2024-01-06", earnings: 31250 },
    { date: "2024-01-07", earnings: 28930 },
  ];

  const topTrafficSources = [
    { source: "Direct Traffic", visits: 45230, percentage: 42, color: "text-royal-emerald" },
    { source: "Social Media", visits: 28540, percentage: 26, color: "text-royal-blue" },
    { source: "Search Engines", visits: 19340, percentage: 18, color: "text-royal-gold" },
    { source: "Referral Sites", visits: 10890, percentage: 10, color: "text-royal-purple" },
    { source: "Email Campaigns", visits: 4320, percentage: 4, color: "text-royal-crimson" },
  ];

  const flaggedTraffic = [
    { ip: "192.168.1.100", country: "🇺🇸", reason: "Rapid clicking pattern", time: "2 hours ago", severity: "high" },
    { ip: "10.0.0.45", country: "🇬🇧", reason: "Bot-like behavior", time: "4 hours ago", severity: "medium" },
    { ip: "172.16.0.234", country: "🇩🇪", reason: "VPN/Proxy detected", time: "6 hours ago", severity: "low" },
    { ip: "203.0.113.12", country: "🇯🇵", reason: "Suspicious user agent", time: "8 hours ago", severity: "medium" },
  ];

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Traffic & Logs</h1>
            <p className="text-gray-400">Monitor traffic sources and detect fraud patterns.</p>
          </div>
          
          <div className="flex space-x-2">
            {["7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? "default" : "outline"}
                onClick={() => setDateRange(range)}
                className={dateRange === range ? "royal-gradient" : "border-white border-opacity-20"}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </Button>
            ))}
          </div>
        </div>

        {/* Traffic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Visits"
            value="2.4M"
            change="12.5%"
            changeType="positive"
            icon={Eye}
            color="emerald"
          />
          <StatCard
            title="Unique Visitors"
            value="1.8M"
            change="8.3%"
            changeType="positive"
            icon={Globe}
            color="blue"
          />
          <StatCard
            title="Active Sessions"
            value="15,240"
            change="5.7%"
            changeType="positive"
            icon={Activity}
            color="gold"
          />
          <StatCard
            title="Flagged Traffic"
            value="342"
            change="23"
            changeType="negative"
            icon={AlertTriangle}
            color="crimson"
          />
        </div>

        {/* Traffic Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>Traffic Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <EarningsChart data={trafficData} height={300} />
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTrafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-current ${source.color}`}></div>
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{source.visits.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Traffic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>Traffic by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { country: "🇺🇸 United States", visits: 524320, percentage: 32 },
                  { country: "🇬🇧 United Kingdom", visits: 248790, percentage: 15 },
                  { country: "🇩🇪 Germany", visits: 186540, percentage: 11 },
                  { country: "🇨🇦 Canada", visits: 142380, percentage: 9 },
                  { country: "🇦🇺 Australia", visits: 98670, percentage: 6 },
                  { country: "🌍 Others", visits: 439310, percentage: 27 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium w-32">{item.country}</span>
                      <div className="w-24 bg-white bg-opacity-10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-royal-purple to-royal-blue h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{item.visits.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-royal-blue bg-opacity-20 rounded-lg flex items-center justify-center">
                      📱
                    </div>
                    <div>
                      <div className="font-semibold">Mobile</div>
                      <div className="text-sm text-gray-400">1.44M visits</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-royal-blue">60%</div>
                    <div className="text-xs text-gray-400">+5.2%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-royal-purple bg-opacity-20 rounded-lg flex items-center justify-center">
                      💻
                    </div>
                    <div>
                      <div className="font-semibold">Desktop</div>
                      <div className="text-sm text-gray-400">0.96M visits</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-royal-purple">40%</div>
                    <div className="text-xs text-gray-400">-2.1%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flagged Traffic */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle className="flex items-center text-royal-crimson">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Flagged Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white border-opacity-10">
                    <th className="text-left py-3 text-gray-400">IP Address</th>
                    <th className="text-left py-3 text-gray-400">Country</th>
                    <th className="text-left py-3 text-gray-400">Reason</th>
                    <th className="text-left py-3 text-gray-400">Severity</th>
                    <th className="text-left py-3 text-gray-400">Detected</th>
                  </tr>
                </thead>
                <tbody>
                  {flaggedTraffic.map((item, index) => (
                    <tr key={index} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5">
                      <td className="py-4 font-mono text-sm">{item.ip}</td>
                      <td className="py-4">
                        <span className="text-lg mr-2">{item.country}</span>
                      </td>
                      <td className="py-4">{item.reason}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.severity === "high" 
                            ? "bg-royal-crimson bg-opacity-20 text-royal-crimson"
                            : item.severity === "medium"
                            ? "bg-royal-gold bg-opacity-20 text-royal-gold"
                            : "bg-gray-400 bg-opacity-20 text-gray-400"
                        }`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400">{item.time}</td>
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
