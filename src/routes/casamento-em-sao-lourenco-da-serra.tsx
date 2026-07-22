import { createFileRoute } from "@tanstack/react-router";

const HERO_IMAGE_URL = "/images/hero-venue-1400.webp";
const BASE_URL = "https://sitiocantodamata.com.br";
const PAGE_PATH = "/casamento-em-sao-lourenco-da-serra";

export const BAIRRO_SITIO = "Pereiras";
export const VIA_ACESSO_SP = "Rodovia Régis Bittencourt (BR-116)";

// Tempo de carro real entre o centro de São Lourenço da Serra e o sítio
// (Estrada dos Tigres, 100 - Pereiras) — aguardando confirmação do cliente.
// Nunca estimar/inventar: trocar o placeholder assim que confirmado.
export const TEMPO_CENTRO_SLS = "20 minutos";

export const FAQ_ITEMS = [
  {
    q: "Onde exatamente o sítio fica em São Lourenço da Serra?",
    a: `Estamos na Estrada dos Tigres, 100, no bairro ${BAIRRO_SITIO}, em São Lourenço da Serra, a cerca de ${TEMPO_CENTRO_SLS} do centro da cidade e a 60 minutos de São Paulo pela ${VIA_ACESSO_SP}.`,
  },
  {
    q: "Quantos convidados o espaço comporta?",
    a: "Recebemos casamentos de até 100 convidados — o tamanho ideal para uma celebração intimista, em que todos são realmente próximos de vocês.",
  },
  {
    q: "Vocês realizam casamento de dia?",
    a: "Sim, é a nossa especialidade: casamentos à luz do dia, ao ar livre, aproveitando a paisagem natural da serra.",
  },
  {
    q: "Fazem mais de um evento por dia?",
    a: "Nunca. Um único casamento por dia — o sítio é exclusivamente de vocês e dos seus convidados.",
  },
  {
    q: "Dá para casar e fazer a festa no mesmo lugar?",
    a: "Sim. A cerimônia sobre o lago e a festa acontecem no mesmo sítio, com buffet completo e serviço contínuo do início ao fim.",
  },
  {
    q: "Como conheço o espaço?",
    a: "Agende uma visita. Você conhece o sítio pessoalmente, sente o clima do lugar e tira todas as dúvidas com quem cuida de cada detalhe.",
  },
];

export const Route = createFileRoute("/casamento-em-sao-lourenco-da-serra")({
  head: () => ({
    meta: [
      { title: "Casamento em São Lourenço da Serra | Sítio Canto da Mata" },
      {
        name: "description",
        content:
          "Um sítio para casar em São Lourenço da Serra: cerimônia ao ar livre sobre o lago, um único evento por dia, até 100 convidados, a 60 min de São Paulo.",
      },
      { property: "og:title", content: "Casamento em São Lourenço da Serra | Sítio Canto da Mata" },
      {
        property: "og:description",
        content:
          "Um sítio para casar em São Lourenço da Serra: cerimônia ao ar livre sobre o lago, um único evento por dia, até 100 convidados.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}${PAGE_PATH}` },
      { property: "og:image", content: HERO_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_IMAGE_URL },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}${PAGE_PATH}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
                // "Casamento no Campo" fica só no breadcrumb visual — sem página de
                // categoria real para linkar, o Google exige "item" (URL) em todo
                // ListItem que não seja o último (ver fix aplicado na página de
                // Itapecerica, reportado como erro crítico no Search Console).
                { "@type": "ListItem", position: 2, name: "São Lourenço da Serra", item: `${BASE_URL}${PAGE_PATH}` },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            },
          ],
        }),
      },
    ],
  }),
});
