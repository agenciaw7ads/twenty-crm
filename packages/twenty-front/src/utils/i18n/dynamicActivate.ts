import { i18n } from '@lingui/core';
import { messages } from '../../locales/generated/pt-BR';

export const dynamicActivate = async (_locale?: string): Promise<void> => {
  i18n.load('pt-BR', messages);
  i18n.activate('pt-BR');
};
