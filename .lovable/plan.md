## Corrigir envio do formulário com reCAPTCHA v3

**Problema:** Após adicionar o reCAPTCHA v3, o POST para o Apps Script parou de incluir os campos. Causa provável: o token é gerado assincronamente e o `form.submit()` nativo dispara antes/sem o token, ou o nome do campo não bate com o esperado pelo backend.

**Arquivo:** `src/routes/index.tsx`

### Mudanças

1. **Renomear o input hidden** de `recaptcha_token` para `g-recaptcha-response` (nome padrão que o Apps Script espera).

2. **Reescrever `handleSubmit`** para garantir robustez:
   - `e.preventDefault()` no início.
   - Validar campos obrigatórios + consentimento + fase.
   - Setar `loading = true`.
   - Tentar gerar o token via `grecaptcha.execute(SITE_KEY, { action: 'submit' })` com timeout de 3s (Promise.race). Se falhar ou expirar, segue sem token — não bloqueia o lead.
   - Escrever o token no input `g-recaptcha-response`.
   - Chamar `form.submit()` nativo (envia para o iframe oculto com todos os campos `name=...`).
   - Aguardar ~1.2s e redirecionar para `/download`.
   - Tudo dentro de `try/finally` para garantir que o loading sai e a navegação acontece mesmo se algo falhar.

3. **Manter** o iframe oculto `lead-sink`, o `action={WEBHOOK_URL}`, `method="post"`, `target="lead-sink"` e todos os `name` dos campos.

### Por que funciona

- O submit nativo do form serializa **todos** os inputs com `name` (incluindo o hidden `g-recaptcha-response`) e envia para o iframe, evitando CORS.
- O token é injetado **antes** do submit, então o pacote vai completo.
- Timeout no token garante que falha do reCAPTCHA não derruba a captação do lead.

Sem mudanças no Apps Script — você pode manter a verificação do token como já fez (ou ignorar quando vazio durante testes).