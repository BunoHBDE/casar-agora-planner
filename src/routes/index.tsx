import { createFileRoute } from "@tanstack/react-router";

const HERO_IMAGE_URL = "/images/hero-venue.webp";
const HERO_IMAGE_AVIF_URL = "/images/hero-venue.avif";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sítio Canto da Mata — Espaço para Casamentos no Campo" },
      {
        name: "description",
        content:
          "Sítio Canto da Mata: espaço para casamentos no campo, cercado pela natureza.. Agende sua visita.",
      },
      { property: "og:title", content: "Sítio Canto da Mata — Espaço para Casamentos no Campo" },
      {
        property: "og:description",
        content:
          "Sítio Canto da Mata: espaço para casamentos no campo, cercado pela natureza.. Agende sua visita.",
      },
      { property: "og:url", content: "https://sitiocantodamata.com.br/" },
      { property: "og:image", content: HERO_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_IMAGE_URL },
    ],
    links: [
      { rel: "canonical", href: "https://sitiocantodamata.com.br/" },
      { rel: "preload", as: "image", href: HERO_IMAGE_AVIF_URL, type: "image/avif", fetchPriority: "high" },
    ],
  }),
});
