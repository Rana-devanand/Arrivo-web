# Arrivo website: rules for every task

Marketing site for **Arrivo**, a travel-safety mobile app (Flutter app and backend live in `../../` , analysis in `docs/ARRIVO_APP_ANALYSIS.md`). Brand direction: sand `#EADDCA` surfaces with black buttons. Next.js App Router, TypeScript (strict), Tailwind CSS v4.
This Next.js version differs from older releases: read the relevant guide in `node_modules/next/dist/docs/` before using an API (see `AGENTS.md`). `cacheComponents` is on in `next.config.ts`; do not read request-time data or call `new Date()` / `Math.random()` in server components.

## Quality targets (non-negotiable)

- Lighthouse **SEO 100** on every page.
- Lighthouse **Performance, Accessibility, Best Practices >= 90** on every page, mobile and desktop.
- A task is not finished until these are met and `npm run build` and `npm run lint` pass with zero errors and warnings. If a change would lower a score, find another way.

## Rendering and performance

- Server Components by default. `"use client"` only on small leaf components that truly need interactivity.
- Pages are statically rendered (SSG) unless there is a clear reason not to.
- Images use `next/image` with `width`, `height` and `alt`. Only the hero image gets `priority`.
- Fonts load through `next/font` only. No external font `<link>` tags.
- No heavy UI or animation libraries without approval. Prefer CSS.
- Third-party scripts only through `next/script` with `strategy="lazyOnload"` or `"afterInteractive"`.
- Avoid layout shift: always reserve space for images, embeds and fonts.
- No unused code, console logs, or commented-out blocks.

## SEO

- Every page exports `metadata` or `generateMetadata` with a unique `title` and a `description` of 150 to 160 characters. Build it with `buildMetadata()` from `src/lib/seo.ts`.
- `metadataBase`, canonical URLs, Open Graph and Twitter tags are set (root layout plus `buildMetadata`).
- Exactly one `<h1>` per page. Headings in order (h1, h2, h3), no skipped levels. Use the `Heading` component.
- Semantic HTML: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Keep `src/app/sitemap.ts`, `src/app/robots.ts` and `src/app/opengraph-image.tsx` current. Add every new page to the sitemap.
- JSON-LD: `SoftwareApplication` for the app, `Organization` site-wide (root layout), `FAQPage` wherever an FAQ renders. Use the `JsonLd` component.
- Links have descriptive text (never "click here"). Icon-only buttons need an `aria-label`.
- Important text is real HTML text, never inside images.
- Phone visuals are real screenshots of the Flutter app in `public/screens/*.webp`, shown through `AppScreen`. Re-capture them when the app UI changes. Testimonial photos go through `Avatar` `src` and must be real, permitted customers.

## Code organization and reuse

- Never duplicate UI. Used twice means a shared component.
- `src/components/ui/`: small reusable pieces (Button, Container, Section, Heading, Badge, Card, ...).
- `src/components/layout/`: Header, Navbar, Footer.
- `src/components/sections/`: page sections (Hero, Features, ...).
- `src/config/site.ts`: site name, URL, description, social links, store links, nav items.
- `src/config/content.ts`: features, steps, showcase, testimonials, FAQs. Copy lives in config, not in JSX.
- `src/lib/seo.ts`: metadata builder driven by `site.ts`.
- `src/styles/theme.css`: the single source of truth for colors and design tokens.
- Import with the `@/` alias (maps to `src/`). TypeScript strict; no `any`.

## Theme

- No hard-coded colors anywhere: no hex, rgb, `bg-blue-500`-style classes. Use token classes only (`bg-primary`, `text-foreground`, `border-border`, ...). The default Tailwind palette is disabled in `theme.css`, so palette classes render nothing.
- Hex values exist only inside `theme.css`.
- Every foreground/background pair must meet WCAG AA (4.5:1 body text), in light and dark mode. Run `npm run check:contrast` after editing the theme.
- To restyle the site, edit the variables in `:root` and the dark block in `theme.css`. Nothing else.

## Content honesty

- Unknown facts (stats, prices, ratings, reviews, store URLs, legal text) use `[PLACEHOLDER]` text. Never invent numbers or testimonials.
- The production URL comes from `NEXT_PUBLIC_SITE_URL` (see `src/config/site.ts`).

