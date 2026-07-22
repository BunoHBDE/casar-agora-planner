import { createFileRoute } from "@tanstack/react-router";

// URL absoluta (exigida por crawlers de redes sociais) apontando para a
// versão otimizada do hero, e não para o JPEG original de ~1 MB.
const OG_IMAGE_URL = "https://sitiocantodamata.com.br/images/hero-venue-1400.webp";

export const Route = createFileRoute("/lp2")({
  head: () => ({
    meta: [
      { title: "SÍTIO CANTO DA MATA — Espaço para Casamentos" },
      {
        name: "description",
        content:
          "Preencha o formulário e baixe gratuitamente a planilha completa de organização do seu casamento.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "SÍTIO CANTO DA MATA — Espaço para Casamentos" },
      {
        property: "og:description",
        content: "Receba a planilha gratuita de organização do seu casamento.",
      },
      { property: "og:image", content: OG_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
  }),
});
