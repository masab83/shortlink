import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Mail, Lock, CreditCard, Bell, Shield, Save } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";

export default function UserProfile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    earningsAlerts: true,
    withdrawalUpdates: true,
    promotionalEmails: false,
  });

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

  // Initialize profile data when user data loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", "/api/auth/user", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
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
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", "/api/auth/password", data);
      return response.json();
    },
    onSuccess: () => {
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Success",
        description: "Password updated successfully!",
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
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateProfile = () => {
    if (!profileData.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate(profileData);
  };

  const handleUpdatePassword = () => {
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required",
        variant: "destructive",
      });
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (securityData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword: securityData.currentPassword,
      newPassword: securityData.newPassword,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-royal-black flex items-center justify-center">
        <div className="glass-morphism rounded-xl p-8">
          <div className="animate-spin w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full mx-auto"></div>
          <p className="text-white mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-royal-purple rounded-full flex items-center justify-center text-2xl font-bold">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.email}
                  </div>
                  <div className="text-sm text-gray-400">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</div>
                  <Badge className="mt-1 bg-royal-emerald">
                    {user?.role === "admin" ? "Administrator" : "Publisher"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="bg-white bg-opacity-5 border-white border-opacity-20"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="bg-white bg-opacity-5 border-white border-opacity-20"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="bg-white bg-opacity-5 border-white border-opacity-20"
                  placeholder="Enter your email"
                />
              </div>

              <div className="p-4 bg-royal-emerald bg-opacity-10 rounded-lg border border-royal-emerald border-opacity-30">
                <h4 className="font-semibold text-royal-emerald mb-2">Account Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Total Earnings</div>
                    <div className="font-semibold text-royal-emerald">${user?.totalEarnings || "0.00"}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Referral Code</div>
                    <div className="font-mono text-royal-gold">{user?.referralCode || "N/A"}</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpdateProfile}
                disabled={updateProfileMutation.isPending}
                className="w-full royal-gradient"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="glass-morphism border-white border-opacity-10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                  className="bg-white bg-opacity-5 border-white border-opacity-20"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                  className="bg-white bg-opacity-5 border-white border-opacity-20"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                  className="bg-white bg-opacity-5 border-white border-opacity-20"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="p-4 bg-royal-gold bg-opacity-10 rounded-lg border border-royal-gold border-opacity-30">
                <h5 className="font-semibold text-royal-gold mb-2">Password Requirements:</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Mix of uppercase and lowercase letters recommended</li>
                  <li>• Include numbers and special characters for security</li>
                  <li>• Avoid using personal information</li>
                </ul>
              </div>

              <Button
                onClick={handleUpdatePassword}
                disabled={updatePasswordMutation.isPending}
                className="w-full bg-royal-blue hover:bg-royal-blue/80"
              >
                <Shield className="w-4 h-4 mr-2" />
                {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card className="glass-morphism border-white border-opacity-10 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-400">Receive general email notifications</div>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <Separator className="border-white border-opacity-10" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Earnings Alerts</div>
                  <div className="text-sm text-gray-400">Get notified when you earn money</div>
                </div>
                <Switch
                  checked={notificationSettings.earningsAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, earningsAlerts: checked })
                  }
                />
              </div>

              <Separator className="border-white border-opacity-10" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Withdrawal Updates</div>
                  <div className="text-sm text-gray-400">Updates on withdrawal status changes</div>
                </div>
                <Switch
                  checked={notificationSettings.withdrawalUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, withdrawalUpdates: checked })
                  }
                />
              </div>

              <Separator className="border-white border-opacity-10" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Promotional Emails</div>
                  <div className="text-sm text-gray-400">Receive promotional offers and updates</div>
                </div>
                <Switch
                  checked={notificationSettings.promotionalEmails}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, promotionalEmails: checked })
                  }
                />
              </div>
            </div>

            <Button className="mt-6 royal-gradient">
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="glass-morphism border-white border-opacity-10 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💳</span>
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-400">Not configured</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white border-opacity-20">
                    Add PayPal
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🏦</span>
                    <div>
                      <div className="font-medium">Payoneer</div>
                      <div className="text-sm text-gray-400">Not configured</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white border-opacity-20">
                    Add Payoneer
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">₿</span>
                    <div>
                      <div className="font-medium">Bitcoin</div>
                      <div className="text-sm text-gray-400">Not configured</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white border-opacity-20">
                    Add Bitcoin Wallet
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-royal-blue bg-opacity-10 rounded-lg border border-royal-blue border-opacity-30">
              <p className="text-sm text-gray-300">
                <strong className="text-royal-blue">Note:</strong> Payment methods can be configured when requesting withdrawals. 
                You don't need to set them up in advance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="glass-morphism border-white border-opacity-10 mt-8">
          <CardHeader>
            <CardTitle className="text-royal-crimson">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-royal-crimson bg-opacity-10 rounded-lg border border-royal-crimson border-opacity-30">
                <h4 className="font-semibold text-royal-crimson mb-2">Account Deactivation</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Temporarily disable your account. You can reactivate it anytime by logging in.
                </p>
                <Button variant="outline" className="border-royal-crimson text-royal-crimson hover:bg-royal-crimson hover:text-white">
                  Deactivate Account
                </Button>
              </div>

              <div className="p-4 bg-royal-crimson bg-opacity-10 rounded-lg border border-royal-crimson border-opacity-30">
                <h4 className="font-semibold text-royal-crimson mb-2">Delete Account</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button className="bg-royal-crimson hover:bg-royal-crimson/80">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
