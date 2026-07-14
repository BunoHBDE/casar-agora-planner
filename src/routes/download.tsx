import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Sua planilha de organização de casamento — Sítio Canto da Mata" },
      { name: "description", content: "Baixe agora a planilha gratuita para organizar seu casamento no Sítio Canto da Mata — orçamento, convidados, cronograma e fornecedores em um só lugar." },
      { property: "og:title", content: "Baixe sua planilha de organização de casamento" },
      { property: "og:description", content: "Planilha gratuita com orçamento, convidados, cronograma e fornecedores para organizar seu casamento no Sítio Canto da Mata." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
});
