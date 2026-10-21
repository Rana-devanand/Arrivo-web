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

## Commands

- `npm run build`, `npm run lint`, `npm run check:seo` (description lengths), `npm run check:contrast`.
- Lighthouse: build, `npx next start -p 3100`, then `scripts/lighthouse.sh [path] [mobile|desktop]` (needs Chrome, `CHROME_PATH` set if not on PATH).
