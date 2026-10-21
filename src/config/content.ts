import type { IconName } from "@/components/ui/Icon";
import type { ScreenVariant } from "@/components/ui/AppScreen";

export type Feature = { icon: IconName; title: string; text: string };
export type FeatureDetail = Feature & { points: readonly string[]; screen: ScreenVariant };
export type Photo = { src: string; alt: string; width: number; height: number };
export type Step = { title: string; text: string; screen?: ScreenVariant; photo?: Photo };
export type Screen = { title: string; caption: string; variant: ScreenVariant };
export type Testimonial = { quote: string; author: string; role: string };
export type FaqGroup = "Getting started" | "Privacy" | "Safety" | "Account";
export type Faq = { group: FaqGroup; question: string; answer: string; featured?: boolean };
export type HeroSlide = { src: string; alt: string; title: string; text: string };
export type Fact = { icon: IconName; title: string; text: string };

export const facts: readonly Fact[] = [
  { icon: "navigation", title: "Shared only while you travel", text: "Your location is visible to your chosen contacts during a journey and nowhere else. When the trip ends, sharing ends." },
  { icon: "userCheck", title: "Your people say yes first", text: "A contact sees nothing until they accept your invitation, and you can remove them at any moment." },
  { icon: "shieldCheck", title: "Honest about what it can do", text: "Arrivo tells your contacts. It does not call emergency services for you, and it says so clearly in the app." },
];

export const withoutArrivo: readonly string[] = [
  "Texting “reached?” and waiting for a reply that may not come",
  "Family guessing whether a quiet phone means trouble or a dead battery",
  "Sharing a live location with a messaging app that never switches off",
  "No clear moment when everyone knows you are safe",
];

export const withArrivo: readonly string[] = [
  "Set off in about 30 seconds. Your people are told automatically",
  "A live map, an arrival time and a “last updated” label, so nobody has to guess",
  "Sharing begins with your journey and ends when it does",
  "One tap on arrival and everyone hears you are safe",
];

export const features: readonly Feature[] = [
  { icon: "pin", title: "Share a journey", text: "Choose a destination, pick who to tell and tap start. Your last contacts are preselected." },
  { icon: "map", title: "Live map and arrival time", text: "Trusted people follow your route and expected arrival, with a clear “updated just now” label." },
  { icon: "users", title: "Trusted contacts, with consent", text: "Invite by phone or email. Contacts accept first, and removing one ends their access instantly." },
  { icon: "clock", title: "A check-in if you run late", text: "Past your arrival time, Arrivo asks if you are okay before it alerts anyone." },
  { icon: "train", title: "Walk, bike, car, train or metro", text: "Door-to-door plans include the walk to the station, the ride and the walk after." },
  { icon: "camera", title: "Ride details", text: "Share a photo of the number plate so contacts know which vehicle you are in." },
  { icon: "signal", title: "Works when signal does not", text: "Offline? Arrivo keeps saving your location and sends it in order when you reconnect." },
  { icon: "lock", title: "Private by design", text: "No coordinates in notification text. Your data is never sold or used for advertising." },
];

