import { DOCUMENTATION_DEFAULT_LANGUAGE } from './DocumentationDefaultLanguage';

export const DOCUMENTATION_SUPPORTED_LANGUAGES = [
  DOCUMENTATION_DEFAULT_LANGUAGE,
] as const;

export type DocumentationSupportedLanguage =
  (typeof DOCUMENTATION_SUPPORTED_LANGUAGES)[number];
