import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-venue.jpg";

export const Route = createFileRoute("/")({
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
      { property: "og:image", content: heroImg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Landing,
});

type LeadForm = {
  nome: string; email: string; celular: string; cidade: string; estado: string;
  dataPrevista: string; convidados: string; orcamento: string;
};

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
const ORCAMENTOS = ["Até R$ 30 mil","R$ 30 mil – R$ 60 mil","R$ 60 mil – R$ 100 mil","R$ 100 mil – R$ 200 mil","Acima de R$ 200 mil"];

const EMPTY: LeadForm = { nome:"",email:"",celular:"",cidade:"",estado:"",dataPrevista:"",convidados:"",orcamento:"" };

function Landing() {
  const [form, setForm] = useState<LeadForm>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof LeadForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    for (const k of Object.keys(EMPTY) as (keyof LeadForm)[]) {
      if (!form[k].toString().trim()) { setError("Preencha todos os campos."); return; }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Informe um e-mail válido."); return; }
    try {
      const prev = JSON.parse(localStorage.getItem("wedding_leads") || "[]");
      prev.push({ ...form, criadoEm: new Date().toISOString() });
      localStorage.setItem("wedding_leads", JSON.stringify(prev));
    } catch {}
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src={heroImg}
            alt=""
            width={1600}
            height={1200}
            className="h-full w-full scale-110 object-cover blur-md"
          />
          <div className="absolute inset-0 bg-primary/45" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        </div>
        <div className="mx-auto max-w-2xl px-6 pt-20 pb-28 text-center text-primary-foreground sm:pt-28 sm:pb-36">
          <span className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/80">
            SÍTIO CANTO DA MATA
          </span>
          <h1 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">
            Planeje o seu casamento com tranquilidade.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-primary-foreground/90 sm:text-base">
            Preencha o formulário e baixe gratuitamente a nossa planilha completa de organização.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto -mt-20 max-w-xl px-4 pb-16 sm:-mt-24 sm:px-6 sm:pb-24">

        {!submitted ? (
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:p-8"
          >
            <h2 className="font-serif text-xl text-primary sm:text-2xl">Receba a planilha gratuita</h2>
            <p className="mt-1 text-sm text-muted-foreground">Leva menos de 1 minuto.</p>

            <div className="mt-6 grid gap-4">
              <Field label="Nome completo">
                <input required value={form.nome} onChange={update("nome")} className={inputCls} placeholder="Seu nome" />
              </Field>
              <Field label="E-mail">
                <input required type="email" inputMode="email" value={form.email} onChange={update("email")} className={inputCls} placeholder="voce@email.com" />
              </Field>
              <Field label="Celular">
                <input required type="tel" inputMode="tel" value={form.celular} onChange={update("celular")} className={inputCls} placeholder="(11) 99999-9999" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_110px]">
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
              <Field label="Mês ou dia previsto">
                <input required value={form.dataPrevista} onChange={update("dataPrevista")} className={inputCls} placeholder="Ex.: Outubro/2026" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Convidados">
                  <input required type="number" inputMode="numeric" min={1} value={form.convidados} onChange={update("convidados")} className={inputCls} placeholder="150" />
                </Field>
                <Field label="Orçamento">
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
              Quero a planilha
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Seus dados são confidenciais. Sem spam.
            </p>
          </form>
        ) : (
          <div className="rounded-2xl border border-gold/40 bg-card p-6 text-center shadow-soft sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-xl">✓</div>
            <h2 className="mt-4 font-serif text-2xl text-primary">Obrigado, {form.nome.split(" ")[0]}!</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Nosso time entrará em contato. Sua planilha está pronta:
            </p>
            <a
              href="/planilha-organizacao-casamento.xlsx"
              download
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90"
            >
              ↓ Baixar planilha
            </a>
            <button
              onClick={() => { setSubmitted(false); setForm(EMPTY); }}
              className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Enviar outro formulário
            </button>
          </div>
        )}
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-xl px-6 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SÍTIO CANTO DA MATA
        </div>
      </footer>
    </main>
  );
}

const inputCls =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 sm:text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
