import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link as LinkIcon, Copy, Eye, DollarSign, Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserLinks() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLink, setNewLink] = useState({ originalUrl: "", title: "", description: "" });
  const { toast } = useToast();

  const { data: links, isLoading } = useQuery({
    queryKey: ["/api/links"],
  });

  const createLinkMutation = useMutation({
    mutationFn: async (linkData: any) => {
      const response = await apiRequest("POST", "/api/links", linkData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      setIsCreateOpen(false);
      setNewLink({ originalUrl: "", title: "", description: "" });
      toast({
        title: "Success",
        description: "Link created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleCreateLink = () => {
    if (!newLink.originalUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(newLink.originalUrl);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    createLinkMutation.mutate(newLink);
  };

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Links</h1>
            <p className="text-gray-400">Manage and track your shortened links.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="royal-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Create Link
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-royal-gray border-white border-opacity-20">
              <DialogHeader>
                <DialogTitle>Create New Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url">Original URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={newLink.originalUrl}
                    onChange={(e) => setNewLink({ ...newLink, originalUrl: e.target.value })}
                    className="bg-white bg-opacity-5 border-white border-opacity-20"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="My awesome link"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="bg-white bg-opacity-5 border-white border-opacity-20"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="Link description"
                    value={newLink.description}
                    onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                    className="bg-white bg-opacity-5 border-white border-opacity-20"
                  />
                </div>
                <Button
                  onClick={handleCreateLink}
                  disabled={createLinkMutation.isPending}
                  className="w-full royal-gradient"
                >
                  {createLinkMutation.isPending ? "Creating..." : "Create Link"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-morphism border-white border-opacity-10">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white bg-opacity-10 rounded"></div>
                    <div className="h-3 bg-white bg-opacity-10 rounded w-2/3"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-white bg-opacity-10 rounded w-16"></div>
                      <div className="h-3 bg-white bg-opacity-10 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : links?.length === 0 ? (
          <div className="text-center py-20">
            <LinkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No links yet</h3>
            <p className="text-gray-400 mb-6">Create your first shortened link to start earning!</p>
            <Button onClick={() => setIsCreateOpen(true)} className="royal-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Link
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links?.map((link: any) => (
              <Card key={link.id} className="glass-morphism border-white border-opacity-10 hover:border-royal-gold hover:border-opacity-50 transition-all">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg truncate">{link.title || "Untitled Link"}</CardTitle>
                  <p className="text-sm text-gray-400 truncate">{link.originalUrl}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                      <span className="text-sm font-mono truncate flex-1 mr-2">{link.shortUrl}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(link.shortUrl)}
                        className="hover:bg-white hover:bg-opacity-10"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-royal-emerald">
                        <Eye className="w-4 h-4 mr-1" />
                        {link.totalViews || 0} views
                      </div>
                      <div className="flex items-center text-royal-gold">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${parseFloat(link.totalEarnings || 0).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Created {new Date(link.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
