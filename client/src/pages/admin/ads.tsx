import { useState } from "react";
import { Target, Code, Settings, BarChart3, Plus, Edit } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminAds() {
  const [adConfigs, setAdConfigs] = useState([
    {
      id: "interstitial",
      name: "Interstitial Ads",
      description: "Full-screen ads shown before redirect",
      enabled: true,
      script: "<script>/* Interstitial ad code */</script>",
    },
    {
      id: "popup",
      name: "Pop-under Ads", 
      description: "Pop-under ads for additional revenue",
      enabled: true,
      script: "<script>/* Pop-under ad code */</script>",
    },
    {
      id: "banner",
      name: "Banner Ads",
      description: "Banner advertisements on redirect page",
      enabled: false,
      script: "<script>/* Banner ad code */</script>",
    },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const { toast } = useToast();

  const handleToggleAd = (adId: string) => {
    setAdConfigs(configs => 
      configs.map(config => 
        config.id === adId 
          ? { ...config, enabled: !config.enabled }
          : config
      )
    );
    toast({
      title: "Updated",
      description: "Ad configuration updated successfully",
    });
  };

  const handleEditAd = (ad: any) => {
    setEditingAd(ad);
    setIsEditOpen(true);
  };

  const handleSaveAd = () => {
    if (!editingAd) return;
    
    setAdConfigs(configs =>
      configs.map(config =>
        config.id === editingAd.id ? editingAd : config
      )
    );
    
    setIsEditOpen(false);
    setEditingAd(null);
    toast({
      title: "Success",
      description: "Ad script updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ads Management</h1>
          <p className="text-gray-400">Configure ad scripts and monetization settings.</p>
        </div>

        {/* Ad Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-royal-gold border-opacity-30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-royal-gold" />
                <span className="text-xs text-royal-gold bg-royal-gold bg-opacity-20 px-2 py-1 rounded-full">+15.2%</span>
              </div>
              <div className="text-2xl font-bold text-royal-gold mb-1">$8,240</div>
              <div className="text-sm text-gray-400">Ad Revenue (Today)</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-royal-emerald border-opacity-30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <BarChart3 className="w-8 h-8 text-royal-emerald" />
                <span className="text-xs text-royal-emerald bg-royal-emerald bg-opacity-20 px-2 py-1 rounded-full">+8.7%</span>
              </div>
              <div className="text-2xl font-bold text-royal-emerald mb-1">94.5%</div>
              <div className="text-sm text-gray-400">Ad Fill Rate</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-royal-blue border-opacity-30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Settings className="w-8 h-8 text-royal-blue" />
                <span className="text-xs text-royal-blue bg-royal-blue bg-opacity-20 px-2 py-1 rounded-full">3</span>
              </div>
              <div className="text-2xl font-bold text-royal-blue mb-1">2.4%</div>
              <div className="text-sm text-gray-400">Click-through Rate</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-royal-purple border-opacity-30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Code className="w-8 h-8 text-royal-purple" />
                <span className="text-xs text-royal-purple bg-royal-purple bg-opacity-20 px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="text-2xl font-bold text-royal-purple mb-1">{adConfigs.filter(ad => ad.enabled).length}</div>
              <div className="text-sm text-gray-400">Active Ad Types</div>
            </CardContent>
          </Card>
        </div>

        {/* Ad Configuration Cards */}
        <div className="space-y-6 mb-8">
          {adConfigs.map((ad) => (
            <Card key={ad.id} className="glass-morphism border-white border-opacity-10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      {ad.name}
                    </CardTitle>
                    <p className="text-gray-400 text-sm mt-1">{ad.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={ad.enabled}
                      onCheckedChange={() => handleToggleAd(ad.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAd(ad)}
                      className="border-white border-opacity-20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Script
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${ad.enabled ? 'bg-royal-emerald' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium">
                        Status: {ad.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-royal-emerald bg-opacity-10 rounded-lg">
                      <div className="text-royal-emerald font-semibold">Today's Revenue</div>
                      <div className="text-lg font-bold text-royal-emerald">
                        ${(Math.random() * 1000 + 500).toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 bg-royal-blue bg-opacity-10 rounded-lg">
                      <div className="text-royal-blue font-semibold">Impressions</div>
                      <div className="text-lg font-bold text-royal-blue">
                        {(Math.random() * 10000 + 5000).toFixed(0)}
                      </div>
                    </div>
                    <div className="p-3 bg-royal-purple bg-opacity-10 rounded-lg">
                      <div className="text-royal-purple font-semibold">CTR</div>
                      <div className="text-lg font-bold text-royal-purple">
                        {(Math.random() * 3 + 1).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Ad Settings */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle>Global Ad Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-royal-gold">Frequency Controls</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Max ads per user per day</Label>
                    <span className="text-royal-gold font-semibold">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Minimum time between ads</Label>
                    <span className="text-royal-gold font-semibold">30 seconds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Skip ads for premium users</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-royal-emerald">Geographic Targeting</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>High-value countries only</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Block known VPN traffic</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Mobile-optimized ads</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Ad Script Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-royal-gray border-white border-opacity-20 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit {editingAd?.name} Script</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Ad Script Code</Label>
                <Textarea
                  value={editingAd?.script || ""}
                  onChange={(e) => setEditingAd({ ...editingAd, script: e.target.value })}
                  className="min-h-[200px] bg-white bg-opacity-5 border-white border-opacity-20 font-mono text-sm"
                  placeholder="Enter your ad script code here..."
                />
              </div>
              <div className="p-4 bg-royal-gold bg-opacity-10 rounded-lg border border-royal-gold border-opacity-30">
                <h5 className="font-semibold text-royal-gold mb-2">Important Notes:</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Ensure all scripts are properly tested before deployment</li>
                  <li>• Use HTTPS sources for all external scripts</li>
                  <li>• Avoid scripts that significantly impact page load times</li>
                  <li>• Comply with user privacy and data protection regulations</li>
                </ul>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleSaveAd} className="royal-gradient">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditOpen(false)} className="border-white border-opacity-20">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
