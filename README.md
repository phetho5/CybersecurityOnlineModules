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

### Running it

```bash
cd mobile-app
npm install
npx expo start
```

Scan the QR code with the Expo Go app (Android/iOS), or press `a` / `i` for an emulator/simulator.

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
