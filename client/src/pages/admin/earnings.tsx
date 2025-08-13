import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DollarSign, Globe, Smartphone, Monitor, Plus } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminEarnings() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRate, setNewRate] = useState({ country: "", rate: "", device: "all" });
  const { toast } = useToast();

  const { data: cpmRates, isLoading } = useQuery({
    queryKey: ["/api/admin/cpm-rates"],
  });

  const createRateMutation = useMutation({
    mutationFn: async (rateData: any) => {
      await apiRequest("POST", "/api/admin/cpm-rates", {
        ...rateData,
        rate: parseFloat(rateData.rate),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cpm-rates"] });
      setIsCreateOpen(false);
      setNewRate({ country: "", rate: "", device: "all" });
      toast({
        title: "Success",
        description: "CPM rate updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update CPM rate",
        variant: "destructive",
      });
    },
  });

  const handleCreateRate = () => {
    if (!newRate.country || !newRate.rate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(parseFloat(newRate.rate)) || parseFloat(newRate.rate) < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid rate",
        variant: "destructive",
      });
      return;
    }

    createRateMutation.mutate(newRate);
  };

  const topCountries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "FR", name: "France", flag: "🇫🇷" },
  ];

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Earnings Control</h1>
            <p className="text-gray-400">Manage CPM rates and earning configurations.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="royal-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add CPM Rate
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-royal-gray border-white border-opacity-20">
              <DialogHeader>
                <DialogTitle>Add/Update CPM Rate</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="country">Country Code *</Label>
                  <Select value={newRate.country} onValueChange={(value) => setNewRate({ ...newRate, country: value })}>
                    <SelectTrigger className="bg-white bg-opacity-5 border-white border-opacity-20">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-royal-gray border-white border-opacity-20">
                      {topCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="device">Device Type</Label>
                  <Select value={newRate.device} onValueChange={(value) => setNewRate({ ...newRate, device: value })}>
                    <SelectTrigger className="bg-white bg-opacity-5 border-white border-opacity-20">
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                    <SelectContent className="bg-royal-gray border-white border-opacity-20">
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rate">CPM Rate ($) *</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="3.50"
                    value={newRate.rate}
                    onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                    className="bg-white bg-opacity-5 border-white border-opacity-20"
                  />
                </div>
                <Button
                  onClick={handleCreateRate}
                  disabled={createRateMutation.isPending}
                  className="w-full royal-gradient"
                >
                  {createRateMutation.isPending ? "Updating..." : "Update Rate"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Global Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-morphism border-royal-gold border-opacity-30">
            <CardHeader>
              <CardTitle className="flex items-center text-royal-gold">
                <DollarSign className="w-5 h-5 mr-2" />
                Default CPM Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-royal-gold mb-2">$2.50</div>
              <p className="text-sm text-gray-400">Applied to unspecified countries</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-royal-emerald border-opacity-30">
            <CardHeader>
              <CardTitle className="flex items-center text-royal-emerald">
                <Globe className="w-5 h-5 mr-2" />
                Active Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-royal-emerald mb-2">{cpmRates?.length || 0}</div>
              <p className="text-sm text-gray-400">Countries with custom rates</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-royal-blue border-opacity-30">
            <CardHeader>
              <CardTitle className="flex items-center text-royal-blue">
                <Smartphone className="w-5 h-5 mr-2" />
                Device Split
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-royal-blue mb-2">60/40</div>
              <p className="text-sm text-gray-400">Mobile/Desktop traffic ratio</p>
            </CardContent>
          </Card>
        </div>

        {/* CPM Rates Table */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle>Current CPM Rates</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-white bg-opacity-10 rounded"></div>
                      <div className="h-4 bg-white bg-opacity-10 rounded w-32"></div>
                    </div>
                    <div className="h-4 bg-white bg-opacity-10 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : cpmRates?.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No CPM Rates Set</h3>
                <p className="text-gray-400 mb-6">Start by adding CPM rates for different countries.</p>
                <Button onClick={() => setIsCreateOpen(true)} className="royal-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Rate
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white border-opacity-10">
                      <th className="text-left py-3 text-gray-400">Country</th>
                      <th className="text-left py-3 text-gray-400">Device</th>
                      <th className="text-left py-3 text-gray-400">CPM Rate</th>
                      <th className="text-left py-3 text-gray-400">Status</th>
                      <th className="text-left py-3 text-gray-400">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cpmRates?.map((rate: any) => {
                      const countryInfo = topCountries.find(c => c.code === rate.country);
                      return (
                        <tr key={`${rate.country}-${rate.device}`} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5">
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{countryInfo?.flag || "🌍"}</span>
                              <div>
                                <div className="font-medium">{countryInfo?.name || rate.country}</div>
                                <div className="text-sm text-gray-400">{rate.country}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              {rate.device === "mobile" ? (
                                <Smartphone className="w-4 h-4 text-royal-blue" />
                              ) : rate.device === "desktop" ? (
                                <Monitor className="w-4 h-4 text-royal-purple" />
                              ) : (
                                <Globe className="w-4 h-4 text-royal-emerald" />
                              )}
                              <span className="capitalize">{rate.device}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="text-lg font-semibold text-royal-gold">
                              ${parseFloat(rate.rate).toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              rate.isActive 
                                ? "bg-royal-emerald bg-opacity-20 text-royal-emerald" 
                                : "bg-royal-crimson bg-opacity-20 text-royal-crimson"
                            }`}>
                              {rate.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 text-gray-400">
                            {new Date(rate.updatedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
