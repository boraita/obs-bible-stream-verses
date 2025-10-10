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
