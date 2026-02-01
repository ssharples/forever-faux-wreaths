# Forever Faux Wreaths - SEO Restructure Plan

**Goal:** Rank for high-intent keywords like "wreaths for funerals", "wreaths near me", "custom wreaths", "memorial wreaths Preston"

**Location:** Preston, Lancashire, UK

---

## Executive Summary

To rank for these keywords, we need:
1. **Dedicated landing pages** for each keyword category (not just product listings)
2. **Local SEO optimization** (Google Business Profile, local schema, NAP consistency)
3. **Content-rich pages** with 1000+ words targeting specific intents
4. **Technical SEO improvements** (structured data, meta tags, internal linking)
5. **Service area pages** for "near me" searches

---

## Part 1: Target Keywords & Search Intent

### Primary Keywords (High Priority)
| Keyword | Monthly Searches (UK) | Intent | Current Page |
|---------|----------------------|--------|--------------|
| wreaths for funerals | ~2,400 | Transactional | ❌ None |
| memorial wreaths | ~1,900 | Transactional | ❌ None |
| funeral flowers wreaths | ~1,300 | Transactional | ❌ None |
| custom wreaths | ~880 | Transactional | `/bespoke` (weak) |
| door wreaths | ~2,900 | Transactional | `/shop` (weak) |
| christmas wreaths | ~14,800 | Seasonal | ❌ None |
| autumn wreaths | ~3,600 | Seasonal | ❌ None |

### Local Keywords (Critical for "Near Me")
| Keyword | Intent | Required |
|---------|--------|----------|
| wreaths near me | Local | Google Business Profile + Location pages |
| funeral wreaths Preston | Local | Dedicated page |
| wreaths Lancashire | Local | Dedicated page |
| florist Preston wreaths | Local | Local landing page |
| door wreaths Manchester | Local | Service area page |

### Long-Tail Keywords (Content Opportunities)
- "how long do faux wreaths last"
- "difference between fresh and faux wreaths"
- "memorial wreath ideas for graves"
- "front door wreath ideas"
- "custom funeral wreath with photos"

---

## Part 2: Site Structure Recommendations

### Current Structure
```
/
├── /shop (all products)
├── /shop/[slug] (product pages)
├── /bespoke
├── /gallery
├── /about
├── /contact
└── /info/*
```

### Proposed SEO-Optimized Structure
```
/
├── /shop
│   └── /shop/[slug]
│
├── /collections (NEW - Category Landing Pages)
│   ├── /collections/memorial-wreaths ⭐ HIGH PRIORITY
│   ├── /collections/funeral-wreaths ⭐ HIGH PRIORITY  
│   ├── /collections/door-wreaths
│   ├── /collections/christmas-wreaths
│   ├── /collections/autumn-wreaths
│   └── /collections/seasonal-wreaths
│
├── /bespoke
│   ├── /bespoke/funeral-tributes (NEW)
│   ├── /bespoke/memorial-wreaths (NEW)
│   └── /bespoke/custom-door-wreaths (NEW)
│
├── /service-areas (NEW - Local SEO)
│   ├── /service-areas/preston
│   ├── /service-areas/lancashire
│   ├── /service-areas/manchester
│   └── /service-areas/liverpool
│
├── /guides (NEW - Content/Blog)
│   ├── /guides/choosing-funeral-wreath
│   ├── /guides/memorial-wreath-etiquette
│   └── /guides/caring-for-faux-wreaths
│
├── /gallery
├── /about
├── /contact
└── /info/*
```

---

## Part 3: New Pages to Create

### 3.1 Collection Landing Pages (Priority 1)

#### `/collections/memorial-wreaths`
**Target Keywords:** memorial wreaths, tribute wreaths, remembrance wreaths
**Content Requirements:**
- H1: "Memorial Wreaths - Lasting Tributes That Never Fade"
- 1000+ words of unique content
- Sections: Why Choose Faux Memorial Wreaths, Popular Styles, Customization Options
- Product grid filtered to memorial style
- FAQ section with schema markup
- Testimonials from customers
- CTA to bespoke service

#### `/collections/funeral-wreaths`
**Target Keywords:** funeral wreaths, wreaths for funerals, funeral flower arrangements
**Content Requirements:**
- H1: "Funeral Wreaths - Beautiful Tributes for Your Loved Ones"
- Explain faux vs fresh for funerals (longevity, no wilting at service)
- Price guide section
- Delivery information for funeral directors
- Same-day/next-day options
- Links to bespoke funeral tributes

#### `/collections/door-wreaths`
**Target Keywords:** door wreaths, front door wreaths, outdoor wreaths
**Content Requirements:**
- H1: "Front Door Wreaths - Year-Round Elegance"
- Size guide (measure your door)
- Indoor vs outdoor suitability
- Seasonal rotation suggestions

