# Arrivo mobile app: analysis

Source: `Journey/CLAUDE.md`, `SRS_document.md` (v2.1), `DESIGN_PROMPT.md`, `backend/README.md`, and the code in `Journey/App/lib` and `Journey/backend/src`. Status words (built / not built) come from those documents; I did not run the app.

## 1. What Arrivo is

**Arrivo is a travel-safety app.** A traveller starts a journey, chooses trusted contacts, and shares live location only while travelling. Contacts are told when the journey starts, can follow it on a map, and are told when the traveller arrives safely or becomes overdue.

- Tagline: **"Share the journey. Celebrate the arrival."**
- Name: from Italian *arrivo* / Spanish *arribo* ("arrival"). Positive and calm, not fear-based.
- Platforms: Android and iOS (Flutter). iOS has not been built on a Mac yet.
- Users: (1) **Traveller**, (2) **Trusted contact** with the app, (3) **Trusted contact without the app** (secure read-only web link).
- Positioning: it never contacts emergency services automatically; it tells people who care.
- App brand colours: violet `#3B2FD9`, teal `#00BFA6`, gradient between them. Font: Plus Jakarta Sans. Icons: Lucide.

## 2. Tech stack

| Layer | Choice |
|---|---|
| App | Flutter / Dart 3.13, Material 3, Riverpod 3, go_router, dio |
| Maps and location | google_maps_flutter (real map behind `--dart-define=USE_GOOGLE_MAPS=true`, otherwise a code-drawn 3D demo city), geolocator, flutter_foreground_task (Android background tracking) |
| Auth | Supabase Auth (Google, Apple), `supabase_flutter` |
| Other packages | share_plus, image_picker, speech_to_text (English and Hindi voice notes), shared_preferences, flutter_svg, google_fonts |
| Backend | Node + TypeScript + Express, deployable on Vercel (serverless) or Docker |
| Database | Supabase Postgres with row-level security, 6 additive migrations |
| Services | Google Places and Routes, Cloudinary (profile and number-plate photos), Resend (invite emails) |

## 3. Architecture

- Feature-first folders, three layers per feature, repository pattern. Screens are thin; logic is in Riverpod controllers.
- Every repository has a mock and a remote implementation (`--dart-define=USE_BACKEND=true`). The UI was built against mock data first.
- Design tokens only (`AppColors`, `AppTypography`, `AppSpacing`, `AppRadius`, `AppIcons`). Light by default, dark on request; cinematic screens (splash, onboarding, sign-in, arrival) are always dark.
- All dialogs, sheets, toasts and buttons go through shared wrappers (`AppBottomSheet`, `AppToast`, `AppDialog`, `AppButton`).
- About 9,300 lines of screen code across 21 presentation files.

## 4. Screens in the app

| Area | Route | What it does |
|---|---|---|
| Entry | `/splash`, `/onboarding`, `/sign-in`, `/profile-setup` | Gradient splash, 3 onboarding pages ("Share your journey", contacts follow along, arrive safely), Google and Apple sign-in, name / photo / phone setup |
| Home | `/home` | Greeting, big "Start journey" card, active-journey and overdue banners, "Following now" (journeys others shared with you), saved places, "Repeat a trip", incoming invitation card, notification bell with unread badge (polls every 15 s) |
| Plan a trip | `/journey/setup`, place search sheet, map picker | Destination search (recent and saved first, Google only when fewer than 3 match), pin drop, mode (walk, bike, car, train, metro), expected arrival, contact selection, summary. Train and metro plan three legs: to the station, the ride, from the station. The app says when a time is an estimate |
| Active journey | `/journey/active` | Map with route and live marker, ETA, progress, contacts watching, sharing indicator, "I've arrived", change arrival time, share watch link, preview contact view, cancel. Number-plate photo and voice note |
| Overdue | `/journey/overdue` | "Are you okay?" prompt with "I'm fine" and a help option |
| Completed | `/journey/completed` | "Arrived safely" celebration, summary, contacts notified |
| Contacts | `/contacts`, invite sheets | Accepted, invited, declined sections; add by phone or email; 8-character invite code (e.g. `ABCD-2345`) with Share and Copy; "Got an invite code?" entry |
| Invitation | `/invitation` | Who invited you, what they will see, Accept or Decline |
| Watch | `/watch` | Read-only live view for a contact: map, name, status chip, ETA, "updated X ago", call button, plate photo; refreshes every 10 s |
| History | `/history`, `/history/detail` | Newest first, grouped, expandable cards, route map, timeline, delete |
| Notifications | `/notifications` | Invitations waiting plus stored events (accepted invite, started, late, arrived, cancelled, ride photo, SOS) |
| Profile and settings | `/profile`, `/profile/edit`, `/profile/notifications`, `/profile/privacy`, `/profile/delete` | Appearance (Light, Dark, Same as phone), notification preferences, privacy and data, account deletion |
| Help | `/faq`, `/report` | FAQ accordion, contact support, report a problem |
| Dev | `/dev/components` | Component gallery (debug only) |