export const featureDetails: readonly FeatureDetail[] = [
  {
    icon: "pin",
    title: "Set up a journey in about 30 seconds",
    text: "Search for a village, town or street, or drop a pin on the map. Choose how you are travelling, set when you expect to arrive, and pick who should know. A summary shows exactly what your contacts will see before anything starts.",
    points: ["Saved places such as Home and Work, and recent places, come first", "Repeat a previous trip with one tap from the home screen", "Your last-used contacts are preselected", "Starting point defaults to your current location"],
    screen: "setup",
  },
  {
    icon: "train",
    title: "Plans for walking, cycling, driving, trains and metro",
    text: "Pick a mode and Arrivo plans the route and the time. For train and metro it finds the nearest stations to your start and your destination and plans three legs: how you get to the station, the ride, and how you get from the station to your destination.",
    points: ["Change either station, or the first and last mile, if you prefer", "Each leg is drawn in its own colour on the map", "Where no timetable is available the time is an estimate, and Arrivo labels it as one"],
    screen: "search",
  },
  {
    icon: "map",
    title: "Follow along on a live map",
    text: "While you travel, the map shows your route, your position and your expected arrival. If plans change, move the arrival time and your contacts are told. If you are in a taxi, share a photo of the number plate so they can see which vehicle you are in.",
    points: ["Route, progress and arrival time at a glance", "A persistent “sharing live with people” bar with a Stop button", "Keeps tracking on Android even when the app is minimised", "Add a voice note in English or Hindi"],
    screen: "live",
  },
  {
    icon: "users",
    title: "Trusted contacts who opt in",
    text: "Invite people by phone number or email. Arrivo gives you an 8-character invite code to share; the other person enters it in the app, sees who invited them and what they will see, and accepts or declines. Until then they see nothing at all.",
    points: ["Accepted, waiting and declined shown in clear groups", "Remove access instantly, even in the middle of a journey", "Invitations by email appear in the app automatically", "A contact can leave whenever they like"],
    screen: "contacts",
  },
  {
    icon: "eye",
    title: "A calm view for the people who care",
    text: "Contacts open the journey and see your name, a status chip (active, late, arrived or ended), your expected arrival, the map and when your location was last updated. A Call button is always one tap away.",
    points: ["Refreshes every few seconds while the journey is in progress", "A “location may be out of date” warning if updates stop", "Read-only: they cannot see your history or your other contacts", "Notifications never include your coordinates"],
    screen: "watch",
  },
  {
    icon: "clock",
    title: "A check-in if you run late",
    text: "If your expected arrival time passes, Arrivo asks: are you okay? One tap on I'm fine clears it and tells your contacts. If you do not answer within the grace period, your contacts are alerted with your last known location and the time it was recorded.",
    points: ["The check runs on the server, so it works even if your phone is off", "The grace period is yours to set in the journey details", "Choose I need help to alert your contacts straight away", "Arrivo never contacts emergency services for you"],
    screen: "overdue",
  },
  {
    icon: "bolt",
    title: "A safety timer for moments without a journey",
    text: "Meeting someone new, or walking home without a destination to enter? Start a timer for 15 minutes up to 1 hour 30 minutes. Tap I am safe before it ends and nothing happens. If time runs out, your contacts are told.",
    points: ["Cancel any time with one tap", "A reminder arrives before the timer ends", "Works without choosing a destination"],
    screen: "timer",
  },
  {
    icon: "check",
    title: "Arrive, celebrate, done",
    text: "When you reach your destination, Arrivo can ask you to confirm. Say yes and sharing stops, your contacts are told you are safe, and you see a summary of the trip. Every journey is saved to your history.",
    points: ["Optional automatic arrival detection near your destination", "History grouped by month with expandable details", "Delete any trip, and its stored route, whenever you like"],
    screen: "arrived",
  },
  {
    icon: "lock",
    title: "Controls that keep it yours",
    text: "Profile and settings put you in charge: who can see your location right now, which notifications you get, quiet hours for non-urgent reminders, light or dark appearance, and a full export of your data.",
    points: ["See at a glance whether anyone can see you right now", "Safety alerts are always delivered, even in quiet hours", "Export your data or delete your account from the app"],
    screen: "privacy",
  },
];

export const steps: readonly Step[] = [
  { title: "Plan", text: "Choose where you are going, how you are travelling and who should know. It takes about 30 seconds.", photo: { src: "/how/plan.webp", alt: "A phone showing a young woman on her sofa at home, checking her phone while planning a trip.", width: 640, height: 1358 } },
  { title: "Travel", text: "Your contacts follow on a live map. Share a plate photo, change your arrival time, or stop sharing with one tap.", photo: { src: "/how/travel.webp", alt: "A phone showing a man relaxing in the back of a taxi at night while his contacts follow along.", width: 640, height: 1329 } },
  { title: "Arrive", text: "Confirm that you arrived. Everyone is told you are safe, and the trip is saved to your history.", photo: { src: "/how/arrive.webp", alt: "A phone showing two friends hugging at a front door, relieved that one of them arrived safely.", width: 640, height: 1379 } },
];