#### `/collections/christmas-wreaths`
**Target Keywords:** christmas wreaths, festive door wreaths, holiday wreaths
**Seasonal page - high priority October-December**

#### `/collections/autumn-wreaths`
**Target Keywords:** autumn wreaths, fall wreaths, harvest wreaths
**Seasonal page - high priority August-November**

---

### 3.2 Service Area Pages (Priority 2 - Local SEO)

#### `/service-areas/preston`
**Target Keywords:** wreaths Preston, funeral wreaths Preston, florist Preston
**Content:**
- "Handcrafted Wreaths in Preston, Lancashire"
- Local collection option details
- Preston delivery information
- Mention of local landmarks/areas served
- Google Maps embed
- Local testimonials

#### `/service-areas/lancashire`
**Target Keywords:** wreaths Lancashire, funeral flowers Lancashire
**Content:**
- Coverage map of Lancashire
- Delivery times by area
- List of towns served (Blackpool, Blackburn, Burnley, etc.)

#### `/service-areas/manchester`
**Target Keywords:** wreaths Manchester, funeral wreaths Manchester
**Content:**
- Delivery to Greater Manchester
- Next-day delivery options
- Manchester-specific testimonials if available

---

### 3.3 Bespoke Sub-Pages (Priority 3)

#### `/bespoke/funeral-tributes`
**Target Keywords:** custom funeral wreaths, bespoke funeral flowers, personalised tributes
**Content:**
- Gallery of past funeral tribute work
- Process for ordering (timeline, consultation)
- Popular designs: hearts, crosses, letters, themed tributes
- Working with funeral directors
- Rush order information

#### `/bespoke/memorial-wreaths`
**Target Keywords:** custom memorial wreaths, personalised remembrance wreaths
**Content:**
- Anniversary/birthday memorial options
- Grave decoration wreaths
- Pet memorial wreaths

---

### 3.4 Guide/Blog Pages (Priority 4 - Content Marketing)

#### `/guides/choosing-funeral-wreath`
**Target Keywords:** how to choose funeral wreath, funeral wreath etiquette, what wreath for funeral
**Content:**
- 1500+ words comprehensive guide
- Sections on colors, sizes, styles, messaging
- Relationship-appropriate suggestions (parent, spouse, friend, colleague)
- FAQ with schema

#### `/guides/faux-vs-fresh-wreaths`
**Target Keywords:** faux wreaths vs real, artificial wreaths benefits
**Content:**
- Comparison table
- Longevity, cost over time, environmental impact
- When to choose faux (funerals, year-round display, allergies)

---

## Part 4: Technical SEO Improvements

### 4.1 Structured Data (Schema.org)

