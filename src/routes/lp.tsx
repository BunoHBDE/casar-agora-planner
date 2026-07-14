import { createFileRoute } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-venue.jpg.asset.json";

export const Route = createFileRoute("/lp")({
  head: () => ({
    meta: [
      { title: "SÍTIO CANTO DA MATA — Espaço para Casamentos" },
      {
        name: "description",
        content:
          "Preencha o formulário e baixe gratuitamente a planilha completa de organização do seu casamento.",
      },
      { property: "og:title", content: "SÍTIO CANTO DA MATA — Espaço para Casamentos" },
      {
        property: "og:description",
        content: "Receba a planilha gratuita de organização do seu casamento.",
      },
      { property: "og:image", content: heroAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroAsset.url },
    ],
  }),
});
