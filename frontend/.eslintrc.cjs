module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/no-unescaped-entities": [
      "error",
      {
        forbid: [">", "}", "`", "'"],
        allow: [
          "&lt;", // Permettre l'utilisation de &lt; pour <
          "&gt;", // Permettre l'utilisation de &gt; pour >
          "&quot;", // Permettre l'utilisation de &quot; pour "
          "&apos;", // Permettre l'utilisation de &apos; pour '
          "&lsquo;", // Permettre l'utilisation de &lsquo; pour l'apostrophe gauche
          "&rsquo;", // Permettre l'utilisation de &rsquo; pour l'apostrophe droite
        ],
      },
    ],
  },
};
