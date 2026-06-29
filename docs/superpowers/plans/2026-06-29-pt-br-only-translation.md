# Twenty CRM — Tradução Completa para pt-BR (Idioma Único) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Traduzir 100% do Twenty CRM para Português (Brasil) e torná-lo o único idioma disponível, removendo o seletor de idioma e todos os arquivos de locale desnecessários.

**Architecture:** Completar as strings faltando nos arquivos `.po` de `pt-BR` via tradução direta no arquivo, recompilar os arquivos `.ts` gerados pelo Lingui, hardcodar pt-BR como locale único nos pontos de inicialização, remover o `LocalePicker`, remover todos os arquivos de outros locales, e atualizar o website para pt como único idioma.

**Tech Stack:** Lingui (i18n), arquivos `.po`, Nx workspace, TypeScript, React (frontend), NestJS (backend), Next.js (website)

## Global Constraints

- `SOURCE_LOCALE` permanece `'en'` — não alterar a pipeline de build do Lingui
- Manter `en.po` em todos os pacotes (é o arquivo-fonte de extração, não é carregado no bundle)
- Placeholders `{0}`, `{1}`, `{name}`, `{count}`, `{fieldName}` etc. devem ser mantidos **exatamente** como estão na string original
- Tags HTML/JSX (`<0>`, `</0>`, `<br/>`) dentro de strings devem ser mantidas intactas
- Terminologia: "você/vocês" (não "tu"); termos técnicos de CRM mantidos em inglês quando já é convenção no `.po` existente (`workspace`, `pipeline`, `lead`, `webhook`, `API`)
- Não alterar lógica de negócio, banco de dados, ou pipeline de CI/CD

---

### Task 1: Completar twenty-server pt-BR.po (561 strings faltando)

**Files:**
- Modify: `packages/twenty-server/src/engine/core-modules/i18n/locales/pt-BR.po`

**Interfaces:**
- Consumes: `packages/twenty-server/src/engine/core-modules/i18n/locales/en.po` como referência
- Produces: `pt-BR.po` com 0 strings em branco (exceto o header)

- [ ] **Step 1: Confirmar número de strings faltando**

```bash
grep -c 'msgstr ""' packages/twenty-server/src/engine/core-modules/i18n/locales/pt-BR.po
```

Esperado: `562` (561 strings + 1 header).

- [ ] **Step 2: Extrair lista de strings não traduzidas para análise**

```bash
grep -n -B 3 'msgstr ""' packages/twenty-server/src/engine/core-modules/i18n/locales/pt-BR.po | grep -v "^1-\|^2-\|^3-\|^4-\|^5-\|^6-\|^7-\|^8-\|^9-\|^10-\|^11-\|^12-\|^13-\|^14-\|^15-\|^16-\|^17-\|^18-\|^19-\|^--$" | head -100
```

Isso mostra os `msgid` das strings sem tradução para planejar o batch.

- [ ] **Step 3: Ler o arquivo pt-BR.po em seções e traduzir**

O arquivo tem ~470KB / ~15.000 linhas. Usar o Read tool com `offset` e `limit` para processar em blocos de ~2.000 linhas por vez. Para cada bloco lido:

1. Localizar entradas com `msgstr ""`  (exceto o header nas primeiras linhas)
2. Ler o `msgid` correspondente
3. Usar Edit tool para substituir `msgstr ""` por `msgstr "<tradução-em-pt-BR>"`

