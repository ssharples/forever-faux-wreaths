import type { QueryCtx, MutationCtx } from "./_generated/server";
import { auth } from "./auth";

type AuthenticatedCtx = QueryCtx | MutationCtx;

export async function getCurrentUserOrThrow(ctx: AuthenticatedCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) {
    throw new Error("You must be signed in.");
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User record not found.");
  }

  return user;
}

export async function requireAdmin(ctx: AuthenticatedCtx) {
  const user = await getCurrentUserOrThrow(ctx);
  if (user.role !== "admin") {
    throw new Error("Admin access required.");
  }
  return user;
}
