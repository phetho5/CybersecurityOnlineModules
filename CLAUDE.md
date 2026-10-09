# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# CyberAware SA — Claude Code Context

COS700 research project (University of Pretoria): South African-context, multilingual cybersecurity awareness modules for students. See `README.md` for the full project overview and `MashambaVS__EloffJ.pdf` for the research proposal.

## Workflow Rules (always follow, every session)

1. **Tests before code — always, no exceptions.** This is a hard software-engineering rule, not a features-only guideline: every code change — a new feature, a bug fix, a refactor, anything — starts with the test(s), never the implementation. Write the test(s) first, covering the full range of edge cases and failure scenarios, not just the happy path: invalid/missing input, boundary values, empty/null states, out-of-order UI actions (e.g. double-tapping an answer before state updates), and situations where something downstream (Supabase, a future API call) fails outright. Only once the tests exist should the implementation be written, against those tests, until they pass. Never write implementation code first and backfill tests afterward — for anything.
   - **Current gap:** `mobile-app/` has no test runner configured yet (no Jest/RNTL). Setting up `jest-expo` + `@testing-library/react-native` is a prerequisite for the next piece of logic added — don't skip it because "it's just a small change."
2. **Bugs: investigate before fixing.** When told about a bug, do not rush to patch it. First investigate and find the actual root cause. Then, per rule 1, write a test that reproduces the bug — it should fail against the current, buggy code — before writing the fix. The fix must be the correct, permanent fix that makes that test (and its surrounding edge cases) pass, not a workaround or a fix that only masks the symptom.
3. **New features: plan first, then follow rule 1.** When asked for a new feature (including while brainstorming/scoping one), do not jump straight into code. First lay out the plan — approach, files/areas touched, tradeoffs — and get alignment. Then write the tests (rule 1) before any implementation code. Once the feature is complete, give the user a list of every test written for it — what each one verifies, including the edge/failure cases, and how the system actually responds in that scenario (not just a pass/fail count).
4. **Run the tests before calling any work done.** After implementing against the tests, run them — and the broader suite when touching shared code — to confirm they pass and nothing else broke. Until a test runner exists, the minimum bar is `npx tsc --noEmit` and `npm run lint` passing clean, plus the manual check in rule 6.
5. **All logic/functionality needs tests.** Every piece of business/domain logic — quiz scoring, pass/fail thresholds, badge issuance, language switching, progress persistence — must have unit tests, written first per rule 1 — never as a follow-up.
6. **Verify UI changes actually work.** Any change touching `mobile-app/src/app` or `mobile-app/src/components` must be checked hands-on before it's called done — run `npx expo start` (from `mobile-app/`) and exercise the changed screen/flow in Expo Go on a real device, or `npx expo start --web` for a quick check, not just type-check or lint it. Check the golden path and edge cases (empty states, long/overflowing translated text, error states), and watch for regressions in nearby screens, not just the one that changed.
7. **Log every bug in `BUGS_AND_FIXES.md`** (repo root). When a bug is found, add an entry; when it's fixed, record the fix in that same entry. Before fixing a new bug, check this file so a previously-fixed bug doesn't get silently reintroduced. (The i18n "language picker doesn't change any text" bug is a good first entry to backfill — root cause was `setLanguage` never calling `i18n.changeLanguage()`.)
8. **Update `HANDOFF.md` every 10-15 messages, and remind the user to start a new chat.** Proactively keep it current so a new chat can pick up the work without re-deriving context or hallucinating state — don't wait to be asked. Once it's updated, tell the user it's a good point to start a fresh chat so the next session isn't dragging a bloated context window.
9. **Hard-to-pin-down bugs: add logging to trace the real execution path before guessing at a fix.** When a bug's root cause isn't obvious from reading the code alone (e.g. something that appears to hang, fails silently, or only reproduces intermittently), add temporary diagnostic logging at the suspected points of failure and have the user reproduce it, rather than proposing fixes on speculation. Use what comes back to narrow down the actual cause before changing behavior. Keep the logging afterward if it has ongoing diagnostic value; strip it out if it was purely one-off scaffolding.
10. **Kill any dev server you started once you're done with it.** If you start `npx expo start` (Metro/dev server, port 8081 by default) to verify a fix or feature, stop that process before ending the turn/session — find the PID holding the port (e.g. `netstat -ano | findstr :8081` on Windows) and kill it, don't leave it running in the background. A stale process left holding the port makes the user's next `npx expo start` fail or behave unpredictably. Exception: if the user explicitly asks you to leave it running (e.g. for their own manual testing), say so back to them and leave it — don't kill it in that case.

## UX Rules (applies to all UI in `mobile-app/`)

**UI is what the app looks like; UX is how it behaves.** Good UI (colors, buttons, layout) attracts people; good UX keeps them. This app is aimed at students who may be encountering both the app and the security concepts for the first time — friction here doesn't just lose a user, it undermines the study's own findings about engagement.