## The live watch page (/watch)

- `/watch#<secret>` shows a journey someone shared (`src/app/watch/page.tsx`, `src/components/watch/`, logic in `src/lib/watch.ts`). The secret is after the # on purpose: the server never sees it, so do not move it into the path or the query. The page is noindex, sends no referrer, and is disallowed in `robots.ts`; it is not in the sitemap.
- It reads the Arrivo API (`siteConfig.apiUrl`: `http://localhost:4000` under `npm run dev`, the live API in a build, `NEXT_PUBLIC_API_URL` overrides). Status colours are tokens (`success`, `warning`, `danger`) and are always paired with an icon and words.
- Never say "live" for a position that has stopped updating. Logic that needs testing goes in `src/lib/watch.ts` (no imports) and `scripts/check-watch.mjs`.

## The account dashboard (/account)

- `/account`, `/account/plan`, `/account/journeys` (`src/app/account/`, `src/components/account/`, pure logic in `src/lib/account.ts`). Private: noindex, no referrer, disallowed in `robots.ts`, not in the sitemap. Every page is static; all data is loaded in the browser with the person's own token, so nothing personal is rendered on the server.
- Sign-in is Google through Supabase (`src/lib/supabase.ts`, PKCE). Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (see `.env.example`); without them the page says sign-in is not switched on. Only public values: never the service-role key. In Supabase (Authentication, URL configuration) add exactly `http://localhost:3000/account` and `https://tryarrivo.com/account` to the redirect URLs (sign-in always returns to `<site>/account`; a pattern such as `/account/**` does NOT match it, and an address that is not allowed sends people to the Site URL, the home page), and turn the Google provider on with the web client.
- The account area is its own full-screen app: the website's navbar and footer are left out on every `/account` route (`HideInAccount` in the root layout). When signed in, `AccountShell` is a fixed screen. On wide screens it has the sidebar (the brand and the menu at the top, the person and Log out at the bottom); on phones a slim top bar with the brand and a burger, whose bottom sheet (`AccountMobileBar`) holds the menu, the person and Log out. Only the content scrolls. The menu items live in `accountMenu.ts`, shared by both. Signed out, it is just the sign-in card with links back to the website, Terms and Privacy.
- Look of the dashboard: plain cards (`Panel`: white, thin border, no shadow), an `IconTile` leading each card or row, and the icons of `Icon.tsx` everywhere (dashboard, crown, map, creditCard, checkCircle, alert, circleX, and car, bike, walk, train for how a journey was made, chosen by `modeIcon` in `lib/account.ts`). The sidebar shows the static `BrandMark` (a house in a circle) and the name in capitals (no animation, no link), with small 13px text and an icon tile on every menu item. The public site's full-screen loader is also left out on `/account` (`HideInAccount`). The site has no custom cursor: do not add one back. While we find out whether someone is signed in, `DashboardSkeleton` shows the frame in grey blocks (with a screen-reader-only h1, so the static page still has exactly one); while a screen's data loads, `BodyLoader` (`public/loader.svg`, the owner's file) is centred in the middle of the body (`ResourceView` and `AdminOnly` use it; `loader="inline"` is the small one for a list under other content, as on Offers). The body area is a flex column (`AccountFrame`) so the loader can fill it. Do not add per-screen skeletons back. `PlanCard` takes `flat` for this look.
- `AccountProvider` holds who is signed in; `useAccountResource(path, parse)` loads an API path (loading, error with retry, data). Parsers in `lib/account.ts` return null for a reply they do not understand and copy only the fields the screens show: never keep or render coordinates, routes, ride photos or tracking tokens that the API sends the owner.
- Paying: `PricingPlans` takes an `account` prop on the dashboard, and its buttons call `POST /v1/billing/checkout-session` (`startCheckout` in `accountApi.ts`); without it, the public page uses the app's ticket as before. Plan changes for someone who already pays go through Manage subscription (`openPortal`), never a second payment. Card details are only ever entered on the payment partner's page.
- On the public `/pricing` page the "Get started" buttons open `/account` (Free) and `/account/plan` (Plus, Family): sign in first. Google always returns to `/account`; `AccountShell` then takes the person on to the page they started from (`AFTER_SIGN_IN_KEY` in sessionStorage, only our own account pages are allowed: `safeReturnPath`).
- Anything that reads the estimate (`usePriceEstimate`) gets nothing until its component has hydrated, because the plan cards sit behind Suspense and hydrate after the provider has fetched rates; reading them earlier causes a hydration mismatch.
- The public navbar (and the phone menu sheet) has a `LoginButton`: "Log in" opens `/account`, which asks for Google sign-in; it says "Dashboard" when this browser holds a Supabase session key (checked in localStorage, so the sign-in library is not loaded on public pages).
- Error text: the API's 4xx messages and its 503 are written for people and are shown; any other 5xx is replaced by a calm sentence so no detail leaks.

## Dashboard top bar, admin screens and offers

- Every dashboard page starts with `AccountTopBar` (sticky, inside the content): an icon tile, a breadcrumb, the page name as the one `h1` (`Heading size={7}`), a short line and chips (plan, Admin, today). Page names and lines live in `accountPages.ts`. Body text in the dashboard is `text-sm`, labels `text-xs`; keep it small.
- Admin pages: `/account/admin/users`, `/account/admin/notifications`, `/account/admin/offers` (`AdminUsers`, `AdminNotifications`, `AdminOffers`, all wrapped in `AdminOnly`). The menu shows them only when `GET /v1/me` says `ADMIN` (`isAdmin` in `AccountProvider`), but the server is what enforces it (`requireAdmin`): hiding is not security. Parsers and filters are in `lib/admin.ts` (no imports, tested by `npm run check:admin`) and copy only the fields shown: never coordinates, routes, photos or tokens.
- Offers: admins make them in `OfferForm` (live preview with `OfferCard`), `AdminOfferRow` shows the status and a two-step "End now". People who do not pay yet see the best live offer (`bestOffer`) as `OfferCard` on the dashboard; on `/account/plan` it is applied by default (removable) and `startCheckout(token, plan, coupon)` sends it. Offer logic (`effectiveOfferStatus`, `offerWindow`, `validateOffer`, `discountedCents`) is in `lib/account.ts`. Discounts are first payment only and enforced by the payment partner; the card never promises more.
- Revenue (`/account/admin/revenue`, `AdminRevenue`): reads `GET /v1/admin/payments` (from Dodo, newest 500). Amounts are in the smallest unit (cents); `formatMoney` does the dividing and `revenueSummary` adds each currency on its own, never across currencies. Logic (`parseAdminPayments`, `paymentGroup`, `paymentLook`, `filterPayments`) is in `lib/admin.ts`. The notification list shows a "Photo attached" tag from `hasAttachment`; the photo is never fetched or shown.
- Users (`AdminUsers`) is a `Table` too (person, phone, country, journey counts, last trip, joined) with a Role `Dropdown`; its Actions are "Journeys" (opens that person's trips in `AdminUserJourneys` under the table) and copy email.
- Lists in the admin area use the shared pieces, never a hand-made table or a native `select`: `Table` (`ui/Table.tsx`: `columns`, `rows`, `rowKey`, optional `actions` column, built-in paging with rows per page and Previous / Next, `resetKey` to go back to page 1 when filters change, an `empty` slot) and `Dropdown` (`ui/Dropdown.tsx`: a keyboard-friendly listbox with a small radius, `size` sm or md, `placement` below or above, `showLabel`). `SearchInput` has `size="sm"` for the matching compact box (small radius). `CopyButton` is the small copy-to-clipboard icon for an Actions column. Paging maths is `paginate` in `lib/admin.ts`.
- Other shared pieces for this area: `Panel`, `StatGrid`, `Field` / `fieldClass` (no width: add `w-full`, `w-24`...), `StatusPill`, and `IconTile`.

## Commands

- `npm run build`, `npm run lint`, `npm run check:seo` (description lengths), `npm run check:contrast`, `npm run check:watch` (the watch page logic), `npm run check:account` (the dashboard logic), `npm run check:admin` (the admin screens' logic).
- Lighthouse: build, `npx next start -p 3100`, then `scripts/lighthouse.sh [path] [mobile|desktop]` (needs Chrome, `CHROME_PATH` set if not on PATH).
