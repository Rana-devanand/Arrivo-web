# Arrivo website

Marketing site for **Arrivo**, a travel-safety mobile app ("Share the journey. Celebrate the arrival."). It lives next to the Flutter app and the API:

```
Journey/
  App/        Flutter app (Android and iOS)
  backend/    Node + Supabase API
  Frontend/arrivo/   this website
```

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict) and Tailwind CSS v4. Every page is statically rendered.

> This Next.js version differs from older ones. Read the guide in `node_modules/next/dist/docs/` before using an API (see `AGENTS.md`). Project rules for people and AI agents are in `CLAUDE.md`.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start -- -p 3100
```

| Command | What it does |
|---|---|
| `npm run lint` | ESLint, must be clean |
| `npm run check:contrast` | WCAG AA contrast of every colour pair in `theme.css` |
| `npm run check:seo` | After a build: meta description length (150-160) and one `h1` per page |
| `scripts/lighthouse.sh [path] [mobile\|desktop]` | Lighthouse scores for a page (needs Chrome, a running `npm run start -- -p 3100`, and `CHROME_PATH` if Chrome is not on PATH) |

### Environment

| Variable | Default | Use |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://arrivo.example` | Canonical URLs, sitemap, Open Graph. Set it to the real domain before launch. Put it in `.env.local` (git-ignored). |

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero slider, trust cards, "Worrying should not be part of the journey", live route map, how it works, features, app screens, safety, contacts, tools, testimonials, FAQ, download |
| `/features` | Nine feature rows with real app screenshots |
| `/how-it-works` | Six-step timeline |
| `/safety` | Honest states, late-arrival escalation, what Arrivo never does |
| `/for-contacts` | What a trusted contact sees and how to accept an invite |
| `/faq`, `/support` | Questions, troubleshooting, contact |
| `/about` | Story and values |
| `/delete-account` | How to delete an account and what is removed |
| `/privacy-policy`, `/terms` | Draft legal pages |

Also: `sitemap.xml`, `robots.txt` and a generated Open Graph image (`/opengraph-image`).

## Where things live

```
src/
  app/            routes, layout, sitemap, robots, Open Graph image, globals.css
  components/
    ui/           small reusable pieces (Button, Heading, Section, Icon, AppScreen, ...)
    layout/       Header, Navbar, Footer
    sections/     page sections (Hero, HeroSlider, LiveRoute, Worrying, ...)
  config/
    site.ts       name, URL, description, nav, footer links, store links, socials
    content.ts    features, steps, FAQs, testimonials, hero slides, tables
    routes.ts     places and countries used by the live route map
  lib/            SEO helper, JSON-LD builders, theme helpers
  styles/theme.css  the single source of truth for colours and tokens
public/
  hero/           hero slider images (card-1..6.webp)
  how/            "How it works" phone images (plan, travel, arrive)
  screens/        real screenshots of the Flutter app (used by AppScreen)
docs/ARRIVO_APP_ANALYSIS.md   what the app does and how it maps to this site
design-assets/    large original images (git-ignored)
```

Copy lives in `src/config/content.ts` and `site.ts`, not in the JSX. Edit text there.

## Changing the look

Colours: edit the variables in `:root` of `src/styles/theme.css` (light, black text, black buttons). Nothing else holds a colour. Run `npm run check:contrast` afterwards.

Fonts: Plus Jakarta Sans for text and Libre Baskerville for headings, both loaded with `next/font` in `src/app/layout.tsx` (no external links). Change the heading font through `--font-heading` in `theme.css`.

Buttons are `rounded-full` (see `src/components/ui/Button.tsx`). The hero uses the small button size.

## Animated icons

Icons that come through `AnimatedIcon` use free **Lordicon** (Wired outline) icons where one fits (`src/config/lordicons.ts` maps each icon name to its CDN key). `LordIcon` (`@lordicon/element`) loads only when an icon is about to be seen, takes the colour of the text around it, plays a reveal once, then plays on hover (or every few seconds with `loop`). Until it is ready, and for visitors who prefer reduced motion, a built-in CSS animated icon shows instead (`AnimatedIcon.tsx` and `globals.css`). Lordicon free icons need a credit link, which the footer carries. To use another icon, find its key in the Lordicon library (free ones have `premium: false`) and add it to `lordicons.ts`.

## Images

- **Hero slider** (`HeroSlider.tsx`): images cross-fade every 6 seconds. All images use the same 10:9 ratio and are served as-is (`unoptimized`) to keep full quality. The blurred bottom is baked into the files. To replace them, export new 10:9 images, keep names `card-1.webp` to `card-6.webp` and update titles in `heroSlides` (`content.ts`).
- **How it works**: `public/how/*.webp` are phone-shaped images with a transparent background and rounded corners. They are also served as-is.
- **App screenshots** (`public/screens/*.webp`) come from the real Flutter app. Re-capture them when the app UI changes. The list of names is in `AppScreen.tsx`.
- **Testimonial photos**: pass a real, permitted photo to the `Avatar` `src`. Until then the section shows labelled sample text and silhouette avatars.

## Live route map

`LiveRoute.tsx` shows a full-screen, free map:

- Tiles: OpenStreetMap. Routing: public OSRM demo server. Place names for generated trips: Nominatim. No API keys.
- The visitor's country comes from `api.country.is` (IP based), falling back to the browser language. India uses the curated places in `routes.ts`; about 57 other countries use a point scatter around their main city (`hubs` in `routes.ts`).
- Preview another country with `/?country=JP`.
- These are public community services with fair-use limits. For heavy traffic, host your own tiles and routing, and mention the IP lookup in the privacy policy (already added).

## Before launch

- Fill the placeholders: store links and `supportEmail` (`site.ts`), legal text, company details, pricing answer in the FAQ, real testimonials.
- Set `NEXT_PUBLIC_SITE_URL`.
- Have the privacy policy and terms reviewed by a lawyer.
- Confirm claims that came from proposals (retention, late-arrival timings) match the shipped app.
- Check the name "Arrivo" for trademark, store and domain availability.
- Re-run Lighthouse (mobile) on every page. Home mobile performance has been close to the 90 line (86 to 93 between runs).
- `src/components/layout/ThemePalette.tsx` and `src/lib/palette.ts` are a colour playground that is not mounted any more. Delete them or add `<ThemePalette />` back to the footer while designing.