Every data screen designs loading, empty, error, offline and permission states.

## 5. Core behaviour

**Journey lifecycle:** Draft, Active, Overdue, Completed, Cancelled. One active journey per traveller. State changes are idempotent on the server (double tap, retry, two devices give one result).

**Overdue escalation (default timings, still to be approved as decision D2):**
1. Expected arrival passes: ask the traveller "Are you okay? Have you arrived?"
2. No reply after about 10 minutes: mark Overdue and tell contacts the last known location and time.
3. Still no reply after about 20 more minutes: remind contacts and show how to call the traveller.

The check runs on the server, so it works if the phone is off. Arrivo never contacts emergency services automatically.

**Location sharing:** only while a journey is Active or Overdue; stops automatically on completion or cancel; paused in one tap; adaptive frequency (about 5% battery per hour target); offline points are queued and uploaded in order; a location older than 2 minutes is labelled stale.

**Contacts:** must accept before seeing anything; removing a contact revokes access immediately, even mid-journey; no-app contacts get an expiring read-only link that closes when the journey ends.

**Honest states:** stale, offline, paused and permission-denied are shown, never hidden.

## 6. Backend

Express API under `/v1`, all routes need a Supabase bearer token except `/health` and the public watch link. Route groups: profile (`/me`), devices, contacts and invitations, places (search, details, reverse, saved, recent), routes (plan, stations), journeys (create, list, active, patch ETA, complete, cancel, location batches up to 100 points, watch link, photo ticket), notifications, safety (timer, SOS), track (background upload with a private per-journey token), watch (public), internal overdue job. Helmet, request size limit and rate limits are on, stricter on the watch link. Coordinates, tokens and request bodies are never logged.

## 7. Data and privacy (from the SRS)

| Data | Purpose | Retention (proposed) |
|---|---|---|
| Account details, profile | Sign-in and identity | Until account deletion |
| Contacts the user adds | Choose who follows a journey | Until removed or account deleted |
| Journey details | History | Until the user deletes it or the account |
| Location points | Live sharing | Raw points about 30 days after the journey ends, then reduced or deleted |
| Push tokens | Notifications | Removed on sign-out |

Not sold, not used for advertising. Notification text never contains coordinates. Account deletion ends any active journey first and notifies contacts.

## 8. Build status

**Built (per CLAUDE.md and code):** full UI for all screens above, shared component library, mock and remote repositories, Supabase sign-in, trip planning with walk / bike / car / train / metro, Android background tracking with an ongoing notification, ride (number plate) photo, voice note, in-app notifications and recent places, invitations by code, watch link, backend with migrations and Vercel deployment.

**Not built yet:**
- Push delivery to a closed phone (FCM / APNs). Contacts only see in-app notifications.
- SMS invitations (email works once `RESEND_API_KEY` is set).
- iOS build and iOS Live Activities.
- Subscriptions and billing (decision D11; the SRS only proposes a Plus and Family concept with "Ride Shield").
- Overdue alerts as stored notifications.
- Localisation: strings are inline English, to be moved to ARB files.

## 9. Things to fix before release

- Remove or guard the design-review state switcher on the active-journey and watch screens (`kDebugMode`).
- Bundle the Plus Jakarta Sans font; `google_fonts` currently downloads it at runtime.
- Check Google and Apple sign-in button styling against brand guidelines.
- Restrict the Google Maps key (package `com.arrivo.arrivo` plus SHA-1).
- Name check: availability of "Arrivo" (trademark, stores, domains) is not verified (decision D14).
- Open decisions that change screens: D2 (timings), D3 (start without location permission), D5 (progress notifications), D9 (SOS), D11 (plans).

## 10. How this maps to the website

| Website page | App source |
|---|---|
| Home | Onboarding copy, home screen, product vision |
| Features | Journey setup, active journey, contacts, trip planning, ride photo, voice note |
| How it works | Primary flow (SRS 4.1) |
| Safety | Overdue escalation, honest states, "never calls emergency services" |
| For contacts | Invitation, watch screen, watch link |
| FAQ | App FAQ screen plus SRS help section |
| Privacy | SRS section 7 and backend security notes |
| Delete account | SRS FR-ACC-03 to 05 |
| Support | Report problem and contact support screens |
| About | SRS Appendix C (name and brand) |

Pricing and a blog are not on the site: pricing is undecided (D11) and there is no published content yet.
