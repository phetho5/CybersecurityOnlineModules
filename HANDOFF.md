# Handoff

Snapshot of where this project stands, so a new chat can pick up without re-deriving context. Update this every 10-15 messages.

**Last updated:** 2026-10-10 (night). Everything up to and including the name in Profile and the Play Store build setup is committed on the branch `multilingual-app-and-new-modules`, with a pull request open into `main`. Start with the first section, then "Open items" and "Next steps" at the bottom.

## 2026-10-10 (night): name in Profile, and Play Store build setup

**The name.** The user asked to be able to add their name "in the settings". There is no Settings screen, so it is on Profile (which already holds notifications and language). Asked: the name is also used to greet the student on Home. Built tests first.

- **Profile:** a "Your name" section at the top. No name: a line saying what it is for and an "Add your name" button. With a name: the name, a "Change name" button. Editing happens in place with "Save name" and "Cancel".
- It is the same saved name the certificate uses (`studentName` in the store), so a name typed in either place shows in both. It stays on the phone.
- **One shared form:** `src/components/name-form.tsx` (`NameForm`), used by Profile and by `src/app/certificate/[moduleId].tsx`. Same rules as before: 2 to 60 characters, character count, save disabled until valid with the reason shown.
- **Home:** the greeting becomes "<greeting>, <first name>" (`personalGreeting` in `src/lib/student-name.ts`). The native-speaker greetings are untouched; only the name is added. The greeting may take three lines.
- A saved name that is damaged or breaks the rules is treated as no name (`readStudentName`).
- **Not built:** removing a name once saved (it can only be changed).
- Six new interface strings (`yourName`, `nameEmpty`, `nameAdd`, `nameHelp`, `nameSave`, `cancel`), AI-translated and unreviewed.
- **Caught in the browser check, not by the tests:** at 320 px the English greeting already fills two lines, so a two-line limit hid the name completely. The limit is three.
- **Verified:** `npx tsc --noEmit` clean, `npm run lint` 0 errors (23 warnings), **979 tests across 46 suites passing** (`npx jest --runInBand`; an earlier full run on a busy machine failed 3 tests in 3 screen suites that took up to 107 s, the reason was not captured, and the same suites passed alone and in a second full run). Hands-on in a phone-sized Chromium, no page errors: add, too short, too long, save, change, cancel, reload; Home greeting at 390 px and at 320 px in all four languages with a 54-character name; a name typed on the certificate screen shows on Profile.
- **Not verified:** on a real phone (keyboard covering the box, in particular).

**Play Store setup (the user wants an internal-testing release first; they have a personal Play developer account).**

