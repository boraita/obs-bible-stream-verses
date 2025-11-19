# Repository Guidelines
This guide helps maintainers and contributors deliver consistent updates to the OBS Bible Plugin while keeping the panel and browser experiences stable.

## Project Structure & Module Organization
- `src/core` houses UI controllers such as `control_app.js` and shared logic like `styleManager.js`.
- `src/api` wraps database access (`connectDb.js`, `getData.js`), while `src/db` stores the bundled SQLite bible files consumed at runtime.
- `src/public` contains the HTML entry points (`control_panel.html`, `browser_source.html`) that OBS loads, with supporting assets in `src/styles` and shared utilities in `src/utils`.
- `dist` is generated output; never edit it directly. Testing artifacts and exploratory scripts live under `testing/`.
- `webpack.config.js` and Babel presets define the build pipeline; adjust them when adding new asset types.

## Build, Test, and Development Commands
- `pnpm install` ensures dependencies match the lockfile; prefer pnpm to npm or yarn.
- `pnpm dev` builds once and exits, useful for quick validation before committing.
- `pnpm start` launches `webpack-dev-server` on `http://localhost:8080/` for iterative UI work; OBS docks can point to the served URLs.
- `pnpm build` emits a production bundle in `dist/`; run this before packaging artifacts for OBS.

## Coding Style & Naming Conventions
Stick to ES modules with explicit exports, two-space indentation, and double quotes for strings, mirroring existing files in `src/core`. Name files after their exported responsibility (`panelStyleManager.js`, `sendMessage.js`) and keep DOM IDs kebab-cased to align with current templates. Run code through the build to surface syntax issues; no automated linter is configured, so favor self-review and focused inline comments only when behavior is non-obvious.

## Testing Guidelines
Regression scripts reside in `testing/`; execute them with Node, e.g. `node testing/testVersiculos.js`, after seeding sample data in `src/db`. When adding new scripts, follow the existing naming pattern (`testFeature.js`) and document the expected output in `testing/README.md`. Manual verification in OBS remains essential—validate both the control dock and browser source with real passages before merging.

## Commit & Pull Request Guidelines
History favors short, imperative subject lines (e.g., “Improve styling and add new features”). Group related changes into a single commit and mention affected modules in the body when scope is broad. Pull requests should summarize user-facing changes, link to any tracking issues, and attach screenshots or screen recordings of UI tweaks so reviewers can assess layout and theme impacts without rebuilding locally.

## Security & Configuration Tips
Review `SECURITY.md` before altering how SQLite files are bundled. Avoid committing sensitive or proprietary translations; keep large database updates in separate PRs for easier audit. When exposing the dev server, bind to localhost and confirm no personal OBS scenes or credentials are included in shared recordings.

----

 AGENTS Guidelines
1. **Build & dev**: use `pnpm install`, `pnpm dev` (one-off), `pnpm start` (webpack-dev-server on http://localhost:8080), `pnpm build` (production bundle to `dist/`).
2. **Packaging**: `pnpm package` / `pnpm package:full` produce OBS zips; `pnpm release` / `pnpm release:full` wrap build+package; `pnpm export:bible` runs `scripts/exportBibleToXml.js`.
3. **Tests (Node scripts)**: no Jest; run individual tests with `node testing/testAlgorithm.js [--quick]`, `node testing/testBibleSelection.js`, `node testing/testSnapshot.js [--update]` (see `TESTING.md`).
4. **Type checking**: run `pnpm typecheck` (driven by `tsconfig.json`) for `src/public/**/*.ts` and any new TypeScript.
5. **Cursor/Copilot rules**: no `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` files currently exist.
6. **Modules & imports**: use ES modules everywhere (`import ... from "..."`), relative paths within feature folders (e.g. `"../api/getData"`), and keep side-effect imports at top.
7. **JavaScript style**: two-space indentation, prefer double quotes for strings/imports, trailing semicolons optional but follow the surrounding file.
8. **TypeScript style**: avoid `any` where possible, keep function signatures explicit, and mirror the existing patterns in `src/public/browser/*.ts`.
9. **Naming**: camelCase for variables/functions, PascalCase for classes/types, UPPER_SNAKE_CASE for constants, kebab-case for DOM ids/classes (matching existing HTML).
10. **File organization**: put UI/controller logic in `src/core`, data access in `src/api`, configuration in `src/config`, shared utilities in `src/utils`, and do not edit generated `dist/` files.
11. **Error handling**: in UI/event handlers and OBS WebSocket code, prefer graceful failure (guard for null DOM nodes, wrap async calls in `try/catch`, log with `console.error` and keep the panel responsive).
12. **Promises & async**: use `async/await` over raw `.then()` chains; avoid unhandled promise rejections by always awaiting or catching OBS/WebSocket/database calls.
13. **Browser compatibility**: target modern Chromium in OBS docks; avoid Node-only globals in browser code and keep OBS-specific logic in `src/core`.
14. **DOM manipulation**: query elements once when possible, check for null before use, and prefer small helpers (see `control_app.js`, `panelStyleManager.js`) over inline DOM logic.
15. **Styling**: keep CSS in `src/styles`; dynamic, JS-driven changes should go through `styleManager.js` / `panelStyleManager.js` instead of inlined styles when practical.
16. **Configuration**: extend Bible/OBS settings via `src/config/*.js` and respect guidance in `SECURITY.md` when touching SQLite bundling or adding Bible databases.
17. **Testing additions**: name new regression scripts `testing/testFeature.js`, keep them Node-executable, and document behavior/expected output in `testing/README.md`.
18. **OBS validation**: after code changes, manually verify both the control panel and browser source in OBS with real passages before shipping.
19. **Commits/PRs**: use short, imperative commit subjects and PR descriptions that summarize user-facing effects and list touched modules; include screenshots for UI/layout changes.