Vocabulário de referência para consistência:
- `Record` → `Registro`
- `Field` → `Campo`
- `Object` → `Objeto`
- `Workspace` → `Workspace`
- `Filter` → `Filtro`
- `Sort` → `Ordenação` / `Classificar`
- `View` → `Visualização`
- `Member` → `Membro`
- `Settings` → `Configurações`
- `Connect` → `Conectar`
- `Disconnect` → `Desconectar`
- `Search` → `Pesquisar`
- `Create` → `Criar`
- `Delete` → `Excluir`
- `Edit` → `Editar`
- `Save` → `Salvar`
- `Cancel` → `Cancelar`
- `Close` → `Fechar`
- `Loading` → `Carregando`
- `Error` → `Erro`
- `Success` → `Sucesso`
- `Required` → `Obrigatório`
- `Optional` → `Opcional`
- `Name` → `Nome`
- `Email` → `E-mail`
- `Phone` → `Telefone`
- `Address` → `Endereço`
- `Company` → `Empresa`
- `People` / `Person` → `Pessoas` / `Pessoa`
- `Note` → `Nota`
- `Task` → `Tarefa`
- `Activity` → `Atividade`
- `Stage` → `Etapa`
- `Pipeline` → `Pipeline`
- `Dashboard` → `Painel`
- `Permission` → `Permissão`
- `Role` → `Função` / `Papel`
- `Token` → `Token`
- `Password` → `Senha`
- `Account` → `Conta`

- [ ] **Step 4: Verificar que não há mais strings vazias (exceto header)**

```bash
grep -c 'msgstr ""' packages/twenty-server/src/engine/core-modules/i18n/locales/pt-BR.po
```

Esperado: `1` (apenas o header).

- [ ] **Step 5: Commit**

```bash
git add packages/twenty-server/src/engine/core-modules/i18n/locales/pt-BR.po
git commit -m "i18n: complete pt-BR translations for twenty-server"
```

---

### Task 2: Completar twenty-front pt-BR.po (744 strings faltando)

**Files:**
- Modify: `packages/twenty-front/src/locales/pt-BR.po`

**Interfaces:**
- Consumes: `packages/twenty-front/src/locales/en.po` como referência; vocabulário do Task 1
- Produces: `pt-BR.po` com 0 strings em branco (exceto o header)

- [ ] **Step 1: Confirmar número de strings faltando**

```bash
grep -c 'msgstr ""' packages/twenty-front/src/locales/pt-BR.po
```

Esperado: `745` (744 strings + 1 header).

- [ ] **Step 2: Identificar grupos temáticos de strings faltando**

```bash
grep -B 5 'msgstr ""' packages/twenty-front/src/locales/pt-BR.po | grep "#:" | head -50
```

Isso mostra os arquivos de origem de cada string, ajudando a entender o contexto (ex: `settings/billing`, `modules/filters`, etc.).

- [ ] **Step 3: Ler o arquivo em seções e traduzir**

O arquivo tem ~18.340 linhas. Usar Read tool com `offset` e `limit` em blocos de ~2.000 linhas. Para cada bloco:

1. Localizar entradas com `msgstr ""`
2. Verificar o comentário `#:` acima para entender o contexto (ex: `src/modules/settings/billing/` → contexto de faturamento)
3. Usar Edit tool para substituir `msgstr ""` por `msgstr "<tradução>"`

Além do vocabulário do Task 1, adicionar para o front:

- `Appearance` → `Aparência`
- `Language` → `Idioma`
- `Theme` → `Tema`
- `Notification` → `Notificação`
- `Timeline` → `Linha do tempo`
- `Attachment` → `Anexo`
- `Relation` → `Relacionamento`
- `Select` → `Selecionar`
- `Deselect` → `Desmarcar`
- `Duplicate` → `Duplicar`
- `Detach` → `Desvincular`
- `Link` → `Vincular`
- `Unlink` → `Desvincular`
- `Collapse` → `Recolher`
- `Expand` → `Expandir`
- `Preview` → `Pré-visualização`
- `Import` → `Importar`
- `Export` → `Exportar`
- `Merge` → `Mesclar`
- `Archive` → `Arquivar`
- `Unarchive` → `Desarquivar`
- `Pin` → `Fixar`
- `Unpin` → `Desafixar`
- `Hide` → `Ocultar`
- `Show` → `Mostrar`
- `Move` → `Mover`
- `Copy` → `Copiar`
- `Paste` → `Colar`
- `Rename` → `Renomear`
- `Reset` → `Redefinir`
- `Confirm` → `Confirmar`
- `Apply` → `Aplicar`
- `Enable` → `Ativar`
- `Disable` → `Desativar`
- `Connected` → `Conectado`
- `Disconnected` → `Desconectado`
- `Synced` → `Sincronizado`
- `Draft` → `Rascunho`
- `Published` → `Publicado`
- `Archived` → `Arquivado`

