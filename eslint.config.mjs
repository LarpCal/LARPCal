// @ts-check

import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["client/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["client/**/*.tsx"],
    plugins: { "react-refresh": reactRefresh },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["server/**/*.{ts,mjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
  globalIgnores(["server/dist", "client/dist"]),
);
