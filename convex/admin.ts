import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { createAccount, modifyAccountCredentials } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const getSetupStatus = query({
  args: {},
  handler: async (ctx) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();

    const adminHasPasswordAccount = admin
      ? !!(await ctx.db
          .query("authAccounts")
          .withIndex("providerAndAccountId", (q) =>
            q.eq("provider", "password").eq("providerAccountId", admin.email.toLowerCase().trim())
          )
          .unique())
      : false;

    return {
      adminExists: !!admin,
      adminEmail: admin?.email ?? null,
      adminHasPasswordAccount,
    };
  },
});

export const getSetupStatusInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();

    const adminHasPasswordAccount = admin
      ? !!(await ctx.db
          .query("authAccounts")
          .withIndex("providerAndAccountId", (q) =>
            q.eq("provider", "password").eq("providerAccountId", admin.email.toLowerCase().trim())
          )
          .unique())
      : false;

    return {
      adminExists: !!admin,
      adminEmail: admin?.email ?? null,
      adminHasPasswordAccount,
    };
  },
});

export const getPasswordAccountInternal = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) =>
        q.eq("provider", "password").eq("providerAccountId", args.email.toLowerCase().trim())
      )
      .unique();
  },
});

export const setAdminRoleInternal = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!existingUser) {
      throw new Error(`User ${email} was not found after account creation.`);
    }

    await ctx.db.patch(existingUser._id, {
      role: "admin",
      ...(args.name ? { name: args.name.trim() || existingUser.name } : {}),
    });

    return existingUser._id;
  },
});

export const createInitialAdmin = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();

    if (existingAdmin) {
      throw new Error("An admin already exists. Cannot create initial admin.");
    }

    const email = args.email.toLowerCase().trim();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name: args.name ?? existingUser.name,
        role: "admin",
      });

      return {
        success: true,
        message:
          "Admin access reserved for this email. Finish the sign-up form with the same email address.",
      };
    }

    await ctx.db.insert("users", {
      email,
      name: args.name,
      role: "admin",
      createdAt: Date.now(),
    });

    return {
      success: true,
      message:
        "Admin access reserved for this email. Finish the sign-up form with the same email address.",
    };
  },
});

export const bootstrapAdminAccount = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ success: true; email: string; message: string }> => {
    const email = args.email.toLowerCase().trim();
    const name = args.name?.trim() || undefined;

    if (args.password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const setupStatus: {
      adminExists: boolean;
      adminEmail: string | null;
      adminHasPasswordAccount: boolean;
    } = await ctx.runQuery(internal.admin.getSetupStatusInternal, {});
    if (setupStatus.adminExists && setupStatus.adminEmail !== email) {
      throw new Error(
        `An admin already exists for ${setupStatus.adminEmail ?? "this deployment"}.`
      );
    }

    const existingPasswordAccount = await ctx.runQuery(
      internal.admin.getPasswordAccountInternal,
      { email }
    );

    if (existingPasswordAccount) {
      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: { id: email, secret: args.password },
      });
    } else {
      await (
        createAccount as unknown as (
          actionCtx: typeof ctx,
          accountArgs: {
            provider: "password";
            account: { id: string; secret: string };
            profile: Record<string, unknown> & { email: string };
          }
        ) => Promise<unknown>
      )(ctx, {
        provider: "password",
        account: { id: email, secret: args.password },
        profile: {
          email,
          ...(name ? { name } : {}),
        },
      });
    }

    await ctx.runMutation(internal.admin.setAdminRoleInternal, {
      email,
      name,
    });

    return {
      success: true,
      email,
      message: "Admin account created. You can now sign in at /admin/login.",
    };
  },
});
