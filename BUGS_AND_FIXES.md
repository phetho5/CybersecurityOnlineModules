# Bugs and Fixes

Log every bug here when found, and record the fix in the same entry once resolved. Check this file before fixing a new bug so a previously-fixed one doesn't get silently reintroduced.

---

## 1. Language picker didn't change any UI text

**Found:** 2026-09-26, reported by user testing on device — "It works but only in English. The app must work in other languages also."

**Root cause:** The Language screen and Profile screen's language switcher called `useAppStore`'s `setLanguage(code)`, which only updated the Zustand store's `language` field. Nothing ever called `i18n.changeLanguage()`, so `react-i18next`'s `useTranslation()` hook kept resolving every `t('...')` string against i18next's default language (`en`, set at init in `src/i18n/index.ts`), regardless of what the user picked.

**Fix:** `mobile-app/src/store/useAppStore.ts` — `setLanguage` now calls `i18n.changeLanguage(lang)` as a side effect after updating state. Added an `onRehydrateStorage` hook on the persist middleware so that a previously-picked language (restored from AsyncStorage on app restart) is re-applied to i18next on load, not just remembered in the store.

**Related gap fixed at the same time:** the lesson scenario's title/intro (`SCENARIO.title` / `.intro`) had been hardcoded to English only, even though the original design prototype had isiZulu/Sepedi/Xitsonga versions of that text. Restructured `mobile-app/src/data/scenario.ts` to key `title`/`intro`/`lesson` by language (`getScenarioText(lang)`), sourced from the prototype's original translations.

---

## 2. Supabase auth client crashed the web dev server on any route (SSR)

**Found:** 2026-09-29, while doing the hands-on UI check (Workflow Rule 6) for the Supabase-wiring session — `npx expo start --web` accepted the initial request, then the whole Node process crashed with `ReferenceError: window is not defined` and stopped listening, so every subsequent request got "connection refused."

**Root cause:** `mobile-app/src/lib/supabase.ts` calls `createClient(..., { auth: { persistSession: true, ... } })`. Supabase's `GoTrueClient` self-initializes on construction (fire-and-forget), and with `persistSession: true` it immediately reads from `storage` (AsyncStorage's web implementation, which is backed by `window.localStorage`). Expo Router's web output does one server-side render on Node (no `window`/`localStorage`) before the client hydrates in the browser. `supabase.ts` had existed since a prior session but was never actually imported anywhere until this session wired `src/lib/auth.ts`/`src/lib/sync.ts` into `src/app/_layout.tsx` — so the bug was latent and only surfaced once the module was first reachable from a rendered screen.

**Fix:** `mobile-app/src/lib/supabase.ts` — extracted `getSupabaseAuthOptions(isBrowser: boolean)` and only enables `persistSession`/`autoRefreshToken` when `typeof window !== 'undefined'`. On the web SSR pass there's no window (and no user) to persist a session for anyway; on native and in the browser, `window` is defined and behavior is unchanged. Covered by `src/lib/__tests__/supabase.test.ts`. Verified by re-running `npx expo start --web`: the dev server now serves every route without crashing (confirmed via curl and a full Playwright click-through of language -> home -> module -> quiz -> result).

---

## 3. Quiz assessment never shows per-question feedback (except the last question)

**Found:** 2026-09-29, during the same Playwright-driven UI check, while confirming the (unrelated) quiz-scoring refactor still worked end-to-end. Reproduced with a single, deliberate click on one answer option — not a double-tap or automation artifact.

**Symptom:** Tapping any answer on question 1 or 2 of the 3-question assessment (`mobile-app/src/app/quiz/[id].tsx`) instantly jumped to the next question. The "Correct/Not quite" feedback panel and the explanation text (`question.explain` — the actual educational content of the assessment) never appeared, and there was no "Next question" button to press. Only the last question behaved as designed: it showed feedback and required an explicit tap ("See my result") to continue.

**Root cause:** `quiz/[id].tsx` derived the currently-displayed question index from the count of answered questions instead of tracking it as its own state:
```ts
const answeredCount = Object.keys(answers).length;
const qi = Math.min(answeredCount < QUESTIONS.length ? answeredCount : QUESTIONS.length - 1, QUESTIONS.length - 1);
```
The moment `answerQuestion(qi, i)` recorded an answer, `answeredCount` incremented and `qi` recomputed to the *next* question in the same render — before the feedback block (gated on `answers[qi] !== undefined`) could ever render for the question just answered, since `answers[newQi]` was undefined again. Only the final question was spared, because `qi` was clamped to `QUESTIONS.length - 1` and couldn't advance past it, so the feedback panel and its button got a chance to render there.

**Fix:** `mobile-app/src/app/quiz/[id].tsx` — the displayed question index is now its own `useState`, advanced only inside `next()` (the explicit "Next question"/"See my result" tap), fully decoupled from `quizAnswers`. Covered by `mobile-app/__tests__/quiz-screen.test.tsx` (6 tests: feedback shown for a correct answer, feedback shown for a wrong answer, no silent advance before the explicit tap, double-tap guard, and the full 3-question walkthrough navigating to `/result/:id` only after the last question). Verified live via a Playwright-driven click-through of the full assessment (both a 100%-pass and a 0%-fail run).

