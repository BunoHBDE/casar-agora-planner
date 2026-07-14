## Objetivo
Fazer com que a home (`/`) não baixe o código da landing (`/lp`) nem do `/download`. Cada rota deve virar um chunk JS separado, carregado só quando o usuário visita a rota.

## Diagnóstico
- O TanStack Start já tem `autoCodeSplitting` ligado por padrão.
- Os componentes de rota (`Home`, `Landing`, `DownloadPage`) já não estão `export`ados (bom — não bloqueia o split).
- Mesmo assim, tudo está caindo num bundle único. A forma mais segura de garantir a divisão — sem tocar em `vite.config.ts` (que é gerenciado pelo Lovable) nem em `src/router.tsx` — é usar o mecanismo manual do próprio TanStack: arquivos `*.lazy.tsx` com `createLazyFileRoute`. Isso é uma API pública, oficial e explícita para code splitting por rota.

## Mudanças (só arquivos em `src/routes/`)

Para cada rota pesada, separar em dois arquivos:

1. **`src/routes/lp.tsx`** (crítico — fica no bundle inicial, mas minúsculo)
   - Mantém `createFileRoute("/lp")` só com `head` (metadados) e nada de componente.
2. **`src/routes/lp.lazy.tsx`** (novo, lazy)
   - `createLazyFileRoute("/lp")({ component: Landing })`
   - Move para cá o componente `Landing` inteiro, imports do React/useState/useRef/useEffect, constantes (`WEBHOOK_URL`, `RECAPTCHA_SITE_KEY`, `ESTADOS`, `MESES`, `ANOS`, `ORCAMENTOS`) e a `declare global`.

3. **`src/routes/download.tsx`** → mesmo padrão:
   - `download.tsx` fica só com `createFileRoute("/download")` + `head`.
   - `download.lazy.tsx` recebe `DownloadPage`.

4. **`src/routes/index.tsx`** → mesmo padrão:
   - `index.tsx` fica só com `createFileRoute("/")` + `head`.
   - `index.lazy.tsx` recebe `Home` e tudo específico dela (constantes `DIFERENCIAIS`, imports de assets, etc.).
   - Assim, mesmo o código da home só entra num chunk carregado on-demand — o bundle inicial fica com router + shell + CSS.

`__root.tsx` **não** muda (root route não pode ser lazy).

`src/routeTree.gen.ts` é regenerado automaticamente pelo plugin — não editamos.

## O que NÃO vai ser tocado
- `vite.config.ts`
- `src/router.tsx`
- `src/routeTree.gen.ts`
- `src/integrations/**`
- Qualquer lógica de formulário, reCAPTCHA, GTM, Meta Pixel, webhooks: só mudam de arquivo, o comportamento é idêntico.

## Verificação depois de aplicar
- Rodar o build e confirmar que aparecem chunks separados (algo como `lp-*.js`, `download-*.js`, `index-*.js`) e que o chunk carregado em `/` não contém o texto do formulário da `/lp` (ex.: `RECAPTCHA_SITE_KEY`, `WEBHOOK_URL`, "planilha").
- Navegar `/` → aba Network deve mostrar o chunk da home; ir para `/lp` deve baixar o chunk da lp só nesse momento.

## Risco
Baixo. É refactor mecânico de mover funções entre arquivos, usando uma API documentada do TanStack Router. Nenhuma configuração global é alterada.