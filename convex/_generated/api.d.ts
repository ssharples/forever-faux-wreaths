/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bespokeEnquiries from "../bespokeEnquiries.js";
import type * as cart from "../cart.js";
import type * as categories from "../categories.js";
import type * as galleryImages from "../galleryImages.js";
import type * as newsletterSubscribers from "../newsletterSubscribers.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as siteSettings from "../siteSettings.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  bespokeEnquiries: typeof bespokeEnquiries;
  cart: typeof cart;
  categories: typeof categories;
  galleryImages: typeof galleryImages;
  newsletterSubscribers: typeof newsletterSubscribers;
  orders: typeof orders;
  products: typeof products;
  reviews: typeof reviews;
  siteSettings: typeof siteSettings;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
