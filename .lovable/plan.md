# Instalar reCAPTCHA v2 no formulário

## Contexto
O formulário envia direto para o Google Apps Script via iframe oculto. Por isso, a **chave do site** entra no frontend e a **chave secreta** precisa ser usada **dentro do Apps Script** para validar o token — não há backend nosso no caminho do envio.

A chave secreta NÃO deve ir para o código do site. Ela fica no Apps Script (Project Settings → Script Properties).

## Mudanças no código (frontend)

**`src/routes/__root.tsx`**
- Adicionar `<script src="https://www.google.com/recaptcha/api.js" async defer>` via `scripts` no `head()`.

**`src/routes/index.tsx`**
- Adicionar a chave pública como constante:
  `const RECAPTCHA_SITE_KEY = "6Ldrdz4tAAAAAFgIT_nPjD4mSBkNeGYxZY2Fe35B"`
- Inserir o widget logo acima do botão de envio:
  `<div className="g-recaptcha" data-sitekey={RECAPTCHA_SITE_KEY} />`
  (o input gerado tem `name="g-recaptcha-response"` automaticamente, então já vai no POST junto com os demais campos).
- No `handleSubmit`, antes de disparar o redirect, ler `grecaptcha.getResponse()` e bloquear o envio se estiver vazio (mostrar mensagem "Confirme o reCAPTCHA").
- Desabilitar o botão enquanto `consent` for falso (já existe) — manter.

## Passos que você faz no Google Apps Script

1. Em **Project Settings → Script Properties**, criar a propriedade:
   - `RECAPTCHA_SECRET` = `6Ldrdz4tAAAAAMPl0dHzr6CECj96QpdO1oVHMInq`
2. No início da função `doPost(e)`, antes de gravar na planilha, validar o token:

```js
var token = e.parameter['g-recaptcha-response'];
var secret = PropertiesService.getScriptProperties().getProperty('RECAPTCHA_SECRET');
var verify = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
  method: 'post',
  payload: { secret: secret, response: token }
});
var ok = JSON.parse(verify.getContentText()).success;
if (!ok) {
  return ContentService.createTextOutput(JSON.stringify({result:'error', reason:'captcha'}))
    .setMimeType(ContentService.MimeType.JSON);
}
// ... segue com SpreadsheetApp.append etc.
```

3. Salvar e publicar nova versão do Web App (Deploy → Manage deployments → editar → nova versão).

## Observações
- Usaremos **reCAPTCHA v2 "Não sou um robô"** (checkbox). Suas chaves servem; se você tiver registrado como v3 ou Invisible, me avise que ajusto.
- O domínio `sitiocantodamata.com.br` precisa estar listado nas configurações da chave reCAPTCHA (já está, pelo que você passou). Para testar no preview Lovable, adicione também `lovable.app` na lista de domínios da chave.
- A chave secreta nunca entra no repositório nem em variáveis do Lovable — fica só no Apps Script.