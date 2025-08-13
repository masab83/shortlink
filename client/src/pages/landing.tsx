import { useState } from "react";
import { Link2, DollarSign, Share2, Shield, Zap, BarChart, Smartphone, CreditCard, Headphones, Crown, Eye, Globe, UserPlus, Menu } from "lucide-react";
import UrlShortener from "@/components/url/UrlShortener";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-royal-black text-white font-inter overflow-x-hidden">
      {/* Floating Particles Background */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 glass-morphism">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 royal-gradient rounded-lg flex items-center justify-center">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-royal-gold to-royal-gold-light bg-clip-text text-transparent">
                ShrinkEarn
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#rates" className="text-gray-300 hover:text-royal-gold transition-colors">Rates</a>
              <a href="#features" className="text-gray-300 hover:text-royal-gold transition-colors">Features</a>
              <a href="#support" className="text-gray-300 hover:text-royal-gold transition-colors">Support</a>
              <button
                onClick={() => window.location.href = "/api/login"}
                className="px-4 py-2 glass-morphism rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => window.location.href = "/api/login"}
                className="px-6 py-2 bg-gradient-to-r from-royal-purple to-royal-blue rounded-lg font-semibold hover:from-royal-purple-light hover:to-royal-blue transition-all premium-shadow"
              >
                Get Started
              </button>
            </div>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a href="#rates" className="block text-gray-300 hover:text-royal-gold transition-colors">Rates</a>
              <a href="#features" className="block text-gray-300 hover:text-royal-gold transition-colors">Features</a>
              <a href="#support" className="block text-gray-300 hover:text-royal-gold transition-colors">Support</a>
              <button
                onClick={() => window.location.href = "/api/login"}
                className="block w-full text-left px-4 py-2 glass-morphism rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => window.location.href = "/api/login"}
                className="block w-full px-6 py-2 bg-gradient-to-r from-royal-purple to-royal-blue rounded-lg font-semibold text-center"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Shorten Links, 
              <span className="bg-gradient-to-r from-royal-gold via-royal-emerald to-royal-blue bg-clip-text text-transparent">
                Earn Royally
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join the premium URL shortener with <span className="text-royal-gold font-semibold">$3+ CPM rates</span>. 
              Turn every link into a luxury income stream with our royal monetization platform.
            </p>
          </div>

          {/* Premium URL Shortener Input */}
          <div className="max-w-4xl mx-auto mb-16">
            <UrlShortener />
          </div>

          {/* Live Stats Counter */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="glass-morphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-royal-gold mb-2">$2.1M+</div>
              <div className="text-sm text-gray-400">Total Earnings Paid</div>
            </div>
            <div className="glass-morphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-royal-emerald mb-2">156K+</div>
              <div className="text-sm text-gray-400">Active Publishers</div>
            </div>
            <div className="glass-morphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-royal-blue mb-2">8.9M+</div>
              <div className="text-sm text-gray-400">Links Shortened</div>
            </div>
            <div className="glass-morphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-royal-purple mb-2">$3.50</div>
              <div className="text-sm text-gray-400">Average CPM Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It <span className="text-royal-gold">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 royal-gradient rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Link2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Paste Your URL</h3>
              <p className="text-gray-400">Simply paste any long URL into our premium shortener and get an instant royal link.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-royal-emerald to-royal-gold rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Get Paid Link</h3>
              <p className="text-gray-400">Receive a premium shortened link that earns you money from every visitor with our royal rates.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-royal-blue to-royal-purple rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Share2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Share & Earn</h3>
              <p className="text-gray-400">Share your links anywhere online and watch your royal earnings grow with every click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CPM Rates Table */}
      <section id="rates" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-royal-gold">Premium</span> CPM Rates
          </h2>
          <div className="max-w-4xl mx-auto glass-morphism rounded-2xl premium-shadow overflow-hidden">
            <div className="bg-gradient-to-r from-royal-purple to-royal-blue p-6">
              <h3 className="text-xl font-semibold text-center">Highest Paying Countries</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg">
                  <span className="flex items-center"><span className="mr-2">🇺🇸</span> United States</span>
                  <span className="text-royal-gold font-semibold">$5.20</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg">
                  <span className="flex items-center"><span className="mr-2">🇬🇧</span> United Kingdom</span>
                  <span className="text-royal-gold font-semibold">$4.80</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg">
                  <span className="flex items-center"><span className="mr-2">🇩🇪</span> Germany</span>
                  <span className="text-royal-emerald font-semibold">$4.50</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg">
                  <span className="flex items-center"><span className="mr-2">🇨🇦</span> Canada</span>
                  <span className="text-royal-emerald font-semibold">$4.20</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg">
                  <span className="flex items-center"><span className="mr-2">🇦🇺</span> Australia</span>
                  <span className="text-royal-blue font-semibold">$3.90</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg">
                  <span className="flex items-center"><span className="mr-2">🇫🇷</span> France</span>
                  <span className="text-royal-blue font-semibold">$3.60</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => window.location.href = "/api/login"}
                  className="px-8 py-3 royal-gradient rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  View All Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-royal-gold">Premium</span> Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform">
              <Shield className="w-12 h-12 text-royal-emerald mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Security</h3>
              <p className="text-gray-400">Real-time threat detection and link scanning for maximum security.</p>
            </div>
            <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform">
              <Zap className="w-12 h-12 text-royal-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-400">Sub-second redirect times with global CDN infrastructure.</p>
            </div>
            <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform">
              <BarChart className="w-12 h-12 text-royal-blue mb-4" />
              <h3 className="text-xl font-semibold mb-3">Detailed Analytics</h3>
              <p className="text-gray-400">Comprehensive insights into your link performance and earnings.</p>
            </div>
            <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform">
              <Smartphone className="w-12 h-12 text-royal-purple mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mobile Optimized</h3>
              <p className="text-gray-400">Perfect experience across all devices and screen sizes.</p>
            </div>
            <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform">
              <CreditCard className="w-12 h-12 text-royal-emerald mb-4" />
              <h3 className="text-xl font-semibold mb-3">Instant Payouts</h3>
              <p className="text-gray-400">Multiple payment methods with same-day processing.</p>
            </div>
            <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform">
              <Headphones className="w-12 h-12 text-royal-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-400">Royal treatment with premium customer support around the clock.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-morphism rounded-2xl p-12 premium-shadow max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your 
              <span className="bg-gradient-to-r from-royal-gold to-royal-emerald bg-clip-text text-transparent"> Royal Journey</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of publishers earning premium rates with our luxury URL shortener platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/api/login"}
                className="px-8 py-4 royal-gradient rounded-xl font-semibold text-lg hover:scale-105 transition-transform premium-shadow"
              >
                Start Earning Now
              </button>
              <button className="px-8 py-4 glass-morphism rounded-xl font-semibold text-lg hover:bg-white hover:bg-opacity-10 transition-all">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="support" className="bg-royal-gray border-t border-white border-opacity-10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 royal-gradient rounded-lg flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-royal-gold to-royal-gold-light bg-clip-text text-transparent">
                  ShrinkEarn
                </span>
              </div>
              <p className="text-gray-400 mb-4">Premium URL shortener with royal monetization rates.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-royal-gold transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-royal-gold transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-royal-gold transition-colors">API</a></li>
                <li><a href="#" className="hover:text-royal-gold transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-royal-gold transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-royal-gold transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-royal-gold transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-royal-gold transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-royal-gold transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-royal-gold transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-royal-gold transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-royal-gold transition-colors">DMCA</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white border-opacity-10 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 ShrinkEarn. All rights reserved. 
              <span className="text-royal-gold"> Premium URL Shortener Platform</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
