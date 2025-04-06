import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [  {
  ignores: ['node_modules/', 'dist/', '.next/'],
},
  ...compat.config({
    extends: ['next/core-web-vitals']
  })
];

export default eslintConfig;

/*
export default defineConfig([
  {
    files: ["**\*.{ts,tsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        project: true,
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^actionTypes$" }
      ]
    }
  }
]);*/
