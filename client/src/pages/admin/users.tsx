import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Users, Search, MoreHorizontal, Ban, Edit, Shield } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users", { page, limit: 20 }],
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}/status`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (userId: string, isActive: boolean) => {
    updateUserStatusMutation.mutate({ userId, isActive });
  };

  const filteredUsers = users?.filter((user: any) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-gray-400">Manage user accounts and permissions.</p>
        </div>

        {/* Search and Filters */}
        <Card className="glass-morphism border-white border-opacity-10 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search users by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white bg-opacity-5 border-white border-opacity-20"
                />
              </div>
              <Button className="royal-gradient">
                <Shield className="w-4 h-4 mr-2" />
                Export Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="glass-morphism border-white border-opacity-10">
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-white bg-opacity-5 rounded-lg">
                    <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white bg-opacity-10 rounded w-3/4"></div>
                      <div className="h-3 bg-white bg-opacity-10 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white border-opacity-10">
                      <th className="text-left py-3 text-gray-400">User</th>
                      <th className="text-left py-3 text-gray-400">Status</th>
                      <th className="text-left py-3 text-gray-400">Total Earnings</th>
                      <th className="text-left py-3 text-gray-400">Joined</th>
                      <th className="text-left py-3 text-gray-400">Role</th>
                      <th className="text-right py-3 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user: any) => (
                      <tr key={user.id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-royal-purple rounded-full flex items-center justify-center">
                              {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <div className="font-medium">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.email}
                              </div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge 
                            variant={user.isActive ? "default" : "destructive"}
                            className={user.isActive ? "bg-royal-emerald" : "bg-royal-crimson"}
                          >
                            {user.isActive ? "Active" : "Banned"}
                          </Badge>
                        </td>
                        <td className="py-4 text-royal-gold">
                          ${parseFloat(user.totalEarnings || 0).toFixed(2)}
                        </td>
                        <td className="py-4 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <Badge 
                            variant="outline" 
                            className={user.role === 'admin' ? "border-royal-gold text-royal-gold" : "border-gray-400 text-gray-400"}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-royal-gray border-white border-opacity-20">
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(user.id, !user.isActive)}
                                className="hover:bg-white hover:bg-opacity-10"
                              >
                                {user.isActive ? (
                                  <>
                                    <Ban className="w-4 h-4 mr-2" />
                                    Ban User
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-4 h-4 mr-2" />
                                    Unban User
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-white hover:bg-opacity-10">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white border-opacity-10">
              <span className="text-sm text-gray-400">
                Showing {filteredUsers.length} users
              </span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="border-white border-opacity-20"
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={filteredUsers.length < 20}
                  className="border-white border-opacity-20"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
