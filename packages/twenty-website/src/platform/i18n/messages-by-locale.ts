import { type Messages } from '@lingui/core';
import { type DocumentationSupportedLanguage } from 'twenty-shared/constants';

import { messages as ptMessages } from '@/locales/generated/pt';

export const MESSAGES_BY_LOCALE: Record<
  DocumentationSupportedLanguage,
  Messages
> = {
  pt: ptMessages,
};