export const journeySteps: readonly Step[] = [
  { title: "Sign in and set up your profile", text: "Continue with Google or Apple, then add your name and phone number. Arrivo shows a short three-page introduction so you know exactly what is shared and when.", screen: "signin" },
  { title: "Build your circle of trusted contacts", text: "Add people by phone or email. Each person gets an 8-character invite code (for example ABCD-2345) and has to accept before they can see anything. You can see who has accepted, who is still waiting and who declined.", screen: "contacts" },
  { title: "Plan the journey", text: "Search a destination or drop a pin, choose walk, bike, car, train or metro, set when you expect to arrive and choose who to tell. For trains and metro, Arrivo plans the walk to the station, the ride and the walk after.", screen: "setup" },
  { title: "Start sharing", text: "Arrivo explains why it needs your location before it asks, and only when you start your first journey. Your contacts are told you have set off and can open your live map.", screen: "live" },
  { title: "Travel with confidence", text: "Change your arrival time if plans shift, share a number-plate photo, or add a voice note. If you lose signal, Arrivo keeps saving your location and uploads it when you reconnect.", screen: "watch" },
  { title: "Arrive and finish", text: "Confirm you have arrived. Sharing stops immediately, your contacts are told you are safe, and the trip appears in your history with its duration, distance and who it was shared with.", screen: "arrived" },
];

export const screens: readonly Screen[] = [
  { title: "A welcome that explains everything", caption: "Three short pages: share your journey, contacts follow along, arrive safely.", variant: "onboarding-2" },
  { title: "Your circle at a glance", caption: "Accepted, waiting and declined contacts, plus a code entry for invitations.", variant: "contacts" },
  { title: "Every trip, in detail", caption: "Expand a journey to see duration, distance and who it was shared with.", variant: "history" },
  { title: "Safety timer", caption: "Check in before the time runs out or your contacts are told.", variant: "timer" },
];

export const moreScreens: readonly Screen[] = [
  { title: "Home", caption: "Start a journey, set a timer, share a watch link or invite someone.", variant: "home" },
  { title: "Invitations", caption: "See who invited you and what they will see before you accept.", variant: "invitation" },
  { title: "Notification settings", caption: "Journey reminders, arrival check-ins and quiet hours.", variant: "notifications" },
];

export const testimonials: readonly Testimonial[] = [
  {
    quote: "Arrivo gives me peace of mind when I travel home late. My family knows when I've arrived safely without needing to call me.",
    author: "Emily Carter",
    role: "Chicago, IL · Night-time commuter"
  },
  {
    quote: "I feel more comfortable travelling alone knowing that my arrival updates can reach someone I trust.",
    author: "Daniel Brooks",
    role: "Austin, TX · Solo traveller"
  },
  {
    quote: "It's reassuring to receive a safe-arrival update without having to keep asking. A simple idea that makes a real difference.",
    author: "Sophia Bennett",
    role: "Seattle, WA · Trusted contact"
  }
];

export const principles: readonly Feature[] = [
  { icon: "signal", title: "Honest status", text: "Stale, offline, paused and permission-denied states are shown, never hidden. Arrivo never implies sharing works when it does not." },
  { icon: "heart", title: "You stay in control", text: "Pause or stop sharing in one or two taps, and see who can view your journey at any time." },
  { icon: "help", title: "Explain before asking", text: "A short, plain reason appears before every permission prompt, and location is requested only when you start a journey." },
  { icon: "lock", title: "Quiet notifications", text: "Notification text never contains coordinates, so nothing sensitive shows on a lock screen." },
];

