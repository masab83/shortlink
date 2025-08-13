import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreditCard, Check, X, Eye, Filter } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminWithdrawals() {
  const [filter, setFilter] = useState("pending");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ["/api/admin/withdrawals"],
  });

  const updateWithdrawalMutation = useMutation({
    mutationFn: async ({ withdrawalId, status, notes }: { withdrawalId: string; status: string; notes?: string }) => {
      await apiRequest("PATCH", `/api/admin/withdrawals/${withdrawalId}`, {
        status,
        adminNotes: notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      setSelectedWithdrawal(null);
      setAdminNotes("");
      toast({
        title: "Success",
        description: "Withdrawal status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update withdrawal status",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (withdrawalId: string) => {
    updateWithdrawalMutation.mutate({
      withdrawalId,
      status: "approved",
      notes: adminNotes,
    });
  };

  const handleReject = (withdrawalId: string) => {
    updateWithdrawalMutation.mutate({
      withdrawalId,
      status: "rejected", 
      notes: adminNotes,
    });
  };

  const handleMarkPaid = (withdrawalId: string) => {
    updateWithdrawalMutation.mutate({
      withdrawalId,
      status: "paid",
      notes: adminNotes,
    });
  };

  const filteredWithdrawals = withdrawals?.filter((w: any) => 
    filter === "all" || w.status === filter
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-royal-gold text-black";
      case "approved": return "bg-royal-emerald";
      case "rejected": return "bg-royal-crimson";
      case "paid": return "bg-royal-blue";
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

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Withdrawals Management</h1>
            <p className="text-gray-400">Review and process withdrawal requests.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-white bg-opacity-5 border-white border-opacity-20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-royal-gray border-white border-opacity-20">
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="royal-gradient">
              <Filter className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-royal-gold border-opacity-30">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-royal-gold mb-1">
                ${(withdrawals?.filter((w: any) => w.status === "pending").reduce((sum: number, w: any) => sum + parseFloat(w.amount), 0) || 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Pending Amount</div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-royal-emerald border-opacity-30">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-royal-emerald mb-1">
                {withdrawals?.filter((w: any) => w.status === "pending").length || 0}
              </div>
              <div className="text-sm text-gray-400">Pending Requests</div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-royal-blue border-opacity-30">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-royal-blue mb-1">
                ${(withdrawals?.filter((w: any) => w.status === "paid").reduce((sum: number, w: any) => sum + parseFloat(w.amount), 0) || 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Paid This Month</div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-royal-crimson border-opacity-30">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-royal-crimson mb-1">
                {withdrawals?.filter((w: any) => w.status === "rejected").length || 0}
              </div>
              <div className="text-sm text-gray-400">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawals Table */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle>
              Withdrawal Requests ({filteredWithdrawals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-white bg-opacity-5 rounded-lg">
                    <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white bg-opacity-10 rounded w-3/4"></div>
                      <div className="h-3 bg-white bg-opacity-10 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No withdrawals found</h3>
                <p className="text-gray-400">No withdrawal requests match the current filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white border-opacity-10">
                      <th className="text-left py-3 text-gray-400">User</th>
                      <th className="text-left py-3 text-gray-400">Amount</th>
                      <th className="text-left py-3 text-gray-400">Method</th>
                      <th className="text-left py-3 text-gray-400">Status</th>
                      <th className="text-left py-3 text-gray-400">Requested</th>
                      <th className="text-right py-3 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWithdrawals.map((withdrawal: any) => (
                      <tr key={withdrawal.id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-royal-purple rounded-full flex items-center justify-center">
                              {withdrawal.user?.email?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <div className="font-medium">{withdrawal.user?.email || "Unknown User"}</div>
                              <div className="text-xs text-gray-400">ID: {withdrawal.userId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-lg font-semibold text-royal-gold">
                            ${parseFloat(withdrawal.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <span>{getPaymentMethodIcon(withdrawal.method)}</span>
                            <span className="capitalize">{withdrawal.method}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className={getStatusColor(withdrawal.status)}>
                            {withdrawal.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-gray-400">
                          {new Date(withdrawal.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setAdminNotes(withdrawal.adminNotes || "");
                              }}
                              className="border-white border-opacity-20"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {withdrawal.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(withdrawal.id)}
                                  disabled={updateWithdrawalMutation.isPending}
                                  className="bg-royal-emerald hover:bg-royal-emerald/80"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleReject(withdrawal.id)}
                                  disabled={updateWithdrawalMutation.isPending}
                                  className="bg-royal-crimson hover:bg-royal-crimson/80"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            
                            {withdrawal.status === "approved" && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkPaid(withdrawal.id)}
                                disabled={updateWithdrawalMutation.isPending}
                                className="bg-royal-blue hover:bg-royal-blue/80"
                              >
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Details Dialog */}
        <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
          <DialogContent className="bg-royal-gray border-white border-opacity-20 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Withdrawal Request Details</DialogTitle>
            </DialogHeader>
            {selectedWithdrawal && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">User Information</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Email: {selectedWithdrawal.user?.email}</p>
                      <p>User ID: {selectedWithdrawal.userId}</p>
                      <p>Total Earnings: ${selectedWithdrawal.user?.totalEarnings || "0.00"}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Withdrawal Details</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Amount: ${parseFloat(selectedWithdrawal.amount).toFixed(2)}</p>
                      <p>Method: {selectedWithdrawal.method}</p>
                      <p>Status: <Badge className={getStatusColor(selectedWithdrawal.status)}>{selectedWithdrawal.status}</Badge></p>
                      <p>Requested: {new Date(selectedWithdrawal.requestedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {selectedWithdrawal.details && (
                  <div>
                    <h4 className="font-semibold mb-2">Payment Details</h4>
                    <div className="p-3 bg-white bg-opacity-5 rounded-lg text-sm">
                      <pre className="whitespace-pre-wrap text-gray-300">
                        {JSON.stringify(selectedWithdrawal.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Admin Notes</h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this withdrawal request..."
                    className="bg-white bg-opacity-5 border-white border-opacity-20"
                  />
                </div>

                {selectedWithdrawal.status === "pending" && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleApprove(selectedWithdrawal.id)}
                      disabled={updateWithdrawalMutation.isPending}
                      className="bg-royal-emerald hover:bg-royal-emerald/80"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedWithdrawal.id)}
                      disabled={updateWithdrawalMutation.isPending}
                      className="bg-royal-crimson hover:bg-royal-crimson/80"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {selectedWithdrawal.status === "approved" && (
                  <Button
                    onClick={() => handleMarkPaid(selectedWithdrawal.id)}
                    disabled={updateWithdrawalMutation.isPending}
                    className="bg-royal-blue hover:bg-royal-blue/80"
                  >
                    Mark as Paid
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
