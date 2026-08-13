import { createFileRoute } from "@tanstack/react-router";

// URL absoluta (exigida por crawlers de redes sociais) apontando para a
// versão otimizada do hero, e não para o JPEG original de ~1 MB.
const OG_IMAGE_URL = "https://sitiocantodamata.com.br/images/hero-venue-1400.webp";
const HERO_IMAGE_AVIF_URL = "/images/hero-venue-1400.avif";

export const Route = createFileRoute("/lp-contato")({
  head: () => ({
    meta: [
      { title: "SÍTIO CANTO DA MATA — Agende uma visita" },
      {
        name: "description",
        content:
          "Espaço para casamentos no campo a 60 minutos de São Paulo. Preencha o formulário e receba uma proposta personalizada.",
      },
      // Página exclusiva de campanha do Meta: não deve ser indexada nem
      // aparecer no sitemap, para não competir com a home nas buscas.
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "SÍTIO CANTO DA MATA — Agende uma visita" },
      {
        property: "og:description",
        content: "Receba uma proposta personalizada para o seu casamento no campo.",
      },
      { property: "og:image", content: OG_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [
      { rel: "preload", as: "image", href: HERO_IMAGE_AVIF_URL, type: "image/avif", fetchPriority: "high" },
    ],
  }),
});
