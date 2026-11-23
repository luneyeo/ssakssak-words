import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
// eslint-config-next에 든 eslint-plugin-import의 order 규칙은 ESLint 10에서 크래시한다
import { importX } from "eslint-plugin-import-x";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { "import-x": importX },
    rules: {
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [
            { pattern: "{react,react-dom,next}{,/**}", group: "builtin", position: "before" },
            { pattern: "server-only", group: "builtin", position: "before" },
            { pattern: "@/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: [],
          "newlines-between": "always",
        },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
  prettier,
  globalIgnores([".next/**", "out/**", "coverage/**", "next-env.d.ts"]),
]);