- `app.json`: Android package `com.cyberawaresa.app` (Claude's choice, told to the user; **permanent once uploaded**), EAS project id and `owner: vhulenda`. The microphone permission is blocked (`blockedPermissions`): the app never records, and `expo-audio` adds it by default.
- `mobile-app/eas.json`: a `production` profile (app bundle, version code raised automatically, EAS `production` environment), a `preview` profile (installable `.apk`), and submit set to the `internal` track.
- EAS project created: `@vhulenda/mobile-app`, https://expo.dev/accounts/vhulenda/projects/mobile-app. The machine is logged in to EAS as `vhulenda`.
- **Not done, needs the user:** see "Next steps" 1 to 4. No build has been started.
- **Worth knowing for Play:** the app declares a foreground service for media playback, because `_layout.tsx` turns on background audio. Google Play asks for a declaration (with a short video) for that. If background audio is not needed, turning it off (`enableBackgroundPlayback` in `app.json` and `shouldPlayInBackground` in `_layout.tsx`) removes the question.

## 2026-10-10 (evening): earned badges are celebrated in the middle of the screen

The user asked for an earned badge to "appear in the middle of the screen with some dramatic entrance and animations, not just appearing on top". Built tests first.

- `src/components/badge-celebration.tsx` (`BadgeCelebration`, mounted in `_layout.tsx`) replaces `badge-earned-banner.tsx`, which is deleted. It covers the whole screen with a dark backdrop. The badge (168 px) spins and springs into the centre, two rings burst outwards, twelve sparkles fly out, rays turn slowly behind it, then the name, a congratulation and two buttons rise in: "See my badges" (opens Profile) and "Keep going" (closes). After the entrance the badge keeps gently pulsing.
- It stays until closed. The Android back button closes it. Two badges earned together are celebrated one after the other, each with its own entrance.
- **Assessment badges are now celebrated too** (Scam Spotter, Digital Privacy Pro). They used to be left out because the Result screen shows them; that was Claude's reading of "the badges when earned", told to the user. A repeat pass does not celebrate again.
- A student whose phone is set to "reduce motion" gets the badge in place with no movement.
- **Replay from Profile (asked for afterwards):** tapping an earned badge on Profile plays the same celebration again, with a single "Back" button. A locked badge is not a button and does nothing. The store holds this in `badgeReplayId` (`replayBadge` / `closeBadgeReplay`), which is not saved on the phone and never counts as earning the badge again. A newly earned badge always goes before a replay.
- Built with React Native's own `Animated`, no new dependency.
- **Caught in the browser check, not by the tests:** React Native's `useAnimatedValue` does not exist in the web build and crashed the screen. The component uses `useState(() => new Animated.Value(0))` instead; do not switch back.
- Three new interface strings (`badgeCongrats`, `badgeSeeMine`, `badgeKeepGoing`), AI-translated and unreviewed; `badgeEarnedHint` and `dismiss` were removed.
- **Verified:** `npx tsc --noEmit` clean, `npm run lint` 0 errors, **920 tests across 45 suites passing**. Hands-on in a phone-sized Chromium: tapping an earned badge on Profile replays the celebration and "Back" returns to Profile, a locked badge does nothing; finishing POPIA lesson 1 shows the celebration centred at 390 px (English) and 320 px (Xitsonga), nothing overflows, "Keep going" closes it, no page errors.
- **Not verified:** how smooth the animation is on a real phone, and the reduce-motion path on a real phone.

## 2026-10-10 (earlier): real milestones, daily questions and reminders

The user reported fake numbers on Home ("4 badges, 33% complete"), asked for "Continue learning" to resume where they actually left off, and asked for daily practice to become three questions a day from the notes, never repeated, with a daily notification. Bug investigated first, feature decisions put to the user, then built tests first.

**The fake numbers (bug #8 in `BUGS_AND_FIXES.md`, read it):** demo values from the app's first build were still saved on the user's phone. Saves from before this update are cleaned once on first open (`src/lib/saved-state.ts`, save version 1 in the store). Real progress is kept.

**Continue learning:** the lesson screen records the lesson being read (`lastLesson` in the store). Home resumes that lesson; if it has since been finished, the next one in that module; if the module is complete, the first unfinished module (`src/lib/continue-lesson.ts`).

**Decisions the user made (asked on 2026-10-10):**
- Three questions a day in total, each from a different topic.
- The AI writes them from the lesson notes; offline, unseen knowledge-check questions from the notes are used.
- They replace the old "Scam or Legit?" practice messages. "Check a message" stays.
- They drive the day streak, a card on Home and totals on Profile. No new badges yet (those need artwork).

**How daily practice works:**
- `src/lib/daily-practice.ts` — the rotation of all 14 topics (`PRACTICE_TOPICS`, one module at a time in turn), `loadDailyQuestions` and `practiceStatus`. `src/lib/deepseek.ts` — `generateDailyQuestions` sends each topic's notes and gets two candidate questions back per topic.
- **Never the same question twice:** every question shown is saved on the phone (`askedQuestions`). A candidate that matches one, ignoring capitals and punctuation, is skipped, and the AI is sent the last 12 questions for each topic and told not to repeat or rephrase them. Notes questions carry a fixed id, so they are not repeated after a language change either.
- The day's questions and answers are saved (`dailyPractice`), so reopening the app shows the same set with no new AI call. A new set is fetched on a new day. Changing language before answering anything fetches the set again in the new language; after an answer the set stays as it is.
- **Streak:** it now counts days on which every daily question was answered, right or wrong. Opening the app or finishing a lesson no longer counts. Home shows 0 as soon as a day has been missed (`currentStreak` in `src/lib/streak.ts`). The 7-Day Streak badge follows the same rule and its how-to-earn line was reworded.
- **Screens:** `src/components/daily-practice.tsx` (on Practice), a "Today's practice" card on Home, a "Daily practice" totals section on Profile (days practised, questions answered, correct answers).

**Reminders (`expo-notifications`, new dependency, works in Expo Go):**
- **Asked on entry (the user's instruction, later on 2026-10-10):** the first time a student is past the language picker, the phone's own notification prompt appears by itself (`ReminderSync`). Allowing turns reminders on; refusing is saved as off, so the student is asked once, not on every launch. A fault (not an answer) leaves it open and the next launch asks again.
- **Switch in Profile (also the user's instruction):** a "Notifications" section with a "Daily reminder" switch (`DailyReminder`). If the phone has notifications blocked, the switch stays off and an "Open phone settings" link is shown, because the phone will not show its prompt a second time. The earlier card on Practice was removed.
- The reminder arrives at 18:00 on the phone's clock, only on days not yet practised. It is planned 14 days ahead as separate notifications and re-planned whenever the app is opened, practice is finished or the language changes (`src/lib/reminders.ts`, `ReminderSync` in `src/components/daily-reminder.tsx`, mounted in `_layout.tsx`). Tapping it opens Practice.
- **Consequence of planning 14 days ahead:** a student who does not open the app for two weeks stops getting reminders until they open it again.
- The 18:00 time and the 14 days were Claude's choices, told to the user, not asked. Both are constants at the top of `reminders.ts`.
- Not offered in a web browser: no prompt, and the Notifications section is left out of Profile. This also means the browser check could not show the prompt or the switch at all; it only confirmed Home, Profile and Practice still load with no errors.

**Removed:** the scam-or-legit practice messages: `src/data/drills.ts`, `generateSADrills`, the store's `drillPicks` / `answerDrill` / `recordActivity`, and five interface strings. The `scam` / `legit` strings were left in the language files because they are native-speaker translations.

**Translations:** 29 new or reworded interface strings (two of them, "Notifications" and "Open phone settings", added with the Profile switch), AI-translated into isiZulu, Sepedi and Xitsonga in the `.ai.json` files, unreviewed like the rest. This includes the wording of the notification itself.

**Verified:** `npx tsc --noEmit` clean, `npm run lint` 0 errors (22 warnings, all in test files plus the old i18next one), **883 tests across 45 suites passing** (`npx jest --runInBand`). Hands-on in a phone-sized Chromium against the live DeepSeek API, no page errors:
- The exact saved state from the bug report opens as 0 day streak, 0 badges, 0%.
- A new student gets three AI-written questions in about 5 seconds, answers them, sees "Done for today", then Home shows the streak at 1 and the done card and Profile shows the totals. A reload shows the same questions with no new AI call.
- Opening Online Scams lesson 4 and returning to Home shows that lesson under "Continue learning".
- With the AI blocked, three questions from the notes appear, labelled "From your lesson notes".
- At 320 px wide in isiZulu, Sepedi and Xitsonga nothing overflows and the questions arrive in that language.

**Not verified:**
- **Anything about notifications on a real phone.** The permission prompt, the 18:00 delivery, the tap opening Practice and the Android channel are covered by tests against a stand-in for the phone's notification system only. This needs Expo Go on a phone.
- **The accuracy of the AI's questions and answers.** The ones seen in the check were sensible and matched the notes, but nobody checks each day's questions. A wrong answer key would teach students something false. The quality in isiZulu, Sepedi and Xitsonga was not judged at all.
- **The streak across real days** (tested with set dates).

**Worth knowing:**
- The AI sometimes writes "according to the notes" in a question even though the instruction tells it not to mention the notes.
- Daily practice (questions, answers, totals) is kept on the phone only. Nothing is sent to Supabase, and there is no table for it.
- `CLAUDE.md` still says the app has no test runner and that there are no network calls; both are out of date.
- Port 8081 was held by the user's own dev server (PID 50856) and left alone. The check used port 8090 and that server was stopped.
- `app.json` gained the `expo-notifications` plugin, which matters only for a real build.

## 2026-10-10 (earlier still): the app logo

The user supplied `badges/logo.png` (a maroon fingerprint inside scan brackets, 189 × 200 px, transparent background) and asked for it to be added "in the appropriate files". Built tests first.

- **App icon, splash screen, favicon:** `icon.png`, the three `android-icon-*.png` layers, `splash-icon.png` and `favicon.png` in `mobile-app/assets/images/` were regenerated from the logo, replacing the Expo starter artwork. The icon is the logo on white. `app.json`: the splash background is now the app background (`#f3f2f2`, was Expo blue), the Android icon background is white, and the `ios.icon` override pointing at the Expo starter icon (`assets/expo.icon`) was removed so iPhones use `icon.png`. The `assets/expo.icon` folder is now unused and was left in place.
- **Inside the app:** `src/components/brand-logo.tsx` (`BrandLogo`), shown above "CyberAware SA" on the language picker and beside the greeting on Home. It reads `assets/images/logo.png` (512 px, square).
- **On the certificate (the user said yes when asked):** the logo sits above "CyberAware SA", on screen and in the PDF, 30 units on the 360-unit grid (`LOGO_SIZE` in `src/lib/certificate-html.ts`). The PDF page is a standalone HTML string and cannot load a bundled image, so it embeds a 240 px copy from `src/lib/logo-data-uri.ts` (about 6 KB). **If the logo changes, regenerate that file as well as the images.**
- **App name (the user said yes when asked):** `app.json` `name` is now "CyberAware SA". `slug` (`mobile-app`) and `scheme` (`mobileapp`) were deliberately left alone: Expo Go keeps saved progress per slug, so changing it would hide the progress already on the user's phone.
- **Image quality:** the supplied file is small, so the shape was enlarged and its edges re-sharpened in one flat colour (`#77030f`, the average of the original). It looks clean at icon size; a larger or vector original would still be better for the stores. The originals in `badges/` are untouched.
- **Worth knowing:** the logo is maroon, while the app's accent is orange-red (`#ec3013`). Nothing was recoloured, so the certificate now carries a maroon logo next to orange-red corners and seal.
- **Verified:** `npx tsc --noEmit` clean, `npm run lint` 0 errors (12 warnings), **704 tests across 40 suites passing** (`npx jest --runInBand`). Hands-on in a phone-sized Chromium at 390 and 320 px wide, no page errors: language picker, Home in English and Xitsonga (the English greeting wraps to two lines at 320 px, nothing overflows), favicon served; the certificate on screen in English and in isiZulu with a 44-character name; the PDF page rendered at A4 size for both, with the logo loaded and nothing overflowing.
- **Not verified:** the logo in a PDF made by a real phone (the page was rendered in a browser, not by the phone's PDF engine); the home-screen icon, app name and splash screen on a real phone. Expo Go shows its own icon and splash, so these only appear in a development or store build.
- Port 8081 was held by the user's own dev server (PID 50856, a phone connected); the check used port 8090 and that server was stopped afterwards.

## 2026-10-10 (earlier): six badges with artwork, lesson progress and a real day streak

The user supplied six badge images in `badges/` (repo root), confirmed which badge each one is, and said "go with your recommendations" on the three open badge questions. Built tests first.

**The six badges** (ids in brackets):

| Badge | Image | How it is earned |
|---|---|---|
| First Steps (`first-steps`) | `badge 5.jpg` | Finish any one lesson's knowledge check |
| POPIA Aware (`popia-basics`) | `badge 4.png` | Finish all three POPIA lessons |
| Scam Spotter (`scam-spotter`) | `badge 1.png` | Pass the Online Scams final assessment (unchanged) |
| Digital Privacy Pro (`popia-aware`) | `badge 2.png` | Pass the Digital Privacy final assessment (unchanged) |
| 7-Day Streak (`streak-7`) | `badge 3.png` | Open the app 7 days in a row |
| Cyber Aware Graduate (`cyber-graduate`) | `badge 6.png` | Complete all three modules |

- **Decisions (Claude's recommendations, accepted by the user):** the flame is the 7-Day Streak and replaces the unearnable 30-Day Streak; the gold star is Cyber Aware Graduate, not Perfect Score; POPIA Aware is earned by finishing the lessons, whatever the score.
- **Id catch:** Digital Privacy Pro has always been stored as `popia-aware`, so it keeps that id and POPIA Aware is `popia-basics`. Do not rename either.
- **Not built:** Perfect Score, Sharp Eye, Message Detective and a 30-day streak have no artwork and stay parked.

**Found and fixed on the way (bug #7 in `BUGS_AND_FIXES.md`):** finishing lessons never moved a module's progress, so POPIA could never reach 100%, and nothing ever increased the streak. Both are fixed, because three of the badges depend on them. Home's "Complete" percentage, the module progress bars and "Continue learning" now move as lessons are finished.

**How it works:**
- `src/lib/badges.ts` — `computeEarnedBadgeIds` (progress in, badges out; never takes a badge away), `lessonProgressPct`, `countEarnedBadges`. `src/lib/streak.ts` — `nextStreak`.
- `src/store/useAppStore.ts` — new `completeLesson`, `recordActivity`, `dismissBadgeAnnouncement`; new saved field `lastActiveDate`; new unsaved queue `badgeAnnouncements`. Every newly earned badge is also sent to Supabase when a user is signed in.
- A lesson counts as finished when the student taps "Continue" after the last knowledge-check question. The last lesson of Online Scams and Digital Privacy records nothing: only passing the final assessment completes those modules.
- **Telling the student:** superseded later the same day by the centre-screen celebration (see the first section). Originally `src/components/badge-earned-banner.tsx` showed a card at the top of the screen. The two assessment badges are not shown there because the Result screen already shows them (now with the badge picture, not a ribbon icon).
- **Profile:** two badges per row; a locked badge is faded and says how to earn it; "N of 6 earned", or a congratulation when all six are held.
- **Old saves:** a student who had already made progress before this update gets the badges that progress earned, silently, when the app opens.
- **Images:** resized to 384 px PNGs in `mobile-app/assets/images/badges/<id>.png`; the white background and drop shadow were cut out of `badge 5.jpg`. The originals in `badges/` are untouched.

**Translations:** 14 new interface strings (4 badge names, 6 how-to-earn lines, 4 others), AI-translated into isiZulu, Sepedi and Xitsonga in the `.ai.json` files, unreviewed like the rest. `badgeName_streak-30` was removed.

**Verified:** `npx tsc --noEmit` clean, `npm run lint` 0 errors (12 warnings), **676 tests across 36 suites passing** (`npx jest --runInBand`). Hands-on in a phone-sized Chromium, no page errors: Profile for a new student; finishing POPIA lesson 1's knowledge check (banner appears, closes, Home moves to 34% and lesson 2, Profile shows 1 of 6); the 7-Day Streak banner on opening the app on the seventh day and tapping it through to Profile; all six earned; Profile at 320 px wide in isiZulu, Sepedi and Xitsonga; a save from before this update.

**Not verified:**
- **On a real phone.**
- **The Result screen's badge picture and the Graduate banner in a browser** (covered by tests only; reaching them needs a passed final assessment).
- **The streak across real days.** Tested with set dates, not by waiting.

**Worth knowing:**
- The streak counts days the app was opened, not days a lesson was done. Say so if the report describes it.
- `badge 5.jpg`'s frame is a slightly different style from the other five, and several images keep a faint blue fringe on the right edge from the original background removal. Regenerating them would fix both.
- Port 8081 was held by another process (PID 5376) that Claude did not start and left alone; the browser check used port 8090, and that server was stopped afterwards.

## 2026-10-10 (later): the certificate

The user asked for a certificate that makes students feel rewarded. Planned first, four decisions put to the user, then built tests first.

**Decisions the user made:**
- **Name:** the student types it once, the first time they open a certificate. Stored on the phone only (`studentName` in the store), editable, never sent to Supabase.
- **Awarded for:** each module with a final assessment — Online Scams (02) and Digital Privacy (03). POPIA has none.
- **Footer:** the two researchers' printed names plus "COS700 research project · University of Pretoria". No signatures, no crest, no supervisor name.
- **Language:** the certificate is written in the language the module was passed in, and stays in that language even if the app language changes later.

**What is on it:** CyberAware SA, "Certificate of Completion", the student's name, the module, a red seal with the badge name, score (with the 70% pass mark), date awarded, a certificate number (`CA-<module>-<yyyymmdd>-<4 chars>`), researchers and project line. Portrait A4 — the plan said landscape, but portrait fills a phone screen and still prints on one sheet (Claude's call, told to the user).

**How it works:**
- Passing a final assessment issues the certificate (`completeModule(moduleId, badgeId, scorePct)`). A repeat pass keeps the original date, number and language and can only raise the score.
- Result screen: "View certificate" now opens `/certificate/<moduleId>` (it used to jump to Profile).
- Profile: one row per certificate. Earned rows open the certificate; locked rows say how to earn it and open the module. The old permanently disabled Download button is gone.
- "Download PDF" builds a one-page PDF and opens the phone's share sheet (`expo-print` + `expo-sharing`, both in Expo Go). In a browser it opens the print dialog instead.
- A badge earned before this feature (or on another phone) has no stored score/date/number; its certificate shows without those three lines rather than inventing them.

**Code:** `src/lib/certificate.ts` (rules and wording), `src/lib/certificate-html.ts` (PDF page), `src/lib/export-certificate.ts` (PDF + share, never throws), `src/components/certificate.tsx` (on-screen drawing and the seal), `src/app/certificate/[moduleId].tsx` (screen). **The on-screen certificate and the PDF page are two drawings of the same layout on a 360-unit grid — change them together.**

**Also changed:** the Result screen no longer calls the badge "verifiable" (nothing verifies it); the `badgeVerifiable` string was removed from all languages. `app.json` gained the `expo-sharing` plugin (added automatically by `expo install`).

**Translations:** 23 new interface strings, AI-translated into isiZulu, Sepedi and Xitsonga in the `.ai.json` files, unreviewed like the rest. This includes the wording printed on the certificate itself.

**Verified:** `npx tsc --noEmit` clean, `npm run lint` 0 errors (9 warnings), **563 tests across 32 suites passing** (`npx jest --runInBand`). Hands-on in a phone-sized Chromium: name form (too-short error, character count), English certificate, isiZulu certificate with a 44-character name, a Sepedi certificate for a badge with no stored details, not-earned and no-certificate messages, Profile with one and with no certificates, and the PDF page rendered at A4 size. No page errors.

**Not verified:**
- **On a real phone.** PDF creation and the share sheet only run on a device; in the browser the PDF page was rendered directly, not produced by the phone's PDF engine.
- **The Result → "View certificate" tap in a browser** (covered by tests only).
- **The Archivo typeface in the PDF.** The PDF page loads it from Google Fonts, so a phone that is offline when the PDF is made will get a plain fallback typeface.

**Typed-routes gotcha:** after adding a route file, `npx tsc --noEmit` fails on `router.push('/certificate/…')` until `.expo/types/router.d.ts` is regenerated. A dev server that was already running regenerated it wrongly (it listed `src/lib` files as routes); deleting the file and starting `npx expo start` fresh fixed it.

## 2026-10-10: "Check a message" now also takes a screenshot

The user asked to be able to upload screenshots of possible scams (e.g. an email). Built, tests first.

- **How it works:** on Practice, under the text box, "Add a screenshot" opens the phone's photo library. The chosen picture replaces the text box (preview + "Remove screenshot"); "Check this screenshot" sends it to the AI and shows the same verdict card as a pasted message, in the student's language. Removing it brings the text box back with whatever was typed.
- **Model:** screenshots go to DeepSeek's `deepseek-flash` (the only model on this key that accepts images — confirmed from `GET /models` and a live call on 2026-10-10). Pasted text and practice generation still use `deepseek-chat`, unchanged. `deepseek-chat` is no longer in the key's model list but still works; if it is ever retired, switch `TEXT_CALL.model` in `deepseek.ts` to `deepseek-flash`.
- **Code:** `checkScreenshot` and `validateScreenshot` in `src/lib/deepseek.ts`; `src/lib/pick-screenshot.ts` (wraps `expo-image-picker`, new dependency, works in Expo Go); UI in `src/app/(tabs)/practice.tsx`. Three new error reasons: `image-too-large` (over about 6 MB), `unsupported-image` (not JPEG/PNG/WebP), `no-text-found` (the AI saw no message in the picture; no "Try again" is offered for this one).
- **Privacy:** an always-visible note under the button tells the student to crop out anything personal and that the picture is sent to an AI service; the app keeps no copy. The user was asked whether they wanted something stricter (e.g. forced cropping) and **did not answer** — the note was Claude's recommended default. Screenshots can contain other people's personal information and go to DeepSeek's servers outside South Africa; this belongs with the open POPIA question.
- **Translations:** 10 new interface strings, AI-translated into isiZulu, Sepedi and Xitsonga in the `.ai.json` files, unreviewed like the rest.
- **Also changed:** any check (text or screenshot) that runs longer than 5 seconds now changes its waiting text to "Still checking — almost there…" (`checkingMessageSlow`, a string that already existed but was unused).
- **Verified:** `npx tsc --noEmit` clean, `npm run lint` 0 errors (8 warnings), **478 tests across 27 suites passing**. Hands-on in a phone-sized Chromium against the live API: cancel the picker (nothing changes), pick a fake SARS email (preview, "Likely a scam" in about 3 s), remove (text box returns), pick a picture with no text ("Couldn't find a message in that image"). **Not checked on a real phone** — the photo picker itself and upload speed on mobile data need a human in Expo Go.
- **Noticed:** in that browser check the Supabase sign-in failed with a name-lookup error (`ERR_NAME_NOT_RESOLVED`) rather than the earlier "anonymous sign-ins disabled" reply. Cause not investigated; worth checking the project is not paused when Supabase is next worked on.

## Where things stand (2026-10-09)

- **Modules:** three, all with real sourced English content — `01` POPIA & Your Personal Data (3 topics), `02` Online Scams (9 topics), `03` Digital Privacy (2 topics, with a 10-question final assessment). There is no Cybercrimes Act module any more.
- **Languages:** the whole app follows the chosen language (English, isiZulu, Sepedi, Xitsonga): interface, module and badge names, lessons, knowledge checks, results, and both AI features. Much of the non-English text is AI-translated and unreviewed — see part 2 below for exactly which.
- **AI features:** message checker and AI-generated daily practice, via DeepSeek called directly from the app.
- **Backend:** Supabase is wired in with anonymous auth, but nothing syncs yet because anonymous sign-ins are still disabled in the dashboard.
- **Badges:** as of 2026-10-10 there are six, all earnable, each with its own artwork — see the first section above. (On 2026-10-09 there were three, one of them unearnable.)
- **Quality bar:** `npx tsc --noEmit` clean, `npm run lint` 0 errors, 429 tests across 26 suites passing with `npx jest --runInBand`. Checked hands-on in a phone-sized desktop browser in all three languages; **not yet checked on a real phone**.

> **Read this first — parts of this file below are stale.** Between 2026-10-01 and 2026-10-09 a session ran that never updated this file. It replaced the old mockup-sourced modules 01/03 with real sourced English content: **01 is now "POPIA & Your Personal Data" (3 topics, from `POPIA/` Sections 1, 2, 4) and 03 is now "Digital Privacy" (2 topics, Sections 3 and 5; Section 5's 10-question exam is its final assessment). The Cybercrimes Act module no longer exists.** It also added `src/lib/topic-source.ts` (per-module content/quiz/final-assessment lookup, so screens no longer special-case module `02`). Anything below that says modules 01/03 are "mockup-sourced", "Cybercrimes Act", or "deferred" is out of date — trust the code (`src/data/modules.ts`, `popia-topics.ts`, `digital-privacy-topics.ts`) over those paragraphs.

## This session, part 2 (2026-10-09): the whole app now follows the chosen language

The user reported that choosing Sepedi only changed the lesson notes. Root cause and fix are written up as **bug #6 in `BUGS_AND_FIXES.md`** — read that first. In short: the language files were two-thirds empty, about 30 strings were typed straight into screens, names came from English-only data, the AI features were never told the language, and one key was never defined.

**State now:** with isiZulu, Sepedi or Xitsonga chosen, every screen is in that language — tab bar, Home, Modules, module pages, lessons, knowledge checks, results, Practice (including AI-generated practice messages and the message checker's explanation) and Profile. **Verified hands-on** in a phone-sized browser in all three languages against the live DeepSeek API, with no page errors.

**What is deliberately still not translated:**
- The language picker heading ("Choose your learning language") — shown before a language is chosen; it already has a three-language subtitle.
- The brand name "CyberAware SA", and channel labels (SMS, WhatsApp, Email).
- `src/app/quiz/[id].tsx` and `src/data/quiz.ts` — the old single-quiz screen. Nothing links to it any more; it is dead code that could be deleted.

**AI-translated text — the important caveat.** There are no native-speaker notes for interface text, so Claude translated it. All of it is kept apart from native text so it can be reviewed or replaced:

| What | Where | Languages |
|---|---|---|
| Interface text (86 strings each) | `src/i18n/locales/{zu,nso,ts}.ai.json` | all three |
| Saved practice examples (3) | `TRANSLATED_DRILLS` in `src/data/drills.ts` | all three |
| POPIA topic 1 | `src/data/popia-topics-ts-ai.ts` | Xitsonga |
| POPIA topics 2–3, all of Digital Privacy | `src/data/*-nso-ai.ts` | Sepedi |

The original `zu.json`/`nso.json`/`ts.json` (28 strings each) always win over the `.ai.json` files, so a reviewed string can be moved across one key at a time. **None of the AI text has been reviewed by a native speaker.** The user asked for this explicitly for Sepedi ("take the notes from the English one and translate them") and then asked for the whole app to follow the language; extending AI translation to isiZulu and Xitsonga interface text and to Xitsonga POPIA topic 1 was Claude's reading of that request, flagged to the user at the time. `CLAUDE.md` still says "do not invent translations" and its "Translation scope (current)" row is now out of date — the user has not yet said whether to change it.

**AI-generated practice messages in isiZulu/Sepedi/Xitsonga** come from DeepSeek. They read plausibly in the browser check, but DeepSeek's quality in these languages is unverified and will vary; a native speaker should sample them.

**How to add interface text from now on:** add the key to `en.json`, then to all three `.ai.json` files (or the native file if a native speaker supplied it), and use `t('key')` in the screen. `locales.test.ts` fails if a key is missing in any language, if a translated file contains English, or if English is typed straight into a screen.

**Other things noticed, not changed:**
- The result screen's "Marks by topic" lists the same topic name once per question for Digital Privacy (ten identical rows), because that exam has no per-question topic.
- The result screen calls the badge "verifiable", but nothing verifies it.
- In development the browser shows a red "ensureAnonymousSession" error toast, because anonymous sign-ins are still disabled in Supabase. It is a dev-only overlay; the app carries on locally.
- **Port 8081 was held by a `node.exe` (PID 41152) that did not answer web requests** all session. Claude did not start it and left it alone; if `npx expo start` misbehaves, check `netstat -ano | findstr :8081`.
- A Playwright browser (Chromium) is installed on this machine under `%LOCALAPPDATA%\ms-playwright`, so a future session can do a real browser check: install `playwright-core` in a scratch folder, start `npx expo start --web --port <spare port>`, and point Chromium's `executablePath` at it. Kill the server afterwards.

**Verification:** `npx tsc --noEmit` clean, `npm run lint` 0 errors (7 warnings), **429 tests across 26 suites passing** (`npx jest --runInBand`).

## This session, part 1 (2026-10-09): POPIA + Digital Privacy translations

The user supplied native-language notes as `.docx` in `Zulu Notes/` and `Tsonga Notes/` (repo root), one file per source section. Text was extracted with a throwaway Python script (a `.docx` is a zip of XML) and copied in **verbatim** — every translated string was machine-checked to appear word for word in the notes (1,024 fragments, 0 mismatches). Nothing was translated or reworded by Claude.

**What each language now has** ("yes" = native-speaker notes, "AI" = translated by Claude; a topic with neither would show English, never a blank lesson):

| | POPIA (01) topics 1 / 2 / 3 | Digital Privacy (03) topics 1 / 2 |
|---|---|---|
| isiZulu (`zu`) | yes / yes / yes | yes / yes |
| Xitsonga (`ts`) | **AI** / yes / yes | yes / yes |
| Sepedi (`nso`) | yes (native) / **AI** / **AI** | **AI** / **AI** |

- **`Tsonga Notes/Section1_POPIA_Sepedi.docx` is Sepedi, not Xitsonga.** So Xitsonga has no native-speaker "What is POPIA?" topic (it is AI-translated — see part 2 above), and that file became Sepedi's only native-speaker topic. The user still needs to supply: Xitsonga Section 1.
- **Sepedi topics other than POPIA topic 1 are AI-translated, not native-speaker text.** The user said, on 2026-10-09: "For Isipedi just take the notes from the english one and translate them and then use them — avoid using direct translation, make use of context." Claude translated the app's English topics (not the full PDFs) for meaning, reusing the terminology of the native Sepedi Section 1 and the Sepedi Online Scams module. This is a one-off, user-authorised exception to `CLAUDE.md`'s "do not invent translations" rule — it does **not** extend to other content or languages. The AI text lives in its own files (`popia-topics-nso-ai.ts`, `digital-privacy-topics-nso-ai.ts`), each headed `AI-TRANSLATED`, so it can be found and replaced. **No Sepedi speaker has reviewed it.** It should be reviewed before it is used as study material or described as native-language content in the report. The app does not label it as AI-translated on screen (unlike the AI-generated practice drills) — raise that with the user if it matters for the study.
- That Sepedi file does not mark its correct quiz answers (the isiZulu and Xitsonga notes do). Its options are in the same A–D order as English, so it uses the English answer key.
- **One open question for the isiZulu translator:** a heading in `Isigaba3` had six letters typed in Cyrillic. They were transliterated letter for letter, giving "Ngeminingwane" — probably a typo for "Ngemininingwane". Left as transliterated; see the comment at the top of `digital-privacy-topics-zu.ts`.
- Translated topics mirror the English topics' section layout. Like the English, they leave out the source's "red flags in a bad privacy policy" list (Section 4) — the English never included it.

**Files:**
- New data: `src/data/popia-topics-{zu,ts,nso,nso-ai}.ts`, `src/data/digital-privacy-topics-{zu,ts,nso-ai}.ts`.
- `src/data/popia-topics.ts` / `digital-privacy-topics.ts` — new `*_TRANSLATED_CONTENT` / `*_TRANSLATED_QUIZZES` maps (deliberately `Partial`, keyed by language then topic number); getters now take an optional language and fall back **per topic** to English. `getDigitalPrivacyFinalAssessment(lang)` serves the exam in the student's language.
- `src/lib/topic-source.ts` — passes the language through for modules 01 and 03 (it used to ignore it).
- When native Sepedi notes arrive: put them in `popia-topics-nso.ts` / a new `digital-privacy-topics-nso.ts`, point the maps at them, and delete the matching topics from the `-nso-ai.ts` files. For Xitsonga Section 1, add topic 1 to `popia-topics-ts.ts`. Then update the coverage expectations in the two data test files.

**Verification:** `npx tsc --noEmit` clean, `npm run lint` 0 errors (7 warnings, all `import/first`-style in test files plus the old i18next one), **322 tests across 23 suites passing** at that point (429 after part 2) (`npx jest --runInBand`). No hands-on check in Expo Go or a browser — a human still needs to open POPIA and Digital Privacy in isiZulu, Xitsonga and Sepedi and check the long translated text reads and wraps well.

**Test-suite note:** run with `--runInBand` when judging pass/fail. A plain parallel `npx jest` on this machine intermittently times out the first test of several screen suites; the same suites pass when run serially.

## What exists right now

- `mobile-app/` — React Native + Expo Router app, all core screens built and working: Language, Home, Modules, Module detail, Lesson (scenario), Assessment, Result, Practice, Profile. See `README.md` for the full list and how to run it (`npx expo start`, Expo Go).
- Content (modules, quiz questions, drills, badges, the WhatsApp-scam scenario) was pulled from the team's original offline HTML design prototype, not invented — see `src/data/*`. That prototype file has since been deleted from the repo (still recoverable from git history) once it had served its purpose as the source of truth for content/screens.
- State: Zustand (`src/store/useAppStore.ts`), persisted to AsyncStorage — language, streak, module progress, badges. Also now holds a session-only (not persisted) `userId`, set from the Supabase auth session at launch.
- i18n: i18next, 4 locales (`en`, `zu`, `nso`, `ts`) in `src/i18n/locales/`.
- `CLAUDE.md`, `BUGS_AND_FIXES.md`, and this file were adapted/created from a template used on another project — the workflow/UX rules in `CLAUDE.md` are the standing policy for this repo going forward.
- **Test runner is set up.** `jest-expo` + `@testing-library/react-native`, configured in `mobile-app/package.json` (`"jest"` block) + `mobile-app/jest.setup.js`. Run with `npm test` from `mobile-app/`. **229 tests across 19 suites, all passing** as of the end of this session (97 → 175 after the Online Scams module work → 183 after the placeholder-data cleanup + video wiring → 227 after the AI message-checker feature → 229 after switching daily practice to AI-generated-by-default, below).

### This session: AI message checker + AI-generated SA practice drills (DeepSeek)

The user asked for the "Check a message" AI tutor (previously an honest "coming soon" placeholder — Bug #4) to be built for real, using DeepSeek's API, plus a second feature on the same Practice screen: AI-generated South African-context practice drills.

**Architecture decision, made explicitly by the user after being shown the tradeoff:** the DeepSeek API key is called **directly from the app** (`EXPO_PUBLIC_DEEPSEEK_API_KEY`), not proxied through a Supabase Edge Function. This means the key is compiled into the client JS bundle and is extractable by anyone who unpacks the built app — a real, accepted risk (mitigate by setting a spending/rate limit on the DeepSeek dashboard, not yet done as far as this session knows). Documented as a `WARNING` comment directly in `mobile-app/.env.example`.

**Near-miss, caught and fixed this session:** partway through, the user's real DeepSeek key ended up pasted into `mobile-app/.env.example` (the template meant to be committed to git) instead of `.env` (gitignored). It was never committed/pushed — caught via `git status`/`.gitignore` check before any `git add`. Fixed by restoring the placeholder in `.env.example`; the real key is correctly only in `.env`. **Worth double-checking `.env.example` has no real secret before the next commit**, in case this happens again.

- `src/lib/deepseek.ts` (new, tested — `src/lib/__tests__/deepseek.test.ts`, 24 tests) — two functions, both following the existing `sync.ts`/`auth.ts` convention of never throwing, always resolving to a tagged `{ ok: true, ... } | { ok: false, error: reason }` result:
  - `checkMessage(message)` — calls DeepSeek's `chat/completions` (model `deepseek-chat`, `response_format: json_object`), validated with **zod**. Returns both a structured verdict (`scam`/`legit`/`unsure` + confidence + red-flag list) and a freeform plain-language `explanation` — the user asked for "both" when given the choice. 1000-char input cap (`MESSAGE_CHECK_MAX_LENGTH`).
  - `generateSADrills(count)` — generates fresh South African-context practice drills (SARS/SASSA/bank impersonation, WhatsApp family-emergency scams, loadshedding phishing, etc.), same shape as the real `Drill` type in `drills.ts` so it reuses the same UI. Clamped to 1–5 drills (`DEFAULT_GENERATED_DRILL_COUNT = 3`). **Supplements** the 3 real, sourced drills — never replaces them, and is always labeled "AI-generated — not real reported scams" in the UI, consistent with this repo's content-fidelity rule.
  - Both share a `callDeepSeek()` helper with a 20s timeout (`AbortController`), mapping HTTP 401/403 → `invalid-key`, 429 → `rate-limited`, other non-OK/network/timeout → `network`, unparseable or schema-invalid model output → `invalid-response`, missing key → `missing-key` (checked at call time, not import time — missing the key degrades this optional feature gracefully instead of crashing the whole app the way a missing Supabase key would).
- `src/app/(tabs)/practice.tsx` — rewired the previously-disabled AI tutor input into a real feature (message checker, described above — unchanged by the follow-up below).
- **Testing gotcha worth remembering for next time:** this installed `@testing-library/react-native` version's `fireEvent` is `async` and its `act()` wrapper, when awaited, blocks on whatever async chain the pressed handler kicks off — so awaiting `fireEvent.press()` against a deliberately-never-resolving mock promise hangs the test for the full Jest timeout. Worse, firing two un-awaited `fireEvent.press()` calls as separate statements (even if later drained with `Promise.all`) left `IS_REACT_ACT_ENVIRONMENT`/act-scope state corrupted enough to break *other, unrelated* tests later in the same file (symptom: a previously-passing test starts failing with "unable to find element" on a plain `render()`, no code changes). Fix that worked: wrap multiple presses *and* the mock's resolution inside **one single** `await act(async () => { fireEvent.press(...); fireEvent.press(...); resolve(...); await promise; })` call, rather than firing presses outside of an explicit `act()` and draining them separately.

### Same day, follow-up: daily practice drills switched to AI-generated by default

Immediately after the above landed, the user asked for a product change: "the daily practice page shows some practice questions first, those questions must be generated by AI not pre-defined." This **superseded** the "supplement, don't replace" design from the section above — the standalone second "AI-generated SA practice" section described above no longer exists as a separate section; it was merged into the primary daily-practice slot.

**Decision the user made when asked:** if the very first AI generation attempt fails (offline, API down, rate-limited, or the model returns zero drills), fall back to the real, sourced `DRILLS` from `drills.ts` rather than show nothing or an error-only state — consistent with this repo's "never a blank screen" rule.

- `src/app/(tabs)/practice.tsx` — the top "Daily practice" section now:
  - Generates on **mount** automatically (a `useEffect`, no button press needed) — the function passed to the effect never calls `setState` synchronously itself (it only kicks off `generateSADrills().then(applyDailyResult)`), to satisfy the `react-hooks/set-state-in-effect` lint rule the same way `src/app/_layout.tsx`'s existing mount effect does.
  - Shows a simple skeleton (`DailySkeleton`, testID `daily-drills-skeleton`) only for the very first load; a `hasLoadedOnce` flag means later refreshes (success or failure) never show the skeleton again — they keep whatever's already on screen visible with a small inline spinner (testID `daily-drills-refreshing`) next to the "Get new examples" button instead (stale-while-revalidate).
  - **First load fails or returns zero drills** → falls back to the static `DRILLS`, answered via the existing Zustand `drillPicks`/`answerDrill` (same persistence as before this session), with a generic, non-technical note ("Couldn't generate new examples right now — showing saved examples instead.") and the same "Get new examples" button retries generation.
  - **A later refresh fails** (AI content was already showing) → the old AI drills stay on screen untouched, with a reason-specific inline error below the button (reusing the same `aiError*` i18n keys as the message checker) — it does *not* fall back to static, since the existing content is still good.
  - AI-generated drills use local, session-only answer state (`dailyPicks`, resets each successful generation) since the content itself changes each time — the static fallback still uses the persisted store state as before.
  - The "AI-generated — not real reported scams" label only shows when AI content is actually being displayed, never during the static fallback (which would be a dishonest claim).
- `__tests__/practice-screen.test.tsx` — rewritten: the old "supplement" describe block for drills is gone, replaced by a `daily practice drills (AI-generated, real-sourced fallback)` block (9 tests) covering auto-generation on mount, the skeleton, both fallback triggers (failure and empty), answering a fallback drill via the store, retry-to-AI-success, stale-while-revalidate during a refresh, refresh-failure-keeps-old-content, and the double-tap guard. The message-checker describe block is otherwise unchanged except its `beforeEach` now gives `generateSADrills` a harmless default resolved value, since mount always calls it regardless of which part of the screen a test cares about. 229 tests total now passing.
- **Bundle-sanity-check limitation learned this session:** fetching the Expo web entry bundle and grepping it for expected strings (done earlier this session as a stand-in for real verification) turned out to be an unreliable signal — Expo Router's web output code-splits per-route, so screen-specific strings/components may simply not appear in the main entry bundle at all, pass or fail, regardless of whether that screen actually compiles correctly. Don't trust that technique for route-specific verification again; `tsc --noEmit` + `lint` + the component test suite are the real signal in this environment, and an actual human pass in a browser/Expo Go is still the only way to confirm a screen renders correctly.
- **Also found and fixed this session:** a leftover Expo dev server process from earlier in the session was still listening on port 8081 despite an earlier `taskkill`, serving a stale bundle to a later verification attempt. Killed it properly this time (`netstat` → confirmed PID → `taskkill`) and confirmed the port is free. Worth double-checking `netstat -ano | findstr :8081` before trusting any "it compiles" check against a running dev server.
- **Supabase is now wired into the app**, using **anonymous auth** (no login screen — `supabase.auth.signInAnonymously()`), decided this session specifically to skip building real auth (email/password vs. magic link still undecided) while still giving Row Level Security a real `auth.uid()` to scope to. It upgrades cleanly to real auth later via `linkIdentity()`/`updateUser()` without a data migration, since rows are already keyed by the (stable) anon `auth.uid()`.
  - `src/lib/auth.ts` — `ensureAnonymousSession()`, called once from `src/app/_layout.tsx` on launch. Never throws: on any failure (offline, or anonymous sign-in not yet enabled on the project — see below) it logs and returns `null`, and the app carries on fully on local Zustand state.
  - `src/lib/sync.ts` — `upsertModuleProgress`, `awardBadge`, `recordQuizAttempt`, `pullRemoteState`, plus pure merge helpers `mergeModuleProgress`/`mergeBadgeIds` (take-the-max / union, so remote sync can never regress a student's local progress). Every function is a no-op-with-a-logged-error when there's no session or the network call fails — nothing here can block or crash the UI.
  - `src/app/_layout.tsx` — on launch: `ensureAnonymousSession()` → `setUserId` → `pullRemoteState()` → `hydrateRemoteState()` (merge into the store). Runs independently of the font-loading gate, so it never delays first paint, matching the "app keeps working with whatever it has" rule.
  - `src/store/useAppStore.ts` — `completeModule()` now also fires `upsertModuleProgress`/`awardBadge` in the background (fire-and-forget) when a `userId` is present.
  - `src/app/result/[id].tsx` — quiz scoring extracted into a pure, tested function (`src/lib/scoring.ts`), and now also calls `recordQuizAttempt()` on every attempt (pass or fail).
- **`mobile-app/supabase/migrations/0001_init_schema.sql`** — schema for `profiles`, `module_progress`, `badges_earned`, `quiz_attempts`, all with RLS scoped to `auth.uid() = user_id` (or `= id` for profiles), plus an `on_auth_user_created` trigger that auto-provisions a profile row. **Applied — confirmed 2026-09-30** via a REST probe (`GET /rest/v1/<table>` for all 4 tables, each returned `200 []` instead of the earlier `PGRST205 table not found`).
- `mobile-app/src/lib/supabase.ts` — the Supabase client singleton. **Fixed a real bug this session** (see `BUGS_AND_FIXES.md` #2): it used to crash Expo Router's web SSR render with `ReferenceError: window is not defined` the instant it was imported, because `persistSession: true` made the auth client eagerly read from browser storage on the Node-side render. Now `persistSession`/`autoRefreshToken` are only enabled when `typeof window !== 'undefined'`.
- **Also fixed:** `BUGS_AND_FIXES.md` #3 — the assessment screen was silently skipping per-question feedback for every question except the last (a real, pre-existing bug, found and fixed this session while verifying the above).
- **Lessons now have real per-lesson screens with video/audio player plumbing.** Read `MashambaVS__EloffJ.pdf` (the COS700 proposal) this session — it names "AI-assisted videos/audio content" as an explicit deliverable, confirming the team's own framing that current lesson content is a placeholder. Found in the process: every lesson row used to route to the exact same single screen (`/lesson/{moduleId}`, hardcoded to the module-02 WhatsApp scenario) regardless of which lesson was tapped — not a real per-lesson structure. Rebuilt as:
  - New route `src/app/lesson/[moduleId]/[lessonN].tsx` (replaces the old `src/app/lesson/[id].tsx`) — one real screen per lesson.
  - `src/data/lessons.ts` — `LessonDef` gained optional `videoUrl`/`audioUrl` (all still empty — no real files exist yet) and `hasScenario` (true only for module 02's real, sourced WhatsApp scenario — the only lesson with genuine content). Added `getLesson(moduleId, n)`.
  - `src/components/video-player.tsx` / `audio-player.tsx` — new, using `expo-video`/`expo-audio` (already installed). Both handle loading, human-readable error + retry, per `CLAUDE.md`'s loading/error UX rules. Rendering priority per lesson: real scenario > video > audio > an honest "Lesson content coming soon" empty state (never a blank screen, never invented text).
  - `src/lib/lesson-navigation.ts` — `getNextLessonRoute()`, pure and tested: advances to the next lesson, or to `/quiz/{moduleId}` after the last one. The last lesson's button now reads "Take the assessment" instead of "Next lesson."
  - Updated `module/[id].tsx` (each lesson row now links to its own lesson) and `_layout.tsx`'s route registration accordingly.
  - **`mobile-app/supabase/migrations/0002_lesson_media_storage.sql`** — creates a public-read `lesson-media` Storage bucket (writes intentionally left to the service_role key only, i.e. dashboard upload). **Not yet applied** — confirmed 2026-09-30 via `GET /storage/v1/bucket/lesson-media`, still `404 Bucket not found`.
  - Verified live: module → lesson 1 (empty state) → lesson 2 (real scenario, check-answer gating still works) → lesson 3 → jump to lesson 5 (last, shows "Take the assessment") → quiz → an out-of-range lesson number shows a graceful "Lesson not found," never a crash. 12 new component/unit tests for the two players, 8 for the lesson screen, 15 for the data/navigation logic — 97 tests total now passing.
  - **Proposal-vs-build scope note (superseded — see next section):** this note used to flag that the app had 5 invented modules vs. the proposal's real scope. That's now resolved — see below.

### Latest session: replaced the placeholder scam modules with the real, sourced "Online Scams" module

The user supplied the actual COS700 research content for an "Online Scams" module — first the English source (`ONLINE SCAMS MODULE ALL TOPICS.pdf`, repo root), then matching isiZulu/Sepedi/Xitsonga translations (`online scams/` folder, repo root). Real, verbatim, native-language-sourced content — not invented or machine-translated by Claude — covering 9 topics: Introduction, WhatsApp Scams, SMS Scams, Email Scams, How Scammers Manipulate Victims, Investigating a Suspicious Message, AI-Assisted Scam Investigation, Responding to an Online Scam, and a capstone (Apply and Test Your Knowledge).

Two scope decisions the user made explicitly before any code was written:
1. **This content replaces the old placeholder modules 02 (WhatsApp), 03 (SMS), 04 (Email)** from the note above — those were an earlier session's invented expansion, not sourced from the research proposal. Module count went 5 → 3: `01` POPIA (unchanged), `02` **Online Scams** (new, 9 lessons), `03` The Cybercrimes Act (renumbered from `05`, content unchanged).
2. **Every topic keeps its own 3-question "knowledge check"** (5 for the topic-9 capstone), matching the source's own Part A/Part B structure, rather than one flat end-of-module quiz. The capstone's knowledge check gates the `scam-spotter` badge.

**New data layer** (`src/data/online-scams-topics.ts`, tested in `src/data/__tests__/online-scams-topics.test.ts`, 56 tests):
- `TOPIC_CONTENT: Record<LanguageCode, TopicContent[]>` — all 9 topics × 4 languages: intro, section lists, the SA-context example message, one Part-A "activity." Only topics 5 and 8's activities are graded — the source only gave an explicit correct letter for those two ("Feedback: B.", "Feedback: C."); every other activity is shown as ungraded reflection content rather than guessing at an answer the source didn't explicitly mark. Deliberate call to respect `CLAUDE.md`'s "never fabricate quiz answers" rule.
- `TOPIC_QUIZZES` — the 9 real Part-B knowledge checks, verbatim, all 4 languages, tested to agree on correct-answer index across languages.
- `getCapstoneQuestions(lang)` — adapts the topic-9 quiz into the existing `Question[]` shape so the shared `scoreQuiz`/result-screen pipeline didn't need duplicating.

**New/changed screens:**
- `src/components/topic-lesson.tsx` (new, tested) — renders a topic's sections/example/activity/key-takeaway, including the graded-vs-ungraded distinction and the topic-9 capstone's different shape (4 scenarios + reflection prompts).
- `src/app/lesson/[moduleId]/[lessonN].tsx` — branches: module `02` renders `TopicLesson` + a single "Start knowledge check" button; modules `01`/`03` keep the pre-existing video/audio/"coming soon" flow unchanged. The old WhatsApp debit-order clue-picker scenario (`src/data/scenario.ts`, referenced in the note above) was deleted — fully superseded by the real sourced content, not kept as a secondary scenario.
- **New route** `src/app/quiz/[moduleId]/[lessonN].tsx` (tested, 7 tests) — the per-lesson knowledge check. Lessons 1–8 route to the next lesson on completion; lesson 9 (capstone) routes to `/result/02` instead, scored against `PASS_MARK`.
- `src/app/module/[id].tsx` — updated `MODULE_TAG`/`MODULE_INTRO` for the new 3-module lineup; hides the standalone "Take the assessment" CTA for module `02` only (its assessment is reached by progressing through lesson 9).
- `src/app/result/[id].tsx` — was hardcoded to WhatsApp-specific copy ("Scam Spotter — WhatsApp", "fake bank alerts on WhatsApp"); now module-driven/generic, and only shows the badge block when a real badge was actually just earned (previously implied every passing module earns a badge, which wasn't true for `01`/`03` even before this change).
- `src/app/(tabs)/home.tsx` — the "Continue learning" card was hardcoded to always point at module 02 lesson 2 (now-deleted content). Replaced with `src/lib/continue-lesson.ts` (new, tested, 4 tests) — a pure function that finds the first not-100%-complete module and its actual in-progress lesson from real `moduleProgress` state, with an honest "all modules complete" state when nothing is left.
- `src/data/badges.ts` — removed `phish-hunter`/`sms-shield` (tied to the retired modules).

**Verification done:** `npx tsc --noEmit` clean, `npm run lint` clean, full suite 175/175 passing. Also started `npx expo start --web` and fetched the actual JS bundle (not just the HTML shell) to confirm it compiles with no bundler errors — **no visual/interactive check was done**, since this environment has no browser/screenshot tool available. A human should click through the golden path (Home → Online Scams module → lesson 1 → knowledge check → ... → lesson 9 capstone → result/badge) plus modules 01/03 in Expo Go or a real browser.

### Same day, later: removed fake/placeholder demo data, wired in real uploaded videos

The user said "remove all the placeholder data, I want real data." Two different things were tangled up in that, and got handled differently:

- **POPIA (01) and Cybercrimes Act (03) lesson/quiz/drill content** — still sourced from the old HTML mockup, not real research content. The user explicitly chose **"leave as-is for now"** when asked (they'll supply real source material later, same as they did for Online Scams) — so this is untouched, deliberately, not an oversight.
- **Fake "already used" demo state and dishonest UI claims** — this *was* fixed, since none of it needed new content, just removing fabrication:
  - `src/store/useAppStore.ts` — default `streak: 12` → `0`, `moduleProgress: {'01':60,'02':40,'03':0}` → `{}`, `earnedBadgeIds: ['scam-spotter','popia-aware']` → `[]`. A real first-time student now starts at an honest zero, not pre-seeded progress.
  - `src/data/badges.ts` — the catalog's own `earned: true` on two badges was dead data (always overridden per-student at render time) but misleading; set to `false` for all, with a comment explaining why. Added `MODULE_BADGE_ID: Record<string, string>` — the single source of truth for which module's pass actually awards a badge (today: only `{'02': 'scam-spotter'}`). `src/app/result/[id].tsx` and `src/app/module/[id].tsx` both now read this instead of each having their own hardcoded `mod.id === '02'` check.
  - `src/app/(tabs)/home.tsx` / `profile.tsx` — hardcoded student name "Vhulenda Mashamba" / "u22554883 · BSc Computer Science" removed (no real auth profile exists to source a real name from yet). Profile's certificate card used to always show a fabricated "passed at 82%" regardless of actual state; now conditional on `earnedBadgeIds.includes('scam-spotter')`, with an honest empty state otherwise.
  - Fixed two flatly false UI claims: Practice screen's "three real messages reported by UP students" (they aren't — same mockup origin as everything else in `drills.ts`), and the module CTA's "Two attempts per day" (nothing in the code has ever enforced this).
  - **Bug #4 in `BUGS_AND_FIXES.md`:** the "Check a message" AI-tutor input/button (`practice.tsx`, referenced from `home.tsx`) had `onPress={() => {}}` — a real silent failure, found during this cleanup. No AI checker has actually been built yet. Fixed honestly: input `editable={false}`, button `disabled`, copy now says "coming soon" and points at the real, working daily drill instead of promising something that doesn't exist.
- **Real videos, supplied one at a time by the user, now wired in:**
  - A module-level `overviewVideoUrl?: string` field was added to `ModuleDef` (`src/data/modules.ts`) — for a single video covering an entire module (the first one the user gave was "the whole lesson explained for the Online Scams module"). Rendered on `module/[id].tsx` above the lesson list.
  - `TopicLesson` (`src/components/topic-lesson.tsx`) gained an optional `videoUrl` prop, rendered **just above the key takeaway card** (confirmed by an order-sensitive test using `toJSON()` + substring index comparison, not just presence) — this is where the user explicitly asked for it to sit. Works for both the normal topic layout and the topic-9 capstone layout.
  - `src/data/lessons.ts` — `ONLINE_SCAMS_VIDEO_URLS: Record<number, string>` maps topic number → real Supabase Storage public URL. Currently set: topic 2 (WhatsApp Scams), topic 3 (SMS Scams), topic 5 (How Scammers Manipulate Victims), topic 9 (capstone). Topics 1, 4, 6, 7, 8 have no video yet — just the real text content, same as before.
  - **Important scope note for next time:** video only renders for modules `01`/`03` via the old plumbing, or for module `02` via the path above. If more Online Scams videos come in, they go in `ONLINE_SCAMS_VIDEO_URLS` in `lessons.ts`, keyed by topic number (1-9) — not in `LESSON_SEEDS` video fields directly copy-pasted from the 01/03 pattern.
  - All Supabase Storage uploads confirmed working end-to-end (user uploaded via dashboard, got public URLs, sent them here) — `migrations/0002_lesson_media_storage.sql`'s `lesson-media` bucket is therefore now confirmed to exist and be public-read, even though this session never re-ran the direct REST probe to verify it explicitly (inferred from the URLs actually resolving/being usable).

**Verification done for this later part of the session:** `npx tsc --noEmit` clean, `npm run lint` clean (only the pre-existing unrelated i18next warning), full suite 183/183 passing. Again, **no visual/interactive check** — no browser tool available here. Whether the videos actually play correctly on device, and whether the "coming soon" states read well, still needs human eyes.

## Open items

**Needs the user (cannot be done from code):**
- **Merge the branch.** Everything is on `multilingual-app-and-new-modules`, pushed to GitHub. It was put on a branch rather than `main` deliberately, pending the user's say-so. Open a pull request or merge it.
- **Native-speaker review of all AI-translated text** before it is used with students or described as native-language content in the report. The list of files is in part 2 above. This includes sampling the AI-generated practice messages, whose quality in isiZulu, Sepedi and Xitsonga is unverified.
- **Decide what `CLAUDE.md` should say about translation.** It still says "do not invent translations", and its "Translation scope (current)" row describes the app as mostly English. Both are out of date after this session. It was left untouched because it is the user's standing policy.
- **Confirm one isiZulu heading with the translator:** "Ngeminingwane" in `digital-privacy-topics-zu.ts` is a letter-for-letter conversion of Cyrillic characters in the notes and is probably a typo for "Ngemininingwane".
- **Decide whether the source notes belong on GitHub.** The PDFs and Word files in `POPIA/`, `online scams/`, `Zulu Notes/` and `Tsonga Notes/` were committed. If the repository is public and they should not be, they need removing.
- **Check the app on a real phone** in each language (Expo Go). The only hands-on check so far was a desktop browser at phone size.
- **Enable "Allow Anonymous Sign-Ins"** in the Supabase dashboard (Authentication → Sign In / Providers). Last confirmed disabled on 2026-09-30, and the browser check on 2026-10-09 still showed the sign-in failing. Until then no progress, badges or quiz attempts reach the database.
- **Set a spending/rate limit on the DeepSeek key.** It ships inside the app, so anyone can extract it. Not known to have been done.
- **Free port 8081 if Expo misbehaves.** A `node.exe` (PID 41152 on 2026-10-09) was holding it without answering requests. Claude did not start it and left it alone.
- **More Online Scams videos.** Topics 1, 4, 6, 7 and 8 have none; POPIA and Digital Privacy have no video or audio at all. Upload to the `lesson-media` bucket and pass the public URL plus the topic number.

**Decisions not yet made:**
- **Real sign-in method** (email/password, university-domain-restricted, or magic link). Anonymous auth loses a student's progress if they reinstall.
- **POPIA lawful basis for Supabase.** It has no South African hosting region; this must be documented before real, identifiable student data is stored.
- **Whether a student's typed certificate name should ever leave the phone.** Today it does not. If certificates are later synced or made verifiable, the name becomes personal information held on Supabase and falls under the POPIA question above.
- **Whether the screenshot privacy note is enough**, or whether students should be made to crop before uploading (see the 2026-10-10 section).
- **Whether to label AI-translated lessons on screen.** AI-generated practice messages carry a label; AI-translated lessons do not.
- **Whether the DeepSeek calls should move behind a Supabase Edge Function** so the key is not in the app.

**Known rough edges in the app, noticed but not changed:**
- The Digital Privacy result screen lists the same topic name ten times under "Marks by topic", because that exam has no per-question topic.
- `src/app/quiz/[id].tsx` and `src/data/quiz.ts` (apart from `PASS_MARK`) are dead code: nothing links to that screen any more.
- No dark mode.

## Parked: the remaining badge ideas

Six badges are built (see the top section). Four ideas from the original list of ten have no artwork and were left out:

| Badge | How it would be earned | New tracking needed |
|---|---|---|
| Perfect Score | 100% on any final assessment | No (certificates already hold the score) |
| Sharp Eye | 10 daily practice messages judged correctly | A running count |
| Message Detective | First use of "Check a message" | A one-time flag |
| 30-Day Streak | 30 days in a row | No (the streak is now tracked) |

To add one: put its image in `mobile-app/assets/images/badges/`, add it to `BADGES` in `src/data/badges.ts`, add its rule to `PROGRESS_RULES` in `src/lib/badges.ts`, and add `badgeName_<id>` and `badgeHow_<id>` to all four language files. The tests fail if any of those is missing.

## Known bugs

See `BUGS_AND_FIXES.md` — 8 entries, all fixed:
1. Language switcher not changing displayed text (`setLanguage` never called `i18n.changeLanguage()`).
2. Supabase client crashed the web server-side render (`window is not defined`).
3. Assessment screen skipped per-question feedback for all but the last question.
4. "Check a message" button silently did nothing (the real feature was built afterwards).
5. Two test-only defects that left the suite red and the type check failing (2026-10-09).
6. Choosing a language only translated the lesson notes; most of the app stayed in English (2026-10-09).
7. Finishing lessons never moved a module's progress, so POPIA could never be completed; the streak never increased (2026-10-10).
8. Home showed "4 badges, 33% complete" to a student who had done nothing: demo values from the first build were still saved on the phone (2026-10-10).

## Next steps (pick up here in the new chat)

1. **Give the build its keys.** `.env` is not in git, so a cloud build has no Supabase or DeepSeek settings and would not work. From `mobile-app/`, for each of the three names in `.env`: `npx eas-cli@latest env:create --name <NAME> --value <value> --environment production --visibility sensitive`. Claude was not permitted to do this.
2. **Build:** `npx eas-cli@latest build --platform android --profile production`. Answer yes to generating a new Android keystore the first time.
3. **In the Play Console:** create the app with package `com.cyberawaresa.app`, complete the privacy policy URL, Data safety form and the foreground-service declaration, then upload the `.aab` to Internal testing (or set up a Google service account key and use `npx eas-cli@latest submit --platform android`).
4. Set a spending limit on the DeepSeek key before testers get the app: the key is inside it.
5. Get the pull request into `main` reviewed and merged.
6. Have the user try the app on a real phone: add a name in Profile and see it on Home, answer the three daily questions, turn the reminder on and wait for 18:00; finish a lesson and see the First Steps badge, pass a final assessment, download the certificate PDF and share it.
7. Replace AI-translated text with native-speaker text as it arrives (each `*-ai.ts` / `*.ai.json` file says what it holds).
8. Once anonymous sign-ins are enabled in Supabase, confirm progress, badges and quiz attempts land in the four tables.
9. Choose the real sign-in method and build it, migrating anonymous accounts with `linkIdentity()`; settle the POPIA lawful basis first.
10. Optional clean-up: delete the dead old quiz screen, and fix the repeated topic names on the Digital Privacy result screen.

## Repo/collaboration notes

- Remote: `github.com/phetho5/CybersecurityOnlineModules`. Default branch `main`; current work is on `multilingual-app-and-new-modules`.
- Last commit: `e56cab8` "Add sourced modules, AI practice features and full multilingual support" (109 files), pushed 2026-10-09. It is one large commit covering several sessions, because the changes were too intertwined to split.
- **The user does not want Claude listed as a contributor.** Commits carry no co-author line; the author is the user's own git identity (`smoke <vhulendamashamba4@gmail.com>`).
- `mobile-app/.env` holds the real Supabase and DeepSeek keys and is git-ignored; `.env.example` holds placeholders only. Check that is still true before every commit.
- The 2026-10-10 work (screenshot checker, certificate, badges, logo, daily questions, reminders, celebration, name, Play setup) is in a second commit on the branch, with a pull request into `main`. The `badges/` folder of original images (14 MB) is included.
- Team: Phetho Nemavhola (u26855896), Vhulenda Mashamba (u22554883), supervised by Professor Jan Eloff (University of Pretoria, COS700).
- **Working notes for the next session:** run tests with `npx jest --runInBand` (a parallel run times out some screen suites on this machine). In the Bash tool, long here-documents containing apostrophes failed to parse; writing a small script file and running it worked reliably.
