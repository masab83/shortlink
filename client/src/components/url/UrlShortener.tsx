import { useState } from "react";
import { Link, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShorten = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "Error", 
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/shorten", {
        originalUrl: url,
        title: "",
        description: "",
      });

      const data = await response.json();
      setShortUrl(data.shortUrl);
      
      toast({
        title: "Success",
        description: "URL shortened successfully!",
      });
    } catch (error) {
      console.error("Error shortening URL:", error);
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-8 premium-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            type="url"
            placeholder="Paste your long URL here to start earning..."
            value={shortUrl || url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-6 py-4 bg-white bg-opacity-5 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent"
            readOnly={!!shortUrl}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {shortUrl ? (
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-royal-emerald" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ) : (
              <Link className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {shortUrl ? (
          <Button
            onClick={() => {
              setShortUrl("");
              setUrl("");
            }}
            className="px-8 py-4 bg-gradient-to-r from-royal-emerald to-royal-blue rounded-xl font-semibold hover:scale-105 transition-transform premium-shadow"
          >
            Shorten Another
          </Button>
        ) : (
          <Button
            onClick={handleShorten}
            disabled={isLoading}
            className="px-8 py-4 royal-gradient rounded-xl font-semibold hover:scale-105 transition-transform premium-shadow animate-pulse-gold"
          >
            {isLoading ? "Creating..." : "Shorten & Earn"}
          </Button>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-400 text-left">
        <div className="flex items-center justify-between">
          <span>✓ No registration required</span>
          <span>✓ Instant payments</span>
          <span>✓ Global coverage</span>
        </div>
      </div>
    </div>
  );
}
