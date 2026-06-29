import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-venue.jpg";
import detailImg from "@/assets/detail-table.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Villa Bellatrix — Espaço para Casamentos | Agende sua visita" },
      {
        name: "description",
        content:
          "Espaço de casamento com cerimônia ao ar livre e recepção elegante. Preencha o formulário e baixe gratuitamente a planilha completa de organização do seu casamento.",
      },
      { property: "og:title", content: "Villa Bellatrix — Espaço para Casamentos" },
      {
        property: "og:description",
        content:
          "Receba a planilha gratuita de organização e tire suas dúvidas com nosso time.",
      },
      { property: "og:image", content: heroImg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Landing,
});

type LeadForm = {
  nome: string;
  email: string;
  celular: string;
  cidade: string;
  estado: string;
  dataPrevista: string;
  convidados: string;
  orcamento: string;
};

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const ORCAMENTOS = [
  "Até R$ 30 mil",
  "R$ 30 mil – R$ 60 mil",
  "R$ 60 mil – R$ 100 mil",
  "R$ 100 mil – R$ 200 mil",
  "Acima de R$ 200 mil",
];

function Landing() {
  const [form, setForm] = useState<LeadForm>({
    nome: "", email: "", celular: "", cidade: "", estado: "",
    dataPrevista: "", convidados: "", orcamento: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof LeadForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const required: (keyof LeadForm)[] = ["nome","email","celular","cidade","estado","dataPrevista","convidados","orcamento"];
    for (const k of required) {
      if (!form[k]?.toString().trim()) {
        setError("Por favor, preencha todos os campos.");
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    try {
      const prev = JSON.parse(localStorage.getItem("wedding_leads") || "[]");
      prev.push({ ...form, criadoEm: new Date().toISOString() });
      localStorage.setItem("wedding_leads", JSON.stringify(prev));
    } catch {}
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("download-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="Cerimônia de casamento ao ar livre com altar de flores brancas"
            width={1600}
            height={1200}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/30 to-background" />
        </div>

        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2 text-primary-foreground">
            <span className="font-serif text-2xl tracking-wide">Villa Bellatrix</span>
          </div>
          <a
            href="#formulario"
            className="hidden rounded-full border border-primary-foreground/40 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm transition hover:bg-primary-foreground/10 sm:inline-block"
          >
            Agendar visita
          </a>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-12 md:grid-cols-2 md:gap-16 md:pt-24 md:pb-28">
          <div className="text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.18em] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Espaço para Casamentos
            </span>
            <h1 className="mt-6 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              O dia mais importante das suas vidas merece um lugar à altura.
            </h1>
            <p className="mt-6 max-w-lg text-base/relaxed text-primary-foreground/85 sm:text-lg">
              Cerimônia ao ar livre, recepção elegante e uma equipe que cuida de cada detalhe.
              Conte para a gente sobre o seu casamento e receba na hora a nossa{" "}
              <strong className="text-gold">planilha completa de organização</strong> — gratuita.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-primary-foreground/80">
              <Stat label="Casamentos realizados" value="+ 320" />
              <div className="h-8 w-px bg-primary-foreground/20" />
              <Stat label="Capacidade" value="até 400" />
              <div className="h-8 w-px bg-primary-foreground/20" />
              <Stat label="Avaliação" value="4,9 / 5" />
            </div>
          </div>

          {/* Form card */}
          <div id="formulario" className="md:pt-2">
            {!submitted ? (
              <form
                onSubmit={onSubmit}
                className="rounded-2xl border border-border/60 bg-card/95 p-6 shadow-soft backdrop-blur sm:p-8"
              >
                <h2 className="font-serif text-2xl text-primary">Receba a planilha gratuita</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Preencha em 1 minuto. Liberamos o download na sequência.
                </p>

                <div className="mt-6 grid gap-4">
                  <Field label="Nome completo">
                    <input required value={form.nome} onChange={update("nome")} className={inputCls} placeholder="Seu nome" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="E-mail">
                      <input required type="email" value={form.email} onChange={update("email")} className={inputCls} placeholder="voce@email.com" />
                    </Field>
                    <Field label="Celular">
                      <input required value={form.celular} onChange={update("celular")} className={inputCls} placeholder="(11) 99999-9999" />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                    <Field label="Cidade">
                      <input required value={form.cidade} onChange={update("cidade")} className={inputCls} placeholder="Cidade" />
                    </Field>
                    <Field label="Estado">
                      <select required value={form.estado} onChange={update("estado")} className={inputCls}>
                        <option value="">UF</option>
                        {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Mês ou dia previsto para o casamento">
                    <input required value={form.dataPrevista} onChange={update("dataPrevista")} className={inputCls} placeholder="Ex.: Outubro de 2026 ou 15/10/2026" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nº de convidados">
                      <input required type="number" min={1} value={form.convidados} onChange={update("convidados")} className={inputCls} placeholder="Ex.: 150" />
                    </Field>
                    <Field label="Orçamento estimado">
                      <select required value={form.orcamento} onChange={update("orcamento")} className={inputCls}>
                        <option value="">Selecione…</option>
                        {ORCAMENTOS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90"
                >
                  Quero a planilha gratuita
                </button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Seus dados são confidenciais. Sem spam.
                </p>
              </form>
            ) : (
              <div id="download-card" className="rounded-2xl border border-gold/40 bg-card/95 p-8 shadow-soft backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-2xl">✓</div>
                <h2 className="mt-4 font-serif text-2xl text-primary">Obrigado, {form.nome.split(" ")[0]}!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Recebemos suas informações. Nosso time entrará em contato pelo celular informado
                  para combinar a visita ao espaço. Enquanto isso, baixe sua planilha:
                </p>
                <a
                  href="/planilha-organizacao-casamento.xlsx"
                  download
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90"
                >
                  ↓ Baixar planilha (.xlsx)
                </a>
                <button
                  onClick={() => { setSubmitted(false); setForm({ nome:"",email:"",celular:"",cidade:"",estado:"",dataPrevista:"",convidados:"",orcamento:"" }); }}
                  className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Enviar para outro casal
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <img
              src={detailImg}
              alt="Mesa posta de recepção de casamento com velas e flores"
              width={1200}
              height={1500}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-soft"
            />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Por que nos escolher</span>
            <h2 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">
              Tudo pensado para que vocês só precisem dizer “sim”.
            </h2>
            <ul className="mt-8 space-y-5">
              {[
                ["Espaço completo", "Cerimônia, recepção e área kids no mesmo lugar — sem deslocamentos para os convidados."],
                ["Equipe dedicada", "Cerimonialista, maître e equipe de operação acompanham vocês do tour ao último brinde."],
                ["Decoração inclusa", "Mobiliário, iluminação cênica e flores básicas já no pacote — mais beleza, menos preocupação."],
                ["Estacionamento e segurança", "Valet, vigilância 24h e fácil acesso para fornecedores."],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-1 h-2 w-2 flex-none rounded-full bg-gold" />
                  <div>
                    <h3 className="font-serif text-lg text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
          <h2 className="font-serif text-3xl sm:text-4xl">Vamos planejar o seu grande dia?</h2>
          <p className="mt-4 text-primary-foreground/80">
            Conte com a Villa Bellatrix desde a primeira ideia até o último brinde. Comece pelo formulário acima e receba sua planilha agora.
          </p>
          <a
            href="#formulario"
            className="mt-8 inline-block rounded-full bg-gold px-8 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:brightness-95"
          >
            Quero baixar a planilha
          </a>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <span className="font-serif text-base text-primary">Villa Bellatrix</span>
          <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
        </div>
      </footer>
    </main>
  );
}

const inputCls =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-serif text-2xl text-primary-foreground">{value}</div>
      <div className="text-xs uppercase tracking-[0.14em] text-primary-foreground/70">{label}</div>
    </div>
  );
}
