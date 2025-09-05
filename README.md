# React + TypeScript + Vite

```
npm install

Add the .env.local file including clerk, firebase and google gemini configuration settings.

Run The Project :- npm run dev
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

## Practice problems (Code Editor) — details

This expanded reference explains how the Practice Problems feature works, where the code is, how execution is performed, common failure modes, and recommended next steps.

### Quick flow
1. User types a Job Role and enters Years of Experience and clicks "Generate Problems".  
2. App selects up to 2 curated Codewars slugs (from `src/data/codewars-slugs.json`) for the detected role and difficulty.  
3. The app fetches kata metadata from the Codewars API and displays the problem title, description, and examples in the left panel.  
4. User edits code in the Monaco editor and picks a language. Starter templates are provided.  
5. Tests: when a problem is selected (or on first load), the app auto-generates a small set of test cases via Gemini and stores them for the current problem.  
6. User clicks Run — the client attempts to execute code via Judge0 (multiple endpoint variants). If Judge0 fails, it falls back to Piston. A language-aware test harness runs the generated tests and prints a concise PASS/FAIL report in the Output card.

### Where the code lives
- `src/routes/code-editor.tsx` — main page (UI, problem selection, Monaco editor, execution pipeline).  
- `src/data/codewars-slugs.json` — curated slug lists per role/difficulty (used to pick problems).  
- `src/components/ui/*` — Card, Button, Input components used to build the UI.

### Test cases & validation
- Test generation: Gemini creates exactly a few input/output pairs tailored to the selected kata.  
- Auto-trigger: tests generate automatically on first problem load and when switching problems (no extra button needed).  
- Harness: a light harness wraps your code to call your solution function against each test and prints a machine-readable block that’s formatted into a human summary.  
- Result view: shows each test input, expected, actual, and PASS/FAIL, plus a totals summary.

Supported for validation: JavaScript and Python (Java runs but isn’t auto-validated yet).

### Execution summary (short)
- Primary runner: Judge0 (set `VITE_JUDGE0_URL` in `.env`). The client will try several common `/submissions` URL variants and rotate known wrapper bases when a RapidAPI key is present.  
- Fallback: Piston (`VITE_PISTON_URL`) — used when Judge0 attempts all fail. Piston calls attempt to find an appropriate language `version` and will retry using a `files` payload if required by the deployment.

### Function name detection (JS/Python)
- We try to detect your function name from your code (e.g., `function foo(...)`, `const foo = (...) => {}`, or `def foo(...)`).  
- The detected name is shown next to the input; you can override it if needed.  
- Keep your solution function top-level (not nested) so the harness can call it.

### Important env vars
Place these in your Vite `.env` (prefix `VITE_`):
- `VITE_JUDGE0_URL` — required; base Judge0 URL (example: `https://judge0-ce.p.rapidapi.com`).
- `VITE_JUDGE0_KEY` — optional RapidAPI key (not secure to expose in public builds).
- `VITE_JUDGE0_HOST` — optional RapidAPI host header (used alongside the key).
- `VITE_PISTON_URL` — optional override for Piston fallback (default used if unset).
- `VITE_GEMINI_API_KEY` — required for live test generation; keep this safe in local `.env` only. For production, proxy it server-side.

### Troubleshooting & common failures
- 403 from Judge0: usually means the RapidAPI subscription for that wrapper is not enabled.  
- 404 from Judge0: wrapper exposes a different path; client tries multiple path variants to mitigate this.  
- 429 from Judge0: wrapper is rate-limited. Consider a server-side proxy or a paid plan.  
- Empty output: code executed but printed nothing. Starter templates include a simple print/log to verify the runner.
- Slugs that don't exist on Codewars: the curated list may contain placeholders. You can validate slugs by calling `https://www.codewars.com/api/v1/code-challenges/{slug}` and removing invalid ones.

Additional tips:
- “Function not found” in results: ensure your function is top-level and the detected name matches your definition (or set it explicitly).
- Still seeing empty output with tests expected: confirm you’re using JavaScript or Python for auto-validation.
- Rate limits from Gemini (429): tests auto-retry briefly with backoff; if it persists, wait or switch problems.
- Merge conflict markers (<<<<<<<, =======, >>>>>>>) in your code will be blocked with a helpful message before running.

### Security note
This project currently calls Judge0/Piston directly from the browser and may expose keys if you put them in `.env`. For production you should:
- Implement a server-side proxy (simple Express endpoint or serverless function) that stores API keys securely and forwards requests to Judge0.  
- Or self-host Judge0 and point `VITE_JUDGE0_URL` to your internal host.

### Developer quick run
Start the dev server and open the page:

```bash
npm run dev
# then open the dev URL and navigate to /code-editor
```

### Optional improvements (recommended)
- Add a small server-side proxy example (I can scaffold Express or serverless), which improves security and reliability.  
- Add a validated slug-checker script that prunes `src/data/codewars-slugs.json` of non-existing slugs.  
- Add a demo problem that displays even when Codewars fetch fails (good for offline demos).  

### Role curation
- Software Developer: general algorithms and strings/arrays.  
- Data Scientist: more DS-relevant katas (CSV/text parsing, summary statistics, sequence/matrix traversal). Lists are maintained in `src/data/codewars-slugs.json` and fetched live from Codewars.


