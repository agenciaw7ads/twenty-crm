import { defineConfig } from '@lingui/conf';
import { formatter } from '@lingui/format-po';
import { SOURCE_LOCALE } from 'twenty-shared/translations';

export default defineConfig({
  sourceLocale: SOURCE_LOCALE,
  locales: ['pt-BR'],
  pseudoLocale: 'pseudo-en',
  fallbackLocales: {
    'pseudo-en': 'en',
    default: SOURCE_LOCALE,
  },
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['src'],
    },
  ],
  catalogsMergePath: '<rootDir>/src/locales/generated/{locale}',
  compileNamespace: 'ts',
  format: formatter({ lineNumbers: false, printLinguiId: true }),
});
