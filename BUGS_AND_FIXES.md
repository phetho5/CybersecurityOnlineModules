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