**Add to all pages:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Forever Faux Wreaths",
  "image": "https://foreverfauxwreaths.co.uk/images/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Preston",
    "addressRegion": "Lancashire",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 53.7632,
    "longitude": -2.7031
  },
  "url": "https://foreverfauxwreaths.co.uk",
  "telephone": "+44-XXXX-XXXXXX",
  "priceRange": "££",
  "openingHoursSpecification": {...}
}
```

**Add to product pages:**
```json
{
  "@type": "Product",
  "name": "...",
  "image": "...",
  "description": "...",
  "offers": {
    "@type": "Offer",
    "price": "65.00",
    "priceCurrency": "GBP",
    "availability": "InStock",
    "seller": {...}
  },
  "aggregateRating": {...}
}
```

**Add to collection pages:**
```json
{
  "@type": "CollectionPage",
  "name": "Memorial Wreaths",
  "description": "...",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [...]
  }
}
```

**Add to FAQ sections:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long do faux wreaths last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

### 4.2 Meta Tags Template

**Collection Pages:**
```
Title: {Category} Wreaths | Handcrafted in Preston | Forever Faux Wreaths
Description: Beautiful handcrafted {category} wreaths that last forever. Free local collection in Preston. UK delivery available. Browse our collection of {count}+ designs.
```

**Product Pages:**
```
Title: {Product Name} | {Style} Wreath | £{Price} | Forever Faux Wreaths
Description: {Short description}. Handcrafted faux wreath, {size}. {Stock status}. Free Preston collection, UK delivery from £4.99.
```

**Service Area Pages:**
```
Title: Wreaths in {Location} | Local Collection & Delivery | Forever Faux Wreaths
Description: Handcrafted faux wreaths available in {Location}. {Delivery/collection info}. Memorial wreaths, door wreaths & bespoke designs. Order online today.
```

### 4.3 Internal Linking Strategy

1. **Product → Collection:** Every product links to its parent collection
2. **Collection → Bespoke:** "Want something custom? See our bespoke service"
3. **Homepage → Top Collections:** Feature memorial, funeral, and door wreaths prominently
4. **Footer:** Add collection category links
5. **Blog → Products:** Guides link to relevant products
6. **Cross-sell:** "You may also like" on product pages

### 4.4 URL Structure

✅ Good: `/collections/memorial-wreaths`
❌ Bad: `/shop?category=memorial`

✅ Good: `/service-areas/preston`
❌ Bad: `/areas/1`

---

## Part 5: Google Business Profile Optimization

### Required Setup:
1. **Create/Claim Google Business Profile** for "Forever Faux Wreaths"
2. **Categories:** 
   - Primary: "Florist" or "Gift Shop"
   - Secondary: "Wreath Supplier", "Funeral Flower Shop"
3. **Service Area:** Preston + surrounding areas (define radius)
4. **Products:** Add top products with prices and images
5. **Posts:** Weekly posts about new products, seasonal collections
6. **Reviews:** Encourage customer reviews (follow up emails)
7. **Photos:** Upload high-quality product photos, workspace photos
8. **Q&A:** Pre-populate common questions

### NAP Consistency (Name, Address, Phone)
Ensure identical business info across:
- Google Business Profile
- Website footer
- Facebook
- Instagram
- Yell.com
- Thomson Local
- Bing Places
- Apple Maps

---

## Part 6: Content Calendar

### Month 1: Foundation
- [ ] Create `/collections/memorial-wreaths` page
- [ ] Create `/collections/funeral-wreaths` page
- [ ] Set up Google Business Profile
- [ ] Add LocalBusiness schema to site
- [ ] Update sitemap to include new pages

### Month 2: Local SEO
- [ ] Create `/service-areas/preston` page
- [ ] Create `/service-areas/lancashire` page
- [ ] Add Product schema to all product pages
- [ ] Submit site to local directories
- [ ] Start requesting customer reviews

### Month 3: Content & Expansion
- [ ] Create `/guides/choosing-funeral-wreath`
- [ ] Create `/collections/door-wreaths`
- [ ] Create `/bespoke/funeral-tributes`
- [ ] Add FAQ schema to relevant pages
- [ ] Build 2-3 local backlinks

### Ongoing:
- Weekly Google Business posts
- Monthly blog/guide content
- Seasonal collection pages (Christmas by October, etc.)
- Review monitoring and responses

---

## Part 7: Tracking & KPIs

### Tools Needed:
- Google Search Console (track rankings, impressions, clicks)
- Google Analytics 4 (track conversions, traffic sources)
- Google Business Profile Insights (local visibility)

### KPIs to Track:
| Metric | Baseline | 3-Month Target | 6-Month Target |
|--------|----------|----------------|----------------|
| Organic traffic | ? | +50% | +150% |
| "near me" impressions | 0 | 500/mo | 2000/mo |
| "funeral wreaths" ranking | Not ranked | Top 20 | Top 10 |
| "memorial wreaths" ranking | Not ranked | Top 20 | Top 10 |
| Google Business views | 0 | 500/mo | 1500/mo |
| Review count | ? | +10 | +30 |

---

## Part 8: Quick Wins (Do This Week)

1. **Add location to footer:** "Preston, Lancashire, UK"
2. **Add phone number** to header and footer
3. **Update homepage meta title:** Include "Preston" and key service
4. **Add "Memorial" filter/category** to shop page
5. **Create Google Business Profile** (if not exists)
6. **Add breadcrumbs** with schema to product pages

---

## Implementation Priority

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| 🔴 P1 | Create Memorial Wreaths collection page | High | Medium |
| 🔴 P1 | Create Funeral Wreaths collection page | High | Medium |
| 🔴 P1 | Set up Google Business Profile | High | Low |
| 🟡 P2 | Add LocalBusiness schema | Medium | Low |
| 🟡 P2 | Create Preston service area page | Medium | Medium |
| 🟡 P2 | Add Product schema to products | Medium | Low |
| 🟢 P3 | Create guide content | Medium | High |
| 🟢 P3 | Build local backlinks | Medium | High |

---

## Files to Create/Modify

### New Pages:
```
app/collections/
├── page.tsx (collections index)
├── memorial-wreaths/page.tsx
├── funeral-wreaths/page.tsx
├── door-wreaths/page.tsx
├── christmas-wreaths/page.tsx
└── autumn-wreaths/page.tsx

app/service-areas/
├── page.tsx (areas index)
├── preston/page.tsx
├── lancashire/page.tsx
└── manchester/page.tsx

app/guides/
├── page.tsx (guides index)
└── choosing-funeral-wreath/page.tsx

app/bespoke/
├── funeral-tributes/page.tsx
└── memorial-wreaths/page.tsx
```

### Modify:
- `app/layout.tsx` - Add LocalBusiness schema
- `app/shop/[slug]/page.tsx` - Add Product schema
- `app/sitemap.ts` - Include new pages
- `components/layout/footer.tsx` - Add location, phone, collection links

---

*Plan created: 2026-02-01*
*Target domain: foreverfauxwreaths.co.uk*