- [ ] **Step 4: Verificar que não há mais strings vazias (exceto header)**

```bash
grep -c 'msgstr ""' packages/twenty-front/src/locales/pt-BR.po
```

Esperado: `1` (apenas o header).

- [ ] **Step 5: Commit**

```bash
git add packages/twenty-front/src/locales/pt-BR.po
git commit -m "i18n: complete pt-BR translations for twenty-front"
```

---

### Task 3: Recompilar arquivos gerados do Lingui (twenty-front)

**Files:**
- Modify: `packages/twenty-front/src/locales/generated/pt-BR.ts` (gerado automaticamente)

**Interfaces:**
- Consumes: `pt-BR.po` completo do Task 2
- Produces: `pt-BR.ts` gerado com todas as traduções novas incluídas

- [ ] **Step 1: Verificar o comando de compilação disponível**

```bash
cat packages/twenty-front/package.json | grep -A 2 '"lingui\|"i18n\|compile'
```

```bash
npx nx show project twenty-front 2>/dev/null | grep -i "lingui\|compile\|i18n" | head -10
```

- [ ] **Step 2: Compilar o locale pt-BR**

Executar a partir do diretório raiz do monorepo:

```bash
cd packages/twenty-front && npx lingui compile --locale pt-BR
```

Se o comando acima não funcionar, tentar:

```bash
npx nx run twenty-front:lingui:compile 2>/dev/null || npx lingui compile --config packages/twenty-front/lingui.config.ts --locale pt-BR
```

- [ ] **Step 3: Verificar que o arquivo gerado foi atualizado**

```bash
grep -c '"' packages/twenty-front/src/locales/generated/pt-BR.ts
```

Esperado: número maior do que antes (novas traduções incluídas).

- [ ] **Step 4: Commit**

```bash
git add packages/twenty-front/src/locales/generated/pt-BR.ts
git commit -m "i18n: recompile pt-BR generated locale file for twenty-front"
```

---

### Task 4: Hardcodar pt-BR como único locale no twenty-front

**Files:**
- Modify: `packages/twenty-front/src/utils/i18n/dynamicActivate.ts`
- Modify: `packages/twenty-front/src/utils/i18n/initialI18nActivate.ts`
- Modify: `packages/twenty-front/lingui.config.ts`

**Interfaces:**
- Produces: app sempre inicializa em pt-BR, independente do browser/storage/URL do usuário

- [ ] **Step 1: Substituir dynamicActivate.ts**

Ler o arquivo atual em `packages/twenty-front/src/utils/i18n/dynamicActivate.ts` para confirmar o conteúdo, depois substituir por:

```typescript
import { i18n } from '@lingui/core';
import { messages } from '../../locales/generated/pt-BR';

export const dynamicActivate = async (_locale?: string): Promise<void> => {
  i18n.load('pt-BR', messages);
  i18n.activate('pt-BR');
};
```

- [ ] **Step 2: Simplificar initialI18nActivate.ts**

Ler o arquivo em `packages/twenty-front/src/utils/i18n/initialI18nActivate.ts`, depois substituir por:

```typescript
import { dynamicActivate } from '~/utils/i18n/dynamicActivate';

export const initialI18nActivate = (): void => {
  dynamicActivate();
};
```

- [ ] **Step 3: Atualizar lingui.config.ts para compilar apenas pt-BR**

Ler `packages/twenty-front/lingui.config.ts`, depois alterar a linha `locales: Object.values(APP_LOCALES)` para:

```typescript
locales: ['pt-BR'],
```

Remover também o import de `APP_LOCALES` se não for mais usado na config. O arquivo final deve ficar assim:

