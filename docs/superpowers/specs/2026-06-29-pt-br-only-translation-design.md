# Design: Twenty CRM — Tradução Completa para pt-BR (Idioma Único)

**Data:** 2026-06-29  
**Status:** Aprovado

## Objetivo

Traduzir 100% do sistema Twenty CRM para Português (Brasil) e torná-lo o único idioma disponível, removendo o seletor de idioma e todos os outros arquivos de locale.

## Escopo

| Pacote | Ação |
|---|---|
| `twenty-front` | Completar 744 strings + remover outros locales + remover LocalePicker |
| `twenty-server` | Completar 561 strings + remover outros locales |
| `twenty-emails` | Completar 1 string + remover outros locales |
| `twenty-website` | Já completo; remover outros locales + definir pt como padrão |

## Parte 1 — Tradução das Strings Faltando

### Arquivos a completar

- `packages/twenty-front/src/locales/pt-BR.po` — 744 strings em branco
- `packages/twenty-server/src/engine/core-modules/i18n/locales/pt-BR.po` — 561 strings em branco
- `packages/twenty-emails/src/locales/pt-BR.po` — 1 string em branco

### Critérios de qualidade

- Consistência com o vocabulário já traduzido no `pt-BR.po` existente (~3.800 strings já traduzidas no front)
- Termos técnicos de CRM mantidos em inglês quando já é convenção no arquivo (ex: "workspace", "pipeline", "lead")
- Linguagem formal mas acessível (você/vocês, não tu)
- Strings curtas de UI (botões, labels) traduzidas de forma compacta
- Placeholders `{0}`, `{1}` mantidos exatamente como estão; apenas o texto ao redor é traduzido

## Parte 2 — pt-BR como Único Idioma

### Frontend (`twenty-front`)

**`packages/twenty-front/src/utils/i18n/dynamicActivate.ts`**
- Remover validação de locale e fallback para `en`
- Hardcodar importação de `pt-BR` como único locale

**`packages/twenty-front/src/pages/settings/profile/appearance/components/LocalePicker.tsx`**
- Remover o componente (ou substituir por label estático)
- Remover sua referência na página de aparência

**Arquivos de locale a remover** (`src/locales/*.po` e `src/locales/generated/*.ts`):
- Todos exceto `pt-BR.po` e `generated/pt-BR.ts`
- Manter `en.po` como referência de source (não é carregado no bundle)

**`lingui.config.ts` (raiz ou dentro do pacote)**
- Atualizar `locales` para `['pt-BR']`

### Backend (`twenty-server`)

**`packages/twenty-server/src/engine/core-modules/i18n/locales/`**
- Remover todos os arquivos `.po` exceto `pt-BR.po` e `en.po` (source)

**Configuração de i18n do servidor**
- Garantir que `pt-BR` seja o locale padrão na inicialização

### E-mails (`twenty-emails`)

**`packages/twenty-emails/src/locales/`**
- Remover todos os arquivos `.po` exceto `pt-BR.po` e `en.po` (source)

### Website (`twenty-website`)

**`packages/twenty-website/src/platform/i18n/messages-by-locale.ts`**
- Manter apenas o import de `pt`
- Remover todos os outros imports e entradas do `MESSAGES_BY_LOCALE`

**`packages/twenty-website/src/locales/`**
- Remover todos os arquivos `.po` gerados exceto `pt.po` e `en.po`

**Configuração de locale padrão**
- Garantir que `pt` seja o locale padrão do Next.js

## Fluxo de Execução

1. Completar traduções nos `.po` files (Parte 1)
2. Regenerar os arquivos `.ts` gerados em `src/locales/generated/` com `npx lingui compile`
3. Remover arquivos de outros locales (Parte 2)
4. Atualizar configurações de inicialização
5. Remover `LocalePicker` do frontend
6. Verificar com lint e typecheck

## O que NÃO muda

- A estrutura de build do Lingui (SOURCE_LOCALE permanece `en`)
- Os arquivos `en.po` (são o source de extração, não são carregados no bundle de produção)
- A pipeline de CI/CD
- Qualquer lógica de negócio ou banco de dados
