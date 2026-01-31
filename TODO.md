# Forever Faux Wreaths - Connection Tasks

## Phase 1: Foundation
- [ ] 1. Create `hooks/use-session-id.ts` - guest session ID management for cart

## Phase 2: Convex Backend Queries
- [ ] 2. Add `getStats` query to `convex/orders.ts` (revenue, counts, month-over-month)
- [ ] 3. Add `getRecent` query to `convex/orders.ts` (recent orders list)
- [ ] 4. Add `getActiveCount` query to `convex/products.ts`
- [ ] 5. Add `getNewCount` query to `convex/bespokeEnquiries.ts`
- [ ] 6. Add `getRecent` query to `convex/bespokeEnquiries.ts`

## Phase 3: Frontend Connections
- [ ] 7. Update `app/shop/[slug]/page.tsx` - connect Add to Cart to `api.cart.addItem`
- [ ] 8. Update `app/cart/page.tsx` - full refactor to use Convex cart queries/mutations
- [ ] 9. Update `app/gallery/page.tsx` - use `api.galleryImages.getVisible` instead of hardcoded array
- [ ] 10. Update `app/admin/page.tsx` - connect dashboard to real stats queries

## Phase 4: Verification
- [ ] 11. **HARD STOP** - Run `npm run build` and verify no TypeScript errors
- [ ] 12. Start dev server with `npm run dev`
- [ ] 13. Test Add to Cart from product page
- [ ] 14. Test Cart page operations (view, quantity change, remove)
- [ ] 15. Test Gallery page loads from Convex
- [ ] 16. Test Admin dashboard shows real stats

## Complete
- [ ] 17. All tasks complete - run: `clawdbot gateway wake --text "Wreath site fully connected: admin dashboard, gallery, cart all using Convex" --mode now`

---
*Plan source: ~/.claude/plans/squishy-imagining-muffin.md*
*Created: 2026-01-31*
