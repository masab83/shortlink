import { useQuery } from "@tanstack/react-query";
import { Users, Copy, DollarSign, UserPlus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import StatCard from "@/components/stats/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function UserReferrals() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: referrals } = useQuery({
    queryKey: ["/api/referrals"],
  });

  const referralUrl = `${window.location.origin}?ref=${user?.referralCode}`;
  const totalReferrals = referrals?.length || 0;
  const totalCommission = referrals?.reduce((sum: number, ref: any) => sum + parseFloat(ref.totalEarnings || 0), 0) || 0;

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
          <p className="text-gray-400">Earn 10% commission from your referrals' earnings forever!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Referrals"
            value={totalReferrals}
            change="5"
            changeType="positive"
            icon={Users}
            color="emerald"
          />
          <StatCard
            title="Commission Earned"
            value={`$${totalCommission.toFixed(2)}`}
            change="12.5%"
            changeType="positive"
            icon={DollarSign}
            color="gold"
          />
          <StatCard
            title="This Month"
            value="3"
            change="2"
            changeType="positive"
            icon={UserPlus}
            color="purple"
          />
        </div>

        {/* Referral Link Section */}
        <Card className="glass-morphism border-white border-opacity-10 mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 p-3 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20">
                  <code className="text-royal-gold break-all">{referralUrl}</code>
                </div>
                <Button onClick={handleCopyReferralLink} className="royal-gradient">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              
              <div className="p-4 bg-royal-purple bg-opacity-20 rounded-lg border border-royal-purple border-opacity-30">
                <h4 className="font-semibold text-royal-purple mb-2">How it works:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Share your referral link with friends and on social media</li>
                  <li>• When someone signs up using your link, they become your referral</li>
                  <li>• You earn 10% of their earnings for life</li>
                  <li>• Commissions are added to your balance automatically</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            {totalReferrals === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No referrals yet</h3>
                <p className="text-gray-400 mb-6">Start sharing your referral link to earn commissions!</p>
                <Button onClick={handleCopyReferralLink} className="royal-gradient">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Referral Link
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white border-opacity-10">
                      <th className="text-left py-3 text-gray-400">User</th>
                      <th className="text-left py-3 text-gray-400">Joined</th>
                      <th className="text-left py-3 text-gray-400">Their Earnings</th>
                      <th className="text-left py-3 text-gray-400">Your Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals?.map((referral: any, index: number) => (
                      <tr key={index} className="border-b border-white border-opacity-5">
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-royal-purple rounded-full flex items-center justify-center">
                              {referral.referred?.email?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="font-medium">{referral.referred?.email || "Anonymous"}</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-400">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-royal-emerald">
                          ${parseFloat(referral.totalEarnings || 0).toFixed(2)}
                        </td>
                        <td className="py-3 text-royal-gold">
                          ${parseFloat(referral.commission || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="glass-morphism border-white border-opacity-10 mt-8">
          <CardHeader>
            <CardTitle>Maximizing Your Referral Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-royal-gold mb-3">Best Places to Share</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Social media platforms (Twitter, Facebook, Instagram)</li>
                  <li>• Tech forums and communities</li>
                  <li>• Discord servers and Telegram groups</li>
                  <li>• YouTube video descriptions</li>
                  <li>• Blog posts and websites</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-royal-emerald mb-3">Pro Tips</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Explain the benefits of earning money from links</li>
                  <li>• Share your own success stories</li>
                  <li>• Help new users get started</li>
                  <li>• Create tutorial content</li>
                  <li>• Be genuine and helpful</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
