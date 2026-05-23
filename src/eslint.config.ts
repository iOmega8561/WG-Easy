import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from 'eslint/config';

export default defineConfig(
  { ignores: ["www/dist", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ["./tsconfig.json"]
      },
    },
    plugins: {
      "react": react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      // Vite rules (Fast Refresh)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // TypeScript/React customizations
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "react/jsx-uses-react": "off", // Non serve con React 17+
      "react/react-in-jsx-scope": "off", // Non serve con React 17+
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);