# Product Requirements Document (PRD)
## Terabox Mini — Telegram Mini App

**Purpose of this document:** This PRD is written for an AI coding agent (or human developer) to build the full frontend of a Telegram Mini App. No backend exists yet — all data is mocked/dummy. The agent should treat every section below as an implementation instruction, not just a description.

---

## 1. Project Overview

**App Name:** Terabox Mini
**Type:** Telegram Mini App (web app opened inside Telegram, must work as a normal responsive website too)
**Stack:** React (Vite preferred), JavaScript (or TypeScript if agent prefers), CSS/Tailwind CSS for styling, **Framer Motion** as the primary animation library.
**Backend:** None for this phase. Use local dummy JSON data and mock async delays (`setTimeout` / fake promises) to simulate loading states. All actions (buy plan, refer, delete favorite, etc.) should update local React state only — no real API calls.
**Design goal:** Premium, modern, dark-theme-friendly, extremely fluid animations, mobile-first fully responsive layout (this is primarily viewed inside Telegram's in-app browser on phones, but must scale cleanly to tablet/desktop).

### Recommended Libraries
- `framer-motion` — page transitions, micro-interactions, gesture animations
- `react-router-dom` — page/route management (Explorer, Profile, Premium)
- `lucide-react` — icon set (heart, share, download, crown, X, copy, refresh, arrow-up, etc.)
- `react-hot-toast` or `sonner` — toast notifications (copied link, added to favorites, purchase success, etc.)
- `clsx` — conditional classNames
- Optional: `@telegram-apps/sdk` or `window.Telegram.WebApp` bridge for real Telegram integration (theme params, haptic feedback, main button) — implement but gracefully fallback when not running inside Telegram (e.g., in normal browser for dev/testing).

---

## 2. Global App Behavior

### 2.1 Boot Sequence
1. App mounts → **Splash/Loading Screen** is shown immediately.
2. Loading screen shows the app logo/name with a subtle pulse or shimmer animation for a minimum of ~1.2–1.8s (even if data is "ready" instantly, respect a minimum splash duration so it doesn't flash).
3. Loading screen transitions out using a **Netflix-style zoom + fade intro**: the logo scales up slightly (e.g. `scale: 1 → 1.15`) while fading out (`opacity: 1 → 0`), and the underlying Explorer page fades/scales in from slightly zoomed-out (`scale: 0.96 → 1`, `opacity: 0 → 1`). Use `framer-motion`'s `AnimatePresence` with `mode="wait"` to sequence this.
4. After splash, land on **Explorer** page by default.

### 2.2 Global Navbar (Bottom, Pill-Shaped, Animated)
A floating bottom navbar with 3 tabs: **Explore**, **Profile**, **Premium**.

Behavior:
- **Default / idle / scrolling up:** navbar expands into a wider "pill" shape showing icon + label for each tab, with the active tab visually highlighted (background pill behind icon+label, animated with `layoutId` in framer-motion so the highlight slides smoothly between tabs).
- **On scroll down:** navbar animates (shrinks) into a smaller, more compact pill — labels can fade out leaving just icons, or the whole bar can shrink in width/height. Use scroll direction detection (compare current vs last scrollY) to toggle a `compact` state.
- **On scroll up (even slightly):** navbar animates back to full/expanded size.
- Navbar is `position: fixed`, centered horizontally, floating above content with safe-area padding for iOS notch devices.
- Active tab detection should be based on current route and reflected with color + highlight animation.
- Tapping a tab triggers Telegram haptic feedback if available (`WebApp.HapticFeedback.impactOccurred('light')`), plus a route transition (page-level fade/slide handled by `AnimatePresence`).

### 2.3 Scroll-To-Top Button
- Appears (fade + slide up) once user scrolls down past a threshold (e.g. 400px) on any scrollable page.
- Fixed position, bottom-right corner (above navbar).
- Clicking scrolls to top with smooth animation (`window.scrollTo({ top: 0, behavior: 'smooth' })` or a custom eased scroll).
- Button itself has a small bounce/hover animation.

### 2.4 Pull-to-Refresh / Refresh Button
- Explorer page supports **pull-down-to-refresh**: dragging content down past a threshold shows a spinner/loading indicator, then triggers a mock re-fetch of content (simulate 1–1.5s delay, shuffle or regenerate dummy data) and animates back up.
- Also include an explicit **Refresh button** (icon button, e.g. top-right of Explorer) that triggers the same refresh logic with a spin animation on the icon while loading.

### 2.5 Global Theming
- Base theme: dark UI with vibrant accent color (e.g. electric blue/purple gradient) — agent has creative freedom on exact palette but must stay premium/modern (avoid generic Bootstrap look).
- **Premium users get a visual theme shift**: e.g. gold/amber accent gradients replacing the default accent, crown iconography in navbar/profile, subtle animated shimmer on premium-only elements. This should be driven by a global state flag `isPremium` (boolean, toggled locally after a mock "purchase" — see section 5).
- Respect Telegram theme params where possible (`window.Telegram.WebApp.themeParams`) but don't block design on it — use as enhancement only.

---

## 3. Page: Explorer (Home / Default Route `/`)

### 3.1 Header
- Big bold stylized heading: **"Terabox Mini"** — use a strong font-weight, possibly a gradient text fill, small logo/icon beside it. This is the app's primary brand moment on first load.

### 3.2 Search Bar
- Prominent search input directly below the header, with a search button (icon or icon+text) attached.
- **Autosuggestions:** as the user types, show a dropdown list of suggested queries (filtered from dummy data titles/tags) beneath the input, animated in/out (height/opacity transition), keyboard/tap selectable.
- **Search loading button state:** when search is triggered (button click or enter), the search button itself morphs into a loading spinner state (icon swap or width animation to a circular spinner) while the "search" resolves (mock delay ~800ms–1.2s).
- **Search results transition:** upon triggering search, show a **full-width creative loading animation** (e.g. animated skeleton cards with shimmer, or a custom SVG/lottie-style loader) in place of the content grid for the duration of the mock search delay, then cross-fade into the filtered results grid below.
- Clearing the search (X button inside input) animates back to the full/default content list.

### 3.3 Favourites Label Row
- Directly below search bar/results, a horizontal row containing a **"Favourites"** chip/label with a heart icon showing the current favourites count (bound to global favourites state).
- Tapping it filters the content grid to show only favourited items, with a smooth filter/re-layout animation (use `layout` prop / `AnimatePresence` for items entering/exiting the grid).

### 3.4 Category / Label Filter Section
- A horizontally scrollable row of category chips/labels (e.g. "All", "Trending", "Movies", "Series", "Images", "Music", etc. — dummy categories).
- Tapping a label **highlights it** (active state styling + animated underline or filled-pill background using `layoutId`) and filters the content grid below to that category only. Tapping "All" or the same active label again resets to show everything.

### 3.5 Content Grid
Each content item is a **card** showing:
- Thumbnail image (dummy image URLs / placeholders)
- Type indicator badge: "Video" or "Image"
- Title (truncate with ellipsis if long)
- View count (formatted, e.g. `12.3K views`)
- File size badge (e.g. `240 MB`, `1.2 GB` — dummy)
- **Favourite (heart) button** — toggles favourite state for that item with a satisfying pop/scale + color-fill animation on tap (like Instagram double-tap heart burst optional).
- **Share button** — opens a native share sheet if available (`navigator.share`), otherwise copies a dummy link to clipboard with a toast confirmation.
- Clicking anywhere on the card (not on the action buttons) opens the item's dummy `url` in a new tab (`window.open(item.url, '_blank')`) — simulate "playing"/"opening" content.
- Cards animate in with a staggered fade+slide-up on initial load/filter change (`framer-motion` stagger via parent variants).
- Grid should be responsive: e.g. 2 columns on mobile, 3–4 on tablet, 5+ on large desktop (CSS grid with `auto-fill`/`minmax` or Tailwind responsive grid classes).

### 3.6 Ads / Sponsored Slot
- Periodically inject an **"Ad / Sponsored"** card into the grid (e.g. every 6th item), visually distinct: **yellow accent border/background tag** reading "Sponsored" or "Ad". Clicking it opens a dummy sponsor URL. Use dummy ad content (image + title).

---

## 4. Page: Profile (`/profile`)

### 4.1 Header
- User avatar shown as a **letter avatar** (circular badge with the first letter of the username, colored background derived deterministically from the username — e.g. hash-to-color function) since there's no real profile photo.
- Username displayed below/beside the avatar.

### 4.2 Stats Row
Three (or more) stat blocks shown with numbers and **color-coded value mapping**:
- **Plan** (e.g. "Free" / "Lite" / "Premium" — colored badge, gold for premium)
- **Referrals** (numeric)
- **Credits** (numeric)

Color mapping logic (reusable utility function, applies to referrals/credits or any numeric stat):
- `< 40` → red
- `40–79` → yellow/amber
- `≥ 80` → green (or the doc's "yellow etc" — agent should implement a clear 3-tier color scale: red/low, yellow/mid, green-or-gold/high, and this utility must be generic/reusable for any numeric stat, not hardcoded per-stat)

Each stat block animates its number counting up on mount (simple count-up animation).

### 4.3 Referral Section
- Input field (read-only) pre-filled with the user's dummy referral link.
- **Share button** — triggers `navigator.share` (fallback: copy).
- **Copy button** — copies link to clipboard, shows toast "Copied!" with a brief check-mark icon swap animation on the button itself.

### 4.4 Favourites Summary
- A card/button showing **Favourites** with the current count (heart icon).
- Tapping navigates to Explorer with the favourites filter pre-applied (reuse the same filter logic from 3.3).
- Includes a **Delete** action (per favourite, or a "clear all" option) — removing an item updates global favourites state and animates the item out (shrink/fade) wherever it's displayed.

### 4.5 Support / Legal Cards
- **"Report a Bug"** card — opens a simple modal/form (dummy submit, just shows a success toast/animation, no real backend).
- **"Terms & Conditions"** card — opens a modal or dedicated route with dummy placeholder legal text, scrollable.

### 4.6 Upgrade CTA
- Prominent **"Upgrade to Premium"** button/banner at the bottom of Profile (only shown if user is not already premium). Has an eye-catching animated gradient/shimmer and a small crown icon. Tapping it navigates to `/premium`.
- If the user **is** premium, replace this section with a "Premium Active" badge (crown, gold theme) instead.

### 4.7 Navbar State
- When on this route, the **Profile** tab in the bottom navbar must show the active/highlighted state (per section 2.2).

---

## 5. Page: Premium (`/premium`)

### 5.1 Header
- Page heading, e.g. **"Go Premium"** or **"Choose Your Plan"**, styled boldly, ideally with a subtle animated background (particles, gradient blobs, or shimmering crown iconography) to reinforce a premium feel.

### 5.2 Plan Cards (3 cards, animated entrance — staggered pop-in)

| Plan | Price | Duration | Features |
|---|---|---|---|
| **Lite (Free)** | Free (unlocked via 1 referral) | 1 hour access | Unlimited HD streaming, Refer & Earn access |
| **Lite** | ₹10 / 10 Stars | 1 day | 5 downloads/min, Unlimited HD streaming, Priority support |
| **Premium** *(marked "Popular" / "Best Seller")* | ₹20 / 20 Stars | 1 month | 10 downloads/min, Unlimited HD streaming, Priority support |

Each card:
- Shows plan name, price (with a toggle or dual-label for ₹ vs Telegram Stars), duration, and a feature checklist (checkmark icons).
- The middle/Premium plan has a **"Most Popular"** ribbon/badge and slightly elevated/scaled styling to draw attention.
- Each card has a **"Buy Lite" / "Buy Premium"** button (label matches plan). The free Lite plan's button instead reads something like **"Activate Free Access"**.

### 5.3 Lite (Free) Flow — Popup on Click
Clicking the free Lite plan's button opens a modal:
- Heading: **"Enjoy Unlimited Access"**
- Explanatory text describing how referring works and that it unlocks **1 hour of access** (but explicitly **no downloads** during this free window — only streaming).
- Referral link input field with **Copy** and **Share** buttons (same behavior as Profile's referral section).
- **Close (X)** button in the corner, and an explicit **Close** button at the bottom.
- No payment involved — this popup is purely informational + referral capture.

### 5.4 Paid Plans Flow — Popup on Click
Clicking "Buy Lite" or "Buy Premium" opens a modal:
- Modal shows plan name/price recap.
- Two payment method options, presented as selectable option cards/buttons:
  - **Pay with UPI**
  - **Pay with Telegram Stars**
- **X** close button in the corner.
- Since there's no backend: selecting either payment option should simulate a short "processing" loading state (~1–1.5s spinner), then show a success animation/state (checkmark, confetti or scale-pop), then:
  - Update global state: `isPremium = true` (or a more granular `currentPlan` state if the agent wants to distinguish Lite-paid vs full Premium),
  - Apply the premium theme changes app-wide immediately (gold accents, crown in navbar, etc. — see 2.5),
  - Close the modal automatically after showing success, and toast "Plan activated!".

### 5.5 Comparison Table
Below the plan cards, include a **feature comparison table** listing all plans as columns and features as rows (Downloads/min, HD Streaming, Priority Support, Duration, Price), using checkmarks/crosses or values per cell. Table should be horizontally scrollable on small screens (don't break layout), with a subtle row/column highlight animation on the recommended plan's column.

### 5.6 Navbar State
- Premium tab highlighted when on this route.
- If `isPremium` is true globally, the Premium nav icon can swap to a filled/crown variant to reflect status.

---

## 6. Data Model (Dummy Data — no backend)

Create a `data/dummyContent.js` (or `.json`) file and a few others as described. Example shapes (agent may extend fields as needed, e.g. add `size`, `sponsored`, etc.):

```js
// content item
{
  id: string,
  title: string,
  type: "video" | "image",
  thumbnail: string, // placeholder image URL
  url: string,        // dummy destination URL, opened on click
  views: number,
  sizeMB: number,      // used to render e.g. "240 MB" or convert to GB if large
  category: string,    // matches one of the filter labels
  sponsored?: boolean, // true = render as Ad/Sponsored card with yellow styling
}

// user profile (mock, local state, resettable)
{
  username: string,
  plan: "Free" | "Lite" | "Premium",
  referrals: number,
  credits: number,
  referralLink: string,
  favourites: string[], // array of content ids
}
```

Use a placeholder image service (e.g. `https://picsum.photos/seed/{id}/400/250`) for thumbnails/ads so the UI has real-looking imagery without needing real assets.

### Global State Management
Use React Context (or a lightweight state lib like `zustand`) for:
- `favourites` (array of item ids) — shared between Explorer and Profile.
- `isPremium` / `currentPlan` — shared between Profile, Premium, and navbar theming.
- `userProfile` — mock stats (referrals, credits, etc.).

All "backend" actions (buy plan, add referral, delete favourite, report bug) are pure local state mutations with simulated async delays — no real network calls.

---

## 7. Animation Requirements Summary (Framer Motion)

| Interaction | Animation |
|---|---|
| App boot | Splash screen → Netflix-style zoom+fade into Explorer |
| Page/route change | Cross-fade or slide transition via `AnimatePresence` |
| Navbar scroll | Expand (scroll up) / shrink (scroll down) pill morph |
| Navbar active tab | Sliding highlight pill (`layoutId`) |
| Search trigger | Button → spinner morph; results area → skeleton/loader → cross-fade to results |
| Search suggestions | Dropdown height/opacity expand-collapse |
| Category filter | Active chip highlight slide (`layoutId`); grid items animate on filter change (`layout` + enter/exit) |
| Content grid load | Staggered fade+slide-up per card |
| Favourite toggle | Heart icon pop/scale + fill color transition |
| Pull to refresh | Drag-resistance + spinner reveal + snap back |
| Scroll-to-top button | Fade+slide in/out based on scroll position; tap bounce |
| Profile stat numbers | Count-up animation on mount |
| Copy button | Icon swap to checkmark + toast |
| Premium modals | Scale+fade modal entrance/exit with backdrop blur/fade |
| Purchase flow | Loading spinner → success checkmark/confetti → auto-close |
| Premium theme switch | Smooth color/gradient transition app-wide when `isPremium` flips |

---

## 8. Responsiveness Requirements
- Mobile-first (primary target: Telegram in-app browser on phones, ~360–430px width).
- Must scale gracefully up to tablet and desktop breakpoints (test at ~768px, ~1024px, ~1440px) — grid columns, navbar width, and modal sizing should all adapt.
- All modals/popups must be scrollable and safely constrained on very small viewports (no overflow off-screen).
- Respect safe-area insets (notches, Telegram's own UI chrome) for fixed elements (navbar, scroll-to-top button).
- Touch targets (buttons, chips, cards) sized appropriately for finger taps (min ~40px hit area).

---

## 9. Suggested Folder Structure

```
src/
  components/
    Navbar.jsx
    SplashScreen.jsx
    SearchBar.jsx
    ContentCard.jsx
    AdCard.jsx
    ScrollToTopButton.jsx
    CategoryFilter.jsx
    Modal.jsx (generic reusable modal shell)
  pages/
    Explorer.jsx
    Profile.jsx
    Premium.jsx
  context/
    AppStateContext.jsx  (favourites, isPremium, userProfile)
  data/
    dummyContent.js
    dummyCategories.js
  utils/
    colorScale.js   (numeric value -> red/yellow/green mapping)
    formatters.js    (views, file size formatting)
    telegram.js      (safe wrapper around window.Telegram.WebApp)
  App.jsx
  main.jsx
  index.css / tailwind.config.js
```

---

## 10. Telegram Integration Notes
- Detect Telegram WebApp context via `window.Telegram?.WebApp`. If present: call `WebApp.ready()` and `WebApp.expand()` on mount, and optionally use `WebApp.HapticFeedback` for tab taps/button presses.
- If not present (e.g. testing in a normal browser), all Telegram-specific calls must be no-ops — the app should run and look correct standalone.
- Do not hard-depend on any Telegram-provided user data; keep the mock `userProfile` as the source of truth for this phase.

---

## 11. Explicit Non-Goals (For This Phase)
- No real backend, database, authentication, or payment processing — all "purchases," referrals, and bug reports are simulated locally.
- No real video/image hosting — thumbnails and "content" are placeholders; clicking just opens a dummy URL.
- No persistence between sessions unless the agent chooses to add `localStorage` as a nice-to-have (optional, not required).

---

## 12. Definition of Done
- All three pages (Explorer, Profile, Premium) implemented and reachable via the animated bottom navbar.
- Splash screen with Netflix-style zoom/fade intro plays on first load.
- Search with suggestions, loading animation, and filtered results works end-to-end on dummy data.
- Favourites and category filtering work and stay in sync between Explorer and Profile.
- Premium purchase flow (both free-Lite referral popup and paid UPI/Stars popup) works end-to-end and visibly changes the app theme on "success."
- Scroll-to-top button, pull-to-refresh, and refresh button all function with animations.
- Fully responsive from small mobile widths up through desktop.
- No console errors; smooth 60fps-feeling animations (avoid animating layout-triggering properties where a transform/opacity alternative exists).