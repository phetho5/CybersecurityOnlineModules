# CyberAware SA

South African-context, multilingual cybersecurity awareness modules for students: a COS700 research project at the University of Pretoria.

## Research context

**Title:** Developing Multilingual South African Context Online Cybersecurity Modules for Students
**Students:** Phetho Nemavhola (u26855896), Vhulenda Mashamba (u22554883)
**Supervisor:** Professor Jan Eloff

Existing cybersecurity education platforms are largely designed for a global audience and don't address the threats, laws and languages South African students actually deal with. This project delivers short, interactive modules on local scams, POPIA and digital privacy, in English, isiZulu, Sepedi and Xitsonga, as a mobile app.

The full research proposal is in [`MashambaVS__EloffJ.pdf`](MashambaVS__EloffJ.pdf).

## What's in this repo

| Path | Description |
|---|---|
| [`MashambaVS__EloffJ.pdf`](MashambaVS__EloffJ.pdf) | COS700 research proposal |
| [`mobile-app/`](mobile-app) | The React Native / Expo mobile app |
| [`POPIA/`](POPIA) | English source notes for the POPIA and Digital Privacy modules (Sections 1–5) |
| [`ONLINE SCAMS MODULE ALL TOPICS.pdf`](<ONLINE SCAMS MODULE ALL TOPICS.pdf>), [`online scams/`](<online scams>) | Online Scams source notes in English, and in isiZulu, Sepedi and Xitsonga |
| [`Zulu Notes/`](<Zulu Notes>), [`Tsonga Notes/`](<Tsonga Notes>) | isiZulu and Xitsonga translations of the POPIA / Digital Privacy notes |
| [`badges/`](badges) | Original badge artwork and the app logo |

All lesson text, quiz questions and answers in the app come from these notes; none of it was invented for the app.

## The modules

| # | Module | Lessons | Assessment |
|---|---|---|---|
| 01 | POPIA & Your Personal Data | 3: What is POPIA?, Your Rights as a Data Subject, What Organisations Must Do | A knowledge check after each lesson |
| 02 | Online Scams | 9: from WhatsApp, SMS and email scams to investigating and responding to a scam | A knowledge check after each lesson; the last lesson is the final assessment |
| 03 | Digital Privacy | 2: How Your Data Gets Misused, Protecting Your Digital Privacy | A knowledge check after lesson 1, a 10-question final assessment |

A final assessment needs **70%** to pass. Passing it earns a badge and a certificate.

