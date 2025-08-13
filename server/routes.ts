import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLinkSchema, insertWithdrawalSchema, insertCpmRateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Anonymous URL shortening
  app.post('/api/shorten', async (req, res) => {
    try {
      const { originalUrl, title, description } = req.body;
      
      if (!originalUrl) {
        return res.status(400).json({ message: "URL is required" });
      }

      const link = await storage.createLink({
        originalUrl,
        title,
        description,
        userId: null, // Anonymous link
      });

      res.json({
        shortUrl: `${req.protocol}://${req.get('host')}/s/${link.shortCode}`,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
      });
    } catch (error) {
      console.error("Error creating link:", error);
      res.status(500).json({ message: "Failed to create short link" });
    }
  });

  // User link creation
  app.post('/api/links', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertLinkSchema.parse(req.body);
      
      const link = await storage.createLink({
        ...validatedData,
        userId,
      });

      res.json({
        ...link,
        shortUrl: `${req.protocol}://${req.get('host')}/s/${link.shortCode}`,
      });
    } catch (error) {
      console.error("Error creating user link:", error);
      res.status(500).json({ message: "Failed to create link" });
    }
  });

  // Get user links
  app.get('/api/links', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;

      const links = await storage.getUserLinks(userId, limit, offset);
      
      const linksWithUrls = links.map(link => ({
        ...link,
        shortUrl: `${req.protocol}://${req.get('host')}/s/${link.shortCode}`,
      }));

      res.json(linksWithUrls);
    } catch (error) {
      console.error("Error fetching user links:", error);
      res.status(500).json({ message: "Failed to fetch links" });
    }
  });

  // Link redirect and analytics
  app.get('/s/:shortCode', async (req, res) => {
    try {
      const { shortCode } = req.params;
      const link = await storage.getLink(shortCode);

      if (!link || !link.isActive) {
        return res.status(404).json({ message: "Link not found" });
      }

      // Record analytics
      const country = req.headers['cf-ipcountry'] as string || 'US';
      const device = req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop';
      
      // Get CPM rate
      const cpmRate = await storage.getCpmRate(country, device);
      const earnings = cpmRate ? parseFloat(cpmRate.rate.toString()) / 1000 : 0;

      // Record analytics
      await storage.recordAnalytics({
        linkId: link.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        country,
        device,
        referrer: req.headers.referer,
        earnings: earnings.toString(),
      });

      // Update link stats
      await storage.updateLinkStats(link.id, earnings);

      // Update user earnings if link has owner
      if (link.userId) {
        await storage.updateUserEarnings(link.userId, earnings);
      }

      // Redirect to original URL
      res.redirect(link.originalUrl);
    } catch (error) {
      console.error("Error processing redirect:", error);
      res.status(500).json({ message: "Failed to process redirect" });
    }
  });

  // User analytics
  app.get('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;

      const analytics = await storage.getUserAnalytics(userId, from, to);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // User withdrawals
  app.post('/api/withdrawals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertWithdrawalSchema.parse(req.body);

      const withdrawal = await storage.createWithdrawal({
        ...validatedData,
        userId,
      });

      res.json(withdrawal);
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      res.status(500).json({ message: "Failed to create withdrawal request" });
    }
  });

  app.get('/api/withdrawals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const withdrawals = await storage.getUserWithdrawals(userId);
      res.json(withdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  // Referrals
  app.get('/api/referrals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const referrals = await storage.getUserReferrals(userId);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Admin routes
  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Admin: Get all users
  app.get('/api/admin/users', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = (page - 1) * limit;

      const users = await storage.getAllUsers(limit, offset);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin: Update user status
  app.patch('/api/admin/users/:userId/status', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      await storage.updateUserStatus(userId, isActive);
      res.json({ message: "User status updated successfully" });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  // Admin: Get system stats
  app.get('/api/admin/stats', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching system stats:", error);
      res.status(500).json({ message: "Failed to fetch system stats" });
    }
  });

  // Admin: Get pending withdrawals
  app.get('/api/admin/withdrawals', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const withdrawals = await storage.getPendingWithdrawals();
      res.json(withdrawals);
    } catch (error) {
      console.error("Error fetching pending withdrawals:", error);
      res.status(500).json({ message: "Failed to fetch pending withdrawals" });
    }
  });

  // Admin: Update withdrawal status
  app.patch('/api/admin/withdrawals/:withdrawalId', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { withdrawalId } = req.params;
      const { status, adminNotes } = req.body;

      await storage.updateWithdrawalStatus(withdrawalId, status, adminNotes);
      res.json({ message: "Withdrawal status updated successfully" });
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      res.status(500).json({ message: "Failed to update withdrawal status" });
    }
  });

  // Admin: Get CPM rates
  app.get('/api/admin/cpm-rates', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const rates = await storage.getCpmRates();
      res.json(rates);
    } catch (error) {
      console.error("Error fetching CPM rates:", error);
      res.status(500).json({ message: "Failed to fetch CPM rates" });
    }
  });

  // Admin: Update CPM rate
  app.post('/api/admin/cpm-rates', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertCpmRateSchema.parse(req.body);
      const rate = await storage.updateCpmRate(validatedData);
      res.json(rate);
    } catch (error) {
      console.error("Error updating CPM rate:", error);
      res.status(500).json({ message: "Failed to update CPM rate" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