```typescript
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
```

- [ ] **Step 4: Verificar typecheck**

```bash
npx nx typecheck twenty-front 2>&1 | grep -E "error|Error" | head -20
```

Esperado: sem erros relacionados a `locale`, `APP_LOCALES`, ou `dynamicActivate`.

- [ ] **Step 5: Commit**

```bash
git add packages/twenty-front/src/utils/i18n/dynamicActivate.ts
git add packages/twenty-front/src/utils/i18n/initialI18nActivate.ts
git add packages/twenty-front/lingui.config.ts
git commit -m "i18n: hardcode pt-BR as only locale in twenty-front initialization"
```

---

### Task 5: Remover LocalePicker das configurações de aparência

**Files:**
- Modify: `packages/twenty-front/src/pages/settings/profile/appearance/components/SettingsExperience.tsx`
- Delete (opcional): `packages/twenty-front/src/pages/settings/profile/appearance/components/LocalePicker.tsx`

**Interfaces:**
- Produces: seção "Language" removida da página de Aparência nas configurações

- [ ] **Step 1: Ler SettingsExperience.tsx**

Ler `packages/twenty-front/src/pages/settings/profile/appearance/components/SettingsExperience.tsx` para confirmar o estado atual.

- [ ] **Step 2: Remover a Section de Language e o import do LocalePicker**

Remover o import de `LocalePicker`:
```typescript
import { LocalePicker } from '~/pages/settings/profile/appearance/components/LocalePicker';
```

Remover a seção inteira de Language do JSX:
```tsx
<Section>
  <H2Title
    title={t`Language`}
    description={t`Select your preferred language`}
  />
  <LocalePicker />
</Section>
```

- [ ] **Step 3: Verificar que LocalePicker não é usado em mais nenhum lugar**

```bash
grep -r "LocalePicker" packages/twenty-front/src --include="*.tsx" --include="*.ts"
```

Esperado: nenhuma saída (ou apenas o próprio arquivo `LocalePicker.tsx`).

- [ ] **Step 4: Remover o arquivo LocalePicker.tsx**

```bash
rm packages/twenty-front/src/pages/settings/profile/appearance/components/LocalePicker.tsx
```

- [ ] **Step 5: Verificar typecheck**

```bash
npx nx typecheck twenty-front 2>&1 | grep -E "error|Error" | head -20
```

Esperado: sem erros.

- [ ] **Step 6: Commit**

```bash
git add -u packages/twenty-front/src/pages/settings/profile/appearance/components/
git commit -m "i18n: remove LocalePicker from settings — pt-BR is now the only locale"
```

---

### Task 6: Remover arquivos de outros locales do twenty-front, twenty-server e twenty-emails

**Files:**
- Delete: todos os `.po` em `packages/twenty-front/src/locales/` exceto `pt-BR.po` e `en.po`
- Delete: todos os `.ts` em `packages/twenty-front/src/locales/generated/` exceto `pt-BR.ts`
- Delete: todos os `.po` em `packages/twenty-server/src/engine/core-modules/i18n/locales/` exceto `pt-BR.po` e `en.po`
- Delete: todos os `.po` em `packages/twenty-emails/src/locales/` exceto `pt-BR.po` e `en.po`

**Interfaces:**
- Produces: bundle sem locales desnecessários; repositório mais limpo

- [ ] **Step 1: Listar arquivos a remover (verificação antes de deletar)**

```bash
ls packages/twenty-front/src/locales/*.po | grep -v "pt-BR.po\|/en.po"
ls packages/twenty-front/src/locales/generated/*.ts | grep -v "pt-BR.ts"
ls packages/twenty-server/src/engine/core-modules/i18n/locales/*.po | grep -v "pt-BR.po\|/en.po"
ls packages/twenty-emails/src/locales/*.po | grep -v "pt-BR.po\|/en.po"
```

- [ ] **Step 2: Remover .po de outros locales do twenty-front**

```bash
ls packages/twenty-front/src/locales/*.po | grep -v "pt-BR.po\|/en.po" | xargs rm -f
```

