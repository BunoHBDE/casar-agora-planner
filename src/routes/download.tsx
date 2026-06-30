import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Sua planilha — SÍTIO CANTO DA MATA" },
      { name: "description", content: "Baixe sua planilha de organização de casamento." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full rounded-2xl border border-gold/40 bg-card p-6 text-center shadow-soft sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-xl">
            ✓
          </div>
          <h1 className="mt-4 font-serif text-2xl text-primary sm:text-3xl">Obrigado!</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Sua planilha está pronta:
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground/80">
            Também enviamos um link para o email fornecido.
          </p>
          <a
            href="https://bit.ly/PlanilhaOrganizandoOSeuCasamento"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90"
          >
            ↓ ACESSAR PLANILHA
          </a>
          <Link
            to="/"
            className="mt-4 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Voltar ao início
          </Link>
        </div>
      </section>
    </main>
  );
}
