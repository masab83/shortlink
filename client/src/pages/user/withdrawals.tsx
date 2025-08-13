import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreditCard, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";

export default function UserWithdrawals() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: "",
    method: "",
    details: {
      email: "",
      accountNumber: "",
      walletAddress: "",
      notes: "",
    },
  });
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ["/api/withdrawals"],
    enabled: isAuthenticated,
    retry: false,
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/withdrawals", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsCreateOpen(false);
      setWithdrawalData({
        amount: "",
        method: "",
        details: { email: "", accountNumber: "", walletAddress: "", notes: "" },
      });
      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateWithdrawal = () => {
    if (!withdrawalData.amount || !withdrawalData.method) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(withdrawalData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const userBalance = parseFloat(user?.totalEarnings || "0");
    if (amount > userBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    // Minimum withdrawal amount
    if (amount < 10) {
      toast({
        title: "Error",
        description: "Minimum withdrawal amount is $10.00",
        variant: "destructive",
      });
      return;
    }

    // Prepare payment details based on method
    let details: any = { notes: withdrawalData.details.notes };
    
    if (withdrawalData.method === "paypal" && !withdrawalData.details.email) {
      toast({
        title: "Error",
        description: "PayPal email is required",
        variant: "destructive",
      });
      return;
    }
    
    if (withdrawalData.method === "payoneer" && !withdrawalData.details.email) {
      toast({
        title: "Error", 
        description: "Payoneer email is required",
        variant: "destructive",
      });
      return;
    }
    
    if (withdrawalData.method === "bitcoin" && !withdrawalData.details.walletAddress) {
      toast({
        title: "Error",
        description: "Bitcoin wallet address is required",
        variant: "destructive",
      });
      return;
    }

    if (withdrawalData.method === "paypal" || withdrawalData.method === "payoneer") {
      details.email = withdrawalData.details.email;
    } else if (withdrawalData.method === "bitcoin") {
      details.walletAddress = withdrawalData.details.walletAddress;
    }

    createWithdrawalMutation.mutate({
      amount: amount.toString(),
      method: withdrawalData.method,
      details,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "paid": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-royal-gold text-black";
      case "approved": return "bg-royal-blue";
      case "rejected": return "bg-royal-crimson";
      case "paid": return "bg-royal-emerald";
      default: return "bg-gray-500";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "paypal": return "💳";
      case "payoneer": return "🏦";
      case "bitcoin": return "₿";
      default: return "💰";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-royal-black flex items-center justify-center">
        <div className="glass-morphism rounded-xl p-8">
          <div className="animate-spin w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full mx-auto"></div>
          <p className="text-white mt-4">Loading withdrawals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Withdrawals</h1>
            <p className="text-gray-400">Request withdrawals and track your payment history.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="royal-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Request Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-royal-gray border-white border-opacity-20 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Withdrawal</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="p-4 bg-royal-emerald bg-opacity-10 rounded-lg border border-royal-emerald border-opacity-30">
                  <div className="flex items-center justify-between">
                    <span className="text-royal-emerald font-semibold">Available Balance:</span>
                    <span className="text-2xl font-bold text-royal-emerald">
                      ${parseFloat(user?.totalEarnings || "0").toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">Minimum withdrawal: $10.00</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Withdrawal Amount ($) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="10"
                      max={parseFloat(user?.totalEarnings || "0")}
                      placeholder="50.00"
                      value={withdrawalData.amount}
                      onChange={(e) => setWithdrawalData({ ...withdrawalData, amount: e.target.value })}
                      className="bg-white bg-opacity-5 border-white border-opacity-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="method">Payment Method *</Label>
                    <Select 
                      value={withdrawalData.method} 
                      onValueChange={(value) => setWithdrawalData({ ...withdrawalData, method: value })}
                    >
                      <SelectTrigger className="bg-white bg-opacity-5 border-white border-opacity-20">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="bg-royal-gray border-white border-opacity-20">
                        <SelectItem value="paypal">💳 PayPal</SelectItem>
                        <SelectItem value="payoneer">🏦 Payoneer</SelectItem>
                        <SelectItem value="bitcoin">₿ Bitcoin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Payment Method Specific Fields */}
                {(withdrawalData.method === "paypal" || withdrawalData.method === "payoneer") && (
                  <div>
                    <Label htmlFor="email">
                      {withdrawalData.method === "paypal" ? "PayPal" : "Payoneer"} Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={`your@${withdrawalData.method}.com`}
                      value={withdrawalData.details.email}
                      onChange={(e) => setWithdrawalData({
                        ...withdrawalData,
                        details: { ...withdrawalData.details, email: e.target.value }
                      })}
                      className="bg-white bg-opacity-5 border-white border-opacity-20"
                    />
                  </div>
                )}

                {withdrawalData.method === "bitcoin" && (
                  <div>
                    <Label htmlFor="wallet">Bitcoin Wallet Address *</Label>
                    <Input
                      id="wallet"
                      placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                      value={withdrawalData.details.walletAddress}
                      onChange={(e) => setWithdrawalData({
                        ...withdrawalData,
                        details: { ...withdrawalData.details, walletAddress: e.target.value }
                      })}
                      className="bg-white bg-opacity-5 border-white border-opacity-20 font-mono text-sm"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Additional Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information for the payment..."
                    value={withdrawalData.details.notes}
                    onChange={(e) => setWithdrawalData({
                      ...withdrawalData,
                      details: { ...withdrawalData.details, notes: e.target.value }
                    })}
                    className="bg-white bg-opacity-5 border-white border-opacity-20"
                  />
                </div>

                <div className="p-4 bg-royal-purple bg-opacity-10 rounded-lg border border-royal-purple border-opacity-30">
                  <h5 className="font-semibold text-royal-purple mb-2">Processing Information:</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Withdrawals are processed within 1-3 business days</li>
                    <li>• PayPal and Payoneer: 24-48 hours processing time</li>
                    <li>• Bitcoin: Same day processing (network confirmations may vary)</li>
                    <li>• A processing fee may apply based on payment method</li>
                  </ul>
                </div>

                <Button
                  onClick={handleCreateWithdrawal}
                  disabled={createWithdrawalMutation.isPending}
                  className="w-full royal-gradient"
                >
                  {createWithdrawalMutation.isPending ? "Submitting..." : "Submit Withdrawal Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-morphism border-royal-emerald border-opacity-30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8 text-royal-emerald" />
              </div>
              <div className="text-2xl font-bold text-royal-emerald mb-1">
                ${parseFloat(user?.totalEarnings || "0").toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Available Balance</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-royal-gold border-opacity-30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-royal-gold" />
              </div>
              <div className="text-2xl font-bold text-royal-gold mb-1">
                ${withdrawals?.filter((w: any) => w.status === "pending").reduce((sum: number, w: any) => sum + parseFloat(w.amount), 0).toFixed(2) || "0.00"}
              </div>
              <div className="text-sm text-gray-400">Pending Withdrawals</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-royal-blue border-opacity-30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 text-royal-blue" />
              </div>
              <div className="text-2xl font-bold text-royal-blue mb-1">
                ${withdrawals?.filter((w: any) => w.status === "paid").reduce((sum: number, w: any) => sum + parseFloat(w.amount), 0).toFixed(2) || "0.00"}
              </div>
              <div className="text-sm text-gray-400">Total Paid</div>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal History */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-white bg-opacity-5 rounded-lg">
                    <div className="w-10 h-10 bg-white bg-opacity-10 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white bg-opacity-10 rounded w-3/4"></div>
                      <div className="h-3 bg-white bg-opacity-10 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : withdrawals?.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No withdrawals yet</h3>
                <p className="text-gray-400 mb-6">Request your first withdrawal to start getting paid!</p>
                <Button onClick={() => setIsCreateOpen(true)} className="royal-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Request First Withdrawal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawals?.map((withdrawal: any) => (
                  <div key={withdrawal.id} className="p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10 hover:border-royal-gold hover:border-opacity-30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-royal-purple bg-opacity-20 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{getPaymentMethodIcon(withdrawal.method)}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-semibold">${parseFloat(withdrawal.amount).toFixed(2)}</span>
                            <Badge className={getStatusColor(withdrawal.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(withdrawal.status)}
                                <span>{withdrawal.status}</span>
                              </div>
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {withdrawal.method.charAt(0).toUpperCase() + withdrawal.method.slice(1)} • 
                            Requested {new Date(withdrawal.requestedAt).toLocaleDateString()}
                            {withdrawal.processedAt && (
                              <> • Processed {new Date(withdrawal.processedAt).toLocaleDateString()}</>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {withdrawal.adminNotes && (
                          <div className="text-xs text-gray-400 max-w-48 truncate">
                            Note: {withdrawal.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {withdrawal.details && Object.keys(withdrawal.details).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white border-opacity-10">
                        <div className="text-xs text-gray-400">
                          Payment Details: {JSON.stringify(withdrawal.details)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods Info */}
        <Card className="glass-morphism border-white border-opacity-10 mt-8">
          <CardHeader>
            <CardTitle>Payment Methods Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-royal-blue bg-opacity-20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <h4 className="font-semibold mb-2">PayPal</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Processing: 24-48 hours</li>
                  <li>• Fee: 2.9% + $0.30</li>
                  <li>• Minimum: $10.00</li>
                  <li>• Global availability</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-royal-emerald bg-opacity-20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🏦</span>
                </div>
                <h4 className="font-semibold mb-2">Payoneer</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Processing: 24-48 hours</li>
                  <li>• Fee: 2% (max $3.00)</li>
                  <li>• Minimum: $20.00</li>
                  <li>• 200+ countries</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-royal-gold bg-opacity-20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">₿</span>
                </div>
                <h4 className="font-semibold mb-2">Bitcoin</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Processing: Same day</li>
                  <li>• Network fee applies</li>
                  <li>• Minimum: $25.00</li>
                  <li>• Worldwide</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