- **Every action must have a visible, predictable result.** A quiz option, a "check my answer" button, a language switch that does nothing visible makes users retry, get confused, blame themselves, and leave. If something fails, the user finds out gracefully — never silently.
- **Never build only the happy path.** Deliberately build for the student who takes the wrong path: answers a question wrong, has zero badges, loses connectivity mid-lesson, picks a language with untranslated content.
- **Users should be able to figure out what to do without instructions.** If a flow needs explaining, the flow is the problem.

### Loading states

**Every screen has four states, and all four must be designed and built: Loading, Success, Error, and Empty.** Don't ship a screen that only handles the success case — users hit the other three constantly, and a missing state reads as a broken app. This matters more once Supabase is wired up (module content, progress, and badges will actually need to load over the network instead of coming from local data files).

A good loader is invisible in the sense that users don't consciously notice it — but when it's *missing*, they notice immediately and assume something is broken.

Match the loading feedback to how long the wait actually is:

| Expected wait | What to show |
|---|---|
| < 1 second | Nothing — just show the result. A spinner that flashes for a split second makes the app feel *slower* and glitchy. |
| 1–5 seconds | A plain spinner (no text) is fine. |
| 5–10 seconds | Spinner + text. Static text ("Loading…", "Saving…") buys a little patience; **changing** text buys significantly more, because it feels like progress is happening. |
| > 10 seconds | Looped animations stop working and start actively frustrating users — switch to a progress bar, step-by-step indicator, or similar determinate feedback. |

- Never show a blank screen with no feedback — users abandon within 2–3 seconds.
- On failure, surface the error immediately. Never leave the user staring at a spinner only to then say "sorry, that didn't work."

Pick the loading pattern by what kind of thing is loading:

| Pattern | When to use it |
|---|---|
| Skeleton screen | A whole screen or section is loading (module list, badge grid). |
| Progress bar | Duration/progress is knowable (a video/audio lesson buffering). |
| Inline spinner | Small, contained actions — answering a quiz question, submitting a drill answer. |
| Optimistic UI | Low-risk actions (toggling a language, marking a lesson read): apply immediately, sync in the background, roll back with a notice if it fails. |

### Graceful degradation (sections load and fail independently)

Once Supabase is integrated, a screen like Home will pull from multiple sources at different speeds (profile/streak, module progress, badges). **The app keeps working with whatever it has.**

- **Show what's ready as it becomes ready.** Don't gate the whole Home screen behind one loading state that waits for badges, progress, and streak all at once.
- **Each section owns its own data, its own loading state, and its own errors.** If badge sync fails, the badges section shows its own retry — the rest of Home stays usable.
- **Serve cached/stale content while fresh content loads.** A student who's used the app before should see their last-known streak/progress instantly (from local Zustand/AsyncStorage state), then have it refresh from Supabase in the background — never a blank screen for a returning user.
- **Plan for partial failure from the start.** Decide up front what Home looks like when, say, badges load but progress doesn't.

### Success states

When a student passes an assessment, earns a badge, or completes a module, they must *know* it worked — this is core to the app's motivational design (per the research proposal's gamification rationale).

- **Scale the confirmation to the significance of the action.** Passing an assessment and earning a badge (a real milestone) can justify a fuller moment (the Result screen's badge-issued state); toggling a language or marking a drill answer needs only a quiet, immediate visual change.
- **Most confirmations should be small, intuitive signals** — the visible state change is often enough (an option turning green, a lesson dot filling in).
- Pick by weight: badge/certificate issuance needs an explicit confirmation; low-stakes actions need only the state change itself to be visible.

### Error states

A good error message does three things: **what happened, why it happened, and what to do next.** E.g. not "Something went wrong" after a failed quiz submission, but "Couldn't save your result — check your connection and try again."

- **Never dump raw Supabase/network errors on screen.** Log the technical detail (console/remote logging); show the student a human message.
- **The worst error is a silent failure** — a tapped answer or button that does nothing and leaves the student unsure if it registered. Every failure path must produce visible feedback.

**Error placement — choose by severity and proximity.**

| Placement | When to use it |
|---|---|
| Inline (right next to the source) | The default. E.g. a failed drill/quiz answer submission — show the retry right next to that question, not on a separate screen. |
| Toast | Only for messages the student can safely miss (e.g. "Progress saved" confirmation, "Reconnecting…"). Never for something important like a failed assessment submission. |
| Modal | Sparingly — only when the student cannot continue without addressing it (e.g. no network at all when trying to load a module for the first time). Always give a way forward (Retry / Continue offline), never a dead end. |

### Empty states

- **Never leave a blank screen or a bare "no items" message.** A student with zero badges should see what badges exist and how to earn the first one, not an empty grid. A student with no completed modules on Home should be pointed at where to start.
- **When empty is the goal, celebrate it.** All modules completed, all badges earned — that's a real achievement for this app; treat it as one, not the same void as "no data yet."

### Forms

Relevant once Supabase auth (sign-up/login) and the AI message-checker input are built:

1. **Disable submit until valid, but say why** (e.g. "Enter a valid student email").
2. **Validate inline, on blur** — don't make the student submit to discover an email typo.
3. **Show character counts** on any length-limited field (e.g. the message-checker input, if capped).
4. **Prefill what's already known** once auth exists (don't re-ask for a name already on the Profile screen).

