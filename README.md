# GameOn

Sports arena booking and player matchmaking for Pakistan — starting in Lahore.

Discover nearby grounds, compare prices and availability, book a slot, and find players when you don’t have a full team.

> **Book a place. Find players. Create a team. Play matches.**

---

## Stack

| Layer | Choice |
| --- | --- |
| Runtime | [Expo](https://expo.dev) SDK 57 |
| UI | React Native 0.86 · React 19 |
| Language | TypeScript |
| Navigation | React Navigation (tabs + stack) |
| Motion | Reanimated · Gesture Handler |
| Storage | AsyncStorage (session) |
| Location | `expo-location` |

---

## Features (current)

- **Auth flow** — phone → OTP → profile setup (demo / local session)
- **Discover** — search, sport filters, promo banners, open matches, nearby arenas
- **Arena detail** — slots, booking confirm sheet, facilities
- **Open matches** — browse, create, join spots
- **Bookings** — upcoming / past booking cards
- **Profile** — edit profile, notifications, help, about
- **Location** — city / area selection for Lahore launch cities

Data is currently **local JSON / dummy data** — no production backend yet.

---

## Getting started

### Requirements

- Node.js 20+ (LTS recommended)
- npm
- Expo Go on a phone, or an iOS Simulator / Android emulator

### Install

```bash
npm install
```

### Run

```bash
npm start
```

Then press `i` (iOS), `a` (Android), or scan the QR code with Expo Go.

Other scripts:

```bash
npm run ios        # open iOS simulator
npm run android    # open Android emulator
npm run web        # Expo web
npm run typecheck  # TypeScript check (tsc --noEmit)
```

---

## Project structure

```
arena-app/
├── App.tsx                 # Root navigation, providers, splash
├── app.json                # Expo config (name: GameOn)
├── Idea.md                 # Product concept & roadmap
├── assets/                 # Icons, splash, images
└── src/
    ├── components/         # UI, home, arena, matches, navigation
    ├── data/               # Typed accessors + JSON seed data
    ├── dummy-data/         # Editable Home-screen sample content
    ├── matches/            # Matches context
    ├── navigation/         # Types & transitions
    ├── screens/            # Feature screens (+ auth/)
    ├── services/           # Location helpers
    ├── session/            # Auth / profile session
    └── theme/              # Colors, spacing, type, elevation, motion
```

Home carousel / cards content can be tweaked via `src/dummy-data/` — see that folder’s README. Save JSON and reload Expo to preview.

---

## Design tokens

Brand primary: `#00BE76`  
Page background: `#F7F8F8`

Theme lives under `src/theme/` (`colors`, `spacing`, `typography`, `radius`, `elevation`, `motion`). Prefer these tokens over one-off values.

---

## Product notes

- **Initial market:** Pakistan  
- **Launch city:** Lahore  
- Longer product vision and feature backlog: [`Idea.md`](./Idea.md)

---

## License

This repository includes the Expo / MIT license text in [`LICENSE`](./LICENSE). App product branding is **GameOn**.
