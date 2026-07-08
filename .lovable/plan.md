## Objetivo

Transformar o site em dois caminhos claros:

- `/` — Home de apresentação do Sítio Canto da Mata (institucional, semelhante em estrutura ao sonho-meu-seven.vercel.app).
- `/lp` — Página atual de captura de lead (planilha gratuita), sem mudanças de funcionalidade.

## Passos

1. **Mover a landing atual para `/lp`**
   - Renomear `src/routes/index.tsx` → `src/routes/lp.tsx` (mesma UI, mesmo formulário, mesmo iframe, mesmo `fbq('track','Lead')`, mesmo redirect para `/download`).
   - Ajustar `createFileRoute("/")` → `createFileRoute("/lp")`.
   - Nenhuma alteração no fluxo de envio, reCAPTCHA, Pixel ou destino.

2. **Criar nova home em `/` (`src/routes/index.tsx`)**
   Estrutura inspirada no site de referência (sonho-meu-seven), adaptada ao Sítio Canto da Mata:
   
   - **Header** fixo com logo + navegação (Sobre, Estrutura, Galeria, Localização, Contato) + CTA "Baixe a planilha" → `/lp`.
   - **Hero** com foto do espaço (reaproveita `hero-venue.jpg` por enquanto), nome, subtítulo curto, dois CTAs: "Agende uma visita" (WhatsApp) e "Baixe a planilha gratuita" (`/lp`).
   - **Sobre o espaço** — parágrafo curto de apresentação.
   - **Estrutura / diferenciais** — grade com ícones (capela, salão, hospedagem, área externa, etc.) usando placeholders de texto até você definir.
   - **Galeria** — grade de fotos (placeholders com `hero-venue.jpg` repetido; substituir quando você enviar as fotos).
   - **Depoimentos** (opcional, placeholder).
   - **Localização** — endereço + link para Google Maps.
   - **CTA final** — bloco convidando a agendar visita.
   - **Footer** — contato, redes sociais, © ano.
   
   SEO próprio: `title`, `description`, `og:title/description/image` distintos da /lp.

3. **Placeholders de conteúdo**
   Como você vai enviar as fotos, a home vai nascer com:
   - Foto hero atual reutilizada em hero + galeria.
   - Textos institucionais em português com tom acolhedor, editáveis por você depois.
   - Links de WhatsApp / Instagram / e-mail como placeholders (`#`) para você preencher.

4. **Sitemap e SEO**
   - Adicionar `/lp` ao `src/routes/sitemap[.]xml.ts`.
   - Home passa a ter metadados institucionais (não mais o texto da planilha).

5. **Analytics / Pixel**
   - Google Analytics e Meta Pixel continuam no `__root.tsx`, então funcionam em todas as rotas automaticamente.
   - `fbq('track','Lead')` continua disparando só no submit do formulário em `/lp`.

## Detalhes técnicos

- Design system: reutiliza tokens já existentes em `src/styles.css` (paleta atual do site, fonte serif do hero).
- Componentes ficam dentro do próprio arquivo `index.tsx` (Header, Hero, Sections, Footer) para manter simples; podemos extrair depois se crescer.
- Nenhuma mudança em backend, formulário, Apps Script, iframe, reCAPTCHA ou `/download`.
- `routeTree.gen.ts` é regenerado automaticamente ao adicionar `lp.tsx`.

## O que fica para você depois

- Enviar fotos reais (hero, galeria, estrutura).
- Confirmar textos institucionais, telefone/WhatsApp, endereço, Instagram.
- Atualizar sitemap se criar mais páginas.
