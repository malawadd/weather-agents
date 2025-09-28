import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Seed demo data for guest users
export const seedDemoData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if demo user already exists
    const existingDemoUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isDemo"), true))
      .first();

    if (existingDemoUser) {
      return existingDemoUser._id;
    }

    // Create demo user
    const demoUserId = await ctx.db.insert("users", {
      name: "Demo User",
      createdAt: Date.now(),
      isDemo: true,
    });

    return demoUserId;
  },
});

// Public mutation to initialize demo data
export const initializeDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // This is a public endpoint that can be called to seed demo data
    // In production, you might want to protect this or run it automatically
    await ctx.runMutation(api.demoData.seedDemoData, {});
    return "Demo data initialization triggered";
  },
});
