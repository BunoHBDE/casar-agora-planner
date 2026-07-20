import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ClipboardList, Palette, Users, Clock } from "lucide-react";
import heroAsset from "@/assets/hero-venue.jpg.asset.json";

export const Route = createLazyFileRoute("/lp2")({
  component: Landing,
});

const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwyBLQ-qOJptRYAFhJZQOweCFh1PyYjuxerbkxUnnSKVxTc__YTduQB1H2bwymNjRdZ/exec";
const RECAPTCHA_SITE_KEY = "6Ldrdz4tAAAAAFgIT_nPjD4mSBkNeGYxZY2Fe35B";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
    fbq?: (...args: any[]) => void;
  }
}

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const ANOS = Array.from({ length: 6 }, (_, i) => String(2026 + i));
const ORCAMENTOS = ["Até R$ 30 mil","R$ 30 mil – R$ 60 mil","R$ 60 mil – R$ 100 mil","R$ 100 mil – R$ 200 mil","Acima de R$ 200 mil"];

const RECURSOS = [
  {
    Icon: ClipboardList,
    titulo: "Informações e fornecedores",
    desc: "Nomes, horários e todos os fornecedores — buffet, foto, DJ, bolo — reunidos em um lugar só.",
  },
  {
    Icon: Palette,
    titulo: "Decoração por ambiente",
    desc: "Cores, estilo e links de inspiração organizados por área: cerimônia, mesas e bolo.",
  },
  {
    Icon: Users,
    titulo: "Lista de convidados",
    desc: "Controle os convites, as confirmações e as prioridades de cada convidado sem bagunça.",
  },
  {
    Icon: Clock,
    titulo: "Resumo automático",
    desc: "A planilha soma sozinha os convidados, os confirmados e a lista de espera enquanto você preenche.",
  },
];

const DESTAQUES = [
  {
    titulo: "Tudo em um lugar só",
    desc: "Sem caçar contatos e horários em prints, conversas e papéis soltos.",
  },
  {
    titulo: "Convidados sob controle",
    desc: "Quem confirmou, quem falta e a lista de espera, sempre atualizados.",
  },
  {
    titulo: "Feita para ser simples",
    desc: "É só preencher. Os resumos se organizam sozinhos, sem fórmula complicada.",
  },
];

const PLANILHA_PREVIEW_LINHAS = ["Cerimônia", "Mesa dos Convidados", "Mesa do Bolo", "Outras Áreas"];

