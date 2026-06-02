import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

type UsersDb = {
  patch: (
    id: Id<"users">,
    value: {
      email: string;
      name?: string;
    }
  ) => Promise<void>;
  insert: (
    table: "users",
    value: {
      email: string;
      name?: string;
      role: "customer";
      createdAt: number;
    }
  ) => Promise<Id<"users">>;
  query: (table: "users") => {
    withIndex: (
      index: "by_email",
      cb: (q: { eq: (field: "email", value: string) => unknown }) => unknown
    ) => {
      first: () => Promise<{ _id: Id<"users"> } | null>;
    };
  };
};

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const db = ctx.db as unknown as UsersDb;
      const email = args.profile.email?.toLowerCase().trim();
      const name =
        typeof args.profile.name === "string" && args.profile.name.trim().length > 0
          ? args.profile.name.trim()
          : undefined;

      if (!email) {
        throw new Error("Email is required for password authentication.");
      }

      if (args.existingUserId) {
        await db.patch(args.existingUserId, {
          email,
          ...(name ? { name } : {}),
        });
        return args.existingUserId;
      }

      const existingUser = await db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (existingUser) {
        await db.patch(existingUser._id, {
          email,
          ...(name ? { name } : {}),
        });
        return existingUser._id;
      }

      return await db.insert("users", {
        email,
        name,
        role: "customer",
        createdAt: Date.now(),
      });
    },
  },
});
