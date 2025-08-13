import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, TrendingUp, DollarSign, Eye } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import StatCard from "@/components/stats/StatCard";
import EarningsChart from "@/components/charts/EarningsChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserReports() {
  const [dateRange, setDateRange] = useState("7d");

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics", { from: getDateRange(dateRange).from, to: getDateRange(dateRange).to }],
  });

  // Generate sample earnings data based on date range
  const generateEarningsData = (days: number) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString(),
        earnings: Math.random() * 50 + 10,
      });
    }
    return data;
  };

  const earningsData = generateEarningsData(
    dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
  );

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-gray-400">Detailed insights into your performance and earnings.</p>
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={analytics?.totalViews || Math.floor(Math.random() * 10000 + 1000)}
            change="12.3%"
            changeType="positive"
            icon={Eye}
            color="emerald"
          />
          <StatCard
            title="Total Earnings"
            value={`$${earningsData.reduce((sum, d) => sum + d.earnings, 0).toFixed(2)}`}
            change="8.7%"
            changeType="positive"
            icon={DollarSign}
            color="gold"
          />
          <StatCard
            title="Average CPM"
            value="$3.45"
            change="2.1%"
            changeType="positive"
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Conversion Rate"
            value="4.2%"
            change="0.8%"
            changeType="positive"
            icon={Calendar}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>Earnings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <EarningsChart data={earningsData} height={300} />
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle>Traffic by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { country: "🇺🇸 United States", percentage: 42, earnings: "$125.40" },
                  { country: "🇬🇧 United Kingdom", percentage: 18, earnings: "$78.20" },
                  { country: "🇩🇪 Germany", percentage: 15, earnings: "$65.80" },
                  { country: "🇨🇦 Canada", percentage: 12, earnings: "$52.10" },
                  { country: "🇦🇺 Australia", percentage: 8, earnings: "$38.60" },
                  { country: "🌍 Others", percentage: 5, earnings: "$24.90" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">{item.country}</span>
                      <div className="w-32 bg-white bg-opacity-10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-royal-purple to-royal-blue h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-royal-gold">{item.earnings}</div>
                      <div className="text-xs text-gray-400">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Breakdown Table */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle>Daily Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white border-opacity-10">
                    <th className="text-left py-3 text-gray-400">Date</th>
                    <th className="text-left py-3 text-gray-400">Views</th>
                    <th className="text-left py-3 text-gray-400">Earnings</th>
                    <th className="text-left py-3 text-gray-400">CPM</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.slice(-7).map((day, index) => (
                    <tr key={index} className="border-b border-white border-opacity-5">
                      <td className="py-3">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 text-royal-emerald">{Math.floor(day.earnings * 10)}</td>
                      <td className="py-3 text-royal-gold">${day.earnings.toFixed(2)}</td>
                      <td className="py-3 text-royal-blue">${(day.earnings / Math.floor(day.earnings * 10) * 1000).toFixed(2)}</td>
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

function getDateRange(range: string) {
  const now = new Date();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { from: from.toISOString(), to: now.toISOString() };
}
