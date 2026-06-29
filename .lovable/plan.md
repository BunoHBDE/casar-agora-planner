## Envio automático de email via Lovable Cloud (Supabase)

Sim, dá pra fazer tudo dentro da plataforma — sem Resend, SendGrid ou contas externas. O Lovable Cloud roda em Supabase por baixo e já inclui infraestrutura de email gerenciada (domínio próprio, fila com retry, logs, supressão de bounces).

### O que vou configurar

1. **Ativar Lovable Cloud** no projeto (cria o backend Supabase automaticamente).
2. **Criar tabela `leads`** para salvar cada formulário enviado (nome, email, celular, cidade, estado, mês, ano, convidados, orçamento, created_at), com RLS e policy de INSERT pública (para o formulário funcionar sem login) e SELECT restrito.
3. **Configurar domínio de email** do Sítio Canto da Mata (ex: `notify.seudominio.com.br`) — você precisará adicionar registros DNS uma vez. Enquanto o DNS não propaga, os emails ficam na fila e disparam quando o domínio for verificado.
4. **Criar template de email** (`src/lib/email-templates/planilha-casamento.tsx`) em React Email, com a identidade visual da landing (bordô, creme, Playfair Display) contendo:
   - Saudação personalizada com o nome
   - Mensagem de agradecimento
   - Botão "Baixar planilha de organização" apontando para `/planilha-organizacao-casamento.xlsx`
5. **Criar rota pública** `src/routes/api/public/submit-lead.ts` que:
   - Recebe o formulário (valida com Zod)
   - Insere o lead na tabela via service role
   - Dispara o email via `/lovable/email/transactional/send` com idempotency key
6. **Atualizar o formulário** (`src/routes/index.tsx`) para chamar essa rota em vez de só salvar no localStorage. Sucesso continua mostrando o card de download.

### O que você vai precisar fazer

- Informar o **domínio** que quer usar como remetente (ex: `contato@sitiocantodamata.com.br`) e adicionar os registros DNS que a plataforma vai gerar (passo único, ~5 min no seu provedor de domínio).

### Pontos técnicos

- Os leads ficam acessíveis no painel do Lovable Cloud (visualizar/exportar via Cloud → Tables).
- Fila de email com retry automático (5 tentativas, TTL 60min) — se o email falhar transitoriamente, é reenviado sozinho.
- Bounces e reclamações são suprimidos automaticamente.
- Sem custo de provedor externo de email.

Quer que eu siga por aqui? Se sim, me confirme o domínio para o remetente.