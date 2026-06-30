## Problema

O envio para o Google Apps Script não está sendo registrado. O snapshot de network não mostra nenhuma chamada para `script.google.com`, então o `fetch` provavelmente nem chegou a sair (ou o Apps Script rejeitou silenciosamente o `Content-Type: application/x-www-form-urlencoded` enviado via `no-cors`, que em alguns navegadores é tratado de forma inconsistente em redirecionamentos 302 — típico de Apps Script).

## Plano de correção

Trocar o `fetch(..., { mode: "no-cors" })` por uma submissão clássica via **form + iframe oculto**. Esse é o padrão recomendado para Google Apps Script Web Apps porque:

- Não dispara preflight CORS.
- Lida nativamente com o redirect 302 do Apps Script (`script.google.com` → `script.googleusercontent.com`).
- Funciona igual em desktop e mobile, sem depender de `no-cors`.
- Garante que o POST realmente sai — visível na aba Network como `POST exec`.

### Mudanças (somente em `src/routes/index.tsx`)

1. Adicionar um `<iframe name="lead-sink" hidden />` no JSX.
2. No `<form>`, definir `action={WEBHOOK_URL}`, `method="post"`, `target="lead-sink"`.
3. Em `handleSubmit`:
   - Remover o `event.preventDefault()` (deixar o form submeter de fato para o iframe).
   - Apenas ativar `setLoading(true)` e agendar o redirect para `/download` após ~800 ms (tempo do POST completar no iframe).
   - Manter a máscara de celular e validação HTML5 dos `required`.
4. Remover a lógica de `fetch` e o estado de `error` (não há mais ramo de falha visível ao usuário, já que a resposta do Apps Script é opaca pelo iframe — comportamento idêntico ao `no-cors` anterior, porém mais confiável).

### Validação

- Após a mudança, preencher o formulário no preview e confirmar na aba Network do navegador um `POST` para `script.google.com/macros/.../exec` retornando 302 → 200.
- Confirmar redirecionamento para `/download`.
- Verificar na planilha do Apps Script que a nova linha foi gravada.

Nenhuma outra parte do projeto é alterada (banco, design, demais rotas permanecem como estão).