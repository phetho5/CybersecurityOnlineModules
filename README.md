# CyberAware SA

South African-context, multilingual cybersecurity awareness modules for students — a COS700 research project at the University of Pretoria.

## Research context

**Title:** Developing Multilingual South African Context Online Cybersecurity Modules for Students
**Students:** Phetho Nemavhola (u26855896), Vhulenda Mashamba (u22554883)
**Supervisor:** Professor Jan Eloff

Existing cybersecurity education platforms are largely designed for a global audience and don't address the threats, regulations, and languages South African students actually encounter. This project develops interactive online modules covering local scams (WhatsApp, SMS, delivery, email phishing), POPIA and the Cybercrimes Act, with content available in English, isiZulu, Sepedi, and Xitsonga.

The full research proposal is in [`MashambaVS__EloffJ.pdf`](MashambaVS__EloffJ.pdf).

## What's in this repo

| Path | Description |
|---|---|
| [`MashambaVS__EloffJ.pdf`](MashambaVS__EloffJ.pdf) | COS700 research proposal |
| [`mobile-app/`](mobile-app) | The React Native / Expo mobile app |

## Mobile app

Built with **React Native** and **Expo Router**, targeting Android and iOS. State is managed with Zustand (persisted locally via AsyncStorage), and multilingual UI strings are handled with i18next/react-i18next. A **Supabase** backend (auth, module/progress storage) is planned but not yet wired up — the app currently runs on local/mock data only.

### Screens

- **Language** — first-run picker for English / isiZulu / Sepedi / Xitsonga
- **Home** — streak, badges, overall progress, continue-lesson shortcut, module list
- **Modules** — full catalogue (POPIA, WhatsApp scams, SMS & delivery scams, email phishing, Cybercrimes Act)
- **Module detail** — lesson rail with a gated assessment
- **Lesson** — interactive scenario: tap the red flags in a fake bank alert
- **Assessment** — one question at a time with immediate feedback
- **Result** — score, badge issuance, per-topic breakdown
- **Practice** — daily scam/legit drills plus an AI message-checker input
- **Profile** — badges, certificate, language switch

## Getting started

### Prerequisites

Install these before you clone the repo:

| Tool | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org/) | 20 LTS or newer | Includes `npm` |
| [Git](https://git-scm.com/) | any recent version | To clone the repo |
| [Expo Go](https://expo.dev/go) | latest | Free app on your phone — **App Store** (iOS) or **Play Store** (Android). This is how you'll run and test the app without installing Android Studio/Xcode. |

Your phone and your computer must be on the **same Wi-Fi network** for the QR code method below to work.

### Dependencies

Nothing to install manually beyond `npm install` — everything below comes from [`mobile-app/package.json`](mobile-app/package.json) and is fetched automatically. Listed here for reference:

**Framework**
- `expo`, `expo-router` — app framework and file-based navigation
- `react`, `react-native`, `react-dom`, `react-native-web`

**Navigation** (used internally by Expo Router)
- `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`
- `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets`

**Backend (Supabase — wiring in progress)**
- `@supabase/supabase-js`, `react-native-url-polyfill`
- `@react-native-async-storage/async-storage`, `expo-secure-store`

**Multilingual (English / isiZulu / Sepedi / Xitsonga)**
- `i18next`, `react-i18next`, `expo-localization`

**UI / design**
- `react-native-paper` — component library
- `@expo/vector-icons` — icon set
- `@expo-google-fonts/archivo`, `expo-font` — brand typeface
- `expo-image`, `expo-glass-effect`, `expo-symbols`, `expo-system-ui`, `expo-splash-screen`, `expo-status-bar`

**State & forms**
- `zustand` — app state (persisted with AsyncStorage)
- `react-hook-form`, `zod` — forms and validation

**Media**
- `expo-video`, `expo-audio`, `expo-asset` — for AI-assisted lesson videos/audio

**Other Expo modules**
- `expo-constants`, `expo-device`, `expo-linking`, `expo-web-browser`, `@expo/ui`

**Dev tools**
- `typescript`, `eslint`, `eslint-config-expo`, `@types/react`

### Clone and install

```bash
git clone https://github.com/phetho5/CybersecurityOnlineModules.git
cd CybersecurityOnlineModules/mobile-app
npm install
```

### Run and test the app on your phone

1. **Install Expo Go** on your phone from the App Store (iOS) or Play Store (Android), if you haven't already.
2. **Connect your phone to the same Wi-Fi network** as your computer.
3. From the `mobile-app` folder, start the dev server:
   ```bash
   npx expo start
   ```
4. A QR code appears in the terminal (and opens in a browser tab).
5. **Scan it:**
   - **Android:** open Expo Go and use its built-in QR scanner.
   - **iPhone:** open the Camera app and point it at the QR code, then tap the notification that appears.
6. The app builds and loads on your phone — this can take a minute the first time.
7. **Try the flow:**
   - Pick a language on the first screen (English / isiZulu / Sepedi / Xitsonga) and confirm the interface text updates.
   - On **Home**, tap **Continue lesson** to open the interactive scenario, or tap any module card.
   - Inside a **Module**, tap a lesson row to open the scenario, then tap **Take the assessment**.
   - Complete the **Lesson** (tap the red flags, check your answer), then the 3-question **Assessment**.
   - Confirm the **Result** screen shows a score and, if you passed, a badge.
   - Check the **Practice** tab (daily scam/legit drills) and the **Profile** tab (badges, certificate, language switcher).
8. To reload after making code changes, save the file — Expo Go refreshes automatically (Fast Refresh). If something looks broken, shake your phone (or press `r` in the terminal) to reload manually.

**Alternative — run in an emulator/simulator instead of a physical phone** (requires Android Studio or Xcode to already be installed):
```bash
npx expo start
# then press "a" for Android emulator, or "i" for iOS simulator
```

### Project structure

```
mobile-app/src/
  app/            # Expo Router screens (file-based routing)
  components/     # Shared UI (buttons, cards, icons, headers)
  constants/      # Design tokens (colors, fonts, spacing)
  data/           # Module, quiz, drill, badge, and scenario content
  i18n/           # Locale files and i18next setup
  store/          # Zustand app state
```

## Status

- [x] Research proposal
- [x] Design prototype
- [x] Mobile app UI (all core screens, English + partial multilingual content)
- [ ] Supabase backend (auth, data persistence, sync)
- [ ] Full multilingual content (lesson/quiz/drill text in isiZulu, Sepedi, Xitsonga)
- [ ] User testing and evaluation
