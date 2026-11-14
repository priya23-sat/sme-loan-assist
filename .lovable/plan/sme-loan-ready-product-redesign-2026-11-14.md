# SME Loan Ready product redesign

## Existing app and constraints
- TanStack Start serves file-based React routes with a shared `Shell` and separate `AppStateProvider` / `ReadinessProvider` contexts.
- The readiness flow (`/profile`, `/checklist`, `/tracker`, `/report`) builds a personalized transport-business checklist in `src/lib/readiness.ts`; readiness progress is saved in browser local storage.
- The separate copilot demo (`/documents`, `/assistant`, `/evaluation`) uses local demo state and a fixed knowledge base. There are no connected backend APIs, authentication, or translation files. The root already wires both providers.
- The requested design expands business categories beyond transport and requires English/Marathi in the new readiness experience. Keep all records fictional/local, preserve the existing checklist/report flow and copilot routes, and keep safety notices.

## Build
1. Add shared English/Marathi copy and language state with a visible toggle, then update the app shell to present simple readiness navigation and hide Assistant/Evaluation from primary navigation without deleting those pages.
2. Refresh the home page with the supplied headline, explanation, demo-mode framing, readiness CTA, and a separate Business Finance link.
3. Update profile inputs to the requested business categories, business-age ranges, and loan purposes. Adapt the existing checklist rules for the expanded SME categories while retaining their relevant transport-specific items and conditional logic; avoid asking for personal identifiers.
4. Update checklist and progress choices to Ready, Not available, and Need help; translate labels and explanations; keep requirements-variation guidance visible.
5. Add a Before Visiting the Bank page with first-visit steps, common questions, and honest-answer guidance; add a Business Finance page explaining Term Loan, CC, and OD without recommendations or promises.
6. Refresh the final report to show ready, pending, and clarification items, retain download/start-again behavior, and link to the bank-visit guide.

## Technical details
- Keep changes in frontend routes, shared components/state, copy, and readiness rules; do not add a backend or replace the current local persistence.
- Add route files before referencing their paths. Keep existing copilot functionality available by direct route while removing its tabs from the main navigation.
- Extend tests alongside existing readiness tests for expanded business categories, age/purpose behavior, and the three checklist statuses. Validate the route/navigation flow, language switching, and narrow-screen layout.
- Update route-specific metadata for changed and new content pages, run the test suite and production build, and verify the primary readiness journey in the preview.
