// .eslintrc.js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.js'],
    extends: [
      js.configs.recommended,
      'plugin:react/recommended',
      reactHooks.configs['recommended'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: ['react'],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Você pode adicionar outras regras aqui
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
