// ESLint flat config for Next.js 16 + ESLint 9.
//
// History: Next.js 16 removed the bundled `next lint` command (deprecated in
// Next 15). Before this file existed, the project had no ESLint config and
// relied entirely on `next lint`'s built-in defaults. This file restores
// linting via ESLint directly, using eslint-config-next's native flat-config
// exports (shipped in v15+, no FlatCompat shim required).
//
// ESLint pinned to ^9 (the version certified by eslint-config-next@16's
// peer dependency: "eslint: >=9.0.0"). Avoid bumping to v10 until
// eslint-config-next certifies it; the import/parser plugins crash on v10
// with `scopeManager.addGlobals is not a function`.
//
// Invoke via:  yarn lint    →    `eslint .`

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,

  {
    // Project-wide rule overrides.
    rules: {
      // Stylistic: quotes/apostrophes inside JSX text. Pre-existing throughout
      // the codebase from before this config existed. Track for a future
      // cleanup pass; not worth failing CI over.
      "react/no-unescaped-entities": "warn",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "public/**",
      // Sanity Studio's auto-generated build artifacts; not our source.
      "sanity-studio/**",
    ],
  },

  {
    // Sanity v3+ schemas legitimately export anonymous objects (this is the
    // documented pattern in the official Sanity docs). Suppress only here.
    files: ["sanity/schemas/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "import/no-anonymous-default-export": "off",
    },
  },
];

export default config;