export const escalation = {
  headers: ["When", "What happens", "Who is told"],
  rows: [
    { cells: ["Your expected arrival time passes", "Arrivo asks: Are you okay? Have you arrived? You answer with one tap.", "Only you"] },
    { cells: ["No reply after the grace period (about 10 minutes by default)", "The journey is marked Overdue", "Your contacts, with your last known location and when it was recorded"] },
    { cells: ["Still no reply (about 20 minutes later by default)", "A reminder is sent and contacts are shown how to call you", "Your contacts"] },
    { cells: ["You tap I'm fine at any point", "The overdue state clears", "Your contacts are told you are okay"] },
    { cells: ["You tap I need help", "Contacts are alerted straight away with your last location", "Your contacts"] },
  ],
} as const;

export const situations = {
  headers: ["If this happens", "Arrivo does this"],
  rows: [
    { cells: ["You lose internet", "Keeps saving your location on the phone and uploads it in order when you reconnect. Contacts see when it was last updated."] },
    { cells: ["Location permission is removed mid-journey", "Warns you with a way to open settings. Contacts see that your location is unavailable."] },
    { cells: ["Your battery gets very low", "Reduces how often it updates, tells you, and sends a final location to your contacts."] },
    { cells: ["The app is closed or the phone is off", "The overdue check still runs on the server, so your contacts are not left guessing."] },
    { cells: ["You pause or stop sharing", "Contacts are told that sharing has stopped."] },
    { cells: ["You remove a contact during a journey", "Their access ends immediately."] },
  ],
} as const;

export const neverList: readonly string[] = [
  "Never contacts emergency services automatically",
  "Never shows your location to a contact who has not accepted",
  "Never shares your location outside a journey",
  "Never puts coordinates in notification text",
  "Never hides a stale, offline or paused state",
];

export const toolsList: readonly Feature[] = [
  { icon: "bolt", title: "Safety timer", text: "Pick 15 minutes to 1 hour 30 minutes. Tap I am safe before it ends, or your contacts are told." },
  { icon: "share", title: "Watch link", text: "For someone without the app: a read-only link that opens in a browser, shows no history or contacts, and stops 2 hours after your journey ends." },
  { icon: "bell", title: "SOS", text: "Press and hold for 1.5 seconds to alert your contacts straight away with your last location. Arrivo does not call emergency services, so call your local number first if you are in danger." },
];

export const contactSteps: readonly Step[] = [
  { title: "Get the invite", text: "The traveller shares an 8-character invite code with you, like ABCD-2345, or Arrivo emails you an invitation.", screen: "invitation" },
  { title: "Install and sign in", text: "Download Arrivo and sign in with Google or Apple. If you were invited by email, the invitation is already waiting for you.", screen: "signin" },
  { title: "Enter the code", text: "Open Contacts, tap Got an invite code? and type the code in.", screen: "contacts" },
  { title: "Accept", text: "You see who invited you and exactly what you will see: live location during a shared journey, alerts when they start and arrive, and nothing when no journey is active. Tap Accept or Decline.", screen: "invitation" },
];

export const contactSees: readonly Fact[] = [
  { icon: "user", title: "Who and how they are doing", text: "The traveller's name and a status chip: active, late, arrived or ended." },
  { icon: "clock", title: "Arrival time and freshness", text: "The expected arrival and a label showing when their location was last updated." },
  { icon: "map", title: "A live map", text: "Their route and position, only while the journey is in progress." },
  { icon: "phone", title: "A call button", text: "One tap to call, especially useful if a journey becomes overdue." },
];

export const privacyTable = {
  headers: ["What we collect", "Why", "How long"],
  rows: [
    { cells: ["Account details and profile (name, photo, phone)", "Sign-in and so contacts know who is travelling", "Until you delete your account"] },
    { cells: ["Contacts you add", "To choose who follows each journey", "Until you remove them or delete your account"] },
    { cells: ["Journey details", "Your history", "Until you delete the journey or your account"] },
    { cells: ["Location points during a journey", "Live sharing with your chosen contacts", "Removed 30 days after the journey ends"] },
    { cells: ["Device notification tokens", "Delivering notifications", "Removed when you sign out"] },
  ],
} as const;