## Dev Commands

All commands run from `mobile-app/` unless noted.

| Task | Command |
|------|---------|
| Start dev server | `npx expo start` |
| Run on Android emulator | `npx expo start --android` |
| Run on iOS simulator | `npx expo start --ios` |
| Web preview | `npx expo start --web` |
| Type check | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Tests | *(not yet configured — see Workflow Rule 1)* |

## Project Rules (Source of Truth)

| Item | Rule |
|------|------|
| Pass mark | 70% correct required to pass an assessment and issue a badge — `PASS_MARK` in `mobile-app/src/data/quiz.ts` |
| Supported languages | English (`en`), isiZulu (`zu`), Sepedi (`nso`), Xitsonga (`ts`) — see `mobile-app/src/i18n/` |
| Translation scope (current) | Only UI chrome (buttons/labels) and the lesson scenario's title/intro are translated. Module/lesson titles, quiz questions, and daily-drill messages are still English-only. **Do not invent translations for these** — that content belongs to the project's own "Multilingual Content Development" phase and needs a native-speaker source, not a guess. |
| Content fidelity | Never fabricate educational or legal content (scam examples, POPIA specifics, quiz answers, statistics) for `mobile-app/src/data/*`. This is an academic research artefact — pull from `MashambaVS__EloffJ.pdf` or ask the researchers; inaccurate content undermines the study. |
| Backend status | Supabase is the chosen backend but is **not yet integrated** — the app currently runs entirely on local Zustand state persisted to AsyncStorage. No network calls, no auth exist yet. |
| POPIA & data residency | Supabase has no South Africa hosting region. Before wiring up real student data (auth, progress) to Supabase, this needs a documented lawful basis under POPIA — flag it, don't silently ship it. |

## Architecture

| Workspace | Stack | Purpose |
|-----------|-------|---------|
| `mobile-app/` | React Native, Expo Router, Zustand, i18next, React Native Paper, (planned) Supabase | The entire student-facing app — all screens live here |
| repo root | — | Research proposal PDF, README, project-level docs (this file, `BUGS_AND_FIXES.md`, `HANDOFF.md`) |

- No separate server/admin workspace exists (unlike a typical full-stack split) — Supabase, once integrated, is used directly from the mobile app (auth, module/progress storage, realtime), not behind a custom API.
- State: `mobile-app/src/store/useAppStore.ts` (Zustand), persisted to AsyncStorage — language, streak, module progress, earned badges. In-progress quiz/lesson state (answers, picked clues) is session-only and resets each visit.
- i18n: i18next + react-i18next, locale JSON files in `mobile-app/src/i18n/locales/`. Switching language must call `i18n.changeLanguage()` — this was previously a bug (`setLanguage` updated the store but never told i18next), fixed by having the store's `setLanguage` action call it directly, plus an `onRehydrateStorage` hook so a persisted language re-applies on app restart.
- Design tokens (colors, fonts) in `mobile-app/src/constants/theme.ts`, ported from the project's original offline HTML design prototype — accent `#ec3013`, Archivo typeface. That prototype file has been removed from the repo (still in git history) — don't reintroduce it; `theme.ts` is now the source of truth for styling.

## Build Phases (from the COS700 research proposal's Planning section)

| Phase | Window | Done when |
|-------|--------|-----------|
| Research Planning & Proposal Refinement | 28 Mar – 27 May 2026 | Scope, problem statement, deliverables finalised |
| Analysis of Existing Modules | 16 – 23 May 2026 | Existing platforms reviewed for gaps |
| Literature Review (PRISMA) | 28 May – 15 Jul 2026 | SLR complete, gaps identified |
| Module Planning & Design | 16 – 30 Jul 2026 | Module structure, learning outcomes, topics defined |
| Development of Learning Content | 31 Jul – 7 Aug 2026 | Explanations, scenarios, quizzes, scam examples, AI-assisted videos drafted |
| Multilingual Content Development | 8 – 16 Aug 2026 | isiZulu/Sepedi/Xitsonga content adapted |
| Prototype Development | 17 Aug – 17 Sep 2026 | Modules implemented on the app with interactive features and assessments |
| Testing & Evaluation | 18 Sep – 1 Oct 2026 | Modules evaluated with real students |
| Data Analysis & Module Improvement | 2 – 23 Oct 2026 | Feedback analysed, modules improved |
| Final Presentation | 29 Oct 2026 | — |
| Final Report Submission | 31 Oct 2026 | — |

**Actual status vs. plan:** the mobile app's UI (all core screens) is already built, which is ahead of the calendar Prototype Development window — that's fine, but it means Supabase integration and full multilingual content are the real outstanding blockers, not "time hasn't come yet." Keep `README.md`'s Status checklist in sync with reality.

## Team / Identifiers

- Students: Phetho Nemavhola (u26855896), Vhulenda Mashamba (u22554883)
- Supervisor: Professor Jan Eloff
- Institution: University of Pretoria — COS700
- Repo: `github.com/phetho5/CybersecurityOnlineModules`
