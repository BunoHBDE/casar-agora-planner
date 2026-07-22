import { createFileRoute } from "@tanstack/react-router";

const HERO_IMAGE_URL = "/images/hero-venue-1400.webp";
const BASE_URL = "https://sitiocantodamata.com.br";
const PAGE_PATH = "/casamento-em-itapecerica-da-serra";

// Tempo de carro real entre Itapecerica da Serra (centro) e o sítio (Estrada
// dos Tigres, 100 - Pereiras, São Lourenço da Serra), confirmado pelo cliente.
export const TEMPO_CARRO_ITAPECERICA = "40 minutos de carro";
export const VIA_ACESSO_ITAPECERICA = "Rodovia Régis Bittencourt (BR-116)";

export const FAQ_ITEMS = [
  {
    q: "O sítio fica em Itapecerica da Serra?",
    a: `Ficamos ao lado, em São Lourenço da Serra, a cerca de ${TEMPO_CARRO_ITAPECERICA} do centro de Itapecerica. É uma viagem curta, por estrada tranquila, que já faz parte da experiência de casar no campo.`,
  },
  {
    q: "Quantos convidados o espaço comporta?",
    a: "Recebemos casamentos de até 100 convidados — o tamanho ideal para uma celebração intimista, em que todos os presentes são realmente próximos de vocês.",
  },
  {
    q: "Vocês realizam casamento de dia?",
    a: "Sim. Nossa especialidade são os casamentos à luz do dia, ao ar livre, aproveitando a beleza natural do campo e o clima tranquilo da serra.",
  },
  {
    q: "Fazem mais de um evento por dia?",
    a: "Nunca. Realizamos um único casamento por dia — o sítio é exclusivamente de vocês e dos seus convidados.",
  },
  {
    q: "O que já está incluído?",
    a: "Buffet completo com serviço contínuo, cerimônia sobre o lago, mobiliário, estacionamento privativo e equipe de apoio no dia.",
  },
  {
    q: "Como faço para conhecer o espaço?",
    a: "Basta agendar uma visita. Você conhece o sítio pessoalmente, sente o clima do lugar e tira todas as suas dúvidas com quem cuida de cada detalhe.",
  },
];

export const Route = createFileRoute("/casamento-em-itapecerica-da-serra")({
  head: () => ({
    meta: [
      { title: "Casamento em Itapecerica da Serra | Sítio Canto da Mata" },
      {
        name: "description",
        content:
          "Um espaço só seu para casar na região de Itapecerica da Serra: cerimônia ao ar livre, um único evento por dia, até 100 convidados. Agende sua visita.",
      },
      { property: "og:title", content: "Casamento em Itapecerica da Serra | Sítio Canto da Mata" },
      {
        property: "og:description",
        content:
          "Um espaço só seu para casar na região de Itapecerica da Serra: cerimônia ao ar livre, um único evento por dia, até 100 convidados.",
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
                // "Casamento no Campo" fica só no breadcrumb visual da página — não
                // existe uma página de categoria real, e o Google exige um "item"
                // (URL) em todo ListItem que não seja o último. Incluir esse nó sem
                // URL foi o que o Search Console reportou como erro crítico.
                { "@type": "ListItem", position: 2, name: "Itapecerica da Serra", item: `${BASE_URL}${PAGE_PATH}` },
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