export const deleteSteps: readonly Step[] = [
  { title: "Open the deletion screen", text: "In the app go to Profile, then Privacy and data, then Delete account. The screen lists exactly what will be removed.", screen: "privacy" },
  { title: "Active journeys end first", text: "If a journey is running, Arrivo ends it and tells your contacts before anything is deleted, so nobody is left watching a trip that has stopped." },
  { title: "Check for a subscription", text: "If you ever have a paid plan, Arrivo asks you to cancel it on the web first so you are not charged after deleting. Arrivo has no paid plan today." },
  { title: "Confirm", text: "Tick that you understand it cannot be undone, then confirm. Your profile, contacts and journey history are removed." },
];

export const deleteTable = {
  headers: ["Data", "What happens"],
  rows: [
    { cells: ["Profile, contacts and journey history", "Removed with your account."] },
    { cells: ["Saved journeys and routes", "Removed with your account."] },
    { cells: ["Raw location points", "Removed 30 days after each journey ends, or with your account."] },
    { cells: ["Watch links", "Stop working 2 hours after the journey ends, or when you delete your account."] },
    { cells: ["Anything we must keep by law", "Stated to you in the deletion flow, with how long it is kept."] },
  ],
} as const;

export const troubleshooting: readonly Fact[] = [
  { icon: "battery", title: "Location stops updating", text: "Allow location for Arrivo and turn off battery optimisation for the app. Some phone makers stop background apps to save power." },
  { icon: "mail", title: "Invite code does not work", text: "Check all 8 characters, make sure you are signed in, and remember a code can only be used by one person." },
  { icon: "bell", title: "Not seeing alerts", text: "Alerts appear inside Arrivo and refresh every 15 seconds while it is open. Push alerts to a closed phone are in development." },
  { icon: "map", title: "Map looks plain", text: "Preview builds can show a built-in demo city. The live map needs the Google Maps key to be set up in the build." },
];

export const values: readonly Feature[] = [
  { icon: "heart", title: "Calm, not alarmist", text: "We say what happened and what to do next. No scare tactics, no flashing red." },
  { icon: "signal", title: "Honest", text: "If sharing is not working, the app says so rather than pretend." },
  { icon: "users", title: "Consent first", text: "Every contact opts in, and you can remove them any time." },
  { icon: "lock", title: "Private", text: "Location is for your trusted people during a journey, nothing else." },
];

