import {
  users,
  links,
  linkAnalytics,
  cpmRates,
  withdrawals,
  referrals,
  type User,
  type UpsertUser,
  type Link,
  type InsertLink,
  type LinkAnalytics,
  type InsertLinkAnalytics,
  type CpmRate,
  type InsertCpmRate,
  type Withdrawal,
  type InsertWithdrawal,
  type Referral,
  type InsertReferral,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sum, count, and, gte, lte, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Link operations
  createLink(link: InsertLink): Promise<Link>;
  getLink(shortCode: string): Promise<Link | undefined>;
  getLinkById(id: string): Promise<Link | undefined>;
  getUserLinks(userId: string, limit?: number, offset?: number): Promise<Link[]>;
  updateLinkStats(linkId: string, earnings: number): Promise<void>;
  
  // Analytics operations
  recordAnalytics(analytics: InsertLinkAnalytics): Promise<void>;
  getLinkAnalytics(linkId: string, from?: Date, to?: Date): Promise<LinkAnalytics[]>;
  getUserAnalytics(userId: string, from?: Date, to?: Date): Promise<any>;
  
  // CPM operations
  getCpmRates(): Promise<CpmRate[]>;
  getCpmRate(country: string, device: string): Promise<CpmRate | undefined>;
  updateCpmRate(rate: InsertCpmRate): Promise<CpmRate>;
  
  // Withdrawal operations
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getUserWithdrawals(userId: string): Promise<Withdrawal[]>;
  getPendingWithdrawals(): Promise<Withdrawal[]>;
  updateWithdrawalStatus(id: string, status: string, adminNotes?: string): Promise<void>;
  
  // Referral operations
  createReferral(referral: InsertReferral): Promise<Referral>;
  getUserReferrals(userId: string): Promise<Referral[]>;
  updateUserEarnings(userId: string, earnings: number): Promise<void>;
  
  // Admin operations
  getAllUsers(limit?: number, offset?: number): Promise<User[]>;
  updateUserStatus(userId: string, isActive: boolean): Promise<void>;
  getSystemStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Generate referral code if not exists
    if (!userData.referralCode) {
      userData.referralCode = this.generateReferralCode();
    }

    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Link operations
  async createLink(linkData: InsertLink): Promise<Link> {
    const shortCode = this.generateShortCode();
    const [link] = await db
      .insert(links)
      .values({ ...linkData, shortCode })
      .returning();
    return link;
  }

  async getLink(shortCode: string): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.shortCode, shortCode));
    return link;
  }

  async getLinkById(id: string): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.id, id));
    return link;
  }

  async getUserLinks(userId: string, limit = 50, offset = 0): Promise<Link[]> {
    return await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(desc(links.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async updateLinkStats(linkId: string, earnings: number): Promise<void> {
    await db
      .update(links)
      .set({
        totalViews: sql`${links.totalViews} + 1`,
        totalEarnings: sql`${links.totalEarnings} + ${earnings}`,
        updatedAt: new Date(),
      })
      .where(eq(links.id, linkId));
  }

  // Analytics operations
  async recordAnalytics(analyticsData: InsertLinkAnalytics): Promise<void> {
    await db.insert(linkAnalytics).values(analyticsData);
  }

  async getLinkAnalytics(linkId: string, from?: Date, to?: Date): Promise<LinkAnalytics[]> {
    let query = db.select().from(linkAnalytics).where(eq(linkAnalytics.linkId, linkId));
    
    if (from && to) {
      query = query.where(
        and(
          gte(linkAnalytics.timestamp, from),
          lte(linkAnalytics.timestamp, to)
        )
      );
    }
    
    return await query.orderBy(desc(linkAnalytics.timestamp));
  }

  async getUserAnalytics(userId: string, from?: Date, to?: Date): Promise<any> {
    let baseQuery = db
      .select({
        totalViews: count(linkAnalytics.id),
        totalEarnings: sum(linkAnalytics.earnings),
        countries: sql`json_agg(DISTINCT ${linkAnalytics.country})`,
        devices: sql`json_agg(DISTINCT ${linkAnalytics.device})`,
      })
      .from(linkAnalytics)
      .leftJoin(links, eq(linkAnalytics.linkId, links.id))
      .where(eq(links.userId, userId));

    if (from && to) {
      baseQuery = baseQuery.where(
        and(
          eq(links.userId, userId),
          gte(linkAnalytics.timestamp, from),
          lte(linkAnalytics.timestamp, to)
        )
      );
    }

    const [result] = await baseQuery;
    return result;
  }

  // CPM operations
  async getCpmRates(): Promise<CpmRate[]> {
    return await db.select().from(cpmRates).where(eq(cpmRates.isActive, true));
  }

  async getCpmRate(country: string, device: string): Promise<CpmRate | undefined> {
    const [rate] = await db
      .select()
      .from(cpmRates)
      .where(
        and(
          eq(cpmRates.country, country),
          eq(cpmRates.device, device),
          eq(cpmRates.isActive, true)
        )
      );
    
    if (!rate) {
      // Try to get "all" device rate
      const [fallbackRate] = await db
        .select()
        .from(cpmRates)
        .where(
          and(
            eq(cpmRates.country, country),
            eq(cpmRates.device, "all"),
            eq(cpmRates.isActive, true)
          )
        );
      return fallbackRate;
    }
    
    return rate;
  }

  async updateCpmRate(rateData: InsertCpmRate): Promise<CpmRate> {
    const [rate] = await db
      .insert(cpmRates)
      .values({ ...rateData, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [cpmRates.country, cpmRates.device],
        set: {
          rate: rateData.rate,
          isActive: rateData.isActive,
          updatedAt: new Date(),
        },
      })
      .returning();
    return rate;
  }

  // Withdrawal operations
  async createWithdrawal(withdrawalData: InsertWithdrawal): Promise<Withdrawal> {
    const [withdrawal] = await db.insert(withdrawals).values(withdrawalData).returning();
    return withdrawal;
  }

  async getUserWithdrawals(userId: string): Promise<Withdrawal[]> {
    return await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.userId, userId))
      .orderBy(desc(withdrawals.requestedAt));
  }

  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.status, "pending"))
      .orderBy(desc(withdrawals.requestedAt));
  }

  async updateWithdrawalStatus(id: string, status: string, adminNotes?: string): Promise<void> {
    await db
      .update(withdrawals)
      .set({
        status,
        adminNotes,
        processedAt: new Date(),
      })
      .where(eq(withdrawals.id, id));
  }

  // Referral operations
  async createReferral(referralData: InsertReferral): Promise<Referral> {
    const [referral] = await db.insert(referrals).values(referralData).returning();
    return referral;
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    return await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));
  }

  async updateUserEarnings(userId: string, earnings: number): Promise<void> {
    await db
      .update(users)
      .set({
        totalEarnings: sql`${users.totalEarnings} + ${earnings}`,
        pendingEarnings: sql`${users.pendingEarnings} + ${earnings}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Admin operations
  async getAllUsers(limit = 50, offset = 0): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    await db
      .update(users)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async getSystemStats(): Promise<any> {
    const [userStats] = await db
      .select({
        totalUsers: count(users.id),
        activeUsers: count(sql`CASE WHEN ${users.isActive} THEN 1 END`),
      })
      .from(users);

    const [linkStats] = await db
      .select({
        totalLinks: count(links.id),
        totalViews: sum(links.totalViews),
      })
      .from(links);

    const [withdrawalStats] = await db
      .select({
        pendingWithdrawals: sum(sql`CASE WHEN ${withdrawals.status} = 'pending' THEN ${withdrawals.amount} ELSE 0 END`),
        totalPaid: sum(sql`CASE WHEN ${withdrawals.status} = 'paid' THEN ${withdrawals.amount} ELSE 0 END`),
      })
      .from(withdrawals);

    return {
      users: userStats,
      links: linkStats,
      withdrawals: withdrawalStats,
    };
  }

  // Helper methods
  private generateShortCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateReferralCode(): string {
    return randomBytes(6).toString('hex').toUpperCase();
  }
}

export const storage = new DatabaseStorage();
