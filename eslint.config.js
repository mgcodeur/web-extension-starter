import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import vue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import wxtAutoImports from "./.wxt/eslint-auto-imports.mjs";

export default defineConfig([
  globalIgnores([".output/", ".wxt/"]),
  eslint.configs.recommended,
  tseslint.configs.strict,
  vue.configs["flat/recommended"],
  wxtAutoImports,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
    rules: {
      "no-undef": "off",
    },
  },
  prettierConfig,
]);