- [ ] **Step 3: Remover .ts gerados de outros locales do twenty-front**

```bash
ls packages/twenty-front/src/locales/generated/*.ts | grep -v "pt-BR.ts" | xargs rm -f
```

- [ ] **Step 4: Remover .po de outros locales do twenty-server**

```bash
ls packages/twenty-server/src/engine/core-modules/i18n/locales/*.po | grep -v "pt-BR.po\|/en.po" | xargs rm -f
```

- [ ] **Step 5: Remover .po de outros locales do twenty-emails**

```bash
ls packages/twenty-emails/src/locales/*.po | grep -v "pt-BR.po\|/en.po" | xargs rm -f
```

- [ ] **Step 6: Verificar que não há imports quebrados de locales removidos**

```bash
grep -r "locales/generated/" packages/twenty-front/src --include="*.ts" --include="*.tsx"
```

Esperado: apenas `pt-BR` aparece nos imports.

- [ ] **Step 7: Commit**

```bash
git add -A packages/twenty-front/src/locales/
git add -A packages/twenty-server/src/engine/core-modules/i18n/locales/
git add -A packages/twenty-emails/src/locales/
git commit -m "i18n: remove non-pt-BR locale files from twenty-front, twenty-server, twenty-emails"
```

---

### Task 7: Atualizar twenty-shared e twenty-website para pt como único idioma

**Files:**
- Modify: `packages/twenty-shared/src/constants/DocumentationDefaultLanguage.ts`
- Modify: `packages/twenty-shared/src/constants/DocumentationSupportedLanguages.ts`
- Modify: `packages/twenty-website/src/platform/i18n/messages-by-locale.ts`
- Delete: todos os `.po` em `packages/twenty-website/src/locales/` exceto `pt.po` e `en.po`
- Delete: arquivos gerados em `packages/twenty-website/src/locales/generated/` exceto `pt.*`

**Interfaces:**
- Consumes: `WEBSITE_LOCALE_LIST` — derivado de `DOCUMENTATION_SUPPORTED_LANGUAGES`
- Produces: website servindo apenas em pt (Português), URLs sem prefixo de idioma

- [ ] **Step 1: Atualizar DocumentationDefaultLanguage.ts**

Ler `packages/twenty-shared/src/constants/DocumentationDefaultLanguage.ts` e substituir:

```typescript
export const DOCUMENTATION_DEFAULT_LANGUAGE = 'pt' as const;
```

- [ ] **Step 2: Atualizar DocumentationSupportedLanguages.ts**

Ler `packages/twenty-shared/src/constants/DocumentationSupportedLanguages.ts` e substituir:

```typescript
import { DOCUMENTATION_DEFAULT_LANGUAGE } from './DocumentationDefaultLanguage';

export const DOCUMENTATION_SUPPORTED_LANGUAGES = [
  DOCUMENTATION_DEFAULT_LANGUAGE,
] as const;

export type DocumentationSupportedLanguage =
  (typeof DOCUMENTATION_SUPPORTED_LANGUAGES)[number];
```

- [ ] **Step 3: Atualizar messages-by-locale.ts para apenas pt**

Ler `packages/twenty-website/src/platform/i18n/messages-by-locale.ts` e substituir:

```typescript
import { type Messages } from '@lingui/core';
import { type DocumentationSupportedLanguage } from 'twenty-shared/constants';

import { messages as ptMessages } from '@/locales/generated/pt';

export const MESSAGES_BY_LOCALE: Record<
  DocumentationSupportedLanguage,
  Messages
> = {
  pt: ptMessages,
};
```

- [ ] **Step 4: Verificar arquivos gerados do website**

```bash
ls packages/twenty-website/src/locales/generated/
```

Remover arquivos gerados de outros locales (manter apenas `pt.*`):

```bash
ls packages/twenty-website/src/locales/generated/ | grep -v "^pt\." | while read f; do
  rm -f "packages/twenty-website/src/locales/generated/$f"
done
```