---

## 4. "Check a message" AI tutor button silently did nothing when tapped

**Found:** 2026-09-30, while removing fake seed/demo data from the app at the user's request ("remove all the placeholder data, I want real data") and auditing for anything else dishonest or non-functional in the process.

**Symptom:** Both `mobile-app/src/app/(tabs)/practice.tsx` (the "Check a message" input + button) and, by extension, the "Check message" CTA on Home promised AI-assisted message checking ("Paste any suspicious SMS, WhatsApp or email and the tutor explains the red flags in your language") but the button's `onPress` was `() => {}` — a real silent failure per `CLAUDE.md`'s UX rule ("the worst error is a silent failure"). No AI-assisted checker has actually been built yet (it's described as planned functionality in the Online Scams module's Topic 7, "AI-Assisted Scam Investigation," not something shipped).

**Fix:** Not a root-cause code bug (there was no logic to fix — the feature genuinely doesn't exist yet), so the fix is UX honesty rather than a behavior change: the input is now `editable={false}`, the button is `disabled`, and both the practice screen and the Home card now say plainly that message checking isn't live yet, pointing at the real, working daily drill instead. No test added — this is a static disabled-state change, not business logic. Building the real AI-assisted checker is tracked as a future feature, not a bug fix.

---

## 5. Two test-only defects left the suite red and the type check failing

**Found:** 2026-10-09, when running the full suite and `npx tsc --noEmit` after adding the POPIA / Digital Privacy translations. Neither is in code that session touched, and neither is an app bug: the app behaved correctly in both cases.

**Symptom A:** `__tests__/result-screen.test.tsx` — "retakes the failed assessment at the capstone lesson's own quiz route" failed with `Found multiple elements with text: /retake/i`.

**Root cause A:** the failed-result screen shows the word twice by design: the body copy ("…then retake the assessment.") and the button ("Retake the assessment"). The test's loose `/retake/i` query matched both.

**Fix A:** the test now finds the button by its exact label, `'Retake the assessment'`. No app change.

**Symptom B:** `npx tsc --noEmit` reported 8 `'topic.activity' is possibly 'undefined'` errors in `src/data/__tests__/online-scams-topics.test.ts`.

**Root cause B:** `TopicContent.activity` became optional in `src/data/topic-types.ts` (POPIA topic 1 has no activity in its source), but this older test still read `topic.activity.prompt` and similar directly.

**Fix B:** those reads now use optional chaining (`topic.activity?.…`). The assertions are unchanged, so a missing activity on an Online Scams topic still fails the test.

---

## 6. Choosing a language only translated the lesson notes — most of the app stayed in English

**Found:** 2026-10-09, reported by the user: "if I choose Pedi only the notes will be in Pedi and not the whole app."

**Symptom:** With isiZulu, Sepedi or Xitsonga selected, the lesson notes changed language but most buttons, headings, module and badge names, the bottom tab bar, error messages and the AI features stayed in English. Separately, the AI tutor card on Home showed the raw code name `aiTutorComingSoonBody` in place of a sentence, in every language including English.

**Root cause:** five independent gaps, not one.
1. **Incomplete language files.** Of 75 interface strings, each translated file had only 28 really translated: 33 keys were missing entirely (silently falling back to English) and 14 held an English copy of the text.
2. **Text typed straight into screens.** About 30 strings bypassed the language system altogether: the tab bar titles, "Key takeaway", "Example", "Reflection", "Marks by topic", "Badge on pass", "Done"/"In progress", "Selected"/"Switch", the certificate card, the result explanations and the audio/video error messages.
3. **Names read from English-only data.** Module names, tags and descriptions, badge names, and the lesson names on Home and in the module list came from English data, even where a translated lesson title already existed.
4. **AI features never told the language.** `checkMessage` and `generateSADrills` sent a fixed English prompt, so explanations and practice messages always came back in English. The three saved fallback examples were English-only.
5. **A key that was never defined.** `home.tsx` asked for `aiTutorComingSoonBody`, which no language file contained, so the library printed the key name.

**Fix:**
- `src/i18n/locales/` — `en.json` extended to 114 keys. The English placeholders were removed from `zu.json`/`nso.json`/`ts.json`, and the missing text now lives in new `zu.ai.json`/`nso.ai.json`/`ts.ai.json` files (86 keys each), merged underneath the originals in `src/i18n/index.ts`. **These are AI-translated, not native-speaker text** — see `HANDOFF.md`.
- Every screen and component now reads its text through the language system; module, tag, description and badge names are looked up by id.
- `getLessons`/`getLesson`/`getLessonProgress` and `getContinueLesson` take the language and reuse the translated lesson titles.
- `checkMessage(message, lang)` and `generateSADrills(count, lang)` instruct the model to reply in the student's language while keeping the machine-read values in English. The practice screen passes the language, re-requests when it changes, and ignores a stale reply in the old language. `getDrills(lang)` serves translated saved examples.
- `aiTutorComingSoonBody` replaced by a defined `aiTutorBody`.
- Also corrected while translating: the failed-result headline said "one more attempt today", but nothing limits attempts. It now reads "Not passed — you can try again".

**Tests:** `src/i18n/__tests__/locales.test.ts` (every language complete, no English left in a translated file, fill-in slots preserved, every key a screen asks for is defined, and a scan that fails if English is typed straight into a screen again), `__tests__/app-language.test.tsx` (real screens rendered in each language), plus additions to the lessons, continue-lesson, drills, deepseek and practice-screen tests. Verified hands-on in a browser in all three languages.

---

## 7. Finishing lessons never moved a module's progress, so POPIA could never be completed

**Found:** 2026-10-10, while building the six badges (not reported by a user).

**Symptom:** A student could finish every lesson and knowledge check and still see 0% on the module, 0% "Complete" on Home, and "Continue learning" pointing at lesson 1. POPIA (01) could never reach 100% at all, so Home's "You've completed every module" message was unreachable. Separately, the day streak always showed 0 and the 30-Day Streak badge could not be earned.

**Root cause:** the only code that ever wrote module progress was `completeModule`, called from the Result screen after a passed final assessment. Nothing recorded a finished lesson, and POPIA has no final assessment. Nothing ever increased `streak` either.

**Fix:**
- `completeLesson(moduleId, lessonN)` in `src/store/useAppStore.ts`, called by the knowledge-check screen (`src/app/quiz/[moduleId]/[lessonN].tsx`) when the student taps "Continue" after the last question. Progress only moves forward. The last lesson of a module with a final assessment (02, 03) records nothing: only passing completes those. The percentage comes from `lessonProgressPct` in `src/lib/badges.ts`, rounded up so the lesson list counts exactly that many lessons as done.
- Real streak tracking: `src/lib/streak.ts` (`nextStreak`) plus `lastActiveDate` in the store. Today is counted when the saved state loads and again whenever a lesson or module is completed.
- The unearnable 30-Day Streak badge was replaced by a 7-Day Streak badge, and a test (`every badge in the catalogue can actually be earned`) now fails if a badge with no way to earn it is added.

**Tests:** `src/lib/__tests__/badges.test.ts`, `src/lib/__tests__/streak.test.ts`, the `completeLesson` / `recordActivity` / "what is saved on the phone" blocks in `src/store/__tests__/useAppStore.test.ts`, and "recording that the lesson is finished" in `__tests__/topic-quiz-screen.test.tsx`. Verified hands-on in a browser: finishing POPIA lesson 1 moved the module to 34% and Home to lesson 2.


---

## 8. Home showed "4 badges, 33% complete" to a student who had done nothing

**Found:** 2026-10-10, reported by the user: "The app has dummy milestones, for example it says I have 4 badges and I'm 33% complete."

**Symptom:** on a phone that had run an early build, Home showed 4 badges and 33% complete, and "Continue learning" pointed part-way into Online Scams, although no lesson had been finished. A fresh install showed correct zeros.

**Root cause:** the very first build of the app started every student with demo values: 60% on module 01, 40% on module 02, two badges (`scam-spotter`, `popia-aware`) and a 12-day streak. Those values were written to the phone's saved state. The 2026-09-30 clean-up removed them from the code's defaults but not from phones that had already saved them, and the save is kept across updates. (60 + 40 + 0) / 3 modules is the 33%. The 2026-10-10 badge update then read that saved state and awarded two more badges on top: First Steps (progress above zero) and 7-Day Streak (the demo streak of 12). That makes the four.

**Fix:**
- `src/lib/saved-state.ts` — `removeUnearnedProgress` keeps only what a student can actually have earned: a module percentage that finishing lessons or passing the final assessment can produce (60 and 40 cannot be), an assessment badge only if its module is at 100%, the other badges only if the cleaned-up progress earns them, and a streak only if it was counted from a real day.
- `src/store/useAppStore.ts` — the saved state now has a version number (1). A save from before it is passed through `removeUnearnedProgress` once, when the app first opens after the update. Real progress, badges, the certificate name and certificates are kept. The streak restarts at 0 for everyone, because it now counts finished daily practice instead of days the app was opened.
- Home works out "Complete" with `overallProgressPct` (`src/lib/badges.ts`), which ignores a damaged value instead of showing a broken number.

**What cannot be recovered:** if a student with the demo 60% had really finished POPIA lesson 1 (34%), the app kept the larger demo number, so that one lesson's progress is gone with it. Finishing lesson 2 or more was recorded properly and is kept.

**Tests:** `src/lib/__tests__/saved-state.test.ts`, the "what is saved on the phone" block in `src/store/__tests__/useAppStore.test.ts` (both demo cases failed against the old code before the fix), and `__tests__/home-screen.test.tsx`. Verified in a browser by loading the exact saved state from the report: Home showed 0 day streak, 0 badges, 0% complete.