Several lessons include a short video: Online Scams lessons 2, 3, 5 and 9, POPIA lesson 2 (a dramatised scenario about a student's data rights) and Digital Privacy lesson 1 (a dramatised identity-theft scenario). The videos are stored in Supabase Storage.

## Features

- **Four languages.** The student picks English, isiZulu, Sepedi or Xitsonga on first launch and can switch at any time in Profile. The whole app follows that choice: interface, lessons, knowledge checks, results, certificates and the AI features.
- **Lessons and knowledge checks** for every topic, with immediate feedback on each answer.
- **Badges.** Six badges, celebrated full-screen when earned: First Steps, POPIA Aware, Scam Spotter, Digital Privacy Pro, 7-Day Streak and Cyber Aware Graduate.
- **Certificates.** One per module with a final assessment, with the student's name, score, date and a certificate number. They can be saved as a PDF and shared.
- **Daily practice.** Three new questions a day, each from a different topic, written by AI from the lesson notes and never repeated. Offline, unseen knowledge-check questions are used instead. Answering every question keeps the day streak going.
- **Daily reminder.** An optional notification at 18:00 on days not yet practised.
- **Check a message.** The student pastes a suspicious message, or uploads a screenshot of one, and gets an AI verdict (likely a scam, likely legitimate, or unsure) with the warning signs and an explanation in their language.
- **Continue learning.** Home reopens the lesson the student was last on.

### Screens

- **Language**: first-launch language picker
- **Home**: greeting, day streak, badges, overall progress, continue learning, today's practice, modules
- **Modules / Module detail**: the three modules and their lessons
- **Lesson**: the topic notes, with a video where one exists, then its knowledge check
- **Result**: score, pass/fail, marks by topic, and the badge earned
- **Certificate**: the certificate on screen, with "Download PDF"
- **Practice**: daily practice questions and "Check a message"
- **Profile**: name, badges, certificates, daily practice totals, reminder switch, language

## Tech stack

| Area | Used |
|---|---|
| App | React Native 0.86, Expo SDK 57, Expo Router, TypeScript |
| State | Zustand, saved on the phone with AsyncStorage |
| Languages | i18next, react-i18next, expo-localization |
| UI | React Native Paper, Archivo typeface, @expo/vector-icons |
| Backend | Supabase: anonymous sign-in, progress/badge/quiz tables, and Storage for the lesson videos |
| AI | DeepSeek API: message and screenshot checking, daily practice questions |
| Media and device | expo-video, expo-audio, expo-image-picker, expo-notifications, expo-print, expo-sharing |
| Validation | zod, react-hook-form |
| Tests | Jest (jest-expo), React Native Testing Library |
| Builds | EAS Build and Submit (App Store and Google Play) |

The full list is in [`mobile-app/package.json`](mobile-app/package.json); `npm install` fetches everything.

## Getting started

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org/) | 20 LTS or newer | Includes `npm` |
| [Git](https://git-scm.com/) | any recent version | To clone the repo |
| [Expo Go](https://expo.dev/go) | latest | Free app on your phone, from the App Store or Play Store. Runs the app without Android Studio or Xcode. |

Your phone and your computer must be on the **same Wi-Fi network** for the QR code method below.

### Clone and install

```bash
git clone https://github.com/phetho5/CybersecurityOnlineModules.git
cd CybersecurityOnlineModules/mobile-app
npm install
```

### Add the keys

The app needs a Supabase project and a DeepSeek API key. Copy the template and fill in the real values (ask the team for them):

```bash
cp .env.example .env
```

| Variable | Where it comes from |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Same page, the **anon public** key (never the service_role key) |
| `EXPO_PUBLIC_DEEPSEEK_API_KEY` | [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) |

`.env` is git-ignored; never commit it. Without the DeepSeek key the AI features show an error and the rest of the app still works.

The database schema and the video bucket are in [`mobile-app/supabase/migrations/`](mobile-app/supabase/migrations).

### Run the app on your phone

1. From `mobile-app/`, start the dev server:
   ```bash
   npx expo start
   ```
2. Scan the QR code that appears: with Expo Go's scanner on Android, or with the Camera app on iPhone.
3. The app loads on your phone (this can take a minute the first time). Saving a file reloads it automatically; press `r` in the terminal to reload by hand.

Other ways to run it:

| Command | Opens |
|---|---|
| `npx expo start --web` | A browser (quick check; notifications are not available there) |
| `npx expo start --android` | An Android emulator (needs Android Studio) |
| `npx expo start --ios` | The iOS simulator (needs Xcode on a Mac) |

### Tests and checks

From `mobile-app/`:

| Task | Command |
|---|---|
| Run all tests | `npx jest --runInBand` |
| Type check | `npx tsc --noEmit` |
| Lint | `npm run lint` |

Run the tests with `--runInBand`: on slower machines a parallel run can time out some screen tests.

### Store builds

Builds are made in the cloud with EAS ([`mobile-app/eas.json`](mobile-app/eas.json)). The keys for store builds are kept as EAS environment variables, not in `.env`.

```bash
npx eas-cli@latest build --platform all --profile production
```

The iPhone build goes to TestFlight through App Store Connect; the Android build is uploaded in the Google Play Console. Content changes such as new video links only reach installed apps through a new build.

### Project structure

```
mobile-app/
  src/
    app/          # Screens (Expo Router, one file per route)
    components/   # Shared UI: lesson layout, video/audio players, badges, certificate, forms
    constants/    # Design tokens (colours, fonts, spacing)
    data/         # Module, lesson, quiz and badge content, per language
    i18n/         # Interface text for the four languages, and i18next setup
    lib/          # Logic: scoring, badges, streak, daily practice, reminders, certificates, Supabase, DeepSeek
    store/        # Zustand app state
  __tests__/      # Screen tests (unit tests sit next to their code in __tests__ folders)
  supabase/       # Database migrations
  assets/         # Icons, splash screen, logo, badge images
```

## Status

- [x] Research proposal
- [x] Module content: POPIA, Online Scams, Digital Privacy (English, from the source notes)
- [x] Mobile app: all screens, badges, certificates, daily practice, reminders, AI message checker
- [x] Content in isiZulu, Sepedi and Xitsonga
- [x] Lesson videos for six topics
- [x] iPhone build on TestFlight; Android build made
- [ ] Native-speaker review of the AI-translated text (see below)
- [ ] Progress syncing to Supabase (the tables exist; anonymous sign-in still has to be enabled in the Supabase dashboard)
- [ ] Testing and evaluation with students
- [ ] Public release on the App Store and Google Play

## Known limitations

- **Some translated text was translated by AI, not a native speaker.** It is kept in separate files ending in `-ai.ts` and `.ai.json` under `mobile-app/src/data/` and `mobile-app/src/i18n/locales/`, so it can be reviewed and replaced. This covers most interface text in all three languages, several Sepedi lessons and the first Xitsonga POPIA lesson. The AI-written daily questions and message-check explanations are also unreviewed.
- **The DeepSeek key ships inside the app**, because the app calls DeepSeek directly. Anyone who unpacks the app can extract it, so it needs a spending limit.
- **Progress is kept on the phone.** It is lost if the app is uninstalled, until syncing and a real sign-in are in place.
- **The free Supabase plan pauses after about a week of inactivity**, which stops the videos loading until it is restored.
- **POPIA and data location.** Supabase has no South African hosting region. A lawful basis has to be documented before identifiable student data is stored there.
