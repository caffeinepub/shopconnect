# Waris Bhai Mobile Store

## Current State
ShopConnect eCommerce site with backend supporting: products (CRUD), orders, contact inquiries, authorization (admin/user roles). Frontend has product gallery, admin panel with orders/settings, WhatsApp order notifications.

## Requested Changes (Diff)

### Add
- Floating WhatsApp button (fixed position, always visible on scroll) linking to wa.me/919813983483 with pre-filled message: "Hi Waris Bhai, I am interested in buying a mobile. Can you share the latest prices?"
- Contact Us page with warisbhaimewati@gmail.com displayed and a "Click to Email" button
- "Verified Seller" badge displayed prominently (hero section / header)
- "Fast Delivery" banner (hero section or site-wide banner)
- Featured Phones section on the Home page (showcasing select products)
- Product Gallery page (grid of all phones/accessories)
- Mobile-first, modern, tech-focused design with dark/neon or clean blue-white palette

### Modify
- Rebrand entire site to "Waris Bhai Mobiles" (or similar smartphone shop name)
- Home page hero: smartphone-focused copy with trust badges (Verified Seller, Fast Delivery, WhatsApp availability)
- Navigation: Home, Products, Contact Us
- Product cards to show smartphone-specific categories (Smartphones, Accessories)

### Remove
- Generic store branding
- Game wallet references (already removed in v2/v3)

## Implementation Plan
1. Rebrand site name and navigation to smartphone store identity
2. Build Home page: hero with tagline, Verified Seller badge, Fast Delivery banner, Featured Phones section (shows first 6 products), WhatsApp CTA
3. Build Product Gallery page: filterable grid by category (All, Smartphones, Accessories)
4. Build Contact Us page: display email warisbhaimewati@gmail.com, "Click to Email" mailto button, contact form (uses existing submitInquiry backend), WhatsApp quick chat link
5. Add floating WhatsApp button (fixed bottom-right, green, visible always) with pre-filled message
6. Seed sample smartphone products in frontend if no products exist yet (displayed from frontend mock data as fallback)
7. Maintain existing admin panel and order flow
