// ESLint flat config
import js from "@eslint/js";
import ts from "typescript-eslint";
import reactRefresh from "eslint-plugin-react-refresh";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    plugins: { reactRefresh, reactHooks },
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
];