function Landing() {
  const [celular, setCelular] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const tokenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SCRIPT_ID = "recaptcha-v3-script";
    if (document.getElementById(SCRIPT_ID)) return;
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  const maskCelular = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    try {
      try {
        if (window.grecaptcha?.execute) {
          const tokenPromise = new Promise<string>((resolve, reject) => {
            window.grecaptcha!.ready(() => {
              window
                .grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: "submit" })
                .then(resolve)
                .catch(reject);
            });
          });
          const timeout = new Promise<string>((_, reject) =>
            window.setTimeout(() => reject(new Error("recaptcha timeout")), 3000)
          );
          const token = await Promise.race([tokenPromise, timeout]);
          if (tokenInputRef.current) tokenInputRef.current.value = token;
        }
      } catch (err) {
        console.warn("reCAPTCHA execute falhou, seguindo sem token:", err);
      }
      // content_name diferencia este Lead (variante lp2 do teste A/B) do Lead
      // da landing page original (/lp) nas Conversões Personalizadas do Meta.
      if (typeof window.fbq !== "undefined") {
        window.fbq("track", "Lead", { content_name: "formulario_planilha_v2" });
      }
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ event: "lead_form_planilha_v2_submit" });
      }
      form.submit();
    } finally {
      window.setTimeout(() => {
        window.location.href = "/download";
      }, 1200);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src={heroAsset.url}
            alt=""
            width={1600}
            height={1200}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full scale-110 object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-primary/45" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        </div>
        <div className="mx-auto max-w-2xl px-6 pt-20 pb-28 text-center text-primary-foreground sm:pt-28 sm:pb-36" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}>
          <span className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/80">
            SÍTIO CANTO DA MATA
          </span>
          <h1 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">
            Planeje o seu casamento com tranquilidade.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-primary-foreground/90 sm:text-base">
            A planilha completa que organiza fornecedores, decoração e convidados — com a leveza que esse momento merece.
          </p>
          <div className="mt-8">
            <a
              href="#form"
              className="inline-block rounded-full bg-primary-foreground px-8 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-primary-foreground/90"
            >
              Quero a planilha
            </a>
            <p className="mt-3 text-xs text-primary-foreground/75">
              Gratuita · leva menos de 1 minuto
            </p>
          </div>
        </div>
      </section>

      {/* O que tem dentro */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            O que tem dentro
          </span>
          <h2 className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
            Tudo o que você precisa, em um só lugar
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-stretch">
          <div className="grid gap-4 sm:grid-cols-2">
            {RECURSOS.map(({ Icon, titulo, desc }) => (
              <article key={titulo} className="rounded-2xl border border-border/60 bg-card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/60 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-3 font-serif text-base text-primary">{titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">{desc}</p>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
            <p className="text-xs italic text-muted-foreground">
              ✨ Este espaço é para sonhar com cores, flores e significados.
            </p>
            <div className="mt-3 overflow-hidden rounded-lg border border-border/60">
              <table className="w-full text-left text-[11px] sm:text-xs">
                <thead>
                  <tr className="bg-secondary/60 text-foreground/80">
                    <th className="px-2.5 py-2 font-medium">Área</th>
                    <th className="px-2.5 py-2 font-medium">Estilo</th>
                    <th className="px-2.5 py-2 font-medium">Cores</th>
                    <th className="px-2.5 py-2 font-medium">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {PLANILHA_PREVIEW_LINHAS.map((linha, i) => (
                    <tr key={linha} className={i % 2 === 1 ? "bg-muted/30" : undefined}>
                      <td className="px-2.5 py-2 text-foreground/85">{linha}</td>
                      <td className="px-2.5 py-2 text-foreground/40">—</td>
                      <td className="px-2.5 py-2 text-foreground/40">—</td>
                      <td className="px-2.5 py-2 text-foreground/40">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 text-center sm:grid-cols-3 sm:text-left">
          {DESTAQUES.map(({ titulo, desc }) => (
            <div key={titulo}>
              <h3 className="font-serif text-lg text-primary">{titulo}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="form" className="mx-auto max-w-xl px-4 pb-16 sm:px-6 sm:pb-24">
        <form
          ref={formRef}
          action={WEBHOOK_URL}
          method="post"
          target="lead-sink"
          onSubmit={handleSubmit}
          autoComplete="off"
          className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:p-8"
        >
          <input ref={tokenInputRef} type="hidden" name="g-recaptcha-response" />

          <h2 className="font-serif text-xl text-primary sm:text-2xl">Receba a planilha gratuita</h2>
          <p className="mt-1 text-sm text-muted-foreground">Leva menos de 1 minuto.</p>

          <div className="mt-6 grid gap-4">
            <Field label="Nome completo">
              <input required name="nome" autoComplete="name" className={inputCls} placeholder="Seu nome" />
            </Field>
            <Field label="E-mail">
              <input required type="email" inputMode="email" name="email" autoComplete="email" className={inputCls} placeholder="voce@email.com" />
            </Field>
            <Field label="Celular">
              <input
                required
                type="tel"
                inputMode="tel"
                name="celular"
                autoComplete="tel"
                value={celular}
                onChange={(e) => setCelular(maskCelular(e.target.value))}
                className={inputCls}
                placeholder="(11) 99999-9999"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_110px]">
              <Field label="Cidade">
                <input required name="cidade" className={inputCls} placeholder="Cidade" />
              </Field>
              <Field label="Estado">
                <select required name="estado" defaultValue="" className={inputCls}>
                  <option value="">UF</option>
                  {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mês previsto">
                <select required name="mes" defaultValue="" className={inputCls}>
                  <option value="">Selecione…</option>
                  {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Ano previsto">
                <select required name="ano" defaultValue="" className={inputCls}>
                  <option value="">Selecione…</option>
                  {ANOS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Convidados">
                <input
                  required
                  id="numero-convidados"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  aria-autocomplete="none"
                  data-lpignore="true"
                  data-form-type="other"
                  name="convidados"
                  className={inputCls}
                  placeholder="80"
                />
              </Field>
              <Field label="Orçamento">
                <select required name="orcamento" defaultValue="" className={inputCls}>
                  <option value="">Selecione…</option>
                  {ORCAMENTOS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <fieldset className="mt-2">
              <legend className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Em qual fase do planejamento você está?
              </legend>
              <div className="grid gap-2.5">
                <RadioOption value="inicial" label="Estou na fase inicial, apenas pesquisando valores" />
                <RadioOption value="visitas" label="Já comecei as visitas, mas continuo pesquisando os locais" />
                <RadioOption value="ultimas_visitas" label="Estou fazendo as últimas visitas e pronta para fechar" />
                <RadioOption value="contratado" label="Já contratei o espaço, seguindo com o restante da organização" />
              </div>
            </fieldset>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="consentimento_lgpd"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              Concordo em receber conteúdo sobre casamentos e autorizo o uso dos meus dados para contato, conforme a <strong>LGPD</strong>.
            </span>
          </label>

          <p className="mt-4 text-center text-[10px] leading-relaxed text-muted-foreground">
            Protegido por reCAPTCHA · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacidade</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Termos</a>
          </p>

          <button
            type="submit"
            disabled={loading || !consent}
            className="mt-5 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Enviando…" : "Quero a planilha"}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Seus dados são confidenciais. Sem spam.
          </p>
        </form>
        <iframe
          name="lead-sink"
          title="lead-sink"
          hidden
        />
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

function RadioOption({ value, label, name = "fase" }: { value: string; label: string; name?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-input bg-background p-3 transition hover:bg-muted/30 has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary/30">
      <input
        type="radio"
        name={name}
        value={value}
        required
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}
