# React + TypeScript + Vite

```
npm install

Add the .env.local file including clerk and firebase configuration settings.

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

## Practice problems (Code Editor)

A short reference for the Practice Problems feature implemented at `src/routes/code-editor.tsx`.

- User flow: pick Job Role + Years → app selects 2 curated Codewars slugs → fetches kata title/description → shows examples in the left panel → edit code in the Monaco editor → Run.
- Where the code lives: `src/routes/code-editor.tsx` (orchestration, UI, editor, and execution logic) and `src/data/codewars-slugs.json` (curated slug lists).
- Execution: client tries a configured Judge0 endpoint (`VITE_JUDGE0_URL`) with multiple wrapper variants; if all attempts fail it falls back to Piston (`VITE_PISTON_URL`).
- Important env vars (Vite `.env`):
  - `VITE_JUDGE0_URL` — required (Judge0 base URL)
  - `VITE_JUDGE0_KEY` — optional RapidAPI key (client-only usage is not secure for production)
  - `VITE_JUDGE0_HOST` — optional RapidAPI host header
  - `VITE_PISTON_URL` — optional Piston fallback URL
- Quick run: start dev server and open `/code-editor`:

```bash
npm run dev
# open http://localhost:5173/code-editor (or the dev server URL shown)
```

Notes:
- For production hide API keys server-side (proxy or self-host Judge0).
- The README entry is intentionally short; ask me to expand with examples, screenshots, or a server proxy example if you want.