- [ ] **Step 5: Remover .po de outros locales do website**

```bash
ls packages/twenty-website/src/locales/*.po | grep -v "/pt.po\|/en.po" | xargs rm -f
```

- [ ] **Step 6: Verificar typecheck do website**

```bash
npx nx typecheck twenty-website 2>&1 | grep -E "error|Error" | head -20
```

Se houver erros de tipo relacionados a `DocumentationSupportedLanguage` (ex: código que itera sobre os locales e usa strings removidas), localizá-los e corrigir:

```bash
grep -r "DocumentationSupportedLanguage\|DOCUMENTATION_SUPPORTED_LANGUAGES\|WEBSITE_LOCALE_LIST" packages/twenty-website/src --include="*.ts" --include="*.tsx" -l
```

Para cada arquivo encontrado, verificar se referencia locales específicos (como `'en'`, `'fr'`) hard-coded que agora são inválidos.

- [ ] **Step 7: Commit**

```bash
git add packages/twenty-shared/src/constants/DocumentationDefaultLanguage.ts
git add packages/twenty-shared/src/constants/DocumentationSupportedLanguages.ts
git add packages/twenty-website/src/platform/i18n/messages-by-locale.ts
git add -A packages/twenty-website/src/locales/
git commit -m "i18n: update twenty-shared and twenty-website to pt-BR only"
```

---

### Task 8: Verificação final — lint, typecheck e limpeza

**Files:**
- Nenhum arquivo novo — apenas verificação e correções pontuais

**Interfaces:**
- Consumes: todos os pacotes atualizados nas Tasks 1-7
- Produces: codebase limpo, sem erros de lint ou tipo

- [ ] **Step 1: Lint do twenty-front (diff com main)**

```bash
npx nx lint:diff-with-main twenty-front 2>&1 | tail -40
```

Corrigir quaisquer erros de lint apontados (imports não usados, variáveis desnecessárias).

- [ ] **Step 2: Lint do twenty-server (diff com main)**

```bash
npx nx lint:diff-with-main twenty-server 2>&1 | tail -40
```

- [ ] **Step 3: Typecheck completo do twenty-front**

```bash
npx nx typecheck twenty-front 2>&1 | grep -E "TS[0-9]+|error" | head -30
```

Esperado: sem erros de TypeScript.

- [ ] **Step 4: Typecheck completo do twenty-server**

```bash
npx nx typecheck twenty-server 2>&1 | grep -E "TS[0-9]+|error" | head -30
```

- [ ] **Step 5: Verificar que não há referências a locales removidos**

```bash
grep -r "af-ZA\|ar-SA\|ca-ES\|cs-CZ\|da-DK\|de-DE\|el-GR\|es-ES\|fi-FI\|fr-FR\|he-IL\|hu-HU\|it-IT\|ja-JP\|ko-KR\|nl-NL\|no-NO\|pl-PL\|pt-PT\|ro-RO\|ru-RU\|sr-Cyrl\|sv-SE\|tr-TR\|uk-UA\|vi-VN\|zh-CN\|zh-TW" \
  packages/twenty-front/src packages/twenty-server/src packages/twenty-emails/src \
  --include="*.ts" --include="*.tsx" \
  | grep -v "test\|spec\|\.po\|node_modules"
```

Esperado: nenhuma saída (ou apenas referências em arquivos de teste, que são aceitáveis).

- [ ] **Step 6: Verificar que o arquivo gerado pt-BR.ts é importado corretamente**

```bash
grep -r "from.*locales/generated" packages/twenty-front/src --include="*.ts" --include="*.tsx"
```

Esperado: apenas imports de `pt-BR`.

- [ ] **Step 7: Commit final (se houver correções)**

```bash
git add -A
git commit -m "i18n: fix lint and type issues after pt-BR only migration"
```

- [ ] **Step 8: Verificação do git status**

```bash
git status
git log --oneline -10
```

Confirmar que todos os commits estão presentes e o working tree está limpo.
