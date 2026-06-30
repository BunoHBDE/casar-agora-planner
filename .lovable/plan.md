## Diagnóstico

A mensagem **"Invalid key type"** do reCAPTCHA significa que a chave que você cadastrou (`6Ldrdz4t...`) **não é do tipo v2 "Não sou um robô" (checkbox)**, que é o que o código atual está tentando renderizar.

Pelo prefixo e pelo fato do erro aparecer, a chave foi criada provavelmente como **reCAPTCHA v3** (ou Enterprise) no admin do Google. v3 não mostra checkbox — funciona de forma invisível, com score de 0 a 1, e exige integração diferente no frontend e no backend.

## Caminhos possíveis

Você precisa escolher um dos dois:

### Opção A — Criar uma nova chave v2 Checkbox (recomendado, mais simples)
1. Acessar https://www.google.com/recaptcha/admin
2. Criar um **novo site** escolhendo **reCAPTCHA v2 → "Não sou um robô" Checkbox**
3. Adicionar domínios: `sitiocantodamata.com.br`, `www.sitiocantodamata.com.br`, `lovable.app`
4. Me passar a nova **chave de site** e a nova **chave secreta**
5. Eu troco as chaves no código (frontend) e te passo o snippet atualizado do Apps Script (backend)

Nada muda no comportamento atual: o usuário marca o checkbox antes de enviar.

### Opção B — Manter a chave atual (v3) e migrar o código para v3
- Remover o widget visível.
- Executar `grecaptcha.execute(siteKey, { action: 'submit' })` no submit para gerar um token invisível.
- Enviar o token no POST como hoje.
- No Apps Script, validar o token e checar `score >= 0.5` (você descarta envios suspeitos).
- Sem checkbox na tela — proteção fica invisível.

## O que eu preciso de você

Me confirme qual opção seguir:
- **A:** crie a chave v2 Checkbox e me envie as duas novas chaves.
- **B:** mantenho as chaves atuais e migro tudo para v3 invisível.

Assim que você confirmar, eu aplico as alterações no `src/routes/index.tsx` (e no `__root.tsx` se necessário) e te entrego o trecho atualizado do Apps Script para colar.