export const faqs: readonly Faq[] = [
  { group: "Getting started", featured: true, question: "What is Arrivo?", answer: "Arrivo is a travel-safety app. You share a journey and live location with trusted contacts. They are told when you set off, can follow you on a map, and are told when you arrive safely. If you run late, Arrivo checks on you first and then alerts them." },
  { group: "Getting started", question: "Which phones does Arrivo support?", answer: "Arrivo is built for Android and iOS. Background tracking while the app is minimised is built for Android; iOS follows your location while the app is open. [PLACEHOLDER: minimum OS versions and store availability.]" },
  { group: "Getting started", question: "Do my contacts need the app?", answer: "Contacts with the app accept your invitation and follow you inside Arrivo. Contacts without the app can be given a Watch link: a read-only page that opens in any browser and stops working 2 hours after your journey ends." },
  { group: "Getting started", question: "How do I invite someone?", answer: "Open Contacts, add a person by phone or email, and share the 8-character invite code Arrivo gives you (for example ABCD-2345). They enter it in the app, see who invited them, and accept or decline." },
  { group: "Getting started", question: "What can I do besides starting a journey?", answer: "Set a safety timer from 15 minutes to 1 hour 30 minutes, share a Watch link, invite a contact, or press and hold SOS to alert your contacts. All four are shortcuts on the home screen." },
  { group: "Privacy", featured: true, question: "Who can see my location?", answer: "Only the trusted contacts you choose for a journey, and only while that journey is active. Contacts must accept your invitation first. The Profile screen shows who can see you right now." },
  { group: "Privacy", question: "Is my data sold or used for advertising?", answer: "No. Your data is never sold or used for advertising. It is used only to run journey sharing and safety features." },
  { group: "Privacy", question: "How long is my location kept?", answer: "Raw location points are removed 30 days after a journey ends. Your journey summaries stay in your history until you delete them or your account." },
  { group: "Privacy", question: "Can I export my data?", answer: "Yes. Profile, then Privacy and data, has an Export my data option." },
  { group: "Safety", featured: true, question: "What happens if I do not arrive on time?", answer: "Arrivo asks if you are okay first. If you do not reply within the grace period, your contacts are told and shown your last known location and when it was recorded. A reminder follows a little later with a way to call you." },
  { group: "Safety", featured: true, question: "Does Arrivo call emergency services?", answer: "No. Arrivo never contacts emergency services automatically. Your contacts decide what to do and can call you straight from the app. If you are in danger, call your local emergency number first." },
  { group: "Safety", featured: true, question: "Will it drain my battery?", answer: "Tracking adapts to your movement and battery level. Expect roughly 5% per hour of active sharing. When your battery gets very low, Arrivo updates less often and sends a final location to your contacts." },
  { group: "Safety", question: "What if I lose internet?", answer: "Arrivo keeps saving your location on your phone and sends it in order when you reconnect. Meanwhile your contacts see exactly when it was last updated." },
  { group: "Safety", question: "How does SOS work?", answer: "Press and hold the SOS button for 1.5 seconds. Your contacts get a high-priority notification straight away with your last location. SOS does not call emergency services." },
  { group: "Account", featured: true, question: "Can I stop sharing at any time?", answer: "Yes. Pause or stop from the active journey screen in one tap, and your contacts are told that sharing has stopped." },
  { group: "Account", question: "Can I change the language or appearance?", answer: "Appearance can be Light, Dark or Same as phone. English is the only language for now." },
  { group: "Account", question: "How do I delete my account?", answer: "Go to Profile, Privacy and data, then Delete account. Any active journey ends first and your contacts are told. See our delete account page for the full steps." },
  { group: "Account", question: "How much does Arrivo cost?", answer: "[PLACEHOLDER: pricing is not decided yet. Update this answer when plans are final.]" },
];

export const faqGroups: readonly FaqGroup[] = ["Getting started", "Privacy", "Safety", "Account"];

export const heroSlides: readonly HeroSlide[] = [
  {
    src: "/hero/card-1.webp",
    alt: "A young woman with a backpack steps out of her front door at dusk while checking her phone.",
    title: "Set off in about 30 seconds",
    text: "Choose a destination and who to tell. Your people know the moment you leave.",
  },
  {
    src: "/hero/card-2.webp",
    alt: "A woman wearing headphones looks calmly out of the window on a metro train in the evening.",
    title: "Walk, bike, drive, train or metro",
    text: "Arrivo plans the whole trip, including the walk to and from the station.",
  },
  {
    src: "/hero/card-3.webp",
    alt: "A man relaxes in the back of an auto-rickshaw at night with city lights outside.",
    title: "In a cab or auto? Share the plate",
    text: "Add a photo of the number plate so your contacts see which vehicle you are in.",
  },
  {
    src: "/hero/card-4.webp",
    alt: "A man with a shoulder bag smiles on a railway platform at dusk.",
    title: "Always up to date, always honest",
    text: "Contacts see your arrival time and exactly when your location was last updated.",
  },
  {
    src: "/hero/card-5.webp",
    alt: "A woman sits on a sofa at home holding her phone to her chest with a relieved smile.",
    title: "Calm for the people who wait",
    text: "Trusted contacts follow along quietly and are told the moment you are safe.",
  },
  {
    src: "/hero/card-6.webp",
    alt: "Two friends hug at a front door at night, relieved to see each other.",
    title: "Celebrate the arrival",
    text: "One tap, and everyone who cares knows you made it.",
  },
];
